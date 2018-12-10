
module FL {
    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase - ClubDismissMsgAck
     * @Description: 解散俱乐部返回
     * @Create: HoyeLee on 2018/3/13 15:16
     * @Version: V1.0
     */
    export class ClubDismissMsgAck extends NetMsgBase {
        public result: number = 0;

        public static readonly SUCCESS: number = 0;
        public static readonly ERROR: number = 1;
        public static readonly CLUB_NOT_FOUND: number = 2;
        public static readonly PRIV_ERROR: number = 3;			//权限不足，无法解散俱乐部
        public static readonly HAS_DIAMOND_ERROR: number = 4;	//还有钻石，无法解散俱乐部
        public static readonly HAS_TABLE_ERROR: number = 5;	//还有代开房没结束，无法解散俱乐部

        public constructor() {
            super(MsgCmdConstant.MSG_CLUB_DISMISS_ACK);
        }
        public serialize(ar: ObjectSerializer): void {
            super.serialize(ar);
            //
            let self = this;
            self.result = ar.sInt(self.result);
        }
    }
}