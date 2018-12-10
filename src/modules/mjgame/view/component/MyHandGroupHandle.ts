module FL {

    /**
     * 我手里的牌的对象
     */
    export class MyHandCardObj {
        /** 牌的值 */
        public readonly cardValue:number;
        /** 是否是癞子 */
        public readonly isLaizi:boolean;

        /** 是否可选中 */
        public isCanSelect:boolean;
        /** 是否已经选中 */
        public isSelected:boolean;

        constructor(cardValue:number, isLaizi:boolean) {
            this.cardValue = cardValue;
            this.isLaizi = isLaizi;
            this.isCanSelect = true;
            this.isSelected = false;
        }
    }

    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase - MyHandGroupHandle
     * @Description:  我手里的牌操作类，包含胡牌显示组
     * @Create: DerekWu on 2017/12/1 17:40
     * @Version: V1.0
     */
    export class MyHandGroupHandle extends HandGroupHandle {
        public addLastViewCard(cardValue: number): void {
            super.addLastViewCard(cardValue);
        }
        /** 显示组 */
        private readonly _viewGroup:eui.Group;
        /** 胡牌显示组 和 Label 和 听牌标志*/
        private _huList:eui.Component;
        private _huGroup:eui.Group;
        private _huPaiLabel:eui.Label;
        private _tingIcon:eui.Image;
        /** 显示胡牌详情列表 */
        private _huGroupArray:eui.Group[];

        /** 拖动选中图片 */
        private _touchMoveGroup:eui.Group;
        private _touchMoveCardObj:MyHandCardObj;
        /** 拖动选中图片的起始位置，用来回复位置用 */
        private _touchMoveStartPos:{posX:number, posY:number};
        /** 移动的最后一次舞台位置，用来偏移选中的图片 */
        private _touchMoveLastPos:{posX:number, posY:number};
        /** 是否开始拖动 */
        private _isStartMove:boolean;

        constructor(viewGroup:eui.Group) {
            viewGroup.width = 1280, viewGroup.height = 270, viewGroup.horizontalCenter = 0, viewGroup.bottom = -3;
            let vHandGroup:eui.Group = new eui.Group();
            super(PZOrientation.DOWN, vHandGroup);
            viewGroup.addChild(vHandGroup);
            this._viewGroup = viewGroup;
            this._huGroupArray = [];
        }

        /**
         * 重置界面
         * @param {Array<FL.CardDown>} cardDownArray
         */
        public resetView(cardDownArray:Array<CardDown>):void {
            super.resetView(cardDownArray);
            this.reset();
        }

        /**
         * 点击我的手牌区域
         * @param {egret.TouchEvent} e
         */
        public touchMyHandCardArea(e:egret.TouchEvent):void {
            //判断能不能点
            if (MJGameHandler.getGameState() === EGameState.PLAYING && MJGameHandler.getCurrOperationOrientation() === PZOrientation.DOWN
                && !MJGameHandler.isReplay() && MJGameHandler.touchHandCardSwitch.isOpen() && !this._isStartMove) {
                let self = this;
                let vTouchImageIndex:number = self.getTouchImageIndex(e.localX);
                if (vTouchImageIndex !== -1) {
                    let vCardObj = self._cardObjArray[vTouchImageIndex - self._cardDownNum * 3];
                    if (vCardObj) {
                        if (vCardObj.isSelected) {
                            // if (MJGameHandler.getCurrOperationOrientation() === PZOrientation.DOWN) {
                                self.chuCardAndReset(vCardObj);
                            // } else {
                            //     PromptUtil.show("还没轮到您出牌！", "pField");
                            // }
                            //
                            //关闭可操作开关
                            // MJGameHandler.touchHandCardSwitch.close();
                        } else if (vCardObj.isCanSelect) {
                            //取消所有选中
                            self.cancelAllSelected();
                            //选中当前
                            let vSelectedGroup:eui.Group = self._viewHandCardArray[vTouchImageIndex];
                            if (vSelectedGroup) {
                                vSelectedGroup.y = -15;
                                vCardObj.isSelected = true;
                            }
                            //增加遮罩
                            MvcUtil.send(MJGameModule.MJGAME_ADD_SHADE_TO_SELECT, vCardObj.cardValue);
                        }
                    }
                }
            }
        }

        /**
         * 触摸开始，兼容拖动打牌
         * @param {egret.TouchEvent} e
         */
        public touchBeginMyHandCardArea(e:egret.TouchEvent):void {
            //判断能不能点
            if (MJGameHandler.getGameState() === EGameState.PLAYING && MJGameHandler.getCurrOperationOrientation() === PZOrientation.DOWN
                && !MJGameHandler.isReplay() && MJGameHandler.touchHandCardSwitch.isOpen()) {
                let self = this;
                let vTouchImageIndex:number = self.getTouchImageIndex(e.localX);
                if (vTouchImageIndex !== -1) {
                    let vCardObj = self._cardObjArray[vTouchImageIndex - self._cardDownNum * 3];
                    if (vCardObj) {
                        if (vCardObj.isCanSelect) {
                            //选中当前
                            let vSelectedGroup:eui.Group = self._viewHandCardArray[vTouchImageIndex];
                            self._touchMoveGroup = vSelectedGroup;
                            self._touchMoveCardObj = vCardObj;
                            self._touchMoveStartPos = {posX:vSelectedGroup.x, posY:vSelectedGroup.y};
                            self._touchMoveLastPos = {posX:e.stageX, posY:e.stageY};
                            self._isStartMove = false;
                            //增加遮罩
                            MvcUtil.send(MJGameModule.MJGAME_ADD_SHADE_TO_SELECT, vCardObj.cardValue);
                            //在舞台增加移动监听 和 触摸结束监听
                            self.realHandViewGroup.stage.addEventListener(egret.TouchEvent.TOUCH_MOVE, self.touchMoveSelectedImage, self);
                            self.realHandViewGroup.stage.addEventListener(egret.TouchEvent.TOUCH_END, self.touchMoveEndSelectedImage, self);
                            self.realHandViewGroup.stage.addEventListener(egret.TouchEvent.TOUCH_CANCEL, self.touchMoveEndSelectedImage, self);
                        }
                    }
                }
            }
        }

        /**
         * 拖动开始，兼容拖动打牌
         * @param {egret.TouchEvent} e
         */
        public touchMoveSelectedImage(e:egret.TouchEvent):void {
            let self = this;
            if (!self._isStartMove) {
                self._isStartMove = true;
                //调整到最上层
                self.realHandViewGroup.addChild(self._touchMoveGroup);
            }
            //计算偏移的xy坐标
            let vOffsetX:number = e.stageX - self._touchMoveLastPos.posX;
            let vOffsetY:number = e.stageY - self._touchMoveLastPos.posY;
            //偏移图片位置
            self._touchMoveGroup.x += vOffsetX;
            self._touchMoveGroup.y += vOffsetY;
            //设置最后移动的舞台坐标
            self._touchMoveLastPos.posX = e.stageX;
            self._touchMoveLastPos.posY = e.stageY;
        }

        /**
         * 拖动结束，兼容拖动打牌
         * @param {egret.TouchEvent} e
         */
        private touchMoveEndSelectedImage(e:egret.TouchEvent):void {
            let self = this;
            //在舞台删除移动监听 和 触摸结束监听
            self.realHandViewGroup.stage.removeEventListener(egret.TouchEvent.TOUCH_CANCEL, self.touchMoveEndSelectedImage, self);
            self.realHandViewGroup.stage.removeEventListener(egret.TouchEvent.TOUCH_END, self.touchMoveEndSelectedImage, self);
            self.realHandViewGroup.stage.removeEventListener(egret.TouchEvent.TOUCH_MOVE, self.touchMoveSelectedImage, self);
            if (self._isStartMove) {
                if (self._touchMoveGroup.y < -43) {
                    //出牌
                    self.chuCardAndReset(self._touchMoveCardObj);
                    //关闭可操作开关
                    // MJGameHandler.touchHandCardSwitch.close();
                } else {
                    self._touchMoveGroup.x = self._touchMoveStartPos.posX;
                    self._touchMoveGroup.y = self._touchMoveStartPos.posY;
                }
                //重置相关值
                self._touchMoveGroup = null;
                self._touchMoveCardObj = null;
                self._touchMoveStartPos = null;
                self._touchMoveLastPos = null;
            }
        }

        /**
         * 删除最后一个牌，并打出去
         */
        public removeLastAndChu():void {
            this.chuCardAndReset(this._cardObjArray[this._cardObjArray.length-1]);
        }

        /**
         * 删除最后当前牌，并打出去
         * @param {{cardValue: number; isLaizi: boolean; isSelected: boolean}} cardObj
         */
        private chuCardAndReset(cardObj:MyHandCardObj):void {
            let self = this;
            let vCardObjIndex:number = self._cardObjArray.indexOf(cardObj);
            if (vCardObjIndex !== -1) {
                // 判断手里有没有花牌
                if (!MJGameHandler.isHuaCard(cardObj.cardValue)) {
                    // 判断手里有没有花牌，手里有花牌，必须先打出花牌！
                    for (let vIndex:number = 0, vLength:number = self._cardObjArray.length; vIndex < vLength; ++vIndex) {
                        if (MJGameHandler.isHuaCard(self._cardObjArray[vIndex].cardValue)) {
                            PromptUtil.show("手里有花牌，必须先打出花牌！", PromptType.ALERT);
                            // 重置位置
                            self.getViewHandImg(self._cardDownNum * 3 + vCardObjIndex, cardObj.cardValue);
                            cardObj.isSelected = false;
                            return;
                        }
                    }
                }
                //往服务器发送出牌指令
                MJGameMsgHandler.sendChuCardMsg(cardObj.cardValue);
                //删除
                self._cardObjArray.splice(vCardObjIndex, 1);
                //重置
                let vCardArray:number[] = [];
                for (let vIndex:number = 0, vLength:number = self._cardObjArray.length; vIndex < vLength; ++vIndex) {
                    vCardArray.push(self._cardObjArray[vIndex].cardValue);
                }
                self.resetViewHandCard(vCardArray);
                //关闭可操作开关
                MJGameHandler.touchHandCardSwitch.close();
            }
        }

        /**
         * 取消所有选中
         */
        public cancelAllSelected():void {
            let self = this;
            //手里牌开始的索引
            let vHandImgStartIndex:number = self._cardDownNum * 3;
            //手里牌对象循环处理
            let vIndex:number = 0, vLength:number = self._cardObjArray.length, vCurrCardObj:{cardValue:number, isLaizi:boolean, isSelected:boolean};
            for (; vIndex < vLength; ++vIndex) {
                vCurrCardObj = self._cardObjArray[vIndex];
                if (vCurrCardObj.isSelected) {
                    //调整高度
                    let vOneCardGroup:eui.Group = self._viewHandCardArray[vHandImgStartIndex+vIndex];
                    vOneCardGroup.y = 0;
                    //设置为已经选中
                    vCurrCardObj.isSelected = false;
                }
            }
            //删除选中遮罩
            MvcUtil.send(MJGameModule.MJGAME_DEL_ALL_CHU_CARD_SHADE);
        }

        /**
         * 选中一个麻将值，有可能同事选中4个
         * @param {number} cardValue
         */
        public selectOneCardValue(cardValue:number):void {
            let self = this;
            //手里牌开始的索引
            let vHandImgStartIndex:number = self._cardDownNum * 3;
            //手里牌对象循环处理
            let vIndex:number = 0, vLength:number = self._cardObjArray.length, vCurrCardObj:MyHandCardObj;
            for (; vIndex < vLength; ++vIndex) {
                vCurrCardObj = self._cardObjArray[vIndex];
                if (vCurrCardObj.cardValue === cardValue) {
                    if (!vCurrCardObj.isSelected) {
                        //调整高度
                        let vOneCardGroup:eui.Group = self._viewHandCardArray[vHandImgStartIndex+vIndex];
                        if (vOneCardGroup) {
                            vOneCardGroup.y = -15;
                            //设置为已经选中
                            vCurrCardObj.isSelected = true;
                        }
                    }
                }
            }
        }

        /**
         * 增加选中一组牌，原来选中的继续保留
         * @param {number[]} cardArray
         * @param {boolean} isTing
         */
        public selectCardGroup(cardArray:number[]):void {
            let self = this;
            //手里牌对象循环处理
            let vIndex:number = 0, vLength:number = cardArray.length;
            for (; vIndex < vLength; ++vIndex) {
                self.selectOneCardValue(cardArray[vIndex]);
            }
        }

        /**
         * 设置所有未选中的牌为不能选中
         */
        public setAllNoSelectNotCanSelect():void {
            let self = this;
            //手里牌开始的索引
            let vHandImgStartIndex:number = self._cardDownNum * 3;
            //手里牌对象循环处理
            let vIndex:number = 0, vLength:number = self._cardObjArray.length, vCurrCardObj:MyHandCardObj;
            for (; vIndex < vLength; ++vIndex) {
                vCurrCardObj = self._cardObjArray[vIndex];
                if (!vCurrCardObj.isSelected) {
                    //设置不能选中
                    vCurrCardObj.isCanSelect = false;
                    //透明度边0.6
                    let vOneCardGroup:eui.Group = self._viewHandCardArray[vHandImgStartIndex+vIndex];
                    if (vOneCardGroup) {
                        vOneCardGroup.alpha = 0.6;
                    }
                }
            }
        }

        /**
         * 获取点击图片的索引，未选中则返回-1
         * @param {number} posX
         * @returns {number}
         */
        private getTouchImageIndex(posX:number):number {
            let self = this;
            //手里牌开始的图片
            let vHandImgStartIndex:number = self._cardDownNum * 3;
            let vGroup:eui.Group = self._viewHandCardArray[vHandImgStartIndex];
            if (vGroup) {
                let vRightWidth:number = posX - vGroup.x;
                if (vRightWidth >= 0) {
                    let vSelectIndex:number = vHandImgStartIndex + Math.floor(vRightWidth/75);
                    if (vSelectIndex <= 12) {
                        return vSelectIndex;
                    }
                    let vLastGroup:eui.Group = self._viewHandCardArray[13];
                    if (vLastGroup) {
                        if (posX >= vLastGroup.x && posX <= vLastGroup.x + 75) {
                            return 13;
                        }
                    }
                }
            }
            return -1;
        }

        /**
         * 更新胡牌列表
         * @param {number[]} tingCardArray
         */
        public huCardListUpdate(tingCardArray:number[]):void {
            let self = this;
            if (tingCardArray && tingCardArray.length > 0) {
                // let vHuList = self.getHuList();
                ViewUtil.removeChild(self._viewGroup, self._huList);
                let vHuList = new eui.Component();
                vHuList.skinName = "skins.MahjongShowHuListSkin";
                vHuList.x = 260;
                vHuList.y = 60;
                self._huList = vHuList;

                vHuList["huGroup"].removeChildren();
                for (let vIndex:number = 0, vLength = tingCardArray.length; vIndex < vLength; ++vIndex) {
                    vHuList["huGroup"].addChild(self.getHuCardGroup(tingCardArray[vIndex]));
                }
                ViewUtil.addChildBefore(self._viewGroup, vHuList, self._handGroup);

                let vPresentHandCardArray:number[] = self.getHandCardValue(self._cardObjArray);
                for (let j=0; j < vPresentHandCardArray.length; ++j) {
                    for (let vIndex:number = 0, vLength = tingCardArray.length; vIndex < vLength; ++vIndex) {
                        if(vPresentHandCardArray[j] === tingCardArray[vIndex]){
                            self.addTingArrows(j);
                        }
                    }
                }

                if (MJGameHandler.isTing(PZOrientation.DOWN)) {
                    this.addTingIcon(false);
                }
            } else {
                //重置
                self.reset();
            }
        }

        /**
         * 重置
         */
        public reset():void {
            let self = this;
            let vHuList = self.getHuList();
            let vTingIcon = self.getTingIcon();
            vHuList.removeChildren();
            ViewUtil.removeChild(self._viewGroup, vTingIcon);
            ViewUtil.removeChild(self._viewGroup, vHuList);
        }

        /**
         * 添加听牌标识
         */
        public addTingIcon(isTween:boolean = true):void {
            let self = this;
            let vTingIcon = self.getTingIcon();
            Game.Tween.removeTweens(vTingIcon);
            if (isTween) {
                //初始化值
                vTingIcon.scaleX = 2.5, vTingIcon.scaleY = 2.5, vTingIcon.alpha = 0.33;
                //缓动
                Game.Tween.get(vTingIcon).to({scaleX:1, scaleY:1, alpha:1}, 200);
            } else {
                //初始化值
                vTingIcon.scaleX = 1, vTingIcon.scaleY = 1, vTingIcon.alpha = 1;
            }
            ViewUtil.addChild(self._viewGroup, vTingIcon);
        }

        /**
         * 获得胡牌列表
         * @returns {eui.Component}
         */
        private getHuList():eui.Component {
            if (!this._huList) {
                let huList = new eui.Component();
                huList.skinName = "skins.MahjongShowHuListSkin";
                huList.x = 260;
                huList.y = 60;
                this._huList = huList;
            }
            return this._huList;
        }

        /**
         * 获得胡Group
         * @returns {eui.Group}
         */
        private getHuGroup():eui.Group {
            if (!this._huGroup) {
                let vGroup:eui.Group = new eui.Group();
                vGroup.width = 34;
                this._huGroup = vGroup;
            }
            return this._huGroup;
        }

        /**
         * 获得胡牌Label
         * @returns {eui.Label}
         */
        private getHuPaiLabel():eui.Label {
            if (!this._huPaiLabel) {
                let vLabel:eui.Label = new eui.Label("胡牌");
                vLabel.textColor = 0xEDEC41,vLabel.size = 22, vLabel.fontFamily = "SimHei";
                vLabel.x = 276, vLabel.bottom = 136;
                this._huPaiLabel = vLabel;
            }
            return this._huPaiLabel;
        }

        /**
         * 获得听牌图片
         * @returns {eui.Image}
         */
        private getTingIcon():eui.Image {
            if (!this._tingIcon) {
                let vImage:eui.Image = new eui.Image();
                vImage.anchorOffsetX = 25;
                vImage.anchorOffsetY = 34;
                vImage.x = 342, vImage.y = 94, vImage.source = "ting_icon_png";
                this._tingIcon = vImage;
            }
            // Game.Tween.removeTweens(this._tingIcon);
            return this._tingIcon;
        }

        /**
         * 获得一个胡牌组
         * @param {number} cardValue
         * @returns {eui.Image}
         */
        private getHuCardGroup(cardValue:number):eui.Group {
            let vGroup:eui.Group = new eui.Group();
            vGroup.width = 34;
            let vImage:MahjongCardItem = MahjongCardManager.getMahjongCommonCard(cardValue, 28, 42);
            let vLabel:eui.Label = new eui.Label();
            vLabel.x=2, vLabel.y=46, vLabel.size=16, vLabel.fontFamily="Microsoft YaHei", vLabel.textColor=0xedec41;
            //剩余牌数
            let restCard:number = MJGameHandler.getRestCardNum(cardValue)?MJGameHandler.getRestCardNum(cardValue):4;
            vLabel.text = restCard+ "张";
            vGroup.addChild(vImage);
            vGroup.addChild(vLabel);
            if(MJGameHandler.isLaiZi(cardValue)){
                vGroup.filters = [MJGameHandler.laiziColorFilter];
            } else {
                vGroup.filters = null;
            }
            return vGroup;
        }

    }
}