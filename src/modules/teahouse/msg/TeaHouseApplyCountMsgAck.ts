module FL {
    export class TeaHouseApplyCountMsgAck extends AbstractNewNetMsgBaseAck {
        //申请加入茶楼个数
        public applyCount = 0;
        public teaHouseId = 0;
        public constructor() {
            super(MsgCmdConstant.MSG_TEAHOUSE_APPLY_COUNT_ACK);
        }

        public newSerialize(ar: ObjectSerializer): void {
            let self = this;
            self.applyCount = ar.sInt(self.applyCount);
            self.teaHouseId = ar.sInt(self.teaHouseId);
        }
    }
}