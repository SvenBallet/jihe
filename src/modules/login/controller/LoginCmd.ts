module FL {
    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase - LoginCmd
     * @Description:  //处理登录模块指令
     * @Create: DerekWu on 2017/12/14 9:40
     * @Version: V1.0
     */
    export class LoginCmd extends puremvc.SimpleCommand implements puremvc.ICommand {

        public execute(notification:puremvc.INotification):void {
            let data:any = notification.getBody();
            switch(notification.getName()) {
                case LoginModule.LOGIN_OTHER_LOGIN:{
                    this.exeOtherLoginMsgAck(data);
                    break;
                }
                case LoginModule.LOGIN_DEV_LOGIN:{
                    this.devLogin(data);
                    break;
                }
                case LoginModule.LOGIN_WEIXIN_LOGIN:{
                    this.weixinLogin();
                    break;
                }
                case LoginModule.LOGIN_WEIXIN_LOGIN_ERROR:{
                    this.weixinLoginError(data);
                    break;
                }
                case LoginModule.LOGIN_IS_ACCOUNT_EXIST:{
                    this.checkPlayerExist(data);
                    break;
                }
            }
        }

        /**
         * 其他地方登录，被踢下线
         * @param {FL.OtherLoginMsgAck} msg
         */
        public exeOtherLoginMsgAck(msg:OtherLoginMsgAck):void {
            //手动关闭socket
            ServerUtil.closeSocket();
            //弹窗提示
            ReminderViewUtil.showReminderView({
                hasLeftBtn:true,
                leftBtnText:"重新登录",
                leftCallBack:new MyCallBack(this.reLogin, this),
                hasRightBtn:true,
                rightCallBack:new MyCallBack(this.exitGame, this),
                rightBtnText:"退出游戏",
                text:"您的账号在其他地方登录，您已经被踢下线，请确认您账号的安全！"
            });
        }

        /**
         * 重新登录
         */
        private reLogin():void {
            if (Game.CommonUtil.IsWeb) {
                location.reload();
            }
            else if (Game.CommonUtil.isNative) {
                ReminderViewUtil.showReminderView({
                    hasRightBtn:true,
                    rightCallBack:new MyCallBack(this.exitGame, this),
                    rightBtnText:"退出游戏",
                    text:"重登失败！"
                });
            }
        }

        /**
         * 退出游戏
         */
        private exitGame():void {
            if (Game.CommonUtil.IsWeb) {
                window.close();
            }
            else if (Game.CommonUtil.isNative) {
                let idData = {
                    "eventType": SendNativeMsgType.SEND_NATIVE_QUIT_GAME,
                    "data": {
                    }
                }
                NativeBridge.getInstance().sendNativeMessage(JSON.stringify(idData));
            }
        }

        /**
         * 开发版本登录
         * @param {FL.LoginMsg} pLoginMsg
         */
        public devLogin(pLoginMsg:LoginMsg):void {
            //设置最后登录消息
            CommonHandler.setDevLoginMsg(pLoginMsg);
            this.addLoadingView();
        }

        /**
         * 添加加载界面
         */
        private addLoadingView():void {
            //先弹出loading界面加载资源，加载结束之后再发送登录消息
            let vInitLoginLoadingTaskAndCallBack:MyCallBack = new MyCallBack(this.initLoginLoadingTaskAndCallBack, this);
            MvcUtil.send(CommonModule.COMMON_START_LOADING, vInitLoginLoadingTaskAndCallBack);
        }

        /**
         * 初始化登录loading任务和加载完成后的回调
         * @param {FL.LoadingView} loadingView
         * @returns {Promise<void>}
         */
        private async initLoginLoadingTaskAndCallBack(loadingView:LoadingView) {
            //加载otherAll资源组任务
            let vCommonLoadingTask:LoadingTaskReporter = new LoadingTaskReporter("common", 100);
            let vMJGameLoadingTask:LoadingTaskReporter = new LoadingTaskReporter("mjgame", 100);
            let vRFgameLoadingTask:LoadingTaskReporter = new LoadingTaskReporter("rfgame", 100);
            let vTeahouseLoadingTask:LoadingTaskReporter = new LoadingTaskReporter("teahouse", 100);
            let vMahjongLoadingTask:LoadingTaskReporter = new LoadingTaskReporter("mahjong", 100);
            let newLoadingTask:LoadingTaskReporter = new LoadingTaskReporter("new", 100);
            //将任务添加在loading界面
            loadingView.addTaskReporter(vCommonLoadingTask);
            loadingView.addTaskReporter(vMJGameLoadingTask);
            loadingView.addTaskReporter(vRFgameLoadingTask);
            loadingView.addTaskReporter(vTeahouseLoadingTask);
            loadingView.addTaskReporter(vMahjongLoadingTask);
            loadingView.addTaskReporter(newLoadingTask);
            //开始加载
            await RES.loadGroup("common", 0, vCommonLoadingTask);
            await RES.loadGroup("mjgame", 0, vMJGameLoadingTask);
            await RES.loadGroup("rfgame", 0, vRFgameLoadingTask);
            await RES.loadGroup("teahouse", 0, vTeahouseLoadingTask);
            await RES.loadGroup("mahjong", 0, vMahjongLoadingTask);
            await RES.loadGroup("new", 0, newLoadingTask);

            //设置加载完成后的回调
            loadingView.overCallBack = new MyCallBack(this.sendLogin, this);
        }

        /**
         * 正式发送登录消息
         */
        private sendLogin():void {
            //发送登录消息（废弃）
            // ServerUtil.sendMsg(CommonHandler.getLastLoginMsg(), MsgCmdConstant.MSG_GAME_LOGIN_ACK);
            //链接服务器
            FL.ServerUtil.init(FL.GConf.mBaseUrl);
        }

        /**
         * 微信登录
         */
        public weixinLogin():void {
            //设置最后微信登录消息
            let vH5WXLoginMsg:H5WXLoginMsg = new H5WXLoginMsg();
            let vWXAuth:WXAuth = GWXAuth.WXAuth;
            vH5WXLoginMsg.unionId = vWXAuth.unionId;
            vH5WXLoginMsg.loginAuthCode = vWXAuth.loginAuthCode;
            vH5WXLoginMsg.timeStamp = dcodeIO.Long.fromNumber(vWXAuth.timeStamp);
            vH5WXLoginMsg.loginToken = vWXAuth.loginToken;
            vH5WXLoginMsg.openId = vWXAuth.openId;
            vH5WXLoginMsg.nickname = vWXAuth.nickname;
            vH5WXLoginMsg.sex = parseInt(vWXAuth.sex);
            vH5WXLoginMsg.headimgurl = vWXAuth.headimgurl;
            CommonHandler.setWXLoginMsg(vH5WXLoginMsg);
            //链接服务器
            FL.ServerUtil.init(FL.GConf.mBaseUrl);
        }

        /**
         * 微信登录异常
         * @param {FL.H5WXLoginMsgErrorAck} msg
         */
        public weixinLoginError(msg:H5WXLoginMsgErrorAck):void {
            //设置最后微信登录消息
            ReminderViewUtil.showReminderView({
                hasLeftBtn:true,
                leftCallBack:new MyCallBack(this.reLogin, this),
                leftBtnText:"重新登录",
                hasRightBtn:false,
                text:msg.errMsg
            });
        }

        /**
         * 验证用户是否存在
         * @param {FL.CheckPlayerExist} msg
         */
        public checkPlayerExist(msg:CheckPlayerExist):void {
            if (msg.please_re_login === 1) {
                //设置最后微信登录消息
                ReminderViewUtil.showReminderView({
                    hasLeftBtn:true,
                    leftCallBack:new MyCallBack(this.reLogin, this),
                    leftBtnText:"重新登录",
                    hasRightBtn:false,
                    text:"非法操作，请您重新登录！"
                });
            }
        }


    }
}