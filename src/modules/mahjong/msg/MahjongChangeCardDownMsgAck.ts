module FL {
    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase - MahjongChangeCardDownMsgAck
     * @Description: 改变吃碰杠等的消息
     * @Create: ArielLiang on 2018/6/13 15:03
     * @Version: V1.0
     */
    export class MahjongChangeCardDownMsgAck extends AbstractNewNetMsgBaseAck {

        /** 玩家位置 */
        public playerPos:number = 0;
        /** 是否是添加，否则移除 */
        public isAdd:boolean = true;
        /** carddown */
        public cardDown:MahjongCardDown;
        /**
         * 玩家手上剩余的牌列表, 其他玩家的时候，这里面的值都是暗牌的值
         * 顺序从左到右，如果+吃碰杠之后是14张，则最后一张摆开一点
         */
        public handCards: Array<number>;

        constructor() {
            super(MsgCmdConstant.MSG_MAHJONG_CHANGE_CARD_DOWN_ACK);
        }

        public newSerialize(ar:ObjectSerializer):void {
            this.playerPos = ar.sByte(this.playerPos);
            this.isAdd = ar.sBoolean(this.isAdd);
            this.cardDown = <MahjongCardDown> ar.sObject(this.cardDown);
            this.handCards = <Array<number>>ar.sByteArray(this.handCards);
        }

    }
}