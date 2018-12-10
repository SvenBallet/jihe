module FL {
    /** 成员状态消息返回 */
    export class OptMemberStateMsgAck extends AbstractNewNetMsgBaseAck {
        public teaHouseId: number = 0;			//茶楼ID
        public memberId: dcodeIO.Long = dcodeIO.Long.ZERO;			//成员ID
        public operationType: number = 0;		//操作类型
        public xiaoEr: Array<TeaHouseMember> = null;//List<TeaHouseMember>
        public setXiaoEr: Array<TeaHouseMember> = null;		//不是小二/BOSS的成员

        public constructor() {
            super(MsgCmdConstant.MSG_OPT_TEAHOUSE_MEMBER_ACK);
        }

        public newSerialize(ar: ObjectSerializer): void {
            let self = this;
            self.teaHouseId = ar.sInt(self.teaHouseId);
            self.memberId = ar.sLong(self.memberId);
            self.operationType = ar.sInt(self.operationType);
            self.xiaoEr = <Array<TeaHouseMember>>ar.sObjArray(self.xiaoEr);
            self.setXiaoEr = <Array<TeaHouseMember>>ar.sObjArray(self.setXiaoEr);
        }
    }
}