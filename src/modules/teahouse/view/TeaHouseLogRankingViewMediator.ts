module FL {
    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase - TeaHouseLogRankingViewMediator
     * @Description:  //
     * @Create: DerekWu on 2018/9/13 16:03
     * @Version: V1.0
     */
    export class TeaHouseLogRankingViewMediator extends puremvc.Mediator implements puremvc.IMediator {

        public static readonly NAME: string = "TeaHouseLogRankingViewMediator";

        constructor(pView: TeaHouseLogRankingView) {
            super(TeaHouseLogRankingViewMediator.NAME, pView);
            this.registerAllEvent(pView);
        }

        /**
         * 注册所有事件
         */
        private registerAllEvent(pView: TeaHouseLogRankingView): void {
            let self = this;
            // 选择标签
            pView.todayTapGroup.addEventListener(egret.TouchEvent.TOUCH_TAP, self.selectTodayTab, self);
            pView.yesterdayTapGroup.addEventListener(egret.TouchEvent.TOUCH_TAP, self.selectYesterdayTab, self);
            pView.thisWeekTapGroup.addEventListener(egret.TouchEvent.TOUCH_TAP, self.selectThisWeekTab, self);
            pView.lastWeekTapGroup.addEventListener(egret.TouchEvent.TOUCH_TAP, self.selectLastWeekTab, self);
            pView.thisMonthTapGroup.addEventListener(egret.TouchEvent.TOUCH_TAP, self.selectThisMonthTab, self);
            // 分页按钮
            pView.leftGroup.addEventListener(egret.TouchEvent.TOUCH_TAP, self.pageUp, self);
            pView.rightGroup.addEventListener(egret.TouchEvent.TOUCH_TAP, self.pageDown, self);

            // 默认查询今天
            this.processSelectTab(0, true);
        }

        /**
         * 感兴趣的通知指令
         * @returns {Array<any>}
         */
        public listNotificationInterests(): Array<any> {
            return [
                TeaHouseModule.TH_SHOW_TEA_HOUSE_RANK_LIST,
            ];
        }

        /**
         * 处理通知
         * @param {puremvc.INotification} pNotification
         */
        public handleNotification(pNotification: puremvc.INotification): void {
            let data: any = pNotification.getBody();
            switch (pNotification.getName()) {
                case TeaHouseModule.TH_SHOW_TEA_HOUSE_RANK_LIST:
                    this.processRankListMsgAck(data);
                    break;
            }
        }

        private selectTodayTab(): void {
            this.processSelectTab(0);
        }
        private selectYesterdayTab(): void {
            this.processSelectTab(1);
        }
        private selectThisWeekTab(): void {
            this.processSelectTab(2);
        }
        private selectLastWeekTab(): void {
            this.processSelectTab(3);
        }
        private selectThisMonthTab(): void {
            this.processSelectTab(4);
        }

        private processSelectTab(pTabId: number, pIsFromInit: boolean = false): void {
            let vView: TeaHouseLogRankingView = this.viewComponent;
            if (vView.getSelectTabId() === pTabId && !pIsFromInit) return;
            vView.noRankingDataLabel.visible = false;
            let vTeaHouse: TeaHouse = TeaHouseData.teaHouse;
            if (vTeaHouse) {
                let vShowTeaHouseRankListMsg: ShowTeaHouseRankListMsg = new ShowTeaHouseRankListMsg();
                vShowTeaHouseRankListMsg.teaHouseId = vTeaHouse.teaHouseId;
                vShowTeaHouseRankListMsg.operationType = pTabId;
                vShowTeaHouseRankListMsg.page = 1;
                ServerUtil.sendMsg(vShowTeaHouseRankListMsg, MsgCmdConstant.MSG_SHOW_TEAHOUSE_RANKLIST_ACK);
            }
        }

        private processPaging(pageNum: number): void {
            let vView: TeaHouseLogRankingView = this.viewComponent;
            let vTeaHouse: TeaHouse = TeaHouseData.teaHouse;
            if (vTeaHouse) {
                let vShowTeaHouseRankListMsg: ShowTeaHouseRankListMsg = new ShowTeaHouseRankListMsg();
                vShowTeaHouseRankListMsg.teaHouseId = vTeaHouse.teaHouseId;
                vShowTeaHouseRankListMsg.operationType = vView.getSelectTabId();
                vShowTeaHouseRankListMsg.page = pageNum;
                ServerUtil.sendMsg(vShowTeaHouseRankListMsg, MsgCmdConstant.MSG_SHOW_TEAHOUSE_RANKLIST_ACK);
            }
        }

        private pageUp(): void {
            let self = this;
            if (self.lastMsgAck && self.lastMsgAck.page > 1) {
                self.processPaging(self.lastMsgAck.page - 1);
            }
        }

        private pageDown(): void {
            let self = this;
            if (self.lastMsgAck && self.lastMsgAck.rankList && self.lastMsgAck.rankList.length >= 50) { // 50一分页
                self.processPaging(self.lastMsgAck.page + 1);
            }
        }

        /** 最后列表消息 */
        private lastMsgAck: ShowTeaHouseRankListMsgAck;

        private processRankListMsgAck(msg: ShowTeaHouseRankListMsgAck): void {
            this.lastMsgAck = msg;
            let vView: TeaHouseLogRankingView = this.viewComponent;
            vView.selectTab(msg.operationType); // 设置为当前页
            if (msg.page > 1) {
                vView.paginationGroup.visible = true;
            } else {
                vView.paginationGroup.visible = false;
            }
            vView.pageLab.text = "第" + msg.page + "页";
            if (msg.rankList && msg.rankList.length > 0) {
                vView.noRankingDataLabel.visible = false;
                vView.paginationGroup.visible = true;
                if (msg.playerType === 1 || msg.playerType === 2) {
                    vView.consumeDiamondNum.text = "钻石消耗量:" + msg.sumExpendDiamondNum;
                    vView.changCiHeJiLabel.text = "场次合计:" + msg.sumPlayNum;
                } else {
                    vView.consumeDiamondNum.text = "";
                    vView.changCiHeJiLabel.text = "";
                }
            } else {
                vView.resetNoRankingDataLabel(msg.page);
                vView.noRankingDataLabel.visible = true;
                vView.consumeDiamondNum.text = "";
                vView.changCiHeJiLabel.text = "";
            }

            // 设置列表数据
            vView.refreshView(msg.rankList);
        }

    }
}