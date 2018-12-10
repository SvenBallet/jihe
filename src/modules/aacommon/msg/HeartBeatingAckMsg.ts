module FL {
    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase - HeartBeatingAckMsg
     * @Description:  //心跳消息包
     * @Create: DerekWu on 2017/11/9 14:57
     * @Version: V1.0
     */
    export class HeartBeatingAckMsg extends NetMsgBase {

        constructor() {
            super(MsgCmdConstant.MSG_HEART_BEATING_ACK);
        }

        public serialize(ar:ObjectSerializer):void {
            super.serialize(ar);
        }
    }
}