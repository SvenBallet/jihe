module FL {
    /** 获取茶楼邀请列表返回 */
    export class InviteToJoinMemberListMsgAck extends AbstractNewNetMsgBaseAck {
        // 茶楼ID
        public teaHouseId:number = 0;
        //返回给客户端的可邀请的成员列表
	    public members: Array<TeaHouseMember> = null;

        public constructor() {
            super(MsgCmdConstant.MSG_INVITE_TO_JOIN_GAME_MEMBER_LIST_ACK);
        }

        public newSerialize(ar: ObjectSerializer): void {
            let self = this;
            self.teaHouseId = ar.sInt(self.teaHouseId);
            self.members = <Array<TeaHouseMember>>ar.sObjArray(self.members);
        }
    }
}