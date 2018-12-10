module FL {
    export class PokerStartCircleGameMsgAck extends AbstractNewNetMsgBaseAck {
        /**
         * 自己的牌桌方位
         */
        public myTablePos: number = 0;//byte

        /**
         * 自己手里的牌
         */
        public playerInfos: Array<PokerGameStartPlayerInfo> = new Array<PokerGameStartPlayerInfo>();//List<PokerGameStartPlayerInfo> 
        /** 剩余总牌数 */
        public leftTotalCardNum = -1;//
        public constructor() {
            super(MsgCmdConstant.MSG_START_CIRCLE_POKER_GAME);
        }

        public newSerialize(ar: ObjectSerializer): void {
            let self = this;
            self.myTablePos = ar.sByte(self.myTablePos);
            self.playerInfos = <Array<PokerGameStartPlayerInfo>>ar.sObjArray(self.playerInfos);
            self.leftTotalCardNum = ar.sInt(self.leftTotalCardNum);
        }
    }
}