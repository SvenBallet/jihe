module FL {
    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase_ChangSha - MahjongGameStartPlayerInfo
     * @Description:  麻将游戏开始的玩家信息
     * @Create: ArielLiang on 2018/5/31 11:33
     * @Version: V1.0
     */
    export class MahjongGameStartPlayerInfo implements IBaseObject {

        public static readonly NAME:string = "com.linyun.xgamenew.domain.mahjong.MahjongGameStartPlayerInfo";
        /** 序列化类的名字，用来序列化对象用，必须和服务端的类型对应 */
        public readonly sClassName: string = MahjongGameStartPlayerInfo.NAME;

        /** 玩家所在的牌桌位置 */
        public tablePos = 0;

        /** 是否报听 */
        public isBaoTing:boolean = false;

        /** 连庄次数 */
        public lianZhuangCount:number = 0;

        /** 玩家手牌列表，其他玩家的时候，这里面的值都是暗牌的值 */
        public handCards:Array<number>;

        /** 玩家打出的牌列表 */
        public chuCards:Array<number>;

        /** 玩家吃碰杠的牌 */
        public cardDowns:Array<MahjongCardDown>;


        public serialize(ar:ObjectSerializer):void {
            this.tablePos = ar.sByte(this.tablePos);
            this.isBaoTing = ar.sBoolean(this.isBaoTing);
            this.lianZhuangCount = ar.sInt(this.lianZhuangCount);
            this.handCards = <Array<number>>ar.sByteArray(this.handCards);
            this.chuCards = <Array<number>>ar.sByteArray(this.chuCards);
            this.cardDowns = <Array<MahjongCardDown>>ar.sObjArray(this.cardDowns);
        }

    }
}