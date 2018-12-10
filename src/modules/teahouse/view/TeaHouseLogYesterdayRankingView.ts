module FL {
    /** 茶楼战绩---昨日战榜页面 */
    export class TeaHouseLogYesterdayRankingView extends TeaHouseLogCommonView {
        protected childrenCreated() {
            let self = this;
            self.initView();
        }

        /** 初始化页面 */
        protected initView() {
            //-----test
            this.scroller.scrollPolicyH = "off";
            if (!this.arrCollection) this.arrCollection = new eui.ArrayCollection();
            this.dataGroup.dataProvider = this.arrCollection;
            this.dataGroup.itemRenderer = TeaHouseLogRankingItemView;
            this.scroller.viewport = this.dataGroup;
            this.refreshView(this.data);
            TeaHouseMsgHandle.sendRankingListMsg(ShowTeaHouseWarsListMsg.WARS_LIST_FOR_YESTERDAY);
        }
    }
}