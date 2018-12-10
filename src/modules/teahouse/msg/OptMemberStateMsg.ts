module FL {
    /** 操作成员状态消息 */
    export class OptMemberStateMsg extends NetMsgBase {
        public teaHouseId: number = 0;				//茶楼ID
        public memberId: dcodeIO.Long = dcodeIO.Long.ZERO;	// long		//成员ID
        public operationType: number = 0;		//操作类型(设置/删除)

        public static readonly SET_TEAHOUSE_XIAOER = 0;	//设置小二
        public static readonly DELETE_TEAHOUSE_XIAOER = 1;		//删除小二
        public static readonly TH_WAITER_DEFAULT = -1;//默認不操作
        public static readonly DELETE_TEAHOUSE_MEMBER = 2;

        public constructor() {
            super(MsgCmdConstant.MSG_OPT_TEAHOUSE_MEMBER);
        }

        public serialize(ar: ObjectSerializer): void {
            super.serialize(ar);
            let self = this;
            self.teaHouseId = ar.sInt(self.teaHouseId);
            self.memberId = ar.sLong(self.memberId);
            self.operationType = ar.sInt(self.operationType);
        }
    }
}