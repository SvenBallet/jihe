module FL {
    export class AgentSystemView extends BaseView{

        public readonly mediatorName: string = AgentSystemViewMediator.NAME;
        public readonly viewLayer: ViewLayerEnum = ViewLayerEnum.POPUP;

        //密码重置
        public resetBtn:GameButton;

        //今日结算
        public todaySumBtn:GameButton;

        //确认授权
        public authBtn:GameButton;

        //取消代理
        public cancelAgentBtn:GameButton;

        //确认解散
        public cancelRoomBtn:GameButton;

        //扣除钻石
        public deDiamondBtn:GameButton;

        //挂入下级
        public subAgentBtn:GameButton;

        //查询信息
        public searchInfoBtn:GameButton;

        //输入框
        public playerID:NumberInput;
        public textType:NumberInput;
        public inputType:NumberInput;
        public inputID:NumberInput;
        public inputNum:NumberInput;


        public constructor() {
            super();
            this.verticalCenter = this.horizontalCenter = 0;
            this.skinName = "skins.AgentSystemViewSkin";
        }
        protected childrenCreated():void {
            super.childrenCreated();

            this.textType.maxValue = 5;
            this.textType.minValue = 0;

            this.inputNum.minValue = 1;

            TouchTweenUtil.regTween(this.resetBtn, this.resetBtn);
            TouchTweenUtil.regTween(this.todaySumBtn, this.todaySumBtn);
            TouchTweenUtil.regTween(this.authBtn, this.authBtn);
            TouchTweenUtil.regTween(this.cancelAgentBtn, this.cancelAgentBtn);
            TouchTweenUtil.regTween(this.cancelRoomBtn, this.cancelRoomBtn);
            TouchTweenUtil.regTween(this.deDiamondBtn, this.deDiamondBtn);
            TouchTweenUtil.regTween(this.subAgentBtn, this.subAgentBtn);
            TouchTweenUtil.regTween(this.searchInfoBtn, this.searchInfoBtn);

            //注册pureMvc
            MvcUtil.regMediator( new AgentSystemViewMediator(this));
        }

    }
}