module FL {
    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase - MahjongMaPaiInfo
     * @Description:  // 麻将马牌信息，也可以是鸟牌等，是一个摸马，抓鸟类似情况的通用对象
     * @Create: DerekWu on 2018/6/17 15:56
     * @Version: V1.0
     */
    export class MahjongMaPaiInfo implements IBaseObject {

        public static readonly NAME:string = "com.linyun.xgamenew.domain.mahjong.MahjongMaPaiInfo";
        /** 序列化类的名字，用来序列化对象用，必须和服务端的类型对应 */
        public readonly sClassName: string = MahjongMaPaiInfo.NAME;

        /** 马牌对应玩家所在的牌桌位置 */
        public tablePos:number = 0;
        /** 马牌的值（也可以是鸟牌等） */
        public card:number = 0;
        /** 牌的类型（1=马牌，2=鸟牌，3=其他待定，客户端根据这个显示不同的图标） */
        public cardType:number = 0;
        /** 是否中了 */
        public isZhong:boolean = false;

        serialize(ar: ObjectSerializer): void {
            this.tablePos = ar.sByte(this.tablePos);
            this.card = ar.sByte(this.card);
            this.cardType = ar.sByte(this.cardType);
            this.isZhong = ar.sBoolean(this.isZhong);
        }

    }
}