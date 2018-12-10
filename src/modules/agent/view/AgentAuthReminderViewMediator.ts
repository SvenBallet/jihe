module FL{
    export class AgentAuthReminderViewMediator extends puremvc.Mediator implements puremvc.IMediator{

        public static readonly NAME:string = "AgentAuthReminderViewMediator";

        public vView:AgentAuthPlayerItemView = this.viewComponent;

        constructor (pView:AgentAuthReminderView) {
            super(AgentAuthReminderViewMediator.NAME, pView);
            let self = this;

            pView.confirmGroup.addEventListener(egret.TouchEvent.TOUCH_TAP, this.authDiamond, this);
            pView.cancelGroup.addEventListener(egret.TouchEvent.TOUCH_TAP, this.closeView, this);
        }

        private authDiamond():void{
            let vAgentAuthReminderView:AgentAuthReminderView = this.viewComponent;
            let diamondNum = vAgentAuthReminderView.diamondNum.text.trim();
            if(diamondNum == ""){
                PromptUtil.show("用户ID不能为空！", PromptType.ERROR);
                return;
            }
            let vParams = {itemID:GameConstant.AGENT_CMD_SET_PLAYER_DIAMOND,count:vAgentAuthReminderView.playerID,unused_0:diamondNum};
            ServerUtil.sendMsg(new GameBuyItemMsg(vParams), MsgCmdConstant.MSG_AGENT_PLAYER_ACK);
            this.closeView();
        }

        private closeView():void{
            MvcUtil.delView(this.viewComponent);
        }
    }
}