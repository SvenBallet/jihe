module FL {
    /** 茶楼管理页面调停者 */
    export class TeaHouseInviteViewMediator extends puremvc.Mediator implements puremvc.IMediator {
        public static readonly NAME: string = "TeaHouseInviteViewMediator";

        constructor(pView: TeaHouseInviteView) {
            super(TeaHouseInviteViewMediator.NAME, pView);
            this.registerAllEvent(pView);
        }

        /**
         * 注册所有事件
         */
        private registerAllEvent(pView: TeaHouseInviteView): void {
            let self = this;
            //监听触摸事件
            pView.closeGroup.addEventListener(egret.TouchEvent.TOUCH_TAP, self.delView, self);
            pView.inviteBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, self.inviteClick, self);
        }

        /**
        * 感兴趣的通知指令
        * @returns {Array<any>}
        */
        public listNotificationInterests(): Array<any> {
            return [
            ];
        }

        /**
       * 处理通知
       * @param {puremvc.INotification} pNotification
       */
        public handleNotification(pNotification: puremvc.INotification): void {
            let data: any = pNotification.getBody();
        }

        private getView(): TeaHouseInviteView {
            return this.getViewComponent();
        }

        /** 关闭页面 */
        public delView() {
            MvcUtil.delView(this.getView());
        }

        /** 邀请 */
        private inviteClick() {
            this.getView().refreshInviteBtn(true);

            let msg: InviteToJoinGameMsg = new InviteToJoinGameMsg();
            msg.teaHouseId = TeaHouseInviteView.teahouseId;
            let vipRoomID = (<NewIntoGameTableMsgAck>GameConstant.CURRENT_HANDLE.getRequestStartGameMsgAck()).vipRoomID;
            if (!vipRoomID) return;
            msg.roomId = vipRoomID;
            msg.operationType = 1;
            ServerUtil.sendMsg(msg, MsgCmdConstant.MSG_INVITE_TO_JOIN_GAME_ACK);
        }
    }
}