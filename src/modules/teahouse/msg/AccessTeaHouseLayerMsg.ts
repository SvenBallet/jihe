module FL {
    /** 进入茶楼楼层消息 */
    export class AccessTeaHouseLayerMsg extends NetMsgBase {
        /** 茶楼ID */
        public teaHouseId;
        /** 第几层 */
        public teahouseLayerNum;

        public constructor() {
            super(MsgCmdConstant.MSG_ACCESS_TEAHOUSE_LAYER);
        }

        public serialize(ar: ObjectSerializer): void {
            super.serialize(ar);
            let self = this;
            self.teaHouseId = ar.sInt(self.teaHouseId);
            self.teahouseLayerNum = ar.sInt(self.teahouseLayerNum);
        }
    }
}   