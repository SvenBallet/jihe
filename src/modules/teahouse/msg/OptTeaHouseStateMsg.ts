module FL {
    /** 茶楼布局（操作茶楼状态消息） */
    export class OptTeaHouseStateMsg extends NetMsgBase {
        //茶楼ID
        public teaHouseId = 0;

        //留言
        public leaveMessage;

        //操作类型
        public operationType = 0;

        //开启茶楼
        public static readonly TYPE_ON_TEA_HOUSE = 0;
        //关闭茶楼
        public static readonly TYPE_OFF_TEA_HOUSE = 1;
        //销毁茶楼
        public static readonly TYPE_DESTROY_TEA_HOUSE = 2;


        public constructor() {
            super(MsgCmdConstant.MSG_OPT_TEAHOUSE_STATE);
        }

        public serialize(ar: ObjectSerializer): void {
            super.serialize(ar);
            let self = this;
            self.teaHouseId = ar.sInt(self.teaHouseId);
            self.operationType = ar.sInt(self.operationType);
            self.leaveMessage = ar.sString(self.leaveMessage);
        }
    }
}