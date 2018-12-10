module FL {
    /** 修改茶楼楼层玩法消息 */
    export class ChangeTeaHouseLayerRuleMsg extends NetMsgBase {
        /** 茶楼ID */
        public teaHouseId;
        /** 楼层*/
        public teaHouseLayer;
        /** 主玩法*/
        public mainWay: number;
        /** 楼层名称*/
	    public teahouseLayerName: string;
        /** 子玩法*/
        public playWay: number[] = [];// List<Integer>
        /** 总局数*/
        public totalPlayCount;
        /** 总人数*/
        public maxPlayersNum;

        public constructor() {
            super(MsgCmdConstant.MSG_CHANGE_RULE_TEAHOUSE_LAYER);
        }

        public serialize(ar: ObjectSerializer): void {
            super.serialize(ar);
            let self = this;
            self.teaHouseId = ar.sInt(self.teaHouseId);
            self.teaHouseLayer = ar.sInt(self.teaHouseLayer);
            self.mainWay = ar.sInt(self.mainWay);
            self.teahouseLayerName = ar.sString(self.teahouseLayerName);
            self.playWay = <number[]>ar.sIntArray(self.playWay);
            self.totalPlayCount = ar.sInt(self.totalPlayCount);
            self.maxPlayersNum = ar.sInt(self.maxPlayersNum);
        }
    }
}