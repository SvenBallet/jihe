module FL {
    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase - CardDown
     * @Description:  //玩家吃碰杠的牌
     * @Create: DerekWu on 2017/11/10 14:07
     * @Version: V1.0
     */
    export class CardDown implements IBaseObject {

        public static readonly NAME:string = "com.linyun.base.domain.CardDown";
        /** 序列化类的名字，用来序列化对象用，必须和服务端的类型对应 */
        public readonly sClassName: string = CardDown.NAME;

        public type: number;
        //操作那个玩家的牌
        public cardValue: number;
        //谁出的牌
        public chuOffset: number;//-1上家，0对家，1下家

        public serialize(ar:ObjectSerializer):void {
            let self = this;
            self.type=ar.sInt(self.type);
            self.cardValue=ar.sInt(self.cardValue);
            self.chuOffset=ar.sInt(self.chuOffset);
        }

    }
}