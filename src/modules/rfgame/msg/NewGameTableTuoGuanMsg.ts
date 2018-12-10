module FL {
    export class NewGameTableTuoGuanMsg extends NetMsgBase {
        /**
	 * 托管动作 0=进入托管，1=取消托管
	 */
        public tuoGuanAction = 0;//byte
        public constructor() {
            super(MsgCmdConstant.MSG_NEW_GAME_TABLE_TUO_GUAN);
        }

        public serialize(ar: ObjectSerializer): void {
            super.serialize(ar);
            let self = this;
            self.tuoGuanAction = ar.sByte(self.tuoGuanAction);
        }
    }
}