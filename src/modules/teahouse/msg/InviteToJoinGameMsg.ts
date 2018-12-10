module FL {
    /** 茶楼邀请玩家 */
    export class InviteToJoinGameMsg extends NetMsgBase {
        //茶楼ID
        public teaHouseId :number = 0;
        //房间ID
        public roomId :number = 0;
        //操作类型 0.邀请单个  1.一键邀请
        public operationType :number = 0;
        //玩家ID
        public playerIndex :number = 0;

        public constructor() {
            super(MsgCmdConstant.MSG_INVITE_TO_JOIN_GAME);
        }

        public serialize(ar: ObjectSerializer): void {
            super.serialize(ar);
            let self = this;
            self.teaHouseId = ar.sInt(self.teaHouseId);
            self.roomId = ar.sInt(self.roomId);
            self.operationType = ar.sInt(self.operationType);
            self.playerIndex = ar.sInt(self.playerIndex);
        }
    }
}