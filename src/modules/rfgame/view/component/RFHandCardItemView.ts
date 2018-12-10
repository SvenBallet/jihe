module FL {
    export enum PokerCardStyle {
        SMALL = 1,
        PLUS = 2
    }

    export class RFHandCardItemView extends eui.Component {
        public bgImg: eui.Image;//背景
        public numImg: eui.Image;//数字
        public iconSImg: eui.Image;//小图标
        public iconLImg: eui.Image;//大图标
        public shadeImg: eui.Image;//遮罩
        public shadeRect:eui.Rect;

        private flag_selected: boolean = false;//选中状态
        public flag_isCanSelect: boolean = true;//能否被选中
        /** 扑克风格 */
        public static cardStyle: PokerCardStyle = Number(Storage.getPokerStyle()) || PokerCardStyle.PLUS;

        protected data: ICardData//: ICardData;//数据
        public constructor() {
            super();
            this.skinName = "skins.RFHandCardItemSkin";
        }

        protected childrenCreated() {
            // super.childrenCreated();
            // this.initView(this.data);
        }

        public initView(data: ICardData) {
            this.data = data;
            if (!this.data) return;
            this.initCard(this.data.type, this.data.value);
        }

        /** 重置属性 */
        public resetView() {
            this.data = null;
            this.flag_selected = false;
            this.flag_isCanSelect = true;
            this.y = 0;
            this.filters = null;
            this.rotation = 0;
            
            this.isShowShade(false);
            this.showLightShade(false);
        }

        /** 获取数据 */
        public getData() {
            return this.data;
        }

        /**获取牌值，特殊用处，慎用 */
        public getCardValue() {
            if (this.data.value == 2) {
                return 0;
            }else if (this.data.value == 1) {
                return 14;
            }else if (this.data.value == 14 || this.data.value == 15) {
                return 0;
            }else {
                return this.data.value;
            }
        }

        /**获取牌比大小牌值 */
        public getCardCompareValue() {
            if (this.data.value == 2) {
                return 13;
            }else if (this.data.value == 1) {
                return 12;
            }else if (this.data.value == 14 || this.data.value == 15) {
                return 20;
            }else {
                return this.data.value - 2;
            }
        }

        /** 根据花色和值获取相应图片资源并初始化 */
        private initCard(type: ECardIconType, value: number) {
            let iconL = "";//大图标
            let iconS = "";//小图标
            let num = "";//数字
            iconL = "B0" + type + "_png";
            iconS = "A0" + type + "_png";
            if (type == ECardIconType.Diamond || type == ECardIconType.Heart) {//红桃方片
                let _value = (value.toString().length < 2) ? "0" + value : "" + value;
                num = "C" + _value + "_png";
            } else if (type == ECardIconType.Spade || type == ECardIconType.Club) {//黑桃梅花
                let _value = (value.toString().length < 2) ? "0" + value : "" + value;
                num = "D" + _value + "_png";
            }

            //初始化
            this.iconLImg.source = iconL;
            this.iconSImg.source = iconS;
            this.numImg.source = num;
            this.isShowShade(false);
            this.showLightShade(false);

            this.rePokerStyle();
        }

        public rePokerStyle() {
            let type = this.data.type;
            if (RFHandCardItemView.cardStyle == PokerCardStyle.PLUS) {
                if (type == ECardIconType.JokerL || type == ECardIconType.JokerS) {
                    //如果是大小王，则只有大小图标，并且位置需要调整
                    this.numImg.visible = false;
                    this.numImg.x = 4;
                    this.numImg.y = 13;
                    this.iconSImg.x = 12;
                    this.iconSImg.y = 13;
                    this.iconLImg.x = 46;
                    this.iconLImg.y = 37;
                } else {
                    this.numImg.scaleX = this.numImg.scaleY = 1.2;
                    this.iconSImg.scaleX = this.iconSImg.scaleY = 1.2;
                    this.iconLImg.scaleX = this.iconLImg.scaleY = 1;
                    this.numImg.visible = true;
                    this.numImg.x = 4;
                    this.numImg.y = 13;
                    this.iconSImg.x = 13;
                    this.iconSImg.y = 79;
                    this.iconLImg.x = 59;
                    this.iconLImg.y = 115;
                }
            }
            else {
                if (type == ECardIconType.JokerL || type == ECardIconType.JokerS) {
                    //如果是大小王，则只有大小图标，并且位置需要调整
                    this.numImg.visible = false;
                    this.numImg.x = 4;
                    this.numImg.y = 13;
                    this.iconSImg.x = 12;
                    this.iconSImg.y = 13;
                    this.iconLImg.x = 46;
                    this.iconLImg.y = 37;
                } else {
                    this.numImg.scaleX = this.numImg.scaleY = 1;
                    this.iconSImg.scaleX = this.iconSImg.scaleY = 1;
                    this.iconLImg.scaleX = this.iconLImg.scaleY = 1;
                    this.numImg.visible = true;
                    this.numImg.x = 4;
                    this.numImg.y = 13;
                    this.iconSImg.x = 12;
                    this.iconSImg.y = 71;
                    this.iconLImg.x = 59;
                    this.iconLImg.y = 115;
                }
            }
        }

        /** 获得选中状态 */
        public getSelected() {
            return this.flag_selected;
        }

        /** 改变选中状态 */
        public changeSelectedState() {
            if (!this.flag_isCanSelect) return;
            this.flag_selected = !this.flag_selected
            return true;
        }

        /** 设置选中状态 */
        public setSelected(flag: boolean) {
            if (!this.flag_isCanSelect) return;
            this.flag_selected = flag;
        }

        /** 是否显示遮罩 */
        public isShowShade(flag: boolean) {
            this.shadeImg.visible = flag;
        }

        /** 是否显示临时遮罩 */
        public showLightShade(flag: boolean) {
            this.shadeRect.visible = flag;
        }

        /** 改变遮罩状态*/
        public changeLightShade() {
            this.shadeRect.visible = !this.shadeRect.visible;
        }
    }
}