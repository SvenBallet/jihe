module FL {
    /** 茶楼管理页面调停者 */
    export class TeaHouseTableDetailViewMediator extends puremvc.Mediator implements puremvc.IMediator {
        public static readonly NAME: string = "TeaHouseTableDetailViewMediator";

        constructor(pView: TeaHouseTableDetailView) {
            super(TeaHouseTableDetailViewMediator.NAME, pView);
            this.registerAllEvent(pView);
        }

        /**
         * 注册所有事件
         */
        private registerAllEvent(pView: TeaHouseTableDetailView): void {
            let self = this;
            //监听触摸事件
            pView.closeGroup.addEventListener(egret.TouchEvent.TOUCH_TAP, self.delView, self);
            pView.dissBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, self.dissTable, self);
            pView.joinBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, self.join, self);
            pView.inviteBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, self.invite, self);
        }

        /**
        * 感兴趣的通知指令
        * @returns {Array<any>}
        */
        public listNotificationInterests(): Array<any> {
            return [
                TeaHouseModule.TH_DETAIL_REMOVE_PLAYER,
                TeaHouseModule.TH_REFRESH_TABLE,
            ];
        }

        /**
       * 处理通知
       * @param {puremvc.INotification} pNotification
       */
        public handleNotification(pNotification: puremvc.INotification): void {
            let data: any = pNotification.getBody();
            switch (pNotification.getName()) {
                case TeaHouseModule.TH_DETAIL_REMOVE_PLAYER:
                    this.removePlayer(data);
                    break;
                case TeaHouseModule.TH_REFRESH_TABLE:
                    this.reDetailView();
                    break;
            }
        }

        private reDetailView() {
            this.delView();

            let tableData:ITHTableItem;
            for (let i = 0;i < TeaHouseData.curTable.length;i ++) {
                if (TeaHouseData.curTable[i].index == this.getView().flag_index) {
                    tableData = TeaHouseData.curTable[i];
                    break;
                }
            }
            if (!tableData || !tableData.infos || tableData.infos.length < 1) return;

            // 桌子没人的判断，没人则不再弹出
            let flag = true;
            for (let i = 0;i < tableData.infos.length;i ++) {
                if (tableData.infos[i].info) {
                    flag = false;
                    break;
                }
            }
            if (flag) {
                let tbd: TeaHouseTableDetailView = new TeaHouseTableDetailView();
                MvcUtil.addView(tbd);
                MvcUtil.delView(tbd);
                return
            }
            
            let tbd: TeaHouseTableDetailView = new TeaHouseTableDetailView();
            let infos = tableData.infos.filter(x => x) || [];
            tbd.initView(infos, tableData.index, tableData);
            MvcUtil.addView(tbd);
        }

        private getView(): TeaHouseTableDetailView {
            return this.getViewComponent();
        }

        /** 关闭页面 */
        public delView() {
            MvcUtil.delView(this.getView());
        }

        /** 移出玩家 */
        private removePlayer(playerIndex: number) {
            let info = (<TeaHouseTableDetailView>this.getView()).curTableInfo;
            let msg: TeaHouseRemoveTablePlayerMsg = new TeaHouseRemoveTablePlayerMsg();
            msg.teaHouseId = TeaHouseData.curID;
            msg.teaHouseLayer = TeaHouseData.curFloor;
            msg.vipRoomId =  info.id;
            msg.targetPlayerIndex = playerIndex;

            ServerUtil.sendMsg(msg, MsgCmdConstant.MSG_TEAHOUSE_REMOVE_PLAYER);
        }

        /**
      * 解散桌子
      */
        public dissTable() {
            if (TeaHouseData.curPower === ETHPlayerPower.MEMBER || TeaHouseData.curPower === ETHPlayerPower.ILLEGAL) {
                PromptUtil.show("无权限", PromptType.ERROR);
                return;
            }
            ReminderViewUtil.showReminderView({
                hasLeftBtn: true,
                leftCallBack: new MyCallBack(this.confirmDiss, this),
                hasRightBtn: true,
                text: "您确定要解散该牌桌吗？"
            })

        }

        /**
         * 加入
         */
        private join() {
            if (TeaHouseData.isOff) {
                PromptUtil.show("暂停营业中", PromptType.ERROR);
                return;
            }
            else {
                let msg = new AccessTeaHouseDeskMsg();
                msg.deskNum = this.getView().flag_index;
                // 选择位置，-1则为默认位置
                msg.tablePos = -1;
                msg.teaHouseId = TeaHouseData.curID;
                msg.teaHouseLayer = TeaHouseData.curFloor;
                ServerUtil.sendMsg(msg);
            }
        }

        /**
         * 邀请
         */
        private invite() {
            if (Game.CommonUtil.isNative) {
                let cView: TeaHouseTableDetailView = this.getView();
                let shareData = new nativeShareData();
                shareData.type = ShareWXType.SHARE_URL;

                let roomId = cView.curTableInfo.id;
                // 分享魔窗链接
                shareData.url = NativeBridge.mMWshareUrl + "?roomid=" + roomId;
                let numStr: Array<string> = ["零", "一", "二", "三", "四"];
                let maxPlayers: number = cView.curTableInfo.totalNum;
                let curentPlayers: number = 0;
                for (let i = 0;i < cView.data.length;i ++) {
                    if (cView.data[i].info) {
                        curentPlayers ++;
                    }
                }
 
                // 分享小程序
                if (NativeBridge.appVersion >= 1.21) {
                    let appId = 10000037;
                    shareData.type = ShareWXType.SHARE_MINI;
                    shareData.miniID = NativeBridge.mShareMiniId;
                    shareData.miniPath = NativeBridge.mShareMiniPath + "?appId=" + appId + "&id=" + "beiyong" +"&roomId=" + roomId;

                    // 分享房间链接文本调整
                    if (1) {
                        shareData.title = "茶楼房间" + " " + roomId + " " + "缺"+numStr[maxPlayers-curentPlayers]+"人 " + "点击加入>>>";
                        shareData.desc = " ";
                    }
                }
                else {
                    // 分享房间链接文本调整
                    if (1) {
                        shareData.title = "茶楼房间邀请";
                        shareData.desc = roomId + " " + "缺"+numStr[maxPlayers-curentPlayers]+"人 " + "点击加入>>>"
                    }
                }
                

                shareData.extraType = InviteXLType.INVITE_ROOM;
                shareData.extraContent = roomId + "";
                NativeBridge.getInstance().mShareData = shareData;

                MvcUtil.send(CommonModule.COMMON_NATIVE_SHARE_CHOOSE_ROAD, SHARE_CHOOSE_TYPE.SHARE_CHOOSE_NO_FRIEND);
            }
            else {
                MvcUtil.send(CommonModule.COMMON_SHOW_SHARE_REMINDER_VIEW, ShareReminderTypeEnum.FRIENDS);
            }
        }

        private confirmDiss() {
            let msg = new DissolveTeaHouseDeskMsg();
            msg.deskNum = this.getView().flag_index;
            msg.teaHouseId = TeaHouseData.curID;
            msg.teaHouseLayer = TeaHouseData.curFloor;
            ServerUtil.sendMsg(msg);
        }
    }
}