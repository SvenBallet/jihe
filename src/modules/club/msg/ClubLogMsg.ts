module FL {
    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase - ClubLogMsg
     * @Description: 日志记录
     * @Create: HoyeLee on 2018/3/12 16:19
     * @Version: V1.0
     */
    export class ClubLogMsg extends NetMsgBase {


        public clubId: number = 0;
        public page: number = 0;

        public constructor() {
            // msgCMD = MsgCmdConstant.MSG_CLUB_LOG;
            super(MsgCmdConstant.MSG_CLUB_LOG);
        }

        public serialize(ar: ObjectSerializer): void {
            super.serialize(ar);
            //
            let self = this;
            self.clubId = ar.sInt(self.clubId);
            self.page = ar.sInt(self.page);
        }
    }
}