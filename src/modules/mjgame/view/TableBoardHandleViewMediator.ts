module FL {
    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase - TableBoardHandleViewMediator
     * @Description:  //牌桌操作界面调停者
     * @Create: DerekWu on 2017/11/22 20:02
     * @Version: V1.0
     */
    export class TableBoardHandleViewMediator extends puremvc.Mediator implements puremvc.IMediator {

        public static readonly NAME: string = "TableBoardHandleViewMediator";

        constructor(pView: TableBoardHandleView) {
            super(TableBoardHandleViewMediator.NAME, pView);
            this.registerAllEvent(pView);
        }

        /**
         * 注册所有事件
         */
        private registerAllEvent(pView: TableBoardHandleView): void {
            // TouchTweenUtil.regTween(self.handleMenuGroup, self.handleMenuBtn);
            // TouchTweenUtil.regTween(self.settingGroup, self.settingBtn);
            // TouchTweenUtil.regTween(self.exitGroup, self.exitBtn);
            // TouchTweenUtil.regTween(self.dissolveSmallGroup, self.dissolveSmallBtn);
            // TouchTweenUtil.regTween(self.chatGroup, self.chatBtn);
            // TouchTweenUtil.regTween(self.microphoneGroup, self.microphoneBtn);
            // TouchTweenUtil.regTween(self.gpsGroup, self.gpsBtn);
            // TouchTweenUtil.regTween(self.backLobbyGroup, self.backLobbyBtn);
            // TouchTweenUtil.regTween(self.dissolveGroup, self.dissolveBtn);
            let self = this;
            // pView.handleMenuGroup.addEventListener(egret.TouchEvent.TOUCH_TAP, self.exeHandleMenu, self);
            pView.handleMenuGroup.addEventListener(egret.TouchEvent.TOUCH_TAP, self.exeSetting, self);
            pView.viewHideWanfa.addEventListener(egret.TouchEvent.TOUCH_TAP, self.exeViewHideWanfa, self);
            pView.settingGroup.addEventListener(egret.TouchEvent.TOUCH_TAP, self.exeSetting, self);
            pView.exitGroup.addEventListener(egret.TouchEvent.TOUCH_TAP, self.exeBackLobby, self);
            pView.dissolveSmallGroup.addEventListener(egret.TouchEvent.TOUCH_TAP, self.exeDissolveRoom, self);
            pView.chatGroup.addEventListener(egret.TouchEvent.TOUCH_TAP, self.exeChat, self);

            //麦克风后面改成开始触摸 和 结束触摸事件
            //TODO 暂时屏蔽
            // pView.microphoneGroup.addEventListener(egret.TouchEvent.TOUCH_BEGIN, self.exeMicrophoneBegin, self);

            pView.gpsGroup.addEventListener(egret.TouchEvent.TOUCH_TAP, self.exeGps, self);
            pView.backLobbyGroup.addEventListener(egret.TouchEvent.TOUCH_TAP, self.exeBackLobby, self);
            pView.dissolveGroup.addEventListener(egret.TouchEvent.TOUCH_TAP, self.exeDissolveRoom, self);
            //取消托管
            pView.cancelTuoGuanGroup.addEventListener(egret.TouchEvent.TOUCH_TAP, self.exeCancelTuoGuan, self);
        }

        /**
         * 注册之后调用
         */
        // public onRegister():void {
        //     egret.log("--TableBoardHandleViewMediator--onRegister");
        // }

        /**
         * 移除之后调用
         */
        // public onRemove():void {
        //     egret.log("--TableBoardHandleViewMediator--onRemove");
        // }

        private getView(): TableBoardHandleView {
            return <TableBoardHandleView>this.viewComponent;
        }

        /**
         * 感兴趣的通知指令
         * @returns {Array<any>}
         */
        public listNotificationInterests(): Array<any> {
            return [
                MJGameModule.MJGAME_MY_OVERTIME_AUTO_CHU,
                CommonModule.COMMON_RE_BATTERY,
                CommonModule.COMMON_RE_CONNECT_STATE,
                CommonModule.COMMON_RE_TALK_VOICE,
                CommonModule.COMMON_SEND_TALK_VOICE,
                CommonModule.COMMON_CHANGE_NET_MS,
            ];
        }

        /**
         * 处理通知
         * @param {puremvc.INotification} pNotification
         */
        public handleNotification(pNotification: puremvc.INotification): void {
            let data: any = pNotification.getBody();
            switch (pNotification.getName()) {
                case MJGameModule.MJGAME_MY_OVERTIME_AUTO_CHU: {
                    this.getView().setTuoGuanGroup(true);
                    break;
                }
                case CommonModule.COMMON_RE_BATTERY: {
                    this.getView().reBatteryShow(data);
                    break;
                }
                case CommonModule.COMMON_RE_CONNECT_STATE: {
                    this.getView().reNetworkShow(data);
                    break;
                }
                case CommonModule.COMMON_RE_TALK_VOICE: {
                    this.getView().talkMod.reVoice(data);
                    break;
                }
                case CommonModule.COMMON_SEND_TALK_VOICE: {
                    this.sendVoice(data);
                    break;
                }
                case CommonModule.COMMON_CHANGE_NET_MS: {
                    this.getView().changeMS(data);
                    break;
                }
            }
        }

        /**
         * 处理菜单
         * @param {egret.TouchEvent} e
         */
        private exeHandleMenu(e: egret.TouchEvent): void {
            let vView: TableBoardHandleView = this.getView();
            if (vView.menuGroupIsView) {
                vView.hideMenuGroup();
            } else {
                vView.viewMenuGroup();
            }
        }

        /**
         * 处理菜单
         * @param {egret.TouchEvent} e
         */
        private exeViewHideWanfa(e: egret.TouchEvent): void {
            let vView: TableBoardHandleView = this.getView();
            if (vView.wanfaDescIsView) {
                vView.hideWanfaDescGroup();
            } else {
                vView.viewWanfaDescGroup();
            }
        }

        /**
         * 处理设置
         * @param {egret.TouchEvent} e
         */
        private exeSetting(e: egret.TouchEvent): void {
            let vMJGameSetView: MJGameSetView = MJGameSetView.getInstance();
            vMJGameSetView.resetView(1);
            MvcUtil.addView(vMJGameSetView);
        }

        /**
         * 处理返回大厅
         * @param {egret.TouchEvent} e
         */
        private exeBackLobby(e: egret.TouchEvent): void {

            if (!MJGameHandler.isReplay()) {
                /**
                 *      {
                 *      hasLeftBtn:boolean,   是否有左边按钮
                 *      leftCallBack:MyCallBack,   左边按钮回调
                 *      hasRightBtn:boolean,  是否有右边按钮
                 *      rightCallBack:MyCallBack,  右边按钮回调
                 *      titleImgSrc:string,  title美术资源
                 *      leftBtnSrc:string,    左边按钮美术资源
                 *      leftBtnText:string,    左边按钮显示文字
                 *      rightBtnSrc:string,   右边按钮美术资源
                 *      rightBtnText:string,  右边按钮显示文字
                 *      text:string,   提示文本
                 *      textFlow:string  提示富文本
                 *    }
                 */
                let vReminderText: string;
                if (MJGameHandler.isVipRoom() && !MJGameHandler.isReplay()) {
                    vReminderText = "离开房间会造成游戏暂停，是否继续离开？";
                } else {
                    vReminderText = "您确定要返回大厅吗？";
                }
                ReminderViewUtil.showReminderView({
                    hasLeftBtn: true,
                    leftCallBack: new MyCallBack(this.backLobby, this),
                    hasRightBtn: true,
                    text: vReminderText
                });
            } else {
                //客户端自己返回大厅
                this.backLobby();
            }
        }

        /**
         * 返回大厅
         */
        private backLobby(): void {
            if (!MJGameHandler.isReplay()) {
                //给服务器发送消息
                let vPlayerGameOpertaionMsg: PlayerGameOpertaionMsg = new PlayerGameOpertaionMsg();
                vPlayerGameOpertaionMsg.opertaionID = GameConstant.GAME_OPERTAION_PLAYER_LEFT_TABLE;
                ServerUtil.sendMsg(vPlayerGameOpertaionMsg);
            }
            // if (RFGameData.requestStartGameMsgAck.teaHouseId) {
            //     //表示是从茶楼桌子退出
            //     TeaHouseMsgHandle.sendAccessTeaHouseMsg(RFGameData.requestStartGameMsgAck.teaHouseId);
            //     TeaHouseMsgHandle.sendAccessLayerMsg(RFGameData.requestStartGameMsgAck.teaHouseLayer, RFGameData.requestStartGameMsgAck.teaHouseId);
            //     return;
            // }
            //客户端自己返回大厅
            MvcUtil.send(LobbyModule.LOBBY_INTO_LOBBY);
        }

        /**
         * 处理解散房间
         * @param {egret.TouchEvent} e
         */
        private exeDissolveRoom(e: egret.TouchEvent): void {
            if (MJGameHandler.isReplay()) return;
            //分类型提示 和 处理
            let vReminderText: string;
            let vCallBackFun: Function;
            if (MJGameHandler.getGameState() === EGameState.WAITING_START && MJGameHandler.getCurrentHand() === 0) {
                if (MJGameHandler.isRoomOwner(PZOrientation.DOWN)) {
                    //我是不是房主的判断
                    vReminderText = "您确定要解散房间吗？（第一局未结算，解散房间不扣钻石）";
                } else {
                    vReminderText = "您确定要离开房间吗？";
                }
                vCallBackFun = this.dissolveRoomNoStart;
            } else {
                vReminderText = "您确定要请求解散房间吗？";
                vCallBackFun = this.applyDissolve;
            }
            //弹出确认框
            ReminderViewUtil.showReminderView({
                hasLeftBtn: true,
                leftCallBack: new MyCallBack(vCallBackFun, this),
                hasRightBtn: true,
                text: vReminderText
            });
        }

        /**
         * 解散房间，未开始前的解散
         */
        private dissolveRoomNoStart(): void {
            if (MJGameHandler.isReplay()) return;
            let vPlayerGameOpertaionMsg: PlayerGameOpertaionMsg = new PlayerGameOpertaionMsg();
            vPlayerGameOpertaionMsg.opertaionID = GameConstant.GAME_OPERATION_APPLY_CLOSE_VIP_ROOM;
            ServerUtil.sendMsg(vPlayerGameOpertaionMsg);
            if (!MJGameHandler.isRoomOwner(PZOrientation.DOWN)) {
                //不是房主客户端自己返回大厅，是房主的话收到VIP房间结束消息弹出提示，后点击提示面板的返回大厅按钮再返回大厅
                MvcUtil.send(LobbyModule.LOBBY_INTO_LOBBY);
            }
        }

        /**
         * 申请解散房间
         */
        private applyDissolve(): void {
            if (MJGameHandler.isReplay()) return;
            let vPlayerTableOperationMsg: PlayerTableOperationMsg = new PlayerTableOperationMsg();
            vPlayerTableOperationMsg.operation = GameConstant.MAHJONG_OPERTAION_WAITING_OR_CLOSE_VIP;
            vPlayerTableOperationMsg.opValue = 1; //1是请求解散，2是同意解散，3是不同意解散
            ServerUtil.sendMsg(vPlayerTableOperationMsg);
        }

        /**
         * 处理聊天
         * @param {egret.TouchEvent} e
         */
        private exeChat(e: egret.TouchEvent): void {
            if (MJGameHandler.isReplay()) return;
            // 测试代码
            // let vPlayPos:number = Math.floor(Math.random() * 4);
            // egret.log("vPlayPos="+vPlayPos);
            // let vPlayAction: WeChatVoiceAction = WeChatVoiceActionFactory.buildPlayVoiceAction(WeChatVoiceSceneEnum.GAME, "123", vPlayPos);
            // MvcUtil.send(CommonModule.COMMON_WE_CHAT_VOICE_PLAY_START, vPlayAction);
            MvcUtil.addView(MJGameChatView.getInstance());
        }

        /** 当前开始微信录音动作Id */
        // private _currStartWeChatVoiceActionId:number = 0;

        /**
         * 处理麦克风开始
         * @param {egret.TouchEvent} e
         */
        private exeMicrophoneBegin(e: egret.TouchEvent): void {
            if (MJGameHandler.isReplay()) return;
            // 测试代码
            // MvcUtil.send(CommonModule.COMMON_WE_CHAT_VOICE_PLAY_END, "123");
            if (GConf.Conf.useWXAuth) {
                WeChatJsSdkHandler.startWeChatRecord(WeChatVoiceSceneEnum.GAME, MJGameHandler.getTablePos(PZOrientation.DOWN));
            } else {
                PromptUtil.show("请在微信中使用该功能！", PromptType.ALERT);
            }
        }

        /**
         * 处理gps
         * @param {egret.TouchEvent} e
         */
        private exeGps(e: egret.TouchEvent): void {
            if (MJGameHandler.isReplay()) return;
            let vGPSsafeView: GPSsafeView = new GPSsafeView();
            MvcUtil.addView(vGPSsafeView);
        }

        /**
         * 取消托管
         * @param {egret.TouchEvent} e
         */
        private exeCancelTuoGuan(e: egret.TouchEvent): void {
            //发送取消托管指令
            let vPlayerGameOpertaionMsg: PlayerGameOpertaionMsg = new PlayerGameOpertaionMsg();
            vPlayerGameOpertaionMsg.opertaionID = GameConstant.GAME_OPERTAION_SET_TUOGUAN;
            vPlayerGameOpertaionMsg.opValue = 0; //设置为到时间后补自动出牌
            ServerUtil.sendMsg(vPlayerGameOpertaionMsg);
            //隐藏托管
            this.getView().setTuoGuanGroup(false);
        }

        /**
         * 发送语音信息
         */
        private sendVoice(voiceBase64: string) {
            let gt = GameConstant.CURRENT_GAMETYPE;
            let vTalkingInGameMsg;
            let ack;
            vTalkingInGameMsg = new NewTalkingInGameMsg();
            ack = MsgCmdConstant.MSG_NEW_TALKING_IN_GAME_ACK;
            vTalkingInGameMsg.msgText = "";
            vTalkingInGameMsg.msgType = 5;
            vTalkingInGameMsg.playerPos = GameConstant.CURRENT_HANDLE.getTablePos(PZOrientation.DOWN);
            vTalkingInGameMsg.audioBase64 = voiceBase64;
            ServerUtil.sendMsg(vTalkingInGameMsg, ack);
        }
    }
}