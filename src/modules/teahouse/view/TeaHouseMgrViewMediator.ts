module FL {
    /** 茶楼管理页面调停者 */
    export class TeaHouseMgrViewMediator extends puremvc.Mediator implements puremvc.IMediator {
        public static readonly NAME: string = "TeaHouseMgrViewMediator";

        constructor(pView: TeaHouseMgrView) {
            super(TeaHouseMgrViewMediator.NAME, pView);
            this.registerAllEvent(pView);
        }

        /**
         * 注册所有事件
         */
        private registerAllEvent(pView: TeaHouseMgrView): void {
            let self = this;
            pView.closeGroup.addEventListener(egret.TouchEvent.TOUCH_TAP, self.closeView, self);
            pView.btnList.addEventListener(eui.ItemTapEvent.ITEM_TAP, self.choseItem, self);
        }

        /**
        * 感兴趣的通知指令
        * @returns {Array<any>}
        */
        public listNotificationInterests(): Array<any> {
            return [
                TeaHouseModule.TH_REFRESH_MGR,
                TeaHouseModule.TH_REFRESH_CURRENT_FLOOR,
                TeaHouseModule.TH_UPDATE_STATE,
                TeaHouseModule.TH_REFRESH_RUNSTATE,
            ];
        }

        /**
       * 处理通知
       * @param {puremvc.INotification} pNotification
       */
        public handleNotification(pNotification: puremvc.INotification): void {
            let data: any = pNotification.getBody();
            switch (pNotification.getName()) {
                case TeaHouseModule.TH_REFRESH_MGR:
                    this.refreshView();
                    break;
                case TeaHouseModule.TH_REFRESH_CURRENT_FLOOR:
                    this.refreshView();
                    break;
                case TeaHouseModule.TH_UPDATE_STATE:
                    // this.refreshView();
                    this.closeView();
                    break;
                case TeaHouseModule.TH_REFRESH_RUNSTATE:
                    this.refreshRunstate();
                    break;
            }
        }

        private getView(): TeaHouseMgrView {
            return this.getViewComponent();
        }

        /** 获取右侧显示页面组子类 */
        private getViewGroupChild(): any {
            let vg = this.getView().viewGroup;
            return vg.getChildAt(vg.numChildren - 1);
        }

        /** 选择左侧按钮项 */
        private choseItem() {
            if (this.getView().btnList.selectedItem == this.getView().flag_preSelected) return;//点击同一个按钮
            this.getView().refreshBtnState();
            this.getView().loadContent();
        }

        /** 刷新经营状况 */
        private refreshRunstate() {
            let vgc = this.getViewGroupChild();
            let rsData = TeaHouseHandle.handleRunstateListData(TeaHouseData.teaHousePerformanceList);
            if (vgc && vgc.refreshView) vgc.refreshView(rsData);
        }

        /** 刷新页面 */
        private refreshView() {
            this.getView().loadContent();
        }

        /** 关闭页面 */
        private closeView() {
            MvcUtil.delView(this.getView());
        }
    }
}