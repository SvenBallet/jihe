module FL {
    export class PokerGameStartPlayerInfo implements IBaseObject {
        public static readonly NAME: string = "com.linyun.xgamenew.domain.poker.PokerGameStartPlayerInfo";
        /** 序列化类的名字，用来序列化对象用，必须和服务端的类型对应 */
        public readonly sClassName: string = PokerGameStartPlayerInfo.NAME;
        /** 玩家所在的牌桌位置 */
        public tablePos: number = 0;//byte

        /** 剩余牌的数量，不在回放中 并且 其他玩家的时候使用 */
        public handCardNum: number = 0;//int

        /** 玩家手牌列表，其他玩家的时候，这个仅在回放的时候有值 */
        public handCards: Array<number> = new Array<number>();//List<Byte>

        /** 是否已经出过一次牌 */
        public isChuOnce: boolean = false;//boolean

        /** 玩家最后打出的牌列表 */
        public lastChuCards: Array<number> = new Array<number>();//List<Byte>

        public serialize(ar: ObjectSerializer): void {
            let self = this;
            self.tablePos = ar.sByte(self.tablePos);
            self.handCardNum = ar.sInt(self.handCardNum);
            self.handCards = <Array<number>>ar.sByteArray(self.handCards);
            self.isChuOnce = ar.sBoolean(self.isChuOnce);
            self.lastChuCards = <Array<number>>ar.sByteArray(self.lastChuCards);
        }
    }
}