module FL {
    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase - HuaGroupHandle
     * @Description:  //花显示组的操作类
     * @Create: DerekWu on 2017/12/1 17:43
     * @Version: V1.0
     */
    export class HuaGroupHandle {

        /** 花显示组 */
        private readonly _viewGroup:eui.Group;

        /** 花的数量 */
        private _hasHuaNum:number;
        /** 花图片数组，永不销毁 */
        private readonly _huaImageArray:Array<eui.Image> = new Array<eui.Image>();

        /** 后续补花是否添加到索引0 */
        private readonly _isAddZeroIndex:boolean;
        /** 牌桌方向 */
        private readonly _pzOrientation:PZOrientation;

        constructor(pPZOrientation:PZOrientation, pViewGroup:eui.Group) {
            this._pzOrientation = pPZOrientation;
            this._viewGroup = pViewGroup;
            if (pPZOrientation === PZOrientation.UP) {
                pViewGroup.width = 660, pViewGroup.height = 50, pViewGroup.horizontalCenter = 0, pViewGroup.verticalCenter = -228;
                this._isAddZeroIndex = false;
            } else if (pPZOrientation === PZOrientation.DOWN) {
                pViewGroup.width = 660, pViewGroup.height = 50, pViewGroup.horizontalCenter = 0, pViewGroup.verticalCenter = 182;
                this._isAddZeroIndex = false;
            } else if (pPZOrientation === PZOrientation.LEFT) {
                pViewGroup.width = 43, pViewGroup.height = 480, pViewGroup.horizontalCenter = -452, pViewGroup.verticalCenter = -120;
                this._isAddZeroIndex = true;
            } else if (pPZOrientation === PZOrientation.RIGHT) {
                pViewGroup.width = 43, pViewGroup.height = 480, pViewGroup.horizontalCenter = 452, pViewGroup.verticalCenter = -120;
                this._isAddZeroIndex = true;
            }
        }

        /**
         * 重置显示内容
         * @param {Array<FL.CardDown>} cardDownArray
         */
        public resetView(cardDownArray:Array<CardDown>):void {
            //先清空显示
            let self = this;
            self._hasHuaNum = 0;
            self._viewGroup.removeChildren();
            //再添加显示
            //获得花牌
            let vCardArray:Array<number> = MJGameHandler.getHuaCardArrayByCardDownArray(cardDownArray), vHuaValue:number;
            //有花牌
            if (vCardArray.length > 0) {
                let vStartIndex = vCardArray.length - 1, vCurrImage:eui.Image;
                for (; vStartIndex >= 0; --vStartIndex) {
                    vCurrImage = self.getImageByIndex(vStartIndex);
                    vHuaValue = vCardArray[vStartIndex];
                    vCurrImage.source = self.getHuaCardResName(vHuaValue);
                    self._viewGroup.addChild(vCurrImage);
                }
                self._hasHuaNum += vCardArray.length;
            }


            // if (self._pzOrientation === PZOrientation.DOWN) {
            //     //我自己 就处理
            //     MJGameHandler.addMyBuhuaNum(self._hasHuaNum);
            // }

            //TODO 测试代码
            // let vCardArray:Array<number> = new Array<number>();
            // vCardArray.push(1);
            // vCardArray.push(2);
            // vCardArray.push(3);
            // vCardArray.push(4);
            // vCardArray.push(5);
            // vCardArray.push(6);
            // vCardArray.push(7);
            // vCardArray.push(8);
            // vCardArray.push(9);
            // //有花牌
            // if (vCardArray.length > 0) {
            //     let vStartIndex = vCardArray.length - 1, vCurrImage:eui.Image;
            //     for (; vStartIndex >= 0; --vStartIndex) {
            //         vCurrImage = self.getImageByIndex(vStartIndex);
            //         let vHuaValue = vCardArray[vStartIndex];
            //         vCurrImage.source = self.getHuaCardResName(vHuaValue);
            //         self._viewGroup.addChild(vCurrImage);
            //     }
            //     self._hasHuaNum += vCardArray.length;
            // }
        }

        /**
         * 获得一张图片
         * @param {number} pIndex
         * @returns {eui.Image}
         */
        private getImageByIndex(pIndex:number):eui.Image {
            let self = this;
            let vImage:eui.Image = self._huaImageArray[pIndex];
            if (!vImage) {
                vImage = new eui.Image();
                if (self._pzOrientation === PZOrientation.LEFT || self._pzOrientation === PZOrientation.RIGHT) {
                    vImage.width = 43, vImage.height = 35, vImage.x = 0;
                    vImage.y = 480 - (pIndex+1) * 26 - 9;
                } else {
                    vImage.width = 33, vImage.height = 50, vImage.y = 0;
                    if (self._pzOrientation === PZOrientation.UP) {
                        vImage.x = pIndex * 33;
                    } else {
                        vImage.x = 660 - (pIndex+1) * 33;
                    }
                }
                //做个限制 不能超过50个
                if (pIndex <=50) self._huaImageArray[pIndex] = vImage;
            }
            return vImage;
        }

        /**
         * 获得一个花牌的资源
         * @param {number} pHuaValue
         * @returns {string}
         */
        private getHuaCardResName(pHuaValue:number):string {
            if (this._pzOrientation === PZOrientation.DOWN) {
                return  MJGameHandler.getCardResName(PZOrientation.UP, pHuaValue);
            } else {
                return MJGameHandler.getCardResName(this._pzOrientation, pHuaValue);
            }
        }

        /**
         * 增加一个花牌
         */
        public addOneHuaCard(cardValue:number):void {
            let self = this;
            let vCurrImage:eui.Image = self.getImageByIndex(self._hasHuaNum);
            vCurrImage.source = self.getHuaCardResName(cardValue);
            if (self._isAddZeroIndex) {
                self._viewGroup.addChildAt(vCurrImage, 0);
            } else {
                self._viewGroup.addChild(vCurrImage);
            }
            //递增+1
            self._hasHuaNum++;
            // if (self._pzOrientation === PZOrientation.DOWN) {
            //     //我自己 就处理
            //     MJGameHandler.addMyBuhuaNum(1);
            // }
        }

    }
}