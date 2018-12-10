module FL {
    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase - ClubDismissMsg
     * @Description: 解散俱乐部
     * @Create: HoyeLee on 2018/3/13 15:16
     * @Version: V1.0
     */
    export class ClubDismissMsg extends NetMsgBase {
        public clubId: number = 0;

        public constructor() {
            super(MsgCmdConstant.MSG_CLUB_DISMISS);
        }

        public serialize(ar: ObjectSerializer): void {
            super.serialize(ar);
            //
            let self = this;
            self.clubId = ar.sInt(self.clubId);
        }
    }
}