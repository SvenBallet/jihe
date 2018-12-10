module FL {
    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase - MahjongTableHandleViewMediator
     * @Description:  //牌桌操作界面调停者
     * @Create: DerekWu on 2017/11/22 20:02
     * @Version: V1.0
     */
    export class MahjongTableHandleViewMediator extends puremvc.Mediator implements puremvc.IMediator {

        public static readonly NAME: string = "MahjongTableHandleViewMediator";

        constructor(pView: MahjongTableHandleView) {
            super(MahjongTableHandleViewMediator.NAME, pView);
            this.registerAllEvent(pView);
        }

        /**
         * 注册所有事件
         */
        private registerAllEvent(pView: MahjongTableHandleView): void {
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

            // 选择人数模式
            pView.twoPlayerNumPattern.addEventListener(egret.TouchEvent.TOUCH_TAP, self.selectTwoPlayerNumPattern, self);
            pView.threePlayerNumPattern.addEventListener(egret.TouchEvent.TOUCH_TAP, self.selectThreePlayerNumPattern, self);
        }

        /**
         * 注册之后调用
         */
        // public onRegister():void {
        //     egret.log("--MahjongTableHandleViewMediator--onRegister");
        // }

        /**
         * 移除之后调用
         */
        // public onRemove():void {
        //     egret.log("--MahjongTableHandleViewMediator--onRemove");
        // }

        private getView(): MahjongTableHandleView {
            return <MahjongTableHandleView>this.viewComponent;
        }

        /**
         * 感兴趣的通知指令
         * @returns {Array<any>}
         */
        public listNotificationInterests(): Array<any> {
            return [
                CommonModule.COMMON_RE_BATTERY,
                CommonModule.COMMON_RE_CONNECT_STATE,
                CommonModule.COMMON_RE_TALK_VOICE,
                CommonModule.COMMON_SEND_TALK_VOICE,
                MahjongModule.MAHJONG_GAME_MY_OVERTIME_AUTO_CHU,
                RFGameModule.RFGAME_CAN_NOT_LEAVE_ROOM,
                MahjongModule.MAHJONG_CHANG_SHA_REMINDER_HAI_DI_MO,
                CommonModule.COMMON_CHANGE_NET_MS,
                MahjongModule.MAHJONG_UPDATE_PLAYER_HEAD_AREA
            ];
        }

        /**
         * 处理通知
         * @param {puremvc.INotification} pNotification
         */
        public handleNotification(pNotification: puremvc.INotification): void {
            let data: any = pNotification.getBody();
            switch (pNotification.getName()) {
                case MahjongModule.MAHJONG_UPDATE_PLAYER_HEAD_AREA: {
                    this.getView().updateSelectPlayerNumPatterns();
                    break;
                }
                case MahjongModule.MAHJONG_GAME_MY_OVERTIME_AUTO_CHU: {
                    this.getView().setTuoGuanGroup(data);
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
                case RFGameModule.RFGAME_CAN_NOT_LEAVE_ROOM: {
                    this.getView().resetDissolveBtn();
                    break;
                }
                case MahjongModule.MAHJONG_CHANG_SHA_REMINDER_HAI_DI_MO: {
                    this.changShaHaiDiMo(data);
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
            let vView: MahjongTableHandleView = this.getView();
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
            let vView: MahjongTableHandleView = this.getView();
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
            if (!MahjongHandler.isReplay()) {
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
                if (MahjongHandler.isVipRoom() && !MahjongHandler.isReplay()) {
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
            // 是否强制返回大厅
            let flag = false;
            if (!MahjongHandler.isReplay()) {
                //给服务器发送消息
                let msg = new NewPlayerLeaveRoomMsg();
                msg.leaveFlag = 4;
                ServerUtil.sendMsg(msg);
                // let vPlayerGameOpertaionMsg: PlayerGameOpertaionMsg = new PlayerGameOpertaionMsg();
                // vPlayerGameOpertaionMsg.opertaionID = GameConstant.GAME_OPERTAION_PLAYER_LEFT_TABLE;
                // ServerUtil.sendMsg(vPlayerGameOpertaionMsg);
            }
            else {//回放需要确保已经关闭动画
                MahjongLogReplay.endPlay();
                RecordView.lobbyRecord && (flag = true);
            }

            if (MahjongData.requestStartGameMsgAck.teaHouseId && !flag) {
                //表示是从茶楼桌子退出
                TeaHouseMsgHandle.sendAccessTeaHouseMsg(MahjongData.requestStartGameMsgAck.teaHouseId);
                // TeaHouseMsgHandle.sendAccessLayerMsg(MahjongData.requestStartGameMsgAck.teaHouseLayer, MahjongData.requestStartGameMsgAck.teaHouseId);
                return;
            }
            //客户端自己返回大厅
            MvcUtil.send(LobbyModule.LOBBY_INTO_LOBBY);
        }

        /**
         * 处理解散房间
         * @param {egret.TouchEvent} e
         */
        private exeDissolveRoom(e: egret.TouchEvent): void {
            if (MahjongHandler.isReplay()) return;
            //分类型提示 和 处理
            let vReminderText: string;
            let vCallBackFun: Function;
            if (MahjongHandler.isCanLeaveRoom()) {
                vCallBackFun = this.dissolveRoomNoStart;
                if (MahjongHandler.isRoomOwner(PZOrientation.DOWN)) {
                    vReminderText = "您确定要解散房间吗？（第一局未结算，解散房间不扣钻石）";
                } else {
                    vReminderText = "您确定要离开房间吗？";
                }
            } else {
                vReminderText = "您确定要请求解散房间吗？";
                vCallBackFun = this.applyDissolve;
            }
            // if (MahjongHandler.getGameState() === EGameState.WAITING_START && MahjongHandler.getCurrentHand() === 1) {
            //     if (MahjongHandler.isRoomOwner(PZOrientation.DOWN)) {
            //         //我是不是房主的判断
            //         vReminderText = "您确定要解散房间吗？（第一局未结算，解散房间不扣钻石）";
            //         vCallBackFun = this.dissolveRoomNoStart;
            //
            //     } else if (MahjongHandler.getGameState() === EGameState.PLAYER_READY_OVER) {
            //         vReminderText = "您确定要请求解散房间吗？";
            //         vCallBackFun = this.applyDissolve;
            //
            //     } else {
            //         vReminderText = "您确定要离开房间吗？";
            //         vCallBackFun = this.dissolveRoomNoStart;
            //     }
            // } else {
            //     vReminderText = "您确定要请求解散房间吗？";
            //     vCallBackFun = this.applyDissolve;
            // }
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
            if (MahjongHandler.isReplay()) return;
            let msg = new NewPlayerLeaveRoomMsg();
            if (MahjongHandler.isRoomOwner(PZOrientation.DOWN)) {
                //我是不是房主的判断
                msg.leaveFlag = 2;
            } else {
                msg.leaveFlag = 1;
            }
            // let vPlayerGameOpertaionMsg: PlayerGameOpertaionMsg = new PlayerGameOpertaionMsg();
            // vPlayerGameOpertaionMsg.opertaionID = GameConstant.GAME_OPERATION_APPLY_CLOSE_VIP_ROOM;
            ServerUtil.sendMsg(msg);
            if (!MahjongHandler.isRoomOwner(PZOrientation.DOWN)) {
                //不是房主客户端自己返回大厅，是房主的话收到VIP房间结束消息弹出提示，后点击提示面板的返回大厅按钮再返回大厅
                if (MahjongData.requestStartGameMsgAck.teaHouseId) {
                    //表示是从茶楼桌子退出
                    TeaHouseMsgHandle.sendAccessTeaHouseMsg(MahjongData.requestStartGameMsgAck.teaHouseId);
                    // TeaHouseMsgHandle.sendAccessLayerMsg(MahjongData.requestStartGameMsgAck.teaHouseLayer, MahjongData.requestStartGameMsgAck.teaHouseId);
                    return;
                }
                MvcUtil.send(LobbyModule.LOBBY_INTO_LOBBY);
            }
        }


        /**
         * 申请解散房间
         */
        private applyDissolve(): void {
            if (MahjongHandler.isReplay()) return;
            // let vPlayerTableOperationMsg: PlayerTableOperationMsg = new PlayerTableOperationMsg();
            // vPlayerTableOperationMsg.operation = GameConstant.MAHJONG_OPERTAION_WAITING_OR_CLOSE_VIP;
            // vPlayerTableOperationMsg.opValue = 1; //1是请求解散，2是同意解散，3是不同意解散
            // ServerUtil.sendMsg(vPlayerTableOperationMsg);
            let vApplyDismissRoomMsg: ApplyDismissRoomMsg = new ApplyDismissRoomMsg();
            ServerUtil.sendMsg(vApplyDismissRoomMsg);
        }

        /**
         * 处理聊天
         * @param {egret.TouchEvent} e
         */
        private exeChat(e: egret.TouchEvent): void {
            if (MahjongHandler.isReplay()) return;
            // 测试代码
            // // let vPlayPos: number = Math.floor(Math.random() * 4);
            // // egret.log("vPlayPos=" + vPlayPos);
            // // let vPlayAction: WeChatVoiceAction = WeChatVoiceActionFactory.buildPlayVoiceAction(WeChatVoiceSceneEnum.GAME, "123", vPlayPos);
            // // MvcUtil.send(CommonModule.COMMON_WE_CHAT_VOICE_PLAY_START, vPlayAction);
            MvcUtil.addView(MJGameChatView.getInstance());

            //---test  用来开始游戏
            // MvcUtil.send(RFGameModule.RFGAME_START_GAME);
        }

        /**
         * 处理gps
         * @param {egret.TouchEvent} e
         */
        private exeGps(e: egret.TouchEvent): void {
            if (MahjongHandler.isReplay()) return;
            let vGPSsafeView: GPSsafeView = new GPSsafeView();
            MvcUtil.addView(vGPSsafeView);
        }

        /**
         * 取消托管
         * @param {egret.TouchEvent} e
         */
        private exeCancelTuoGuan(e: egret.TouchEvent): void {
            //发送取消托管指令
            let msg = new NewGameTableTuoGuanMsg();
            msg.tuoGuanAction = 1;
            ServerUtil.sendMsg(msg);
            //隐藏托管
            this.getView().setTuoGuanGroup(false);
        }

        /**
         * 选择二人模式
         * @param {egret.TouchEvent} e
         */
        private selectTwoPlayerNumPattern(e: egret.TouchEvent): void {
            let vView: MahjongTableHandleView = this.getView();
            let vPlayerNum: number = 2;
            if (vView.twoPlayerNumPatternCheck.visible) {
                vPlayerNum = 0;
                vView.twoPlayerNumPatternCheck.visible = false;
            } else {
                vView.twoPlayerNumPatternCheck.visible = true;
                if (vView.threePlayerNumPatternCheck.visible) {
                    vView.threePlayerNumPatternCheck.visible = false;
                }
            }
            // 发送消息
            let vNewGameTableSelectPlayerNumPatternMsg: NewGameTableSelectPlayerNumPatternMsg = new NewGameTableSelectPlayerNumPatternMsg();
            vNewGameTableSelectPlayerNumPatternMsg.playerNum = vPlayerNum;
            ServerUtil.sendMsg(vNewGameTableSelectPlayerNumPatternMsg);
        }

        /**
         * 选择三人模式
         * @param {egret.TouchEvent} e
         */
        private selectThreePlayerNumPattern(e: egret.TouchEvent): void {
            let vView: MahjongTableHandleView = this.getView();
            let vPlayerNum: number = 3;
            if (vView.threePlayerNumPatternCheck.visible) {
                vPlayerNum = 0;
                vView.threePlayerNumPatternCheck.visible = false;
            } else {
                vView.threePlayerNumPatternCheck.visible = true;
                if (vView.twoPlayerNumPatternCheck.visible) {
                    vView.twoPlayerNumPatternCheck.visible = false;
                }
            }
            // 发送消息
            let vNewGameTableSelectPlayerNumPatternMsg: NewGameTableSelectPlayerNumPatternMsg = new NewGameTableSelectPlayerNumPatternMsg();
            vNewGameTableSelectPlayerNumPatternMsg.playerNum = vPlayerNum;
            ServerUtil.sendMsg(vNewGameTableSelectPlayerNumPatternMsg);
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

        /**
         * 更新选择玩家人数模式区域
         * @param {FL.PZOrientation} pPZOrientation
         */
        // private updateSelectedPlayerNumPattern(pPZOrientation: PZOrientation): void {
        //     let vGamePlayer: GamePlayer = MahjongHandler.getGamePlayerInfo(pPZOrientation);
        //     // 根据人数隐藏按钮
        //
        //
        //     // 下面处理是否勾选
        //     if (pPZOrientation !== PZOrientation.DOWN) return;
        //     let vSelectedPlayerNumPattern: number = vGamePlayer.selectedPlayerNumPattern;
        //     let vView: MahjongTableHandleView = this.getView();
        //     if (vSelectedPlayerNumPattern === 2) {
        //         vView.twoPlayerNumPatternCheck.visible = true;
        //         vView.threePlayerNumPatternCheck.visible = false;
        //     } else if (vSelectedPlayerNumPattern === 3) {
        //         vView.twoPlayerNumPatternCheck.visible = false;
        //         vView.threePlayerNumPatternCheck.visible = true;
        //     } else {
        //         vView.twoPlayerNumPatternCheck.visible = false;
        //         vView.threePlayerNumPatternCheck.visible = false;
        //     }
        // }

        /**
         * 长沙麻将提示是否海底摸一把
         * @param {FL.MahjongChangShaReminderHaiDiMoMsgAck} msg
         */
        private changShaHaiDiMo(msg:MahjongChangShaReminderHaiDiMoMsgAck) {
            //弹出确认框
            ReminderViewUtil.showReminderView({
                hasLeftBtn: true,
                leftCallBack: new MyCallBack(this.changShaConfirmHaiDiMo, this, true),
                hasRightBtn: true,
                rightCallBack: new MyCallBack(this.changShaConfirmHaiDiMo, this, false),
                text: "海底摸一把！"
            });
        }

        private changShaConfirmHaiDiMo(isMo:boolean) {
            let vMahjongChangShaConfirmHaiDiMoMsg:MahjongChangShaConfirmHaiDiMoMsg = new MahjongChangShaConfirmHaiDiMoMsg();
            vMahjongChangShaConfirmHaiDiMoMsg.isMo = isMo;
            ServerUtil.sendMsg(vMahjongChangShaConfirmHaiDiMoMsg);
        }

    }
}