module FL {
    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase - ClubRoomListItemView
     * @Description:  房间列表条目
     * @Create: ArielLiang on 2018/3/13 19:40
     * @Version: V1.0
     */
    export class ClubRoomListItemView extends eui.Component {

        public roomID: eui.Label;
        public playMethod: eui.Label;
        public gameNum: eui.Label;
        public personNum: eui.Label;

        public shareBtn: GameButton;
        public detailBtn: GameButton;
        public enterBtn: GameButton;

        public static roomState: number = 0;

        public vClubRoomDetailItemView: ClubRoomDetailItemView;

        public vAgentDaiKaiInfo: AgentDaiKaiInfo;
        //此条目的游戏类型
        private flag_curType: EGameType = EGameType.MJ;

        constructor(pAgentDaiKaiInfo: AgentDaiKaiInfo) {
            super();
            this.verticalCenter = this.horizontalCenter = 0;
            this.skinName = "skins.ClubRoomListItemViewSkin";
            this.vAgentDaiKaiInfo = pAgentDaiKaiInfo;
        }

        protected childrenCreated(): void {
            super.childrenCreated();
            let self = this;

            self.setValue(self.vAgentDaiKaiInfo);

            TouchTweenUtil.regTween(self.shareBtn, self.shareBtn);
            TouchTweenUtil.regTween(self.detailBtn, self.detailBtn);
            TouchTweenUtil.regTween(self.enterBtn, self.enterBtn);

            self.shareBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, self.shareRoom, self);
            self.detailBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, self.showDetail, self);
            self.enterBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, self.joinRoom, self);
        }


        public setValue(data: AgentDaiKaiInfo): void {
            let self = this;
            self.roomID.text = "" + data.tableId;
            let str = MJGameHandler.getMJGameNameText(data.MainGamePlayRule);
            this.flag_curType = (str) ? EGameType.MJ : EGameType.RF;
            // let playMeth: string = MJGameHandler.getMJGameNameText(data.MainGamePlayRule) ? MJGameHandler.getMJGameNameText(data.MainGamePlayRule) : RFGameHandle.getCardGameNameText(data.MainGamePlayRule);
            let playMeth: string = (this.flag_curType == EGameType.MJ) ? str : RFGameHandle.getCardGameNameText(data.MainGamePlayRule);
            self.playMethod.text = playMeth;
            self.gameNum.text = "" + data.quanNum;
            self.personNum.text = data.onlinePlayerNum + "/" + data.playerNum;
        }

        private shareRoom(): void {
            let data = this.vAgentDaiKaiInfo;
            if (!GConf.Conf.useWXAuth) {
                PromptUtil.show("请在微信中使用该功能！", PromptType.ALERT);
                return;
            }
            // 分享给好友
            let self = this;
            let handle = (this.flag_curType == EGameType.MJ) ? MJGameHandler : RFGameHandle;
            let shareToFriendsTitle: string = handle.getAgentVipRoomShareTitle(data.tableId);
            let shareToFriendsDesc: string = handle.getClubVipRoomShareDesc(data.quanNum, data.MainGamePlayRule, data.MinorGamePlayRuleList, data.playerNum);


            let vGameParams: string = "{\"roomId\":" + data.tableId + "}";
            if (Game.CommonUtil.isNative) {
                let gameSmall = MJGameHandler.getMJGameNameText(data.MainGamePlayRule);
                this.flag_curType = (gameSmall) ? EGameType.MJ : EGameType.RF;
                let playMeth: string = (this.flag_curType == EGameType.MJ) ? gameSmall : RFGameHandle.getCardGameNameText(data.MainGamePlayRule);
                let str = "房间号：[" + data.tableId + "]【"+GConf.Conf.gameName+"】【"+playMeth+"】\n";

                let descStr: string = "";
                let numStr: Array<string> = ["零", "一", "二", "三", "四"];
                let totalJu: number = data.quanNum;
                let maxPlayers: number = data.playerNum;
                let curentPlayers: number = data.onlinePlayerNum;
                descStr = "俱乐部，"+(totalJu + "局，"+maxPlayers+"人，"+numStr[curentPlayers]+"缺"+numStr[maxPlayers-curentPlayers])+"\n";
                str += descStr;

                let handle = (this.flag_curType == EGameType.MJ) ? MJGameHandler : RFGameHandle;
                let rulestr = handle.getWanfaSubDescStrNoPersonNum(data.MainGamePlayRule, data.MinorGamePlayRuleList);
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
            else {
                WeChatJsSdkHandler.setTempShareInfo(shareToFriendsTitle, shareToFriendsDesc, shareToFriendsTitle, ShareReminderTypeEnum.CIRCLE_OF_FRIENDS, vGameParams);
            }
        }

        private showDetail(): void {
            let btnStatus = this.detailBtn.labelDisplay.text;
            this.vClubRoomDetailItemView = new ClubRoomDetailItemView(this.vAgentDaiKaiInfo, this.flag_curType);
            if (btnStatus === "详情") {
                this.y = 60;
                this.addChild(this.vClubRoomDetailItemView);
                this.detailBtn.labelDisplay.text = "返回";
            } else {
                this.removeChildAt(1);
                this.detailBtn.labelDisplay.text = "详情";
            }
        }

        private joinRoom(): void {
            // let vEnterVipRoomMsg:EnterVipRoomMsg = new EnterVipRoomMsg();
            // vEnterVipRoomMsg.tableID = "enter_room";
            // vEnterVipRoomMsg.roomID = this.vAgentDaiKaiInfo.tableId;
            // ServerUtil.sendMsg(vEnterVipRoomMsg, MsgCmdConstant.MSG_GAME_START_GAME_REQUEST_ACK);

            // 改为新的
            let vNewJoinVipRoomMsg: NewJoinVipRoomMsg = new NewJoinVipRoomMsg();
            vNewJoinVipRoomMsg.vipRoomID = this.vAgentDaiKaiInfo.tableId;
            ServerUtil.sendMsg(vNewJoinVipRoomMsg, MsgCmdConstant.MSG_INTO_GAME_TABLE);
        }

    }
}