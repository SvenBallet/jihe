module FL {
    /** 茶楼战绩页面 */
    export class TeaHouseLogView extends BaseView {
        /** 单例 */
        private static _onlyOne: TeaHouseLogView;
        //调停者名字，删除界面的时候会自动移除
        public readonly mediatorName: string = TeaHouseLogViewMediator.NAME;
        //界面层级，UI框架自动管理
        public readonly viewLayer: ViewLayerEnum = ViewLayerEnum.POPUP_ONLY;
        /** 调停者 */
        private _mediator: TeaHouseLogViewMediator;

        /** 关闭 */
        public closeGroup: eui.Group;
        private closeBtn: eui.Image;

        /** 左侧按钮列表 */
        public btnList: eui.List;

        /** 右侧显示组 */
        public viewGroup: eui.Group;

        /** 页面标题 */
        private titleLab: eui.Label;
        private titleImg: eui.Image;

        public myWarGro:eui.Group;
        public totalLab:eui.Label;
        public roundLab:eui.Label;
        public winLab:eui.Label;

        /** 左侧按钮数据 */
        // private readonly BTN_ITEM: string[] = ["我的战绩", "大赢家", "今日战榜", "昨日战榜", "排行榜", "茶楼战绩"];
        private readonly BTN_ITEM: string[] = ["我的战绩", "排行榜", "茶楼战绩"];

        /** 先前选中的按钮选项序号 */
        public flag_preSelected: number = 0;

        constructor() {
            super();
            this.left = this.right = this.bottom = this.top = 0;
            this.verticalCenter = this.horizontalCenter = 0;
            this.skinName = "skins.TeaHouseMgrViewSkin";
        }

        public static getInstance() {
            if (!this._onlyOne) {
                this._onlyOne = new TeaHouseLogView();
            }
            return this._onlyOne;
        }

        protected childrenCreated() {
            let self = this;
            //注册缓动事件
            TouchTweenUtil.regTween(self.closeGroup, self.closeBtn);
            self._mediator = new TeaHouseLogViewMediator(self);
        }

        /** 添加到舞台自动调用 */
        protected onAddView() {
            let self = this;
            //注册调停者
            MvcUtil.regMediator(self._mediator);
            self.initView();
        }

        /** 关闭页面 */
        public onRemView() {
            this.viewGroup.removeChildren();
        }

        /** 初始化页面 */
        private initView() {
            this.btnList.dataProvider = new eui.ArrayCollection(this.BTN_ITEM);
            this.btnList.itemRenderer = ClubBtnListItemView;
            this.btnList.selectedIndex = 0;
            this.flag_preSelected = this.btnList.selectedIndex;
            this.titleLab.text = "战绩";
            this.titleImg.source = "th_rec_png";
            this.loadContent();
        }

        /** 刷新选择按钮状态 */
        public refreshBtnState() {
            let pre: any = this.btnList.getChildAt(this.flag_preSelected);
            let now: any = this.btnList.getChildAt(this.btnList.selectedIndex);
            if (pre) pre.onUnchosen();
            if (now) now.onChosen();
        }

        /** 根据左侧按钮所选项显示右侧内容 */
        public loadContent() {
            //设置先前选中项
            this.flag_preSelected = this.btnList.selectedIndex;
            this.viewGroup.removeChildren();

            this.myWarGro.visible = false;
            switch (this.BTN_ITEM[this.flag_preSelected]) {
                case "我的战绩":
                    this.myWarGro.visible = true;
                    this.viewGroup.addChild(new TeaHouseLogMineView());
                    break;
                case "大赢家":
                    this.viewGroup.addChild(new TeaHouseLogWinnerView());
                    break;
                case "今日战榜":
                    this.viewGroup.addChild(new TeaHouseLogTodayRankingView());
                    break;
                case "昨日战榜":
                    this.viewGroup.addChild(new TeaHouseLogYesterdayRankingView());
                    break;
                case "排行榜":
                    this.viewGroup.addChild(new TeaHouseLogRankingView());
                    break;
                case "茶楼战绩":
                    this.viewGroup.addChild(new TeaHouseLogTotalView());
                    break;
            }
        }

        /** 刷新我的战绩统计 */
        public refreshTotal(msg: GetTeaHouseMyRecordMsgAck) {
            if (msg.todayTotalScore > 0) {
                this.totalLab.text = "+" + msg.todayTotalScore + "";
            }
            else {
                this.totalLab.text = msg.todayTotalScore + "";
            }
            this.roundLab.text = msg.playerCount + "";
            this.winLab.text = msg.bigWinnerCount + "";
        }
    }
}