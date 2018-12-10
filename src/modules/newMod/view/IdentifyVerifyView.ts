module FL {
    /**
     * 身份验证界面
     */
    export class IdentifyVerifyView extends BaseView {

        //调停者名字，删除界面的时候会自动移除
        public readonly mediatorName: string = SetViewMediator.NAME;
        //界面层级，UI框架自动管理
        public readonly viewLayer: ViewLayerEnum = ViewLayerEnum.POPUP;

        //添加界面的缓动
        public addTween:Array<any> = [{data:[{scaleX:0.8, scaleY:0.8}, {scaleX:1, scaleY:1}, 200, Game.Ease.backOut]}];

        public closeGroup:eui.Group;
        public closeBtn:eui.Image;
        public sureGro:eui.Group;
        public sureBtn:FL.GameButton;
        public nameEdi:eui.EditableText;
        public numEdi:eui.EditableText;

        constructor () {
            super();
            this.verticalCenter = this.horizontalCenter = 0;
            this.skinName = skins.IdentifyVerifyViewSkin;
        }

        protected childrenCreated():void {
            super.childrenCreated();

            TouchTweenUtil.regTween(this.closeBtn, this.closeBtn);
            TouchTweenUtil.regTween(this.sureBtn, this.sureBtn);

            MvcUtil.regMediator( new IdentifyVerifyViewMediator(this) );

            // 有带X的身份证号
            // this.numEdi.inputType = egret.TextFieldInputType.TEL;
        }

    }
}