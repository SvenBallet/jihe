module FL {
    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase - MahjongActionSelectCancelMsgAck
     * @Description:  //取消麻将动作选择
     * @Create: DerekWu on 2018/6/19 16:35
     * @Version: V1.0
     */
    export class MahjongActionSelectCancelMsgAck extends AbstractNewNetMsgBaseAck {

        public constructor() {
            super(MsgCmdConstant.MSG_MAHJONG_ACTION_SELECT_CANCEL_ACK);
        }

        newSerialize(ar: FL.ObjectSerializer): void {

        }

    }
}