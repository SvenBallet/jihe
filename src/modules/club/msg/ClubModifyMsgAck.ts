module FL {
    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase - ClubModifyMsgAck
     * @Description: 公告编辑返回
     * @Create: HoyeLee on 2018/3/13 10:58
     * @Version: V1.0
     */
    export class ClubModifyMsgAck extends NetMsgBase {
        public result: number = 0;

        public static readonly SUCCESS: number = 0;
        public static readonly ERROR: number = 1;
        public static readonly HAS_BAD_WORD: number = 2;//存在敏感字
        public constructor() {
            super(MsgCmdConstant.MSG_CLUB_MODIFY_ACK)
        }
        public serialize(ar: ObjectSerializer): void {
            super.serialize(ar);
            //
            let self = this;
            self.result = ar.sInt(self.result);
        }
    }
}