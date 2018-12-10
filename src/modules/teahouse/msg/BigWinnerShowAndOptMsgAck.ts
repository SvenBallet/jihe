module FL {
    /** 大赢家相关消息返回 */
    export class BigWinnerShowAndOptMsgAck extends AbstractNewNetMsgBaseAck {
        //茶楼ID
        public teaHouseId;
        //楼层
        public houseLayerNum;
        //操作类型
        public optType;
        //成员ID
        public playerIndex = 0;
        //操作结果
        public result = 0;
        //大赢家列表
        public bigWinner: Array<TeaHouseMember> = null;		//大赢家列表 List<TeaHouseMember>

        public static readonly BACK_LIST_OPERATION = 0;		//返回列表
        public static readonly DELETE_SUCCESS = 1;   //删除成功
        public static readonly DELETE_ALL_SUCCESS = 2; //删除全部成功

        public constructor() {
            super(MsgCmdConstant.MSG_BIG_WINNER_SHOW_AND_OPT_ACK);
        }

        public newSerialize(ar: ObjectSerializer): void {
            let self = this;
            self.teaHouseId = ar.sInt(self.teaHouseId);
            self.houseLayerNum = ar.sInt(self.houseLayerNum);
            self.optType = ar.sInt(self.optType);
            self.playerIndex = ar.sInt(self.playerIndex);
            self.bigWinner = <Array<TeaHouseMember>>ar.sObjArray(self.bigWinner);
        }
    }
}