module FL {
    /** 局数显示 */
    export class RFGamePlayCountView extends BaseView {
        /** 单例 */
        private static _onlyOne: RFGamePlayCountView;
        //调停者名字，删除界面的时候会自动移除
        public readonly mediatorName: string = RFGamePlayCountViewMediator.NAME;
        //界面层级，UI框架自动管理
        public readonly viewLayer: ViewLayerEnum = ViewLayerEnum.BOTTOM;

        //总局数
        public totalPlayCount: eui.Label;
        //当前局数
        public currPlayCount: eui.Label;

        /** 调停者 */
        private _mediator: RFGamePlayCountViewMediator;

        private constructor() {
            super();
            let self = this;
            this.horizontalCenter = 35, this.verticalCenter = -50;
            //不可触摸
            this.skinName = "skins.RFGamePlayCountViewSkin";
            this.touchEnabled = false, this.touchChildren = false;
        }

        protected childrenCreated() {
            let self = this;
            self._mediator = new RFGamePlayCountViewMediator(self);
        }

        public static getInstance(): RFGamePlayCountView {
            if (!this._onlyOne) {
                this._onlyOne = new RFGamePlayCountView();
            }
            return this._onlyOne;
        }


        /** 添加到界面以后框架自动调用 */
        protected onAddView(): void {
            MvcUtil.regMediator(this._mediator);
        }

        /**
         * 开始游戏
         */
        public startGame() {
            this.visible = (RFGameHandle.isVipRoom());
            this.setCurCount();
            this.setTotCount();
        }

        /**
         * 设置总局数
         */
        public setTotCount() {
            this.totalPlayCount.text = "" + RFGameHandle.getTotalHand();
        }
        /**
         * 设置当前局数
         */
        public setCurCount() {
            this.currPlayCount.text = "" + RFGameHandle.getCurrentHand();
        }
    }
}