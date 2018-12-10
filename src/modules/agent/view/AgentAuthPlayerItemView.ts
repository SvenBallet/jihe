module FL {
    /**
     * *授权代开房 项目组
     */
    export class AgentAuthPlayerItemView extends BaseView{

        public readonly mediatorName: string = AgentAuthPlayerItemViewMediator.NAME;
        public readonly viewLayer: ViewLayerEnum = ViewLayerEnum.POPUP;

        //按钮
        public authDiamondBtn:GameButton;
        public cancelAuthBtn:GameButton;
        public recordBtn:GameButton;

        public playerID:eui.Label;
        public playerName:eui.Label;
        public authDiamondNum:eui.Label;

        public readonly item:AgentRoomRecord;
        
        public constructor(item:AgentRoomRecord) {
            super();
            this.verticalCenter = this.horizontalCenter = 0;
            this.skinName = "skins.AgentPlayerListSkin";
            this.item = item;
        }

        protected childrenCreated():void {
            super.childrenCreated();

            this.playerID.text = ""+this.item.targetId;
            this.playerName.text = this.item.targetName;
            this.authDiamondNum.text = "（已授权钻石数："+this.item.authMoney+")";

            //注册按钮点击缓动
            TouchTweenUtil.regTween(this.authDiamondBtn, this.authDiamondBtn);
            TouchTweenUtil.regTween(this.cancelAuthBtn, this.cancelAuthBtn);
            TouchTweenUtil.regTween(this.recordBtn, this.recordBtn);

            //注册pureMvc
           MvcUtil.regMediator( new AgentAuthPlayerItemViewMediator(this));

        }

    }
}