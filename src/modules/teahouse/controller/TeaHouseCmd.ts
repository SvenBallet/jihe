module FL {
    export class TeaHouseCmd extends puremvc.SimpleCommand implements puremvc.ICommand {
        public constructor() {
            super();
        }

        public execute(notification: puremvc.INotification): void {
            let data: any = notification.getBody();
            switch (notification.getName()) {
                case TeaHouseModule.TH_ACCESS_FLOOR:
                    this.intoTeaHouse(data);
                    break;
                case TeaHouseModule.TH_IS_OFF:
                    this.isOffTeaHouse();
                    break;
            }
        }

        /** 
         * 进入茶楼第N层
         */
        private intoTeaHouse(msg: AccessTeaHouseLayerMsgAck) {
            // 茶楼位置
            CommonData.lastStopPosition = 2;
            CommonData.delayedExeAfterLoginIntoLobbyID++;

            // 去除遮罩
            ReqLoadingViewUtil.delReqLoadingView();
            // CommonHandler.delNetConnectMask();

            // 停止回放
            if(!MahjongHandler.isReplay()) MahjongLogReplay.endPlay();
            if(!RFGameHandle.isReplay()) RFGameLogReplay.endPlay();

            // 设置到本地
            Storage.setItemNum("th_previous_tea_house_id", msg.teaHouseId);
            Storage.setItemNum("th_previous_floor_" + msg.teaHouseId, msg.teahouseLayerNum);
            //添加茶楼基础页面
            let thView = TeaHouseBaseView.getInstance();
            MvcUtil.addView(thView);
            this.isOffTeaHouse();
        }

        /** 
         * 茶楼是否打烊
         */
        private isOffTeaHouse() {
            if (TeaHouseData.isOff) {
                MvcUtil.addView(new TeaHouseCloseUpView());
            }
        }
    }
}