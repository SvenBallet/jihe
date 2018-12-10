module FL {
    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase - MahjongRemoveChuCardMsgAck
     * @Description: 麻将移除某张牌消息 推给客户端的
     * @Create: ArielLiang on 2018/6/22 19:30
     * @Version: V1.0
     */
    export class MahjongRemoveChuCardMsgAck extends AbstractNewNetMsgBaseAck {

        /** 玩家位置 */
        public playerPos:number = 0;
        /** 移除什么牌 */
        public card:number = 0;
        /**移除的牌在什么位置*/
        public cardIndex:number = 0;

        constructor() {
            super(MsgCmdConstant.MSG_MAHJONG_REMOVE_CHU_CARD_ACK);
        }

        public newSerialize(ar:ObjectSerializer):void {
            this.playerPos = ar.sByte(this.playerPos);
            this.card = ar.sByte(this.card);
            this.cardIndex = ar.sByte(this.cardIndex);
        }

    }
}