module FL {
    /** 进入茶楼楼层消息返回 */
    export class AccessTeaHouseLayerMsgAck extends AbstractNewNetMsgBaseAck {
        //茶楼层次（第几层）
        public teahouseLayerNum: number;

        //茶楼ID
        public teaHouseId: number;

        //楼层名称
        public teahouseLayerName: string;

        //主玩法
        public primaryType: number;

        // 局数
        public totalPlayCount: number;

        // 总人数
        public maxPlayersNum: number;

        // 子玩法数组
        public minorGamePlayRuleList: number[];//List<Integer>

        // 桌子列表
        public tableList: Array<TeaHouseDeskInfo> = new Array<TeaHouseDeskInfo>();//List<TeaHouseDeskInfo>

        // 公告
        public teahouseNotice: string;

        public constructor() {
            super(MsgCmdConstant.MSG_ACCESS_TEAHOUSE_LAYER_ACK);
        }

        public newSerialize(ar: ObjectSerializer): void {
            let self = this;
            self.teahouseLayerNum = ar.sInt(self.teahouseLayerNum);
            self.teaHouseId = ar.sInt(self.teaHouseId);
            self.teahouseLayerName = ar.sString(self.teahouseLayerName);
            self.primaryType = ar.sInt(self.primaryType);
            self.totalPlayCount = ar.sInt(self.totalPlayCount);
            self.maxPlayersNum = ar.sInt(self.maxPlayersNum);
            self.teahouseNotice = ar.sString(self.teahouseNotice);
            self.minorGamePlayRuleList = <Array<number>>ar.sIntArray(self.minorGamePlayRuleList);
            self.tableList = <Array<TeaHouseDeskInfo>>ar.sObjArray(self.tableList);
        }
    }
}