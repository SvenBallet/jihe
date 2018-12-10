
module FL {

    /**
     *
     * @Name:  GxnjyHtml5 - GameSocket
     * @Description:  //游戏socket
     * @Create: DerekWu on 2017/7/5 16:18
     * @Version: V1.0
     */
    export class GameSocket {

        //WebSocket 对象
        private _socket: egret.WebSocket;
        //连接服务器的url地址
        private _connectUrl: string;
        //是否给当前socket添加了监听
        private _isListener: boolean = false;
        //是否已经建立连接，收到服务端返回的消息确定建立连接
        private _hasConnect: boolean = false;
        private _connectTimes: number;

        // //操作Id,以及自增
        // private _handleId:number;
        // private _handleAdd:number;
        // //连接的服务器Id
        // private _serverId:number;
        // //公钥 和 私钥
        // private _k1:number;
        // private _k2:number;

        //已经发送的消息列表
        // private _sentMsgList:Array<SendMsgObj> = new Array<SendMsgObj>();
        //最后发送 和 接收消息时间
        private _lastSendTime:number;
        private _lastReceiveTime:number = 0;

        //服务器时间相关
        private _timeDifference:number;
        private _fastTimes:number;

        //是否自动关闭
        private _isAutoClose:boolean = true;
        //发生错误时间
        private _errorTime:number;

        // socket定时器用来不断尝试重连
        private _socketTimer: Game.Timer;

        /** 是否关闭后的第一次链接 */
        private _isAfterCloseFirstConnect: boolean = false;

        public static lastHeartTime:number;
        public static lastTime:number;

        /** 网络延时时间，可以客户端用来显示 */
        public static netDelayTime: number = 0;

        public constructor() {
            // this.reset();
        }

        private reset(pIsDoConnect: boolean = false) {
            if (this._socket) {
                this.close(true);
            }
            this._noNetConnectCount = 0;
            // this._socket = new egret.WebSocket();
            // this._socket.type = egret.WebSocket.TYPE_BINARY;
            this._isListener = false;
            if (this._connectUrl) {
                if (this._socketTimer.running) {
                    this._socketTimer.reset();
                    this._socketTimer.start();
                } else {
                    this._socketTimer.start();
                }
                if (pIsDoConnect) {
                    this.doConnect();
                }
            }
        }

        public removeUrl() {
            this._connectUrl = null;
        }

        private addListeners() {
            // console.log("addListeners--");
            //添加收到数据侦听，收到数据会调用此方法
            this._socket.addEventListener(egret.ProgressEvent.SOCKET_DATA, this.onReceiveMsg, this);
            //添加链接打开侦听，连接成功会调用此方法
            this._socket.addEventListener(egret.Event.CONNECT, this.onSocketOpen, this);
            //添加链接关闭侦听，手动关闭或者服务器关闭连接会调用此方法
            this._socket.addEventListener(egret.Event.CLOSE, this.onSocketClose, this);
            //添加异常侦听，出现异常会调用此方法
            this._socket.addEventListener(egret.IOErrorEvent.IO_ERROR, this.onSocketError, this);
        }

        private removeListeners() {
            this._socket.removeEventListener(egret.ProgressEvent.SOCKET_DATA, this.onReceiveMsg, this);
            this._socket.removeEventListener(egret.Event.CONNECT, this.onSocketOpen, this);
            this._socket.removeEventListener(egret.Event.CLOSE, this.onSocketClose, this);
            this._socket.removeEventListener(egret.IOErrorEvent.IO_ERROR, this.onSocketError, this);
        }

        /*****************************************************************************
         * Socket
         ****************************************************************************/
        /**
         * 手动关闭 socket，手动关闭的不需要重连
         */
        public close(pIsAuto:boolean = false) {
            if (pIsAuto) {
                this._isAutoClose = true;
            } else {
                this._isAutoClose = false;
            }
            if (this._isListener) {
                this.removeListeners();
                this._socket.close();
                this._isListener = false;
            }
            this._hasConnect = false;
            // egret.log("# close");
        }

        public connect(pConnectUrl: string) {
            this._connectUrl = pConnectUrl;
            this._noNetConnectCount = 0;
            this._isAutoClose = true; 
            if (!this._socketTimer) { 
                //添加定时任务,300毫秒任务一次
                let timer: Game.Timer = new Game.Timer(300);
                timer.addEventListener(egret.TimerEvent.TIMER, this.doConnect, this);
                timer.start();
                this._socketTimer = timer;
            }
            this.reset(true);
        }

