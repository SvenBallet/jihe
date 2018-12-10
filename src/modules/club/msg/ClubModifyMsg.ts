module FL {
    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase - ClubModifyMsg
     * @Description: 公告编辑
     * @Create: HoyeLee on 2018/3/13 10:50
     * @Version: V1.0
     */
    export class ClubModifyMsg extends NetMsgBase {
        public clubId: number = 0;
        public notice: string;

        public constructor() {
            super(MsgCmdConstant.MSG_CLUB_MODIFY)
        }

        public serialize(ar: ObjectSerializer): void {
            super.serialize(ar);
            //
            let self = this;
            self.clubId = ar.sInt(self.clubId);
            self.notice = ar.sString(self.notice);
        }
    }
}