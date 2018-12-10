module FL {
    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase - ClubOptDiamondMsgAck
     * @Description:  新增钻石返回
     * @Create: ArielLiang on 2018/3/12 16:19
     * @Version: V1.0
     */
    export class ClubOptDiamondMsgAck extends NetMsgBase {
        public result: number = 0;
        public clubId: number = 0;
        public diamond: number = 0;

        constructor() {
            super(MsgCmdConstant.MSG_OPT_DIAMOND_ACK);
        }

        public serialize(ar: ObjectSerializer): void {
            super.serialize(ar);
            let self = this;
            self.result = ar.sInt(self.result);
            self.clubId = ar.sInt(self.clubId);
            self.diamond = ar.sInt(self.diamond);
        }
    }
}