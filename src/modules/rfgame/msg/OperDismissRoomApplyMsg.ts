module FL {
    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase - OperDismissRoomApplyMsg
     * @Description:  操作其他玩家的解散房间申请
     * @Create: ArielLiang on 2018/4/19 10:01
     * @Version: V1.0
     */
    export class OperDismissRoomApplyMsg extends NetMsgBase {

        /**
         * 操作，0：等待中, 1：同意解散, 2:不同意解散
         */
        public operateType:number = 0;

        public constructor() {
            super(MsgCmdConstant.MSG_OPER_APPLY_DISMISS_ROOM);
        }

        public serialize(ar:ObjectSerializer):void {
            super.serialize(ar);
            let self = this;
            self.operateType = ar.sByte(self.operateType);
        }
    }
}