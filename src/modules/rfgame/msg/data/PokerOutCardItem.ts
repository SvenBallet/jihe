module FL {
    export class PokerOutCardItem implements IBaseObject {
        public static readonly NAME: string = "com.linyun.xgamenew.core.game.poker.PokerOutCardItem";
        /** 序列化类的名字，用来序列化对象用，必须和服务端的类型对应 */
        public readonly sClassName: string = PokerOutCardItem.NAME;
        /** 玩家所在的牌桌位置 */
        public tablePos: number = 0;
        /** 出牌时的圈数 */
        private outCircle: number = 0;
        /** 出牌列表 */
        public outList: Array<number> = [];

        public serialize(ar: ObjectSerializer): void {
            let self = this;
            self.tablePos = ar.sInt(self.tablePos);
            self.outCircle = ar.sInt(self.outCircle);
            self.outList = <Array<number>>ar.sByteArray(self.outList);
        }
    }
}