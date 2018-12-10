module FL {
    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase - RequestAgentTicket
     * @Description:  获取代理管理登陆校验
     * @Create: ArielLiang on 2018/3/14 20:14
     * @Version: V1.0
     */
    export class RequestAgentTicket extends NetMsgBase {

        public playerIndex:number;

        constructor()
        {
            super(MsgCmdConstant.MSG_AGENT_TICKET);
        }

        public serialize(ar:ObjectSerializer):void
        {
            super.serialize(ar);
            let self = this;
            self.playerIndex = ar.sInt(self.playerIndex);
        }
    }
}