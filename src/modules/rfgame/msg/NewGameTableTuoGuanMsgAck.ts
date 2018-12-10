module FL {
    export class NewGameTableTuoGuanMsgAck extends AbstractNewNetMsgBaseAck {
        /** 玩家座位 */
        public tablePos = 0;//byte

        /**
         * 托管动作 0=进入托管，1=取消托管
         */
        public tuoGuanAction = 0;//byte

        public constructor() {
            super(MsgCmdConstant.MSG_NEW_GAME_TABLE_TUO_GUAN_ACK);
        }

        public newSerialize(ar: ObjectSerializer): void {
            let self = this;
            self.tablePos = ar.sByte(self.tablePos);
            self.tuoGuanAction = ar.sByte(self.tuoGuanAction);
        }
    }
}