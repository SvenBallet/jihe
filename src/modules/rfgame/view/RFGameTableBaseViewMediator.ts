module FL {
    export class RFGameTableBaseViewMediator extends puremvc.Mediator implements puremvc.IMediator {

        public static readonly NAME: string = "RFGameTableBaseViewMediator";

        constructor(pView: RFGameTableBaseView) {
            super(RFGameTableBaseViewMediator.NAME, pView);
            this.registerAllEvent(pView);
        }

        /**
       * 注册所有事件
       */
        private registerAllEvent(pView: RFGameTableBaseView): void {
            let self = this;
            pView.copyRoomId.addEventListener(egret.TouchEvent.TOUCH_TAP, self.exeCopyRoomId, self);
            pView.inviteFriend.addEventListener(egret.TouchEvent.TOUCH_TAP, self.exeInviteFriend, self);
            pView.headViewUp.headIconBg.addEventListener(egret.TouchEvent.TOUCH_TAP, self.showUpPlayerInfoView, self);
            pView.headViewLeft.headIconBg.addEventListener(egret.TouchEvent.TOUCH_TAP, self.showLeftPlayerInfoView, self);
            pView.headViewRight.headIconBg.addEventListener(egret.TouchEvent.TOUCH_TAP, self.showRightPlayerInfoView, self);
            pView.headViewDown.headIconBg.addEventListener(egret.TouchEvent.TOUCH_TAP, self.showDownPlayerInfoView, self);  //被挡住，暂时无效
            pView.touchGroup.addEventListener(egret.TouchEvent.TOUCH_TAP, self.resetHandCard, self);
            pView.readyBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, self.isReady, self);
        }

        /**
         * 感兴趣的通知指令
         * @returns {Array<any>}
         */
        public listNotificationInterests(): Array<any> {
            return [
                RFGameModule.RFGAME_REFRESH_PLAYER_INFO,
                CommonModule.COMMON_SHOW_TALK_ANI,
                CommonModule.COMMON_HIDE_TALK_ANI,
                RFGameModule.GAME_SHOW_TIMER,
                RFGameModule.GAME_HIDE_TIMER,
            ];
        }

        /**
       * 处理通知
       * @param {puremvc.INotification} pNotification
       */
        public handleNotification(pNotification: puremvc.INotification): void {
            let data: any = pNotification.getBody();
            switch (pNotification.getName()) {
                case RFGameModule.RFGAME_REFRESH_PLAYER_INFO:
                    this.getView().updateHeadArea(data);
                    break;
                case CommonModule.COMMON_SHOW_TALK_ANI: {
                    this.getView().showTalkAni(data);
                    break;
                }
                case CommonModule.COMMON_HIDE_TALK_ANI: {
                    this.getView().hideTalkAni(data);
                    break;
                }
                case RFGameModule.GAME_SHOW_TIMER: {
                    this.getView().showOutTime(data);
                    break;
                }
                case RFGameModule.GAME_HIDE_TIMER: {
                    this.getView().hideOutTime();
                    break;
                }
            }
        }

        private getView(): RFGameTableBaseView {
            return this.viewComponent;
        }

        /**
         * 是否准备
         */
        private isReady() {
            let msg = new NewGameTablePlayerReadyMsg();
            msg.readyAction = (this.getView().getCurReadyState()) ? 0 : 1;
            ServerUtil.sendMsg(msg);
        }

        /**
        * 处理分享给朋友
        * @param {egret.TouchEvent} e
        */
        private exeInviteFriend(e: egret.TouchEvent): void {
            if (Game.CommonUtil.isNative) {
                let shareData = new nativeShareData();
                shareData.type = ShareWXType.SHARE_URL;
                let roomId = RFGameHandle.getVipRoomId();
                // 普通分享链接
                // shareData.url = NativeBridge.mShareUrl;
                // 分享魔窗链接
                shareData.url = NativeBridge.mMWshareUrl + "?roomid=" + roomId;
                shareData.title = "【"+GConf.Conf.gameName+"】【"+RFGameHandle.getCardGameNameText()+"】房间号：["+roomId+"]";
                let descStr: string = "";
                let numStr: Array<string> = ["零", "一", "二", "三", "四"];
                let totalJu: number = RFGameData.requestStartGameMsgAck.totalPlayCount;
                let maxPlayers: number = RFGameHandle.getGameMaxNum();
                let curentPlayers: number = RFGameHandle.getGamePlayerArray().length;
                descStr += (totalJu + "局，"+maxPlayers+"人，"+numStr[curentPlayers]+"缺"+numStr[maxPlayers-curentPlayers])+"\n";
                let rulestr = RFGameHandle.getWanfaSubDescStrNoPersonNum();
                rulestr = rulestr.replace(/\n/g, ",");
                rulestr = rulestr.slice(0, rulestr.length-1);
                descStr += rulestr;
                shareData.desc = descStr;

                // 分享房间链接文本调整
                if (1) {
                    shareData.title = RFGameHandle.getCardGameNameText() + " " + roomId + " " + "缺"+numStr[maxPlayers-curentPlayers]+"人 " + "点击加入>>>";
                }

                // 分享小程序
                if (NativeBridge.appVersion >= 1.21) {
                    let appId = 10000037;
                    shareData.type = ShareWXType.SHARE_MINI;
                    shareData.miniID = NativeBridge.mShareMiniId;
                    shareData.miniPath = NativeBridge.mShareMiniPath + "?appId=" + appId + "&id=" + "beiyong" +"&roomId=" + roomId;

                    // 分享房间链接文本调整
                    if (1) {
                        shareData.title = RFGameHandle.getCardGameNameText() + " " + roomId + " " + "缺"+numStr[maxPlayers-curentPlayers]+"人 " + "点击加入>>>";
                    }
                }
                else {
                    if (1) {
                        shareData.title = RFGameHandle.getCardGameNameText();
                        shareData.desc = roomId + " " + "缺"+numStr[maxPlayers-curentPlayers]+"人 " + "点击加入>>>"
                    }
                }

                shareData.extraType = InviteXLType.INVITE_ROOM;
                shareData.extraContent = roomId + "";
                NativeBridge.getInstance().mShareData = shareData;

                if (RFGameData.requestStartGameMsgAck.teaHouseId) {
                    MvcUtil.send(CommonModule.COMMON_NATIVE_SHARE_CHOOSE_ROAD, SHARE_CHOOSE_TYPE.SHARE_TEAHOUSE_INVITE);
                }
                else {
                    MvcUtil.send(CommonModule.COMMON_NATIVE_SHARE_CHOOSE_ROAD, SHARE_CHOOSE_TYPE.SHARE_CHOOSE_NO_FRIEND);
                }
            }
            else {
                if (RFGameData.requestStartGameMsgAck.teaHouseId) {
                    MvcUtil.send(CommonModule.COMMON_NATIVE_SHARE_CHOOSE_ROAD, SHARE_CHOOSE_TYPE.SHARE_TEAHOUSE_INVITE);
                }
                else {
                    MvcUtil.send(CommonModule.COMMON_SHOW_SHARE_REMINDER_VIEW, ShareReminderTypeEnum.FRIENDS);
                }
            }
        }

        /**
         * 处理拷贝房间号
         * @param {egret.TouchEvent} e
         */
        private exeCopyRoomId(e: egret.TouchEvent): void {
            if (Game.CommonUtil.isNative) {
                let str = "房间号：[" + RFGameHandle.getVipRoomId() + "]"+"【"+GConf.Conf.gameName+"】【"+RFGameHandle.getCardGameNameText()+"】\n";
                let descStr: string = "";
                let numStr: Array<string> = ["零", "一", "二", "三", "四"];
                let totalJu: number = RFGameData.requestStartGameMsgAck.totalPlayCount;
                let maxPlayers: number = RFGameHandle.getGameMaxNum();
                let curentPlayers: number = RFGameHandle.getGamePlayerArray().length;
                descStr = (totalJu + "局，"+maxPlayers+"人，"+numStr[curentPlayers]+"缺"+numStr[maxPlayers-curentPlayers])+"\n";
                str += descStr;
                let rulestr = RFGameHandle.getWanfaSubDescStrNoPersonNum();
                rulestr = rulestr.replace(/\n/g, ",");
                rulestr = rulestr.slice(0, rulestr.length-1);
                str += rulestr;
                let tipStr = "\n(复制此消息打开游戏可直接申请加入房间)";
                str += tipStr;
                let jsonData = {
                    "eventType": SendNativeMsgType.SEND_NATIVE_SET_CLIPBOARD,
                    "data": {
                        "clipboardStr": str
                    }
                }
                NativeBridge.getInstance().sendNativeMessage(JSON.stringify(jsonData));

                MvcUtil.send(CommonModule.COMMON_NATIVE_OPEN_CHOOSE_ROAD);
            }
        }

        /**
         * 重置卡牌状态
         */
        private resetHandCard() {
            //---test
            // if (!RFGameHandle.touchHandCardSwitch.isOpen()) return;
            MvcUtil.send(RFGameModule.RESET_HAND_CARDS);
            //
            // let n = RFGameSoundHandle.getRandomNumFromField(0, 4);
            // MvcUtil.send(RFGameModule.GAME_SHOW_TIMER, n);
        }

        /**
         * 上方玩家信息弹窗
         */
        private showUpPlayerInfoView(e: egret.Event) {
            if (RFGameHandle.isReplay()) return;
            let vSimplePlayer: GamePlayer = RFGameHandle.getGamePlayerInfo(PZOrientation.UP);
            if (vSimplePlayer) {
                let playerInfoCoor = this.getPlayerInfoViewCoor(PZOrientation.UP);
                egret.localStorage.setItem("PlayerInfoOrientation", "" + PZOrientation.UP);
                PlayerInfoItem.getInstance().setPlayerInfo2(vSimplePlayer, playerInfoCoor);
                MvcUtil.addView(PlayerInfoItem.getInstance());
            }
        }

        /**
         * 左方玩家信息弹窗
         */
        private showLeftPlayerInfoView(e: egret.Event) {
            if (RFGameHandle.isReplay()) return;
            let vSimplePlayer: GamePlayer = RFGameHandle.getGamePlayerInfo(PZOrientation.LEFT);
            if (vSimplePlayer) {
                let playerInfoCoor: Array<number> = this.getPlayerInfoViewCoor(PZOrientation.LEFT);
                egret.localStorage.setItem("PlayerInfoOrientation", "" + PZOrientation.LEFT);
                PlayerInfoItem.getInstance().setPlayerInfo2(vSimplePlayer, playerInfoCoor);
                MvcUtil.addView(PlayerInfoItem.getInstance());
            }
        }

        /**
         * 右方玩家信息弹窗
         */
        private showRightPlayerInfoView(e: egret.Event) {
            if (RFGameHandle.isReplay()) return;
            let vSimplePlayer: GamePlayer = RFGameHandle.getGamePlayerInfo(PZOrientation.RIGHT);
            if (vSimplePlayer) {
                let playerInfoCoor: Array<number> = this.getPlayerInfoViewCoor(PZOrientation.RIGHT);
                egret.localStorage.setItem("PlayerInfoOrientation", "" + PZOrientation.RIGHT);
                PlayerInfoItem.getInstance().setPlayerInfo2(vSimplePlayer, playerInfoCoor);
                MvcUtil.addView(PlayerInfoItem.getInstance());
            }
        }

        /**
         * 下方玩家信息弹窗
         */
        private showDownPlayerInfoView(e: egret.Event) {
            if (RFGameHandle.isReplay()) return;
            let vSimplePlayer: GamePlayer = RFGameHandle.getGamePlayerInfo(PZOrientation.DOWN);
            if (vSimplePlayer) {
                let playerInfoCoor: Array<number> = this.getPlayerInfoViewCoor(PZOrientation.DOWN);
                egret.localStorage.setItem("PlayerInfoOrientation", "" + PZOrientation.DOWN);
                PlayerInfoItem.getInstance().setPlayerInfo2(vSimplePlayer, playerInfoCoor);
                MvcUtil.addView(PlayerInfoItem.getInstance());
            }
        }

        private sendClientIP(vSimplePlayer: SimplePlayer) {
            let cardPwd: string = "未知位置";
            // (device.platform == "windows" || device.platform == "mac" || !gpsInfo) && "未知位置" ||
            // (gpsInfo.province + gpsInfo.city + gpsInfo.district + gpsInfo.street);
            let cardNo: string = vSimplePlayer.ip;
            let vParams = { itemID: GameConstant.UPDATE_PLAYER_CLIENT_IP, cardPwd: cardPwd, cardNo: cardNo };
            ServerUtil.sendMsg(new GameBuyItemMsg(vParams), MsgCmdConstant.MSG_GAME_BUY_ITEM_ACK);
        }


        /**
         * 获取玩家信息弹窗坐标
         * @param {PZOrientation} vPZOrientation
         * @returns {Array<number>}
         */
        private getPlayerInfoViewCoor(vPZOrientation: PZOrientation): Array<number> {
            let vTableBoardBaseView: RFGameTableBaseView = RFGameTableBaseView.getInstance();
            if (vPZOrientation === PZOrientation.UP) {
                let viewX = vTableBoardBaseView.headViewUp.x;
                let viewY = vTableBoardBaseView.headViewUp.y;
                // let iconY = vTableBoardBaseView.headViewUp.headIcon.y;
                // return [viewX - iconY, viewY + iconY + 85];
                return [viewX + 215 - 566, viewY + 85];
            } else if (vPZOrientation === PZOrientation.LEFT) {
                let viewX = vTableBoardBaseView.headViewLeft.x;
                let viewY = vTableBoardBaseView.headViewLeft.y;
                return [viewX + 215 + 45, 0];
            } else if (vPZOrientation === PZOrientation.RIGHT) {
                let viewX = vTableBoardBaseView.headViewRight.x;
                let viewY = vTableBoardBaseView.headViewRight.y;
                return [viewX + 215 - 566, viewY + 85];
            } else if (vPZOrientation === PZOrientation.DOWN) {
                let viewX = vTableBoardBaseView.headViewDown.x;
                let viewY = vTableBoardBaseView.headViewDown.y;
                return [viewX + 215 + 85, viewY - 215 - 85];
            }
        }
    }
}
