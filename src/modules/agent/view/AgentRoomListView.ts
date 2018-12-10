module FL {
    /**
     * *代开房房间列表
     */
    export class AgentRoomListView extends eui.Component {

        // public readonly mediatorName: string = AgentRoomListViewMediator.NAME;
        // public readonly viewLayer: ViewLayerEnum = ViewLayerEnum.POPUP;

        public inviteBtn: GameButton;

        public dismissBtn: GameButton;

        public roomID: eui.Label;
        public playMethod: eui.Label;
        public gameNum: eui.Label;
        public playerNum: eui.Label;

        public readonly msg: AgentDaiKaiInfo;


        public constructor(vmsg: AgentDaiKaiInfo) {
            super();
            this.verticalCenter = this.horizontalCenter = 0;
            this.skinName = "skins.AgentRoomListViewSkin";
            this.msg = vmsg;
        }

        protected childrenCreated(): void {
            super.childrenCreated();

            let self = this;

            self.roomID.text = "" + self.msg.tableId;
            self.playMethod.text = self.showMethodText(self.msg.MainGamePlayRule);
            self.gameNum.text = "" + self.msg.quanNum;
            self.playerNum.text = self.msg.onlinePlayerNum + "/" + self.msg.playerNum;

            //注册按钮点击缓动
            if (AgentAuthPlayerRoomListView.authPlayerID === 0) {
                TouchTweenUtil.regTween(self.inviteBtn, self.inviteBtn);
                TouchTweenUtil.regTween(self.dismissBtn, self.dismissBtn);
                self.inviteBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, self.invitePlayer, self);
                self.dismissBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, self.dismissRoom, self);
            } else {
                self.removeChild(self.inviteBtn);
                self.removeChild(self.dismissBtn);
            }

        }

        private showMethodText(methodCode: number) {
            if ((methodCode & MJGamePlayWay.ZHUANZHUAN) === MJGamePlayWay.ZHUANZHUAN) {
                return "转转麻将";
            }
            // else if((methodCode & MJGamePlayWay.LINGBIJIAZI) === MJGamePlayWay.LINGBIJIAZI){
            //     return "灵璧夹子";
            // }else if((methodCode & MJGamePlayWay.LINGBIGONGZI) === MJGamePlayWay.LINGBIGONGZI) {
            //     return "灵璧带拱子";
            // }else if((methodCode & MJGamePlayWay.HUAIBEI) === MJGamePlayWay.HUAIBEI){
            //     return "淮北玩法";
            // }else if((methodCode & MJGamePlayWay.DANGSHAN) === MJGamePlayWay.DANGSHAN){
            //     return "砀山玩法";
            // }
        }

        /**
         * 邀请好友
         */
        private invitePlayer(): void {
            // 分享给好友
            let self = this;
            if (!GConf.Conf.useWXAuth) {
                PromptUtil.show("请在微信中使用该功能！", PromptType.ALERT);
                return;
            }
            let shareToFriendsTitle: string = GameConstant.CURRENT_HANDLE.getAgentVipRoomShareTitle(self.msg.tableId);
            // TODO XXXXXXX
            let shareToFriendsDesc: string = GameConstant.CURRENT_HANDLE.getAgentVipRoomShareDesc(self.msg.quanNum, self.msg.MainGamePlayRule, self.msg.MinorGamePlayRuleList, self.msg.playerNum);
            let vGameParams: string = "{\"roomId\":" + self.msg.tableId + "}";
            if (Game.CommonUtil.isNative) {
                let str = "房间号：[" + GameConstant.CURRENT_HANDLE.getVipRoomId() + "]【" + StringUtil.subStrSupportChinese(LobbyData.playerVO.playerName, 8) + "】邀请你来玩【" + GConf.Conf.gameName + "】";
                let tipStr = "(复制此消息打开游戏可直接申请加入房间)";
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
            else {
                WeChatJsSdkHandler.setTempShareInfo(shareToFriendsTitle, shareToFriendsDesc, shareToFriendsTitle, ShareReminderTypeEnum.CIRCLE_OF_FRIENDS, vGameParams);
            }
        }

        private dismissRoom(): void {
            //弹出确认框
            ReminderViewUtil.showReminderView({
                hasLeftBtn: true,
                leftCallBack: new MyCallBack(this.realDismissRoom, this),
                hasRightBtn: true,
                text: "您确定要解散房间：" + this.msg.tableId + "吗？ 如果有玩家正在游戏也会直接进行结算！"
            });
        }

        private realDismissRoom(): void {
            let roomID: number = this.msg.tableId;
            let vParams = { itemID: GameConstant.AGENT_CMD_DISSMISS_TABLE, unused_0: roomID };
            ServerUtil.sendMsg(new GameBuyItemMsg(vParams), MsgCmdConstant.MSG_AGENT_DAIKAI_ACK);
        }

    }
}