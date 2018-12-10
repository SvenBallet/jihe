module FL {
    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase - H5WXLoginMsgErrorAck
     * @Description:  //H5微信登录异常返回消息
     * @Create: DerekWu on 2017/12/28 18:10
     * @Version: V1.0
     */
    export class H5WXLoginMsgErrorAck extends NetMsgBase {

        /** 错误码 */
        public errCode: number = 0;
        /** 错误消息 */
        public errMsg: string = "";

        constructor() {
            super(MsgCmdConstant.MSG_GAME_H5_WX_LOGIN_ERROR_ACK);
        }

        public serialize(ar: ObjectSerializer): void {
            super.serialize(ar);
            this.errCode = ar.sInt(this.errCode);
            this.errMsg = ar.sString(this.errMsg);
        }
    }
}