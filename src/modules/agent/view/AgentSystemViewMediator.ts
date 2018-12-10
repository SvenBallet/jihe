module FL{
    export class AgentSystemViewMediator extends puremvc.Mediator implements puremvc.IMediator{

        public static readonly NAME:string = "AgentSystemViewMediator";

        public vView:AgentSystemView = this.viewComponent;

        constructor (pView:AgentSystemView) {
            super(AgentSystemViewMediator.NAME, pView);
            let self = this;
            pView.resetBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, self.resetBtnClick, self);
            pView.todaySumBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, self.todaySumBtnClick, self);
            pView.authBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, self.authBtnClick, self);
            pView.cancelAgentBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, self.cancelAgentBtnClick, self);
            pView.cancelRoomBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, self.cancelRoomBtnClick, self);
            pView.deDiamondBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, self.deDiamondBtnClick, self);
            pView.subAgentBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, self.subAgentBtnClick, self);
            pView.searchInfoBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, self.searchInfoBtnClick, self);
        }

        /**
         * 密码重置
         */
        private resetBtnClick():void{
            let playerID:string = this.vView.playerID.text.trim();
            if(playerID == ""){
                PromptUtil.show("玩家游戏ID不能为空！", PromptType.ERROR);
                return;
            }
            let vParams = {itemID:GameConstant.RESET_PASSWORD_BY_ADMIN,count:parseInt(playerID)};
            ServerUtil.sendMsg(new GameBuyItemMsg(vParams), MsgCmdConstant.MSG_GAME_BUY_ITEM_ACK);
        }

        /**
         * 今日结算
         */
        private todaySumBtnClick():void{

        }

        /**
         * 确认授权代理
         */
        private authBtnClick():void{
            let shangji:string = this.vView.playerID.text.trim();
            let xiaji:string = this.vView.inputID.text.trim();
            if(shangji == ""){
                PromptUtil.show("请在“输入代理玩家ID”栏输入玩家ID！", PromptType.ERROR);
                return;
            }
            if(xiaji == ""){
                PromptUtil.show("下级玩家ID不能为空！", PromptType.ERROR);
                return;
            }
            let vParams = {itemID:GameConstant.SET_PLAYER_TYPE_BY_ADMIN, count:parseInt(xiaji), cardNo:parseInt(xiaji), cardPsw:parseInt(shangji)};
            ServerUtil.sendMsg(new GameBuyItemMsg(vParams), MsgCmdConstant.MSG_GAME_BUY_ITEM_ACK);
        }

        /**
         * 取消授权代理
         */
        private cancelAgentBtnClick():void{
            let playerID:string = this.vView.inputID.text.trim();
            if(playerID == ""){
                PromptUtil.show("玩家游戏ID不能为空！", PromptType.ERROR);
                return;
            }
            let vParams = {itemID:GameConstant.SET_PLAYER_TYPE_BY_ADMIN,count:parseInt(playerID),cardNo:parseInt(playerID),unused_0:17};
            ServerUtil.sendMsg(new GameBuyItemMsg(vParams), MsgCmdConstant.MSG_GAME_BUY_ITEM_ACK);
        }

        /**
         *确认解散房间
         */
        private cancelRoomBtnClick():void{
            let roomID:string = this.vView.inputNum.text.trim();
            if(roomID == ""){
                PromptUtil.show("房间ID不能为空！", PromptType.ERROR);
                return;
            }
            let vParams = {itemID:GameConstant.DISMISS_VIP_TABLE_BY_ADMIN,count:parseInt(roomID)};
            ServerUtil.sendMsg(new GameBuyItemMsg(vParams), MsgCmdConstant.MSG_GAME_BUY_ITEM_ACK);
        }

        /**
         * 扣除钻石
         */
        private deDiamondBtnClick():void{
            let playerID:string = this.vView.inputID.text.trim();
            let diamondNum:string = this.vView.inputNum.text.trim();
            if(playerID == ""){
                PromptUtil.show("玩家ID不能为空！", PromptType.ERROR);
                return;
            }
            if(diamondNum == ""){
                PromptUtil.show("钻石数不能为空！", PromptType.ERROR);
                return;
            }
            let vParams = {itemID:GameConstant.SEND_PLAYER_CMD_SUB_DIAMOND,count:parseInt(diamondNum), unused_0:parseInt(playerID)};
            ServerUtil.sendMsg(new GameBuyItemMsg(vParams), MsgCmdConstant.MSG_GAME_BUY_ITEM_ACK);
        }

        /**
         * 挂入下级
         */
        private subAgentBtnClick():void{
            let shangji:string = this.vView.inputID.text.trim();
            let xiaji:string = this.vView.inputNum.text.trim();
            if(shangji == ""){
                PromptUtil.show("上级玩家ID不能为空！", PromptType.ERROR);
                return;
            }
            if(xiaji == ""){
                PromptUtil.show("下级玩家ID不能为空！", PromptType.ERROR);
                return;
            }
            let vParams = {itemID:GameConstant.PLAYER_CMD_GUA_XIA_JI, unused_0:parseInt(xiaji), count:parseInt(shangji)};
            ServerUtil.sendMsg(new GameBuyItemMsg(vParams), MsgCmdConstant.MSG_GAME_BUY_ITEM_ACK);
        }

        /**
         * 查询信息
         */
        private searchInfoBtnClick():void{
            let playerID:string = this.vView.inputNum.text.trim();
            if(playerID == ""){
                PromptUtil.show("玩家游戏ID不能为空！", PromptType.ERROR);
                return;
            }
            let vParams = {itemID:GameConstant.PLAYER_CMD_QUERY_INFO,count:parseInt(playerID)};
            ServerUtil.sendMsg(new GameBuyItemMsg(vParams), MsgCmdConstant.MSG_GAME_BUY_ITEM_ACK);
        }
    }
}