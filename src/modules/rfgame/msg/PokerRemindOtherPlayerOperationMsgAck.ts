module FL {
    /** 给客户端发送的提示其他玩家出牌消息，相当于当前玩家收到的是轮到其他玩家出牌了的消息 */
    export class PokerRemindOtherPlayerOperationMsgAck extends AbstractNewNetMsgBaseAck {
        /** 操作玩家的座位*/
        public operationPlayerPos: number = 0;//byte
        /** 操作时间限制(单位：秒) */
        public timeLimit: dcodeIO.Long = dcodeIO.Long.ZERO;//int

        public constructor() {
            super(MsgCmdConstant.MSG_POKER_REMIND_OTHER_PLAYER_OPERATION_ACK);
        }

        public newSerialize(ar: ObjectSerializer): void {
            let self = this;
            self.operationPlayerPos = ar.sByte(self.operationPlayerPos);
            self.timeLimit = ar.sLong(self.timeLimit);
        }
    }
}