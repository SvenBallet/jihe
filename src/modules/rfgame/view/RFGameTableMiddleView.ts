module FL {
    /** 牌桌中间显示层 */
    export class RFGameTableMiddleView extends eui.Group {
        /** 单例 */
        private static _onlyOne: RFGameTableMiddleView;

        //调停者名字，删除界面的时候会自动移除
        public readonly mediatorName: string = RFGameTableMiddleViewMediator.NAME;
        //界面层级，UI框架自动管理
        public readonly viewLayer: ViewLayerEnum = ViewLayerEnum.BOTTOM;

        /** 已经出牌显示组 对家（上面） 自己（下面） 上家（左边） 下家（右边） */
        public readonly upChuGroup: eui.Group;
        public readonly downChuGroup: eui.Group;
        public readonly leftChuGroup: eui.Group;
        public readonly rightChuGroup: eui.Group;

        /** 调停者 */
        private _mediator: RFGameTableMiddleViewMediator;

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

            //添加上下左右出牌组，位置和尺寸在 RFChuGroupHandle 中设置
            self.addChild(self.upChuGroup);
            self.addChild(self.downChuGroup);
            self.addChild(self.leftChuGroup);
            self.addChild(self.rightChuGroup);

            self._mediator = new RFGameTableMiddleViewMediator(self);
        }

        public static getInstance(): RFGameTableMiddleView {
            if (!this._onlyOne) {
                this._onlyOne = new RFGameTableMiddleView();
            }
            return this._onlyOne;
        }


        /** 添加到界面以后框架自动调用 */
        protected onAddView(): void {
            MvcUtil.regMediator(this._mediator);
        }

        /**
       * 开始游戏，重置显示
       */
        public startGame(): void {
            let self = this;
            self._mediator.startGame();
        }
    }
}