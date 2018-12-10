module FL {
    /** 申请进入茶楼消息 */
    export class ApplyTeaHouseMsg extends NetMsgBase {

        //茶楼ID
        public teaHouseId: number;

        public constructor() {
            super(MsgCmdConstant.MSG_APPLY_TEAHOUSE);
        }

        public serialize(ar: ObjectSerializer): void {
            super.serialize(ar);
            //
            let self = this;
            self.teaHouseId = ar.sInt(self.teaHouseId);
        }
    }
}