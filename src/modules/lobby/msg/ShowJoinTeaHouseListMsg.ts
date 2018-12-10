module FL {
    export class ShowJoinTeaHouseListMsg extends NetMsgBase {
        public content: string;	//搜索名字或者ID
        public page: number;		//页码，第一页为1

        public constructor() {
            super(MsgCmdConstant.MSG_SHOW_JOIN_TEAHOUSE_LIST);
        }

        public serialize(ar: ObjectSerializer): void {
            super.serialize(ar);
            //
            let self = this;
            self.content = ar.sString(self.content);
            self.page = ar.sInt(self.page);
        }
    }
}