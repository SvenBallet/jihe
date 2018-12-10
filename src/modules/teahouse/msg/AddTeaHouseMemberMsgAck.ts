module FL {
    /** 管理员添加成员返回 */
    export class AddTeaHouseMemberMsgAck extends AbstractNewNetMsgBaseAck {
        // 添加结果
	    public result: number;

        public constructor() {
            super(MsgCmdConstant.MSG_ADD_TEAHOUSE_MEMEBER_ACK);
        }

        public newSerialize(ar: ObjectSerializer): void {
            let self = this;
            self.result = ar.sInt(self.result);
        }
    }
}