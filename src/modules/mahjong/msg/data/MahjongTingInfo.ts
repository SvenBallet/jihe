module FL {
    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase - MahjongTingInfo
     * @Description: 听牌信息
     * @Create: ArielLiang on 2018/6/13 14:29
     * @Version: V1.0
     */
    export class MahjongTingInfo implements IBaseObject {

        public static readonly NAME:string = "com.linyun.xgamenew.domain.mahjong.MahjongTingInfo";
        /** 序列化类的名字，用来序列化对象用，必须和服务端的类型对应 */
        public readonly sClassName: string = MahjongTingInfo.NAME;
        /** 听的牌 */
        public card:number = 0;
        /** 标记 0=普通牌 1=癞子牌 2=其他待定 */
        public flag:number = 0;
        /** 分数 */
        public score:number = 0;

        public serialize(ar:ObjectSerializer):void {
            this.card = ar.sByte(this.card);
            this.flag = ar.sByte(this.flag);
            this.score = ar.sInt(this.score);
        }
    }
}