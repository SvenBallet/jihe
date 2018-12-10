module FL {
    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase - LobbyRightTopViewMediator
     * @Description:  //调停者
     * @Create: DerekWu on 2017/11/11 13:52
     * @Version: V1.0
     */
    export class LobbyRightTopViewMediator extends puremvc.Mediator implements puremvc.IMediator {

        public static readonly NAME: string = "LobbyRightTopViewMediator";
        private pView: LobbyRightTopView;

        constructor(pView: LobbyRightTopView) {
            super(LobbyRightTopViewMediator.NAME, pView);
            let self = this;
            self.pView = pView;
            pView.settingGroup.addEventListener(egret.TouchEvent.TOUCH_TAP, self.showSetting, self);
            pView.helpGroup.addEventListener(egret.TouchEvent.TOUCH_TAP, self.showHelpView, self);

            // (H5版本禁用分享到朋友圈)
            // pView.freeDiamondGroup.addEventListener(egret.TouchEvent.TOUCH_TAP, self.showFreeDiamondView, self);
        }

        /**
         * 显示设置界面
         * @param {egret.TouchEvent} e
         */
        private showSetting(e: egret.TouchEvent): void {
            MvcUtil.addView(new SetView());
        }

        /**
         * 显示玩法介绍界面
         */
        private showHelpView() {
            // 设置按钮点击间隔
            this.pView.helpGroup.touchEnabled = false;
            setTimeout(()=>{
                this.pView.helpGroup.touchEnabled = true;
            }, 3000);
            MvcUtil.addView(new HelpView());
        }

        /**
         * 显示活动界面
         * */
        private showFreeDiamondView() {
            // MvcUtil.send(LobbyModule.LOBBY_SHOW_FREE_DIAMOND_VIEW);
        }

    }
}