module FL {
    export class TeaHouseMemAddWaiterViewMediator extends puremvc.Mediator implements puremvc.IMediator {
        public static readonly NAME: string = "TeaHouseMemAddWaiterViewMediator";
        constructor(pView: TeaHouseMemAddWaiterView) {
            super(TeaHouseMemAddWaiterViewMediator.NAME, pView);
            this.registerAllEvent(pView);
        }

        /**
         * 注册所有事件
         */
        private registerAllEvent(pView: TeaHouseMemAddWaiterView): void {
            let self = this;
        }

        /**
        * 感兴趣的通知指令
        * @returns {Array<any>}
        */
        public listNotificationInterests(): Array<any> {
            return [
                TeaHouseModule.TH_SHOW_MEM_WAITER,
            ];
        }

        /**
         * 处理通知
         * @param {puremvc.INotification} pNotification
         */
        public handleNotification(pNotification: puremvc.INotification): void {
            let data: any = pNotification.getBody();
            switch (pNotification.getName()) {
                case TeaHouseModule.TH_SHOW_MEM_WAITER:
                    this.getView().refreshView(TeaHouseHandle.handleMemListData(TeaHouseData.teaHouseWaiterList, ETHItemInvokedView.THMemAddWaiterView));
                    break;
            }
        }

        private getView(): TeaHouseMemAddWaiterView {
            return this.getViewComponent();
        }
    }
}