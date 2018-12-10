module FL {
    export class PokerPlayerHandCard implements IBaseObject {
        public static readonly NAME: string = "com.linyun.xgamenew.domain.poker.PokerPlayerHandCard";
        /** 序列化类的名字，用来序列化对象用，必须和服务端的类型对应 */
        public readonly sClassName: string = PokerPlayerHandCard.NAME;
        /** 玩家所在的牌桌位置 */
        public tablePos: number = 0;//byte

        /** 玩家手牌列表*/
        public handCards: Array<number> = new Array<number>();//List<Byte>

        public serialize(ar: ObjectSerializer): void {
            let self = this;
            self.tablePos = ar.sByte(self.tablePos);
            self.handCards = <Array<number>>ar.sByteArray(self.handCards);
        }

    }
}