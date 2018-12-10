module FL {
    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase - NewShowTipAckMsg
     * @Description:  // 新显示tip消息，可以单独发送，也有可能会附带在其他的返回消息中
     * @Create: DerekWu on 2018/4/11 14:58
     * @Version: V1.0
     */
    export class NewShowTipAckMsg extends NetMsgBase {

        // 内容
        public tip: string = "";
        // 0：错误 1：警告 2 成功 3 弹窗
        public tipType: number = -1;

        // 弹窗中点击确认后发出的客户端指令，当时弹窗提示的时候，这个值有效
        public clientActionCmd: string = "";

        public needSerializeMsgBase: boolean = true;

        constructor() {
            super(MsgCmdConstant.MSG_SHOW_TIP_MSG_ACK_NEW);
        }

        public serialize(ar:ObjectSerializer):void {
            let self = this;
            if (self.needSerializeMsgBase) {
                super.serialize(ar);
            }
            self.tip = ar.sString(self.tip);
            self.tipType = ar.sByte(self.tipType);
            self.clientActionCmd = ar.sString(self.clientActionCmd);
        }

    }
}