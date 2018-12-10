module FL {
    /** 茶楼战榜列表消息 */
    export class ShowTeaHouseWarsListMsg extends NetMsgBase {
        //茶楼id
        public teaHouseId;
        //楼层
        public teaHouseLayerNum;
        //操作类型
        public OptType;

        public static readonly WARS_LIST_FOR_TODAY = 0;		//今日战榜
        public static readonly WARS_LIST_FOR_YESTERDAY = 1;	//昨日战榜	

        public constructor() {
            super(MsgCmdConstant.MSG_SHOW_TEAHOUSE_WARS_LIST);
        }

        public serialize(ar: ObjectSerializer): void {
            super.serialize(ar);
            let self = this;
            self.teaHouseId = ar.sInt(self.teaHouseId);
            self.teaHouseLayerNum = ar.sInt(self.teaHouseLayerNum);
            self.OptType = ar.sInt(self.OptType);
        }
    }
}