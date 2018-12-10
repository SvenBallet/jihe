module FL {
    /** 麻将牌管理*/
    export class MahjongCardManager {
        /** 应用池 */
        private static useArray:Array<MahjongCardItem> = [];


        /** 获得一个卡牌对象 */
        private static _getCardItem(): MahjongCardItem {
            let card = new MahjongCardItem();
            MahjongCardManager.useArray.push(card);
            return card;
        }

        /** 删除一个引用*/
        public static _recycle(item: MahjongCardItem) {
            for (let i = 0;i < this.useArray.length;i ++) {
                if (this.useArray[i] && this.useArray[i] === item) {
                    delete this.useArray[i];
                }
            }
        }

        /** 移除所有引用*/
        public static removeAll() {
            this.useArray = [];
        }

        /** 获取牌*/
        public static getMahjongCard(cardValue: number, pos: PZOrientation, cardType: MahjongCardType):MahjongCardItem {
            let card:MahjongCardItem = this._getCardItem();
            if (cardType == MahjongCardType.HAND) {
                card._setHandCard(cardValue, pos);
            }
            else if (cardType == MahjongCardType.EAT) {
                card._setEatCard(cardValue, pos);
            }
            else if (cardType == MahjongCardType.OUT) {
                card._setOutCard(cardValue, pos);
            }
            else if (cardType == MahjongCardType.REPLAY) {
                card._setReplayCard(cardValue, pos);
            }
            else if (cardType == MahjongCardType.MING) {
                card._setMingCard(cardValue, pos);
            }
            else if (cardType == MahjongCardType.ANGANG) {
                card._setAnGangCard(cardValue, pos);
            }
            return card;
        }

        /** 获取通用牌*/
        public static getMahjongCommonCard(cardValue: number, width: number = 86, height: number = 129, angang: boolean = false) {
            let card:MahjongCardItem = this._getCardItem();
            card._setCommonCard(cardValue, width, height, angang);
            return card;
        }

        /** 重置卡牌背景 */
        public static reBgImg() {
            for (let i = 0;i < this.useArray.length;i ++) {
                if (this.useArray[i] && this.useArray[i].reBgImg) {
                    this.useArray[i].reBgImg();
                }
            }
        }
    }
}