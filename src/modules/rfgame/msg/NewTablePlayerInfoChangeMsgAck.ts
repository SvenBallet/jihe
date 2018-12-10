module FL {
    export class NewTablePlayerInfoChangeMsgAck extends AbstractNewNetMsgBaseAck {
        /**
	 * 游戏玩家
	 */
        public newGamePlayer: GamePlayer = null;

        public constructor() {
            super(MsgCmdConstant.MSG_TABLE_PLAYER_INFO_CHANGE_ACK);
        }
        public newSerialize(ar: ObjectSerializer): void {
            let self = this;
            self.newGamePlayer = <GamePlayer>ar.sObject(self.newGamePlayer);
        }
    }
}