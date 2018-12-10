module FL {

    export class LobbyJoinRoomViewMediator extends puremvc.Mediator implements puremvc.IMediator {

        public static readonly NAME: string = "LobbyJoinRoomViewMediator";

        public vView: LobbyJoinRoomView = this.viewComponent;

        private inputIndex: number = 0;
        private collection = new eui.ArrayCollection();
        constructor(pView: LobbyJoinRoomView) {
            super(LobbyJoinRoomViewMediator.NAME, pView);
            let self = this;

            pView.zeroBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, self.addNumber, self);
            pView.oneBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, self.addNumber, self);
            pView.twoBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, self.addNumber, self);
            pView.threeBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, self.addNumber, self);
            pView.fourBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, self.addNumber, self);
            pView.fineBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, self.addNumber, self);
            pView.sixBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, self.addNumber, self);
            pView.sevenBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, self.addNumber, self);
            pView.eightBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, self.addNumber, self);
            pView.nineBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, self.addNumber, self);
            pView.reenterBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, self.rmAllNumber, self);
            pView.deleteBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, self.delNumber, self);
            pView.closeGroup.addEventListener(egret.TouchEvent.TOUCH_TAP, self.closeView, self);
            // pView.closeViewGroup.addEventListener(egret.TouchEvent.TOUCH_TAP, self.closeView, self);

        }

        private closeView(e: egret.Event): void {
            MvcUtil.send(LobbyModule.LOBBY_INTO_LOBBY);
        }

        private addNumber(e: egret.Event): void {
            let self = this;
            let number: number = parseInt(e.currentTarget.name);
            if (self.inputIndex <= self.vView._valueLength) {
                self.collection.addItem(number);
                self.vView.dataList.dataProvider = self.collection;
                self.inputIndex++;
            }
            if (self.inputIndex == self.vView._valueLength + 1) {
                if (self.vView.flag_isJoinRoom) {
                    self.joinRoom();
                } else {
                    self.joinTeaHouse();
                }
            }
        }

        private rmAllNumber(e: egret.Event): void {
            let self = this;
            self.inputIndex = 0;
            self.collection.removeAll();
            self.vView.dataList.dataProvider = self.collection;
        }

        private delNumber(e: egret.Event): void {
            let self = this;
            if (self.inputIndex < 1) {
                return;
            } else {
                self.inputIndex--;
                self.collection.removeItemAt(this.inputIndex);
                self.vView.dataList.dataProvider = self.collection;
            }
        }

        /** 加入房间 */
        private joinRoom(): void {
            let self = this;
            let roomNum: number[] = self.collection.source;
            //发送进入VIP房间指令
            // let vEnterVipRoomMsg:EnterVipRoomMsg = new EnterVipRoomMsg();
            // vEnterVipRoomMsg.tableID = "enter_room";
            // vEnterVipRoomMsg.roomID = parseInt(roomNum.join(""));
            // ServerUtil.sendMsg(vEnterVipRoomMsg, MsgCmdConstant.MSG_GAME_START_GAME_REQUEST_ACK);

            let vNewJoinVipRoomMsg: NewJoinVipRoomMsg = new NewJoinVipRoomMsg();
            vNewJoinVipRoomMsg.vipRoomID = parseInt(roomNum.join(""));
            ServerUtil.sendMsg(vNewJoinVipRoomMsg, MsgCmdConstant.MSG_INTO_GAME_TABLE);
        }

        /** 加入茶楼 */
        private joinTeaHouse(): void {
            let self = this;
            let num = self.collection.source;
            let vAccessTHMsg = new AccessTeaHouseMsg();
            vAccessTHMsg.teaHouseId = parseInt(num.join(""));
            ServerUtil.sendMsg(vAccessTHMsg, MsgCmdConstant.MSG_ACCESS_TEAHOUSE_ACK);
            TeaHouseMsgHandle.sendAccessLayerMsg(1, parseInt(num.join("")), true);
        }
    }
}