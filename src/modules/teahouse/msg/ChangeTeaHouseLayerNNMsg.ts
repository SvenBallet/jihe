module FL {
    /** 修改茶楼名字、公告消息 */
    export class ChangeTeaHouseLayerNNMsg extends NetMsgBase {
        /** 茶楼ID */
        public teaHouseId: number;
        /** 楼层*/
        public teaHouseLayer: number;
        /** 名称*/
        public teahouseLayerName: string;
        /** 公告*/
        public layerNotice: string;

        public constructor() {
            super(MsgCmdConstant.MSG_CHANGE_NN_TEAHOUSE_LAYER);
        }

        public serialize(ar: ObjectSerializer): void {
            super.serialize(ar);
            let self = this;
            self.teaHouseId = ar.sInt(self.teaHouseId);
            self.teaHouseLayer = ar.sInt(self.teaHouseLayer);
            self.teahouseLayerName = ar.sString(self.teahouseLayerName);
            self.layerNotice = ar.sString(self.layerNotice);
        }
    }
}