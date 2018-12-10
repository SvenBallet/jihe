module FL {
    /**
     * 麻将结算详情item
     * @copyright 深圳市天天爱科技有限公司
     * @author Sven
     * @date 2018/6/26
     */
    export class MJGameOverDetailItem extends eui.Component {
        public plLabel0Img:eui.Image;
        public plLabel1Img:eui.Image;
        public plLabel2Img:eui.Image;
        // 条目名称
        public itemName:eui.Label;
        // 条目内容
        public plLabel1:eui.Label;
        public plLabel2:eui.Label;
        public plLabel3:eui.Label;
        public plLabel4:eui.Label;
        // 可能需要隐藏的条目图片
        public plLabel3Img:eui.Image;
        public plLabel4Img:eui.Image;

        /**颜色组 */
        public static readonly colorObject = {
            "0": "0x323232",// 普通类型
            "2": "0x0064c8",// 胡牌类型1
            "3": "0x0064c8",// 胡牌类型2
            "4": "0x007d00",// 中马中鸟等类型
            "5": "0xc82800",// 小计分类型
            "6": "0xff7800",// 总结算计分
        }
        /**内容组 */
        private labelList:Array<eui.Label>;

        private _mData: MahjongGameOverScoreDetailItem = null;

        public constructor(data: MahjongGameOverScoreDetailItem) {
            super();
            this.skinName = "skins.MJGameOverDetailItemSkinN";
            this._mData = data;
        }

        protected childrenCreated():void {
            super.childrenCreated();
            this.labelList = [this.plLabel1, this.plLabel2, this.plLabel3, this.plLabel4];
            this._mData && this.initItem(this._mData);
        }

        public initItem(data: MahjongGameOverScoreDetailItem) {
            let self = this;
            self.setColor(data.viewStyle);
            self.itemName.text = data.desc;
            self.setContent(data.values);
        }

        public changeImgColor() {
            let self = this;
            let sourceStr = "detail_blue_grid_png"
            self.plLabel0Img.source = sourceStr;
            self.plLabel1Img.source = sourceStr;
            self.plLabel2Img.source = sourceStr;
            self.plLabel3Img.source = sourceStr;
            self.plLabel4Img.source = sourceStr;
        }

        private setColor(colorType: number) {
            let self = this;
            let color = MJGameOverDetailItem.colorObject[colorType.toString()];
            self.itemName.textColor = color;
            self.plLabel1.textColor = color;
            self.plLabel2.textColor = color;
            self.plLabel3.textColor = color;
            self.plLabel4.textColor = color;
        }

        private setContent(list: Array<string>) {
            let self = this;

            if (list.length == 2) {
                self.plLabel3Img.visible = false;
                self.plLabel3.visible = false;
                self.plLabel4Img.visible = false;
                self.plLabel4.visible = false;
            }
            else if (list.length == 3) {
                self.plLabel3Img.visible = true;
                self.plLabel3.visible = true;
                self.plLabel4Img.visible = false;
                self.plLabel4.visible = false;
            }
            else if (list.length == 4) {
                self.plLabel3Img.visible = true;
                self.plLabel3.visible = true;
                self.plLabel4Img.visible = true;
                self.plLabel4.visible = true;
            }

            for (let i = 0;i < list.length;i ++) {
                self.labelList[i].text = list[i];
            }
        }
    }
}