module FL {
    /** 创建茶楼消息 */
    export class CreateTeaHouseMsg extends NetMsgBase {
        /** 创建第几层 */
        public teahouseLayerNum: number;
        /** 名称,默认主玩法名称 */
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
            super(MsgCmdConstant.MSG_CREATE_TEAHOUSE);
        }

        public serialize(ar: ObjectSerializer): void {
            super.serialize(ar);
            let self = this;
            self.teahouseLayerNum = ar.sInt(self.teahouseLayerNum);
            self.teahouseLayerName = ar.sString(self.teahouseLayerName);
            self.totalPlayCount = ar.sInt(self.totalPlayCount);
            self.maxPlayersNum = ar.sInt(self.maxPlayersNum);
            self.primaryType = ar.sInt(self.primaryType);
            self.playWayList = <Array<number>>ar.sIntArray(self.playWayList);
        }
    }
}