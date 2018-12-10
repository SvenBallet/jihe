module FL {
    /**
     * 闲聊登陆相关
     * @copyright 深圳市天天爱科技有限公司
     * @author Sven
     * @date 2018/9/10
     */
    export class XlApiUtil {
        /**改成本游戏APPID  */
        private static readonly APPID = "9gyd2jXNdGa2QJHi";
        private static readonly SECRET = "b29qXPSVFJrEKxdg"

        /**
         * HTTP请求get方法
         */
        private static get(url: string, callback: Function, thisObj: any) {
            var request: egret.HttpRequest = new egret.HttpRequest();
            request.open(url, egret.HttpMethod.GET);
            request.once(egret.Event.COMPLETE, (e) => {
                var request = <egret.HttpRequest>e.currentTarget;
                console.log("requet.response:" + request.response);
                let re: any;
                try {
                    re = JSON.parse(request.response);
                }
                catch (err) {
                    console.error(err);
                }
                callback.call(thisObj, re);
            }, this);
            request.once(egret.IOErrorEvent.IO_ERROR, (e) => {
                console.log("error : event=" + e);
            }, this);

            request.send();
        }

        private static getAccessToken(code: string, callback: Function, thisObj: any) {
            if (!code) return;

            let url: string = "https://ssgw.updrips.com/oauth2/accessToken?appid="+this.APPID+"&appsecret="+this.SECRET+"&code="+code+"&grant_type=authorization_code";
            this.get(url, callback, thisObj);
        }

        private static refreshToken(tokenInfo: any) {
            let refreshToken: string = tokenInfo.refresh_token;
            if (!refreshToken) return;

            let url: string = "https://ssgw.updrips.com/oauth2/accessToken?appid="+this.APPID+"&appsecret="+this.SECRET+"&grant_type=refresh_token&refresh_token="+refreshToken;
            this.get(url, (msg)=>{
                let revTokenInfo = msg.data;
                if (msg.err_code) {
                    console.warn("XL refreshToken_error");
                    Storage.removeItem(Storage.XL_ACCESS_TOKEN_INFO);
                    XlApiUtil.loginXLQuick();
                    return;
                }
                else {
                    Storage.setItem(Storage.XL_ACCESS_TOKEN_INFO, JSON.stringify(revTokenInfo));
                    this.getUserInfo(revTokenInfo);
                }
            }, this);
        }

        private static getUserInfo(tokenInfo: any) {
            let acToken: string = tokenInfo.access_token;
            if (!(acToken)) return;

            let url: string = "https://ssgw.updrips.com/resource/user/getUserInfo?access_token="+acToken;
            this.get(url, (msg)=>{
                let userinfo = msg.data;
                if (msg.err_code) {
                    console.warn("XL getUserInfo_error");
                    return;
                }
                else {
                    console.log("XL GET LOGIN SUCCESS");

                    let vLoginMsg:LoginMsg = new LoginMsg();
                    vLoginMsg.userName = userinfo.nickName;
                    vLoginMsg.xlOpenID = userinfo.openId;
                    vLoginMsg.password = userinfo.smallAvatar;
                    vLoginMsg.machineCode = NativeBridge.getInstance().machineCode;
                    vLoginMsg.deviceFlag = Game.CommonUtil.DeviceFlag;
                    vLoginMsg.sex = userinfo.gender;

                    CommonHandler.setDevLoginMsg(vLoginMsg);
                    // 闲聊登陆还是需要走微信登陆的部分流程
                    WxApiUtil.loginWXQuick(true);
                }
            }, this);
        }

        public static loginXLQuick() {
            (<any>FL.GConf).Conf.useWXAuth = 3;
            if (NativeBridge.intoWXLogin) {
                return;
            }
            NativeBridge.intoWXLogin = true;
            let showTimer = new Game.Timer(5000);
            showTimer.once(egret.TimerEvent.TIMER, ()=>{
                NativeBridge.intoWXLogin = false;
                showTimer.stop();
            }, this)
            showTimer.start();

            let localItem = Storage.getItem(Storage.XL_ACCESS_TOKEN_INFO);
            console.log("XL_ACCESS_TOKEN_INFO:::"+localItem);
            let localAccessInfo = JSON.parse(localItem);
            let localAccessToken;
            if (localAccessInfo) {
                localAccessToken = localAccessInfo.access_token
            }
            if (!(localAccessToken && localAccessToken.length > 0)) {
                console.log("XL_login::::getcode");
                let jsonData = {
                    "eventType": SendNativeMsgType.SEND_NATIVE_GET_XL_CODE,
                    "data": {
                    }
                }
                NativeBridge.getInstance().sendNativeMessage(JSON.stringify(jsonData));
            }
            else {
                console.log("XL_login::::had access_token");
                this.refreshToken(localAccessInfo);
            }
        }

        /**接收原生SDK发送的 WX CODE */
        public static revNativeWXCode(code: string) {
            this.getAccessToken(code, (msg)=>{
                let tokenInfo = msg.data;
                if (msg.err_code) {
                    console.log("XL_login::::getAccessToken_error");
                    return;
                }
                else {
                    this.refreshToken(tokenInfo);
                }
            },this);
        }
    }
}