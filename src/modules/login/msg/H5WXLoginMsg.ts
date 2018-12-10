module FL {
    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase - H5WXLoginMsg
     * @Description:  //H5微信登录
     * @Create: DerekWu on 2017/12/28 18:04
     * @Version: V1.0
     */
    export class H5WXLoginMsg extends NetMsgBase {
        /** unionId */
        public unionId:string = "";
        /** 昵称 */
        public nickname:string = "";
        /** 性别 */
        public sex:number = 0;
        /** 头像地址 */
        public headimgurl:string = "";

        /** 微信公众号openId */
        public openId:string = "";
        /** 登录授权码 */
        public loginAuthCode:string = "";
        /** 时间戳 */
        public timeStamp:dcodeIO.Long = dcodeIO.Long.ZERO;
        /** 登录授权码  */
        public loginToken:string = "";

        /** 客户端IP */
        public clientIP:string = "";

        /** 设备平台安卓 或者 苹果 或者 电脑，或者其他 (0=其他，1=IOS，2=安卓，3=电脑)*/
        public devicePlatform:number = 0;
        /** 运行环境(0=web，1=native)*/
        public runtime:number = 0;

        constructor() {
            super(MsgCmdConstant.MSG_GAME_H5_WX_LOGIN);
        }

        public serialize(ar:ObjectSerializer):void {
            super.serialize(ar);
            let self = this;
            //
            self.unionId = ar.sString(self.unionId);
            self.nickname = ar.sString(self.nickname);
            self.sex = ar.sInt(self.sex);
            self.headimgurl = ar.sString(self.headimgurl);

            self.openId = ar.sString(self.openId);
            self.loginAuthCode = ar.sString(self.loginAuthCode);
            self.timeStamp = ar.sLong(self.timeStamp);
            self.loginToken = ar.sString(self.loginToken);
            self.clientIP = ar.sString(self.clientIP);
            //
            self.devicePlatform = ar.sInt(self.devicePlatform);
            self.runtime = ar.sInt(self.runtime);
        }

    }
}