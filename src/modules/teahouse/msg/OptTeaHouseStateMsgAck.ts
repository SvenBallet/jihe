module FL {
    /**  茶楼布局(操作茶楼状态消息返回) */
    export class OptTeaHouseStateMsgAck extends AbstractNewNetMsgBaseAck {
        // 茶楼ID
        public teaHouseId = 0;
        //留言
        public leaveMessage;

        // 操作类型
        public operationType = 0;
        // 操作结果
        public result = 0;

        public static readonly SUCCESS = 0;

        public constructor() {
            super(MsgCmdConstant.MSG_OPT_TEAHOUSE_STATE_ACK);
        }

        public newSerialize(ar: ObjectSerializer): void {
            let self = this;
            self.teaHouseId = ar.sInt(self.teaHouseId);
            self.operationType = ar.sInt(self.operationType);
            self.result = ar.sInt(self.result);
            self.leaveMessage = ar.sString(self.leaveMessage);
        }
    }
}