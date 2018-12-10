module FL {
    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase - ShowApplyListMsgAck
     * @Description: 申请列表返回
     * @Create: HoyeLee on 2018/3/13 18:08
     * @Version: V1.0
     */
    export class ShowApplyListMsgAck extends NetMsgBase {
        public result: number = 0;		//操作结果，定义如下
        public page: number = 0;		//页码，第一页为1
        public size: number = 0;		//页大小
        public applyList: Array<ClubApply> = null;	//申请对象列表

        public static readonly SUCCESS = 0;
        public static readonly ERROR = 1;
        public static readonly PRIV_ERROR = 2;
        public static readonly CLUB_NOT_FOUND = 3;

        public constructor() {
            super(MsgCmdConstant.MSG_SHOW_APPLY_LIST_ACK);
        }
        public serialize(ar: ObjectSerializer): void {
            super.serialize(ar);
            //
            let self = this;
            self.result = ar.sInt(self.result);
            self.page = ar.sInt(self.page);
            self.size = ar.sInt(self.size);
            self.applyList = <Array<ClubApply>>ar.sObjArray(self.applyList);
        }
    }
}