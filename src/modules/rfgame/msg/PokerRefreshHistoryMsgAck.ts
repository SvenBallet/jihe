module FL {
    export class PokerRefreshHistoryMsgAck extends AbstractNewNetMsgBaseAck {
        /** 出牌历史记录*/
        public outCardHistoryList: Array<PokerOutCardItem> = [];

        public constructor() {
            super(MsgCmdConstant.MSG_POKER_REFRESH_HISTORY);
        }

        public newSerialize(ar: ObjectSerializer): void {
            let self = this;
            self.outCardHistoryList = <Array<PokerOutCardItem>>ar.sObjArray(self.outCardHistoryList);
        }
    }
}