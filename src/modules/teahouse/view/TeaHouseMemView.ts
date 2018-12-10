module FL {
    /** 茶楼成员页面 */
    export class TeaHouseMemView extends BaseView {
        /** 单例 */
        private static _onlyOne: TeaHouseMemView;
        //调停者名字，删除界面的时候会自动移除
        public readonly mediatorName: string = TeaHouseMemViewMediator.NAME;
        //界面层级，UI框架自动管理
        public readonly viewLayer: ViewLayerEnum = ViewLayerEnum.POPUP_ONLY;
        /** 调停者 */
        private _mediator: TeaHouseMemViewMediator;

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

        /** 申请列表红点 */
        public redPonit: eui.Group;
        /** 左侧按钮数据 */
        private readonly BTN_ITEM: string[] = ["成员列表", "审核成员", "小二管理"];

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
                this._onlyOne = new TeaHouseMemView();
            }
            return this._onlyOne;
        }

        protected childrenCreated() {
            let self = this;
            //注册缓动事件
            TouchTweenUtil.regTween(self.closeGroup, self.closeBtn);
            self._mediator = new TeaHouseMemViewMediator(self);
        }

        /** 添加到舞台自动调用 */
        protected onAddView() {
            let self = this;
            //注册调停者
            MvcUtil.regMediator(self._mediator);
            self.initView();
        }

        protected onRemView() {
            if (this.redPonit && this.redPonit.parent) this.redPonit.parent.removeChild(this.redPonit);
        }

        /** 初始化页面 */
        private initView() {
            this.btnList.dataProvider = new eui.ArrayCollection(this.BTN_ITEM);
            this.btnList.itemRenderer = ClubBtnListItemView;
            this.btnList.selectedIndex = 0;
            this.flag_preSelected = this.btnList.selectedIndex;
            this.titleLab.text = "茶楼成员";
            this.titleImg.source = "th_mem_png";
            this.drawRedPoint(TeaHouseData.curApplyCount);
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
                case "成员列表":
                    this.viewGroup.addChild(new TeaHouseMemListView());
                    break;
                case "审核成员":
                    this.viewGroup.addChild(new TeaHouseMemApplyView());
                    break;
                case "小二管理":
                    this.viewGroup.addChild(new TeaHouseMemWaiterView());
                    break;
            }
        }

        /**
       * 绘制申请列表红点
       */
        public drawRedPoint(data: number) {
            if (this.redPonit) {//移除已有的红点，重新绘制
                if (this.redPonit.parent) this.redPonit.parent.removeChild(this.redPonit);
                this.redPonit = null;
                return this.drawRedPoint(data);
            }
            if (!data) return;
            let op = <IRedPointOptions>{};
            op.useText = true;
            op.text = "" + data;
            op.textSize = 20;
            op.radius = 15;
            let g = RedPointUtil.drawRedPoint(op);
            g.x = 205;
            g.y = 110;
            this.redPonit = g;
            this.btnList.addChild(this.redPonit);
        }

    }
}