        /** 是否再连接中 */
        private _isConnecting: boolean = false;
        /** 没有网络的情况下连接次数 */
        private _noNetConnectCount: number = 0;

        public doConnect() {
            // egret.log("# doConnect ------");
            let self = this;

            // if (self._isAfterCloseFirstConnect) {
            //     self._isAfterCloseFirstConnect = false;
            //     return;
            // }

            if (!self._socketTimer.running) {
                self._socketTimer.start();
            }

            if (GlobalData.isIntoBack) {
                // 增加判断
                return;
            }

            // 当前时间
            let currTimes: number = new Date().getTime();

            if (!self._hasConnect && self._isAutoClose && !self._isConnecting) {
                // if (this._socket) {
                //     // 判断当前网络状态
                //     console.error("# SOCKET CONNECTED 22 = " + this._socket.connected);
                // }
                // egret.log("## doConnect = " + this._connectUrl);
                // 去掉 这个鬼 XXX 。。。
                // CommonHandler.addNetConnectMask();
                if (CommonData.netSatate === 0) {
                    // egret.log("## doConnect = " + this._connectUrl);
                    self._noNetConnectCount++;
                    if (self._noNetConnectCount == 7) {
                        // // 2秒钟增加蜻蜓飞飞飞 （还是保留，增强体验）
                        // egret.log("# 2秒钟增加蜻蜓飞飞飞 ");
                        ReqLoadingViewUtil.delReqLoadingView(); // 先删除
                        let vReqLoadingView: ReqLoadingView = ReqLoadingView.getInstance();
                        vReqLoadingView.genNewViewId();
                        vReqLoadingView.resetLaterTimesAndText(0, "");
                        MvcUtil.addView(vReqLoadingView);
                    }
                    else if (self._noNetConnectCount >= 14) {
                        // 4秒钟弹框
                        self._noNetConnectCount = 0;
                        self._socketTimer.reset(); // 定时器重置停止
                        MvcUtil.send(AppModule.APP_SOCKET_CLOSED, self._isAutoClose);
                    }
                } else {
                    // socket关闭时间

                    egret.log("# connectUrl = " + self._connectUrl);
                    console.log("# 尝试建立连接：" + self._connectUrl);
                    self._noNetConnectCount = 0;
                    self._isConnecting = true;
                    self._socketTimer.reset();
                    self._socketTimer.start();

                    // 每次重连都新建
                    this._socket = null;
                    this._socket = new egret.WebSocket();
                    this._socket.type = egret.WebSocket.TYPE_BINARY;

                    if (!self._isListener) {
                        // 监听到链接前增加
                        self.addListeners();
                        self._isListener = true;
                    }
                    //连接服务器
                    this._socket.connectByUrl(self._connectUrl);
                    this._connectTimes = new Date().getTime(); //设置连接时间
                }
            } else if (self._isConnecting && !self._hasConnect && self._isAutoClose) {
                if (self.connectId > 1 && self._socketTimer.currentCount === 10) {
                    // 非第一次連接，並且3秒钟增加蜻蜓飞飞飞
                    // egret.log("# 非第一次連接，並且3秒钟增加蜻蜓飞飞飞 ");
                    ReqLoadingViewUtil.delReqLoadingView(); // 先删除
                    let vReqLoadingView: ReqLoadingView = ReqLoadingView.getInstance();
                    vReqLoadingView.genNewViewId();
                    vReqLoadingView.resetLaterTimesAndText(0, "");
                    MvcUtil.addView(vReqLoadingView);
                } else if (self._socketTimer.currentCount >= 20) { // 6秒钟
                    self._isConnecting = false;
                    console.error("# 6秒钟之内没有连上，自动重连：" + self._connectUrl);
                    // 重连处理
                    this.breakLineConnectAgain();
                }
            } else if (self._hasConnect && CommonData.netSatate === 0 && self._isAutoClose) {
                // 连接中，没有网络状态
                self._hasConnect = false;
                self._isConnecting = false;
                console.error("# 网络无状态，自动重连：" + self._connectUrl);
                // 重连处理
                this.breakLineConnectAgain();
            } else if (self._hasConnect && self._isAutoClose && CommonData.lastReceivedServerInitiatedHeartbeatTimes + 8000 < currTimes) {
                // 连接中，并且心跳8秒未收到
                self._hasConnect = false;
                self._isConnecting = false;
                console.error("# 8秒钟没有收到心跳，自动重连：" + self._connectUrl);
                // 重连处理
                this.breakLineConnectAgain();
            }
        }

