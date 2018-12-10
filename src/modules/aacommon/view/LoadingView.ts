module FL {
    /**
     * 加载界面
     * @Name:  FL - LoadingView
     * @Company 深圳市天天爱科技有限公司 版权所有
     * @Description:
     * 进度条的宽度起始100（百分之0时），610最终长度（百分之100时）
     * 动画组起始x位置90（百分之0时），600最终位置（百分之100时）
     * @Create: DerekWu on 2017/8/12 20:37
     * @Version: V1.0
     */
    export class LoadingView extends  BaseView {
        
        public readonly mediatorName: string = "";
        /** 显示层级 */
        public readonly viewLayer: FL.ViewLayerEnum = ViewLayerEnum.BOTTOM_ONLY;

        //背景图片，在childrenCreated 中删除
        public bgImg:eui.Image;

        /** loading进度条 */
        public progressBarImg:eui.Image;
        /** 动画组 */
        public animationGroup:eui.Group;
        /** 版本号 */
        public versionLabel:eui.Label;

        /** 进度条的宽度 */
        private readonly _progressTotalWidth:number = 610;
        private readonly _pWidthDefault:number = 100; //默认宽度

        /** 加载任务列表 */
        private _taskMap:{[key:string]:LoadingTaskReporter} = {};
        private _taskInfoArray:{name:string, current:number, total:number, isOver:boolean}[] = [];
        /** 所有任务的权重总值 */
        private _totalWeight:number = 0;

        /** 计算出来的当前值和固定的总的值 */
        private _currNum:number = 0; //当前真正进度的值
        private readonly _totalNum:number = this._progressTotalWidth - this._pWidthDefault; //进度条总值，改界面记得改这里
        private readonly _autoNum:number = this._totalNum * 0.92;
        private _progressNum:number = 0; //界面上进度条显示的值

        /** 是否已经完成 */
        private _isOver:boolean = false;

        /** 加载完成后的回调 */
        public overCallBack:MyCallBack;

        constructor() {
            super();
            this.touchEnabled = false;
			this.touchChildren = false;
			this.left = this.right = this.top = this.bottom = 0;
            this.skinName = "skins.LoadingViewSkin";
        }

        protected childrenCreated():void {
            super.childrenCreated();
            let self = this;
            //背景图片删除
            self.removeChild(self.bgImg);
            //设置版本号
            self.versionLabel.text = NativeBridge.version;
            //初始化动画
            dragonBones.addMovieGroup(RES.getRes("jdtsaiz_ske_dbmv"), RES.getRes("jdtsaiz_tex_png"), "FL_Loading_SZ"); // 添加动画数据和贴图
            let vMovie:dragonBones.Movie = dragonBones.buildMovie("armatureName", "FL_Loading_SZ"); // 创建 白鹭极速格式 的动画
            //创建完马上移除
            //移除动画组
            dragonBones.removeMovieGroup("FL_Loading_SZ");
            //添加到动画组
            vMovie.x = self.animationGroup.width/2;
            vMovie.y = self.animationGroup.height/2;
            self.animationGroup.addChild(vMovie);
            vMovie.play("animation", 0);
        }

        /**
         * 添加任务
         * @param pTask
         */
        public addTaskReporter(pTask:LoadingTaskReporter):void {
            let self = this;
            if (!self._taskMap[pTask.name]) {
                self._taskMap[pTask.name] = pTask;
                self._taskInfoArray.push({name:pTask.name, current:0, total:-1, isOver:false});
                pTask.loadingView = self; //赋值
                self._totalWeight += pTask.weight; //累加总权重
            } else {
                egret.error("pTask.name is exists name="+pTask.name);
            }
        }

        /**
         * 获取任务
         * @param pTaskName
         * @return {LoadingTaskReporter}
         */
        public getTaskReporter(pTaskName:string):LoadingTaskReporter {
            return this._taskMap[pTaskName];
        }

        /**
         * 进度
         * @param taskName
         * @param current
         * @param total
         */
        public onProgress(taskName:string, current: number, total: number):void {
            // Log.debug("# taskName=%s, current=%d, total=%d", taskName, current, total);
            let self = this, vTaskInfoArray = self._taskInfoArray, vOneTask:LoadingTaskReporter, vOneTaskInfo:{name:string, current:number, total:number, isOver:boolean},
                vOverTaskNum:number = 0, vTotalRate:number = 0, vIndex = 0, vLength = vTaskInfoArray.length;
            for (; vIndex < vLength; ++vIndex) {
                vOneTaskInfo = vTaskInfoArray[vIndex];
                vOneTask = self._taskMap[vOneTaskInfo.name];
                if (taskName === vOneTaskInfo.name) {
                    vOneTaskInfo.current = current;
                    vOneTaskInfo.total = total;
                    if (vOneTaskInfo.current >= vOneTaskInfo.total && !vOneTaskInfo.isOver) {
                        vOneTaskInfo.isOver = true; //设置为结束了避免重复回调函数
                        if (vOneTask.overCallBack) {
                            //有回调则回调
                            vOneTask.overCallBack.apply();
                        }
                    }
                }
                if (vOneTaskInfo.isOver) {
                    vOverTaskNum++; //完成的数量增加
                }
                //计算并累加总进度的比率
                vTotalRate += (vOneTaskInfo.current/vOneTaskInfo.total) * (vOneTask.weight/self._totalWeight);
            }
            if (vLength === vOverTaskNum) {
                //数量相等则代表完成，设置值
                self._currNum = self._totalNum;
            } else {
                //不相等则表示
                self._currNum = self._totalNum * vTotalRate;
            }
        }

        /** 添加到界面以后框架自动调用 */
        protected onAddView():void {
            //设置当前loading 设置唯一的loading界面
            // LoadingCmd.loadingView = this;
            CommonHandler.setLoadingView(this);
            Game.GameDrive.getInstance().addEventListener(Game.GameEvent.AI_LOGIC, this.exeViewProgress, this);
        }

        /** 从界面上移除以后框架自动调用 */
        protected onRemView():void {
            //设置为空
            // LoadingCmd.loadingView = null;
            CommonHandler.setLoadingView(null);
            if (Game.GameDrive.getInstance().hasEventListener(Game.GameEvent.AI_LOGIC)) {
                Game.GameDrive.getInstance().removeEventListener(Game.GameEvent.AI_LOGIC, this.exeViewProgress, this);
            }
            //停止动画
            // this._qbMC.stop();

            // egret.log("# onRemView...");
        }

        /** 开始的速度，结束的速度 */
        private readonly _startSpeed:number= 10;
        private readonly _endSpeed:number = 1;

        /**
         * 处理显示的进度条
         */
        private exeViewProgress() {
            // Log.debug("# exeViewProgress...");
            let self = this;
            // if (!self._taskMap) {
            //     return;
            // }
            if (self._isOver) {
                //处理结束
                this.exeOver();
                return;
            } else if (self._currNum >= self._totalNum) {
                self._isOver = true;
                self._progressNum = self._currNum;
            } else {
                if (self._progressNum < self._autoNum) { //范围之内才能自增
                    //当前进度条的比率
                    let vCurrProgressRate:number = self._progressNum / self._totalNum;
                    let vCurrSpeed:number = self._startSpeed - (self._startSpeed - self._endSpeed) * self.quadOut(vCurrProgressRate);
                    self._progressNum += vCurrSpeed;
                }
                if (self._currNum > self._progressNum) {
                    self._progressNum = self._currNum;
                } else if (self._progressNum > self._totalNum) {
                    self._progressNum = self._totalNum;
                }
            }
            self.progressView();
        }

        /**
         * 算法
         * @param t
         * @return {number}
         */
        private quadOut (t: number) {
            return 1 - Math.pow(1 - t, 2);
        }

        /**
         * 显示进度条
         */
        private progressView():void {
            // let ratio:number = Math.floor(this._progressNum*100/this._totalNum);
            let self = this;
            self.progressBarImg.width = self._pWidthDefault + self._progressNum;
            self.animationGroup.x = self._pWidthDefault + self._progressNum - 10;
        }

        /**
         * 处理结束
         */
        private exeOver():void {
            //结束了就马上删除监听
            Game.GameDrive.getInstance().removeEventListener(Game.GameEvent.AI_LOGIC, this.exeViewProgress, this);
            //解除关系
            let self = this, vTaskInfoArray = self._taskInfoArray, vOneTask:LoadingTaskReporter, vOneTaskInfo:{name:string, current:number, total:number},
                vIndex = 0, vLength = vTaskInfoArray.length;
            for (; vIndex < vLength; ++vIndex) {
                vOneTaskInfo = vTaskInfoArray[vIndex];
                vOneTask = self._taskMap[vOneTaskInfo.name];
                vOneTask.loadingView = null;
            }
            self._taskMap = null;
            // self._qbMC.stop();
            //执行回调函数
            self.overCallBack.apply();
            //移除LoadingView,放到下一帧处理，给场景预留出来加载时间
            // RFlame3D.AsyncQueue.addToQueue(MvcUtil.delView, MvcUtil, self);
            // MvcUtil.send(AppModule.APP_DEL_VIEW, self);
            // MvcUtil.delView(self);
        }

    }

    /**
     * Loading
     */
    export class LoadingTaskReporter implements RES.PromiseTaskReporter {
        /** 名字 */
        public readonly name:string;
        /** 加载权重，默认100 */
        public readonly weight:number;
        /** 加载界面 */
        public loadingView:LoadingView;
        /** task 结束后调用的 callBack*/
        public readonly overCallBack:MyCallBack;
        constructor(name:string, weight:number, overCallBack?:MyCallBack) {
            this.name = name;
            this.weight = weight;
            if (overCallBack) this.overCallBack = overCallBack;
        }

        /**
         * 进度回调
         */
        public onProgress(current: number, total: number):void {
            this.loadingView.onProgress(this.name, current, total);
        }

        /**
         * 取消回调
         */
        // public onCancel():void {
        //
        // }
    }

}