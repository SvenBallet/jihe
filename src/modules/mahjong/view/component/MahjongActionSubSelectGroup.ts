module FL {

    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase - MahjongActionSubSelectGroup
     * @Description:  // 麻将动作子选择，比如：当吃有多 暗杠有多个的时候
     * @Create: DerekWu on 2018/6/20 15:45
     * @Version: V1.0
     */
    export class MahjongActionSubSelectGroup extends eui.Group {

        /** 当前子动作（只有一个动作的时候这里有值） */
        public subActionResult:MahjongActionResult;
        /**  */
        public mahjongTableCardsHandView:MahjongTableCardsHandView;

        constructor(pSubActionResult:MahjongActionResult, pMahjongTableCardsHandView:MahjongTableCardsHandView) {
            super();
            this.subActionResult = pSubActionResult;
            this.mahjongTableCardsHandView = pMahjongTableCardsHandView;
            this.init();
        }

        private init(){
            let self = this;
            let vCardArray: Array<number> = [];
            let vCard1:number = self.subActionResult.value & 0xFF;
            let vCard2:number = self.subActionResult.value >> 8 & 0xFF;
            let vCard3:number = self.subActionResult.value >> 16 & 0xFF;
            let vCard4:number = self.subActionResult.value >> 24 & 0xFF;
            vCardArray.push(vCard1);
            vCardArray.push(vCard2);
            vCardArray.push(vCard3);
            if (vCard4 > 0) {
                vCardArray.push(vCard4);
            }
            self.width = vCardArray.length * 55 +40;
            self.height = 110;
            let vImg:eui.Image = new eui.Image();
            vImg.width = self.width, vImg.height = self.height;
            vImg.source = "hubg_png";  // scale9Grid="18,12,30,4"
            vImg.scale9Grid = new egret.Rectangle(18,12,30,4); // 九宫格
            self.addChild(vImg);
            for (let vIndex:number = 0; vIndex < vCardArray.length; ++vIndex) {
                let vImg: MahjongCardItem = MahjongCardManager.getMahjongCommonCard(vCardArray[vIndex], 55, 84);
                vImg.y = 13;
                vImg.x = vIndex * 55 + 20;
                self.addChild(vImg);
            }
            // ViewUtil.addChild(this._selectChiGangGroup, self);
            self.addEventListener(egret.TouchEvent.TOUCH_TAP, self.selectSubAction, self);
        }

        private selectSubAction(): void {
            let vMahjongActionSelectMsg: MahjongActionSelectMsg = new MahjongActionSelectMsg();
            vMahjongActionSelectMsg.selectActionId = this.subActionResult.id;
            ServerUtil.sendMsg(vMahjongActionSelectMsg); // 选择当前动作
            MahjongData.thisMyMahjongMoOneCardMsgAck = null;
            this.mahjongTableCardsHandView.selectActionOver(); // 隐藏
        }

    }

}