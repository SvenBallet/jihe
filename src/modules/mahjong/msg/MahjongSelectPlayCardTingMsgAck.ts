module FL {
    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase - MahjongSelectPlayCardTingMsgAck
     * @Description: 选择打哪张牌听牌的消息，通知客户端
     * @Create: ArielLiang on 2018/6/13 14:18
     * @Version: V1.0
     */
    export class MahjongSelectPlayCardTingMsgAck  extends AbstractNewNetMsgBaseAck {

        /** 所有听牌信息列表，没有数据则表示没有听牌 */
        public playCardTingInfoList:Array<MahjongSelectPlayCardTingInfo>;

        constructor() {
            super(MsgCmdConstant.MSG_MAHJONG_SELECT_PLAY_CARD_TING_MSG_ACK);
        }

        public newSerialize(ar:ObjectSerializer):void {
            this.playCardTingInfoList = <Array<MahjongSelectPlayCardTingInfo>>ar.sObjArray(this.playCardTingInfoList);
        }
    }
}