module FL {
    /**
     * 登录界面调停者
     * @Name:  FL - LoginViewMediator
     * @Company 深圳市天天爱科技有限公司 版权所有
     * @Description:  无详细描述
     * @Create: DerekWu on 2017/8/16 14:30
     * @Version: V1.0
     */
    export class LoginViewMediator extends puremvc.Mediator implements puremvc.IMediator {

        public static readonly NAME:string = "LoginViewMediator";

        //登录按钮开关
        // private readonly _loginTouchSwitch:TouchSwitch;

        constructor (pLoginView:LoginView) {
            super(LoginViewMediator.NAME, pLoginView);
            let self = this;
            pLoginView.loginButton.addEventListener(egret.TouchEvent.TOUCH_TAP, self.loginBtnClick, self);
            pLoginView.loginButton0.addEventListener(egret.TouchEvent.TOUCH_TAP, self.loginBtnClickXL, self);
            pLoginView.loginBtnGroup.addEventListener(egret.TouchEvent.TOUCH_TAP, self.logBtnClick, self);
            pLoginView.selectCheckBox.addEventListener(egret.TouchEvent.TOUCH_TAP, self.selectCheckBox, self);
            pLoginView.agreeLabel.addEventListener(egret.TouchEvent.TOUCH_TAP, self.lookAgreement, self);
            // this._loginTouchSwitch = TouchSwitchUtil.genTouchSwitchByComp(pLoginView.loginBtn);
        }

        private getView():LoginView {
            return this.viewComponent;
        }

        private loginBtnClickXL() {
            if (this.getView().selectCheckBox.source === "login_check_rect_png") {
                PromptUtil.show("请确认并同意用户协议！", PromptType.ALERT);
                return;
            }

            // 原生登陆
            if (Game.CommonUtil.isNative) {
                if (!NativeBridge.getInstance().mXLFlag) {
                    PromptUtil.show("未检测到闲聊，请选择其他方式登陆或先安装闲聊", PromptType.ALERT);
                }
                else {
                    XlApiUtil.loginXLQuick();
                }
            }
        }

        /**
         * 登录
         * @param {egret.TouchEvent} e
         */
        private loginBtnClick(e:egret.TouchEvent):void {
            if (this.getView().selectCheckBox.source === "login_check_rect_png") {
                PromptUtil.show("请确认并同意用户协议！", PromptType.ALERT);
                return;
            }

            // 原生登陆
            if (Game.CommonUtil.isNative) {
                 WxApiUtil.loginWXQuick();
            }
            else if (GConf.Conf.isDev) {
                MvcUtil.addView(new DevLoginView());
            }
            else {
                //TODO ... 正式登录
                MvcUtil.addView(new DevLoginView());
            }

            // let self = this;

            // egret.log("login ..");
            // if (self._loginTouchSwitch.isOpen()) {

            //     let vLoginView:LoginView = self.viewComponent;

            //     let account:string = vLoginView.accText.text;
            //     if (account.trim() == "") {
            //         PromptUtil.show("请输入账号！", "pField");
            //         // PromptUtil.show("请输入账号！", "pSucc");
            //         return;
            //     }
            //     let vLoginInfo:LoginInfo = new LoginInfo(account.trim(), "accKey", "FL_Test", 1, "");
            //     MvcUtil.send(CommonModule.COMMON_INIT_LOGIN_INFO, [vLoginInfo, self._loginTouchSwitch.genCurrOpenCallBack()]);

            //     //关闭按钮
            //     self._loginTouchSwitch.close();
            // }
        }

        private logBtnClick() {
            if (this.getView().selectCheckBox.source === "login_check_rect_png") {
                PromptUtil.show("请确认并同意用户协议！", PromptType.ALERT);
                return;
            }

            MvcUtil.addView(new DevLoginView());
        }

        /**
         * 选择多选框
         * @param {egret.TouchEvent} e
         */
        private selectCheckBox(e:egret.TouchEvent):void {
            let vSelectCheckBox:eui.Image = this.getView().selectCheckBox;
            if (vSelectCheckBox.source === "login_check_agree_png") {
                vSelectCheckBox.source = "login_check_rect_png";
            } else {
                vSelectCheckBox.source = "login_check_agree_png";
            }
        }

        /**
         * 查看协议
         * @param {egret.TouchEvent} e
         */
        private lookAgreement(e:egret.TouchEvent):void {
            this.asyncLookAgreement();
        }

        /**
         *  async  await
         * @returns {Promise<void>}
         */
        private async asyncLookAgreement() {
            //增加loading
            // ReqLoadingViewUtil.addReqLoadingView();
            //加载资源组
            await RES.loadGroup("agreement");
            //删除loading
            // ReqLoadingViewUtil.delReqLoadingView();
            //打开用户协议界面
            MvcUtil.addView(new AgreementView());
        }

    }
}