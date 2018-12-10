module FL {
    /**
     * 登录界面
     * @Name:  FL - LoginView
     * @Company 深圳市天天爱科技有限公司 版权所有
     * @Description:  无详细描述
     * @Create: DerekWu on 2017/8/14 22:39
     * @Version: V1.0
     */
    export class LoginView extends BaseView {

        public readonly mediatorName: string = "";
        public readonly viewLayer: ViewLayerEnum = ViewLayerEnum.BOTTOM_ONLY;

        //背景图片，在childrenCreated 中删除
        public bgImg:eui.Image;

        //登录按钮组，屏幕适配作用
        public loginButtonGroup:eui.Group; 
        //登录按钮
        public loginButton:eui.Image; 

        //同意图片，打钩
        public selectCheckBox:eui.Image;
        
        //同意用户协议，点击弹出协议界面 
        public agreeLabel:eui.Label; 

        //版本信息
        public versionLabel:eui.Label; 

        /**原生游客登陆按钮 */
        public loginBtnGroup:eui.Group;

        public testGro:eui.Group;
        public loginButtonL:eui.Image;
        public loginButtonB:eui.Image;
        public loginButtonGroup0:eui.Group;
        public loginButton0:eui.Image;

        constructor () {
            super();
            this.left = this.right = this.top = this.bottom = 0;
            this.skinName = "skins.LoginViewSkin";
        }

         protected childrenCreated():void {
            super.childrenCreated();
            let self = this;
            //删除老的背景图片
            self.removeChild(self.bgImg);

            //设置版本号
             self.versionLabel.text = NativeBridge.version;

            //注册按钮点击缓动
            TouchTweenUtil.regTween(self.loginButtonGroup, this.loginButton);
            TouchTweenUtil.regTween(self.loginButtonGroup0, this.loginButton0);
            TouchTweenUtil.regTween(self.loginBtnGroup, this.loginBtnGroup);

            //注册pureMvc 
            MvcUtil.regMediator( new LoginViewMediator(self) );

            if (Game.CommonUtil.isNative) {
                // this.loginButtonGroup.visible = NativeBridge.getInstance().mWXFlag;
                // this.loginButtonGroup0.visible = NativeBridge.getInstance().mXLFlag;
                if (!NativeBridge.getInstance().mWXFlag && !NativeBridge.getInstance().mXLFlag)
                {
                    this.loginBtnGroup.visible = true;
                }
                else {
                    this.loginBtnGroup.visible = false;
                }

                // 原生处理
                MvcUtil.send(CommonModule.COMMON_NATIVE_INIT_DATA);

                this.testGro.visible = false;
            }
            else {
                this.loginButtonGroup.visible = true;
                this.loginButtonGroup0.visible = true;
                this.loginBtnGroup.visible = false;
                this.testGro.visible = false;
            }
         }

         // 粒子测试
        private particleTest() {
            let resStr = "testParticle"
            let parSys = new particle.GravityParticleSystem(RES.getRes(resStr+"_png"), RES.getRes(resStr+"_json"));
            this.addChild(parSys);
            let oX = 0;
            let oY = 0;
            parSys.emitterX = oX;
            parSys.emitterX = oY;
            parSys.start();
            egret.Tween.get(parSys, {loop: true})
            .set({emitterX: oX, emitterY: oY, emitterVarianceX: 50, emitterVarianceY: 50})
            .to({emitterX: oX+1280, emitterY: 720, emitterVarianceX: 10, emitterVarianceY: 10}, 2000)
            .call(()=>{
                // parSys.stop();
            })
        }
    }
}