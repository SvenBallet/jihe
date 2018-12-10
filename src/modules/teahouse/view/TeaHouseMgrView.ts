module FL {
    /** 茶楼管理页面 */
    export class TeaHouseMgrView extends BaseView {
        /** 单例 */
        private static _onlyOne: TeaHouseMgrView;
        //调停者名字，删除界面的时候会自动移除
        public readonly mediatorName: string = TeaHouseMgrViewMediator.NAME;
        //界面层级，UI框架自动管理
        public readonly viewLayer: ViewLayerEnum = ViewLayerEnum.POPUP_ONLY;
        /** 调停者 */
        private _mediator: TeaHouseMgrViewMediator;

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

        /** 左侧按钮数据 */
        private readonly BTN_ITEM: string[] = ["基础设置", "茶楼布局", "经营状况"];

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
                this._onlyOne = new TeaHouseMgrView();
            }
            return this._onlyOne;
        }

        protected childrenCreated() {
            let self = this;
            //注册缓动事件
            TouchTweenUtil.regTween(self.closeGroup, self.closeBtn);
            self._mediator = new TeaHouseMgrViewMediator(self);
        }

        /** 添加到舞台自动调用 */
        protected onAddView() {
            let self = this;
            //注册调停者
            MvcUtil.regMediator(self._mediator);
            self.initView();
        }

        /** 初始化页面 */
        private initView() {
            this.btnList.dataProvider = new eui.ArrayCollection(this.BTN_ITEM);
            this.btnList.itemRenderer = ClubBtnListItemView;
            this.btnList.selectedIndex = 0;
            this.flag_preSelected = this.btnList.selectedIndex;
            this.titleLab.text = "茶楼管理";
            this.titleImg.source = "th_mgr_png";
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
            //改变先前选中的按钮状态以及现在选中按钮的状态
            this.flag_preSelected = this.btnList.selectedIndex;
            this.viewGroup.removeChildren();
            switch (this.BTN_ITEM[this.flag_preSelected]) {
                case "基础设置":
                    this.viewGroup.addChild(new TeaHouseMgrSettingView());
                    break;
                case "茶楼布局":
                    this.viewGroup.addChild(new TeaHouseMgrLayoutView());
                    break;
                case "经营状况":
                    this.viewGroup.addChild(new TeaHouseMgrRunstateView());
                    break;
            }
        }
    }
}