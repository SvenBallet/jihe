module FL {
    /**
     * 客服界面
     */
    export class CustomerView extends BaseView {

        //调停者名字，删除界面的时候会自动移除
        public readonly mediatorName: string = SetViewMediator.NAME;
        //界面层级，UI框架自动管理
        public readonly viewLayer: ViewLayerEnum = ViewLayerEnum.POPUP;

        //添加界面的缓动
        public addTween:Array<any> = [{data:[{scaleX:0.8, scaleY:0.8}, {scaleX:1, scaleY:1}, 200, Game.Ease.backOut]}];

        public closeGroup:eui.Group;
        public closeBtn:eui.Image;
        public wxLab1:eui.Label;
        public wxLab2:eui.Label;
        public copyGro1:eui.Group;
        public copyBtn1:FL.GameButton;
        public copyGro2:eui.Group;
        public copyBtn2:FL.GameButton;
        public sureGro:eui.Group;
        public sureBtn:FL.GameButton;

        constructor () {
            super();
            this.verticalCenter = this.horizontalCenter = 0;
            this.skinName = skins.CustomerViewSkin;
        }

        protected childrenCreated():void {
            super.childrenCreated();

            TouchTweenUtil.regTween(this.closeBtn, this.closeBtn);
            TouchTweenUtil.regTween(this.sureBtn, this.sureBtn);
            TouchTweenUtil.regTween(this.copyBtn1, this.copyBtn1);
            TouchTweenUtil.regTween(this.copyBtn2, this.copyBtn2);

            MvcUtil.regMediator( new CustomerViewMediator(this) );

            let para1: SystemConfigPara = LobbyHandler.getOneClientConfig(GameConfigConstant.CONF_WX_CUSTOMER_ONE);
            let para2: SystemConfigPara = LobbyHandler.getOneClientConfig(GameConfigConstant.CONF_WX_CUSTOMER_TWO);
            if (para1 && para1.valueStr) {
                this.wxLab1.text = para1.valueStr;
            }
            if (para2 && para2.valueStr) {
                this.wxLab2.text = para2.valueStr;
            }
        }

    }
}