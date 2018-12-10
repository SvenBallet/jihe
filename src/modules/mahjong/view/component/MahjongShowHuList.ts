module FL {
    /**
     * 胡牌提示
     * @copyright 深圳市天天爱科技有限公司
     * @author Sven
     * @date 2018/11/06
     */
    export class MahjongShowHuList extends eui.Component {
        public showGro:eui.Group;
        public sumCardNum:eui.Label;
        public huGroup:eui.Group;
        public touchIcon:eui.Image;

        public constructor() {
            super();
            this.skinName = skins.MahjongShowHuListSkin;
        }
    
        protected childrenCreated() {
            let self = this;
            this.touchIcon.addEventListener(egret.TouchEvent.TOUCH_TAP, this.iconTouch, this);
            this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onRemove, this);
        }

        private onRemove() {
             egret.MainContext.instance.stage.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.setUIState, this);
        }

        public setHuList(tingCardArray: Array<MahjongTingInfo>, isFromSelectChuCard: boolean) {
            this.huGroup.removeChildren();
            let huCardSum:number = 0;
            for (let vIndex:number = 0, vLength = tingCardArray.length; vIndex < vLength; ++vIndex) {
                huCardSum += MahjongHandler.getRestCardNum(tingCardArray[vIndex].card);
                this.huGroup.addChild(MahjongMyHandGroupHandle.getHuCardGroup(tingCardArray[vIndex]));
            }
            if(huCardSum<0){
                huCardSum = 0;
            } else if (huCardSum > MahjongHandler.getCardLeftNum()) {
                huCardSum = MahjongHandler.getCardLeftNum();
            }
            this.sumCardNum.text = ""+huCardSum;
            this.setUIState(isFromSelectChuCard);
        }

        private iconTouch() {
            this.setUIState();
        }

        /**
         * 原来的布局、层级等原因，这里判断是否是点击麻将子时比较骚
         */
        private allTouch(event: egret.TouchEvent) {
            let target: any = event.target;
            if (target == this.touchIcon) {
                console.log("NO HIDE");
                return;
            }
            let gro: any; 
            let item: any;
            if (target && (target instanceof eui.Group)) {
                gro = target.getChildAt(0);
            }
            if (gro && (gro instanceof eui.Group)) {
                item = gro.getChildAt(0);
            }
            if (item && (item instanceof MahjongCardItem)) {
                console.log("CARD TOUCH NO HIDE");
                return;
            }

            this.setUIState(false);
        }

        public setUIState(showFlag: boolean = true) {
            this.showGro.visible = showFlag;
            this.touchIcon.visible = !showFlag;

            if (showFlag) {
                egret.MainContext.instance.stage.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.allTouch, this);
                egret.MainContext.instance.stage.addEventListener(egret.TouchEvent.TOUCH_TAP, this.allTouch, this);
            }
            else {
                egret.MainContext.instance.stage.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.allTouch, this);
            }
        }
    }
}