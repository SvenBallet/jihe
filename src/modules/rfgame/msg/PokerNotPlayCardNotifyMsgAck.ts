module FL {
    /** 玩家不出牌通知返回 */
    export class PokerNotPlayCardNotifyMsgAck extends AbstractNewNetMsgBaseAck {
        /**
	 * 玩家方位
	 */
        public playerPos = 0;//byte

        /** 不出牌类型，0=不知道，1=不要，2=要不起 */
        public notPlayType = 0;//byte


        public constructor() {
            super(MsgCmdConstant.MSG_NOT_PLAY_POKER_CARD_NOTIFY_ACK);
        }

        public newSerialize(ar: ObjectSerializer): void {
            let self = this;
            self.playerPos = ar.sByte(self.playerPos);
            self.notPlayType = ar.sByte(self.notPlayType);
        }
    }
}