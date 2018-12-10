module FL {
    /** 茶楼成员页面调停者 */
    export class TeaHouseMemViewMediator extends puremvc.Mediator implements puremvc.IMediator {
        public static readonly NAME: string = "TeaHouseMemViewMediator";

        constructor(pView: TeaHouseMemView) {
            super(TeaHouseMemViewMediator.NAME, pView);
            this.registerAllEvent(pView);
        }

        /**
         * 注册所有事件
         */
        private registerAllEvent(pView: TeaHouseMemView): void {
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
                TeaHouseModule.TH_SHOW_MEM_LIST,
                TeaHouseModule.TH_SHOW_MEM_APPLY,
                TeaHouseModule.TH_SHOW_MEM_WAITER,
                TeaHouseModule.TH_GET_MEM_LIST,
                TeaHouseModule.TH_GET_MEM_APPLY,
                TeaHouseModule.TH_HANDLE_APPLY_REDPOINT
            ];
        }

        /**
       * 处理通知
       * @param {puremvc.INotification} pNotification
       */
        public handleNotification(pNotification: puremvc.INotification): void {
            let data: any = pNotification.getBody();
            switch (pNotification.getName()) {
                case TeaHouseModule.TH_SHOW_MEM_LIST:
                    this.showMemList(data);
                    break;
                case TeaHouseModule.TH_SHOW_MEM_APPLY:
                    this.showApplyList(data);
                    break;
                case TeaHouseModule.TH_SHOW_MEM_WAITER:
                    this.showWaiterList();
                    break;
                case TeaHouseModule.TH_GET_MEM_LIST:
                    this.getMemList();
                    break;
                case TeaHouseModule.TH_GET_MEM_APPLY:
                    this.getApplyList();
                    break;

                case TeaHouseModule.TH_HANDLE_APPLY_REDPOINT:
                    this.getView().drawRedPoint(data)
                    break;
            }
        }

        private getView(): TeaHouseMemView {
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

        /** 刷新页面 */
        private refreshView() {
            this.getView().loadContent();
        }

        /** 获取成员列表 */
        private getMemList() {
            let vgc = this.getViewGroupChild();
            let page = 1;
            if (vgc && vgc.getCurPage) page = vgc.getCurPage();
            TeaHouseMsgHandle.sendShowMemListMsg(page);
        }

        /** 显示成员列表 */
        private showMemList(msg: ShowTeaHouseMemberListMsgAck) {
            if (this.getView().btnList.selectedItem != "成员列表") return;
            let vgc = this.getViewGroupChild();
            vgc.flag_totalPage = msg.totalPage || 1;
            let memData = TeaHouseHandle.handleMemListData(TeaHouseData.teaHouseMemList, ETHItemInvokedView.THMemListView);
            if (vgc && vgc.refreshView) {
                vgc.refreshView(memData);
                vgc.showOnline(msg.teaHouseAllMemberNum, msg.teaHouseOnLineMemberNum);
            }
        }

        /** 获取申请成员列表 */
        private getApplyList() {
            let vgc = this.getViewGroupChild();
            let page = 1;
            if (vgc && vgc.getCurPage) page = vgc.getCurPage();
            TeaHouseMsgHandle.sendShowApplyListMsg(page);
        }

        /** 显示申请成员列表 */
        private showApplyList(totalPage: number = 1) {
            if (this.getView().btnList.selectedItem != "审核成员") return;
            let vgc = this.getViewGroupChild();
            vgc.flag_totalPage = totalPage;
            let applyData = TeaHouseData.teaHouseApplyList;
            if (vgc && vgc.refreshView) vgc.refreshView(applyData);
        }

        /** 顯示小二列表 */
        private showWaiterList() {
            if (this.getView().btnList.selectedItem != "小二管理") return;
            let vgc = this.getViewGroupChild();
            let waiterData = TeaHouseHandle.handleMemListData(TeaHouseData.teaHouseMemList, ETHItemInvokedView.THMemWaiterView);
            if (vgc && vgc.refreshView) vgc.refreshView(waiterData);
        }

        /** 关闭页面 */
        private closeView() {
            MvcUtil.delView(this.getView());
        }
    }
}