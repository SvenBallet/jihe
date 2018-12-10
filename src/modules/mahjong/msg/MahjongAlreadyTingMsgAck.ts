module FL {
    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase - MahjongAlreadyTingMsgAck
     * @Description: 已经听牌消息，发送给客户端
     * @Create: ArielLiang on 2018/6/13 14:45
     * @Version: V1.0
     */
    export class MahjongAlreadyTingMsgAck extends AbstractNewNetMsgBaseAck {

        /** 所有听牌信息列表，没有数据则表示没有听牌 */
        public tingList:Array<MahjongTingInfo>;

        constructor() {
            super(MsgCmdConstant.MSG_MAHJONG_ALREADY_TING_MSG_ACK);
        }


        public newSerialize(ar:ObjectSerializer):void {
            this.tingList = <Array<MahjongTingInfo>>ar.sObjArray(this.tingList);
        }
    }
}