module FL {
    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase - MahjongCardDownGroup
     * @Description:  //吃碰杠显示组
     * @Create: DerekWu on 2017/12/1 17:40
     * @Version: V1.0
     */
    export class MahjongCardDownGroup {

        /** 显示组 */
        public readonly cardDownView:eui.Group = new eui.Group();
        /** 显示组中的牌的图片，最多4个 */
        // private readonly _cardImgArray:Array<eui.Image> = new Array<eui.Image>();
        private readonly _cardImgArray:Array<MahjongCardItem> = new Array<MahjongCardItem>();
        /** 遮罩模板 */
        private readonly _shadeImg:eui.Image = new eui.Image();
        /** 箭头 */
        private readonly _arrowsImg:eui.Image = new eui.Image();

        /** 当前组所在牌桌方向 */
        private readonly _pzOrientation:PZOrientation;

        /** 牌的宽高 */
        private readonly _cardWidth:number;
        private readonly _cardHeight:number;
        /** 牌的xy位置*/
        private readonly _xPos:number[];
        private readonly _yPos:number[];

        /** 碰牌的value，补杠的时候用 */
        public pengCardValue:number = -10;

        constructor(pPZOrientation:PZOrientation) {
            let self = this;
            this._pzOrientation = pPZOrientation;
            if (pPZOrientation === PZOrientation.UP) {
                // //设置组的宽高
                // self.cardDownView.width = 38*3, self.cardDownView.height = 59;
                // //设置箭头的宽高
                // self._arrowsImg.width = self._arrowsImg.height = 24;
                // //设置尺寸位置
                // this._cardWidth = 38, this._cardHeight = 59;
                // this._xPos = [0,38,76,38], this._yPos = [0,0,0,-13];
                self.cardDownView.y = 1;
                //设置组的宽高
                self.cardDownView.width = 45*3-4, self.cardDownView.height = 69;
                //设置箭头的宽高
                self._arrowsImg.width = self._arrowsImg.height = 24;
                //设置尺寸位置
                this._cardWidth = 45, this._cardHeight = 69;
                this._xPos = [0,43,86,43], this._yPos = [0,0,0,-16];

            } else if (pPZOrientation === PZOrientation.DOWN) {
                // //设置组的宽高
                // self.cardDownView.width = 68*3, self.cardDownView.height = 106;
                // //设置箭头的宽高
                // self._arrowsImg.width = self._arrowsImg.height = 44;
                // //设置尺寸位置
                // this._cardWidth = 68, this._cardHeight = 106;
                // this._xPos = [0,68,136,68], this._yPos = [0,0,0,-23];

                //设置组的宽高
                self.cardDownView.width = 68*3 - 4, self.cardDownView.height = 106;
                //设置箭头的宽高
                self._arrowsImg.width = self._arrowsImg.height = 44;
                //设置尺寸位置
                this._cardWidth = 68, this._cardHeight = 106;
                this._xPos = [0,66,132,66], this._yPos = [0,0,0,-23];
            } else{
                // //设置组的宽高
                // self.cardDownView.width = 46, self.cardDownView.height = 38*3-20;
                // //设置箭头的宽高
                // self._arrowsImg.width = self._arrowsImg.height = 20;
                // //设置尺寸位置
                // this._cardWidth = 46, this._cardHeight = 38;
                // this._xPos = [1,1,1,1], this._yPos = [0,28,56,18];

                //设置组的宽高
                self.cardDownView.width = 58, self.cardDownView.height = 47*3-24;
                //设置箭头的宽高
                self._arrowsImg.width = self._arrowsImg.height = 22;
                //设置尺寸位置
                this._cardWidth = 58, this._cardHeight = 47;
                this._xPos = [0,0,0,0], this._yPos = [0,35,70,25];

            }
            //设置遮罩宽高，透明度
            // self._shadeImg.width = self._cardWidth, self._shadeImg.height = self._cardHeight, self._shadeImg.alpha = 0.5;
            self._shadeImg.width = self._cardWidth, self._shadeImg.height = self._cardHeight, self._shadeImg.alpha = 0.6;
            //设置资源
            self._shadeImg.source = "carddown_shade_png";
            //不可触摸
            self.cardDownView.touchEnabled = false, self.cardDownView.touchChildren = false;
        }

