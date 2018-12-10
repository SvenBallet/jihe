module FL {
    /** 牌局结束展示剩余手牌 */
    export class PokerGameOverViewHandCardsMsgAck extends AbstractNewNetMsgBaseAck {
        /**
	     * 玩家剩余手牌列表
	     */
        public playerHandCardList: Array<PokerPlayerHandCard> = new Array<PokerPlayerHandCard>();//List<PokerPlayerHandCard>
        /** 剩余牌列表 */
        public leftCards: Array<number> = null;//List<Byte>
        public constructor() {
            super(MsgCmdConstant.MSG_POKER_GAME_OVER_VIEW_HAND_CRADS_ACK);
        }

        public newSerialize(ar: ObjectSerializer): void {
            let self = this;
            self.playerHandCardList = <Array<PokerPlayerHandCard>>ar.sObjArray(self.playerHandCardList);
            self.leftCards = <Array<number>>ar.sByteArray(self.leftCards);
        }
    }
}