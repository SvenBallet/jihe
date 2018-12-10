module FL {
    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase - MahjongChangShaViewGangCardMsgAck
     * @Description: 长沙麻将显示杠的牌，两张
     * @Create: ArielLiang on 2018/6/27 11:19
     * @Version: V1.0
     */
    export class MahjongChangShaViewGangCardMsgAck extends AbstractNewNetMsgBaseAck {

        /** 是否显示，否则是隐藏，这个最优先判断  */
        public isView:boolean = true;
        public playerPos:number;
        public card1:number;
        public card2:number;

        constructor() {
            super(MsgCmdConstant.MSG_MAHJONG_CHANG_SHA_VIEW_GANG_CARD_ACK);
        }

        public newSerialize(ar:ObjectSerializer):void {
            this.isView = ar.sBoolean(this.isView);
            this.playerPos = ar.sByte(this.playerPos);
            this.card1 = ar.sByte(this.card1);
            this.card2 = ar.sByte(this.card2);
        }
    }
}