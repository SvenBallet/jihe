module FL {
    /**
     * *授权代开房 授权钻石弹窗
     */
    export class AgentAuthReminderView extends BaseView{

        public readonly mediatorName: string = AgentAuthReminderViewMediator.NAME;
        public readonly viewLayer: ViewLayerEnum = ViewLayerEnum.POPUP;

        //按钮组
        public confirmGroup:eui.Group;
        public confirmBtn:GameButton;

        public cancelGroup:eui.Group;
        public cancelBtn:GameButton;

        public diamondNum:NumberInput;

        public playerID:string;

        public constructor(playerID) {
            super();
            this.verticalCenter = this.horizontalCenter = 0;
            this.skinName = "skins.AgentAuthReminderViewSkin";
            this.playerID = playerID;
        }


        protected childrenCreated():void {
            super.childrenCreated();

            // this.diamondNum.prompt = "请输入授权钻石数量";
            this.diamondNum.minValue = 100;
            this.diamondNum.maxValue = 9999999999;

            //注册按钮点击缓动
            TouchTweenUtil.regTween(this.confirmGroup, this.confirmBtn);
            TouchTweenUtil.regTween(this.cancelGroup, this.cancelBtn);

            //注册pureMvc
            MvcUtil.regMediator( new AgentAuthReminderViewMediator(this));
        }

    }
}