module FL {
    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase - ApplyDismissRoomMsgAck
     * @Description:  申请解散房间结果通知
     * @Create: ArielLiang on 2018/4/19 9:57
     * @Version: V1.0
     */
    export class ApplyDismissRoomMsgAck extends AbstractNewNetMsgBaseAck {
        /**
         * 申请解散房间的玩家座位号
         */
        public applyPlayerPos: number = 0;

        /**
         * 文字提示
         */
        public textHint: string = "";

        /**
         * 剩余时间,单位：秒
         */
        public remainTime: number = 0;

        /**
         * 玩家状态，list索引为座位号，0：等待中，1：已同意，2：已拒绝
         */
        public playerStatus: Array<number> = new Array<number>();

        /** 是否拒绝解散 */
        public isReject:boolean = false;

        public constructor() {
            super(MsgCmdConstant.MSG_APPLY_DISMISS_ROOM_ACK);
        }

        public newSerialize(ar: ObjectSerializer): void {
            let self = this;
            self.applyPlayerPos = ar.sByte(self.applyPlayerPos);
            self.textHint = ar.sString(self.textHint);
            self.remainTime = ar.sInt(self.remainTime);
            self.playerStatus = <Array<number>>ar.sIntArray(self.playerStatus);
            self.isReject = ar.sBoolean(self.isReject);
        }
    }
}