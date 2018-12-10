module FL {
    /** 茶楼大堂页面调停者 */
    export class TeaHouseBaseViewMediator extends puremvc.Mediator implements puremvc.IMediator {
        public static readonly NAME: string = "TeaHouseBaseViewMediator";
        private cView: TeaHouseBaseView;
        constructor(pView: TeaHouseBaseView) {
            super(TeaHouseBaseViewMediator.NAME, pView);
            this.registerAllEvent(pView);
        }

        /**
         * 注册所有事件
         */
        private registerAllEvent(pView: TeaHouseBaseView): void {
            let self = this;
            self.cView = pView;
            pView.closeGroup.addEventListener(egret.TouchEvent.TOUCH_TAP, self.closeView, self);
            pView.settingGroup.addEventListener(egret.TouchEvent.TOUCH_TAP, self.showSetting, self);
            pView.shareGroup.addEventListener(egret.TouchEvent.TOUCH_TAP, self.shareAction, self);
            pView.manageGroup.addEventListener(egret.TouchEvent.TOUCH_TAP, self.mgrTeaHouse, self);
            pView.memberGroup.addEventListener(egret.TouchEvent.TOUCH_TAP, self.memTeaHouse, self);
            pView.recordGroup.addEventListener(egret.TouchEvent.TOUCH_TAP, self.logTeaHouse, self);
            pView.layoutGroup.addEventListener(egret.TouchEvent.TOUCH_TAP, self.layTeaHouse, self);
            pView.wanfaGroup.addEventListener(egret.TouchEvent.TOUCH_TAP, self.alterRules, self);
            pView.rightGroup.addEventListener(egret.TouchEvent.TOUCH_TAP, self.nextTable, self);
            pView.leftGroup.addEventListener(egret.TouchEvent.TOUCH_TAP, self.nextTable, self);
            pView.upstairsGroup.addEventListener(egret.TouchEvent.TOUCH_TAP, self.changeFloor, self);
            pView.downstairsGroup.addEventListener(egret.TouchEvent.TOUCH_TAP, self.changeFloor, self);
            pView.quickGro.addEventListener(egret.TouchEvent.TOUCH_TAP, self.quickJoin, self);
        }

        /**
        * 感兴趣的通知指令
        * @returns {Array<any>}
        */
        public listNotificationInterests(): Array<any> {
            return [
                TeaHouseModule.TH_REFRESH_CURRENT_FLOOR,
                TeaHouseModule.TH_UPDATE_THDIAMOND,
                TeaHouseModule.TH_REFRESH_TABLE,
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
                case TeaHouseModule.TH_REFRESH_CURRENT_FLOOR:
                    this.refreshView();
                    break;
                case TeaHouseModule.TH_UPDATE_THDIAMOND:
                    this.getView().updateTHDiamond();
                    break;
                case TeaHouseModule.TH_REFRESH_TABLE:
                    this.refreshTable();
                    break;
                case TeaHouseModule.TH_HANDLE_APPLY_REDPOINT:
                    this.getView().drawRedPoint(data);
                    break;
            }
        }

        private getView(): TeaHouseBaseView {
            return this.cView;
        }

        /** 关闭页面，返回大厅 */
        public closeView() {
            MvcUtil.send(LobbyModule.LOBBY_INTO_LOBBY);
        }

        /** 刷新页面 */
        private refreshView() {
            let currData = [];
            for (let i = TeaHouseData.curMaxTableIndex - 6; i < TeaHouseData.curMaxTableIndex; ++i) {
                // currData.push(TeaHouseData.curTable[i]);
                if (TeaHouseData.curTable[i]) {
                   currData.push(TeaHouseData.curTable[i]);
                } else {
                    let table = <ITHTableItem>{};
                    table.index = i + 1;
                    table.totalNum = TeaHouseData.curPlayerNum;
                    table.infos = TeaHouseHandle.handleTableInfoData(null, i + 1, table.totalNum);
                    table.isBegin = false;
                    currData.push(table);
                }
            }
            this.getView().refreshView(currData);
        }

        /** 刷新当前桌子 */
        private refreshTable() {
            let currData = [];
            for (let i = TeaHouseData.curMaxTableIndex - 6; i < TeaHouseData.curMaxTableIndex; ++i) {
                // currData.push(TeaHouseData.curTable[i]);
                if (TeaHouseData.curTable[i]) {
                   currData.push(TeaHouseData.curTable[i]);
                } else {
                    let table = <ITHTableItem>{};
                    table.index = i + 1;
                    table.totalNum = TeaHouseData.curPlayerNum;
                    table.infos = TeaHouseHandle.handleTableInfoData(null, i + 1, table.totalNum);
                    table.isBegin = false;
                    currData.push(table);
                }
            }
            this.getView().refreshTable(currData);
        }

        /** 茶楼管理 */
        private mgrTeaHouse() {
            if (TeaHouseData.curPower == ETHPlayerPower.ILLEGAL) {
                PromptUtil.show("权限不足", PromptType.ERROR);
                return;
            }
            if (TeaHouseData.curPower == ETHPlayerPower.MEMBER) {
                PromptUtil.show("权限不足，老板专用", PromptType.ERROR);
                return;
            }
            let mgrView = TeaHouseMgrView.getInstance();
            MvcUtil.addView(mgrView);
        }

        /** 茶楼成员 */
        private memTeaHouse() {
            if (TeaHouseData.curPower == ETHPlayerPower.ILLEGAL) {
                PromptUtil.show("权限不足", PromptType.ERROR);
                return;
            }
            if (TeaHouseData.curPower == ETHPlayerPower.MEMBER) {
                PromptUtil.show("权限不足，老板专用", PromptType.ERROR);
                return;
            }
            let memView = TeaHouseMemView.getInstance();
            MvcUtil.addView(memView);
        }

        /** 茶楼战绩 */
        private logTeaHouse() {
            if (TeaHouseData.curPower == ETHPlayerPower.ILLEGAL) {
                PromptUtil.show("权限不足", PromptType.ERROR);
                return;
            }
            let logView = TeaHouseLogView.getInstance();
            MvcUtil.addView(logView);
        }

        /** 茶楼布局 */
        private layTeaHouse() {
            if (TeaHouseData.curPower == ETHPlayerPower.ILLEGAL) {
                PromptUtil.show("权限不足", PromptType.ERROR);
                return;
            }
            let layView = TeaHouseLayoutView.getInstance();
            MvcUtil.addView(layView);
        }

        /** 打开商城 */
        private openMall(e: egret.Event): void {
            egret.localStorage.setItem('mallType', 'diamond');
            let vRefreshItemBaseMsg: RefreshItemBaseMsg = new RefreshItemBaseMsg();
            vRefreshItemBaseMsg.account = LobbyData.playerVO.account;
            ServerUtil.sendMsg(vRefreshItemBaseMsg, MsgCmdConstant.MSG_GAME_REFRESH_ITEM_BASE_ACK);
        }

        /** 添加茶楼钻石 */
        private thAddDiamondBtnClick(e: egret.Event): void {
            MvcUtil.addView(new TeaHouseAddDiamondView());
        }


        /** 修改玩法 */
        private alterRules() {
            // MvcUtil.addView(new TeaHouseAlterRulesView());
            let crv = new LobbyCreateGameView();
            crv.setBottomView(ELobbyCreateType.TeaHouseChange);
            MvcUtil.addView(crv);
            crv.setTeaHouseRule(TeaHouseData.curPlayWay, TeaHouseData.curRuleList);
        }

        /** 
         * 桌子翻页
         */
        private nextTable(e: egret.TouchEvent) {
            //----test
            if (e.currentTarget == this.getView().leftGroup) {
                // this.getView().nextTable(new Array(6), true);
                this.getView().nextTable(TeaHouseHandle.handleNextTableData(true), true);
            } else {
                // this.getView().nextTable(new Array(5), false);
                this.getView().nextTable(TeaHouseHandle.handleNextTableData(false), false);
            }
        }

        /** 改变楼层 */
        private changeFloor(e: egret.TouchEvent) {
            let num;
            if (e.currentTarget == this.getView().upstairsGroup) {
                num = TeaHouseData.curFloor + 1;
                if (!TeaHouseData[EFloorData[num]]) {
                    PromptUtil.show("楼上正在搞装修", PromptType.ALERT);
                    return;
                }
            }
            else {
                num = TeaHouseData.curFloor - 1;
            }
            if (num < 1 || num > 3) {
                return;
            }
            TeaHouseMsgHandle.sendAccessLayerMsg(num, TeaHouseData.curID);
        }

        /**
       * 显示设置界面
       * @param {egret.TouchEvent} e
       */
        private showSetting(e: egret.TouchEvent): void {
            MvcUtil.addView(new SetView());
        }

        /**
        * 点击分享按钮动作
        */
        private shareAction(): void {
            if (TeaHouseData.teaHouseInfo.share) {
                let params = {
                    hasLeftBtn: true,
                    text: "该茶楼设置不允许分享"
                }
                ReminderViewUtil.showReminderView(params);
                return;
            }

            if (Game.CommonUtil.isNative) {
                let shareUrl = NativeBridge.teahouseShareUrl;
                let unionId: string = CommonData.devLoginMsg.qqOpenID;
                let teahouseId: string = TeaHouseData.curID;
                let gameType: string = "lqhn";
                shareUrl = shareUrl + "?" + "clubId=" + teahouseId + "&unionId=" + unionId + "&g=" + gameType;

                let desc: string = "";
                let teahouseName: string = TeaHouseData.teaHouseInfo.name;
                desc += "\""+ teahouseName +"\"茶楼[" + teahouseId + "]邀请你加入一起游戏！点击此信息即可申请加入！";
                // NativeBridge.getInstance().mTestFlag && (desc += "(测试服)");

                if (!(unionId && teahouseId && teahouseName)) {
                    let params = {
                        hasLeftBtn: true,
                        text: "分享信息有误，请稍候再试"
                    }
                    ReminderViewUtil.showReminderView(params);
                }

                let shareData = new nativeShareData();
                shareData.type = ShareWXType.SHARE_URL;
                shareData.url = shareUrl;
                shareData.title = "茶楼加入邀请";
                shareData.desc = desc;
                shareData.extraType = InviteXLType.INVITE_TEAHOUSE;
                shareData.extraContent = teahouseId + "";
                NativeBridge.getInstance().mShareData = shareData;

                MvcUtil.send(CommonModule.COMMON_NATIVE_SHARE_CHOOSE_ROAD, SHARE_CHOOSE_TYPE.SHARE_CHOOSE_NO_FRIEND);
            }
            else {
                MvcUtil.send(CommonModule.COMMON_SHOW_SHARE_REMINDER_VIEW, ShareReminderTypeEnum.FRIENDS);
            }
        }

        private tableState(item: ITHTableItem):number {
            // 无人
            if (!item.totalNum) {
                return 0;
            }

            let haveNum = 0;
            for (let i = 0;i < item.infos.length;i ++) {
                if (item.infos[i].info) {
                    haveNum ++;
                }
            }
            // 有人未满
            if (haveNum < item.totalNum) {
                return item.totalNum - haveNum;
            }
            // 满人
            else if (haveNum >= item.totalNum){
                return 10;
            }
            
            return 0;
        }

        /**
         * 快速加入
         */
        private quickJoin() {
            let tableIndex = 0;

            // 找第一个有人未满且缺人最少的桌子
            let queNum = 4;
            for (let i = 0;i < TeaHouseData.curTable.length;i ++) {
                let item:ITHTableItem = TeaHouseData.curTable[i];
                if (!item) continue;
                let state = this.tableState(item);
                if (state > 0 && state < 10 && state < queNum) {
                    queNum = state;
                    tableIndex = item.index;
                }
            }

            
            if (!tableIndex) {
                // 找第一个无人桌
                for (let i = 0;i < 10000;i ++) {
                    let item:ITHTableItem = TeaHouseData.curTable[i];
                    if (!item) continue;
                    if (this.tableState(item) == 0) {
                        tableIndex = item.index;
                        break;
                    }
                }
            }

            if (!tableIndex) {
                tableIndex = 1;
            }

            let msg = new AccessTeaHouseDeskMsg();
            msg.deskNum = tableIndex;
            msg.tablePos = -1;
            msg.teaHouseId = TeaHouseData.curID;
            msg.teaHouseLayer = TeaHouseData.curFloor;
            console.log("QUICKMSG==",msg);
            ServerUtil.sendMsg(msg);
        }
    }
}