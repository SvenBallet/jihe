module FL {
    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase - MahjongChangShaReminderHaiDiMoMsgAck
     * @Description:  // 长沙麻将提示是否海底摸一把
     * @Create: DerekWu on 2018/6/28 11:13
     * @Version: V1.0
     */
    export class MahjongChangShaReminderHaiDiMoMsgAck extends AbstractNewNetMsgBaseAck {

        constructor() {
            super(MsgCmdConstant.MSG_MAHJONG_CHANG_SHA_REMINDER_HAI_DI_MO_ACK);
        }

        public newSerialize(ar:ObjectSerializer):void {

        }

    }
}