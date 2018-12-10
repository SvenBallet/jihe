module FL {
    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase - LobbyLeftTopViewMediator
     * @Description:  //调停者
     * @Create: DerekWu on 2017/11/11 15:57
     * @Version: V1.0
     */
    export class LobbyLeftTopViewMediator extends puremvc.Mediator implements puremvc.IMediator {

        public static readonly NAME:string = "LobbyLeftTopViewMediator";

        constructor (pView:LobbyLeftTopView) {
            super(LobbyLeftTopViewMediator.NAME, pView);
            let self = this;
            pView.addGoldGroup.addEventListener(egret.TouchEvent.TOUCH_TAP, self.addGoldBtnClick, self);
            pView.addDiamondGroup.addEventListener(egret.TouchEvent.TOUCH_TAP, self.addDiamondBtnClick, self);
            pView.avatarGroup.addEventListener(egret.TouchEvent.TOUCH_TAP, self.addAvatarBtnClick, self);
        }

        private addGoldBtnClick(e:egret.Event):void {
            egret.localStorage.setItem('mallType','gold');
            let vRefreshItemBaseMsg:RefreshItemBaseMsg  = new RefreshItemBaseMsg();
            vRefreshItemBaseMsg.account = LobbyData.playerVO.account;
            ServerUtil.sendMsg(vRefreshItemBaseMsg, MsgCmdConstant.MSG_GAME_REFRESH_ITEM_BASE_ACK);
        }

        private addDiamondBtnClick(e:egret.Event):void {
            egret.localStorage.setItem('mallType','diamond');
            let vRefreshItemBaseMsg:RefreshItemBaseMsg  = new RefreshItemBaseMsg();
            vRefreshItemBaseMsg.account = LobbyData.playerVO.account;
            ServerUtil.sendMsg(vRefreshItemBaseMsg, MsgCmdConstant.MSG_GAME_REFRESH_ITEM_BASE_ACK);
        }

        private addAvatarBtnClick(e:egret.Event):void {
            //基础界面
            let vAgentBaseView:AgentBaseView = new AgentBaseView();
            //添加界面
            MvcUtil.addView(vAgentBaseView);
            ServerUtil.sendMsg(new GameBuyItemMsg({itemID:GameConstant.SEND_PLAYER_CMD_GET_MY_PAY_BACK}));
            ServerUtil.sendMsg(new GameBuyItemMsg({itemID:GameConstant.AGENT_CMD_GET_FANGLIST}), MsgCmdConstant.MSG_AGENT_DAIKAI_ACK);
        }

        private getView(){
            return <LobbyLeftTopView>this.viewComponent;
        }

        /**
         * 感兴趣的通知指令
         * @returns {Array<any>}
         */
        public listNotificationInterests(): Array<any> {
            return [
                LobbyModule.LOBBY_BIND_CODE
            ];
        }

        /**
         * 处理通知
         * @param {puremvc.INotification} pNotification
         */
        public handleNotification(pNotification: puremvc.INotification): void {
            let data: any = pNotification.getBody();
            switch (pNotification.getName()) {
                case LobbyModule.LOBBY_BIND_CODE: {
                    this.bideCode();
                    break;
                }
            }
        }

        /**
         * 绑定邀请码
         */
        public bideCode():void{
            let self = this;
            self.getView().codeInput = new NumberInput();
            self.getView().codeInput.titleLabelText = "输入邀请码";
            self.getView().codeInput.confirmBtnText = "绑定";
            let vNumberInputAreaView:NumberInputAreaView = new NumberInputAreaView(self.getView().codeInput,999999,100000,new MyCallBack(self.confirmInput,self));
            MvcUtil.addView(vNumberInputAreaView);
        }

        /**
         * 确认输入邀请码
         */
        private confirmInput():void{
            let params = {opType:0,inviteCode:this.getView().codeInput.text};
            Storage.setItem("MallSetInviteCode","2");
            MvcUtil.send(AgentModule.AGENT_SEND_BIND_CODE,params);
        }


    }
}