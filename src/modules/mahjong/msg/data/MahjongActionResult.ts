module FL {
    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase - MahjongActionResult
     * @Description: 麻将一个动作验证结果
     * @Create: ArielLiang on 2018/6/13 14:56
     * @Version: V1.0
     */
    export class MahjongActionResult implements IBaseObject {

        public static readonly NAME:string = "com.linyun.xgamenew.core.game.mahjong.action.MahjongActionResult";
        /** 序列化类的名字，用来序列化对象用，必须和服务端的类型对应 */
        public readonly sClassName: string = MahjongActionResult.NAME;
        /** 动作id */
        public id:number = 0;

        /** 动作枚举 */
        public action:number = -1; // 默认无效动作

        /** 目标牌，吃碰杠胡的目标牌 */
        public targetCard:number = 0x52; // 默认无效牌

        /** 吃碰杠牌列表（从右到左顺序读取，一个牌占8位），胡牌翻数(动作为胡牌的时候才有用) */
        public value:number = 0;

        public serialize(ar:ObjectSerializer):void {
            this.id = ar.sInt(this.id);
            this.action = ar.sInt(this.action);
            this.targetCard = ar.sInt(this.targetCard);
            this.value = ar.sInt(this.value);
        }
    }
}