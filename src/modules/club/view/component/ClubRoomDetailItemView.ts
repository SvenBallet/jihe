module FL {
    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase - ClubRoomDetailItemView
     * @Description:  俱乐部房间详情
     * @Create: ArielLiang on 2018/3/14 10:19
     * @Version: V1.0
     */
    export class ClubRoomDetailItemView extends eui.Component {

        public contentGroup: eui.Group;

        public cancelRoomBtn: GameButton;
        public playMethodBtn: GameButton;

        public vAgentDaiKaiInfo: AgentDaiKaiInfo;

        private curType: EGameType = EGameType.MJ;

        constructor(pAgentDaiKaiInfo: AgentDaiKaiInfo, curType: EGameType) {
            super();
            this.y = 60;
            this.curType = curType;
            this.skinName = "skins.ClubRoomDetailItemSkin";
            this.vAgentDaiKaiInfo = pAgentDaiKaiInfo;
        }

        protected childrenCreated(): void {
            super.childrenCreated();
            let self = this;

            //水平布局
            let layout = new eui.HorizontalLayout();
            layout.gap = 10;
            self.contentGroup.layout = layout;

            if (ClubData.vClub.myState === ClubData.CLUB_TYPE_MEMBER) {
                self.cancelRoomBtn.visible = false;
            }

            self.showPlayerDetail();

            TouchTweenUtil.regTween(self.cancelRoomBtn, self.cancelRoomBtn);
            TouchTweenUtil.regTween(self.playMethodBtn, self.playMethodBtn);

            self.cancelRoomBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, self.dismissRoom, self);
            self.playMethodBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, self.showPlayMethod, self);
        }

        /**
         * 显示玩家详情
         */
        public showPlayerDetail(): void {
            this.contentGroup.removeChildren();
            let list: Array<SimplePlayer> = this.vAgentDaiKaiInfo.playerList;
            for (let i = 0; i < this.vAgentDaiKaiInfo.playerNum; i++) {
                let vClubRoomPlayerDetailItemView: ClubRoomPlayerDetailItemView = new ClubRoomPlayerDetailItemView();
                vClubRoomPlayerDetailItemView.tableID = this.vAgentDaiKaiInfo.tableId;
                vClubRoomPlayerDetailItemView.mainGamePlayRule = this.vAgentDaiKaiInfo.MainGamePlayRule;
                if (list[i] == null) {
                    vClubRoomPlayerDetailItemView.vSimplePlayer = new SimplePlayer();
                } else {
                    vClubRoomPlayerDetailItemView.vSimplePlayer = list[i];
                }
                this.contentGroup.addChild(vClubRoomPlayerDetailItemView);
            }
        }

        /**
         *解散房间
         */
        private dismissRoom(): void {
            //弹出确认框
            ReminderViewUtil.showReminderView({
                hasLeftBtn: true,
                leftCallBack: new MyCallBack(this.realDismissRoom, this),
                hasRightBtn: true,
                text: "您确定要解散房间：" + this.vAgentDaiKaiInfo.tableId + "吗？ 如果有玩家正在游戏也会直接进行结算！"
            });
        }

        /**
         * 确认解散房间
         */
        private realDismissRoom(): void {
            let roomID: number = this.vAgentDaiKaiInfo.tableId;
            // let vParams = { itemID: GameConstant.AGENT_CMD_DISSMISS_TABLE, unused_0: roomID };
            // ServerUtil.sendMsg(new GameBuyItemMsg(vParams), MsgCmdConstant.MSG_AGENT_DAIKAI_ACK);

            let vClubDissmissRoomMsg: ClubDissmissRoomMsg = new ClubDissmissRoomMsg();
            vClubDissmissRoomMsg.clubId = ClubData.vClub.id;
            vClubDissmissRoomMsg.vipRoomId = roomID;
            ServerUtil.sendMsg(vClubDissmissRoomMsg, MsgCmdConstant.MSG_SHOW_TIP_MSG_ACK_NEW);
        }

        private canShowPlayMethod() {
            this.playMethodBtn.touchEnabled = true;
        }

        /**
         * 显示玩法
         */
        private showPlayMethod(): void {
            // let vClubGetInfoMsg:ClubGetInfoMsg = new ClubGetInfoMsg();
            // vClubGetInfoMsg.clubId
            // ServerUtil.sendMsg(vClubGetInfoMsg,MsgCmdConstant.MSG_CLUB_GET_INFO_ACK);
            this.playMethodBtn.touchEnabled = false;
            let roomInfo = this.vAgentDaiKaiInfo;
            GameConstant.setCurrentGame(this.curType);
            let method: string = GameConstant.CURRENT_HANDLE.getWanfaSubDescStr(roomInfo.MainGamePlayRule, roomInfo.MinorGamePlayRuleList, roomInfo.playerNum);
            ReminderViewUtil.showReminderView({ hasLeftBtn: true, hasRightBtn: false, text: method, leftCallBack: this.canShowPlayMethod.bind(this) });
        }

    }
}