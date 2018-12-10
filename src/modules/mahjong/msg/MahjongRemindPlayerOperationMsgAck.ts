module FL {
    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase_ChangSha - MahjongRemindPlayerOperationMsgAck
     * @Description:  给客户端发送的提示玩家操作消息
     * @Create: ArielLiang on 2018/5/31 11:25
     * @Version: V1.0
     */
    export class MahjongRemindPlayerOperationMsgAck extends AbstractNewNetMsgBaseAck {

        /** 操作玩家的座位*/
        public operationPlayerPos: number = 0;

        /** 到期时间 */
        public expirationTimes: dcodeIO.Long = dcodeIO.Long.ZERO;

        public constructor() {
            super(MsgCmdConstant.MSG_MAHJONG_REMIND_PLAYER_OPERATION_ACK);
        }

        public newSerialize(ar: ObjectSerializer): void {
            this.operationPlayerPos = ar.sByte(this.operationPlayerPos);
            this.expirationTimes = ar.sLong(this.expirationTimes);
        }
    }
}