module FL {
    /** 获取茶楼楼层列表消息 */
    export class GetTeaHouseLayerListMsg extends NetMsgBase {
        /** 茶楼ID */
        public teaHouseId: number;

        public constructor() {
            super(MsgCmdConstant.MSG_GET_TEAHOUSE_LAYER_LIST);
        }

        public serialize(ar: ObjectSerializer): void {
            super.serialize(ar);
            let self = this;
            self.teaHouseId = ar.sInt(self.teaHouseId);
        }
    }
}