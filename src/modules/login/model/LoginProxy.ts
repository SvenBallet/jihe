module FL {

	/**
	 * 登录代理
	 */
	export class LoginProxy extends puremvc.Proxy {

        /** 代理名 */
        public static readonly NAME:string = "LoginProxy";
        /** 单例 */
        private static _only:LoginProxy;

        private constructor() {
            super(LoginProxy.NAME);
        }

        public static getInstance():LoginProxy {
            if (!this._only) {
                this._only = new LoginProxy();
            }
            return this._only;
        }

        /** 登录返回消息对象 */
        private static _loginMsgAck:BindAttr<LoginMsgAck> = new BindAttr<LoginMsgAck>(null, true);
        /** 只暴露绑定Id，注意第一次绑定会回调一下，因为默认是null，注意判断null的情况 */
        public static loginMsgAckBindId():number {return this._loginMsgAck.attrId;}

        /**
         * 处理登录返回，有大量数据在里面，需要分模块自己存储
         * @param {FL.LoginMsgAck} msg
         */
        public exeLoginMsgAck(msg:LoginMsgAck):void {
            let self = this;
            // 更新绑定信息，把数据推向所有绑定的对象，每个模块自己存自己的数据
            LoginProxy._loginMsgAck.setValue(msg);
            // 已经分发给各个模块之后置空
            LoginProxy._loginMsgAck.setValueNotUpdateBinder(null);

            // 设置没有进入游戏
            CommonHandler.setIsIntoGame(false);

            // 初始化微信分享
            FL.WeChatJsSdkHandler.init();

            // 直接进入大厅
            // this.delayedIntoLobby();

            // 如果是进入房间
            if (GUrlParam.UrlParam.roomId) {
                // 发送进入VIP房间指令
                // let vEnterVipRoomMsg:EnterVipRoomMsg = new EnterVipRoomMsg();
                // vEnterVipRoomMsg.tableID = "enter_room";
                // vEnterVipRoomMsg.roomID = GUrlParam.UrlParam.roomId;
                // ServerUtil.sendMsg(vEnterVipRoomMsg, MsgCmdConstant.MSG_GAME_START_GAME_REQUEST_ACK);

                // 改为新的
                let vNewJoinVipRoomMsg: NewJoinVipRoomMsg = new NewJoinVipRoomMsg();
                vNewJoinVipRoomMsg.vipRoomID = GUrlParam.UrlParam.roomId;
                ServerUtil.sendMsg(vNewJoinVipRoomMsg, MsgCmdConstant.MSG_INTO_GAME_TABLE);
            } else {
                if (GUrlParam.UrlParam.replayShareId) {
                    // 回放战报
                    let vGetPlayerGameLogMsg:GetPlayerGameLogMsg = new GetPlayerGameLogMsg();
                    vGetPlayerGameLogMsg.unused_0 = GUrlParam.UrlParam.replayShareId;
                    ServerUtil.sendMsg(vGetPlayerGameLogMsg);
                }
                // 这里需要发送断线重连指令，有可能直接进入游戏 （废弃，改为服务器登录之后立马发送这个消息，缩短网络来回的时间）
                // let vNewIntoOldGameTableMsg:NewIntoOldGameTableMsg = new NewIntoOldGameTableMsg();
                // ServerUtil.sendMsg(vNewIntoOldGameTableMsg, MsgCmdConstant.MSG_INTO_GAME_TABLE);
            }

            // CommonHandler.delNetConnectMask();
            ReqLoadingViewUtil.delReqLoadingView();

            // 延时300毫秒进入大厅
            let vTempTimer: Game.Timer = new Game.Timer(300);
            vTempTimer.once(egret.TimerEvent.TIMER, ()=>{
                self.delayedExeAfterLoginAck();
                vTempTimer.stop();
            }, this);
            vTempTimer.start();

            // 延时300毫秒进入大厅(改用vTempTimer实现)
            // MyCallBackUtil.delayedCallBack(300, this.delayedExeAfterLoginAck, this);

            // 静默加载声音
            RES.loadGroup("music");

            // 加载分享图
            let vSystemConfigPara:SystemConfigPara = LobbyHandler.getOneClientConfig(GameConfigConstant.CONF_LOBBY_SHARE_REWARD);
            if (vSystemConfigPara.valueStr.length > 5) {
                ShareView.shareImg.source = vSystemConfigPara.valueStr;
            }
            else {
                ShareView.shareImg.source = "https://cdn.mjiang365.com/h5/apphotupdate/lequhunanShareImg/share_cir_common.jpg";
            }

            let getIP:Function = ()=>{
                // 发送获取IP地址消息
                let getIPUrl = "http://ip.ttayouxi.com/";
                WxApiUtil.getForcePC(getIPUrl, (revData)=>{
                    if (revData.code != 0) {
                        console.warn("更新IP失败");
                        MyCallBackUtil.delayedCallBack(2000, ()=>{
                            getIP();
                        }, this);
                    }
                    else {
                        let vGameBuyItemMsg: GameBuyItemMsg = new GameBuyItemMsg({itemID:GameConstant.UPDATE_PLAYER_CLIENT_IP, cardNo:revData.data.ip, cardPwd:""});
                        ServerUtil.sendMsg(vGameBuyItemMsg);
                    }
                }, this, ()=>{
                    MyCallBackUtil.delayedCallBack(2000, ()=>{
                        getIP();
                    }, this);
                });
            }

            if (Game.CommonUtil.isNative) {
                getIP();
            }
        }

        /**
         * 延时处理登录返回之后的逻辑
         */
        private delayedExeAfterLoginAck(): void {
            let self = this;
            CommonData.delayedExeAfterLoginIntoLobbyID++;
            if (!CommonHandler.getIsIntoGame()) {
                if (CommonData.lastStopPosition === 2) {
                    // 最后位置在茶楼
                    let teaHouseId: number = Storage.getItemNum("th_previous_tea_house_id");
                    if (teaHouseId) {
                        TeaHouseMsgHandle.sendAccessTeaHouseMsg(teaHouseId);
                        // TeaHouseMsgHandle.sendAccessLayerMsg(1, teaHouseId, true);
                        let vTempTimer: Game.Timer = new Game.Timer(3000);
                        vTempTimer["delayedExeAfterLoginIntoLobbyID"] = CommonData.delayedExeAfterLoginIntoLobbyID;
                        vTempTimer.once(egret.TimerEvent.TIMER, ()=>{
                            self.delayedIntoLobby(vTempTimer["delayedExeAfterLoginIntoLobbyID"]);
                            vTempTimer.stop();
                        }, this);
                        vTempTimer.start();
                        // MyCallBackUtil.delayedCallBack(800, this.delayedIntoLobby, this, this._delayedExeAfterLoginAckID);
                        return;
                    }
                }
                // 直接进入大厅
                this.delayedIntoLobby(CommonData.delayedExeAfterLoginIntoLobbyID);
            }
        }

        /**
         * 延时进入大厅
         */
        private delayedIntoLobby(delayedExeAfterLoginIntoLobbyID: number):void {
            // if (CommonData.lastStopPosition !== 2) {
            if (CommonData.delayedExeAfterLoginIntoLobbyID === delayedExeAfterLoginIntoLobbyID) {
                // 判断上一个位置是否在茶楼，在茶楼则直接进入
                MvcUtil.send(LobbyModule.LOBBY_INTO_LOBBY);
            }
        }

	}
}