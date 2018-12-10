module FL {
    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase - DevLoginView
     * @Description:  //开发版本登录界面
     * @Create: DerekWu on 2017/11/10 10:07
     * @Version: V1.0
     */
    export class DevLoginView extends BaseView {

        //调停者名字，删除界面的时候会自动移除
        public readonly mediatorName: string = DevLoginViewMediator.NAME;
        //界面层级，UI框架自动管理
        public readonly viewLayer: ViewLayerEnum = ViewLayerEnum.BOTTOM;

        //添加界面的缓动
        public addTween:Array<any> = [{tweenDict:"openPopup"}];

        //移除界面的缓动，去掉这个，可以打开看效果
        // public delTween:Array<any> = [{data:[{scaleX:0.5, scaleY:0.5}, 200]}];

        //登录按钮组，用来触摸
        public loginBtnGroup:eui.Group;
        //登录按钮
        // public loginButton:eui.Button;

        public closeGroup:eui.Group;
        // public closeButton:eui.Button;

        //账号输入
        public accText:eui.TextInput;
        public accText0:eui.TextInput;

        constructor () {
            super();
            this.left = this.right = this.top = this.bottom = 0;
            this.skinName = "skins.DevLoginViewSkin";
        }

        protected childrenCreated():void {
            super.childrenCreated();
            //注册按钮点击缓动
            TouchTweenUtil.regTween(this.loginBtnGroup, this.loginBtnGroup);
            TouchTweenUtil.regTween(this.closeGroup, this.closeGroup);
            //注册pureMvc
            MvcUtil.regMediator( new DevLoginViewMediator(this) );
        }

    }
}