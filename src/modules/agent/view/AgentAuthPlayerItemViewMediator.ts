module FL{
    export class AgentAuthPlayerItemViewMediator extends puremvc.Mediator implements puremvc.IMediator{

        public static readonly NAME:string = "AgentAuthPlayerItemViewMediator";

        public vView:AgentAuthPlayerItemView = this.viewComponent;

        constructor (pView:AgentAuthPlayerItemView) {
            super(AgentAuthPlayerItemViewMediator.NAME, pView);
            let self = this;
            pView.authDiamondBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, self.authDiamondBtnClick, self);
            pView.cancelAuthBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, self.cancelAuthBtnClick, self);
            pView.recordBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, self.recordBtnClick, self);
        }

        private authDiamondBtnClick():void{
            let playerID:number = parseInt(this.vView.playerID.text);
            MvcUtil.addView(new AgentAuthReminderView(playerID));
        }

        private cancelAuthBtnClick():void{
            ReminderViewUtil.showReminderView({hasLeftBtn:true, hasRightBtn:true,leftCallBack:new MyCallBack(this.cancelAuth,this), text:"确认取消授权？"});
        }

        private cancelAuth():void{
            let playerID:number = parseInt(this.vView.playerID.text);
            let vParams = {itemID:GameConstant.AGENT_CMD_CANCEL_AGENT,count:playerID};
            ServerUtil.sendMsg(new GameBuyItemMsg(vParams), MsgCmdConstant.MSG_AGENT_PLAYER_ACK);
        }

        private recordBtnClick():void{
            // MvcUtil.send(LobbyModule.LOBBY_INTO_LOBBY);
            // egret.localStorage.setItem("agentTabIndex","3");
            let playerID:number = parseInt(this.vView.playerID.text);
            // egret.localStorage.setItem("agentQunzhuID",""+playerID);
            // MvcUtil.send(AgentModule.AGENT_INTO_AGENT);
            let vParams = {itemID:GameConstant.AGENT_CMD_GET_FANGLIST,count:1,unused_0:0,unused_2:playerID};
            let vGameBuyItemMsg:GameBuyItemMsg = new GameBuyItemMsg(vParams);
            egret.log(vGameBuyItemMsg);
            ServerUtil.sendMsg(vGameBuyItemMsg, MsgCmdConstant.MSG_AGENT_DAIKAI_ACK);

        }
    }

}