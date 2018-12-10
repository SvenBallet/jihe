module FL {
    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase - RequestAgentInfoAck
     * @Description:  代理信息返回
     * @Create: ArielLiang on 2018/3/14 20:11
     * @Version: V1.0
     */
    export class RequestAgentInfoAck extends NetMsgBase {

        public allXiajiNum:number;
        public allPayNum:number;
        public rebate;

        constructor()
        {
            super(MsgCmdConstant.MSG_AGENT_INFO_ACK);
        }

        public serialize(ar:ObjectSerializer):void
        {
            super.serialize(ar);
            let self = this;
            self.allXiajiNum = ar.sInt(self.allXiajiNum);
            self.allPayNum = ar.sInt(self.allPayNum);
            self.rebate = ar.sDouble(self.rebate);
        }
    }
}