        /**
         * 重置显示
         * @param {FL.CardDown} cardDown
         */
        public resetView(cardDown:MahjongCardDown):void {
            let self = this;
            //删除所有
            self.cardDownView.removeChildren();
            //显示牌的数量
            let vViewCardNum:number = 3;
            //明杠、暗杠、补杠
            if (cardDown.sCardDownType === MahjongCardDownTypeEnum.MING_GANG
                || cardDown.sCardDownType === MahjongCardDownTypeEnum.AN_GANG
                || cardDown.sCardDownType === MahjongCardDownTypeEnum.BU_GANG) {

                vViewCardNum = 4;
            }

            // console.log("vViewCardNum="+vViewCardNum);

            //循环添加图片
            let vIndex:number = 0, vImage:MahjongCardItem;
            for (; vIndex < vViewCardNum; ++vIndex) {
                vImage = self.getOneCardImg(vIndex, cardDown);
                self.cardDownView.addChild(vImage);
            }

            //长沙杠后自己吃碰杠的操作需要，把目标牌减去一次
            if(!MahjongData.isFirstEnter && self._pzOrientation === PZOrientation.DOWN && cardDown.sFlag === 1 ){
                MahjongHandler.setRestCardNum(cardDown.sTargetCard,1);
            }

            //别人的补杠再把之前碰减的三张加回来
            if (!MahjongData.isFirstEnter && self._pzOrientation !== PZOrientation.DOWN && cardDown.sCardDownType === MahjongCardDownTypeEnum.BU_GANG) {
                MahjongHandler.addRestCardNum(cardDown.sTargetCard,3);
            }

            //不是暗杠 和 吃，添加遮罩和箭头
            if (cardDown.sCardDownType !== MahjongCardDownTypeEnum.AN_GANG && cardDown.sCardDownType !== MahjongCardDownTypeEnum.CHI) {
                //获得箭头索引，遮罩位置也是相同的索引
                let vArrowsIndex:number = self.getArrowsIndex(cardDown.sChuOffset, vViewCardNum);
                let vShadeImg:eui.Image = self.getShadeImg(vArrowsIndex);
                self.cardDownView.addChildAt(vShadeImg, vArrowsIndex+1);
                //获得箭头方向 和 图片
                let vArrowsOrientation:PZOrientation = self.getArrowsOrientation(cardDown.sChuOffset);
                let vArrowsImg:eui.Image = self.getArrowsImg(vArrowsIndex, vArrowsOrientation);
                self.cardDownView.addChild(vArrowsImg);
            }

            //如果是碰的话，记录碰的牌，补杠的时候用
            if (cardDown.sCardDownType === MahjongCardDownTypeEnum.PENG || cardDown.sCardDownType === MahjongCardDownTypeEnum.BU_GANG) {
                self.pengCardValue = cardDown.sCards[0];
            } else {
                self.pengCardValue = -10;
            }
            //更新胡牌列表
            if(MahjongData.huCardInfoList){
                MvcUtil.send(MahjongModule.MAHJONG_UPDATE_HU_LIST,MahjongData.huCardInfoList);
            }
        }

        /**
         * 通过索引获得一个牌的图片
         * @param {number} index
         * @param {FL.CardDown} cardDown
         * @returns {eui.Image}
         */
        private getOneCardImg(index:number, cardDown:MahjongCardDown):MahjongCardItem {
            let self = this;
            // let vImage:MahjongCardItem = self._cardImgArray[index];
            let vImage:MahjongCardItem;
            let vCardValue:number = cardDown.sCards[index];
            if (self._pzOrientation === PZOrientation.RIGHT && cardDown.sCardDownType === MahjongCardDownTypeEnum.CHI) {
                if (index === 0) {
                    vCardValue = cardDown.sCards[2];
                } else if (index === 2) {
                    vCardValue = cardDown.sCards[0];
                }
            }

            //暗杠特殊处理
            if (cardDown.sCardDownType === MahjongCardDownTypeEnum.AN_GANG) {
                if (index === 3 && (self._pzOrientation === PZOrientation.DOWN || MahjongHandler.isReplay() || MahjongHandler.isShowOtherPlayerAnGang())) {
                    //获得牌的值
                    vImage = MahjongCardManager.getMahjongCard(vCardValue, this._pzOrientation, MahjongCardType.EAT);
                } else {
                    vImage = MahjongCardManager.getMahjongCard(vCardValue, this._pzOrientation, MahjongCardType.ANGANG);
                }
            } else {
                //获得牌的值
                vImage = MahjongCardManager.getMahjongCard(vCardValue, this._pzOrientation, MahjongCardType.EAT);
            }
            //减掉剩余牌数
            if(self._pzOrientation !== PZOrientation.DOWN || MahjongData.isFirstEnter){
                MahjongHandler.setRestCardNum(vCardValue,1);
            }

            vImage.width = self._cardWidth, vImage.height = self._cardHeight;
            vImage.x = self._xPos[index], vImage.y = self._yPos[index];
            //最多4个
            // if (index<4) self._cardImgArray[index] = vImage;

            return vImage;
        }

