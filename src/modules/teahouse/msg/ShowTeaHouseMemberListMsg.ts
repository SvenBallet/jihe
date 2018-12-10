module FL {
    /** 显示茶楼成员列表消息 */
    export class ShowTeaHouseMemberListMsg extends NetMsgBase {
        //茶楼ID
        public teaHouseId = 0;
        //页码
        public page = 0;
        //搜索ID(不是搜索则为0，是搜索则为玩家ID)
        public searchPlayerId = 0;
        //通过玩家名称搜索
        public searchPlayerName: string;

        public constructor() {
            super(MsgCmdConstant.MSG_TEAHOUSE_SHOW_MEMBER_LIST);
        }

        public serialize(ar: ObjectSerializer): void {
            super.serialize(ar);
            //
            let self = this;
            self.teaHouseId = ar.sInt(self.teaHouseId);
            self.page = ar.sInt(self.page);
            self.searchPlayerId = ar.sInt(self.searchPlayerId);
            self.searchPlayerName = ar.sString(self.searchPlayerName);
        }
    }
}