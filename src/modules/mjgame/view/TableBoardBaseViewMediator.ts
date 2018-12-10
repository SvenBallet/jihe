module FL {
    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase - TableBoardBaseViewMediator
     * @Description:  //调停者
     * @Create: DerekWu on 2017/11/21 15:47
     * @Version: V1.0
     */
    export class TableBoardBaseViewMediator extends puremvc.Mediator implements puremvc.IMediator {

        public static readonly NAME: string = "TableBoardBaseViewMediator";

        constructor(pView: TableBoardBaseView) {
            super(TableBoardBaseViewMediator.NAME, pView);
            this.registerAllEvent(pView);
        }

        /**
         * 注册所有事件
         */
        private registerAllEvent(pView: TableBoardBaseView): void {
            let self = this;
            pView.copyRoomId.addEventListener(egret.TouchEvent.TOUCH_TAP, self.exeCopyRoomId, self);
            pView.inviteFriend.addEventListener(egret.TouchEvent.TOUCH_TAP, self.exeInviteFriend, self);
            pView.headViewUp.headIconBg.addEventListener(egret.TouchEvent.TOUCH_TAP, self.showUpPlayerInfoView, self);
            pView.headViewLeft.headIconBg.addEventListener(egret.TouchEvent.TOUCH_TAP, self.showLeftPlayerInfoView, self);
            pView.headViewRight.headIconBg.addEventListener(egret.TouchEvent.TOUCH_TAP, self.showRightPlayerInfoView, self);
            pView.headViewDown.headIconBg.addEventListener(egret.TouchEvent.TOUCH_TAP, self.showDownPlayerInfoView, self);  //被挡住，暂时无效
        }

        /**
         * 上方玩家信息弹窗
         */
        private showUpPlayerInfoView(e: egret.Event) {
            if (MJGameHandler.isReplay()) return;
            let vSimplePlayer: SimplePlayer = MJGameHandler.getGamePlayerInfo(PZOrientation.UP);
            if (vSimplePlayer) {
                let playerInfoCoor = this.getPlayerInfoViewCoor(PZOrientation.UP);
                egret.localStorage.setItem("PlayerInfoOrientation", "" + PZOrientation.UP);
                PlayerInfoItem.getInstance().setPlayerInfo(vSimplePlayer, playerInfoCoor);
                MvcUtil.addView(PlayerInfoItem.getInstance());
            }
        }

        /**
         * 左方玩家信息弹窗
         */
        private showLeftPlayerInfoView(e: egret.Event) {
            if (MJGameHandler.isReplay()) return;
            let vSimplePlayer: SimplePlayer = MJGameHandler.getGamePlayerInfo(PZOrientation.LEFT);
            if (vSimplePlayer) {
                let playerInfoCoor: Array<number> = this.getPlayerInfoViewCoor(PZOrientation.LEFT);
                egret.localStorage.setItem("PlayerInfoOrientation", "" + PZOrientation.LEFT);
                PlayerInfoItem.getInstance().setPlayerInfo(vSimplePlayer, playerInfoCoor);
                MvcUtil.addView(PlayerInfoItem.getInstance());
            }
        }

        /**
         * 右方玩家信息弹窗
         */
        private showRightPlayerInfoView(e: egret.Event) {
            if (MJGameHandler.isReplay()) return;
            let vSimplePlayer: SimplePlayer = MJGameHandler.getGamePlayerInfo(PZOrientation.RIGHT);
            if (vSimplePlayer) {
                let playerInfoCoor: Array<number> = this.getPlayerInfoViewCoor(PZOrientation.RIGHT);
                egret.localStorage.setItem("PlayerInfoOrientation", "" + PZOrientation.RIGHT);
                PlayerInfoItem.getInstance().setPlayerInfo(vSimplePlayer, playerInfoCoor);
                MvcUtil.addView(PlayerInfoItem.getInstance());
            }
        }

        /**
         * 下方玩家信息弹窗
         */
        private showDownPlayerInfoView(e: egret.Event) {
            if (MJGameHandler.isReplay()) return;
            let vSimplePlayer: SimplePlayer = MJGameHandler.getGamePlayerInfo(PZOrientation.DOWN);
            if (vSimplePlayer) {
                let playerInfoCoor: Array<number> = this.getPlayerInfoViewCoor(PZOrientation.DOWN);
                egret.localStorage.setItem("PlayerInfoOrientation", "" + PZOrientation.DOWN);
                PlayerInfoItem.getInstance().setPlayerInfo(vSimplePlayer, playerInfoCoor);
                MvcUtil.addView(PlayerInfoItem.getInstance());
            }
        }

        private sendClientIP(vSimplePlayer: SimplePlayer){
            let cardPwd:string = "未知位置";
                // (device.platform == "windows" || device.platform == "mac" || !gpsInfo) && "未知位置" ||
                // (gpsInfo.province + gpsInfo.city + gpsInfo.district + gpsInfo.street);
            let cardNo:string = vSimplePlayer.ip;
            let vParams = {itemID:GameConstant.UPDATE_PLAYER_CLIENT_IP,cardPwd:cardPwd,cardNo:cardNo};
            ServerUtil.sendMsg(new GameBuyItemMsg(vParams), MsgCmdConstant.MSG_GAME_BUY_ITEM_ACK);
        }


        /**
         * 获取玩家信息弹窗坐标
         * @param {PZOrientation} vPZOrientation
         * @returns {Array<number>}
         */
        private getPlayerInfoViewCoor(vPZOrientation: PZOrientation): Array<number> {
            let vTableBoardBaseView: TableBoardBaseView = TableBoardBaseView.getInstance();
            if (vPZOrientation === PZOrientation.UP) {
                let viewX = vTableBoardBaseView.headViewUp.x;
                let viewY = vTableBoardBaseView.headViewUp.y;
                let iconY = vTableBoardBaseView.headViewUp.headIcon.y;
                return [viewX - iconY, viewY + iconY + 85];
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

        // /**
        //  * 注册之后调用
        //  */
        // public onRegister():void {
        //     egret.log("--TableBoardBaseViewMediator--onRegister");
        // }
        //
        // /**
        //  * 移除之后调用
        //  */
        // public onRemove():void {
        //     egret.log("--TableBoardBaseViewMediator--onRemove");
        // }

        /**
         * 感兴趣的通知指令
         * @returns {Array<any>}
         */
        public listNotificationInterests(): Array<any> {
            return [
                MJGameModule.MJGAME_UPDATE_PLAYER,
                MJGameModule.MJGAME_TING,
                MJGameModule.MJGAME_SELECTED_ZUO_LA_PAO,
                MJGameModule.MJGAME_SELECTED_XIA_MA,
                CommonModule.COMMON_SHOW_TALK_ANI,
                CommonModule.COMMON_HIDE_TALK_ANI,
            ];
        }

        /**
         * 处理通知
         * @param {puremvc.INotification} pNotification
         */
        public handleNotification(pNotification: puremvc.INotification): void {
            let data: any = pNotification.getBody();
            switch (pNotification.getName()) {
                case MJGameModule.MJGAME_UPDATE_PLAYER: {
                    this.getView().updateHeadArea(data);
                    break;
                }
                case MJGameModule.MJGAME_TING: {
                    this.ting(data);
                    break;
                }
                case MJGameModule.MJGAME_SELECTED_ZUO_LA_PAO: {
                    this.exeSelectedZuoLaPao(data);
                    break;
                }
                case MJGameModule.MJGAME_SELECTED_XIA_MA: {
                    this.exeSelectedXiaMa(data);
                    break;
                }
                case CommonModule.COMMON_SHOW_TALK_ANI: {
                    this.getView().showTalkAni(data);
                    break;
                }
                case CommonModule.COMMON_HIDE_TALK_ANI: {
                    this.getView().hideTalkAni(data);
                    break;
                }
            }
        }

        private getView(): TableBoardBaseView {
            return <TableBoardBaseView>this.viewComponent;
        }

        private ting(pzOrientation: PZOrientation) {
            // egret.log("## pzOrientation="+pzOrientation);
            //播放音效
            MJGameSoundHandler.ting(pzOrientation);
            this.getView().addPlayerTingIcon(pzOrientation);
        }

        /**
         * 处理已经选择的坐拉跑
         * @param {FL.PZOrientation[]} pPZOrientationArray
         */
        private exeSelectedZuoLaPao(pPZOrientationArray: PZOrientation[]): void {
            for (let vIndex:number = 0, vLength:number = pPZOrientationArray.length; vIndex < vLength; ++vIndex) {
                let vCurrPZOrientation:PZOrientation = pPZOrientationArray[vIndex];
                let vPlayerZuoLaPaoInfo:PlayerZuoLaPaoInfo = MJGameHandler.getPlayerZuoLaPaoInfo(vCurrPZOrientation);
                if (vPlayerZuoLaPaoInfo) {
                    this.getView().getHeadAreaView(vCurrPZOrientation).setZuoLaPao(vCurrPZOrientation, vPlayerZuoLaPaoInfo);
                }
            }
        }

        /**
         * 处理已经选择的下码
         * @param {FL.PZOrientation[]} pPZOrientationArray
         */
        private exeSelectedXiaMa(pPZOrientationArray: PZOrientation[]): void {
            for (let vIndex:number = 0, vLength:number = pPZOrientationArray.length; vIndex < vLength; ++vIndex) {
                let vCurrPZOrientation:PZOrientation = pPZOrientationArray[vIndex];
                let vXiaMaValue:number = MJGameHandler.getPlayerXiaMaInfo(vCurrPZOrientation);
                if (vXiaMaValue === 1 || vXiaMaValue === 0 ) {
                    this.getView().getHeadAreaView(vCurrPZOrientation).setXiaMa(vCurrPZOrientation, vXiaMaValue);
                }
            }
        }

        /**
         * 处理拷贝房间号
         * @param {egret.TouchEvent} e
         */
        private exeCopyRoomId(e: egret.TouchEvent): void {
            if (Game.CommonUtil.isNative) {
                let str = "房间号：[" + MJGameHandler.getVipRoomId() + "]"+"【"+GConf.Conf.gameName+"】【"+MJGameHandler.getMJGameNameText()+"】\n";
                let descStr: string = "";
                let numStr: Array<string> = ["零", "一", "二", "三", "四"];
                let totalJu: number = MJGameData.requestStartGameMsgAck.totalHand;
                let maxPlayers: number = MJGameHandler.getGameMaxNum();
                let curentPlayers: number = MJGameHandler.getGamePlayerArray().length;
                descStr = (totalJu + "局，"+maxPlayers+"人，"+numStr[curentPlayers]+"缺"+numStr[maxPlayers-curentPlayers])+"\n";
                str += descStr;
                let rulestr = MJGameHandler.getWanfaSubDescStrNoPersonNum();
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
         * 处理分享给朋友
         * @param {egret.TouchEvent} e
         */
        private exeInviteFriend(e: egret.TouchEvent): void {
            if (Game.CommonUtil.isNative) {
                let shareData = new nativeShareData();
                shareData.type = ShareWXType.SHARE_URL;
                shareData.url = NativeBridge.mShareUrl;
                let roomId = MJGameHandler.getVipRoomId();
                shareData.title = "【"+GConf.Conf.gameName+"】【"+MJGameHandler.getMJGameNameText()+"】房间号：["+roomId+"]";
                let descStr: string = "";
                let numStr: Array<string> = ["零", "一", "二", "三", "四"];
                let totalJu: number = MJGameData.requestStartGameMsgAck.totalHand;
                let maxPlayers: number = MJGameHandler.getGameMaxNum();
                let curentPlayers: number = MJGameHandler.getGamePlayerArray().length;
                descStr += (totalJu + "局，"+maxPlayers+"人，"+numStr[curentPlayers]+"缺"+numStr[maxPlayers-curentPlayers])+"\n";
                let rulestr = MJGameHandler.getWanfaSubDescStrNoPersonNum();
                rulestr = rulestr.replace(/\n/g, ",");
                rulestr = rulestr.slice(0, rulestr.length-1);
                descStr += rulestr;
                shareData.desc = descStr;
                shareData.extraType = InviteXLType.INVITE_ROOM;
                shareData.extraContent = roomId + "";
                NativeBridge.getInstance().mShareData = shareData;

                MvcUtil.send(CommonModule.COMMON_NATIVE_SHARE_CHOOSE_ROAD, SHARE_CHOOSE_TYPE.SHARE_CHOOSE_NO_FRIEND);
            }
            else {
                MvcUtil.send(CommonModule.COMMON_SHOW_SHARE_REMINDER_VIEW, ShareReminderTypeEnum.FRIENDS);
            }
        }

    }
}