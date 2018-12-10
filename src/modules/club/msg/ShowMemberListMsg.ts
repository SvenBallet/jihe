module FL {
    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase - ShowMemberListMsg
     * @Description:  成员列表发送
     * @Create: ArielLiang on 2018/3/12 17:55
     * @Version: V1.0
     */
    export class ShowMemberListMsg extends NetMsgBase {
        public clubId: number = 0;		//俱乐部ID
        public page: number = 0;		//页码，第一页为1

        constructor() {
            super(MsgCmdConstant.MSG_SHOW_MEMBER_LIST);
        }

        public serialize(ar: ObjectSerializer): void {
            super.serialize(ar);
            let self = this;
            self.clubId = ar.sInt(self.clubId);
            self.page = ar.sInt(self.page);
        }
    }
}