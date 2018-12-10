module FL {
    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase - ShowMemberListMsgAck
     * @Description:  成员列表返回
     * @Create: ArielLiang on 2018/3/12 17:57
     * @Version: V1.0
     */
    export class ShowMemberListMsgAck extends NetMsgBase
    {
        public page:number;	//页码，第一页为1
        public size:number;	//页大小
        public members:Array<ClubMember> = null;	//成员列表

        constructor()
        {
            super(MsgCmdConstant.MSG_SHOW_MEMBER_LIST_ACK);
        }

        public serialize(ar:ObjectSerializer):void
        {
            super.serialize(ar);
            let self = this;
            self.page = ar.sInt(self.page);
            self.size = ar.sInt(self.size);
            self.members = <Array<ClubMember>> ar.sObjArray(self.members);
        }
    }
}