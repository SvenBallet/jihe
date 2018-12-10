module FL {
    /** 更新GPS */
    export class NewUpdateGPSPositionMsgAck extends AbstractNewNetMsgBaseAck {
        /**
             * 玩家牌桌方位
             */
        public playerTablePos = 0;//byte

        public px = 0.0;//double
        public py = 0.0;//double
        public paddress: string = "";

        public constructor() {
            super(MsgCmdConstant.MSG_NEW_UPDATE_PLAYER_GPS_POSITION_ACK);
        }

        public newSerialize(ar: ObjectSerializer): void {
            let self = this;
            self.px = ar.sDouble(self.px);
            self.py = ar.sDouble(self.py);

            self.playerTablePos = ar.sByte(self.playerTablePos);
            self.paddress = ar.sString(self.paddress);
        }
    }
}