module FL {
    /**
     * 登录界面调停者
     * @Name:  FL - LoginViewMediator
     * @Company 深圳市天天爱科技有限公司 版权所有
     * @Description:  无详细描述
     * @Create: DerekWu on 2017/8/16 14:30
     * @Version: V1.0
     */
    export class DevLoginViewMediator extends puremvc.Mediator implements puremvc.IMediator {

        //注册到pureMvc中的名字，不能重复，否则会覆盖
        public static readonly NAME:string = "DevLoginViewMediator";

        //登录按钮开关
        // private readonly _loginTouchSwitch:TouchSwitch;
        //登录按钮开关打开回调
        // private _backLoginTouchSwitchOpen:MyCallBack;

        constructor (pView:DevLoginView) {
            super(DevLoginViewMediator.NAME, pView);
            let self = this;
            pView.loginBtnGroup.addEventListener(egret.TouchEvent.TOUCH_TAP, self.loginBtnClick, self);
            pView.closeGroup.addEventListener(egret.TouchEvent.TOUCH_TAP, self.closeView, self);
            // this._loginTouchSwitch = TouchSwitchUtil.genTouchSwitchByComp(pView.loginBtnGroup);
        }

        private loginBtnClick(e:egret.Event):void {
            let self = this;
            let vView:DevLoginView = self.viewComponent;
            let vLoginMsg:LoginMsg = new LoginMsg();

            if (vView.accText0.text) {
                vLoginMsg.userName = vView.accText.text;
                vLoginMsg.qqOpenID = vView.accText0.text;
                vLoginMsg.wxOpenID = vView.accText0.text + "open";
                vLoginMsg.password = "";
                vLoginMsg.machineCode = NativeBridge.getInstance().machineCode;
                vLoginMsg.deviceFlag = Game.CommonUtil.DeviceFlag;
                CommonHandler.setDevLoginMsg(vLoginMsg);
                MvcUtil.send(LoginModule.LOGIN_DEV_LOGIN, vLoginMsg);
            }
            else {
                let account:string = vView.accText.text.trim();
                if (account == "") {
                    // MAC模拟器输入框有问题，给一个默认账号
                    if (FL.GConf.Conf.isDev && Game.CommonUtil.IsIos) {
                        account = "MACTEST";
                    }
                    else {
                        PromptUtil.show("请输入账号！", PromptType.ERROR);
                        return;
                    }
                }

                let vTempMachineCode:string = "F392382B-3200-42d95-A2CB-92C248B4";
                //处理登录
                vLoginMsg.userName = account;
                vLoginMsg.machineCode = vTempMachineCode.substr(0, vTempMachineCode.length - account.length)+account;
                MvcUtil.send(LoginModule.LOGIN_DEV_LOGIN, vLoginMsg);
            }
        }

        private closeView(e:egret.Event):void {
            MvcUtil.delView(this.viewComponent);
        }

    }
}