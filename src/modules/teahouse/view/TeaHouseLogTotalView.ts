module FL {
    /** 茶楼战绩---茶楼总战绩页面 */
    export class TeaHouseLogTotalView extends TeaHouseLogCommonView {
        protected childrenCreated() {
            let self = this;
            self.initView();
        }

        /** 初始化页面 */
        protected initView() {
            //-----test
            this.bgImg.visible = false;
            // this.data = [];
            // for (let i = 0; i < 10; i++) {
            //     this.data.push({ isReplay: true, index: i, date: "2018/2/2 19:00:00", playerInfo: ["lol：" + i, "yqq：" + i], id: i })
            // }
            this.isCanReplay(true);
            this.scroller.scrollPolicyH = "off";
            if (!this.arrCollection) this.arrCollection = new eui.ArrayCollection();
            this.dataGroup.dataProvider = this.arrCollection;
            this.dataGroup.itemRenderer = TeaHouseLogRecordItemView;
            this.scroller.viewport = this.dataGroup;
            this.refreshView(this.data);
            TeaHouseMsgHandle.sendAllRecordListMsg()
        }
    }
}