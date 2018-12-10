module FL {
    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase - TeaHouseRankingView
     * @Description:  // 战绩排行榜界面
     * @Create: DerekWu on 2018/9/13 15:44
     * @Version: V1.0
     */
    export class TeaHouseLogRankingView  extends eui.Component {

        /** 标签页 */
        public todayTapGroup: eui.Group;
        public todayTapImg: eui.Image;
        public todayTapLabel: eui.Label;

        public yesterdayTapGroup: eui.Group;
        public yesterdayTapImg: eui.Image;
        public yesterdayTapLabel: eui.Label;

        public thisWeekTapGroup: eui.Group;
        public thisWeekTapImg: eui.Image;
        public thisWeekTapLabel: eui.Label;

        public lastWeekTapGroup: eui.Group;
        public lastWeekTapImg: eui.Image;
        public lastWeekTapLabel: eui.Label;

        public thisMonthTapGroup: eui.Group;
        public thisMonthTapImg: eui.Image;
        public thisMonthTapLabel: eui.Label;

        /** 分页 */
        public paginationGroup: eui.Group;
        public pageLab: eui.Label;
        public leftGroup: eui.Group;
        public leftBtn: eui.Image;
        public rightGroup: eui.Group;
        public rightBtn: eui.Image;

        /** 没有数据的提示 */
        public noRankingDataLabel:eui.Label;

        /** 数据显示组 */
        public scroller: eui.Scroller;
        public dataGroup: eui.DataGroup;

        /** 显示数据源 */
        protected arrCollection: eui.ArrayCollection;

        /** 钻石消耗量 */
        public consumeDiamondNum: eui.Label;
        /** 场次合计 */
        public changCiHeJiLabel: eui.Label;

        /** 标题 */
        public scoreTitleLabel: eui.Label;
        public bigWinCountTitle: eui.Label;

        /** 数据源 */
        protected data: any;

        /** 调停者 */
        private _mediator: TeaHouseLogRankingViewMediator;

        /** 选择的标签ID */
        private _selectTabId: number = 0;

        constructor() {
            super();
            let self = this;
            this.left = this.right = this.top = this.bottom = 0;
            this.skinName = "skins.TeaHouseLogRankingView";
            this.dataGroup.useVirtualLayout = false;
            self.addEventListener(egret.Event.ADDED_TO_STAGE, self.onAddView, self);
            self.addEventListener(egret.Event.REMOVED_FROM_STAGE, self.onRemoveView, self);
        }

        protected childrenCreated() {
            let self = this;
            self.initView();
            self.selectTab(0);
        }

        private initView(): void {
            let self = this;
            self.pageLab.text = "";
            self.consumeDiamondNum.text = "";
            self.changCiHeJiLabel.text = "";
            // 老板才显示 分数 和 大赢家
            let vTeaHouse: TeaHouse = TeaHouseData.teaHouse;
            if (!vTeaHouse || vTeaHouse.creatorIndex !== LobbyData.playerVO.playerIndex) {
                self.scoreTitleLabel.visible = false;
                self.bigWinCountTitle.visible = false;
            }

            self.noRankingDataLabel.visible = false;
            self.paginationGroup.visible = false;

            this.scroller.scrollPolicyH = "off";
            if (!this.arrCollection) this.arrCollection = new eui.ArrayCollection();
            this.dataGroup.dataProvider = this.arrCollection;
            this.scroller.viewport = this.dataGroup;
        }

        private onAddView(): void {
            let self = this;
            // 注册调停者
            self._mediator = new TeaHouseLogRankingViewMediator(this);
            MvcUtil.regMediator(self._mediator);
        }

        private onRemoveView(): void {
            MvcUtil.delMediator(TeaHouseLogRankingViewMediator.NAME);
        }

        public getSelectTabId(): number {
            return this._selectTabId;
        }

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
            if (tabId === 3) {
                self.lastWeekTapImg.visible = true;
                self.lastWeekTapLabel.textColor = 0xffffff;
            } else {
                self.lastWeekTapImg.visible = false;
                self.lastWeekTapLabel.textColor = 0xDF6227;
            }
            if (tabId === 4) {
                self.thisMonthTapImg.visible = true;
                self.thisMonthTapLabel.textColor = 0xffffff;
            } else {
                self.thisMonthTapImg.visible = false;
                self.thisMonthTapLabel.textColor = 0xDF6227;
            }
            self._selectTabId = tabId;
        }

        public resetNoRankingDataLabel(currPage:number): void {
            let self = this;
            let vTapName:string = "";
            switch (self._selectTabId) {
                case 0:
                    vTapName = self.todayTapLabel.text;
                    break;
                case 1:
                    vTapName = self.yesterdayTapLabel.text;
                    break;
                case 2:
                    vTapName = self.thisWeekTapLabel.text;
                    break;
                case 3:
                    vTapName = self.lastWeekTapLabel.text;
                    break;
                case 4:
                    vTapName = self.thisMonthTapLabel.text;
                    break;
            }
            let vDesc: string = "暂无数据！";
            if (currPage > 1) {
                vDesc = "当前页无数据！";
            }
            self.noRankingDataLabel.text = vTapName + vDesc;
        }

        /** 刷新页面 */
        public refreshView(data = this.data) {
            this.data = data;
            this.dataGroup.dataProvider = this.arrCollection;
            this.scroller.viewport = this.dataGroup;
            // this.scroller.viewport.scrollV = 0;
            this.arrCollection.replaceAll(this.data);
            this.dataGroup.validateNow();
        }

    }
}