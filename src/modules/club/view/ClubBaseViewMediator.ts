module FL {
    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase - ClubBaseViewMediator
     * @Description:  俱乐部调停者
     * @Create: ArielLiang on 2018/3/7 10:42
     * @Version: V1.0
     */
    export class ClubBaseViewMediator extends puremvc.Mediator implements puremvc.IMediator {

        public static readonly NAME: string = "ClubBaseViewMediator";
        public vItem: ClubBaseView = this.viewComponent;

        constructor(pView: ClubBaseView) {
            super(ClubBaseViewMediator.NAME, pView);
            let self = this;

            /**
             * 注冊监听事件
             */
            pView.closeGroup.addEventListener(egret.TouchEvent.TOUCH_TAP, self.closeView, self);
            pView.btnList.addEventListener(eui.ItemTapEvent.ITEM_TAP, self.onChooseItem, self);
            pView.leftGroup.addEventListener(egret.TouchEvent.TOUCH_TAP, self.loadPreviousPage, self);
            pView.rightGroup.addEventListener(egret.TouchEvent.TOUCH_TAP, self.loadNextPage, self);
            pView.addDiamondGroup.addEventListener(egret.TouchEvent.TOUCH_TAP, self.addDiamond, self);
            pView.refreshBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, self.loadNewPage, self);
            pView.autoOpenRoomBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, self.openRoom, self);
            pView.commonBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, self.commmonFun, self);
            pView.backupBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, self.backUpFun, self);
        }

        /**
         * 获取当前视图
         * @returns {FL.ClubBaseView}
         */
        private getView(): ClubBaseView {
            return <ClubBaseView>this.viewComponent;
        }

        /**
         * 移除自动调用
         */
        public onRemove(): void {
            egret.localStorage.removeItem("intoClubRoomList");
        }

        /**
         * 关闭界面
         */
        private closeView(): void {
            MvcUtil.addView(new ClubListView());
            MvcUtil.send(ClubModule.CLUB_INTO_CLUB);
        }

        /**
         * 新增钻石
         */
        private addDiamond(): void {
            MvcUtil.addView(new ClubAddDiamondView());
        }

        /**
         * 自动开房设置
         */
        private openRoom(): void {
            //进入创建游戏界面
            egret.localStorage.setItem("agentRoomType", "3");
            let vGetTableSettingsMsg: GetTableSettingsMsg = new GetTableSettingsMsg();
            vGetTableSettingsMsg.clubId = ClubData.vClub.id;
            ServerUtil.sendMsg(vGetTableSettingsMsg, MsgCmdConstant.MSG_GET_TABLE_SETTINGS_ACK);
        }

        /**
         * 显示页面
         * @Written: HoyeLee
         * @param {eui.ItemTapEvent} e
         */
        private onChooseItem(e: eui.ItemTapEvent): void {
            // console.log(e.currentTarget.selectedIndex);
            let tabIndex = e.currentTarget.selectedIndex;
            this.vItem.refreshBtnListView();
            this.vItem.totalPage = 1;
            this.vItem.currentPage = 1;
            this.vItem.pageLabel.text = "第1页";
            this.vItem.loadContentPage(tabIndex);
        }


        /**
         * 排行榜、日志记录
         * @Written: HoyeLee
         * @param {any} data
         */
        private showList(data: any): void {
            // console.log('showList');
            if (!this.vItem.clubGroup.numChildren || !data) return;
            let page: any = this.vItem.clubGroup.getChildAt(this.vItem.clubGroup.numChildren - 1);
            if (page && page.refreshView) {
                // console.log('showList page');
                let len = page.refreshView(data);
                this.isLastPage(data.size, len);
            }
        }

        private optApplyList(type): void {
            if (!this.vItem.clubGroup.numChildren) return;
            let page: any = this.vItem.clubGroup.getChildAt(this.vItem.clubGroup.numChildren - 1);
            if (page && page.opperationApply) {
                // console.log('showList page');
                let len = page.opperationApply(type);
            }
        }

        /**
         * 操作申请列表
         * @Written
         * @param {any} data
         */
        private optList(data: any) {
            if (!this.vItem.clubGroup.numChildren || !data) return;
            let page: any = this.vItem.clubGroup.getChildAt(this.vItem.clubGroup.numChildren - 1);
            if (page && page.optView) {
                let len = page.optView(data);
            }
        }

        /**
         * 公告编辑返回
         * @Written: HoyeLee
         * @param {any} data
         */
        private noticeModify(data: any): void {
            if (!this.vItem.vClubDetailView || !data) return;
            this.vItem.vClubDetailView.refreshView(data);
        }

        /**
         * 解散俱乐部返回
         * @Written: HoyeLee
         * @param {any} data
         */
        private dismissClub(data: any) {
            if (!this.vItem.vClubDetailView || !data) return;
            this.vItem.vClubDetailView.dismissClubACK(data);
        }

        /**
         * 退出俱乐部返回
         * @Written: HoyeLee
         * @param {any} data
         */
        private exitClub(data: any) {
            if (!this.vItem.vClubDetailView) return;
            this.vItem.vClubDetailView.exitClubACK(data);
        }

        private showBubble(index) {
            if (!this.vItem.clubGroup.numChildren) return;
            let page: any = this.vItem.clubGroup.getChildAt(this.vItem.clubGroup.numChildren - 1);
            if (page && page.showBubbleView) {
                let len = page.showBubbleView(index);
            }
        }

        /**
         * 感兴趣的通知指令
         * @returns {Array<any>}
         */
        public listNotificationInterests(): Array<any> {
            return [
                ClubModule.CLUB_REFRESH_DIAMOND,
                ClubModule.CLUB_GET_ROOM_LIST,
                ClubModule.CLUB_SHOW_ROOM_LIST,
                ClubModule.CLUB_GET_MEMBER_LIST,
                ClubModule.CLUB_SHOW_MEMBER_LIST,
                ClubModule.CLUB_SHOW_RANK_LIST,
                ClubModule.CLUB_SHOW_LOG_LIST,
                ClubModule.CLUB_NOTICE_MODIFY,
                ClubModule.CLUB_DISMISS_CLUB,
                ClubModule.CLUB_EXIT_CLUB,
                ClubModule.CLUB_SHOW_APPLY_LIST,
                ClubModule.CLUB_OPT_APPLY_LIST,
                ClubModule.CLUB_REFRESH_VIEW,
                ClubModule.CLUB_SHOW_BUBBLE_VIEW
            ];
        }

        /**
         * 处理通知
         * @param {puremvc.INotification} pNotification
         */
        public handleNotification(pNotification: puremvc.INotification): void {
            let data: any = pNotification.getBody();
            switch (pNotification.getName()) {
                case ClubModule.CLUB_REFRESH_DIAMOND: {
                    ClubData.vClub.diamond = data;
                    this.getView().diamondNum.text = "" + data;
                    break;
                }
                case ClubModule.CLUB_GET_ROOM_LIST: {
                    //服务器传过来的页数索引(也就是当前页)pageIndex是从0开始的= =！。所以要-1
                    let page: number = this.getView().currentPage - 1;
                    this.getView().vClubRoomListView.sendMsg(page, 0);
                    break;
                }
                case ClubModule.CLUB_SHOW_ROOM_LIST: {
                    this.vItem.totalPage = data.totalPage?data.totalPage:1;
                    this.getView().vClubRoomListView.showRoomList(data);
                    //更新消耗的钻石
                    let diamondNum: number = data.unused_1;
                    MvcUtil.send(ClubModule.CLUB_REFRESH_DIAMOND, diamondNum);
                    break;
                }
                case ClubModule.CLUB_GET_MEMBER_LIST: {
                    let page: number = this.getView().currentPage;
                    let playerID: number = this.getView().inputPlayerIndex?parseInt(this.getView().inputPlayerIndex.text):0;
                    this.getView().vClubMemberListView.sendMsg(page,playerID);
                    if(this.getView().inputPlayerIndex){
                        this.getView().inputPlayerIndex.text = "0";
                    }
                    break;
                }
                case ClubModule.CLUB_SHOW_MEMBER_LIST: {
                    // this.getView().vClubMemberListView.showMemberList(data);
                    this.showList(data);
                    break;
                }
                case ClubModule.CLUB_SHOW_RANK_LIST: {
                    this.showList(data);
                    break;
                }
                case ClubModule.CLUB_SHOW_LOG_LIST: {
                    this.showList(data);
                    break;
                }
                case ClubModule.CLUB_NOTICE_MODIFY: {
                    this.noticeModify(data);
                    break;
                }
                case ClubModule.CLUB_DISMISS_CLUB: {
                    this.dismissClub(data);
                    break;
                }
                case ClubModule.CLUB_EXIT_CLUB: {
                    this.exitClub(data);
                    break;
                }
                case ClubModule.CLUB_SHOW_APPLY_LIST: {
                    this.showList(data);
                    this.vItem.drawRedPoint(data);
                    break;
                }
                case ClubModule.CLUB_OPT_APPLY_LIST: {
                    this.optList(data);
                    break;
                }
                case ClubModule.CLUB_REFRESH_VIEW: {
                    this.loadNewPage();
                    break;
                }
                case ClubModule.CLUB_SHOW_BUBBLE_VIEW: {
                    this.showBubble(data);
                    break;
                }
            }
        }

        /**
         * 判断当前页数是否为最末
         * @param {number} size 每一页的大小
         * @param {number} len  当前数据的长度
         * @Written: HoyeLee
         */
        private isLastPage(size: number, len: number): void {
            if (len > size) {
                console.log("err size or len");
            } else if (len == size) {
                //当前页面已满，可以继续翻页
                this.vItem.totalPage = this.vItem.currentPage + 1;
            } else {
                //当前页面未满，已经是最末页
                this.vItem.totalPage = this.vItem.currentPage;
            }
        }

        /**
         * 上一页
         * @param {egret.Event} e
         */
        private loadPreviousPage(e: egret.Event): void {
            let currentPage: number = this.vItem.currentPage;
            let previousPage: number = currentPage - 1 < 0 ? 0 : currentPage - 1;
            if (currentPage == 1) {
                PromptUtil.show("已经是第一页", PromptType.ALERT);
                return;
            }
            this.vItem.currentPage = previousPage;
            this.vItem.pageLabel.text = "第" + previousPage + "页";
            this.loadNewPage();
        }

        /**
         * 下一页
         * @param {egret.Event} e
         */
        private loadNextPage(e: egret.Event): void {
            let currentPage: number = this.vItem.currentPage;
            let totalPage: number = this.vItem.totalPage < 1 ? 1 : this.vItem.totalPage;
            if (currentPage == totalPage) {
                PromptUtil.show("已经是最后一页", PromptType.ALERT);
                return;
            }
            let nextPage: number = currentPage + 1 > totalPage ? totalPage : currentPage + 1;
            this.vItem.currentPage = nextPage;
            this.vItem.pageLabel.text = "第" + nextPage + "页";
            this.loadNewPage();
        }

        /**
         * 加载新页内容
         */
        private loadNewPage(): void {
            // let selectedIndex = this.getView().btnList.selectedIndex;
            let item = this.vItem.btnList.selectedItem;
            switch (item) {
                case EClubItemList[0]: {//房间列表
                    MvcUtil.send(ClubModule.CLUB_GET_ROOM_LIST);
                    break;
                }
                case EClubItemList[1]: {//成员列表
                    MvcUtil.send(ClubModule.CLUB_GET_MEMBER_LIST);
                    break;
                }
                case EClubItemList[2]: {//申请列表
                    this.vItem.sendShowApplyMsg();
                    break;
                }
                case EClubItemList[3]: {//排行榜
                    this.vItem.sendRankMsg();
                    break;
                }
                case EClubItemList[4]: {//日志记录
                    this.vItem.sendLogMsg();
                    break;
                }
            }
        }

        /**
         * 公共按钮点击
         * @param {egret.Event} e
         */
        private commmonFun(e: egret.Event): void {
            // let selectedIndex = this.getView().btnList.selectedIndex;
            let item = this.vItem.btnList.selectedItem;
            switch (item) {
                case EClubItemList[0]: {//俱乐部开房
                    //进入创建游戏界面
                    egret.localStorage.setItem("agentRoomType", "2");
                    MvcUtil.addView(new LobbyCreateGameView());
                    break;
                }
                case EClubItemList[1]: {//邀请好友
                    this.inviteFriend();
                    break;
                }
                case EClubItemList[2]: {//全部同意申请
                    let type;
                    type = OptApplyListMsg.AGREE;
                    this.optApplyList(type);
                    break;
                }
            }
        }

        /**
         * 备用按钮点击
         * @param {egret.Event} e
         */
        private backUpFun(e: egret.Event): void {
            let item = this.vItem.btnList.selectedItem;
            switch (item) {
                case EClubItemList[1]: {//搜索成员
                    let self = this;
                    self.getView().inputPlayerIndex = new NumberInput();
                    let vNumberInputAreaView: NumberInputAreaView = new NumberInputAreaView(self.getView().inputPlayerIndex, 999999, 100000, new MyCallBack(MvcUtil.send, MvcUtil, ClubModule.CLUB_GET_MEMBER_LIST));
                    self.getView().inputPlayerIndex.confirmBtnText = "搜索";
                    self.getView().inputPlayerIndex.titleLabelText = "成员ID";
                    MvcUtil.addView(vNumberInputAreaView);
                    break;
                }
                case EClubItemList[2]: {//全部拒绝申请
                    let type;
                    type = OptApplyListMsg.REJECT;
                    this.optApplyList(type);
                }
            }
        }

        private inviteFriend(): void {
            if (!GConf.Conf.useWXAuth) {
                PromptUtil.show("请在微信中使用该功能！", PromptType.ALERT);
                return;
            }
            // 分享给好友
            let shareToFriendsTitle: string = "【" + StringUtil.subStrSupportChinese(LobbyData.playerVO.playerName, 8) + "】邀请你来玩【" + GConf.Conf.gameName + "】";
            let shareToFriendsDesc: string = "俱乐部ID：" + ClubData.vClub.id;
            if (Game.CommonUtil.isNative) {
                let str = "俱乐部ID：["+ClubData.vClub.id+"]"+shareToFriendsTitle;
                let tipStr = "(复制此消息打开游戏可直接申请加入俱乐部)";
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
                WeChatJsSdkHandler.setTempShareInfo(shareToFriendsTitle, shareToFriendsDesc, shareToFriendsTitle, ShareReminderTypeEnum.CIRCLE_OF_FRIENDS);
            }
        }
    }
}