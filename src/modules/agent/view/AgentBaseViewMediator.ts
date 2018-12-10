module FL {
    export class AgentBaseViewMediator extends puremvc.Mediator implements puremvc.IMediator {

        public static readonly NAME:string = "AgentBaseViewMediator";

        public vItem:AgentBaseView = <AgentBaseView>this.viewComponent;

        constructor (pView:AgentBaseView) {
            super(AgentBaseViewMediator.NAME, pView);
            let self = this;
            pView.closeGroup.addEventListener(egret.TouchEvent.TOUCH_TAP, self.closeView, self);
            pView.btnList.addEventListener(eui.ItemTapEvent.ITEM_TAP,this.onChooseItem,this);
        }

        private closeView(e:egret.Event):void {
            MvcUtil.send(LobbyModule.LOBBY_INTO_LOBBY);
        }

        private onChooseItem(e:eui.PropertyEvent):void {
            let index =  this.vItem.btnList.selectedItem;
            // 点击当前页不重复处理
            if (this.vItem.currentItemIndex && this.vItem.currentItemIndex == index) {
                return;
            }
            this.vItem.loadContentPage(index);
        }

        /**
         * 感兴趣的通知指令
         * @returns {Array<any>}
         */
        public listNotificationInterests(): Array<any> {
            return [
                AgentModule.AGENT_AUTH_PLAYER_GET_ROOM_LIST,
                AgentModule.AGENT_GET_AGENT_INFO,
                AgentModule.AGENT_UPDATE_AGENT_INFO
            ];
        }

        /**
         * 处理通知
         * @param {puremvc.INotification} pNotification
         */
        public handleNotification(pNotification: puremvc.INotification): void {
            let data: any = pNotification.getBody();
            switch (pNotification.getName()) {
                case AgentModule.AGENT_AUTH_PLAYER_GET_ROOM_LIST: {
                    let vAgentAuthPlayerRoomListView:AgentAuthPlayerRoomListView = AgentAuthPlayerRoomListView.getInstance();
                    this.vItem.contentGroup.removeChildren();
                    this.vItem.contentGroup.addChild(vAgentAuthPlayerRoomListView);
                    vAgentAuthPlayerRoomListView.initList(data);
                    break;
                }
                case AgentModule.AGENT_GET_AGENT_INFO:{
                    let vRequestAgentInfo:RequestAgentInfo  = new RequestAgentInfo();
                    ServerUtil.sendMsg(vRequestAgentInfo, MsgCmdConstant.MSG_AGENT_INFO_ACK);
                    break;
                }
                case AgentModule.AGENT_UPDATE_AGENT_INFO: {
                    this.vItem.vMyProfileView.setValues(data);
                    break;
                }
            }
        }


    }
}