module FL {
    /** 操作茶樓申請消息返回*/
    export class OptTeaHouseApplyMsgAck extends AbstractNewNetMsgBaseAck {

        public result = 0; // 成功或失败，定义如下

        public ApplyId = 0; //成功/失败的申请ID

        public constructor() {
            super(MsgCmdConstant.MSG_OPT_TEAHOUSE_APPLY_ACK);
        }

        public newSerialize(ar: ObjectSerializer): void {
            let self = this;
            self.result = ar.sInt(self.result);
        }
    }
}