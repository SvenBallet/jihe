module FL {
    /** 进入茶楼消息 */
    export class AccessTeaHouseMsg extends NetMsgBase {
        //茶楼ID
        public teaHouseId;
        // 创建标识。是否为创建茶楼后进入，前端一直传false。
        public createFlag: boolean = false;
        public constructor() {
            super(MsgCmdConstant.MSG_ACCESS_TEAHOUSE);
        }

        public serialize(ar: ObjectSerializer): void {
            super.serialize(ar);
            let self = this;
            self.teaHouseId = ar.sInt(self.teaHouseId);
            self.createFlag = ar.sBoolean(self.createFlag);
        }
    }
}