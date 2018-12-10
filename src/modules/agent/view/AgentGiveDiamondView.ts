module FL {
    export class AgentGiveDiamondView extends BaseView{

        public readonly mediatorName: string = AgentGiveDiamondViewMediator.NAME;
        public readonly viewLayer: ViewLayerEnum = ViewLayerEnum.POPUP;

        //按钮组
        public addGroup:eui.Group;
        public addBtn:eui.Image;

        public minusGroup:eui.Group;
        public minusBtn:eui.Image;

        public confirmBtn:GameButton;

        public giveNum:NumberInput;
        public playerId:NumberInput;
        public password:eui.TextInput;


        /** 单例 */
        private static _only: AgentGiveDiamondView;

        public static getInstance(): AgentGiveDiamondView {
            if (!this._only) {
                this._only = new AgentGiveDiamondView();
            }
            return this._only;
        }

        private constructor() {
            super();
            this.verticalCenter = this.horizontalCenter = 0;
            this.skinName = "skins.AgentGiveDiamondViewSkin";
        }

        protected childrenCreated():void {
            super.childrenCreated();

            //赠送钻石初始值为1
            this.giveNum.text = "1";
            this.giveNum.titleLabelText = "赠送数量";
            this.playerId.titleLabelText = "对方游戏ID";
            //输入最大最小值范围
            this.giveNum.maxValue = 100000;
            this.giveNum.minValue = 1;

            this.password.inputType = egret.TextFieldInputType.PASSWORD;
            this.password.displayAsPassword = true;

            //注册按钮点击缓动
            TouchTweenUtil.regTween(this.addGroup, this.addBtn);
            TouchTweenUtil.regTween(this.minusGroup, this.minusBtn);
            TouchTweenUtil.regTween(this.confirmBtn, this.confirmBtn);

            //注册pureMvc
            MvcUtil.regMediator( new AgentGiveDiamondViewMediator(this));
        }

    }
}