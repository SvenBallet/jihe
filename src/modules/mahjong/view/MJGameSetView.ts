module FL {
    export class MJGameSetView extends BaseView{

        public readonly mediatorName: string = MJGameSetViewMediator.NAME;
        public readonly viewLayer: ViewLayerEnum = ViewLayerEnum.POPUP;


        public closeBtn:eui.Image;

        /**音效音乐开关*/
        public effectBtn:eui.Image;
        public musicBtn:eui.Image;

        /**背景色*/
        public backgroundGroup:eui.Group;
        public backgroundRadioGroup:eui.RadioButtonGroup;
        public green:eui.RadioButton;
        public blue:eui.RadioButton;
        public dark:eui.RadioButton;

        /** 麻将牌背颜色 */
        public paibeiGroup:eui.Group;
        public paibeiRadioGroup:eui.RadioButtonGroup;
        public paibeiGreen:eui.RadioButton;
        public paibeiYellow:eui.RadioButton;
        public paibeiBlue:eui.RadioButton;

        /**音效*/
        public soundEffectSld:eui.HSlider;

        /**音乐*/
        public musicSld:eui.HSlider;

        public pokerSytleGro:eui.Group;
        public pokerSytleRadioGro:eui.RadioButtonGroup;
        public pokerStyleS:eui.RadioButton;
        public pokerStyleP:eui.RadioButton;

        /**蓝色背景*/
        public static readonly BULE_BACKGROUND:string = "pz_bg_blue_jpg";
        /**绿色背景*/
        public static readonly GREEN_BACKGROUND:string = "pz_bg_green_jpg";
        /**深色背景*/
        public static readonly DARK_BACKGROUND:string = "pz_bg_dark_jpg";

        /** 绿色麻将子 */
        public static readonly MJ_PB_GREEN:string = "1";
        /** 黄色麻将子 */
        public static readonly MJ_PB_YELLOW:string = "2";
        /** 蓝色麻将子 */
        public static readonly MJ_PB_BLUE:string = "3";

        /** 小牌风格 */
        public static readonly POKER_STYLE_SMALL:string = "1";
        /** 大牌风格 */
        public static readonly POKER_STYLE_PLUS:string = "2";

        /** 普通话 */
        public static readonly LANGUAGE_STYLE_PUTONGHUA:string = "1";
        /** 长沙话 */
        public static readonly LANGUAGE_STYLE_CHANGSHAHUA:string = "2";

        public dayTab:eui.Group;
        public todayTapGroup:eui.Group;
        public todayTapImg:eui.Image;
        public todayTapLabel:eui.Label;
        public yesterdayTapGroup:eui.Group;
        public yesterdayTapImg:eui.Image;
        public yesterdayTapLabel:eui.Label;
        public thisWeekTapGroup:eui.Group;
        public thisWeekTapImg:eui.Image;
        public thisWeekTapLabel:eui.Label;
        public titleImg:eui.Image;
        public replayBtnGroup:eui.Group;
        public replayBtn:eui.Group;
        public replayBtnGroup0:eui.Group;
        public replayBtn0:eui.Group;
        public baseGro:eui.Group;
        public langGro:eui.Group;
        public pokerSytleGro0:eui.Group;
        public pokerStyleS0:eui.RadioButton;
        public pokerStyleP0:eui.RadioButton;
        public styleGro:eui.Group;
        public pokerSytleRadioGro0:eui.RadioButtonGroup;

        public pokerSytleGro1:eui.Group;
        public pokerStyleS1:eui.RadioButton;
        public pokerSytleRadioGro1:eui.RadioButtonGroup;


        /** 调停者 */
        private _mediator: MJGameSetViewMediator;

        private static _only: MJGameSetView;

        public static getInstance(): MJGameSetView {
            if (!this._only) {
                this._only = new MJGameSetView();
            }
            return this._only;
        }

        constructor () {
            super();
            this.verticalCenter = this.horizontalCenter = 0;
            this.skinName = "skins.MJGameSetViewSkin";
        }

        protected childrenCreated():void {
            super.childrenCreated();
            let self = this;

            TouchTweenUtil.regTween(self.closeBtn, self.closeBtn);
            TouchTweenUtil.regTween(self.effectBtn, self.effectBtn);
            TouchTweenUtil.regTween(self.musicBtn, self.musicBtn);
            TouchTweenUtil.regTween(self.replayBtnGroup, self.replayBtn);
            TouchTweenUtil.regTween(self.replayBtnGroup0, self.replayBtn0);

            /**设置声音音效最大值*/
            self.soundEffectSld.maximum = 100;
            self.musicSld.maximum = 100;

            /**背景色Radio默认值*/
            self.backgroundRadioGroup = new eui.RadioButtonGroup();
            self.green.group = self.backgroundRadioGroup;
            self.blue.group = self.backgroundRadioGroup;
            self.dark.group = self.backgroundRadioGroup;
            self.blue.value = MJGameSetView.BULE_BACKGROUND;
            self.green.value = MJGameSetView.GREEN_BACKGROUND;
            self.dark.value = MJGameSetView.DARK_BACKGROUND;
            self.backgroundRadioGroup.selectedValue = Storage.getPZResName()?Storage.getPZResName():MJGameSetView.GREEN_BACKGROUND;

            /** 麻将牌背 Radio 默认值*/
            self.paibeiRadioGroup = new eui.RadioButtonGroup();
            self.paibeiGreen.group = self.paibeiRadioGroup;
            self.paibeiYellow.group = self.paibeiRadioGroup;
            self.paibeiBlue.group = self.paibeiRadioGroup;
            self.paibeiGreen.value = MJGameSetView.MJ_PB_GREEN;
            self.paibeiYellow.value = MJGameSetView.MJ_PB_YELLOW;
            self.paibeiBlue.value = MJGameSetView.MJ_PB_BLUE;
            self.paibeiRadioGroup.selectedValue = (MahjongCardItem.cardBgColor + "") || "1";
            if (!MahjongCardItem.cardBgColor) {
                self.paibeiGreen.selected = true;
            }

            /** 扑克风格 */
            self.pokerSytleRadioGro = new eui.RadioButtonGroup();
            self.pokerStyleS.group = self.pokerSytleRadioGro;
            self.pokerStyleP.group = self.pokerSytleRadioGro;
            self.pokerStyleS.value = MJGameSetView.POKER_STYLE_SMALL;
            self.pokerStyleP.value = MJGameSetView.POKER_STYLE_PLUS;
            self.pokerSytleRadioGro.selectedValue = RFHandCardItemView.cardStyle;

            /** 麻将语言 */
            self.pokerSytleRadioGro0 = new eui.RadioButtonGroup();
            self.pokerStyleS0.group = self.pokerSytleRadioGro0;
            self.pokerStyleP0.group = self.pokerSytleRadioGro0;
            self.pokerStyleS0.value = MJGameSetView.LANGUAGE_STYLE_PUTONGHUA;
            self.pokerStyleP0.value = MJGameSetView.LANGUAGE_STYLE_CHANGSHAHUA;
            self.pokerSytleRadioGro0.selectedValue = MahjongSoundHandler.languageStyle + "";

            /** 跑得快语言 */
            self.pokerSytleRadioGro1 = new eui.RadioButtonGroup();
            self.pokerStyleS1.group = self.pokerSytleRadioGro1;
            self.pokerStyleS1.value = "1";
            self.pokerSytleRadioGro1.selectedValue = "1";
            

            self._mediator = new MJGameSetViewMediator(self);
            this.selectTab();
        }

        /**
         *  重置界面
         * @param {number} flag 1=麻将 2=扑克
         */
        public resetView(flag: number): void {
            let self = this;
            if (flag === 1) {
                self.paibeiGroup.visible = true;
                self.pokerSytleGro.visible = false;
                self.pokerSytleGro0.visible = true;
                self.pokerSytleGro1.visible = false;
            } else {
                self.paibeiGroup.visible = false;
                self.pokerSytleGro.visible = true;
                self.pokerSytleGro0.visible = false;
                self.pokerSytleGro1.visible = true;
            }

            // 是否显示解散
            if (GameConstant.CURRENT_HANDLE.isReplay() || !GameConstant.CURRENT_HANDLE.isVipRoom()) {
                self.replayBtnGroup.visible = false;
                self.replayBtnGroup0.horizontalCenter = 0;
            }
            else {
                self.replayBtnGroup.visible = true;
                self.replayBtnGroup0.horizontalCenter = -170;
            }
        }

        protected onAddView(): void {
            MvcUtil.regMediator(this._mediator);
        }

        /** 日期切换TAB */
        private selectTab(tabId:number = 0): void {
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

        private selectGro(tabId: number = 0) {
            let self = this;
            if (tabId == 1) {
                this.baseGro.visible = false;
                this.langGro.visible = true;
                this.styleGro.visible = false;
            }
            else if (tabId == 2) {
                this.baseGro.visible = false;
                this.langGro.visible = false;
                this.styleGro.visible = true;
            }
            else {
                this.baseGro.visible = true;
                this.langGro.visible = false;
                this.styleGro.visible = false;
            }
        }

        public selectTodayTab() {
            this.selectTab(0);
            this.selectGro(0);
        }

        public selectYesterdayTab() {
            this.selectTab(1);
            this.selectGro(1);
        }

        public selectThisWeekTab() {
            this.selectTab(2);
            this.selectGro(2);
        }
    }
}