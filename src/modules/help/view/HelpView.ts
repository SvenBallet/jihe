module FL {
    /** 玩法界面 */
    export class HelpView extends BaseView {

        public readonly mediatorName: string = "";
        public readonly viewLayer: ViewLayerEnum = ViewLayerEnum.POPUP;

        public closeGroup: eui.Image;
        public closeBtn: eui.Image;

        //麻将
        public mjGroup: eui.Group;
        public mjImg: eui.Image;
        public mjTitle: eui.Image;

        //扑克
        public pokerGroup: eui.Group;
        public pokerImg: eui.Image;
        public pokerTitle: eui.Image;

        public btnList: eui.List;
        public titleLabel: eui.Label;
        public contentLabel: eui.Label;
        public scroller: eui.Scroller;

        /** 麻将玩法选项 */
        private mjWanfa: string[] = ['转转麻将', '长沙麻将', '红中麻将'];
        /** 扑克玩法选项 */
        private pkWanfa: string[] = ['跑得快'];

        public flag_width: number = 0;
        //先前的选项卡，默认是0
        private flag_preTag: number = 0;
        //先前的选中项, 默认是0
        private flag_preIndex: number = 0;
        public constructor() {
            super();
            this.left = this.right = 20;
            this.top = this.bottom = 10;
            this.verticalCenter = this.horizontalCenter = 0;
            this.skinName = "skins.HelpViewSkin";
        }

        protected childrenCreated(): void {
            super.childrenCreated();
            let self = this;
            TouchTweenUtil.regTween(self.closeGroup, self.closeBtn);
            self.scroller.verticalScrollBar.autoVisibility = false;
            self.closeGroup.addEventListener(egret.TouchEvent.TOUCH_TAP, self.closeView, self);
            self.pokerGroup.addEventListener(egret.TouchEvent.TOUCH_TAP, self.changeTag, self);
            self.mjGroup.addEventListener(egret.TouchEvent.TOUCH_TAP, self.changeTag, self);
            self.btnList.addEventListener(eui.ItemTapEvent.ITEM_TAP, self.onChooseItem, self);
            // self.initView();
            self.initBtnList();
            //用于处理渲染后得到scroller的宽高，再选择默认选择项
            self.scroller.once(egret.Event.RENDER, () => {
                this.onChooseItem();
            }, this);
        }

        /** 初始化左侧按钮列表 */
        public initBtnList() {
            let arr;
            if (!this.flag_preTag) {
                arr = new eui.ArrayCollection(this.mjWanfa);
            } else {
                arr = new eui.ArrayCollection(this.pkWanfa);
            }
            this.btnList.dataProvider = arr;
            this.btnList.itemRenderer = ClubBtnListItemView;
            //默认选中第一个
            this.btnList.selectedIndex = 0;
            this.onChooseItem();
        }
        // public initView() {
        //     this.btnList.itemRendererSkinName = "skins.AgentItemViewSkin";
        //     this.btnList.dataProvider = new eui.ArrayCollection(["转转麻将"]);
        //     this.btnList.selectedIndex = 0;//设置默认选中项   
        //     this.loadTextPage(0);
        //     this.btnList.addEventListener(eui.ItemTapEvent.ITEM_TAP, this.onChooseItem, this);
        // }

        /**
         * 切换选项卡
         */
        private changeTag(e: egret.TouchEvent) {
            let tag = 0;
            if (e.currentTarget == this.pokerGroup) {
                tag = 1;
            }
            if (tag == this.flag_preTag) return;//本次点击跟上次一样，不处理
            this.flag_preIndex = 0;
            if (!tag) {
                this.mjTitle.source = "majiang_chosen_png";
                this.pokerTitle.source = "poker_unchosen_png";
                this.mjImg.visible = true;
                this.pokerImg.visible = false;

            } else {
                this.mjTitle.source = "majiang_unchosen_png";
                this.pokerTitle.source = "poker_chosen_png";
                this.mjImg.visible = false;
                this.pokerImg.visible = true;
            }
            this.flag_preTag = tag;
            this.initBtnList();
        }

        /** 选择按钮项 */
        public onChooseItem(e?: eui.PropertyEvent): void {
            let index = this.btnList.selectedIndex;
            if (index != this.flag_preIndex) {
                //改变先前的选中项
                let preItem: any = this.btnList.getChildAt(this.flag_preIndex);
                if (preItem) preItem.onUnchosen();
                //改变当前选中项的显示状态
                let item: any = this.btnList.getChildAt(index);
                if (item) item.onChosen();
            }
            this.flag_preIndex = index;
            this.loadTextContent();
        }

        /** 根据按钮项显示当前玩法内容 */
        private loadTextContent() {
            let jsonArray = (!this.flag_preTag) ? ["zhuanzhuan_json", 'changshamj_json', 'hongzhong_json'] : ['paodekuai_json'];
            let jsonData = RES.getRes(jsonArray[this.flag_preIndex]);
            this.scroller.removeChildren();
            this.scroller.stopAnimation();
            if (!jsonData) return;
            this.titleLabel.textFlow = (new egret.HtmlTextParser).parser(jsonData.title);
            let width = this.scroller.width;
            let group = HtmlTextParserUtil.getHtmlTextGroup({
                name: jsonArray[this.flag_preIndex],
                width: width,
                left: 2,
                right: 2,
                textColor: 0xB95A00,
                lineSpacing: 12
            });
            this.scroller.viewport = group;
            this.scroller.scrollPolicyH = "off";
            // this.contentLabel.textFlow = (new egret.HtmlTextParser).parser(jsonData.desc);
            this.scroller.viewport.scrollV = -10;
        }

        // public loadTextPage(index: number) {
        //     let jsonArray = ["zhuanzhuan_json"];
        //     let jsonData = RES.getRes(jsonArray[index]);
        //     this.scroller.stopAnimation();
        //     this.titleLabel.textFlow = (new egret.HtmlTextParser).parser(jsonData.title);
        //     let width = this.scroller.width;
        //     let group = HtmlTextParserUtil.getHtmlTextGroup({
        //         name: jsonArray[index],
        //         width: width,
        //         left: 2,
        //         right: 2,
        //         textColor: 0x326e87,
        //         lineSpacing: 12
        //     });
        //     this.scroller.viewport = group;
        //     this.scroller.scrollPolicyH = "off";
        //     // this.contentLabel.textFlow = (new egret.HtmlTextParser).parser(jsonData.desc);
        //     this.scroller.viewport.scrollV = 0;
        // }

        public closeView() {
            MvcUtil.delView(this);
        }

    }
}