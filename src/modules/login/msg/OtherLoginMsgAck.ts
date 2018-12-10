module FL {
    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase - OtherLoginMsgAck
     * @Description:  //其他人登录了，呗踢下线
     * @Create: DerekWu on 2017/12/14 9:34
     * @Version: V1.0
     */
    export class OtherLoginMsgAck extends NetMsgBase {

        public otherip: string = "";

        constructor() {
            super(MsgCmdConstant.MSG_GAME_OTHERLOGIN_ACK);
        }

        public serialize(ar:ObjectSerializer):void {
            super.serialize(ar);
            let self = this;
            self.otherip=ar.sString(self.otherip);
        }

    }
}