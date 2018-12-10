module FL {
    export class TeaHouseAlterRulesViewMediator extends puremvc.Mediator implements puremvc.IMediator {
        public static readonly NAME: string = "TeaHouseAlterRulesViewMediator";
        constructor(pView: TeaHouseAlterRulesView) {
            super(TeaHouseAlterRulesViewMediator.NAME, pView);
            this.registerAllEvent(pView);
        }

        /**
         * 注册所有事件
         */
        private registerAllEvent(pView: TeaHouseAlterRulesView): void {
            let self = this;
            pView.closeGroup.addEventListener(egret.TouchEvent.TOUCH_TAP, self.closeView, self);
            pView.alterBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, self.confirmAlter, self);
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

        private getView(): TeaHouseAlterRulesView {
            return this.getViewComponent();
        }

        /**
         * 确认修改
         */
        private confirmAlter() {
            if (TeaHouseData.curPower === ETHPlayerPower.ILLEGAL) {//非法值没有权限
                PromptUtil.show("无权限", PromptType.ERROR);
                return;
            }
            if (TeaHouseData.curPower === ETHPlayerPower.MEMBER) {
                PromptUtil.show("无权限", PromptType.ERROR);
                return;
            }
            let msg = new ChangeTeaHouseLayerRuleMsg();
            this.getView().contentView.addMinorGamePlayRule(msg.playWay); // 子玩法
            msg.maxPlayersNum = this.getView().topView.personNumGroup.selectedValue;
            msg.totalPlayCount = this.getView().topView.gameGroup.selectedValue;
            msg.teaHouseId = TeaHouseData.curID;
            msg.teaHouseLayer = this.getView().flag_floor;
            // 临时处理十五张跑得快
            let floorData: TeaHouseLayer = TeaHouseData[EFloorData[msg.teaHouseLayer]];
            if (floorData && floorData.teahouseLayerName === "十五张玩法") {
                msg.playWay.push(ECardGameType.SHI_WU_ZHANG);
            }
            console.log(msg);
            ServerUtil.sendMsg(msg, MsgCmdConstant.MSG_GET_TEAHOUSE_LAYER_LIST_ACK);
        }

        /** 刷新页面 */
        private refreshView() {
            this.getView().initView();
        }

        /** 关闭页面 */
        private closeView() {
            MvcUtil.delView(this.getView());
        }
    }
}