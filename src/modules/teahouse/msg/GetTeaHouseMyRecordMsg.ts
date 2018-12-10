module FL {
    /** 获取我的战绩 */
    export class GetTeaHouseMyRecordMsg extends NetMsgBase {
        /** 茶楼ID */
        public teaHouseId;
        /** 楼层*/
        public teaHouseLayer;
        /**查询类型*/
	    public type;

        public constructor() {
            super(MsgCmdConstant.MSG_GET_TEAHOUSE_MY_RECORD);
        }

        public serialize(ar: ObjectSerializer): void {
            super.serialize(ar);
            let self = this;
            self.teaHouseId = ar.sInt(self.teaHouseId);
            self.teaHouseLayer = ar.sInt(self.teaHouseLayer);
            self.type = ar.sInt(self.type);
        }
    }
}