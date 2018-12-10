module FL {
    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase - MahjongRefreshHandCardMsgAck
     * @Description:  // 刷新当前玩家自己的手牌（不包含吃碰杠的牌）（打牌出错之后使用）
     * @Create: DerekWu on 2018/7/9 16:19
     * @Version: V1.0
     */
    export class MahjongRefreshHandCardMsgAck extends AbstractNewNetMsgBaseAck {

        /**
         * 玩家手上剩余的牌列表
         */
        public handCards: Array<number>;

        public constructor() {
            super(MsgCmdConstant.MSG_MAHJONG_REFRESH_HAND_CARD_ACK);
        }

        public newSerialize(ar: ObjectSerializer): void {
            this.handCards = <Array<number>>ar.sByteArray(this.handCards);
        }

    }
}