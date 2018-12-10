module FL {
    /** 显示茶楼成员列表消息返回 */
    export class ShowTeaHouseMemberListMsgAck extends AbstractNewNetMsgBaseAck {
        public page;	//页码，第一页为1
        public size;	//页大小
        public totalPage = 0;	//成员总页数
        public members: Array<TeaHouseMember> = null;	//成员列表
        public teaHouseAllMemberNum = 0;		//茶楼内所有成员数量
	    public teaHouseOnLineMemberNum = 0;		//茶楼在线成员数量

        public constructor() {
            super(MsgCmdConstant.MSG_TEAHOUSE_SHOW_MEMBER_LIST_ACK);
        }

        public newSerialize(ar: ObjectSerializer): void {
            let self = this;
            self.page = ar.sInt(self.page);
            self.size = ar.sInt(self.size);
            self.totalPage = ar.sInt(self.totalPage);
            self.members = <Array<TeaHouseMember>>ar.sObjArray(self.members);
            self.teaHouseAllMemberNum = ar.sInt(self.teaHouseAllMemberNum);
            self.teaHouseOnLineMemberNum = ar.sInt(self.teaHouseOnLineMemberNum);
        }
    }
}