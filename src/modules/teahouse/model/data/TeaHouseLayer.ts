module FL {
    export class TeaHouseLayer implements IBaseObject {
        public static readonly NAME: string = "com.linyun.xgamenew.domain.teahouse.TeaHouseLayer";
        /** 序列化类的名字，用来序列化对象用，必须和服务端的类型对应 */
        public readonly sClassName: string = TeaHouseLayer.NAME;
        //id
        public id;

        //茶楼层次（第几层）
        public teahouseLayerNum;

        //茶楼ID
        public teaHouseId;

        //主玩法
        public primaryType;

        //楼层名称
        public teahouseLayerName;

        // 子玩法数组
        public minorGamePlayRuleList: Array<number> = new Array<number>();
        // 局数
        public totalPlayCount;
        // 总人数
        public maxPlayersNum;

        // 子玩法字符串
        public playWay;

        // 楼层公告
        public layerNotice;

        public serialize(ar: ObjectSerializer): void {
            let self = this;
            self.teaHouseId = ar.sInt(self.teaHouseId);
            self.teahouseLayerNum = ar.sInt(self.teahouseLayerNum);
            self.teahouseLayerName = ar.sString(self.teahouseLayerName);
            self.primaryType = ar.sInt(self.primaryType);
            self.minorGamePlayRuleList = <Array<number>>ar.sIntArray(self.minorGamePlayRuleList);
            self.totalPlayCount = ar.sInt(self.totalPlayCount);
            self.maxPlayersNum = ar.sInt(self.maxPlayersNum);
            self.layerNotice = ar.sString(self.layerNotice);
        }
    }
}