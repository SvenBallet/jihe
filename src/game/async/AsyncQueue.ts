module Game {

    export enum ProcessType {
        UpLoad,
        Parse,
        ParseAndUpLoad,
        Terrain,
        CallBackAction
    }

    /**
     * 
     * @Name:  Game - AsyncQueue
     * @Description:  //异步处理队列,
     * 作用一：让密集的计算、资源的解析和上传，进行分帧处理，不影响帧率
     * 作用二：也是最重要的作用，让解析资源和上传资源在游戏逻辑之内进行，减少游戏逻辑之外的时间，为gpu的渲染争取更多的时间
     * @Create: DerekWu on 2017/3/23 20:43
     * @Version: V1.0
     */
    export class AsyncQueue {


        /** 一帧之内处理最大时间（单位：毫秒） */
        private static oneFrameMaxTimes = 20;

        /**
         * 设置 一帧之内处理最大时间（单位：毫秒）
         * @param value 
         */
        public static setOneFrameMaxTimes(value:number): void {
            this.oneFrameMaxTimes = value;
        }

        /** 是否显示loadingUI，默认显示，为了大部分情况下正常，如果真要使用这个功能，则自己手动设置起来 */
        private static isViewLoadingUI:boolean = true;

        public static setIsViewLoadingUI(pIsViewLoadingUI:boolean):void {
            this.isViewLoadingUI = pIsViewLoadingUI;
        }

        /**
         *  耗时的名字Map
         *  耗时的名字对应的动作，一次只处理一个
         * 如果是资源：
         * 只有显示了loadingUI才处理的资源，一般是比较大的资源，在解析或者上传的时候会造成卡顿，
         * 而且大型资源，一次只处理一个
         *  注意：TerrainImage 默认就是大型资源，其他的根据名字判断，这个通过配置进行配置
         */
        private static moreTimesNameMap:{[name:string]:any} = {"Game_MoreTimesAction":1};

        /**
         * 设置耗时的名字
         * @param pName
         */
        public static setMoreTimesName(pName:string) :void {
            this.moreTimesNameMap[pName] = 1;
        }

        /** 等待处理队列 */
        private static waitingQueue:LinkedList = new LinkedList();

        /** 是否正在处理中 */
        private static isProcessing:boolean = false;

        /** 临时等待处理队列，如果是正在处理中加入进来的放到这个队列，处理结束的时候将这个队列的数据移动到 waitingQueue */
        private static tempWaitingQueue:LinkedList = new LinkedList();

        /**
         * 进度队列
         * @type {Array}
         */
        private static onProgressList:Array<{current: number, total: number, progressCallBack:RES.PromiseTaskReporter}> = [];

        /**
         * 添加到队列，系统内部使用
         * @param name
         * @param processType
         * @param callBack
         * @param progressCallBack
         * @param thisObject
         * @param args
         */
        public static $addToQueue(name:string, processType:ProcessType, callBack:Function, progressCallBack:RES.PromiseTaskReporter, thisObject:any, ...args):void {
            // console.log("$addToQueue name="+name);
            let self = this;
            let onProgressObj:{current: number, total: number, progressCallBack:RES.PromiseTaskReporter} = null;
            if (progressCallBack) {
                //有进度callBack则添加到进度队列
                let vTotal:number = self.waitingQueue.getSize() + self.bigResWaitingQueue.getSize();
                // console.log("progressCallBack vTotal="+vTotal);
                // let vTotal:number = self.waitingQueue.getSize();
                if (vTotal === 0) { //直接回调
                    progressCallBack.onProgress(1, 1);
                } else {
                    onProgressObj = {current: 0, total: vTotal, progressCallBack:progressCallBack};
                    self.onProgressList.push(onProgressObj);
                }
            }
            //正在处理放入临时队列，否则放入正式队列
            if (self.isProcessing) {
                self.tempWaitingQueue.addLast({name:name, processType:processType, callBack:callBack, onProgressObj:onProgressObj, thisObject:thisObject, args:args});
            } else {
                self.waitingQueue.addLast({name:name, processType:processType, callBack:callBack, onProgressObj:onProgressObj, thisObject:thisObject, args:args});
            }
        }

        public static addToQueue(callBack:Function, thisObject:any, ...args):void {
            this.$addToQueue("Game_Normal", ProcessType.CallBackAction, callBack, null, thisObject, args);
        }

        public static addToQueueWithProgress(callBack:Function, progressCallBack:RES.PromiseTaskReporter, thisObject:any, ...args):void {
            this.$addToQueue("Game_Normal", ProcessType.CallBackAction, callBack, progressCallBack, thisObject, args);
        }

        public static addMoreTimesActionToQueue(callBack:Function, thisObject:any, ...args):void {
            this.$addToQueue("Game_MoreTimesAction", ProcessType.CallBackAction, callBack, null, thisObject, args);
        }

        public static addMoreTimesActionToQueueWithProgress(callBack:Function, progressCallBack:RES.PromiseTaskReporter, thisObject:any, ...args):void {
            this.$addToQueue("Game_MoreTimesAction", ProcessType.CallBackAction, callBack, progressCallBack, thisObject, args);
        }

        /** 大型资源等待处理队列，有可能会跟随一些action */
        private static bigResWaitingQueue:LinkedList = new LinkedList();

        /**
         * 进度队列
         * @type {Array}
         */
        private static bigResOnProgressList:Array<{current: number, total: number, progressCallBack:RES.PromiseTaskReporter}> = [];

        /**
         * 处理资源等待队列，有时间限制，不能处理太长时间，否则会造成卡顿
         * @returns {number} 返回处理数量
         */
        public static $process():number {
            let self = this;
            //标记为正在处理中
            self.isProcessing = true;
            //等到队列
            let vWaitingQueue = self.waitingQueue;
            //大型资源等待队列
            let vBigResWaitingQueue = self.bigResWaitingQueue;
            //上传gpu数量
            let vUpLoadGpuNum:number = 0;
            //处理耗时动作数量
            let vMoreTimesNum:number = 0;
            //时间标记
            let vTimeStamp:number = egret.getTimer();
            //处理标记
            let vProcessFlag:boolean;
            //跳出标记
            let vBreakFlag:boolean;
            if (vBigResWaitingQueue.getSize() > 0 && self.isViewLoadingUI) {
                //假如大型资源等待队列有数据，并且已经显示了loadingUI，则优先处理这里
                let vCurrProcessObj:{name:string, processType:ProcessType, callBack:Function, onProgressObj:{current: number, total: number, progressCallBack:RES.PromiseTaskReporter}, thisObject:any, args:any} = vBigResWaitingQueue.pollFirst();
                while (vCurrProcessObj) {
                    vProcessFlag = false, vBreakFlag = false;
                    if (vCurrProcessObj.processType === ProcessType.CallBackAction) {
                        if (self.moreTimesNameMap[vCurrProcessObj.name]) {
                            if (vUpLoadGpuNum === 0 && vMoreTimesNum === 0) {
                                vProcessFlag = true, vMoreTimesNum++;
                            } else {
                                vBreakFlag = true;
                            }
                        } else {
                            vProcessFlag = true;
                        }
                    } else {
                        if (vUpLoadGpuNum === 0 && vMoreTimesNum === 0) {
                            vProcessFlag = true;
                            if (vCurrProcessObj.processType === ProcessType.Parse) {
                                vMoreTimesNum++;
                            } else {
                                vUpLoadGpuNum++;
                            }
                        } else {
                            vBreakFlag = true;
                        }
                    }
                    //处理标记
                    if (vProcessFlag) {
                        // console.log("FRAME_ID = "+FRAME_INFO.FRAME_ID+"  exe big name ="+vCurrProcessObj.name);
                        vCurrProcessObj.callBack.apply(vCurrProcessObj.thisObject, vCurrProcessObj.args);
                        //vCurrProcessObj.onProgressObj = null; //不管如何，清空
                        self.progressOnProgressList(self.bigResOnProgressList);
                        self.progressOnProgressList(self.onProgressList);
                    } else if (vBreakFlag) { //跳出标记
                        //跳出塞回头部
                        vBigResWaitingQueue.addFirst(vCurrProcessObj);
                        break;
                    }

                    //处理超时则跳出，其他的留到下一帧再来处理
                    if ((egret.getTimer() - vTimeStamp) >= self.oneFrameMaxTimes) {
                        break;
                    } else {
                        vCurrProcessObj = vWaitingQueue.pollFirst();
                    }
                }
            } else if (vWaitingQueue.getSize() > 0) {
                let vCurrProcessObj:{name:string, processType:ProcessType, callBack:Function, onProgressObj:{current: number, total: number, progressCallBack:RES.PromiseTaskReporter}, thisObject:any, args:any} = vWaitingQueue.pollFirst();
                while (vCurrProcessObj) {
                    vProcessFlag = false, vBreakFlag = false;
                    if (vCurrProcessObj.processType === ProcessType.Terrain) {
                        if (!self.isViewLoadingUI) {
                            self.moveToBigResWaitingQueue(vCurrProcessObj);
                        } else if (vUpLoadGpuNum === 0 && vMoreTimesNum === 0) {
                            vProcessFlag = true, vUpLoadGpuNum++;
                        } else {
                            vBreakFlag = true;
                        }
                    } else if (vCurrProcessObj.processType === ProcessType.CallBackAction) {
                        let vOnProgressObj = vCurrProcessObj.onProgressObj;
                        if (vOnProgressObj && self.onProgressList.indexOf(vOnProgressObj) != -1) {
                            self.moveToBigResWaitingQueue(vCurrProcessObj);
                        } else if (self.moreTimesNameMap[vCurrProcessObj.name]) {
                            if (vUpLoadGpuNum === 0 && vMoreTimesNum === 0) {
                                vProcessFlag = true, vMoreTimesNum++;
                            } else {
                                vBreakFlag = true;
                            }
                        } else {
                            vProcessFlag = true;
                        }
                    } else {
                        if (self.moreTimesNameMap[vCurrProcessObj.name]) {
                            if (!self.isViewLoadingUI) {
                                self.moveToBigResWaitingQueue(vCurrProcessObj);
                            } else if (vUpLoadGpuNum === 0 && vMoreTimesNum === 0) {
                                vProcessFlag = true;
                                if (vCurrProcessObj.processType === ProcessType.Parse) {
                                    vMoreTimesNum++;
                                } else {
                                    vUpLoadGpuNum++;
                                }
                            } else {
                                vBreakFlag = true;
                            }
                        } else {
                            vProcessFlag = true;
                            if (vCurrProcessObj.processType !== ProcessType.Parse) {
                                vUpLoadGpuNum++;
                            }
                        }
                    }

                    //处理标记
                    if (vProcessFlag) {
                        // console.log("FRAME_ID = "+FRAME_INFO.FRAME_ID+"  exe name ="+vCurrProcessObj.name);
                        vCurrProcessObj.callBack.apply(vCurrProcessObj.thisObject, vCurrProcessObj.args);
                        vCurrProcessObj.onProgressObj = null; //不管如何，清空
                        self.progressOnProgressList(self.onProgressList);
                    } else if (vBreakFlag) { //跳出标记
                        //跳出塞回头部
                        vBigResWaitingQueue.addFirst(vCurrProcessObj);
                        break;
                    }

                    //处理超时则跳出，其他的留到下一帧再来处理
                    if ((egret.getTimer() - vTimeStamp) >= self.oneFrameMaxTimes) {
                        break;
                    } else {
                        vCurrProcessObj = vWaitingQueue.pollFirst();
                    }
                }
            }

            //如果临时队列有数据，则放入正式队列
            while (self.tempWaitingQueue.getSize() > 0) {
                self.waitingQueue.addLast(self.tempWaitingQueue.pollFirst());
            }

            //处理结束，标记为不在处理中
            self.isProcessing = false;
            return vUpLoadGpuNum;
        }

        /**
         * 步进，进程队列
         * @param pOnProgressList
         */
        private static progressOnProgressList(pOnProgressList:Array<{current: number, total: number, progressCallBack:RES.PromiseTaskReporter}>):void {
            let vLength:number = pOnProgressList.length;
            if (vLength > 0) {
                for (let i=0; i<vLength; ++i) {
                    let vOnProgressObj = pOnProgressList[i];
                    vOnProgressObj.current++;
                    //进程回调
                    vOnProgressObj.progressCallBack.onProgress(vOnProgressObj.current, vOnProgressObj.total);
                    if (vOnProgressObj.current === vOnProgressObj.total) {
                        pOnProgressList.splice(i); //达到最大值则删除
                        vLength--, i--;
                    }
                }
            }
        }

        /**
         * 移动到大型资源等待列表
         * @param pCurrProcessObj
         */
        private static moveToBigResWaitingQueue(pCurrProcessObj:{name:string, processType:ProcessType, callBack:Function, onProgressObj:{current: number, total: number, progressCallBack:RES.PromiseTaskReporter}, thisObject:any, args:any}):void {
            let self = this;
            self.bigResWaitingQueue.addLast(pCurrProcessObj);
            if (pCurrProcessObj.onProgressObj) {
                let vTempIndex:number = self.onProgressList.indexOf(pCurrProcessObj.onProgressObj);
                if (vTempIndex != -1) {
                    self.onProgressList.splice(vTempIndex, 1);
                    self.bigResOnProgressList.push(pCurrProcessObj.onProgressObj);
                }
                pCurrProcessObj.onProgressObj = null; //清空解除引用
            }
        }

    }


}