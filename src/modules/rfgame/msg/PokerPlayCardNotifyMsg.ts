module FL {
    export class PokerPlayCardNotifyMsg extends NetMsgBase {
        /**
             * 是否管牌,false:不是，true：是
             */
        public isMgrCard = false;//boolean

        /**
         * 出的牌型
         */
        public handPatterns = 0;//int

        /**
         * 出的牌
         */
        public chuCards: Array<number> = new Array<number>();// List<Byte>

        public constructor() {
            super(MsgCmdConstant.MSG_PLAY_POKER_CARD_NOTIFY);
        }

        public serialize(ar: ObjectSerializer): void {
            super.serialize(ar);
            let self = this;
            self.isMgrCard = ar.sBoolean(self.isMgrCard);
            self.handPatterns = ar.sInt(self.handPatterns);
            self.chuCards = <Array<number>>ar.sByteArray(self.chuCards);
        }
    }
}