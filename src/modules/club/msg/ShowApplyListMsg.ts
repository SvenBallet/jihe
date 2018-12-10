module FL {
    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase - ShowApplyListMsg
     * @Description: 申请列表
     * @Create: HoyeLee on 2018/3/13 18:08
     * @Version: V1.0
     */
    export class ShowApplyListMsg extends NetMsgBase {
        public clubId: number = 0;		//俱乐部ID
        public page: number = 0;		//页码，第一页为1

        public constructor() {
            super(MsgCmdConstant.MSG_SHOW_APPLY_LIST);
        }
        public serialize(ar: ObjectSerializer): void {
            super.serialize(ar);
            //
            let self = this;
            self.clubId = ar.sInt(self.clubId);
            self.page = ar.sInt(self.page);
        }
    }
}