        // private getSocketTimer(): Game.Timer {
        //     if (!this._socketTimer) {
        //         //添加定时任务,500毫秒任务一次
        //         let timer: Game.Timer = new Game.Timer(500);
        //         timer.addEventListener(egret.TimerEvent.TIMER, this.realDoConnect, this);
        //         this._socketTimer = timer;
        //     }
        //     return this._socketTimer;
        // }

        private connectId: number = 1;

        // private realDoConnect(): void {
        //     // egret.log("## realDoConnect start = " + this._connectUrl);
        //     // egret.log("## netSatate = " + CommonData.netSatate);
        //
        //     let socketTimer: Game.Timer = this.getSocketTimer();
        //
        //     if (CommonData.netSatate === 0) {
        //         // egret.log("socketTimer.currentCount = "+ socketTimer.currentCount);
        //         if (!socketTimer.running) {
        //             socketTimer.reset(); // 重设计数器
        //             socketTimer.start();
        //         } else if (socketTimer.currentCount >= 8) {
        //             // 4秒钟网络还没有恢复，则弹窗
        //             // 发送已经关闭指令
        //             MvcUtil.send(AppModule.APP_SOCKET_CLOSED, this._isAutoClose);
        //             socketTimer.stop();
        //         }
        //     } else {
        //         if (socketTimer.running) {
        //             socketTimer.stop();
        //         }
        //         //连接服务器
        //         this._socket.connectByUrl(this._connectUrl);
        //         this._connectTimes = new Date().getTime(); //设置连接时间
        //         this.connectId++;
        //         // egret.log("##################### realDoConnect connectId = " + this.connectId);
        //         // 3秒后没有连上则关闭，需要再次重连
        //         // MyCallBackUtil.delayedCallBack(3000, this.afterInitConnectDelayedCallBack, this, this.connectId);
        //     }
        // }

        /**
         * 是否已经链接到服务器
         * @return {boolean}
         */
        public hasConnect():boolean {
            return this._hasConnect;
        }

        /**
         * 设置服务端的时间偏差
         * @param {number} value
         */
        public setTimeDifference(value:number):void {
            this._timeDifference = value;
        }

        /**
         * 获得服务端的时间
         * @return {number}
         */
        public getServerTime():number {
            return new Date().getTime() + this._timeDifference;
        }

        /** 连接的时候是否属于  当没有建立连接的时候立刻进行连接 */
        // private _isConnectAtOnceWhenNotConnect: boolean = false;
        // private _isWatingConnectAtOnceWhenNotConnect: boolean = false;

        /**
         * 当没有建立连接的时候立刻进行连接
         */
        public connectAtOnceWhenNotConnect(): void {
            // this._isConnectAtOnceWhenNotConnect = true;
            egret.log("## connectAtOnceWhenNotConnect");
            if (!this._socketTimer) {
                return;
            }
            if (this._socketTimer.running) {
                this._socketTimer.reset();
                this._socketTimer.start();
            } else {
                this._socketTimer.start();
            }
            this.tickerSocketTask();
        }

        /**
         * 定时任务(不是定时任务了)
         */
        private tickerSocketTask():void {
            let self = this;
            // let vCurrTimes = new Date().getTime();
            // console.log("tickerSocketTask self._hasConnect="+self._hasConnect);
            // 自动重连
            // if ((!self._hasConnect && self._isAutoClose && this._connectTimes + 3000 < vCurrTimes)) {
            if ((!self._hasConnect && self._isAutoClose)) {
                // if (this._isConnectAtOnceWhenNotConnect) {
                //     this._isWatingConnectAtOnceWhenNotConnect = true;
                // }
                // 重连处理
                this.breakLineConnectAgain();
            } else if (self._hasConnect) {
                if (!this._socketTimer) {
                    return;
                }
                if (this._socketTimer.running) {
                    this._socketTimer.reset();
                    this._socketTimer.start();
                } else {
                    this._socketTimer.start();
                }
            }

            // if (!this._isWatingConnectAtOnceWhenNotConnect) {
            //     this._isConnectAtOnceWhenNotConnect = false;
            // }
        }

