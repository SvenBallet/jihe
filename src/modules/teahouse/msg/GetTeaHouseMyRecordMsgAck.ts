module FL {
    /** 获取我的战绩返回 */
    export class GetTeaHouseMyRecordMsgAck extends AbstractNewNetMsgBaseAck {
        /** 记录列表 */
        public roomRecords: Array<VipRoomRecord> = new Array<VipRoomRecord>();// List<VipRoomRecord>
        /**当天输赢分数*/
        public todayTotalScore = 0;	
        /**当天总局数*/
        public playerCount = 0;
        /**当天大赢家数*/
        public bigWinnerCount = 0;

        public constructor() {
            super(MsgCmdConstant.MSG_GET_TEAHOUSE_MY_RECORD_ACK);
        }

        public newSerialize(ar: ObjectSerializer): void {
            let self = this;
            self.roomRecords = <Array<VipRoomRecord>>ar.sObjArray(self.roomRecords);
            self.todayTotalScore = ar.sInt(self.todayTotalScore);
            self.playerCount = ar.sInt(self.playerCount);
            self.bigWinnerCount = ar.sInt(self.bigWinnerCount);
        }
    }
}