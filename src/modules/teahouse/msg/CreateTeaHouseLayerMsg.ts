module FL {
    /** 创建茶楼楼层消息 */
    export class CreateTeaHouseLayerMsg extends NetMsgBase {
        /** 茶楼ID */
        public teaHouseId: number;
        /** 创建第几层 */
        public teahouseLayerNum: number;
        /** 名称 */
        public teahouseLayerName: string;
        /** 主玩法*/
        public primaryType: number;
        /** 总局数 */
        public totalPlayCount: number;
        /** 总人数 */
        public maxPlayersNum: number;
        /** 子玩法数组*/
        public playWayList: Array<number> = new Array<number>();

        public constructor() {
            super(MsgCmdConstant.MSG_CREATE_TEAHOUSE_LAYER);
        }

        public serialize(ar: ObjectSerializer): void {
            super.serialize(ar);
            let self = this;
            self.teaHouseId = ar.sInt(self.teaHouseId);
            self.teahouseLayerNum = ar.sInt(self.teahouseLayerNum);
            self.teahouseLayerName = ar.sString(self.teahouseLayerName);
            self.totalPlayCount = ar.sInt(self.totalPlayCount);
            self.maxPlayersNum = ar.sInt(self.maxPlayersNum);
            self.primaryType = ar.sInt(self.primaryType);
            self.playWayList = <Array<number>>ar.sIntArray(self.playWayList);
        }
    }
}