module FL {
    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase_ChangSha - MahjongCardDown
     * @Description: 麻将摆牌对象，吃、碰、杠、胡以及其他摆牌
     * @Create: ArielLiang on 2018/5/31 11:39
     * @Version: V1.0
     */
    export class MahjongCardDown implements IBaseObject {

        public static readonly NAME:string = "com.linyun.xgamenew.core.game.mahjong.base.MahjongCardDown";
        /** 序列化类的名字，用来序列化对象用，必须和服务端的类型对应 */
        public readonly sClassName: string = MahjongCardDown.NAME;

        /** 摆牌id，每个玩家各自独立的序列，从1开始 */
        public sCardDownId:number;
        /** 摆牌类型，MahjongCardDownTypeEnum */
        public sCardDownType:number;
        /** 摆出牌的列表 */
        public sCards:Array<number> = new Array<number>();
        /** 谁出的牌 */
        public sChuOffset:number = -2; // -1上家，0对家，1下家
        /** 标记（0=正常，1=长沙杠后） */
        public sFlag:number = 0;
        /** 目标牌 */
        public sTargetCard:number = 0;


        public serialize(ar:ObjectSerializer):void {
            this.sCardDownId = ar.sInt(this.sCardDownId);
            this.sCardDownType = ar.sByte(this.sCardDownType);
            this.sCards = <Array<number>> ar.sByteArray(this.sCards);
            this.sChuOffset = ar.sInt(this.sChuOffset);
            this.sFlag = ar.sByte(this.sFlag);
            this.sTargetCard = ar.sByte(this.sTargetCard);
        }
    }
}