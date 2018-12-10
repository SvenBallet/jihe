module FL {
    /** 进入茶馆牌桌消息 */
    export class AccessTeaHouseDeskMsg extends NetMsgBase {
        /** 茶楼ID */
        public teaHouseId;
        /** 楼层*/
        public teaHouseLayer;
        /** 桌子编号*/
        public deskNum;
        /** 位置编号*/
        public tablePos;

        public constructor() {
            super(MsgCmdConstant.MSG_INTO_TEAHOUSE_DESK);
        }

        public serialize(ar: ObjectSerializer): void {
            super.serialize(ar);
            let self = this;
            self.teaHouseId = ar.sInt(self.teaHouseId);
            self.teaHouseLayer = ar.sInt(self.teaHouseLayer);
            self.deskNum = ar.sInt(self.deskNum);
            self.tablePos = ar.sInt(self.tablePos);
        }
    }
}