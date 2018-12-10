module FL {

    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase - LinkValidationMsg
     * @Description:  //链接后发送此消息来确认链接的合法性
     * @Create: DerekWu on 2017/11/8 20:59
     * @Version: V1.0
     */
    export class LinkValidationMsg extends NetMsgBase {

        public checkKey:string = "";
        public linkName:string = "";

        constructor() {
            super(MsgCmdConstant.MSG_LINK_VALIDATION);
        }

        public serialize(ar:ObjectSerializer):void {
            super.serialize(ar);
            let self = this;
            self.checkKey=ar.sString(self.checkKey);
            self.linkName=ar.sString(self.linkName);
        }

    }

}