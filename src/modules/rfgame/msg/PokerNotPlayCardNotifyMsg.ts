module FL {
    /** 玩家不出牌通知，玩家自己操作不出牌，客户端发给服务器的消息*/
    export class PokerNotPlayCardNotifyMsg extends NetMsgBase {
        /**
	 * 不出牌方式（0=不要，1=要不起）
	 */
        public notPlayType = 0;//byte

        public constructor() {
            super(MsgCmdConstant.MSG_NOT_PLAY_POKER_CARD_NOTIFY);
        }

        public serialize(ar: ObjectSerializer): void {
            super.serialize(ar);
            let self = this;
            self.notPlayType = ar.sByte(self.notPlayType);
        }
    }
}