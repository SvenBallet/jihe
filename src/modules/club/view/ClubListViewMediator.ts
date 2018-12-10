module FL {
    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase - ClubListViewMediator
     * @Description:  //
     * @Create: ArielLiang on 2018/3/10 15:50
     * @Version: V1.0
     */
    export class ClubListViewMediator extends puremvc.Mediator implements puremvc.IMediator {

        public static readonly NAME: string = "ClubListViewMediator";
        public flag_creatView = false;

        constructor(pView: ClubListView) {
            super(ClubListViewMediator.NAME, pView);
            let self = this;
            pView.closeGroup.addEventListener(egret.TouchEvent.TOUCH_TAP, self.closeView, self);
            pView.createBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, self.createClub, self);
            pView.searchBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, self.searchClub, self);
        }

        /**
         * 关闭界面
         */
        private closeView(): void {
            MvcUtil.send(LobbyModule.LOBBY_INTO_LOBBY);
        }

        /**
         * 创建俱乐部
         */
        private createClub(): void {
            let vPlayerVO: PlayerVO = LobbyData.playerVO;
            let playerType = vPlayerVO.playerType;
            if (playerType >= 3) {
                if (!this.flag_creatView) {
                    this.flag_creatView = true;
                    MvcUtil.addView(new ClubCreateView());
                }
            } else {
                let conf = LobbyHandler.getOneClientConfig(GameConfigConstant.CONF_WX_CLUB_SERVICE);
                let wx = conf.valueStr;
                ReminderViewUtil.showReminderView({ hasLeftBtn: true, hasRightBtn: false, text: "你不是代理，不能创建俱乐部\n申请代理联系客服微信：" + wx }); //申请代理联系客服微信：xxx
            }

        }



        /**
         * 搜索俱乐部
         */
        private searchClub(): void {
            let self = this;
            self.getView().searchContent = new NumberInput();
            let vNumberInputAreaView: NumberInputAreaView = new NumberInputAreaView(self.getView().searchContent, 999999, 100000, new MyCallBack(self.confirmSearch, self));
            self.getView().searchContent.confirmBtnText = "搜索";
            self.getView().searchContent.titleLabelText = "俱乐部ID";
            MvcUtil.addView(vNumberInputAreaView);
        }

        /**
         * 确认输入
         */
        private confirmSearch(): void {
            let searchContent: string = this.getView().searchContent.text;
            let vSearchClubMsg: SearchClubMsg = new SearchClubMsg();
            vSearchClubMsg.content = searchContent;
            vSearchClubMsg.page = 1;
            vSearchClubMsg.unused_0 = 1; //从搜索按钮点击搜索
            ServerUtil.sendMsg(vSearchClubMsg, MsgCmdConstant.MSG_SEARCH_CLUB_ACK);
        }

        /**
         * 感兴趣的通知指令
         * @returns {Array<any>}
         */
        public listNotificationInterests(): Array<any> {
            return [
                ClubModule.CLUB_SHOW_CLUB_LIST,
                ClubModule.CLUB_CREATE_CLUB_CLOSE
            ];
        }

        /**
         * 处理通知
         * @param {puremvc.INotification} pNotification
         */
        public handleNotification(pNotification: puremvc.INotification): void {
            let data: any = pNotification.getBody();
            switch (pNotification.getName()) {
                case ClubModule.CLUB_SHOW_CLUB_LIST: {
                    this.showClubList(data);
                    break;
                }
                case ClubModule.CLUB_CREATE_CLUB_CLOSE: {
                    this.flag_creatView = false;
                    break;
                }
            }
        }

        /**
         * 显示俱乐部列表
         * @param {FL.SearchClubMsgAck} msg
         */
        private showClubList(msg: SearchClubMsgAck): void {
            let list: Array<any> = msg.result;
            if (list == null) {
                return;
            }
            this.getView().clubGroup.removeChildren();
            for (let i = 0; i < list.length; i++) {
                let vClubListItemView = new ClubListItemView(list[i]);
                this.getView().clubGroup.addChild(vClubListItemView);
            }
        }

        /**
         * 获取当前视图
         * @returns {FL.ClubListView}
         */
        private getView(): ClubListView {
            return this.viewComponent;
        }


    }
}