        // private afterInitConnectDelayedCallBack(pConnectId: number): void {
        //     // egret.log("################# afterInitConnectDelayedCallBack connectId = " + this.connectId+" pConnectId = "+pConnectId);
        //     if (this.connectId !== pConnectId) {
        //         return;
        //     }
        //     // egret.log("## afterInitConnectDelayedCallBack");
        //     if (!this._hasConnect) {
        //         // egret.log("this._hasConnect="+this._hasConnect);
        //         this.close(true);
        //         // 发送已经关闭指令
        //         MvcUtil.send(AppModule.APP_SOCKET_CLOSED, this._isAutoClose);
        //     }
        // }

        // public closeConnectedWhenHeartBeatError() : void {
        //     // egret.log("## closeConnectedWhenHeartBeatError");
        //     // egret.log("this._hasConnect="+this._hasConnect);
        //     this.close(true);
        //     // 发送已经关闭指令
        //     MvcUtil.send(AppModule.APP_SOCKET_CLOSED, this._isAutoClose);
        // }

        /**
         * 太久没收到心跳
         */
        // private judgeHeartOverTime():boolean {
        //     let time = 6000;
        //     if (GameSocket.lastHeartTime + time < new Date().getTime()) {
        //         PromptUtil.show("网络好像出了点问题，努力重连中...", PromptType.ALERT);
        //         return true;
        //     }
        //     return false;
        // }

        /*****************************************************************************
         *  send socket
         */
        public sendMsg(cmd: number, msgCont: egret.ByteArray) {
            // public sendMsg(cmd: number, msgCont: ByteArray, pMyCallBack?:MyCallBack) {
            let self = this;
            if (!self._hasConnect) {
                console.error("### socket not connected ###");
            }
            //计算操作Id
            // let vNewHandleId:number = self._handleId;
            // if (vNewHandleId) {
            //     self._handleId += self._handleAdd;
            //     if (self._handleId > 30000) {
            //         self._handleId -= 30000;
            //     }
            // } else {
            //     vNewHandleId = -(1+Math.random()*29000);
            // }

            // //组装socket消息
            // let vMsgBuffer: egret.ByteArray = new egret.ByteArray();
            // vMsgBuffer.writeShort(vNewHandleId); //操作Id
            // vMsgBuffer.writeShort(cmd); //指令Id
            // vMsgBuffer.writeShort(self._serverId); //服务器Id
            // if (msgCont && msgCont.length > 0) { //消息内容
            //     //加密内容
            //     let passData:Uint8Array = new Uint8Array(msgCont.buffer);
            //     a.e(passData, 0, passData.length, "bettina1", self._k1, self._k2++);
            //     vMsgBuffer.writeBytes(msgCont);
            // }
            //发送
            self._socket.writeBytes(msgCont);
            self._socket.flush();
            //发送时间
            let vSendTime:number = new Date().getTime();
            // if (vNewHandleId > 0) {
            //     //组装数据放入已经发送列表
            //     let vOneSendMsgObj:SendMsgObj = new SendMsgObj();
            //     vOneSendMsgObj.cmd = cmd, vOneSendMsgObj.msgCont = msgCont, vOneSendMsgObj.handleId = vNewHandleId, vOneSendMsgObj.sendTime = vSendTime, vOneSendMsgObj.myCallBack = pMyCallBack;
            //     self._sentMsgList.push(vOneSendMsgObj);
            // }
            //设置最后发送消息时间
            self._lastSendTime = vSendTime;
        }

        /*****************************************************************************
         *  SocketReceiver
         ****************************************************************************/
        public onSocketClose(e:egret.Event) {
            if (e.target !== this._socket) {
                return;
            }
            // 移除遮罩
            // CommonHandler.delNetConnectMask();

            egret.log("## onSocketClose ##");
            this._isAfterCloseFirstConnect = true;

            this.connectId++;
            // if(!this._hasConnect){
            //     return;
            // }
            this._hasConnect = false;
            this._isConnecting = false;

            this.breakLineConnectAgain();

            // this._isConnectAtOnceWhenNotConnect = false;
            // this._isWatingConnectAtOnceWhenNotConnect = false;
            // if (GConf.Conf.isDev) {
            //     //开发模式重新连接提示
            //     PromptUtil.show("服务器连接断开了...", PromptType.ALERT);
            // }
            // if (this._openCount > 0  && !GlobalData.isIntoBack) {
            //     PromptUtil.show("您的网络出现了问题，连接断开了!", PromptType.ERROR);
            // }
            //自动关闭的需要重连
            // if (this._isAutoClose) {
            //     //1.5秒后重连
            //     FL.MyCallBackUtil.delayedCallBack(1500, this.breakLineConnectAgain, this);
            // }

            // 获取网络状态用于显示
            let netData = {
                "eventType": SendNativeMsgType.SEND_NATIVE_GET_CONNECT_TYPE,
                "data": {
                }
            }
            NativeBridge.getInstance().sendNativeMessage(JSON.stringify(netData));

            // 发送已经关闭指令
            // egret.log("isIntoBack = " + GlobalData.isIntoBack);
            // MvcUtil.send(AppModule.APP_SOCKET_CLOSED, this._isAutoClose);
        }

