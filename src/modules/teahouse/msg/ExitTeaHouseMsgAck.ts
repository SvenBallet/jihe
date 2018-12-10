module FL {
    /** 退出茶楼消息返回 */
    export class ExitTeaHouseMsgAck extends AbstractNewNetMsgBaseAck {
        // 退出茶楼结果
        public result = 0;
        // 茶楼ID
        public teaHouseId = 0;
        // 玩家ID
        public playerIndex = 0;

        public static readonly EXIT_TEAHOUSE_SUCCESS = 1;

        public constructor() {
            super(MsgCmdConstant.MSG_EXIT_TEAHOUSE_ACK);
        }

        public newSerialize(ar: ObjectSerializer): void {
            let self = this;
            self.result = ar.sInt(self.result);
            self.teaHouseId = ar.sInt(self.teaHouseId);
            self.playerIndex = ar.sInt(self.playerIndex);
        }
    }
}