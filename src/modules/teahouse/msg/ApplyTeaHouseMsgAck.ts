module FL {
    /** 申请加入茶楼消息返回 */
    export class ApplyTeaHouseMsgAck extends AbstractNewNetMsgBaseAck {
        //申请加入结果
        public result;

        public static readonly TEA_HOUSE_NOT_FOUND = 1;//没有找到茶馆     
        public static readonly MEMBER_NOT_FOUND = 2;//没有找到成员
        public static readonly HAS_APPLIED = 3;//已经申请过了

        public constructor() {
            super(MsgCmdConstant.MSG_APPLY_TEAHOUSE_ACK);
        }

        public newSerialize(ar: ObjectSerializer): void {
            let self = this;
            self.result = ar.sInt(self.result);
        }
    }
}