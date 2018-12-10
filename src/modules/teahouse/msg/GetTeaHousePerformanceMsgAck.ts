module FL {
    export class GetTeaHousePerformanceMsgAck extends AbstractNewNetMsgBaseAck {
        /**经营列表 */
        public roomRecords = new Array<TeaHousePerformanceAll>();

        public constructor() {
            super(MsgCmdConstant.MSG_GET_TEAHOUSE_PERFORMANCE_ACK);
        }

        public newSerialize(ar: ObjectSerializer): void {
            let self = this;
            self.roomRecords = <Array<TeaHousePerformanceAll>>ar.sObjArray(self.roomRecords);
        }
    }
}