module FL {
    export class DissolveTeaHouseDeskMsg extends NetMsgBase {
        /** 茶楼ID */
        public teaHouseId: number;
        /** 楼层*/
        public teaHouseLayer: number;
        /** 桌子编号*/
        public deskNum: number;

        public constructor() {
            super(MsgCmdConstant.MSG_DESTROY_TEAHOUSE_DESK);
        }

        public serialize(ar: ObjectSerializer): void {
            super.serialize(ar);
            let self = this;
            self.teaHouseId = ar.sInt(self.teaHouseId);
            self.teaHouseLayer = ar.sInt(self.teaHouseLayer);
            self.deskNum = ar.sInt(self.deskNum);
        }
    }
}