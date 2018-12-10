module FL {
    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase - VipRoomRecordAckMsg2
     * @Description:  //
     * @Create: ArielLiang on 2018/2/1 20:38
     * @Version: V1.0
     */
    export class VipRoomRecordAckMsg2 extends NetMsgBase {

        /** 玩家所有VIP房间记录列表 */
        public roomRecords:Array<VipRoomRecord2>;

        constructor() {
            super(MsgCmdConstant.MSG_GET_VIP_ROOM_RECORD_ACK2);
        }

        public serialize(ar:ObjectSerializer):void {
            super.serialize(ar);
            let self = this;
            self.roomRecords = <Array<VipRoomRecord2>>ar.sObjArray(self.roomRecords);
        }
    }
}