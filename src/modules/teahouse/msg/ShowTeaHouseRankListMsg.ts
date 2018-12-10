module FL {
    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase - ShowTeaHouseRankListMsg
     * @Description:  //
     * @Create: DerekWu on 2018/9/13 17:42
     * @Version: V1.0
     */
    export class ShowTeaHouseRankListMsg extends NetMsgBase {
        //茶楼ID
        public teaHouseId: number = 0;
        //操作类型（0：今日排行 ， 1：昨日排行，2：本周排行，3：上周排行，4本月排行）
        public operationType: number = 0;
        //页码
        public page: number = 0;

        public constructor() {
            super(MsgCmdConstant.MSG_SHOW_TEAHOUSE_RANKLIST);
        }

        public serialize(ar: ObjectSerializer): void {
            super.serialize(ar);
            let self = this;
            self.teaHouseId = ar.sInt(self.teaHouseId);
            self.operationType = ar.sInt(self.operationType);
            self.page = ar.sInt(self.page);
        }

    }
}