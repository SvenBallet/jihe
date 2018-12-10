module FL {
    /**实名认证 */
    export class PlayerRealNameAuthenticationMsgAck extends NetMsgBase {
	    public isPlayerAuthenticated: number = 0;

        public constructor() {
            super(MsgCmdConstant.MSG_REAL_NAME_AUTHENTICATION_ACK);
        }

        public serialize(ar: ObjectSerializer): void {
            super.serialize(ar);
            let self = this;
            self.isPlayerAuthenticated = ar.sInt(self.isPlayerAuthenticated);
        }
    }
}