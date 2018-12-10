module FL {
    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase - RequestBindAgentAck
     * @Description:  绑定上下级返回
     * @Create: ArielLiang on 2018/3/14 20:19
     * @Version: V1.0
     */
    export class RequestBindAgentAck extends NetMsgBase {

        public type:number; //0：确认绑定人 1：确认绑定
        public result:number=0;
        public content:string = "";

        constructor()
        {
            super(MsgCmdConstant.MSG_GAME_BIND_AGENT_ACK);
        }

        public serialize(ar:ObjectSerializer):void
        {
            super.serialize(ar);
            let self = this;
            self.type = ar.sInt(self.type);
            self.result=ar.sInt(self.result);
            self.content=ar.sString(self.content);
        }
    }
}