        /**
         * 断线重连
         */
        private breakLineConnectAgain():void {

            //删除监听
            if (this._isListener) {
                this.removeListeners();
                this._isListener = false;
            }

            // if (this._socket) {
            //     // 判断当前网络状态
            //     console.error("# SOCKET CONNECTED 1 = " + this._socket.connected);
            // }

            //置空
            // this._socket = null;
            // if (GConf.Conf.isDev) {
            //     //开发模式重新连接提示
            //     PromptUtil.show("与服务器重新连接...", PromptType.SUCCESS);
            // }
            // if (this._openCount > 0  && !GlobalData.isIntoBack && !this._isConnectAtOnceWhenNotConnect) {
            //     PromptUtil.show("正在帮您重新建立连接!", PromptType.ALERT);
            // }

            //重置
            this.reset();

            // 获取网络状态用于显示
            let netData = {
                "eventType": SendNativeMsgType.SEND_NATIVE_GET_CONNECT_TYPE,
                "data": {
                }
            }
            NativeBridge.getInstance().sendNativeMessage(JSON.stringify(netData));
        }

        /** 打开socket链接的次数 */
        private _openCount: number = 0;

        public onSocketOpen(e:egret.Event) {
            if (e.target !== this._socket) {
                return;
            }
            // 移除遮罩
            // CommonHandler.delNetConnectMask();

            this._hasConnect = true;
            this._isConnecting = false;
            CommonData.lastReceivedServerInitiatedHeartbeatTimes = new Date().getTime();
            this.connectId++;
            egret.log("## onSocketOpen ##");
            egret.log("## realDoConnect connectId = " + this.connectId);
            // if (this._openCount > 0 && !this._isConnectAtOnceWhenNotConnect && !GlobalData.isIntoBack) {
            //     PromptUtil.show("与服务器连接成功！", PromptType.SUCCESS);
            // }
            if (this._openCount > 0) {
                // PromptUtil.show("与服务器连接成功！", PromptType.SUCCESS);
            }
            // this._isConnectAtOnceWhenNotConnect = false;
            // this._isWatingConnectAtOnceWhenNotConnect = false;
            this._openCount++;
            //发送准备完毕指令
            MvcUtil.send(AppModule.APP_SOCKET_INIT_COMPLETE);

        }

        public onSocketError(e:egret.Event) {
            if (e.target !== this._socket) {
                return;
            }
            egret.log("## onSocketError ##");
            this.connectId++;
            // 移除遮罩
            // CommonHandler.delNetConnectMask();

            // this._hasConnect = false;
            // this._isConnecting = false;
            // this._isConnectAtOnceWhenNotConnect = false;
            // this._isWatingConnectAtOnceWhenNotConnect = false;
            // if (this._openCount > 0) {
            //     PromptUtil.show("您的网络出现了异常情况...", PromptType.ERROR);
            // }
            // 发送发生错误指令
            MvcUtil.send(AppModule.APP_SOCKET_ERROR);
        }

