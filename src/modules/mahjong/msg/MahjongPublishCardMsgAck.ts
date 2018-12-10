module FL {
    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase - MahjongPublishCardMsgAck
     * @Description:  //麻将明牌效果消息 推给客户端的
     * @Create: DerekWu on 2018/6/19 16:28
     * @Version: V1.0
     */
    export class MahjongPublishCardMsgAck extends AbstractNewNetMsgBaseAck {

        /** 玩家位置 */
        public playerPos:number = 0;
        /** 动作 */
        public action:number = 0;
        //效果时间 ms
        public dealy:dcodeIO.Long = dcodeIO.Long.ZERO;
        /** 亮牌列表 */
        public cards: Array<number>;

        constructor() {
            super(MsgCmdConstant.MSG_MAHJONG_PUBLISH_CARD_ACK);
        }

        public newSerialize(ar:ObjectSerializer):void {
            this.playerPos = ar.sByte(this.playerPos);
            this.action = ar.sInt(this.action);
            this.dealy = ar.sLong(this.dealy);
            this.cards = <Array<number>> ar.sByteArray(this.cards);
        }

    }
}