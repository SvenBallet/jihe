module FL {
    /** 获取总战绩的列表返回 */
    export class GetTeaHouseAllRecordMsgAck extends AbstractNewNetMsgBaseAck {
        /** 记录列表 */
        public roomRecords = new Array<VipRoomRecord>();

        public constructor() {
            super(MsgCmdConstant.MSG_GET_TEAHOUSE_ALL_RECORD_ACK);
        }

        public newSerialize(ar: ObjectSerializer): void {
            let self = this;
            self.roomRecords = <Array<VipRoomRecord>>ar.sObjArray(self.roomRecords);
        }
    }
}