module FL {

    export class ActivityAttentionAwardView extends BaseView {

        //调停者名字，删除界面的时候会自动移除
        public readonly mediatorName: string = ActivityBaseViewMediator.NAME;
        //界面层级，UI框架自动管理
        public readonly viewLayer: ViewLayerEnum = ViewLayerEnum.POPUP;

        public readonly msg:WXGongzhonghaoActivityMsgAck;

        public redirect:eui.Image;
        public weixinID:eui.Label;
        public diamondNum:eui.Label;

        public colorFilter = new egret.ColorMatrixFilter(
            [0.5,0,0,0,0,
            0,0.5,0,0,0,
            0,0,0.5,0,0,
            0,0,0,1,0]);

        private static _only:ActivityAttentionAwardView;

        public static getInstance():ActivityAttentionAwardView {
            if (!this._only) {
                this._only = new ActivityAttentionAwardView();
            }
            return this._only;
        }

        constructor () {
            super();
            this.verticalCenter = this.horizontalCenter = 0;
            // this.skinName = "skins.ActivityAttentionAwardViewSkin";
        }

        protected childrenCreated():void {
            let self = this;
            super.childrenCreated();
            let configCon:SystemConfigPara = LobbyHandler.getOneClientConfig(GameConfigConstant.CONF_WX_ATTENTION_REWARD);
            self.weixinID.text = "公众号："+configCon.valueStr;
            self.diamondNum.text = ""+configCon.pro_2;

            if(configCon.pro_1 === 1){
                self.redirect.filters = [self.colorFilter];
                self.redirect.touchEnabled = false;
            }

            TouchTweenUtil.regTween(self.redirect, self.redirect);
            self.redirect.addEventListener(egret.TouchEvent.TOUCH_TAP, self.openPage, self);
        }

        private openPage():void {
            MvcUtil.send(ActivityModule.ACTIVITY_OPEN_WX_PAGE);
        }


    }
}