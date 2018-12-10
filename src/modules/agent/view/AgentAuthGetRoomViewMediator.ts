module FL{
    export class AgentAuthGetRoomViewMediator extends puremvc.Mediator implements puremvc.IMediator{

        public static readonly NAME:string = "AgentAuthGetRoomViewMediator";

        public vView:AgentAuthGetRoomView = this.viewComponent;

        constructor (pView:AgentAuthGetRoomView) {
            super(AgentAuthGetRoomViewMediator.NAME, pView);
            let self = this;
            pView.authBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, self.authPlayer, self);
        }

        private authPlayer(e:egret.TouchEvent):void{
            let userId = this.vView.userId.text.trim();
            if(userId == ""){
                PromptUtil.show("用户ID不能为空！", PromptType.ERROR);
                return;
            }
            ReminderViewUtil.showReminderView({hasLeftBtn:true, hasRightBtn:true,leftCallBack:new MyCallBack(this.sentValue,this,userId), text:"确认授权给ID为 "+userId+" 的玩家？（注意：授权后，副群主开房消耗的钻石是从群主身上扣除的）"});
        }

        private sentValue(userId):void{
            let vParams = {itemID:GameConstant.AGENT_CMD_SET_PLAYERID,count:userId};
            AgentCmd.authListIsLoad = 0;
            ServerUtil.sendMsg(new GameBuyItemMsg(vParams), MsgCmdConstant.MSG_AGENT_PLAYER_ACK);
        }

    }
}