module FL {
    /** 茶楼邀请玩家返回 */
    export class InviteToJoinGameMsgAck extends AbstractNewNetMsgBaseAck {
        // 邀请结果  0.邀请成功  1.邀请失败
        public result:number = 0;

        public constructor() {
            super(MsgCmdConstant.MSG_INVITE_TO_JOIN_GAME_ACK);
        }

        public newSerialize(ar: ObjectSerializer): void {
            let self = this;
            self.result = ar.sInt(self.result);
        }
    }
}