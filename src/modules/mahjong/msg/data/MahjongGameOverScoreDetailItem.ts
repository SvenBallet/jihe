module FL {
    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase - MahjongGameOverScoreDetailItem
     * @Description: 麻将游戏结束详细条目
     * @Create: ArielLiang on 2018/6/15 20:33
     * @Version: V1.0
     */
    export class MahjongGameOverScoreDetailItem implements IBaseObject {

        public static readonly NAME:string = "com.linyun.xgamenew.domain.mahjong.MahjongGameOverScoreDetailItem";
        /** 序列化类的名字，用来序列化对象用，必须和服务端的类型对应 */
        public readonly sClassName: string = MahjongGameOverScoreDetailItem.NAME;
        /** 显示风格类型(0=基本类型，2=胡牌类型1，3=胡牌类型2，4=中马中鸟等类型  5=小计分类型 6=总结算计分) */
        public viewStyle:number = 0;

        /** 条目描述  举例：庄闲，平胡，七小对，大四喜，中鸟数量、中马数量、中鸟计分、中马计分、杠分  等等 */
        public desc:string = "";

        /** 条目对应的玩家的值列表，从牌桌pos1开始，有多少个玩家就多少条记录  */
        public values:Array<string> = null;


        public serialize(ar:ObjectSerializer):void
        {
            this.viewStyle = ar.sInt(this.viewStyle);
            this.desc = ar.sString(this.desc);
            this.values = <Array<string>>ar.sStringArray(this.values);
        }
    }
}