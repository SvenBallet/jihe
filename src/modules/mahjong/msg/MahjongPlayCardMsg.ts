module FL {
    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase_ChangSha - MahjongPlayCardMsg
     * @Description:  麻将出牌消息，客户端发过来的，机器人出牌的时候也可以伪装
     * @Create: ArielLiang on 2018/5/31 11:15
     * @Version: V1.0
     */
    export class MahjongPlayCardMsg extends NetMsgBase {

        /** 出牌玩家位置 */
        public playerPos: number = 0;

        /** 出的牌 */
        public playCard: number = 0;
        /** 出的牌的位置，即在手牌列表的索引位置 */
        public playCardIndex: number = 0;


        public constructor() {
            super(MsgCmdConstant.MSG_MAHJONG_PLAY_CARD);
        }


        public serialize(ar: ObjectSerializer): void {
            super.serialize(ar);
            this.playerPos = ar.sByte(this.playerPos);
            this.playCard = ar.sByte(this.playCard);
            this.playCardIndex = ar.sInt(this.playCardIndex);
        }
    }
}