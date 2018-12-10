module FL {
    /** 茶楼战绩---我的战绩页面 */
    export class TeaHouseLogMineView extends TeaHouseLogCommonView {

        public todayTapGroup:eui.Group;
        public todayTapImg:eui.Image;
        public todayTapLabel:eui.Label;
        public yesterdayTapGroup:eui.Group;
        public yesterdayTapImg:eui.Image;
        public yesterdayTapLabel:eui.Label;
        public thisWeekTapGroup:eui.Group;
        public thisWeekTapImg:eui.Image;
        public thisWeekTapLabel:eui.Label;

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
            //     this.data.push({ isReplay: false, index: i, date: "2018/2/2 19:00:00", playerInfo: ["lol：" + i, "yqq：" + i], id: i })
            // }
            this.isCanReplay(true);
            this.dayTab.visible = true;
            this.scroller.top = 79;
            this.scroller.scrollPolicyH = "off";
            if (!this.arrCollection) this.arrCollection = new eui.ArrayCollection();
            this.dataGroup.dataProvider = this.arrCollection;
            this.dataGroup.itemRenderer = TeaHouseLogRecordItemView;
            this.scroller.viewport = this.dataGroup;
            this.refreshView(this.data);
            //获取我的战绩列表 
            TeaHouseMsgHandle.sendMyRecordListMsg();

            this.todayTapGroup.addEventListener(egret.TouchEvent.TOUCH_TAP, this.selectTodayTab, this);
            this.yesterdayTapGroup.addEventListener(egret.TouchEvent.TOUCH_TAP, this.selectYesterdayTab, this);
            this.thisWeekTapGroup.addEventListener(egret.TouchEvent.TOUCH_TAP, this.selectThisWeekTab, this);
            this.selectTab(0);
        }

        /** 日期切换TAB */
        public selectTab(tabId:number): void {
            let self = this;
            if (tabId === 0) {
                self.todayTapImg.visible = true;
                self.todayTapLabel.textColor = 0xffffff;
            } else {
                self.todayTapImg.visible = false;
                self.todayTapLabel.textColor = 0xDF6227;
            }
            if (tabId === 1) {
                self.yesterdayTapImg.visible = true;
                self.yesterdayTapLabel.textColor = 0xffffff;
            } else {
                self.yesterdayTapImg.visible = false;
                self.yesterdayTapLabel.textColor = 0xDF6227;
            }
            if (tabId === 2) {
                self.thisWeekTapImg.visible = true;
                self.thisWeekTapLabel.textColor = 0xffffff;
            } else {
                self.thisWeekTapImg.visible = false;
                self.thisWeekTapLabel.textColor = 0xDF6227;
            }
        }

        private selectTodayTab() {
            this.selectTab(0);
            TeaHouseMsgHandle.sendMyRecordListMsg(0);
        }

        private selectYesterdayTab() {
            this.selectTab(1);
            TeaHouseMsgHandle.sendMyRecordListMsg(1);
        }

        private selectThisWeekTab() {
            this.selectTab(2);
            TeaHouseMsgHandle.sendMyRecordListMsg(2);
        }
    }
}