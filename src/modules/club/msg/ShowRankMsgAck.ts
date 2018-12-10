module FL {
    /**
      * 深圳市天天爱科技有限公司 版权所有
      * @Name:  MahjongBase - ClubRankingListView
      * @Description: 排行榜返回
      * @Create: HoyeLee on 2018/3/10 18:35
      * @Version: V1.0
      */
    export class ShowRankMsgAck extends NetMsgBase {
        public page: number = 0;					//页码，第一页为1
        public size: number = 0;					//页大小
        public members: Array<ClubMember> = null;	//排行项成员信息
        public my: ClubMember = null;			//自己的排名信息

        public constructor() {
            super(MsgCmdConstant.MSG_SHOW_RANK_ACK);
        }

        public serialize(ar: ObjectSerializer): void {
            super.serialize(ar);
            //
            let self = this;
            self.page = ar.sInt(self.page);
            self.size = ar.sInt(self.size);
            self.members = <Array<ClubMember>>ar.sObjArray(self.members);
            self.my = <ClubMember>ar.sObject(self.my);
        }
    }
}