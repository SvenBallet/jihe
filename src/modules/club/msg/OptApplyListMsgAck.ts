module FL {
    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase - OptApplyListMsgAck
     * @Description: 操作申请列表返回
     * @Create: HoyeLee on 2018/3/13 19:10
     * @Version: V1.0
     */
    export class OptApplyListMsgAck extends NetMsgBase {
        public result: number = 0; //成功或失败，定义如下

        public static readonly SUCCESS = 0;
        public static readonly ERROR = 1;
        public static readonly CLUB_NOT_FOUND = 2;
        public static readonly PRIV_ERROR = 3;

        public constructor() {
            super(MsgCmdConstant.MSG_OPT_APPLY_LIST_ACK);
        }
        public serialize(ar: ObjectSerializer): void {
            super.serialize(ar);
            //
            let self = this;
            self.result = ar.sInt(self.result);
        }
    }
}