module FL {
    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase - GetVipRoomListMsgAck
     * @Description:  对战记录返回消息
     * @Create: DerekWu on 2017/11/10 11:13
     * @Version: V1.0
     */
    export class GetVipRoomListMsgAck extends NetMsgBase {

        /***/
        public roomRecords:Array<VipRoomRecord>;
        public nameList:Array<string>;//存放代开房战绩首位玩家id昵称

        constructor() {
            super(MsgCmdConstant.MSG_GET_VIP_ROOM_RECORD_ACK);
        }

        public serialize(ar:ObjectSerializer):void {
            super.serialize(ar);
            let self = this;
            self.roomRecords = <Array<VipRoomRecord>> ar.sObjArray(self.roomRecords);
            self.nameList = <Array<string>>ar.sStringArray(self.nameList);

        }

    }
}