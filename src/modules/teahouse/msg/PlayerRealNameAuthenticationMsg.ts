module FL {
    /**实名认证 */
    export class PlayerRealNameAuthenticationMsg extends NetMsgBase {
        public playerIndex: string;
        public playerRealName: string;
        public playerRealID: string;
        public constructor() {
            super(MsgCmdConstant.MSG_REAL_NAME_AUTHENTICATION);
        }

        public serialize(ar: ObjectSerializer): void {
            super.serialize(ar);
            let self = this;
            self.playerIndex = ar.sString(self.playerIndex);
            self.playerRealName = ar.sString(self.playerRealName);
            self.playerRealID = ar.sString(self.playerRealID);
        }
    }
}