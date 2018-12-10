module FL {
    export class NewPlayerLeaveRoomMsgAck extends AbstractNewNetMsgBaseAck {

        /**
         * 玩家的座位号
         */
        public playerPos: number = 0;//byte

        public constructor() {
            super(MsgCmdConstant.MSG_PLAYER_LEAVE_ROOM_ACK);
        }

        public newSerialize(ar: ObjectSerializer): void {
            let self = this;
            self.playerPos = ar.sByte(self.playerPos);
        }
    }
}