        /**
         * 获得暗杠资源名
         * @returns {string}
         */
        private getAnGangResName():string {
            if (this._pzOrientation === PZOrientation.UP || this._pzOrientation === PZOrientation.DOWN) {
                return MahjongHandler.gete_mj_b_up_png();
            } else {
                return MahjongHandler.gete_mj_b_left_png();
            }
        }

        /**
         * 获得箭头索引
         * @param {number} chuOffset
         */
        private getArrowsIndex(chuOffset:number, cardNum:number):number {
            let self = this, vResult:number = 3;
            if (cardNum !== 4) {
                if (self._pzOrientation === PZOrientation.DOWN || self._pzOrientation === PZOrientation.LEFT) {
                    if (chuOffset === -1) {
                        vResult = 0;
                    } else if (chuOffset === 0) {
                        if (cardNum === 4) {
                            vResult = 3;
                        } else {
                            vResult = 1;
                        }
                    } else {
                        vResult = 2;
                    }
                } else {
                    if (chuOffset === -1) {
                        vResult = 2;
                    } else if (chuOffset === 0) {
                        if (cardNum === 4) {
                            vResult = 3;
                        } else {
                            vResult = 1;
                        }
                    } else {
                        vResult = 0;
                    }
                }
            }
            return vResult;
        }

        /**
         * 获得箭头方向
         * @param {number} chuOffset
         * @returns {FL.PZOrientation}
         */
        private getArrowsOrientation(chuOffset:number):PZOrientation {
            let self = this, vResult:PZOrientation;
            if (self._pzOrientation === PZOrientation.UP) {
                if (chuOffset === -1) {
                    vResult = PZOrientation.RIGHT;
                } else if (chuOffset === 0) {
                    vResult = PZOrientation.DOWN;
                } else {
                    vResult = PZOrientation.LEFT;
                }
            } else if (self._pzOrientation === PZOrientation.DOWN) {
                if (chuOffset === -1) {
                    vResult = PZOrientation.LEFT;
                } else if (chuOffset === 0) {
                    vResult = PZOrientation.UP;
                } else {
                    vResult = PZOrientation.RIGHT;
                }
            } else if (self._pzOrientation === PZOrientation.LEFT) {
                if (chuOffset === -1) {
                    vResult = PZOrientation.UP;
                } else if (chuOffset === 0) {
                    vResult = PZOrientation.RIGHT;
                } else {
                    vResult = PZOrientation.DOWN;
                }
            } else if (self._pzOrientation === PZOrientation.RIGHT) {
                if (chuOffset === -1) {
                    vResult = PZOrientation.DOWN;
                } else if (chuOffset === 0) {
                    vResult = PZOrientation.LEFT;
                } else {
                    vResult = PZOrientation.UP;
                }
            }
            return vResult;
        }

        /**
         * 获得遮罩图片，顺便会设置位置
         * @param {number} index
         * @returns {eui.Image}
         */
        private getShadeImg(index:number):eui.Image {
            let self = this;
            let vTempX:number = self._xPos[index];
            let vTempY:number = self._yPos[index];
            self._shadeImg.x = vTempX, self._shadeImg.y = vTempY;
            return self._shadeImg;
        }

        /**
         * 通过索引 和 箭头方向 获得箭头图片资源，中途会重置位置
         * @param {number} index
         */
        private getArrowsImg(index:number, arrowsOrientation:PZOrientation):eui.Image {
            let self = this;
            //计算位置
            let vTempX:number = self._xPos[index] + self._cardWidth/2 - self._arrowsImg.width/2;
            let vTempY:number = self._yPos[index] + self._cardHeight/2 - self._arrowsImg.height/2;
            // let vRatio:number = index < 3?1:2;
            if (self._pzOrientation === PZOrientation.UP) {
                // vTempY -= 7 * vRatio;
                vTempY -= 7;
            } else if (self._pzOrientation === PZOrientation.DOWN) {
                // vTempY -= 12 * vRatio;
                vTempY -= 12;
            } else {
                // vTempY -= 5 * vRatio;
                vTempY -= 5;
            }
            //设置位置
            self._arrowsImg.x = vTempX, self._arrowsImg.y = vTempY;
            //设置图片
            if (arrowsOrientation === PZOrientation.UP) {
                self._arrowsImg.source = "top_png";
            } else if (arrowsOrientation === PZOrientation.DOWN) {
                self._arrowsImg.source = "down_png";
            } else if (arrowsOrientation === PZOrientation.LEFT) {
                self._arrowsImg.source = "left_png";
            } else if (arrowsOrientation === PZOrientation.RIGHT) {
                self._arrowsImg.source = "right_png";
            }
            return self._arrowsImg;
        }

    }
}