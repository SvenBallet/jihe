module FL {
    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase - RequestBindAgent
     * @Description:  绑定上下级请求
     * @Create: ArielLiang on 2018/3/14 20:17
     * @Version: V1.0
     */
    export class RequestBindAgent extends NetMsgBase {

        public type:number;//0：确认绑定人 1：确认绑定
        public inviteCode:number;


        constructor()
        {
            super(MsgCmdConstant.MSG_GAME_BIND_AGENT);
        }

        public serialize(ar:ObjectSerializer):void
        {
            super.serialize(ar);
            let self = this;
            self.type = ar.sInt(self.type);
            self.inviteCode = ar.sInt(self.inviteCode);
        }
    }
}