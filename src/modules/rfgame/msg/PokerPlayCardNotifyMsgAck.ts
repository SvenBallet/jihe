module FL {
    export class PokerPlayCardNotifyMsgAck extends AbstractNewNetMsgBaseAck {
        /**
	 * 出牌玩家方位
	 */
        public playerPos = 0;//byte

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
        public playCards = new Array<number>();//List<Byte> 

        /**
         * 玩家手上剩余的牌列表, 只发送给当前出牌的玩家，其他玩家不发送这个数据，要特别小心
         */
        public handCards = new Array<number>();// List<Byte>

        // 出牌玩家剩余牌数
        public chuPlayerCardLeftNum = 0;//int

        // 总牌剩余数
        public totalCardLeftNum = 0;//int

        public constructor() {
            super(MsgCmdConstant.MSG_PLAY_POKER_CARD_NOTIFY_ACK);
        }

        public newSerialize(ar: ObjectSerializer): void {
            let self = this;
            self.playerPos = ar.sByte(self.playerPos);
            self.isMgrCard = ar.sBoolean(self.isMgrCard);
            self.handPatterns = ar.sInt(self.handPatterns);
            self.playCards = <Array<number>>ar.sByteArray(self.playCards);
            self.handCards = <Array<number>>ar.sByteArray(self.handCards);
            self.chuPlayerCardLeftNum = ar.sInt(self.chuPlayerCardLeftNum);
            self.totalCardLeftNum = ar.sInt(self.totalCardLeftNum);
        }
    }
}