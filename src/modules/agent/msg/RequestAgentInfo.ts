module FL {
    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase - RequestAgentInfo
     * @Description:  请求代理信息
     * @Create: ArielLiang on 2018/3/14 20:08
     * @Version: V1.0
     */
    export class RequestAgentInfo extends NetMsgBase {

        constructor()
        {
            super(MsgCmdConstant.MSG_AGENT_INFO);
        }

        public serialize(ar:ObjectSerializer):void
        {
            super.serialize(ar);
        }
    }
}