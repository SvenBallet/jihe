module FL{
    export class AgentGetRoomViewMediator extends puremvc.Mediator implements puremvc.IMediator{

        public static readonly NAME:string = "AgentGetRoomViewMediator";
        public vView:AgentGetRoomView = this.viewComponent;

        constructor (pView:AgentGetRoomView) {
            super(AgentGetRoomViewMediator.NAME, pView);
            let self = this;
            pView.agentBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, self.submitValue, self);
            pView.getRoomGroup.addEventListener(egret.TouchEvent.TOUCH_TAP, self.getRoomList, self);
            pView.leftGroup.addEventListener(egret.TouchEvent.TOUCH_TAP, self.loadPreviousPage, self);
            pView.rightGroup.addEventListener(egret.TouchEvent.TOUCH_TAP, self.loadNextPage, self);
        }

        private submitValue():void{
            let roomNum:string = this.vView.roomNum.text.trim();
            if(roomNum == ""){
                PromptUtil.show("请输入代开房数量！", PromptType.ERROR);
                return;
            }
            egret.localStorage.setItem("agentRoomNum",roomNum);
            MvcUtil.addView(new DelLayerView(ViewLayerEnum.BOTTOM_ONLY));
            //进入创建游戏界面
            MvcUtil.addView(new LobbyCreateGameView());
        }

        private getRoomList():void{
            let playerID:number = AgentGetRoomView.authPlayerID;
            // MvcUtil.addView(new DelLayerView(ViewLayerEnum.BOTTOM_ONLY));
            //进入战绩界面
            let msg: GetVipRoomListMsg = new GetVipRoomListMsg();
            msg.unused_0 = 1;
            msg.unused_1 = playerID;
            msg.unused_2 = 1;
            ServerUtil.sendMsg(msg,MsgCmdConstant.MSG_GET_VIP_ROOM_RECORD_ACK2);
        }

        //上一页
        private loadPreviousPage(e:egret.Event):void{
            let currentPage:number = parseInt(this.vView.currentPage.text);
            let previousPage:number = currentPage-1<0 ? 0 : currentPage-1;
            if(currentPage <= 1){
                return;
            }
            //服务器传过来的页数索引(也就是当前页)pageIndex是从0开始的= =！。所以要-1
            let vParams = {itemID:GameConstant.AGENT_CMD_GET_FANGLIST,count:previousPage-1};
            ServerUtil.sendMsg(new GameBuyItemMsg(vParams), MsgCmdConstant.MSG_AGENT_DAIKAI_ACK);
        }

        //下一页
        private loadNextPage(e:egret.Event):void{
            let currentPage:number = parseInt(this.vView.currentPage.text);
            let totalPage:number = parseInt(this.vView.totalPage.text);
            if(currentPage == totalPage){
                return;
            }
            let nextPage:number = currentPage+1> totalPage? totalPage : currentPage+1;

            //服务器传过来的页数索引(也就是当前页)pageIndex是从0开始的= =！。所以要-1
            let vParams = {itemID:GameConstant.AGENT_CMD_GET_FANGLIST,count:nextPage-1};
            ServerUtil.sendMsg(new GameBuyItemMsg(vParams), MsgCmdConstant.MSG_AGENT_DAIKAI_ACK);
        }
    }
}