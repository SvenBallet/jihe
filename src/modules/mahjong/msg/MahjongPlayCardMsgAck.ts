module FL {
    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase_ChangSha - MahjongPlayCardMsgAck
     * @Description:  麻将出牌消息，回复
     * @Create: ArielLiang on 2018/5/31 11:21
     * @Version: V1.0
     */
    export class MahjongPlayCardMsgAck extends AbstractNewNetMsgBaseAck {

        /** 出牌玩家位置 */
        public playerPos: number = 0;

        /** 出的牌 */
        public playCard: number = 0;
        /** 出的牌的位置，即在手牌列表的索引位置 */
        public playCardIndex: number = 0;

        /**
         * 玩家手上剩余的牌列表, 其他玩家的时候，这里面的值都是暗牌的值
         * 顺序从左到右，如果+吃碰杠之后是14张，则最后一张摆开一点
         */
        public handCards: Array<number>;

        // 总牌剩余数
        public totalCardLeftNum: number = 0;

        public constructor() {
            super(MsgCmdConstant.MSG_MAHJONG_PLAY_CARD_ACK);
        }


        public newSerialize(ar: ObjectSerializer): void {
            this.playerPos = ar.sByte(this.playerPos);
            this.playCard = ar.sByte(this.playCard);
            this.playCardIndex = ar.sInt(this.playCardIndex);
            this.handCards = <Array<number>>ar.sByteArray(this.handCards);
            this.totalCardLeftNum = ar.sInt(this.totalCardLeftNum);
        }
    }

}