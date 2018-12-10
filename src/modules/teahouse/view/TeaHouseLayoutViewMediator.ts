module FL {
    export class TeaHouseLayoutViewMediator extends puremvc.Mediator implements puremvc.IMediator {
        public static readonly NAME: string = "TeaHouseLayoutViewMediator";

        constructor(pView: TeaHouseLayoutView) {
            super(TeaHouseLayoutViewMediator.NAME, pView);
            this.registerAllEvent(pView);
        }

        /**
         * 注册所有事件
         */
        private registerAllEvent(pView: TeaHouseLayoutView): void {
            let self = this;
            pView.closeGroup.addEventListener(egret.TouchEvent.TOUCH_TAP, self.closeView, self);
            pView.exitGroup.addEventListener(egret.TouchEvent.TOUCH_TAP, self.exitTeaHouse, self);
            pView.joinBtnGroup1.addEventListener(egret.TouchEvent.TOUCH_TAP, self.joinFloor, self);
            pView.joinBtnGroup2.addEventListener(egret.TouchEvent.TOUCH_TAP, self.joinFloor, self);
            pView.joinBtnGroup3.addEventListener(egret.TouchEvent.TOUCH_TAP, self.joinFloor, self);

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
            switch (pNotification.getName()) {


            }
        }

        private getView(): TeaHouseLayoutView {
            return this.getViewComponent();
        }

        /** 刷新页面 */
        private refreshView() {
            this.getView().initView();
        }

        /**
         * 退出茶楼
         */
        private exitTeaHouse() {
            ReminderViewUtil.showReminderView({
                hasLeftBtn: true,
                leftCallBack: new MyCallBack(this.sureExit, this),
                hasRightBtn: true,
                text: "您确定退出茶楼吗？"
            })
        }

        /** 进入楼层 */
        private joinFloor(e: egret.TouchEvent) {
            let num;
            if (e.currentTarget == this.getView().joinBtnGroup1) {
                num = 1;
            } else if (e.currentTarget == this.getView().joinBtnGroup2) {
                num = 2;
            } else {
                num = 3;
            }
            TeaHouseMsgHandle.sendAccessLayerMsg(num, TeaHouseData.curID);
        }

        /**
         * 确定退出
         */
        private sureExit() {
            let playerVO: PlayerVO = LobbyData.playerVO;
            let msg = new ExitTeaHouseMsg();
            msg.teaHouseId = TeaHouseData.curID;
            msg.playerIndex = playerVO.playerIndex;
            ServerUtil.sendMsg(msg, MsgCmdConstant.MSG_EXIT_TEAHOUSE_ACK);
        }

        /** 关闭页面 */
        private closeView() {
            MvcUtil.delView(this.getView());
        }
    }
}