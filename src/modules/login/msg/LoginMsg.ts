module FL {
    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase - LoginMsg
     * @Description:  //登录指令
     * @Create: DerekWu on 2017/11/10 9:31
     * @Version: V1.0
     */
    export class LoginMsg extends NetMsgBase {

        //账号密码
        public account: string = "";
        public password: string = "";
        //匿名登录，使用手机机器编码
        public machineCode: string = "";
        public userName: string = "";

        /**qq标识*/
        public qqOpenID: string = "";
        /**微信标识*/
        public wxOpenID: string = "";

        public clientIP: string = "";

        /**登录设备标识位*/
        public deviceFlag: number;
        public sex: number;
        public xlOpenID: string = "";

        constructor() {
            super(MsgCmdConstant.MSG_GAME_LOGIN);
        }

        public serialize(ar:ObjectSerializer):void {
            super.serialize(ar);
            let self = this;
            self.account=ar.sString(self.account);
            self.password=ar.sString(self.password);
            self.machineCode=ar.sString(self.machineCode);
            self.userName=ar.sString(self.userName);
            self.qqOpenID = ar.sString(self.qqOpenID);
            self.wxOpenID = ar.sString(self.wxOpenID);
            self.clientIP=ar.sString(self.clientIP);
            //
            self.deviceFlag = ar.sInt(self.deviceFlag);
            self.sex=ar.sInt(self.sex);
            self.xlOpenID=ar.sString(self.xlOpenID);
        }
    }
}