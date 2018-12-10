module FL {
    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase - LinkValidationMsgAck
     * @Description:  //链接后发送此消息来确认链接的合法性
     * @Create: DerekWu on 2017/11/8 21:08
     * @Version: V1.0
     */
    export class LinkValidationMsgAck extends NetMsgBase {

        public serverName:string = "";
        public linkName:string = "";

        constructor() {
            super(MsgCmdConstant.MSG_LINK_VALIDATION_ACK);
        }

        public serialize(ar:ObjectSerializer):void {
            super.serialize(ar);
            let self = this;
            self.serverName = ar.sString(self.serverName);
            self.linkName = ar.sString(self.linkName);
        }

    }
}