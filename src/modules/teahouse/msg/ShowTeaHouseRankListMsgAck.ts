module FL {
    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase - ShowTeaHouseRankListMsgAck
     * @Description:  //
     * @Create: DerekWu on 2018/9/13 17:47
     * @Version: V1.0
     */
    export class ShowTeaHouseRankListMsgAck extends AbstractNewNetMsgBaseAck {

        //茶楼ID
        public teaHouseId: number = 0;
        //操作类型（0：今日排行 ， 1：昨日排行，2：本周排行，3：上周排行，4本月排行）
        public operationType: number = 0;
        //页码
        public page: number = 0;
        //总页码
        public sumPage: number = 0;
        //钻石消耗
        public sumExpendDiamondNum: number = 0;
        //总场次
        public sumPlayNum: number = 0;
        //玩家类型
        public playerType: number = 0;
        //排行榜数据列表
        public rankList: Array<TeaHouseRankItem> = null;

        public constructor() {
            super(MsgCmdConstant.MSG_SHOW_TEAHOUSE_RANKLIST_ACK);
        }

        public newSerialize(ar: ObjectSerializer): void {
            let self = this;
            self.teaHouseId = ar.sInt(self.teaHouseId);
            self.operationType = ar.sInt(self.operationType);
            self.page = ar.sInt(self.page);
            self.sumPage = ar.sInt(self.sumPage);
            self.sumExpendDiamondNum = ar.sInt(self.sumExpendDiamondNum);
            self.sumPlayNum = ar.sInt(self.sumPlayNum);
            self.playerType = ar.sInt(self.playerType);
            self.rankList = <Array<TeaHouseRankItem>> ar.sObjArray(self.rankList);
        }

    }
}