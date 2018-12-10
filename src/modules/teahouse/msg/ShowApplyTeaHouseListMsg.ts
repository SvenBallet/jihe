module FL {
    /** 显示申请成员列表 */
    export class ShowApplyTeaHouseListMsg extends NetMsgBase {
        public teaHouseId = 0;		//茶楼ID
        public page = 0;		//页码，第一页为1
        public content = "";		//搜索的字段

        public constructor() {
            super(MsgCmdConstant.MSG_TEAHOUSE_SHOW_APPLY_LIST);
        }

        public serialize(ar: ObjectSerializer): void {
            super.serialize(ar);
            //
            let self = this;
            self.teaHouseId = ar.sInt(self.teaHouseId);
            self.page = ar.sInt(self.page);
            self.content = ar.sString(self.content);
        }
    }
}