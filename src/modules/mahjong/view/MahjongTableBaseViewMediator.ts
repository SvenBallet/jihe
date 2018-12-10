module FL {
    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase - MahjongTableBaseViewMediator
     * @Description:  //调停者
     * @Create: DerekWu on 2017/11/21 15:47
     * @Version: V1.0
     */
    export class MahjongTableBaseViewMediator extends puremvc.Mediator implements puremvc.IMediator {

        public static readonly NAME: string = "MahjongTableBaseViewMediator";

        constructor(pView: MahjongTableBaseView) {
            super(MahjongTableBaseViewMediator.NAME, pView);
            this.registerAllEvent(pView);
        }

        /**
         * 注册所有事件
         */
        private registerAllEvent(pView: MahjongTableBaseView): void {
            let self = this;
            pView.copyRoomId.addEventListener(egret.TouchEvent.TOUCH_TAP, self.exeCopyRoomId, self);
            pView.inviteFriend.addEventListener(egret.TouchEvent.TOUCH_TAP, self.exeInviteFriend, self);
            pView.headViewUp.headIconBg.addEventListener(egret.TouchEvent.TOUCH_TAP, self.showUpPlayerInfoView, self);
            pView.headViewLeft.headIconBg.addEventListener(egret.TouchEvent.TOUCH_TAP, self.showLeftPlayerInfoView, self);
            pView.headViewRight.headIconBg.addEventListener(egret.TouchEvent.TOUCH_TAP, self.showRightPlayerInfoView, self);
            pView.headViewDown.headIconBg.addEventListener(egret.TouchEvent.TOUCH_TAP, self.showDownPlayerInfoView, self);  //被挡住，暂时无效
            pView.readyBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, self.sendReady, self);
        }

        /**
         * 是否准备
         */
        private sendReady() {
            let msg = new NewGameTablePlayerReadyMsg();
            msg.readyAction = (this.getView().getCurReadyState()) ? 0 : 1;
            ServerUtil.sendMsg(msg);
        }

        /**
         * 上方玩家信息弹窗
         */
        private showUpPlayerInfoView(e: egret.Event) {
            if (MahjongHandler.isReplay()) return;
            let vGamePlayer: GamePlayer = MahjongHandler.getGamePlayerInfo(PZOrientation.UP);
            if (vGamePlayer) {
                let playerInfoCoor = this.getPlayerInfoViewCoor(PZOrientation.UP);
                egret.localStorage.setItem("PlayerInfoOrientation", "" + PZOrientation.UP);
                PlayerInfoItem.getInstance().setPlayerInfo2(vGamePlayer, playerInfoCoor);
                MvcUtil.addView(PlayerInfoItem.getInstance());
            }
        }

        /**
         * 左方玩家信息弹窗
         */
        private showLeftPlayerInfoView(e: egret.Event) {
            if (MahjongHandler.isReplay()) return;
            let vGamePlayer: GamePlayer = MahjongHandler.getGamePlayerInfo(PZOrientation.LEFT);
            if (vGamePlayer) {
                let playerInfoCoor: Array<number> = this.getPlayerInfoViewCoor(PZOrientation.LEFT);
                egret.localStorage.setItem("PlayerInfoOrientation", "" + PZOrientation.LEFT);
                PlayerInfoItem.getInstance().setPlayerInfo2(vGamePlayer, playerInfoCoor);
                MvcUtil.addView(PlayerInfoItem.getInstance());
            }
        }

        /**
         * 右方玩家信息弹窗
         */
        private showRightPlayerInfoView(e: egret.Event) {
            if (MahjongHandler.isReplay()) return;
            let vGamePlayer: GamePlayer = MahjongHandler.getGamePlayerInfo(PZOrientation.RIGHT);
            if (vGamePlayer) {
                let playerInfoCoor: Array<number> = this.getPlayerInfoViewCoor(PZOrientation.RIGHT);
                egret.localStorage.setItem("PlayerInfoOrientation", "" + PZOrientation.RIGHT);
                PlayerInfoItem.getInstance().setPlayerInfo2(vGamePlayer, playerInfoCoor);
                MvcUtil.addView(PlayerInfoItem.getInstance());
            }
        }

        /**
         * 下方玩家信息弹窗
         */
        private showDownPlayerInfoView(e: egret.Event) {
            if (MahjongHandler.isReplay()) return;
            let vGamePlayer: GamePlayer = MahjongHandler.getGamePlayerInfo(PZOrientation.DOWN);
            if (vGamePlayer) {
                let playerInfoCoor: Array<number> = this.getPlayerInfoViewCoor(PZOrientation.DOWN);
                egret.localStorage.setItem("PlayerInfoOrientation", "" + PZOrientation.DOWN);
                PlayerInfoItem.getInstance().setPlayerInfo2(vGamePlayer, playerInfoCoor);
                MvcUtil.addView(PlayerInfoItem.getInstance());
            }
        }

        private sendClientIP(vGamePlayer: GamePlayer){
            let cardPwd:string = "未知位置";
                // (device.platform == "windows" || device.platform == "mac" || !gpsInfo) && "未知位置" ||
                // (gpsInfo.province + gpsInfo.city + gpsInfo.district + gpsInfo.street);
            let cardNo:string = vGamePlayer.ip;
            let vParams = {itemID:GameConstant.UPDATE_PLAYER_CLIENT_IP,cardPwd:cardPwd,cardNo:cardNo};
            ServerUtil.sendMsg(new GameBuyItemMsg(vParams), MsgCmdConstant.MSG_GAME_BUY_ITEM_ACK);
        }


        /**
         * 获取玩家信息弹窗坐标
         * @param {PZOrientation} vPZOrientation
         * @returns {Array<number>}
         */
        private getPlayerInfoViewCoor(vPZOrientation: PZOrientation): Array<number> {
            let vMahjongTableBaseView: MahjongTableBaseView = MahjongTableBaseView.getInstance();
            if (vPZOrientation === PZOrientation.UP) {
                let viewX = vMahjongTableBaseView.headViewUp.x;
                let viewY = vMahjongTableBaseView.headViewUp.y;
                let iconY = vMahjongTableBaseView.headViewUp.headIcon.y;
                return [viewX - 45, viewY + iconY + 85];
            } else if (vPZOrientation === PZOrientation.LEFT) {
                let viewX = vMahjongTableBaseView.headViewLeft.x;
                let viewY = vMahjongTableBaseView.headViewLeft.y;
                return [viewX + 215 + 45, 0];
            } else if (vPZOrientation === PZOrientation.RIGHT) {
                let viewX = vMahjongTableBaseView.headViewRight.x;
                let viewY = vMahjongTableBaseView.headViewRight.y;
                return [viewX + 215 - 566, viewY + 85];
            } else if (vPZOrientation === PZOrientation.DOWN) {
                let viewX = vMahjongTableBaseView.headViewDown.x;
                let viewY = vMahjongTableBaseView.headViewDown.y;
                return [viewX + 215 + 85, viewY - 215 - 85];
            }
        }

        // /**
        //  * 注册之后调用
        //  */
        // public onRegister():void {
        //     egret.log("--MahjongTableBaseViewMediator--onRegister");
        // }
        //
        // /**
        //  * 移除之后调用
        //  */
        // public onRemove():void {
        //     egret.log("--MahjongTableBaseViewMediator--onRemove");
        // }

        /**
         * 感兴趣的通知指令
         * @returns {Array<any>}
         */
        public listNotificationInterests(): Array<any> {
            return [
                MahjongModule.MAHJONG_UPDATE_PLAYER_HEAD_AREA,
                MahjongModule.MAHJONG_PLAYER_NUM_CHANGE,
                MJGameModule.MJGAME_TING,
                MahjongModule.MAHJONG_SHOW_PIAO,
                CommonModule.COMMON_SHOW_TALK_ANI,
                CommonModule.COMMON_HIDE_TALK_ANI,
                RFGameModule.RFGAME_CAN_NOT_LEAVE_ROOM,
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
                    this.getView().updateHeadArea(data);
                    break;
                }
                case MahjongModule.MAHJONG_PLAYER_NUM_CHANGE: {
                    this.processPlayerNumChange(data);
                    break;
                }
                case MJGameModule.MJGAME_TING: {
                    this.ting(data);
                    break;
                }
                case MahjongModule.MAHJONG_SHOW_PIAO:{
                    this.exeSelectedPiaoFen(data);
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
                case RFGameModule.RFGAME_CAN_NOT_LEAVE_ROOM: {
                    this.getView().isShowReadyBtn(false);
                    break;
                }
            }
        }

        private getView(): MahjongTableBaseView {
            return <MahjongTableBaseView>this.viewComponent;
        }

        private ting(pzOrientation: PZOrientation) {
            // egret.log("## pzOrientation="+pzOrientation);
            //播放音效
            MJGameSoundHandler.ting(pzOrientation);
            this.getView().addPlayerTingIcon(pzOrientation);
        }

        /**
         * 处理已经选择的飘分
         * @param {FL.PZOrientation} pPZOrientation
         */
        private exeSelectedPiaoFen(pPZOrientation:PZOrientation): void {
            let vPiaoValue:number = MahjongHandler.getPlayerPiaoFenInfo(pPZOrientation);
            this.getView().getHeadAreaView(pPZOrientation).setPiaoFen(pPZOrientation, vPiaoValue);
        }


        /**
         * 处理拷贝房间号
         * @param {egret.TouchEvent} e
         */
        private exeCopyRoomId(e: egret.TouchEvent): void {
            if (Game.CommonUtil.isNative) {
                let str = "房间号：[" + MahjongHandler.getVipRoomId() + "]"+"【"+GConf.Conf.gameName+"】【"+MahjongHandler.getMJGameNameText()+"】\n";
                let descStr: string = "";
                let numStr: Array<string> = ["零", "一", "二", "三", "四"];
                let totalJu: number = MahjongData.requestStartGameMsgAck.totalPlayCount;
                let maxPlayers: number = MahjongHandler.getGameMaxNum();
                let curentPlayers: number = MahjongHandler.getGamePlayerArray().length;
                descStr = (totalJu + "局，"+maxPlayers+"人，"+numStr[curentPlayers]+"缺"+numStr[maxPlayers-curentPlayers])+"\n";
                str += descStr;
                let rulestr = MahjongHandler.getWanfaSubDescStrNoPersonNum();
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
                let roomId = MahjongHandler.getVipRoomId();
                // 分享魔窗链接
                shareData.url = NativeBridge.mMWshareUrl + "?roomid=" + roomId;
                shareData.title = "【"+GConf.Conf.gameName+"】【"+MahjongHandler.getMJGameNameText()+"】房间号：["+roomId+"]";
                let descStr: string = "";
                let numStr: Array<string> = ["零", "一", "二", "三", "四"];
                let totalJu: number = MahjongData.requestStartGameMsgAck.totalPlayCount;
                let maxPlayers: number = MahjongHandler.getGameMaxNum();
                let curentPlayers: number = MahjongHandler.getGamePlayerArray().length;
                descStr += (totalJu + "局，"+maxPlayers+"人，"+numStr[curentPlayers]+"缺"+numStr[maxPlayers-curentPlayers])+"\n";
                let rulestr = MahjongHandler.getWanfaSubDescStrNoPersonNum();
                rulestr = rulestr.replace(/\n/g, ",");
                rulestr = rulestr.slice(0, rulestr.length-1);
                descStr += rulestr;
                shareData.desc = descStr;

                // 分享小程序
                if (NativeBridge.appVersion >= 1.21) {
                    let appId = 10000037;
                    shareData.type = ShareWXType.SHARE_MINI;
                    shareData.miniID = NativeBridge.mShareMiniId;
                    shareData.miniPath = NativeBridge.mShareMiniPath + "?appId=" + appId + "&id=" + "beiyong" +"&roomId=" + roomId;

                    // 分享房间链接文本调整
                    if (1) {
                        shareData.title = MahjongHandler.getMJGameNameText() + " " + roomId + " " + "缺"+numStr[maxPlayers-curentPlayers]+"人 " + "点击加入>>>";
                    }
                }
                else {
                    // 分享房间链接文本调整
                    if (1) {
                        shareData.title = MahjongHandler.getMJGameNameText();
                        shareData.desc = roomId + " " + "缺"+numStr[maxPlayers-curentPlayers]+"人 " + "点击加入>>>"
                    }
                }
                

                shareData.extraType = InviteXLType.INVITE_ROOM;
                shareData.extraContent = roomId + "";
                NativeBridge.getInstance().mShareData = shareData;
                
                if (MahjongData.requestStartGameMsgAck.teaHouseId) {
                    MvcUtil.send(CommonModule.COMMON_NATIVE_SHARE_CHOOSE_ROAD, SHARE_CHOOSE_TYPE.SHARE_TEAHOUSE_INVITE);
                }
                else {
                    MvcUtil.send(CommonModule.COMMON_NATIVE_SHARE_CHOOSE_ROAD, SHARE_CHOOSE_TYPE.SHARE_CHOOSE_NO_FRIEND);
                }
            }
            else {
                if (MahjongData.requestStartGameMsgAck.teaHouseId) {
                    MvcUtil.send(CommonModule.COMMON_NATIVE_SHARE_CHOOSE_ROAD, SHARE_CHOOSE_TYPE.SHARE_TEAHOUSE_INVITE);
                }
                else {
                    MvcUtil.send(CommonModule.COMMON_SHOW_SHARE_REMINDER_VIEW, ShareReminderTypeEnum.FRIENDS);
                }
            }
        }

        /**
         * 玩家人数改变
         * @param {boolean} pIsAdd 是否新增
         */
        private processPlayerNumChange(pIsAdd:boolean): void {
            let vView: MahjongTableBaseView = this.getView();
            vView.headViewUp.setSelectedPlayerNumPattern();
            vView.headViewDown.setSelectedPlayerNumPattern();
            vView.headViewLeft.setSelectedPlayerNumPattern();
            vView.headViewRight.setSelectedPlayerNumPattern();
        }

    }
}