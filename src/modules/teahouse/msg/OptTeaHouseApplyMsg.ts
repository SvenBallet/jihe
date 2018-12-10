module FL {
    /** 操作茶樓申請消息 */
    export class OptTeaHouseApplyMsg extends NetMsgBase {
        //茶楼ID
        public teaHouseId = 0;
        //不指定时全部同意或者拒绝，指定则针对一个申请
        public applyId: dcodeIO.Long = dcodeIO.Long.ZERO;
        //定义如下,0拒绝,1同意,2一键清除
        public type = 0;

        public constructor() {
            super(MsgCmdConstant.MSG_OPT_TEAHOUSE_APPLY);
        }

        public serialize(ar: ObjectSerializer): void {
            super.serialize(ar);
            //
            let self = this;
            self.teaHouseId = ar.sInt(self.teaHouseId);
            self.applyId = ar.sLong(self.applyId);
            self.type = ar.sInt(self.type);
        }
    }
}