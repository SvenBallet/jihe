module FL {
    export class ShowApplyTeaHouseListMsgAck extends AbstractNewNetMsgBaseAck {

        public result = 0; // 操作结果
        public page = 0; // 页码，第一页为1
        public size = 0; // 页大小
        public totalPage = 0; //总页数
        public applyList: Array<TeaHouseApply> = null; // 申请对象列表

        public constructor() {
            super(MsgCmdConstant.MSG_TEAHOUSE_SHOW_APPLY_LIST_ACK);
        }

        public newSerialize(ar: ObjectSerializer): void {
            //
            let self = this;
            self.result = ar.sInt(self.result);
            self.page = ar.sInt(self.page);
            self.size = ar.sInt(self.size);
            self.totalPage = ar.sInt(self.totalPage);
            self.applyList = <Array<TeaHouseApply>>ar.sObjArray(self.applyList);
        }
    }
}