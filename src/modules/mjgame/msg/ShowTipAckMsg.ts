module FL {
    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase - ShowTipAckMsg
     * @Description:  消息提示
     * @Create: ArielLiang on 2018/3/26 17:54
     * @Version: V1.0
     */
    export class ShowTipAckMsg  extends NetMsgBase
    {
        //内容
        public tip:string="";
        //0：错误  1：警告 2 成功  3 弹窗
        public tipType:number=0;

        //
        constructor()
        {
            super(MsgCmdConstant.MSG_SHOW_TIP_MSG_ACK);
        }

        public serialize(ar:ObjectSerializer):void
        {
            super.serialize(ar);
            let self = this;
            self.tip=ar.sString(self.tip);
            self.tipType=ar.sInt(self.tipType);
        }

    }
}