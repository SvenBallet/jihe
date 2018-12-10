module FL{
    export class AgentGiveDiamondViewMediator extends puremvc.Mediator implements puremvc.IMediator{

        public static readonly NAME:string = "AgentGiveDiamondViewMediator";

        public vAgentGiveDiamondView:AgentGiveDiamondView = <AgentGiveDiamondView>super.getViewComponent();

        constructor (pView:AgentGiveDiamondView) {
            super(AgentGiveDiamondViewMediator.NAME, pView);
            let self = this;
            pView.addGroup.addEventListener(egret.TouchEvent.TOUCH_TAP, self.addValue, self);
            pView.minusGroup.addEventListener(egret.TouchEvent.TOUCH_TAP, self.minusValue, self);
            pView.confirmBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, self.submitValue, self);
        }

        private addValue():void{
            let value:number = parseInt(this.vAgentGiveDiamondView.giveNum.text);
            value >= 100000 ? value = 100000: value++;
            this.vAgentGiveDiamondView.giveNum.text = ""+value;
        }

        private minusValue():void{
            let value:number = parseInt(this.vAgentGiveDiamondView.giveNum.text);
            value < 1 ? value = 0: value--;
            this.vAgentGiveDiamondView.giveNum.text = ""+value;
        }

        private submitValue():void{
            MvcUtil.send(AgentModule.AGENT_GIVE_PLAYER_DIAMOND,GameConstant.SEND_PLAYER_DIAMOND_CMD);
        }
    }
}