module FL {
    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase - MahjongAddChuCardMsgAck
     * @Description: 添加玩家出牌
     * @Create: ArielLiang on 2018/6/27 11:12
     * @Version: V1.0
     */
    export class MahjongAddChuCardMsgAck extends AbstractNewNetMsgBaseAck {

        /** 玩家位置 */
        public playerPos:number = 0;
        /** 出的什么牌 */
        public card:number = 0;

        constructor() {
            super(MsgCmdConstant.MSG_MAHJONG_ADD_CHU_CARD_ACK);
        }

        public newSerialize(ar:ObjectSerializer):void {
            this.playerPos = ar.sByte(this.playerPos);
            this.card = ar.sByte(this.card);
        }
    }
}