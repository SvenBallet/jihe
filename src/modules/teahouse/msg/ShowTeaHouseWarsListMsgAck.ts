module FL {
    /** 茶楼战榜列表消息返回 */
    export class ShowTeaHouseWarsListMsgAck extends AbstractNewNetMsgBaseAck {
        //茶楼id
        public teaHouseId;
        //楼层
        public teaHouseLayerNum;
        //操作类型
        public OptType;
        //返回的战榜列表
        public teaHouseWarList = new Array<TeaHouseWarList>();


        public constructor() {
            super(MsgCmdConstant.MSG_SHOW_TEAHOUSE_WARS_LIST_ACK);
        }

        public newSerialize(ar: ObjectSerializer): void {
            let self = this;
            self.teaHouseId = ar.sInt(self.teaHouseId);
            self.teaHouseLayerNum = ar.sInt(self.teaHouseLayerNum);
            self.OptType = ar.sInt(self.OptType);
            self.teaHouseWarList = <Array<TeaHouseWarList>>ar.sObjArray(self.teaHouseWarList);
        }
    }
}