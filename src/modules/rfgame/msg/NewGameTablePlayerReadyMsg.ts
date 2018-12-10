module FL {
    export class NewGameTablePlayerReadyMsg extends NetMsgBase {
        /**
	 * 托管动作 0=准备，1=取消准备
	 */
        public readyAction = 0;//byte

        public constructor() {
            super(MsgCmdConstant.MSG_NEW_GAME_TABLE_PLAYER_READY);
        }

        public serialize(ar: ObjectSerializer): void {
            super.serialize(ar);
            let self = this;
            self.readyAction = ar.sByte(self.readyAction);
        }
    }
}