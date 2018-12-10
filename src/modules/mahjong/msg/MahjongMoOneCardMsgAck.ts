module FL {
    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase_ChangSha - MahjongMoOneCardMsgAck
     * @Description:  摸一张牌
     * @Create: ArielLiang on 2018/5/31 11:08
     * @Version: V1.0
     */
    export class MahjongMoOneCardMsgAck  extends AbstractNewNetMsgBaseAck {

        /** 摸牌玩家位置 */
        public playerPos: number = 0;

        /** 摸牌方位 */
        public orientation: number = 0;
        /** 摸牌方位中的位置 */
        public cardIndexPos: number = 0;

        /** 摸上来的牌，其他玩家的时候，这里的值是暗牌的值 */
        public cardValue: number = 0;

        // 总牌剩余数
        public totalCardLeftNum: number = 0;

        /** 是否自动出摸的牌，自动出的话，客户端在收到出牌后一定时间后  或者 有动作点击过之后一定时间后 自动出牌，（1秒钟）  */
        public isAutoPlayMoCard: boolean = false;
        /** 摸牌后是否有动作  */
        public hasActionAfterMoCard: boolean = false;

        public constructor() {
            super(MsgCmdConstant.MSG_MAHJONG_MO_ONE_CARD_ACK);
        }


        public newSerialize(ar: ObjectSerializer): void {
            this.playerPos = ar.sByte(this.playerPos);
            this.orientation = ar.sByte(this.orientation);
            this.cardIndexPos = ar.sInt(this.cardIndexPos);
            this.cardValue = ar.sByte(this.cardValue);
            this.totalCardLeftNum = ar.sInt(this.totalCardLeftNum);
            this.isAutoPlayMoCard = ar.sBoolean(this.isAutoPlayMoCard);
            this.hasActionAfterMoCard = ar.sBoolean(this.hasActionAfterMoCard); 
        }
    }
}