        /**
         * 接收消息
         * @param {egret.Event} e
         */
        public onReceiveMsg(e: egret.Event) {
            let self = this, vNewLastReceiveTime:number = new Date().getTime();
            self._lastReceiveTime = vNewLastReceiveTime; //设置最后接收时间\

            let receiveByteArray: egret.ByteArray = new egret.ByteArray();
            self._socket.readBytes(receiveByteArray); //读取数据
            //处理接收消息
            ServerMsgUtil.exeReceiveMsg(receiveByteArray);



            // let handleId: number = receiveByteArray.readShort();  //服务端返回的操作Id
            // //验证操作Id
            // if (handleId > 0) {
            //     //循环查找，找到对应的指令
            //     let vSentMsgList:Array<SendMsgObj> = self._sentMsgList, vLength = vSentMsgList.length, vTempSendMsgObj:SendMsgObj;
            //     for (let vIndex = 0; vIndex < vLength; ++vIndex) {
            //         vTempSendMsgObj = vSentMsgList[vIndex];
            //         if (vTempSendMsgObj.handleId === handleId) {
            //             vOneSendMsgObj = vTempSendMsgObj;
            //             vSentMsgList.splice(vIndex, 1);
            //             break;
            //         }
            //     }
            //     if (vOneSendMsgObj == null) {
            //         egret.error("### socket handleId error ###");
            //     }
            // }
            // let cmdTemp: number = receiveByteArray.readShort();
            // let cmd:number = cmdTemp >> 1; //指令号
            // let isSucc:boolean = (cmdTemp & 1) > 0; //是否成功
            //
            // egret.log("## receive cmd=%d isSucc=%s", cmd, isSucc);

            // if (cmd === CommonSCmd.CMD0001) { //建立连接后服务器返回的消息，发起socket初始化完毕指令 l_socket_init_complete
            //     // if (self._hasConnect) {
            //     //     return;
            //     // }
            //     // self._hasConnect = true; //设置连接上了
            //     self._serverId = receiveByteArray.readByte(); //设置serverId
            //     self._handleId = receiveByteArray.readShort(); //设置handleId
            //     self._handleAdd = receiveByteArray.readByte(); //设置handleAdd
            //     self._k1 = receiveByteArray.readShort();  //设置私钥
            //     self._k2 = receiveByteArray.readShort();  //设置私钥自增
            //     //服务器返回的服务器时间
            //     let vTimeStart:number = receiveByteArray.readInt();
            //     let vTimeEnd:number = receiveByteArray.readShort();
            //     let vServerTime:number = vTimeStart*10000+vTimeEnd;
            //     //设置对时使用最快的时间 和 客户端和服务器的时差
            //     self._fastTimes = vNewLastReceiveTime - self._connectTimes;
            //     self._timeDifference = vServerTime - self._connectTimes - self._fastTimes/2;
            //
            //     //打印连接成功
            //     egret.log("## webSocket init ok..");
            //
            //     //添加定时任务,3秒钟任务一次
            //     let timer: Game.Timer = new Game.Timer(3000);
            //     timer.addEventListener(egret.TimerEvent.TIMER, this.tickerSocketTask, this);
            //     timer.start();
            //     //设置自动关闭为true
            //     self._isAutoClose = true;
            //
            //     //发送socket初始化完毕的指令
            //     MvcUtil.send(AppModule.APP_SOCKET_INIT_COMPLETE);
            // } else if (cmd === CommonSCmd.CMD0002) { //对时指令
            //     //服务器返回的服务器时间
            //     let vTimeStart:number = receiveByteArray.readInt();
            //     let vTimeEnd:number = receiveByteArray.readShort();
            //     let vServerTime:number = vTimeStart*10000+vTimeEnd;
            //     //设置对时使用最快的时间 和 客户端和服务器的时差
            //     let vNewFastTime:number = vNewLastReceiveTime - vOneSendMsgObj.sendTime;
            //     if (vNewFastTime < self._fastTimes) { //用时更短，则设置新的
            //         self._fastTimes = vNewFastTime;
            //         self._timeDifference = vServerTime - vOneSendMsgObj.sendTime - self._fastTimes/2;
            //     }
            // } else {
            //     //错误消息统一给49号指令处理
            //     if (!isSucc) {
            //         cmd = CommonSCmd.CMD0049;
            //     }
            //     //组装消息
            //     let oneReceiveMsgVO:ReceiveMsgVO;
            //     if (receiveByteArray.length === ServerMsgUtil.MSG_PREFIX_L) {
            //         oneReceiveMsgVO = new ReceiveMsgVO(handleId, cmd, isSucc, null);
            //     } else {
            //         oneReceiveMsgVO = new ReceiveMsgVO(handleId, cmd, isSucc, receiveByteArray);
            //     }
            //     //其他指令处理
            //     if (vOneSendMsgObj) {
            //         ServerMsgUtil.exeReceiveMsg(oneReceiveMsgVO, vOneSendMsgObj.myCallBack);
            //     } else {
            //         ServerMsgUtil.exeReceiveMsg(oneReceiveMsgVO);
            //     }
            //
            // }
        }

    }

    /**
     *
     * @Name:  GxnjyHtml5 - SendMsgObj
     * @Description:  //发送消息对象
     * @Create: DerekWu on 2017/7/5 16:18
     * @Version: V1.0
     */
    // export class SendMsgObj {
    //     public cmd:number;
    //     public msgCont:ByteArray;
    //     public handleId:number;
    //     public sendTime:number;
    //     public myCallBack:MyCallBack;
    // }

}