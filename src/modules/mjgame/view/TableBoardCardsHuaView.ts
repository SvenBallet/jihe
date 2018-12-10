module FL {

    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase - TableBoardCardsHuaView
     * @Description:  //所有玩家的花牌显示界面，使用一个滤镜 DrawCall 为1
     * @Create: DerekWu on 2017/11/24 17:21
     * @Version: V1.0
     */
    // export class TableBoardCardsHuaView extends BaseView {
    export class TableBoardCardsHuaView extends eui.Group {

        /** 单例 */
        private static _onlyOne:TableBoardCardsHuaView;

        //调停者名字，删除界面的时候会自动移除
        public readonly mediatorName: string = TableBoardCardsHuaViewMediator.NAME;
        //界面层级，UI框架自动管理
        public readonly viewLayer: ViewLayerEnum = ViewLayerEnum.BOTTOM;

        /** 花牌显示组 对家（上面） 自己（下面） 上家（左边） 下家（右边） */
        public readonly upHuaGroup:eui.Group;
        public readonly downHuaGroup:eui.Group;
        public readonly leftHuaGroup:eui.Group;
        public readonly rightHuaGroup:eui.Group;

        /** 调停者 */
        private _mediator:TableBoardCardsHuaViewMediator;

        private constructor() {
            super();

            this.upHuaGroup = new eui.Group();
            this.downHuaGroup = new eui.Group();
            this.leftHuaGroup = new eui.Group();
            this.rightHuaGroup = new eui.Group();

            let self = this;
            // self.top = self.bottom = self.left = self.right = 0;
            self.width = 1280, self.height = 720;
            self.horizontalCenter = 0, self.verticalCenter = 0;
            self.touchEnabled = false, self.touchChildren = false;

            //添加上下左右花牌组，位置和尺寸在 HuaGroupHandle 中设置
            self.addChild(self.upHuaGroup);
            self.addChild(self.downHuaGroup);
            self.addChild(self.leftHuaGroup);
            self.addChild(self.rightHuaGroup);

            //滤镜
            //颜色矩阵数组
            // let colorMatrix = [
            //     0.3,0.6,0,0,0,
            //     0.3,0.6,0,0,100,
            //     0.3,0.6,0,0,0,
            //     0,0,0,1,0
            // ];
            // let colorMatrix = [
            //     0,0,0,0,0,
            //     0,1,0,0,0,
            //     0,0,0,0,0,
            //     0,0,0,1,0
            // ];
            // let colorMatrix = [
            //     0.8,0,0,0,0,
            //     0,0.8,0,0,0,
            //     0,0,0.8,0,0,
            //     0,0,0,0.8,0
            // ];
            // let colorFilter = new egret.ColorMatrixFilter(colorMatrix);
            self.filters = [MJGameHandler.huaColorFilter];

            //调停者
            self._mediator = new TableBoardCardsHuaViewMediator(self);
        }

        public static getInstance():TableBoardCardsHuaView {
            if (!this._onlyOne) {
                this._onlyOne = new TableBoardCardsHuaView();
            }
            return this._onlyOne;
        }

        // protected childrenCreated():void {
        //     super.childrenCreated();
        //     let self = this;
        //
        //     //滤镜
        //     //颜色矩阵数组
        //     let colorMatrix = [
        //         1,0,0,0,0,
        //         0,1,0,0,100,
        //         0,0,1,0,0,
        //         0,0,0,1,0
        //     ];
        //     let colorFilter = new egret.ColorMatrixFilter(colorMatrix);
        //     self.filters = [colorFilter];
        //
        //     self._mediator = new TableBoardCardsHuaViewMediator(self);
        // }

        /** 添加到界面以后框架自动调用 */
        protected onAddView():void {
            MvcUtil.regMediator(this._mediator);
        }

        /**
         * 开始游戏，重置显示
         */
        public startGame():void {
            this._mediator.startGame();
        }

    }

}