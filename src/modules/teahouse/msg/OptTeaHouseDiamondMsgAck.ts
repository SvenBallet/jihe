module FL {
    /** 茶楼钻石相关消息返回 */
    export class OptTeaHouseDiamondMsgAck extends AbstractNewNetMsgBaseAck {
        public teaHouseId = 0;
        public diamond = 0;

        public constructor() {
            super(MsgCmdConstant.MSG_OPT_TEAHOUSE_DIAMOND_ACK);
        }

        public newSerialize(ar: ObjectSerializer): void {
            let self = this;
            self.teaHouseId = ar.sInt(self.teaHouseId);
            self.diamond = ar.sInt(self.diamond);
        }
    }
}