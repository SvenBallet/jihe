module FL {
    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase - MahjongActionSelectMsgAck
     * @Description: 麻将动作选择消息 回复，吃碰杠听胡等
     * @Create: ArielLiang on 2018/6/13 14:47
     * @Version: V1.0
     */
    export class MahjongActionSelectMsgAck extends AbstractNewNetMsgBaseAck {

        /** 玩家位置 */
        public playerPos:number = 0;
        /** 动作 */
        public action:number = 0;

        /** 牌的值，目前只有胡牌这里有值，胡牌有可能是多个 */
        public cards:Array<number>;

        constructor() {
            super(MsgCmdConstant.MSG_MAHJONG_ACTION_SELECT_ACK);
        }


        public newSerialize(ar:ObjectSerializer):void {
            this.playerPos = ar.sByte(this.playerPos);
            this.action = ar.sInt(this.action);
            this.cards = <Array<number>> ar.sByteArray(this.cards);
        }
    }
}