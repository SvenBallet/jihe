module FL {
    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase - GameOverScoreDetailItem
     * @Description:  // 游戏结束计分明细 中的条目
     * @Create: DerekWu on 2018/3/15 10:03
     * @Version: V1.0
     */
    export class GameOverScoreDetailItem implements IBaseObject {

        public static readonly NAME:string = "com.linyun.base.domain.GameOverScoreDetailItem";
        /** 序列化类的名字，用来序列化对象用，必须和服务端的类型对应 */
        public readonly sClassName: string = SimplePlayer.NAME;

        /** 条目描述  举例：中鸟数量、中马数量、中鸟计分、中马计分、杠分  等等 */
        public desc: string = "";

        /** 条目对应的玩家的值列表，从牌桌pos1开始，有多少个玩家就多少条记录  */
        public values: Array<number> = new Array<number>();

        public serialize(ar:ObjectSerializer):void {
            let self = this;
            self.desc = ar.sString(self.desc);
            self.values = <Array<number>>ar.sIntArray(self.values);
        }

    }
}