module FL {
    /** 大赢家相关消息 */
    export class BigWinnerShowAndOptMsg extends NetMsgBase {
        //茶楼ID
        public teaHouseId;
        //楼层
        public houseLayerNum;
        //成员ID
        public playerIndex = 0;
        //操作类型
        public optType;

        public static readonly SHOW_BIG_WINNER_LIST = 0;
        public static readonly DELETE_BIG_WINNER = 1;
        public static readonly DELETE_ALL_BIG_WINNER = 2;

        public constructor() {
            super(MsgCmdConstant.MSG_BIG_WINNER_SHOW_AND_OPT);
        }

        public serialize(ar: ObjectSerializer): void {
            super.serialize(ar);
            let self = this;
            self.teaHouseId = ar.sInt(self.teaHouseId);
            self.houseLayerNum = ar.sInt(self.houseLayerNum);
            self.optType = ar.sInt(self.optType);
            self.playerIndex = ar.sInt(self.playerIndex);
        }
    }
}