module FL {
    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase - CheckPlayerExist
     * @Description:  //看看玩家是否存在，客户端ack也是这个消息
     * @Create: DerekWu on 2017/12/29 14:21
     * @Version: V1.0
     */
    export class CheckPlayerExist extends NetMsgBase {

        public account:string = "";
        public result:number = 0;//0不存在，1存在
        //
        public please_re_login:number = 0;//如果是1，请客户端重新登录

        constructor() {
            super(MsgCmdConstant.MSG_GAME_IS_ACCOUNT_EXIST);
        }

        public serialize(ar:ObjectSerializer):void {
            super.serialize(ar);
            let self = this;
            self.account = ar.sString(self.account);
            self.result=ar.sInt(self.result);
            self.please_re_login=ar.sInt(self.please_re_login);
        }

    }
}