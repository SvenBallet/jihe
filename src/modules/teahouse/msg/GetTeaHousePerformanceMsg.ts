module FL {
    export class GetTeaHousePerformanceMsg extends NetMsgBase {
        /** 茶楼ID */
        public teaHouseId;

        public constructor() {
            super(MsgCmdConstant.MSG_GET_TEAHOUSE_PERFORMANCE);
        }

        public serialize(ar: ObjectSerializer): void {
            super.serialize(ar);
            let self = this;
            self.teaHouseId = ar.sInt(self.teaHouseId);
        }
    }
}