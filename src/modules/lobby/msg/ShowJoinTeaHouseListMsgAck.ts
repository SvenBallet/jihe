module FL {
    export class ShowJoinTeaHouseListMsgAck extends AbstractNewNetMsgBaseAck {
        public page: number;			//页码，第一页为1
        public size: number;			//页大小
        public result: Array<TeaHouse>;	//俱乐部对象列表List<TeaHouse>

        public constructor() {
            super(MsgCmdConstant.MSG_SHOW_JOIN_TEAHOUSE_LIST_ACK);
        }

        public newSerialize(ar: ObjectSerializer): void {
            let self = this;
            self.page = ar.sInt(self.page);
            self.size = ar.sInt(self.size);
            self.result = <Array<TeaHouse>>ar.sObjArray(self.result);
        }
    }
}