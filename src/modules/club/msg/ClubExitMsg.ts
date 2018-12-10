module FL {
    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase - ClubExitMsg
     * @Description: 退出俱乐部
     * @Create: HoyeLee on 2018/3/13 16:14
     * @Version: V1.0
     */
    export class ClubExitMsg extends NetMsgBase {
        public clubId: number = 0;

        public constructor() {
            super(MsgCmdConstant.MSG_CLUB_EXIT);
        }

        public serialize(ar: ObjectSerializer): void {
            super.serialize(ar);
            //
            let self = this;
            self.clubId = ar.sInt(self.clubId);
        }
    }
}