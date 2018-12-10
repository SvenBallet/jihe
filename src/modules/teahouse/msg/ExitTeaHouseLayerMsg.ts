module FL {
    /** 离开茶楼楼层消息 */
    export class ExitTeaHouseLayerMsg extends NetMsgBase {
        /** 茶楼ID */
        public teaHouseId: number;
        /** 楼层*/
        public teaHouseLayer: number;

        public constructor() {
            super(MsgCmdConstant.MSG_LEAVE_TEAHOUSE_LAYER);
        }

        public serialize(ar: ObjectSerializer): void {
            super.serialize(ar);
            let self = this;
            self.teaHouseId = ar.sInt(self.teaHouseId);
            self.teaHouseLayer = ar.sInt(self.teaHouseLayer);
        }
    }
}