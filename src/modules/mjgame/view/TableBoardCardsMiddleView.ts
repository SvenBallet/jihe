module FL {
    import View = puremvc.View;

    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase - TableBoardCardsMiddleView
     * @Description:  //牌桌显示牌中间区域，包括牌桌四家已经打出的牌和刚打出牌的箭头，和我要打牌提示已经出了几张，还有癞子也放到这里
     * @Create: DerekWu on 2017/11/23 9:20
     * @Version: V1.0
     */
    export class TableBoardCardsMiddleView extends eui.Group {

        /** 单例 */
        private static _onlyOne:TableBoardCardsMiddleView;

        //调停者名字，删除界面的时候会自动移除
        public readonly mediatorName: string = TableBoardCardsMiddleViewMediator.NAME;
        //界面层级，UI框架自动管理
        public readonly viewLayer: ViewLayerEnum = ViewLayerEnum.BOTTOM;

        /** 已经出牌显示组 对家（上面） 自己（下面） 上家（左边） 下家（右边） */
        public readonly upChuGroup:eui.Group;
        public readonly downChuGroup:eui.Group;
        public readonly leftChuGroup:eui.Group;
        public readonly rightChuGroup:eui.Group;

        /** 癞子图片 */
        private _laiziImg: MahjongCardItem;

        /** 调停者 */
        private _mediator:TableBoardCardsMiddleViewMediator;

        private constructor() {
            super();

            this.upChuGroup = new eui.Group();
            this.downChuGroup = new eui.Group();
            this.leftChuGroup = new eui.Group();
            this.rightChuGroup = new eui.Group();

            let self = this;
            self.top = self.bottom = self.left = self.right = 0;
            // self.width = 1280, self.height = 720;
            self.horizontalCenter = 0, self.verticalCenter = 0;
            self.touchEnabled = false, self.touchChildren = false;

            //添加上下左右出牌组，位置和尺寸在 ChuGroupHandle 中设置
            self.addChild(self.upChuGroup);
            self.addChild(self.downChuGroup);
            self.addChild(self.leftChuGroup);
            self.addChild(self.rightChuGroup);

            //癞子
            // self._laiziImg = new eui.Image();
            // self._laiziImg.source = "M_bamboo_1_png";
            self._laiziImg = MahjongCardManager.getMahjongCommonCard(1);
            self._laiziImg.left = 1;
            self._laiziImg.top = 126;
            self._laiziImg.touchEnabled = false;
            self.addChild(self._laiziImg);

            self._mediator = new TableBoardCardsMiddleViewMediator(self);
        }

        public static getInstance():TableBoardCardsMiddleView {
            if (!this._onlyOne) {
                this._onlyOne = new TableBoardCardsMiddleView();
            }
            return this._onlyOne;
        }

        /** 添加到界面以后框架自动调用 */
        protected onAddView():void {
            MvcUtil.regMediator(this._mediator);
        }

        /**
         * 开始游戏，重置显示
         */
        public startGame():void {
            let self = this;
            self._mediator.startGame();
            //癞子标志牌
            let vLaiziFlagCardNum:number = MJGameHandler.getLaiziFlagCardNum();
            if (vLaiziFlagCardNum !== 0) {
                //有癞子则添加
                self._laiziImg.resetCommonCardValue(vLaiziFlagCardNum);
                ViewUtil.addChild(self, self._laiziImg);
            } else {
                //无赖子则删除
                ViewUtil.removeChild(self, self._laiziImg);
            }
        }

    }
}