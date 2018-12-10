module FL {
    export class MallBaseViewMediator extends puremvc.Mediator implements puremvc.IMediator {

        public static readonly NAME:string = "MallBaseViewMediator";

        public vItem:MallBaseView = <MallBaseView>super.getViewComponent();

        public itemList = this.vItem.msg['baseItemList'];


        constructor (pView:MallBaseView) {
            super(MallBaseViewMediator.NAME, pView);
            let self = this;
            pView.closeBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, self.closeView, self);
            pView.goldGroup.addEventListener(egret.TouchEvent.TOUCH_TAP, self.goldView, self);
            pView.diamondGroup.addEventListener(egret.TouchEvent.TOUCH_TAP, self.diamondView, self);
            pView.getRebateBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, self.rebateMgr, self);
        }

        private closeView():void {
            MvcUtil.delView(this.viewComponent);
        }

        //金币商城
        private goldView(e:egret.Event):void{
            this.vItem.itemsGroup.removeChildren();
            this.vItem.addItemList(this.itemList,2);
        }

        //钻石商城
        private diamondView(e:egret.Event):void {
            this.vItem.itemsGroup.removeChildren();
            this.vItem.addItemList(this.itemList,1);
        }

        /**
         * 获取返利
         */
        public rebateMgr():void{
            let self = this;
            if(self.vItem.agentLevel === 22 || self.vItem.agentLevel === 21 || self.vItem.agentLevel === 20 || LobbyData.playerVO.parentIndex){
                MvcUtil.send(AgentModule.AGENT_GET_MGR_SYSTEM_TICKET);
            }else{
                self.vItem.codeInput = new NumberInput();
                self.vItem.codeInput.titleLabelText = "输入邀请码";
                self.vItem.codeInput.confirmBtnText = "绑定";
                let vNumberInputAreaView:NumberInputAreaView = new NumberInputAreaView(self.vItem.codeInput,999999,100000,new MyCallBack(self.confirmInput,self));
                MvcUtil.addView(vNumberInputAreaView);
            }

        }

        /**
         * 确认输入邀请码
         */
        private confirmInput():void{
            let params = {opType:0,inviteCode:this.vItem.codeInput.text};
            Storage.setItem("MallSetInviteCode","1");
            MvcUtil.send(AgentModule.AGENT_SEND_BIND_CODE,params);
            this.closeView();
        }

    }
}