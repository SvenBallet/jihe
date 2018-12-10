module FL {
    /** 提交GPS */
    export class NewUpdateGPSPositionMsg extends NetMsgBase {
        public px = 0.0;//double  // 往服务器传0.0表示拉取其他玩家的pgs
        public py = 0.0;//double
        public paddress: string = "";

        public constructor() {
            super(MsgCmdConstant.MSG_NEW_UPDATE_PLAYER_GPS_POSITION);
        }

        public serialize(ar: ObjectSerializer): void {
            let self = this;
            super.serialize(ar);
            self.px = ar.sDouble(self.px);
            self.py = ar.sDouble(self.py);
            self.paddress = ar.sString(self.paddress);
        }
    }
}