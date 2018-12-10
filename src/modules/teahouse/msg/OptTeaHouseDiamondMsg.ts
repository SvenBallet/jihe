module FL {
    /** 茶楼钻石相关消息 */
    export class OptTeaHouseDiamondMsg extends NetMsgBase {
        // 茶楼ID
        public teaHouseId;
        // 钻石数
        public diamond;
        // 操作类型    1.增加  2.取出（消耗）
        public optType;

        public static readonly ADD = 1;//增加
        public static readonly GET = 2;//取出

        public constructor() {
            super(MsgCmdConstant.MSG_OPT_TEAHOUSE_DIAMOND);
        }

        public serialize(ar: ObjectSerializer): void {
            super.serialize(ar);
            //
            let self = this;
            self.teaHouseId = ar.sInt(self.teaHouseId);
            self.diamond = ar.sInt(self.diamond);
            self.optType = ar.sInt(self.optType);
        }
    }
}