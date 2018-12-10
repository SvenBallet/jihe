module FL {
    /** 获取茶楼总战绩列表消息 */
    export class GetTeaHouseAllRecordMsg extends NetMsgBase {
        /** 茶楼ID */
        public teaHouseId;
        /** 楼层*/
        public teaHouseLayer;

        public constructor() {
            super(MsgCmdConstant.MSG_GET_TEAHOUSE_ALL_RECORD);
        }

        public serialize(ar: ObjectSerializer): void {
            super.serialize(ar);
            let self = this;
            self.teaHouseId = ar.sInt(self.teaHouseId);
            self.teaHouseLayer = ar.sInt(self.teaHouseLayer);
        }
    }
}