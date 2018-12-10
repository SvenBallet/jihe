module FL {
    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase - RequestAgentTicketAck
     * @Description:  代理管理登陆校验
     * @Create: ArielLiang on 2018/3/14 20:16
     * @Version: V1.0
     */
    export class RequestAgentTicketAck extends NetMsgBase {

        public ticket:string;

        constructor()
        {
            super(MsgCmdConstant.MSG_AGENT_TICKET_ACK);
        }

        public serialize(ar:ObjectSerializer):void
        {
            super.serialize(ar);
            let self = this;
            self.ticket = ar.sString(self.ticket);
        }
    }
}