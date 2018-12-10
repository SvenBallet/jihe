module FL {
    /** 茶楼战绩页面调停者 */
    export class TeaHouseLogViewMediator extends puremvc.Mediator implements puremvc.IMediator {
        public static readonly NAME: string = "TeaHouseLogViewMediator";

        constructor(pView: TeaHouseLogView) {
            super(TeaHouseLogViewMediator.NAME, pView);
            this.registerAllEvent(pView);
        }

        /**
         * 注册所有事件
         */
        private registerAllEvent(pView: TeaHouseLogView): void {
            let self = this;
            pView.closeGroup.addEventListener(egret.TouchEvent.TOUCH_TAP, self.closeView, self);
            pView.btnList.addEventListener(eui.ItemTapEvent.ITEM_TAP, self.choseItem, self);
        }

        /**
        * 感兴趣的通知指令
        * @returns {Array<any>}
        */
        public listNotificationInterests(): Array<any> {
            return [
                TeaHouseModule.TH_REFRESH_MY_RECORD,
                TeaHouseModule.TH_REFRESH_ALL_RECORD,
                TeaHouseModule.TH_REFRESH_WINNER,
                TeaHouseModule.TH_REFRESH_RANKING,
            ];
        }

        /**
       * 处理通知
       * @param {puremvc.INotification} pNotification
       */
        public handleNotification(pNotification: puremvc.INotification): void {
            let data: any = pNotification.getBody();
            switch (pNotification.getName()) {
                case TeaHouseModule.TH_REFRESH_MY_RECORD:
                    this.refreshMyRecord(data);
                    break;
                case TeaHouseModule.TH_REFRESH_ALL_RECORD:
                    this.refreshAllRecord();
                    break;
                case TeaHouseModule.TH_REFRESH_WINNER:
                    this.refreshWinner();
                    break;
                case TeaHouseModule.TH_REFRESH_RANKING:
                    this.refreshRanking(data);
                    break;

            }
        }

        private getView(): TeaHouseLogView {
            return this.getViewComponent();
        }

        /** 获取右侧显示页面组子类 */
        private getViewGroupChild(): any {
            let vg = this.getView().viewGroup;
            return vg.getChildAt(vg.numChildren - 1);
        }

        /** 选择左侧按钮项 */
        private choseItem() {
            if (this.getView().btnList.selectedItem == this.getView().flag_preSelected) return;//点击同一个按钮
            this.getView().refreshBtnState();
            this.getView().loadContent();
        }

        /** 刷新页面 */
        private refreshView() {
            this.getView().loadContent();
        }

        /** 刷新我的战绩 */
        private refreshMyRecord(msg: GetTeaHouseMyRecordMsgAck) {
            let vgc = this.getViewGroupChild();
            let logList = TeaHouseHandle.handleRecordListData(TeaHouseData.teaHouseRecordList);
            if (vgc && vgc.refreshView) {
                vgc.refreshView(logList);
                this.getView().refreshTotal(msg);
            }
        }

        /** 刷新总的战绩 */
        private refreshAllRecord() {
            let vgc = this.getViewGroupChild();
            let logList = TeaHouseHandle.handleRecordListData(TeaHouseData.teaHouseRecordList);
            if (vgc && vgc.refreshView) vgc.refreshView(logList);
        }

        /** 刷新大赢家 */
        private refreshWinner() {
            let vgc = this.getViewGroupChild();
            let winnerList = TeaHouseHandle.handleWinnerListData(TeaHouseData.teaHouseWinnerList);
            if (vgc && vgc.refreshView) vgc.refreshView(winnerList);
        }

        /** 刷新战榜 */
        private refreshRanking(data) {
            let vgc = this.getViewGroupChild();
            let rankList = TeaHouseHandle.handleRankingListData(TeaHouseData.teaHouseRankingList, data);
            if (vgc && vgc.refreshView) vgc.refreshView(rankList);
        }

        /** 关闭页面 */
        private closeView() {
            MvcUtil.delView(this.getView());
        }
    }
}