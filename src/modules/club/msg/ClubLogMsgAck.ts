module FL {
    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase - ClubLogMsgAck
     * @Description: 日志记录返回
     * @Create: HoyeLee on 2018/3/12 16:19
     * @Version: V1.0
     */
    export class ClubLogMsgAck extends NetMsgBase {
        public clubId: number = 0;
        public page: number = 0;
        public size: number = 0;
        public logs: Array<ClubOperationLog> = null;

        public constructor() {
            super(MsgCmdConstant.MSG_CLUB_LOG_ACK);
        }

        public serialize(ar: ObjectSerializer): void {
            super.serialize(ar);
            //
            let self = this;
            self.clubId = ar.sInt(self.clubId);
            self.page = ar.sInt(self.page);
            self.size = ar.sInt(self.size);
            self.logs = <Array<ClubOperationLog>>ar.sObjArray(self.logs);
        }
    }
}