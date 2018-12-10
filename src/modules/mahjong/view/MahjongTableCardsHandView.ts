module FL {

    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase - TableBoardCardsDownView
     * @Description:  //牌桌各个玩家手里的牌，包含了已经吃碰杠的牌，包含每个人刚打出显示在屏幕上方的一张牌
     * @Create: DerekWu on 2017/11/23 9:38
     * @Version: V1.0
     */
    export class MahjongTableCardsHandView extends BaseView {

        /** 单例 */
        private static _onlyOne: MahjongTableCardsHandView;

        //调停者名字，删除界面的时候会自动移除
        public readonly mediatorName: string = MahjongTableCardsHandViewMediator.NAME;
        //界面层级，UI框架自动管理
        public readonly viewLayer: ViewLayerEnum = ViewLayerEnum.BOTTOM;

        /** 上下左右玩家手里的牌 */
        public readonly upHandGroup: eui.Group;
        public readonly downHandGroup: eui.Group;
        public readonly leftHandGroup: eui.Group;
        public readonly rightHandGroup: eui.Group;

        /** 由于层级关系，这里增加一个下面玩家的头像点击区域 */
        public headViewDownClickArea: eui.Group;

        /** 上下左右 每个人刚打出显示在屏幕上方的一张牌, 放到HandGroupHandle中 */
        // public readonly upViewCard:eui.Image;
        // public readonly downViewCard:eui.Image;
        // public readonly leftViewCard:eui.Image;
        // public readonly rightViewCard:eui.Image;

        /** 一个遮罩，用来屏蔽下面层级的所有操作 */
        private _shadeGroup: eui.Group;
        /** 吃碰听杠胡 按钮 显示组 */
        private _buttonGroup: eui.Group;
        /** 动作按钮列表 */
        private _actionButtonArray: Array<MahjongActionButtonGroup> = [];

        /** 吃牌和杠牌显示组，当吃牌有多个的时候，当杠牌有多个的时候，这个时候需要玩家做出选择，就弹出这个显示，里面最多包含3个 */
        public _selectChiGangGroup: eui.Group;

        /** 调停者 */
        private _mediator: MahjongTableCardsHandViewMediator;

        /** 上方的刚出的牌的提示箭头，由于层级关系，当箭头在第三个显示组的时候会被手牌遮挡住，所以在这里来显示 */
        private _upCardMiddleArrows:eui.Image;
        private _upCardMiddleArrowsBase:eui.Image;

        private constructor() {
            super();
            this.upHandGroup = new eui.Group();
            this.downHandGroup = new eui.Group();
            this.downHandGroup.touchThrough = true;
            this.leftHandGroup = new eui.Group();
            this.rightHandGroup = new eui.Group();

            let self = this;
            self.top = self.bottom = self.left = self.right = 0;
            // self.horizontalCenter = 0, self.verticalCenter = 0;
            self.touchEnabled = false;

            //添加上下左右出牌组，位置和尺寸在 HandGroupHandle 中设置
            self.addChild(self.upHandGroup);
            self.addChild(self.leftHandGroup);
            self.addChild(self.rightHandGroup);
            self.addChild(self.downHandGroup);

            //初始化过吃碰杠听按钮组
            self.initButtonGroup();

            // self.addHeadViewDownClickArea();

            //最后初始化调停者
            self._mediator = new MahjongTableCardsHandViewMediator(self);
        }

        /**
         * 初始化过吃碰杠听按钮组
         */
        private initButtonGroup(): void {
            let self = this;
            //一个遮罩组，用来屏蔽按钮一下层级的所有操作
            let vButtonShadeGroup: eui.Group = new eui.Group();
            vButtonShadeGroup.top = vButtonShadeGroup.bottom = vButtonShadeGroup.left = vButtonShadeGroup.right = 0;
            vButtonShadeGroup.touchEnabled = true;

            //按钮组
            let vButtonGroup: eui.Group = new eui.Group();
            // vButtonGroup.width = 147*6, vButtonGroup.height = 147, vButtonGroup.bottom = 140, vButtonGroup.horizontalCenter = 62;
            // vButtonGroup.right = 146, vButtonGroup.height = 136, vButtonGroup.bottom = 140;
            vButtonGroup.height = 136, vButtonGroup.width = 1280, vButtonGroup.bottom = 140, vButtonGroup.horizontalCenter = 0;
            //布局
            let vButtonHorizontalLayout: eui.HorizontalLayout = new eui.HorizontalLayout();
            vButtonHorizontalLayout.horizontalAlign = egret.HorizontalAlign.RIGHT;
            // vButtonHorizontalLayout.
            vButtonHorizontalLayout.verticalAlign = egret.VerticalAlign.MIDDLE;
            vButtonHorizontalLayout.gap = 0;
            vButtonHorizontalLayout.paddingRight = 180;
            vButtonGroup.layout = vButtonHorizontalLayout;
            vButtonGroup.touchEnabled = false;
            //添加到遮罩组
            vButtonShadeGroup.addChild(vButtonGroup);

            //赋值
            self._shadeGroup = vButtonShadeGroup;
            self._buttonGroup = vButtonGroup;

            //选择吃杠组
            let vChiGangGroup: eui.Group = new eui.Group();
            vChiGangGroup.height = 350, vChiGangGroup.width = 1280, vChiGangGroup.bottom = 0, vChiGangGroup.horizontalCenter = 0;
            //布局
            let vHorizontalLayout: eui.HorizontalLayout = new eui.HorizontalLayout();
            vHorizontalLayout.horizontalAlign = egret.HorizontalAlign.LEFT;
            vHorizontalLayout.verticalAlign = egret.VerticalAlign.TOP;
            vHorizontalLayout.gap = 20;
            vHorizontalLayout.paddingLeft = 150;
            vChiGangGroup.layout = vHorizontalLayout;
            self._selectChiGangGroup = vChiGangGroup;
        }

        public static getInstance(): MahjongTableCardsHandView {
            if (!this._onlyOne) {
                this._onlyOne = new MahjongTableCardsHandView();
            }
            return this._onlyOne;
        }

        /** 添加到界面以后框架自动调用 */
        protected onAddView(): void {
            MvcUtil.regMediator(this._mediator);
        }

        /** 从界面移除以后框架自动调用 */
        protected onRemView():void {
            this.removeArrowsAnima();
        }

        /**
         * 开始游戏，重置显示
         */
        public startGame(): void {
            //先清除所有按钮
            this._buttonGroup.removeChildren();
            this._actionButtonArray = [];
            this.hideAllGroup();
            this._mediator.startGame();
        }

        /**
         * 隐藏按钮组
         */
        public hideButtonGroup(): void {
            ViewUtil.removeChild(this._shadeGroup, this._buttonGroup);
            if (this._shadeGroup.numChildren === 0) {
                ViewUtil.removeChild(this, this._shadeGroup);
            }
        }

        /**
         * 新的显示动作按钮
         * @param {Array<FL.MahjongActionResult>} actionList
         */
        public newViewActionButtonGroup(actionList: Array<MahjongActionResult>): void {
            let self = this;
            // 先销清除以前的
            this._buttonGroup.removeChildren();
            if (!actionList || actionList.length == 0) {
                // 隐藏所有
                self._actionButtonArray = [];
                self.hideAllGroup();
                return;
            }

            // 再增加新的
            let vTempAction: number = -1;
            let vTempActionSubList: Array<MahjongActionResult>;
            for (let vIndex: number = actionList.length - 1; vIndex >= 0; --vIndex) {
                let vOneAction: MahjongActionResult = actionList[vIndex];
                if (vOneAction.action !== vTempAction) {
                    if (vTempActionSubList && vTempActionSubList.length > 0) {
                        // 生成组
                        let vMahjongActionButtonGroup: MahjongActionButtonGroup = new MahjongActionButtonGroup(vTempActionSubList, self);
                        self._actionButtonArray.push(vMahjongActionButtonGroup);
                        self._buttonGroup.addChild(vMahjongActionButtonGroup);
                    }
                    vTempActionSubList = [];
                    vTempAction = vOneAction.action;
                }
                vTempActionSubList.push(vOneAction);
            }
            if (vTempActionSubList && vTempActionSubList.length > 0) {
                // 生成组
                let vMahjongActionButtonGroup: MahjongActionButtonGroup = new MahjongActionButtonGroup(vTempActionSubList, self);
                self._actionButtonArray.push(vMahjongActionButtonGroup);
                self._buttonGroup.addChild(vMahjongActionButtonGroup);
            }
            //显示按钮组
            ViewUtil.addChildBefore(self._shadeGroup, self._buttonGroup, self._selectChiGangGroup);
            ViewUtil.addChild(self, self._shadeGroup);
        }

        /**
         * 隐藏选择组
         */
        public hideSelectGroup(): void {
            ViewUtil.removeChild(this._shadeGroup, this._selectChiGangGroup);
            if (this._shadeGroup.numChildren === 0) {
                ViewUtil.removeChild(this, this._shadeGroup);
            }
        }

        /**
         * 隐藏所有组
         */
        public hideAllGroup(): void {
            this.hideSelectGroup();
            this.hideButtonGroup();
        }

        /**
         * 选择动作结束
         */
        public selectActionOver(): void {
            this.hideAllGroup();
            // let vMyTablePos = MahjongHandler.getTablePos(PZOrientation.DOWN);
            // if (MahjongHandler.getCurrOperationOrientation() === PZOrientation.DOWN) {
            //     MahjongHandler.touchHandCardSwitch.compelOpen();
            // } else {
                // 麻将出牌开关优化
                MahjongHandler.touchHandCardSwitch.close();
            // }
        }

        /**
         * 新的显示选择组
         */
        public newViewSelectGroup(subGroupArray: Array<MahjongActionSubSelectGroup>): void {
            let self = this;
            self._selectChiGangGroup.removeChildren();
            for (let vIndex: number = 0; vIndex < subGroupArray.length; ++vIndex) {
                self._selectChiGangGroup.addChild(subGroupArray[vIndex]);
            }
            ViewUtil.addChild(self._shadeGroup, self._selectChiGangGroup);
            ViewUtil.addChild(self, self._shadeGroup);
        }

        /**
         * 下方玩家头像加一个点击区域(原来的被挡住)
         */
        private addHeadViewDownClickArea() {
            let headViewDownClickArea = new eui.Group();
            headViewDownClickArea.width = 86;
            headViewDownClickArea.height = 82;
            this.headViewDownClickArea = headViewDownClickArea;
            this.resetHeadViewDownClickAreaPos();
            this.addChild(headViewDownClickArea);
            headViewDownClickArea.addEventListener(egret.TouchEvent.TOUCH_TAP, this.showDownPlayerInfoView, this);
        }

        /**
         * 重置头像点击区域的位置
         */
        public resetHeadViewDownClickAreaPos(): void {
            // let vTableBoardBaseView = MahjongTableBaseView.getInstance();
            // let viewX = vTableBoardBaseView.headViewDown.x;
            // let viewY = vTableBoardBaseView.headViewDown.y;
            // let iconX = vTableBoardBaseView.headViewDown.headIcon.x;
            // let iconY = vTableBoardBaseView.headViewDown.headIcon.y;
            // this.headViewDownClickArea.x = viewX + iconX;
            // this.headViewDownClickArea.y = viewY + iconY;
            // egret.log("x="+this.headViewDownClickArea.x+" y="+this.headViewDownClickArea.y);
        }

        /**
         * 下方玩家信息弹窗
         */
        public showDownPlayerInfoView(e: egret.Event) {
            // egret.log("@ x="+this.headViewDownClickArea.x+" y="+this.headViewDownClickArea.y);
            // 回放中屏蔽掉
            if (MahjongHandler.isReplay()) {
                return;
            }
            let vTableBoardBaseView = MahjongTableBaseView.getInstance();
            let vSimplePlayer: GamePlayer = MahjongHandler.getGamePlayerInfo(PZOrientation.DOWN);
            if (vSimplePlayer) {
                let viewX = vTableBoardBaseView.headViewDown.x;
                let viewY = vTableBoardBaseView.headViewDown.y;
                let playerInfoCoor = [viewX + 215 + 80, viewY - 215 - 80];
                egret.localStorage.setItem("PlayerInfoOrientation", "" + PZOrientation.DOWN);
                PlayerInfoItem.getInstance().setPlayerInfo2(vSimplePlayer, playerInfoCoor);
                MvcUtil.addView(PlayerInfoItem.getInstance());
            }
        }

        /**
         * 上方中间出牌区域箭头改变，没有值则是删除，有值则是显示
         * @param {eui.Image} pArrows
         */
        public upCardMiddleArrowsChange(pArrows:eui.Image): void {
            let self = this;
            if (pArrows) {
                if (!self._upCardMiddleArrows) {
                    self._upCardMiddleArrows = new eui.Image();
                    self._upCardMiddleArrows.source = "marker_png"; //这个图片宽度32 高度39
                }
                self._upCardMiddleArrowsBase = pArrows;
                if (!Game.GameDrive.getInstance().hasEventListener(Game.GameEvent.AI_LOGIC)) {
                    Game.GameDrive.getInstance().addEventListener(Game.GameEvent.AI_LOGIC, self.playArrowsAnima, self);
                    // egret.log("addEventListener Game.GameEvent.AI_LOGIC, self.playArrowsAnima");
                }
            } else {
                self.removeArrowsAnima();
            }
        }

        private removeArrowsAnima(): void {
            let self = this;
            if (self._upCardMiddleArrows) {
                if (Game.GameDrive.getInstance().hasEventListener(Game.GameEvent.AI_LOGIC)) {
                    Game.GameDrive.getInstance().removeEventListener(Game.GameEvent.AI_LOGIC, self.playArrowsAnima, self);
                    // egret.log("removeEventListener Game.GameEvent.AI_LOGIC, self.playArrowsAnima");
                }
                ViewUtil.removeChild(self, self._upCardMiddleArrows);
            }
            self._upCardMiddleArrowsBase = null;
        }

        private playArrowsAnima(): void {
            let self = this;
            if (self._upCardMiddleArrowsBase) {
                let globalPoint: egret.Point = self._upCardMiddleArrowsBase.localToGlobal(0, 0);
                self._upCardMiddleArrows.x = globalPoint.x;
                self._upCardMiddleArrows.y = globalPoint.y;
                ViewUtil.addChild(self, self._upCardMiddleArrows);
            }
        }

    }
}