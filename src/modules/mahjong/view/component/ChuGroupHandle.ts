module FL {
    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase - ChuGroupHandle
     * @Description:  //出牌显示组的操作类
     * @Create: DerekWu on 2017/12/1 17:42
     * @Version: V1.0
     */
    export class ChuGroupHandle {

        /** 出牌显示组，里面有3小组 */
        private readonly _viewGroup:eui.Group;
        private readonly _oneSubGroup:eui.Group;
        private readonly _twoSubGroup:eui.Group;
        private readonly _threeSubGroup:eui.Group;
        private readonly _fourSubGroup:eui.Group; // 3个人的时候下面有4组

        /** 明牌组*/
        private readonly _mingSubGroup:eui.Group;
        private readonly _mingActionGroup:eui.Group;

        /** 每个小组的最多放的牌数量，默认是10个，只有当两个人打的时候，对家和我是16个 */
        private _subGroupMaxCardNum:number = 10;
        /** 已经出牌的数量 */
        private _hasChuNum:number;
        /** 已经出牌的值存储数组 */
        private _chuCardValueArray:number[] = [];
        /** 花图片数组，永不销毁 */
        // private readonly _chuImageArray:Array<eui.Image> = new Array<eui.Image>();
        private readonly _chuImageArray:Array<MahjongCardItem> = new Array<MahjongCardItem>();

        /** 当前显示的遮罩图片索引数组，当前玩家选中某张牌，正准备打这张牌的时候，要在已经出过的牌上面盖一层半透明图片，让玩家清晰的看见这张牌已经出了几张了 */
        private _viewShadeIndexArray:number[] = [];
        private readonly _shadeImageArray:Array<eui.Image> = new Array<eui.Image>();

        /** 刚出的牌的提示箭头 */
        private _arrows:eui.Image;

        /** 后续出牌是否添加到索引0 */
        private readonly _isAddZeroIndex:boolean;
        /** 牌桌方向 */
        private readonly _pzOrientation:PZOrientation;

        // private readonly upDownChuCardWidth: number = 38;
        // private readonly upDownChuCardHeight: number = 58;
        // private readonly leftRightChuCardWidth: number = 49;
        // private readonly leftRightChuCardHeight: number = 40;

        private readonly upDownChuCardWidth: number = 45;
        private readonly upDownChuCardHeight: number = 69;
        private readonly leftRightChuCardWidth: number = 59;
        private readonly leftRightChuCardHeight: number = 47;

        private readonly upDownGroupWidth: number = 450 - 18;
        private readonly upDownGroupHeight: number = 175;

        private readonly leftRightGroupWidth: number = this.leftRightChuCardWidth * 4 - 9;
        private readonly leftRightGroupHeight: number = 362;

        constructor(pPZOrientation:PZOrientation, pViewGroup:eui.Group) {
            this._pzOrientation = pPZOrientation;
            this._viewGroup = pViewGroup;
            let vOneSubGroup:eui.Group = new eui.Group();
            let vTwoSubGroup:eui.Group = new eui.Group();
            let vThreeSubGroup:eui.Group = new eui.Group();
            let vFourSubGroup:eui.Group = new eui.Group();
            let vMingSubGroup:eui.Group = new eui.Group();
            let vMingActionGroup:eui.Group = new eui.Group();

            let layout;
            //初始化位置和尺寸
            if (pPZOrientation === PZOrientation.UP) {
                // pViewGroup.width = 380, pViewGroup.height = 152, pViewGroup.horizontalCenter = 0, pViewGroup.verticalCenter = -164;
                // vOneSubGroup.width = 380, vOneSubGroup.height = 58, vOneSubGroup.x = 0, vOneSubGroup.y = 94;
                // vTwoSubGroup.width = 380, vTwoSubGroup.height = 58, vTwoSubGroup.x = 0, vTwoSubGroup.y = 47;
                // vThreeSubGroup.width = 380, vThreeSubGroup.height = 58, vThreeSubGroup.x = 0, vThreeSubGroup.y = 0;
                // vMingSubGroup.height = 116, vMingSubGroup.horizontalCenter = 0;
                // vMingActionGroup.horizontalCenter = 0, vMingActionGroup.verticalCenter = -10;
                // vMingSubGroup.top = -10;
                pViewGroup.width = this.upDownGroupWidth, pViewGroup.height = this.upDownGroupHeight, pViewGroup.horizontalCenter = 0, pViewGroup.verticalCenter = -170;
                vOneSubGroup.width = this.upDownGroupWidth, vOneSubGroup.height = this.upDownChuCardHeight, vOneSubGroup.x = 0, vOneSubGroup.y = 106;
                vTwoSubGroup.width = this.upDownGroupWidth, vTwoSubGroup.height = this.upDownChuCardHeight, vTwoSubGroup.x = 0, vTwoSubGroup.y = 53;
                vThreeSubGroup.width = this.upDownGroupWidth, vThreeSubGroup.height = this.upDownChuCardHeight, vThreeSubGroup.x = 0, vThreeSubGroup.y = 0;

                vMingSubGroup.height = 116, vMingSubGroup.horizontalCenter = 0;
                vMingActionGroup.horizontalCenter = 0, vMingActionGroup.verticalCenter = 10;
                vMingSubGroup.top = 10;

                // if(MahjongHandler.getRoomPlayerMaxNum() === 2){
                //     vMingSubGroup.horizontalCenter = -190;
                //     vMingActionGroup.horizontalCenter = -190;
                // }
                pViewGroup.addChild(vThreeSubGroup);
                pViewGroup.addChild(vTwoSubGroup);
                pViewGroup.addChild(vOneSubGroup);
                pViewGroup.addChild(vMingSubGroup);
                pViewGroup.addChild(vMingActionGroup);
                layout = new eui.HorizontalLayout();
                layout.gap = 0;
                vMingSubGroup.layout = layout;
                this._isAddZeroIndex = false;
            } else {
                if (pPZOrientation === PZOrientation.DOWN) {
                    // pViewGroup.width = 380, pViewGroup.height = 152, pViewGroup.horizontalCenter = 0, pViewGroup.verticalCenter = 120;
                    // vOneSubGroup.width = 380, vOneSubGroup.height = 58, vOneSubGroup.x = 0, vOneSubGroup.y = 0;
                    // vTwoSubGroup.width = 380, vTwoSubGroup.height = 58, vTwoSubGroup.x = 0, vTwoSubGroup.y = 47;
                    // vThreeSubGroup.width = 380, vThreeSubGroup.height = 58, vThreeSubGroup.x = 0, vThreeSubGroup.y = 94;

                    pViewGroup.width = this.upDownGroupWidth, pViewGroup.height = this.upDownGroupHeight, pViewGroup.horizontalCenter = 0, pViewGroup.verticalCenter = 136;
                    vOneSubGroup.width = this.upDownGroupWidth, vOneSubGroup.height = this.upDownChuCardHeight, vOneSubGroup.x = 0, vOneSubGroup.y = 0;
                    vTwoSubGroup.width = this.upDownGroupWidth, vTwoSubGroup.height = this.upDownChuCardHeight, vTwoSubGroup.x = 0, vTwoSubGroup.y = 53;
                    vThreeSubGroup.width = this.upDownGroupWidth, vThreeSubGroup.height = this.upDownChuCardHeight, vThreeSubGroup.x = 0, vThreeSubGroup.y = 106;

                    // vFourSubGroup.width = 380, vFourSubGroup.height = 58, vFourSubGroup.x = 0, vFourSubGroup.y = 141;
                    vMingSubGroup.height = 116, vMingSubGroup.horizontalCenter = 0,vMingSubGroup.scaleX=0.7,vMingSubGroup.scaleY=0.7;
                    vMingActionGroup.horizontalCenter = 0,vMingActionGroup.scaleX=0.7,vMingActionGroup.scaleY=0.7;
                    // if(MahjongHandler.getRoomPlayerMaxNum() === 2){
                        // vMingSubGroup.horizontalCenter = 190;
                        // vMingActionGroup.horizontalCenter = 190;
                    // }else if(MahjongHandler.getRoomPlayerMaxNum() ===3){
                        // vMingSubGroup.verticalCenter = 60;
                        // vMingActionGroup.verticalCenter = -10;
                    // }
                    // vMingActionGroup.verticalCenter = -100;
                    // vMingSubGroup.horizontalCenter = 190;
                    // vMingActionGroup.horizontalCenter = 190;
                    vMingSubGroup.bottom = -20;
                    vMingActionGroup.verticalCenter = -10;
                    this._isAddZeroIndex = false;
                    layout = new eui.HorizontalLayout();
                    layout.gap = 0;
                } else if (pPZOrientation === PZOrientation.LEFT) {
                    // pViewGroup.width = 147, pViewGroup.height = 310, pViewGroup.horizontalCenter = -277, pViewGroup.verticalCenter = -23;
                    // vOneSubGroup.width = 49, vOneSubGroup.height = 310, vOneSubGroup.x = 98, vOneSubGroup.y = 0;
                    // vTwoSubGroup.width = 49, vTwoSubGroup.height = 310, vTwoSubGroup.x = 49, vTwoSubGroup.y = 0;
                    // vThreeSubGroup.width = 49, vThreeSubGroup.height = 310, vThreeSubGroup.x = 0, vThreeSubGroup.y = 0;

                    pViewGroup.width = this.leftRightGroupWidth, pViewGroup.height = this.leftRightGroupHeight, pViewGroup.horizontalCenter = -345, pViewGroup.verticalCenter = -18;
                    vOneSubGroup.width = this.leftRightChuCardWidth, vOneSubGroup.height = this.leftRightGroupHeight, vOneSubGroup.x = this.leftRightChuCardWidth * 3 - 9, vOneSubGroup.y = 0;
                    vTwoSubGroup.width = this.leftRightChuCardWidth, vTwoSubGroup.height = this.leftRightGroupHeight, vTwoSubGroup.x = this.leftRightChuCardWidth * 2 - 6, vTwoSubGroup.y = 0;
                    vThreeSubGroup.width = this.leftRightChuCardWidth, vThreeSubGroup.height = this.leftRightGroupHeight, vThreeSubGroup.x = this.leftRightChuCardWidth - 3, vThreeSubGroup.y = 0;
                    // vFourSubGroup.width = this.leftRightChuCardWidth, vFourSubGroup.height = this.leftRightGroupHeight, vFourSubGroup.x = 0, vFourSubGroup.y = 0;

                    vMingSubGroup.height = 510, vMingSubGroup.verticalCenter = 0, vMingSubGroup.horizontalCenter = -20;
                    vMingActionGroup.verticalCenter = 0;
                    vMingActionGroup.horizontalCenter = 50;
                    this._isAddZeroIndex = false;
                    layout = new eui.VerticalLayout();
                    layout.gap = -15;
                    layout.verticalAlign  = "middle";
                } else if (pPZOrientation === PZOrientation.RIGHT) {
                    // pViewGroup.width = 147, pViewGroup.height = 310, pViewGroup.horizontalCenter = 277, pViewGroup.verticalCenter = -18;
                    // vOneSubGroup.width = 49, vOneSubGroup.height = 310, vOneSubGroup.x = 0, vOneSubGroup.y = 0;
                    // vTwoSubGroup.width = 49, vTwoSubGroup.height = 310, vTwoSubGroup.x = 49, vTwoSubGroup.y = 0;
                    // vThreeSubGroup.width = 49, vThreeSubGroup.height = 310, vThreeSubGroup.x = 98, vThreeSubGroup.y = 0;

                    pViewGroup.width = this.leftRightGroupWidth, pViewGroup.height = this.leftRightGroupHeight, pViewGroup.horizontalCenter = 345, pViewGroup.verticalCenter = -18;
                    vOneSubGroup.width = this.leftRightChuCardWidth, vOneSubGroup.height = this.leftRightGroupHeight, vOneSubGroup.x = 0, vOneSubGroup.y = 0;
                    vTwoSubGroup.width = this.leftRightChuCardWidth, vTwoSubGroup.height = this.leftRightGroupHeight, vTwoSubGroup.x = this.leftRightChuCardWidth - 3, vTwoSubGroup.y = 0;
                    vThreeSubGroup.width = this.leftRightChuCardWidth, vThreeSubGroup.height = this.leftRightGroupHeight, vThreeSubGroup.x = this.leftRightChuCardWidth * 2 - 6, vThreeSubGroup.y = 0;
                    // vFourSubGroup.width = this.leftRightChuCardWidth, vFourSubGroup.height = 315, vFourSubGroup.x = this.leftRightChuCardWidth * 3 - 9, vFourSubGroup.y = 0;

                    vMingSubGroup.height = 510, vMingSubGroup.verticalCenter = 0, vMingSubGroup.horizontalCenter = 20;
                    vMingActionGroup.verticalCenter = 0;
                    vMingActionGroup.horizontalCenter = -70;
                    this._isAddZeroIndex = true;
                    layout = new eui.VerticalLayout();
                    layout.gap = -15;
                    layout.verticalAlign  = "middle";
                }
                pViewGroup.addChild(vOneSubGroup);
                pViewGroup.addChild(vTwoSubGroup);
                pViewGroup.addChild(vThreeSubGroup);
                pViewGroup.addChild(vMingSubGroup);
                pViewGroup.addChild(vMingActionGroup);
                vMingSubGroup.layout = layout;
            }
            this._oneSubGroup = vOneSubGroup, this._twoSubGroup = vTwoSubGroup, this._threeSubGroup = vThreeSubGroup, this._fourSubGroup = vFourSubGroup, this._mingSubGroup = vMingSubGroup, this._mingActionGroup = vMingActionGroup;
        }

        /**
         * 重置显示内容
         * @param {Array<number>} vCardArray
         */
        public resetView(vCardArray:Array<number>):void {
            // 测试代码
            // for (let vIndex = 0; vIndex < 20; ++vIndex) {
            //     vCardArray.splice(0, 0, 1);
            // }
            //先清空显示
            let self = this;
            self._hasChuNum = 0;
            self._oneSubGroup.removeChildren();
            self._twoSubGroup.removeChildren();
            self._threeSubGroup.removeChildren();
            // if (self._pzOrientation === PZOrientation.DOWN) {
                self._fourSubGroup.removeChildren();
            // }
            self._chuCardValueArray = [];
            self._viewShadeIndexArray = [];

            //两个人的时候上下每排可以摆20个牌
            if (self._pzOrientation === PZOrientation.UP || self._pzOrientation === PZOrientation.DOWN) {
                if (MahjongHandler.getRoomPlayerMaxNum() === 2) {
                    self._subGroupMaxCardNum = 20;
                    if (self._pzOrientation === PZOrientation.UP) {
                        self._viewGroup.horizontalCenter = 38*5;
                        self._mingSubGroup.horizontalCenter = -38*5;
                        self._mingActionGroup.horizontalCenter = -38*5;
                    } else {
                        self._viewGroup.horizontalCenter = -38*5;
                        self._mingSubGroup.horizontalCenter = 38*5;
                        self._mingActionGroup.horizontalCenter = 38*5;
                    }
                } else {
                    self._subGroupMaxCardNum = 10;
                    self._viewGroup.horizontalCenter = 0;
                    self._mingSubGroup.horizontalCenter = 0;
                    self._mingActionGroup.horizontalCenter = 0;
                }
            }

            //三个人打的时候我自己的牌上移
            // if (self._pzOrientation === PZOrientation.DOWN) {
            //     if (MahjongHandler.getRoomPlayerMaxNum() === 3) {
            //         ViewUtil.addChildBefore(self._viewGroup, self._fourSubGroup, self._mingSubGroup);
            //         // self._viewGroup.addChild(self._fourSubGroup);
            //
            //         // self._viewGroup.verticalCenter = 20;
            //         // self._mingSubGroup.verticalCenter = 60;
            //         // self._mingActionGroup.verticalCenter = -10;
            //
            //         self._viewGroup.verticalCenter = 125;
            //         // self._mingSubGroup.horizontalCenter = 0;
            //         // self._mingActionGroup.horizontalCenter = 0;
            //
            //     // }else if(MahjongHandler.getRoomPlayerMaxNum() === 2 || MahjongHandler.getRoomPlayerMaxNum() === 4){
            //     } else {
            //         // self._mingSubGroup.horizontalCenter = 0;
            //         // self._mingActionGroup.horizontalCenter = 0;
            //     // } else {
            //         self._viewGroup.verticalCenter = 125;
            //         ViewUtil.removeChild(self._viewGroup, self._fourSubGroup);
            //     }
            // }

            // 三个人打的时候左右增加牌显示数量
            if (self._pzOrientation === PZOrientation.LEFT || self._pzOrientation === PZOrientation.RIGHT) {

            }
            //再添加显示
            if(vCardArray && vCardArray.length > 0) {
                if (self._pzOrientation === PZOrientation.RIGHT) {
                    let vStartIndex = vCardArray.length - 1, vCurrImage:MahjongCardItem, vCurrCardValue:number;
                    for (; vStartIndex >= 0; --vStartIndex) {
                        vCurrImage = self.getImageByIndex(vStartIndex, vCardArray[vStartIndex]);
                        vCurrCardValue = vCardArray[vStartIndex];
                        MahjongHandler.setRestCardNum(vCurrCardValue,1);
                        // console.log("chu: "+vCurrImage.source+"--"+ MahjongHandler.getRestCardNum(vCurrCardValue));
                        //添加
                        self.addChuCard(vCurrImage, vStartIndex);
                        self._chuCardValueArray[vStartIndex] = vCurrCardValue;
                    }
                } else {
                    let vIndex:number = 0, vLength:number = vCardArray.length, vCurrImage:MahjongCardItem, vCurrCardValue:number;
                    for (; vIndex < vLength; ++vIndex) {
                        vCurrImage = self.getImageByIndex(vIndex, vCardArray[vIndex]);
                        vCurrCardValue = vCardArray[vIndex];
                        //添加
                        MahjongHandler.setRestCardNum(vCurrCardValue,1);
                        // console.log("chu: "+vCurrImage.source+"--"+ MahjongHandler.getRestCardNum(vCurrCardValue));
                        self.addChuCard(vCurrImage, vIndex);
                        self._chuCardValueArray[vIndex] = vCurrCardValue;
                    }
                }
                // self._hasChuNum = vCardArray.length-1;
                self._hasChuNum = vCardArray.length;
            }

            // 测试代码
            let vTempCardArray:Array<number> = new Array<number>();
            // vTempCardArray.push(1);
            // vTempCardArray.push(2);
            // vTempCardArray.push(3);
            // vTempCardArray.push(4);
            // vTempCardArray.push(5);
            // vTempCardArray.push(6);
            // vTempCardArray.push(7);
            // vTempCardArray.push(8);
            // vTempCardArray.push(9);
            // vTempCardArray.push(9);
            // vTempCardArray.push(9);
            // vTempCardArray.push(9);
            // vTempCardArray.push(50);
            // vTempCardArray.push(50);
            // vTempCardArray.push(50);
            // vTempCardArray.push(50);
            // vTempCardArray.push(50);
            // vTempCardArray.push(50);
            // vTempCardArray.push(50);
            // vTempCardArray.push(50);
            // vTempCardArray.push(50);
            // vTempCardArray.push(50);
            // vTempCardArray.push(50);
            // vTempCardArray.push(50);
            // vTempCardArray.push(50);
            //有花牌
            if (vTempCardArray.length > 0) {
                let vStartIndex = vTempCardArray.length - 1, vCurrImage:MahjongCardItem;
                for (; vStartIndex >= 0; --vStartIndex) {
                    vCurrImage = self.getImageByIndex(vStartIndex, vCardArray[vStartIndex]);
                    //添加
                    self.addChuCard(vCurrImage, vStartIndex);
                }
                self._hasChuNum += vTempCardArray.length;
            }
            // 开始游戏后强行清除
            self.rmMingCard(-1);
        }

        /**
         * 获得一张图片
         * @param {number} pIndex
         * @returns {eui.Image}
         */
        private getImageByIndex(pIndex:number, cardValue: number = 0):MahjongCardItem {
            let self = this;
            // let vImage:MahjongCardItem = self._chuImageArray[pIndex];
            let vImage:MahjongCardItem;
            //因为有3组，所以要分开计算
            let vSubIndex:number = pIndex%self._subGroupMaxCardNum;
            if (pIndex >= self._subGroupMaxCardNum * 3) {
                vSubIndex = pIndex - self._subGroupMaxCardNum * 2;
            }

            vImage = MahjongCardManager.getMahjongCard(cardValue, self._pzOrientation, MahjongCardType.OUT);
            if (self._pzOrientation === PZOrientation.LEFT || self._pzOrientation === PZOrientation.RIGHT) {
                // vImage.width = 49, vImage.height = 40, vImage.x = 0;
                vImage.width = self.leftRightChuCardWidth, vImage.height = self.leftRightChuCardHeight, vImage.x = 0;
                if (self._pzOrientation === PZOrientation.LEFT) {
                    vImage.y = vSubIndex * 35;
                } else {
                    vImage.y = this.leftRightGroupHeight - (vSubIndex+1) * 35 - 12;
                }
            } else {
                // vImage.width = 38, vImage.height = 58; // 老的
                vImage.width = self.upDownChuCardWidth, vImage.height = self.upDownChuCardHeight;
            }
            //做个限制 不能超过50个
            if (pIndex <=50) self._chuImageArray[pIndex] = vImage;
            //因为上面和下面的每组存放数量在两个人的时候会发生变化，所以要新设置x位置
            if (self._pzOrientation === PZOrientation.UP) {
                vImage.x = this.upDownGroupWidth - (vSubIndex+1) * (self.upDownChuCardWidth - 2);
            } else if(self._pzOrientation === PZOrientation.DOWN) {
                vImage.x = vSubIndex * (self.upDownChuCardWidth - 2);
            }
            return vImage;
        }

        /**
         * 添加一个出出去的牌
         * @param {eui.Image} pImg
         * @param {number} pIndex
         * @param {boolean} pIsAddZeroIndex
         */
        private addChuCard(pImg:MahjongCardItem, pIndex:number, pIsAddZeroIndex?:boolean):void {
            let self = this;
            //因为有3组，所以要分开添加
            //选中SubGroup
            let vSelectSubGroup:eui.Group = self.getSubGroup(pIndex);
            //添加
            if (pIsAddZeroIndex) {
                vSelectSubGroup.addChildAt(pImg, 0);
            } else {
                vSelectSubGroup.addChild(pImg);
            }
        }

        private addChuCardArrow(pImg:eui.Image, pIndex:number, pIsAddZeroIndex?:boolean):void {
            let self = this;
            //因为有3组，所以要分开添加
            //选中SubGroup
            let vSelectSubGroup:eui.Group = self.getSubGroup(pIndex);
            //添加
            if (pIsAddZeroIndex) {
                vSelectSubGroup.addChildAt(pImg, 0);
            } else {
                vSelectSubGroup.addChild(pImg);
            }
        }

        /**
         * 根据索引获得子组
         * @param {number} pIndex
         * @returns {eui.Group}
         */
        private getSubGroup(pIndex:number):eui.Group {
            let self = this;
            //因为有3组，所以要分开添加
            let vSubIndex:number = Math.floor(pIndex/self._subGroupMaxCardNum);
            if (vSubIndex === 0) {
                return self._oneSubGroup;
            } else if (vSubIndex === 1) {
                return self._twoSubGroup;
            } else {
                // if (self._pzOrientation === PZOrientation.DOWN && MahjongHandler.getRoomPlayerMaxNum() === 3) {
                // if (self._pzOrientation === PZOrientation.LEFT || self._pzOrientation === PZOrientation.RIGHT) {
                //     if (vSubIndex === 2) {
                //         return self._threeSubGroup;
                //     } else {
                //         return self._fourSubGroup;
                //     }
                // } else {
                    return self._threeSubGroup;
                // }
            }
        }

        /**
         * 增加一个打出去的牌
         * @param {number} cardValue
         */
        public addOneChuCard(cardValue:number, isAdd:boolean):void {
            let self = this;
            let vCurrImage:MahjongCardItem = self.getImageByIndex(self._hasChuNum, cardValue);
            self.addChuCard(vCurrImage, self._hasChuNum, self._isAddZeroIndex);
            self._chuCardValueArray[self._hasChuNum] = cardValue;
            //增加刚出牌的提示箭头
            self.addArrows(self._hasChuNum);
            //设置剩余牌数
            if(self._pzOrientation !== PZOrientation.DOWN || isAdd){
                MahjongHandler.setRestCardNum(cardValue,1);
            }
            //递增+1
            self._hasChuNum++;
        }

        /**
         * 添加箭头到最后一张牌
         */
        public addArrowsToLastCard(): void {
            let self = this;
            if (self._hasChuNum > 0) {
                //增加刚出牌的提示箭头
                self.addArrows(self._hasChuNum-1);
            }
        }

        /**
         * 显示明牌
         * @param {Array<number>} cards
         * @param {number} action
         * @param {number} delayTime
         */
        public addMingCard(cards: Array<number>,action:number,delayTime:number):void {
            let self = this;
            self.rmMingCard(-1);
            let vActionImage:eui.Image = new eui.Image();
            vActionImage.source = MahjongHandler.getActionImageResName(action);
            if(self._pzOrientation !== PZOrientation.DOWN){
                vActionImage.scaleX = 0.5,vActionImage.scaleY=0.5;
            }
            // vActionImage.horizontalCenter = vActionImage.width/2;
            self._mingActionGroup.addChild(vActionImage);
            for (let i:number=0,iLength:number=cards.length; i<iLength; ++i){
                let vCurrImage: MahjongCardItem = MahjongCardManager.getMahjongCard(cards[i], self._pzOrientation, MahjongCardType.MING);
                if(self._pzOrientation === PZOrientation.DOWN){
                    vCurrImage.width = 75, vCurrImage.height = 113;
                }else if(self._pzOrientation === PZOrientation.UP){
                    vCurrImage.width = 48, vCurrImage.height = 68;
                }else if(self._pzOrientation === PZOrientation.LEFT || self._pzOrientation === PZOrientation.RIGHT){
                    vCurrImage.width = 59, vCurrImage.height = 50;
                }
                self._mingSubGroup.addChild(vCurrImage);
            }
            self._deleteMingGroupId++;
            self._mingGroupHideTimes = new Date().getTime() + delayTime;
            self._myOperationRem = false;
            FL.MyCallBackUtil.delayedCallBack(delayTime, self.rmMingCard, self, self._deleteMingGroupId);
        }

        // 删除明牌组ID 和 明牌组隐藏时间
        private _deleteMingGroupId:number = 1;
        private _mingGroupHideTimes:number = 0;
        private _myOperationRem: boolean = false;

        /**
         * 删除明牌
         * @param {number} deleteMingGroupId   负数 为强制清除
         */
        public rmMingCard(deleteMingGroupId: number):void{
            let self = this;
            if (deleteMingGroupId < 0 || (self._deleteMingGroupId === deleteMingGroupId && self._myOperationRem)) {
                self._mingSubGroup.removeChildren();
                self._mingActionGroup.removeChildren();
            }
        }

        /**
         * 提示我出牌的时候隐藏明牌组
         */
        public hideMingGroup(): void {
            let self = this;
            self._myOperationRem = true;
            if (new Date().getTime() >= self._mingGroupHideTimes) {
                self.rmMingCard(self._deleteMingGroupId);
            }
        }

        /**
         * 删除最后一个出的牌
         */
        public removeLastChuCard():void {
            let self = this;
            let vLastChuCardIndex:number = self._hasChuNum - 1;
            let vCurrImage:MahjongCardItem = self._chuImageArray[vLastChuCardIndex];
            //选中SubGroup
            let vSelectSubGroup:eui.Group = self.getSubGroup(vLastChuCardIndex);
            //删除
            vSelectSubGroup.removeChild(vCurrImage);
            self._chuCardValueArray.splice(vLastChuCardIndex, 1);
            //减少一个
            self._hasChuNum--;
        }

        /**
         * 移除已被吃碰杠走的牌
         * @param {number} card
         * @param {number} cardIndex
         */
        public resetChuCardByRemoveCard(card:number, cardIndex:number):void {
            if (cardIndex < 0) {
                return;
            }
            let self = this;
            let vCurrImage:MahjongCardItem = self._chuImageArray[cardIndex];
            if (!vCurrImage) {
                return;
            }
            //选中SubGroup
            let vSelectSubGroup:eui.Group = self.getSubGroup(cardIndex);
            //删除
            ViewUtil.removeChild(vSelectSubGroup, vCurrImage);
            // vSelectSubGroup.removeChild(vCurrImage);
            self._chuCardValueArray.splice(cardIndex, 1);
            //设置剩余牌数,因为吃碰杠和出牌的时候已经减去两次了，所以出牌的牌要加回来
            if(MahjongData.lastActionPZoriatation !== PZOrientation.DOWN){
                MahjongHandler.addRestCardNum(card,1);
            }
            //减少一个
            self._hasChuNum--;
        }

        /**
         * 给相同的牌增加索引
         * @param {number} cardValue
         */
        public addSameCardValueShade(cardValue:number):void {
            let self = this;
            //清空所有
            self.removeAllShade();
            //找到相同的牌的索引位置
            let vSameValueIndexArray:number[] = [];
            for (let vIndex:number = 0, vLength:number = self._chuCardValueArray.length; vIndex < vLength; ++vIndex) {
                if (self._chuCardValueArray[vIndex] === cardValue) {
                    vSameValueIndexArray.push(vIndex);
                }
            }
            //循环添加
            for (let vIndex:number = 0; vIndex < vSameValueIndexArray.length; ++vIndex) {
                this.addShadeImage(vSameValueIndexArray[vIndex], vIndex);
            }
            //设置值
            self._viewShadeIndexArray = vSameValueIndexArray;
        }

        /**
         * 清空所有遮罩图片
         */
        public removeAllShade():void {
            let self = this;
            if (self._viewShadeIndexArray.length > 0) {
                for (let vIndex:number = 0; vIndex < self._viewShadeIndexArray.length; ++vIndex) {
                    let vCardIndex:number = self._viewShadeIndexArray[vIndex];
                    //选中SubGroup
                    let vSelectSubGroup:eui.Group = self.getSubGroup(vCardIndex);
                    ViewUtil.removeChild(vSelectSubGroup, self._shadeImageArray[vIndex]);
                    // vSelectSubGroup.removeChild(self._shadeImageArray[vIndex]);
                }
                self._viewShadeIndexArray = [];
            }
        }

        /**
         * 添加一个遮罩图片
         * @param {number} cardValueIndex
         * @param {number} shadeIndex
         */
        private addShadeImage(cardValueIndex:number, shadeIndex:number):void {
            let self = this;
            let vImage:eui.Image = self._shadeImageArray[shadeIndex];
            //因为有3组，所以要分开计算
            let vSubIndex:number = cardValueIndex%self._subGroupMaxCardNum;
            if (!vImage) {
                vImage = new eui.Image();
                if (self._pzOrientation === PZOrientation.LEFT || self._pzOrientation === PZOrientation.RIGHT) {
                    // vImage.width = 49, vImage.height = 40, vImage.x = 0;
                    vImage.width = 57, vImage.height = 45, vImage.x = 0;
                } else {
                    // vImage.width = 38, vImage.height = 58, vImage.y = 0;
                    vImage.width = 44, vImage.height = 69, vImage.y = 0;
                }
                // vImage.source = "select_shade_png", vImage.alpha = 0.5;
                vImage.source = "select_shade_png";
                //做个限制 不能超过3个
                if (shadeIndex < 3) self._shadeImageArray[shadeIndex] = vImage;
            }
            //重设相应的位置
            if (self._pzOrientation === PZOrientation.UP) {
                // vImage.x = 380 - (vSubIndex+1) * 38;
                vImage.x = self.upDownGroupWidth - (vSubIndex+1) * 43;
            } else if(self._pzOrientation === PZOrientation.DOWN) {
                // vImage.x = vSubIndex * 38;
                vImage.x = vSubIndex * 43;
            } else if (self._pzOrientation === PZOrientation.LEFT) {
                // vImage.y = vSubIndex * 30;
                vImage.y = vSubIndex * 35;
            } else {
                // vImage.y = 310 - (vSubIndex+1) * 30 - 10;
                vImage.y = self.leftRightGroupHeight - (vSubIndex+1) * 35 - 12;
            }
            //获得所在组
            //选中SubGroup
            let vSelectSubGroup:eui.Group = self.getSubGroup(cardValueIndex);
            if (self._pzOrientation === PZOrientation.UP || self._pzOrientation === PZOrientation.DOWN) {
                vSelectSubGroup.addChild(vImage);
            } else {
                let vCardImage:MahjongCardItem = self._chuImageArray[cardValueIndex];
                ViewUtil.addChildAfter(vSelectSubGroup, vImage, vCardImage);
            }
        }

        /**
         * 添加箭头
         * @param {number} pIndex
         */
        private addArrows(pIndex:number):void {
            let self = this;
            let vImgArrows:eui.Image = self._arrows;
            if (!vImgArrows) {
                vImgArrows = new eui.Image();
                vImgArrows.source = "marker_png"; //这个图片宽度32 高度39
                self._arrows = vImgArrows;
                if (self._pzOrientation === PZOrientation.UP) {
                    self._arrows.visible = false; // 隐藏上面的
                }
            }
            //计算组里面的索引
            let vSubIndex:number = pIndex%self._subGroupMaxCardNum;
            if (pIndex >= self._subGroupMaxCardNum * 3) {
                vSubIndex = pIndex - self._subGroupMaxCardNum * 2;
            }
            //定义开始y和结束y
            let vStartY:number, vEndY:number;

            if (self._pzOrientation === PZOrientation.LEFT) {
                vStartY = vSubIndex * 35 - 44;
                vEndY = vSubIndex * 35 - 24;
                vImgArrows.x = 58 - 32 + 4;
            } else if (self._pzOrientation === PZOrientation.RIGHT) {
                vStartY = self.leftRightGroupHeight - (vSubIndex+1) * 35 - 56;
                vEndY = self.leftRightGroupHeight - (vSubIndex+1) * 35 - 36;
                vImgArrows.x = -4;
            } else {
                // vImgArrows.width = 38, vImgArrows.height = 58, vImgArrows.y = 0;
                vStartY = -42;
                vEndY = -22;
                //因为上面和下面的每组存放数量在两个人的时候会发生变化，所以要新设置x位置
                if (self._pzOrientation === PZOrientation.UP) {
                    vImgArrows.x = self.upDownGroupWidth - (vSubIndex+1) * (self.upDownChuCardWidth - 2) + 6;
                } else if(self._pzOrientation === PZOrientation.DOWN) {
                    vImgArrows.x = vSubIndex * (self.upDownChuCardWidth - 2) + 6;
                }
            }

            //设置初始y
            // vImgArrows.y = vEndY;
            vImgArrows.y = vStartY;
            //添加
            self.addChuCardArrow(vImgArrows, pIndex);

            //开始循环缓动
            //循环缓动
            let vTween:Game.Tween = Game.Tween.get(vImgArrows, {loop:true});
            // vTween.to({y:vStartY}, 400).to({y:vEndY}, 400);
            vTween.to({y:vEndY}, 400).to({y:vStartY}, 400);

            if (self._pzOrientation === PZOrientation.UP) {
                MvcUtil.send(MahjongModule.MAHJONG_UP_CARD_MIDDLE_ARROWS_CHANGE, self._arrows);
            }
        }

        /**
         * 移除箭头
         */
        public removeArrows():void {
            let self = this;
            let vImgArrows:eui.Image = self._arrows;
            if (vImgArrows) {
                //移除缓动
                Game.Tween.removeTweens(vImgArrows);
                //箭头所在组
                // let vArrowsGroup:eui.Group = self.getSubGroup(self._hasChuNum);
                // ViewUtil.removeChild(vArrowsGroup, vImgArrows);
                ViewUtil.removeChild(self._oneSubGroup, vImgArrows);
                ViewUtil.removeChild(self._twoSubGroup, vImgArrows);
                ViewUtil.removeChild(self._threeSubGroup, vImgArrows);
                if (self._pzOrientation === PZOrientation.UP) {
                    MvcUtil.send(MahjongModule.MAHJONG_UP_CARD_MIDDLE_ARROWS_CHANGE);
                }
            }
        }

    }
}