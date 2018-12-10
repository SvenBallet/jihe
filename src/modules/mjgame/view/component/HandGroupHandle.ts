module FL {
    import View = puremvc.View;

    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase - HandGroupHandle
     * @Description:  //上下左右 玩家 手里的牌显示操作基类
     * @Create: DerekWu on 2017/12/1 17:39
     * @Version: V1.0
     */
    export class HandGroupHandle {

        /** 手里牌显示组, 包含吃碰杠的牌  和  真正的手牌显示组 */
        protected readonly _handGroup:eui.Group;
        /** 真正的手牌显示组，自己的手牌需要监听点击事件，来打牌 */
        public readonly realHandViewGroup:eui.Group = new eui.Group();

        public tingIconArray:Array<eui.Image> = new Array<eui.Image>();

        /** 打出的牌，废弃，放到别的显示层级 */
        // protected readonly _chuCardImg:eui.Image;
        /** 摸进来的牌，废弃，放到数组结尾 */
        // protected readonly _inCardImg:eui.Image;

        /** 吃碰杠的数量 */
        protected _cardDownNum:number = 0;
        /** 吃碰杠 显示组数组，最多4个 */
        protected readonly _cardDownArray:Array<CardDownGroup> = new Array<CardDownGroup>();
        /** 吃碰杠 显示组数组的 xy位置*/
        // private readonly _cardDownPosXArray:number[];
        // private readonly _cardDownPosYArray:number[];

        /** 看不见的手机的牌的数组，打牌的时候除了自己之外的其他三家用这个，最多14个 */
        protected readonly _hideHandCardArray:Array<eui.Image> = new Array<eui.Image>();
        /** 看得见的手里的牌数组，打牌的时候只有我自己才有这个值，回放的时候所有人都有这个值，最多14个 */
        protected readonly _viewHandCardArray:Array<eui.Group> = new Array<eui.Group>();

        /** 当前组所在牌桌方向 */
        private readonly _pzOrientation:PZOrientation;

        /** 当前显示的牌对象列表 */
        protected _cardObjArray:MyHandCardObj[] = [];

        constructor(pPZOrientation:PZOrientation, viewGroup:eui.Group) {
            this._handGroup = viewGroup;
            this._pzOrientation = pPZOrientation;
            if (pPZOrientation === PZOrientation.UP) {
                // viewGroup.width = 588, viewGroup.height = 64, viewGroup.horizontalCenter = -50, viewGroup.verticalCenter = -288;
                viewGroup.width = 588, viewGroup.height = 64, viewGroup.horizontalCenter = -50, viewGroup.top = 40;
                // this._cardDownPosXArray = [0,124,248,372], this._cardDownPosYArray = [5,5,5,5];
            } else if (pPZOrientation === PZOrientation.DOWN) {
                viewGroup.width = 1229, viewGroup.height = 129, viewGroup.x = 26, viewGroup.bottom = 0;
                // this._cardDownPosXArray = [0,224,448,672], this._cardDownPosYArray = [23,23,23,23];
            } else if (pPZOrientation === PZOrientation.LEFT) {
                viewGroup.width = 49, viewGroup.height = 478, viewGroup.horizontalCenter = -395, viewGroup.verticalCenter = -85;
                // this._cardDownPosXArray = [0,0,0,0], this._cardDownPosYArray = [0,102,204,306];
            } else if (pPZOrientation === PZOrientation.RIGHT) {
                viewGroup.width = 49, viewGroup.height = 478, viewGroup.horizontalCenter = 395, viewGroup.verticalCenter = -61;
                // this._cardDownPosXArray = [0,0,0,0], this._cardDownPosYArray = [378,276,174,72];
            }
            let self = this;
            self.realHandViewGroup.width = viewGroup.width;
            self.realHandViewGroup.height = viewGroup.height;
            // self._realHandViewGroup.x = 0, self._realHandViewGroup.y = 0;
            self._handGroup.addChild(self.realHandViewGroup);
            //不可触摸
            self._handGroup.touchEnabled = false;
            if (pPZOrientation !== PZOrientation.DOWN) {
                self._handGroup.touchChildren = false;
            } else {
                self.realHandViewGroup.touchEnabled = true, self.realHandViewGroup.touchChildren = false;
            }
        }

        /**
         * 重置界面
         * @param {Array<FL.CardDown>} cardDownArray
         */
        public resetView(cardDownArray:Array<CardDown>):void {
            //先清空显示
            let self = this;
            self._cardDownNum = 0;
            self._handGroup.removeChildren();
            self._handGroup.addChild(self.realHandViewGroup);

            //再添加显示
            if(cardDownArray && cardDownArray.length > 0) {
                let vIndex:number = 0, vLength:number = cardDownArray.length, vCurrCardDown:CardDown, vCardDownIndex:number = 0, vCurrCardDownGroup:CardDownGroup;
                for (; vIndex < vLength; ++vIndex) {
                    vCurrCardDown = cardDownArray[vIndex];
                    if (vCurrCardDown.type !== 0) {
                        vCurrCardDownGroup = self.getCardDownGroup(vCurrCardDown, vCardDownIndex);
                        //添加
                        ViewUtil.addChildBefore(self._handGroup, vCurrCardDownGroup.cardDownView, self.realHandViewGroup);
                        // self._handGroup.addChild(vCurrCardDownGroup.cardDownView);
                        vCardDownIndex++;
                    }
                }
                self._cardDownNum += vCardDownIndex;
            }

            //TODO 测试代码
            // let vTestCardValue:number = (1<<24)|(1<<16)|(1<<8)|1;
            // let vCardDown:CardDown = new CardDown();
            // vCardDown.type = GameConstant.MAHJONG_OPERTAION_PENG;
            // vCardDown.cardValue = vTestCardValue;
            // vCardDown.chuOffset = -1;
            // self.addCardDown(vCardDown);
            //
            // let vCardDown2:CardDown = new CardDown();
            // vCardDown2.type = GameConstant.MAHJONG_OPERTAION_AN_GANG;
            // vCardDown2.cardValue = vTestCardValue;
            // vCardDown2.chuOffset = 0;
            // self.addCardDown(vCardDown2);
            //
            // let vCardDown3:CardDown = new CardDown();
            // vCardDown3.type = GameConstant.MAHJONG_OPERTAION_MING_GANG;
            // vCardDown3.cardValue = vTestCardValue;
            // vCardDown3.chuOffset = 1;
            // self.addCardDown(vCardDown3);

            // let vCardDown4:CardDown = new CardDown();
            // vCardDown4.type = GameConstant.MAHJONG_OPERTAION_PENG;
            // vCardDown4.cardValue = vTestCardValue;
            // vCardDown4.chuOffset = 0;
            // self.addCardDown(vCardDown4);
            //
            // let vCardDown5:CardDown = new CardDown();
            // vCardDown5.type = GameConstant.MAHJONG_OPERTAION_PENG;
            // vCardDown5.cardValue = vTestCardValue;
            // vCardDown5.chuOffset = 1;
            // self.addCardDown(vCardDown5);

        }

        /**
         * 获得一个CardDown
         * @param {FL.CardDown} cardDown
         * @param {number} index
         * @returns {FL.CardDownGroup}
         */
        private getCardDownGroup(cardDown:CardDown, index:number):CardDownGroup {
            let self = this;
            let vCurrCardDownGroup:CardDownGroup = self._cardDownArray[index];
            if (!vCurrCardDownGroup) {
                vCurrCardDownGroup = new CardDownGroup(self._pzOrientation);
                // vCurrCardDownGroup.cardDownView.x = self._cardDownPosXArray[index];
                // vCurrCardDownGroup.cardDownView.y = self._cardDownPosYArray[index];
                //控制一下 4个
                if (index < 4) self._cardDownArray[index] = vCurrCardDownGroup;
            }
            //重置显示
            vCurrCardDownGroup.resetView(cardDown);
            return vCurrCardDownGroup;
        }

        /**
         * 重置吃碰杠组的位置
         */
        private resetCardDownGroupPos(isView:boolean):void {
            let self = this;
            //手里牌开始的图片索引
            let vHandImgStartIndex:number = self._cardDownNum * 3;
            let vGroup:any;
            if (isView) {
                vGroup = self._viewHandCardArray[vHandImgStartIndex];
            } else {
                vGroup = self._hideHandCardArray[vHandImgStartIndex];
            }
            //定义参考xy坐标
            let vTempX:number= vGroup.x, vTempY:number = vGroup.y, vTempNO:number = 1;
            if (self._pzOrientation === PZOrientation.RIGHT) {
                if (isView) {
                    vTempY += 40;
                } else {
                    vTempY += 60;
                }
            }
            //循环设置
            for (let vIndex:number = self._cardDownNum - 1; vIndex >=0; --vIndex) {
                let vCardDownView:eui.Group = self._cardDownArray[vIndex].cardDownView;
                if (self._pzOrientation === PZOrientation.UP) {
                    vCardDownView.y = 5;
                    if (isView) {
                        vCardDownView.x = vTempX - vTempNO*(vCardDownView.width+8);
                    } else {
                        vCardDownView.x = vTempX - vTempNO*(vCardDownView.width+8)-8;
                    }
                } else if (self._pzOrientation === PZOrientation.DOWN) {
                    vCardDownView.y = 23;
                    vCardDownView.x = vTempX - vTempNO*(vCardDownView.width+8)-42;
                } else if (self._pzOrientation === PZOrientation.LEFT) {
                    if (isView && self._cardDownNum === 4) {
                        vCardDownView.y = vTempY - vTempNO*(vCardDownView.height+8);
                    } else {
                        vCardDownView.y = vTempY - vTempNO*(vCardDownView.height+8)-10;
                    }
                    vCardDownView.x = 0;
                } else if (self._pzOrientation === PZOrientation.RIGHT) {
                    if (isView && self._cardDownNum === 4) {
                        vCardDownView.y = vTempY + 8 + (vTempNO-1)*(vCardDownView.height+8);
                    } else {
                        vCardDownView.y = vTempY + 18 + (vTempNO-1)*(vCardDownView.height+8);
                    }
                    vCardDownView.x = 0;
                }
                vTempNO++;
            }
        }

        /**
         * 添加
         * @param {FL.CardDown} cardDown
         */
        public addCardDown(cardDown:CardDown):void {
            let self = this;
            if (cardDown.type === GameConstant.MAHJONG_OPERTAION_BU_GANG) {
                let vGangCardValue:number = cardDown.cardValue & 0xFF;
                //补杠特殊处理
                let vIndex:number = 0, vLength:number = self._cardDownNum;
                for (; vIndex < vLength; ++vIndex) {
                    let vCurrCardDownGroup:CardDownGroup = self._cardDownArray[vIndex];
                    if (vCurrCardDownGroup.pengCardValue === vGangCardValue) {
                        vCurrCardDownGroup.resetView(cardDown);
                        break;
                    }
                }
            } else {
                let vCurrCardDownGroup = self.getCardDownGroup(cardDown, self._cardDownNum);
                //添加
                ViewUtil.addChildBefore(self._handGroup, vCurrCardDownGroup.cardDownView, self.realHandViewGroup);
                // self._handGroup.addChild(vCurrCardDownGroup.cardDownView);
                self._cardDownNum++;
            }
        }

        /**
         * 重置隐藏手牌，在打牌过程中调用，回放的是偶不调用
         */
        public resetHideHandCard():void {
            let self = this, vRealHandViewGroup:eui.Group = self.realHandViewGroup;
            //先清除所有
            vRealHandViewGroup.removeChildren();
            if (self._pzOrientation === PZOrientation.UP && MJGameHandler.getRoomPlayerMaxNum() === 3) {
                //3个人没有上面
                return;
            } else if ((self._pzOrientation === PZOrientation.LEFT || self._pzOrientation === PZOrientation.RIGHT) && MJGameHandler.getRoomPlayerMaxNum() === 2) {
                //两个人没有左右
                return;
            }
            //手里牌的数量
            // let vHandCardNum:number = 13 - self._cardDownNum * 3;
            //手里牌开始的图片索引
            let vHandImgStartIndex:number = self._cardDownNum * 3;
            if (self._pzOrientation === PZOrientation.RIGHT) {
                for (let vIndex:number = 12; vIndex >= vHandImgStartIndex; --vIndex) {
                    let vOneHideImg:eui.Image = self.getHideHandImg(vIndex);
                    vRealHandViewGroup.addChild(vOneHideImg);
                }
            } else {
                for (let vIndex:number = vHandImgStartIndex; vIndex < 13; ++vIndex) {
                    let vOneHideImg:eui.Image = self.getHideHandImg(vIndex);
                    vRealHandViewGroup.addChild(vOneHideImg);
                }
            }
            //重置位置
            self.resetCardDownGroupPos(false);
        }

        /**
         * 获得手里看不见的手牌
         * @param {number} index
         * @returns {eui.Image}
         */
        private getHideHandImg(index:number):eui.Image {
            let self = this;
            let vImage:eui.Image = self._hideHandCardArray[index];
            if (!vImage) {
                vImage = new eui.Image();
                if (self._pzOrientation === PZOrientation.UP) {
                    vImage.width = 42, vImage.height = 64;
                    vImage.y = 0;
                    vImage.x = (index+1) * 42;
                    vImage.source = "B_wind_9_png";
                } else if (self._pzOrientation === PZOrientation.LEFT) {
                    vImage.width = 24, vImage.height = 60;
                    vImage.y = 478 - 30 - (13-index)*30;
                    vImage.x = 12;
                    vImage.source = "e_mj_left_png";
                } else if (self._pzOrientation === PZOrientation.RIGHT) {
                    vImage.width = 24, vImage.height = 60;
                    // vImage.y = (12-index)*30;
                    vImage.x = 12;
                    vImage.source = "e_mj_right_png";
                }
                //控制一下 最多13个
                if (index < 13) self._hideHandCardArray[index] = vImage;
            }
            //右边会有动态调整高度，是界面看起来更美观
            // if (self._pzOrientation === PZOrientation.LEFT || self._pzOrientation === PZOrientation.RIGHT) {
            if (self._pzOrientation === PZOrientation.RIGHT) {
                // let vMaxHeight:number = 478;
                //手里牌的数量
                let vHandCardNum:number = 13 - self._cardDownNum * 3;
                //计算最大高度
                let vMaxHeight:number = self._cardDownNum * 102 + vHandCardNum*30+30;
                // if (self._pzOrientation === PZOrientation.LEFT) {
                //     let vLeftMaxHeight:number = vMaxHeight > 478?478:vMaxHeight;
                //     if () {
                //
                //     }
                //     // vImage.y = 478 - 30 - (13-index)*30;
                //     vImage.y = vLeftMaxHeight - 30 - (13-index)*30 + 5;
                // } else if (self._pzOrientation === PZOrientation.RIGHT) {
                let vTempMinY:number = 478 - vMaxHeight;
                let vRightMinY:number = vTempMinY < 0?0:vTempMinY;
                vImage.y = vRightMinY + (12-index)*30 - 10;
                // }
            }
            return vImage;
        }

        /**
         * 刷新显示手牌
         * @param {Array<number>} handCardArray
         */
        public resetViewHandCard(handCardArray:Array<number>):void {
            let self = this, vRealHandViewGroup:eui.Group = self.realHandViewGroup;
            //先清除所有
            vRealHandViewGroup.removeChildren();

            if (!handCardArray || handCardArray.length === 0) return;

            //排个序
            handCardArray.sort(function(a,b){
                return a-b});
            //设置当前玩家手牌
            if (self._pzOrientation === PZOrientation.DOWN) {
                if (!MJGameHandler.isReplay()) {
                    MJGameHandler.setHandCardArray(handCardArray, PZOrientation.DOWN);
                }
            } else if (self._pzOrientation === PZOrientation.UP && MJGameHandler.getRoomPlayerMaxNum() === 3) {
                //3个人没有上面
                return;
            } else if ((self._pzOrientation === PZOrientation.LEFT || self._pzOrientation === PZOrientation.RIGHT) && MJGameHandler.getRoomPlayerMaxNum() === 2) {
                //两个人没有左右
                return;
            }
            //删除选中遮罩
            MvcUtil.send(MJGameModule.MJGAME_DEL_ALL_CHU_CARD_SHADE);

            //如果牌多了，则删除后续的
            // if (14 - self._cardDownNum * 3) {
            //
            // }

            //排序后的牌
            let vSortedCardObjArray:MyHandCardObj[] = self.genSortedCardObjArray(handCardArray);
            //设置当前的值
            self._cardObjArray = vSortedCardObjArray;
            //手里牌开始的图片索引
            let vHandImgStartIndex:number = self._cardDownNum * 3, vLength:number = vSortedCardObjArray.length;
            if (self._pzOrientation === PZOrientation.RIGHT) {
                // for (let vIndex = vLength - 1; vIndex >= vHandImgStartIndex; --vIndex) {
                for (let vIndex = vLength - 1; vIndex >= 0; --vIndex) {
                    let vCardObj = vSortedCardObjArray[vIndex];
                    let vOneViewImg:MahjongCardItem = self.getViewHandImg(vHandImgStartIndex+vIndex, vCardObj.cardValue);
                    if (vCardObj.isLaizi) {
                        vOneViewImg.filters = [MJGameHandler.laiziColorFilter];
                    } else {
                        vOneViewImg.filters = null;
                    }
                    vRealHandViewGroup.addChild(vOneViewImg);
                }
            }else if(self._pzOrientation === PZOrientation.DOWN){
                for (let vIndex:number = 0; vIndex < vLength; ++vIndex) {
                    let vCardObj = vSortedCardObjArray[vIndex];
                    let vOneViewGroup:eui.Group = self.getMyViewHandGroup(vHandImgStartIndex+vIndex, vCardObj.cardValue);
                    if (vCardObj.isLaizi) {
                        // vOneViewGroup.filters = [MJGameHandler.laiziColorFilter];
                        vOneViewGroup["cardImage"].filters = [MJGameHandler.laiziColorFilter];
                    } else {
                        // vOneViewGroup.filters = null;
                        vOneViewGroup["cardImage"].filters = null;
                    }
                    vRealHandViewGroup.addChild(vOneViewGroup);
                }
            }else {
                for (let vIndex:number = 0; vIndex < vLength; ++vIndex) {
                    let vCardObj = vSortedCardObjArray[vIndex];
                    let vOneViewImg:MahjongCardItem = self.getViewHandImg(vHandImgStartIndex+vIndex, vCardObj.cardValue);
                    if (vCardObj.isLaizi) {
                        // vOneViewImg.filters = [MahjongHandler.laiziColorFilter];
                    } else {
                        vOneViewImg.filters = null;
                    }
                    vRealHandViewGroup.addChild(vOneViewImg);
                }
            }
            //重置位置
            self.resetCardDownGroupPos(true);
        }

        /**
         * 刷新显示手牌，从现有的手牌中删除一些连续的牌后再刷新 
         * @param {Array<number>} removeArray
         * @param {number} maxCardNum
         */
        public resetViewHandCardByRemoveArray(removeArray:Array<number>, maxCardNum:number):void {
            let self = this;
            //删除数组的索引
            let vRemoveArrayIndex:number = 0, vIndex:number = 0;
            //剩余手牌的数组
            let vResidueHandCardArray:number[] = [];
            for (; vIndex < self._cardObjArray.length; ++vIndex) {
                let vCurrCardObj = self._cardObjArray[vIndex];
                if (vRemoveArrayIndex < removeArray.length && removeArray[vRemoveArrayIndex] === vCurrCardObj.cardValue) {
                    vRemoveArrayIndex++;
                } else {
                    vResidueHandCardArray.push(vCurrCardObj.cardValue);
                }
            }
            // let vHandImgStartIndex:number = self._cardDownNum * 3;
            if (self._cardDownNum * 3 + vResidueHandCardArray.length !== maxCardNum) {
                if (GConf.Conf.isDev) {
                    let vErrorStr:string = "刷新手牌出错，请将这里的信息截图后提交bug，当前吃碰杠了"+self._cardDownNum+"个，原来手牌：";
                    for (let vIndex1:number = 0; vIndex1 < self._cardObjArray.length; ++vIndex1) {
                        vErrorStr += self._cardObjArray[vIndex1].cardValue+",";
                    }
                    vErrorStr += "删除的牌：";
                    for (let vIndex2:number = 0; vIndex2 < removeArray.length; ++vIndex2) {
                        vErrorStr += removeArray[vIndex2]+",";
                    }
                    vErrorStr += "删除后手里的牌：";
                    for (let vIndex3:number = 0; vIndex3 < vResidueHandCardArray.length; ++vIndex3) {
                        vErrorStr += vResidueHandCardArray[vIndex3]+",";
                    }
                    alert(vErrorStr);
                }
            }
            self.resetViewHandCard(vResidueHandCardArray);
        }

        /**
         * 获得排序后的牌对象列表
         * @param {Array<number>} handCardArray
         * @returns {MyHandCardObj[]}  牌的值，是否癞子，是否选中
         */
        private genSortedCardObjArray(handCardArray:Array<number>):MyHandCardObj[] {
            //定义新的数组对象
            let vCardObjArray:MyHandCardObj[]=[];
            //先放癞子
            let vIndex:number = 0, vLength:number = handCardArray.length, vCurrCardValue:number;
            for (; vIndex < vLength; ++vIndex) {
                vCurrCardValue = handCardArray[vIndex];
                if (MJGameHandler.isLaiZi(vCurrCardValue)) {
                    vCardObjArray.push(new MyHandCardObj(vCurrCardValue, true));
                }
            }
            //再放非癞子
            for (vIndex = 0; vIndex < vLength; ++vIndex) {
                vCurrCardValue = handCardArray[vIndex];
                if (!MJGameHandler.isLaiZi(vCurrCardValue)) {
                    vCardObjArray.push(new MyHandCardObj(vCurrCardValue, false));
                }
            }
            //返回
            return vCardObjArray;
        }

        /**
         * 获得自己手里看得见的牌
         * @param {number} index
         * @param {number} cardValue
         * @returns {eui.Group}
         */
        protected getMyViewHandGroup(index:number, cardValue:number):eui.Group {
            let self = this;
            let vGroup:eui.Group = self._viewHandCardArray[index];
            if (!vGroup) {
                vGroup = new eui.Group();
                vGroup.width = 75, vGroup.height = 129;

                //控制一下 最多14个
                if (index < 14) self._viewHandCardArray[index] = vGroup;
            }

            vGroup.y = 0;
            let vReduceX:number = 0;
            if (self._cardDownNum !== 0) {
                vReduceX = self._cardDownNum*46-42;
            }
            if (index === 13) {
                vGroup.x = index * 75 - vReduceX + 25;
            } else {
                vGroup.x = index * 75 - vReduceX;
            }
            //透明度改为1
            vGroup.alpha = 1;

            //设置资源
            vGroup.removeChildren();
            let vImage:MahjongCardItem = MahjongCardManager.getMahjongCard(cardValue, PZOrientation.DOWN, MahjongCardType.HAND);
            vGroup.addChild(vImage);
            vGroup["cardImage"] = vImage;
            return vGroup;
        }

        /**
         * 获得手里看得见的牌
         * @param {number} index
         * @param {number} cardValue
         * @returns {eui.Image}
         */
        protected getViewHandImg(index:number, cardValue:number):MahjongCardItem {
            let self = this;
            let vGroup:eui.Group = self._viewHandCardArray[index];
            if (!vGroup) {
                vGroup = new eui.Group();
                if (self._pzOrientation === PZOrientation.UP) {
                    vGroup.width = 42, vGroup.height = 64;
                    vGroup.y = 0;
                    vGroup.x = index * 42;
                } else if (self._pzOrientation === PZOrientation.DOWN) {
                    vGroup.width = 86, vGroup.height = 129;
                } else if (self._pzOrientation === PZOrientation.LEFT) {
                    vGroup.width = 49, vGroup.height = 40;
                    // vGroup.y = 478 - 30 - (13-index)*30;
                    vGroup.x = 0;
                } else if (self._pzOrientation === PZOrientation.RIGHT) {
                    vGroup.width = 49, vGroup.height = 40;
                    // vGroup.y = (12-index)*30;
                    // vGroup.x = 12;
                    vGroup.x = 0;
                }
                //最后一张牌默认蓝色滤镜
                // if (index === 13 && self._pzOrientation !== PZOrientation.DOWN) {
                //     vImage.filters = [MahjongHandler.replayNewCardColorFilter];
                // }
                //测试代码
                // if (index%2===0) {
                //     vImage.alpha = 0.6;
                // }
                //控制一下 最多14个
                if (index < 14) self._viewHandCardArray[index] = vGroup;
            }
            //暂时这么处理
            if(self._pzOrientation === PZOrientation.UP){
                if(index === 13) {
                    vGroup.x = 560;
                }
            }

            //左右会有动态调整高度，是界面看起来更美观
            if (self._pzOrientation === PZOrientation.LEFT || self._pzOrientation === PZOrientation.RIGHT) {
                // let vMaxHeight:number = 478;
                //手里牌的数量
                let vHandCardNum:number = 14 - self._cardDownNum * 3;
                //计算最大高度
                let vMaxHeight:number = self._cardDownNum * 102 + vHandCardNum*30+10;
                if (self._pzOrientation === PZOrientation.LEFT) {
                    let vLeftMaxHeight:number = vMaxHeight > 478?478:vMaxHeight;
                    vGroup.y = vLeftMaxHeight - 10 - (13-index)*30 + 5;
                    if(index === 13){
                        vGroup.y += 40;
                    }
                } else if (self._pzOrientation === PZOrientation.RIGHT) {
                    let vTempMinY:number = 478 - vMaxHeight;
                    let vRightMinY:number = vTempMinY < 0?0:vTempMinY;
                    vGroup.y = vRightMinY + (13-index)*30 - 10;
                    if(index === 13){
                        vGroup.y -= 33;
                    }
                }
            }
            //下面会有动态调整X坐标
            if (self._pzOrientation === PZOrientation.DOWN) {
                vGroup.y = 0;
                let vReduceX:number = 0;
                if (self._cardDownNum !== 0) {
                    vReduceX = self._cardDownNum*46-42;
                }
                if (index === 13) {
                    vGroup.x = index * 86 - vReduceX + 25;
                } else {
                    vGroup.x = index * 86 - vReduceX;
                }
                //透明度改为1
                vGroup.alpha = 1;
            }
            //设置资源
            vGroup.removeChildren();
            let vImage:MahjongCardItem = MahjongCardManager.getMahjongCard(cardValue, PZOrientation.DOWN, MahjongCardType.HAND);
            vGroup.addChild(vImage);
            return vImage;
        }

        /**
         * 添加最后一张显示牌，即刚摸进来的牌
         * @param {number} cardValue
         */
        public addLastViewCard(cardValue:number):void {
            let self = this;
            if (self._cardDownNum * 3 + self._cardObjArray.length > 13) {
                return;
            }
            let vCardImage:any;
            if(self._pzOrientation === PZOrientation.DOWN)
                vCardImage = self.getMyViewHandGroup(13, cardValue);
            else
                vCardImage = self.getViewHandImg(13, cardValue);

            let vIsLaizi:boolean = false;
            // if (self._pzOrientation === PZOrientation.DOWN) {
                if (MJGameHandler.isReplay()) {
                    vCardImage.filters = [MJGameHandler.replayNewCardColorFilter];
                } else if (MJGameHandler.isLaiZi(cardValue)) {
                    if (vCardImage["cardImage"]) {
                        vCardImage["cardImage"].filters = [MJGameHandler.laiziColorFilter];
                    } else {
                        vCardImage.filters = [MJGameHandler.laiziColorFilter];
                    }
                    vIsLaizi = true;
                } else {
                    if (vCardImage["cardImage"]) {
                        vCardImage["cardImage"].filters = null;
                    } else {
                        vCardImage.filters = null;
                    }
                }
            // }

            // let vHandImgStartIndex:number = self._cardDownNum * 3;

            //添加到列表
            self._cardObjArray.push(new MyHandCardObj(cardValue, vIsLaizi));

            // 手牌错误
            if (self._cardDownNum * 3 + self._cardObjArray.length !== 14) {
                if (GConf.Conf.isDev) {
                    let vErrorStr: string = "摸进一张牌手牌出错，请将这里的信息截图后提交bug，当前吃碰杠了" + self._cardDownNum + "个，手牌：";
                    for (let vIndex1: number = 0; vIndex1 < self._cardObjArray.length; ++vIndex1) {
                        vErrorStr += self._cardObjArray[vIndex1].cardValue + ",";
                    }
                    alert(vErrorStr);
                }
            }

            //显示
            if (self._pzOrientation === PZOrientation.RIGHT) {
                self.realHandViewGroup.addChildAt(vCardImage, 0);
            } else {
                let vCardGroup:eui.Group = new eui.Group();
                vCardGroup.addChild(vCardImage);
                self.realHandViewGroup.addChild(vCardGroup);
            }
        }

        /**
         * 添加听牌箭头
         */
        public addTingArrows(index:number):void  {
            let self = this;
            let vGroup:eui.Group = self._viewHandCardArray[index];
            if (vGroup) {
                let tingArrows:eui.Image = new eui.Image();
                tingArrows.source = "tingCardMark_png";

                //设置初始y
                tingArrows.x = 20;
                tingArrows.y = -76;
                //添加
                ViewUtil.addChild(vGroup, tingArrows);
            }
        }

        /**
         * 移除听牌箭头
         */
        public removeTingArrows():void {
            let self = this;
            // self.tingIconGroup.removeChildren();
        }

        /**
         * 通过手牌对象获取手牌值列表
         * @param {FL.MyHandCardObj[]} vcardObjArray
         * @returns {number[]}
         */
        public getHandCardValue(vcardObjArray:MyHandCardObj[]){
            let vResidueHandCardArray:number[] = [];
            for (let i=0; i < vcardObjArray.length; ++i) {
                let vCurrCardObj = vcardObjArray[i];
                vResidueHandCardArray.push(vCurrCardObj.cardValue);
            }
            return vResidueHandCardArray;
        }

    }
}