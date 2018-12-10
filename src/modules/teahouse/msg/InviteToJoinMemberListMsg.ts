module FL {
    /** 获取茶楼邀请列表 */
    export class InviteToJoinMemberListMsg extends NetMsgBase {
        /** 茶楼ID */
        public teaHouseId: number;

        public constructor() {
            super(MsgCmdConstant.MSG_INVITE_TO_JOIN_GAME_MEMBER_LIST);
        }

        public serialize(ar: ObjectSerializer): void {
            super.serialize(ar);
            let self = this;
            self.teaHouseId = ar.sInt(self.teaHouseId);
        }
    }
}