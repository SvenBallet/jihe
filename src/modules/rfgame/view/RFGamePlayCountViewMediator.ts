module FL {
    export class RFGamePlayCountViewMediator extends puremvc.Mediator implements puremvc.IMediator {
        public static readonly NAME: string = "RFGamePlayCountViewMediator";

        private cView: RFGamePlayCountView;
        constructor(pView: RFGamePlayCountView) {
            super(RFGamePlayCountViewMediator.NAME, pView);
            this.cView = pView;
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

        /**
         * 开始游戏
         */
        public startGame() {
            this.cView.startGame();
        }

    }
}