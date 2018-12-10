module FL {

    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase - TableBoardCardsDownView
     * @Description:  //牌桌各个玩家手里的牌，包含了已经吃碰杠的牌，包含每个人刚打出显示在屏幕上方的一张牌
     * @Create: DerekWu on 2017/11/23 9:38
     * @Version: V1.0
     */
    export class TableBoardCardsHandView extends BaseView {

        /** 单例 */
        private static _onlyOne:TableBoardCardsHandView;

        //调停者名字，删除界面的时候会自动移除
        public readonly mediatorName: string = TableBoardCardsHandViewMediator.NAME;
        //界面层级，UI框架自动管理
        public readonly viewLayer: ViewLayerEnum = ViewLayerEnum.BOTTOM;

        /** 上下左右玩家手里的牌 */
        public readonly upHandGroup:eui.Group;
        public readonly downHandGroup:eui.Group;
        public readonly leftHandGroup:eui.Group;
        public readonly rightHandGroup:eui.Group;

        /** 由于层级关系，这里增加一个下面玩家的头像点击区域 */
        public headViewDownClickArea:eui.Group;

        /** 上下左右 每个人刚打出显示在屏幕上方的一张牌, 放到HandGroupHandle中 */
        // public readonly upViewCard:eui.Image;
        // public readonly downViewCard:eui.Image;
        // public readonly leftViewCard:eui.Image;
        // public readonly rightViewCard:eui.Image;

        /** 一个遮罩，用来屏蔽下面层级的所有操作 */
        private _shadeGroup:eui.Group;
        /** 吃碰听杠胡 按钮 显示组 */
        private _buttonGroup:eui.Group;
        public guoBtn:eui.Image;
        public chiBtn:eui.Image;
        public pengBtn:eui.Image;
        public gangBtn:eui.Image;
        public tingBtn:eui.Image;
        public huBtn:eui.Image;

        /** 吃牌和杠牌显示组，当吃牌有多个的时候，当杠牌有多个的时候，这个时候需要玩家做出选择，就弹出这个显示，里面最多包含3个 */
        private _selectChiGangGroup:eui.Group;
        public oneGroup:eui.Group;
        public twoGroup:eui.Group;
        public threeGroup:eui.Group;

        /** 调停者 */
        private _mediator:TableBoardCardsHandViewMediator;

        private constructor() {
            super();
            this.upHandGroup = new eui.Group();
            this.downHandGroup = new eui.Group();
            this.leftHandGroup = new eui.Group();
            this.rightHandGroup = new eui.Group();

            let self = this;
            self.top = self.bottom = self.left = self.right = 0;
            self.horizontalCenter = 0, self.verticalCenter = 0;
            self.touchEnabled = false;

            //添加上下左右出牌组，位置和尺寸在 HandGroupHandle 中设置
            self.addChild(self.upHandGroup);
            self.addChild(self.leftHandGroup);
            self.addChild(self.rightHandGroup);
            self.addChild(self.downHandGroup);

            //初始化过吃碰杠听按钮组
            self.initButtonGroup();

            self.addHeadViewDownClickArea();

            //最后初始化调停者
            self._mediator = new TableBoardCardsHandViewMediator(self);
        }

        /**
         * 初始化过吃碰杠听按钮组
         */
        private initButtonGroup():void {
            let self = this;
            //一个遮罩组，用来屏蔽按钮一下层级的所有操作
            let vButtonShadeGroup:eui.Group = new eui.Group();
            vButtonShadeGroup.top = vButtonShadeGroup.bottom = vButtonShadeGroup.left = vButtonShadeGroup.right = 0;
            vButtonShadeGroup.touchEnabled = true;

            //按钮组
            let vButtonGroup:eui.Group = new eui.Group();
            vButtonGroup.width = 147*6, vButtonGroup.height = 147, vButtonGroup.bottom = 120, vButtonGroup.horizontalCenter = 62;
            vButtonGroup.touchEnabled = false;
            //添加到遮罩组
            vButtonShadeGroup.addChild(vButtonGroup);

            //过吃碰杠听胡按钮
            self.guoBtn = self.initOneButton();
            self.guoBtn.source = "guo_btn_png";
            TouchTweenUtil.regTween(self.guoBtn, self.guoBtn);
            self.chiBtn = self.initOneButton();
            self.chiBtn.source = "chi_btn_png";
            TouchTweenUtil.regTween(self.chiBtn, self.chiBtn);
            self.pengBtn = self.initOneButton();
            self.pengBtn.source = "peng_btn_png";
            TouchTweenUtil.regTween(self.pengBtn, self.pengBtn);
            self.gangBtn = self.initOneButton();
            self.gangBtn.source = "gang_btn_png";
            TouchTweenUtil.regTween(self.gangBtn, self.gangBtn);
            self.tingBtn = self.initOneButton();
            self.tingBtn.source = "ting_btn_png";
            TouchTweenUtil.regTween(self.tingBtn, self.tingBtn);
            self.huBtn = self.initOneButton();
            self.huBtn.source = "hu_btn_png";
            TouchTweenUtil.regTween(self.huBtn, self.huBtn);

            //赋值
            self._shadeGroup = vButtonShadeGroup;
            self._buttonGroup = vButtonGroup;

            //选择吃杠组
            let vChiGangGroup:eui.Group = new eui.Group();
            vChiGangGroup.height = 320, vChiGangGroup.width = 1280, vChiGangGroup.bottom = 0, vChiGangGroup.horizontalCenter = 0;
            //布局
            let vHorizontalLayout:eui.HorizontalLayout = new eui.HorizontalLayout();
            vHorizontalLayout.horizontalAlign = egret.HorizontalAlign.LEFT;
            vHorizontalLayout.verticalAlign = egret.VerticalAlign.TOP;
            vHorizontalLayout.gap = 20;
            vHorizontalLayout.paddingLeft = 150;
            vChiGangGroup.layout = vHorizontalLayout;
            self._selectChiGangGroup = vChiGangGroup;

            //初始化第一二三个选择组
            self.oneGroup = self.initOneSelectSubGroup();
            self.twoGroup = self.initOneSelectSubGroup();
            self.threeGroup = self.initOneSelectSubGroup();

        }

        /**
         * 初始化一个按钮
         * @returns {eui.Image}
         */
        private initOneButton():eui.Image {
            let vImage:eui.Image = new eui.Image();
            vImage.width = vImage.height = 147;
            vImage.anchorOffsetX = vImage.anchorOffsetY = vImage.y = 73;
            return vImage;
        }

        /**
         * 初始化一个选中小组
         * @returns {eui.Group}
         */
        private initOneSelectSubGroup():eui.Group {
            let vGroup:eui.Group = new eui.Group();
            vGroup.width = 175, vGroup.height = 94, vGroup.touchEnabled = true, vGroup.touchChildren = false;
            return vGroup;
        }

        public static getInstance():TableBoardCardsHandView {
            if (!this._onlyOne) {
                this._onlyOne = new TableBoardCardsHandView();
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
            this.hideAllGroup(); 
            this._mediator.startGame();
        }

        /**
         * 隐藏按钮组
         */
        public hideButtonGroup():void {
            ViewUtil.removeChild(this._shadeGroup, this._buttonGroup);
            if (this._shadeGroup.numChildren === 0) {
                ViewUtil.removeChild(this, this._shadeGroup);
            }
        }

        /**
         * 显示影藏按钮组,根据操作类型数组，过按钮一直有
         * @param {number[]} operationArray 注意外面组装参数的时候要排序
         */
        public viewButtonGroup(operationArray:number[]):void {
            let self = this;
            if (operationArray || operationArray.length > 0) {
                //先清除所有按钮
                self._buttonGroup.removeChildren();
                //定义当前索引位置，按钮从右到左添加
                let vButtonIndex:number = 5;
                //添加过按钮
                self.guoBtn.x = vButtonIndex * 147 + 73;
                ViewUtil.addChild(self._buttonGroup, self.guoBtn);
                vButtonIndex--;

                //循环添加其他按钮
                for (let vIndex:number = 0, vLength:number = operationArray.length; vIndex < vLength; ++vIndex) {
                    let vOneButtonImage:eui.Image = self.getOperationButton(operationArray[vIndex]);
                    vOneButtonImage.x = vButtonIndex * 147 + 73;
                    ViewUtil.addChild(self._buttonGroup, vOneButtonImage);
                    vButtonIndex--;
                }
                //显示按钮组
                ViewUtil.addChildBefore(self._shadeGroup, self._buttonGroup, self._selectChiGangGroup);
                ViewUtil.addChild(self, self._shadeGroup);
            } else {
                //影藏按钮组
                self.hideButtonGroup();
            }
        }

        /**
         * 获得操作按钮
         * @param {number} operation
         * @returns {eui.Image}
         */
        private getOperationButton(operation:number):eui.Image {
            if (operation === GameConstant.MAHJONG_OPERTAION_CHI) {
                return this.chiBtn;
            } else if (operation === GameConstant.MAHJONG_OPERTAION_PENG) {
                return this.pengBtn;
            } else if (operation === GameConstant.MAHJONG_OPERTAION_MING_GANG || operation === GameConstant.MAHJONG_OPERTAION_AN_GANG) {
                return this.gangBtn;
            } else if (operation === GameConstant.MAHJONG_OPERTAION_TING) {
                return this.tingBtn;
            } else if (operation === GameConstant.MAHJONG_OPERTAION_HU) {
                return this.huBtn;
            }
        }

        /**
         * 隐藏选择组
         */
        public hideSelectGroup():void {
            ViewUtil.removeChild(this._shadeGroup, this._selectChiGangGroup);
            if (this._shadeGroup.numChildren === 0) {
                ViewUtil.removeChild(this, this._shadeGroup);
            }
        }

        /**
         * 隐藏所有组
         */
        public hideAllGroup():void {
            this.hideSelectGroup();
            this.hideButtonGroup();
        }

        /**
         * 显示选择组
         * @param {number[]} cardArray
         */
        public viewSelectGroup(cardArray:number[][]):void {
            let self = this;
            self.exeSelectSubGroup(self.oneGroup, cardArray[0]);
            self.exeSelectSubGroup(self.twoGroup, cardArray[1]);
            self.exeSelectSubGroup(self.threeGroup, cardArray[2]);
            ViewUtil.addChild(self._shadeGroup, self._selectChiGangGroup);
            ViewUtil.addChild(self, self._shadeGroup);
        }

        /**
         * 处理选择组
         * @param {eui.Group} currGroup
         * @param {number[]} cardArray
         */
        private exeSelectSubGroup(currGroup:eui.Group, cardArray:number[]):void {
            if (cardArray && cardArray.length > 0) {
                currGroup.removeChildren();
                currGroup.width = cardArray.length * 55 +10;
                let vImg:eui.Image = new eui.Image();
                vImg.source = "wanfa_bg_png", vImg.width = currGroup.width, vImg.height = currGroup.height;
                currGroup.addChild(vImg);
                for (let vIndex:number = 0; vIndex < cardArray.length; ++vIndex) {
                    let vImg: MahjongCardItem = MahjongCardManager.getMahjongCommonCard(cardArray[vIndex], 55, 84);
                    vImg.y = 5;
                    vImg.x = vIndex * 55 + 5;
                    currGroup.addChild(vImg);
                }
                ViewUtil.addChild(this._selectChiGangGroup, currGroup);
            } else {
                ViewUtil.removeChild(this._selectChiGangGroup, currGroup);
            }
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
            let vTableBoardBaseView = TableBoardBaseView.getInstance();
            let viewX = vTableBoardBaseView.headViewDown.x;
            let viewY = vTableBoardBaseView.headViewDown.y;
            let iconX = vTableBoardBaseView.headViewDown.headIcon.x;
            let iconY = vTableBoardBaseView.headViewDown.headIcon.y;
            // this.headViewDownClickArea.x = viewX-215-iconX-23;
            this.headViewDownClickArea.x = viewX+iconX;
            this.headViewDownClickArea.y = viewY+iconY;
            // egret.log("x="+this.headViewDownClickArea.x+" y="+this.headViewDownClickArea.y);
        }

        /**
         * 下方玩家信息弹窗
         */
        public showDownPlayerInfoView(e:egret.Event){
            // egret.log("@ x="+this.headViewDownClickArea.x+" y="+this.headViewDownClickArea.y);
            // 回放中屏蔽掉
            if (MJGameHandler.isReplay()) {
                return;
            }
            let vTableBoardBaseView = TableBoardBaseView.getInstance();
            let vSimplePlayer:SimplePlayer = MJGameHandler.getGamePlayerInfo(PZOrientation.DOWN);
            if(vSimplePlayer) {
                let viewX = vTableBoardBaseView.headViewDown.x;
                let viewY = vTableBoardBaseView.headViewDown.y;
                let playerInfoCoor = [viewX+215+80,viewY-215-80];
                egret.localStorage.setItem("PlayerInfoOrientation", "" + PZOrientation.DOWN);
                PlayerInfoItem.getInstance().setPlayerInfo(vSimplePlayer, playerInfoCoor);
                MvcUtil.addView(PlayerInfoItem.getInstance());
            }
        }

    }
}