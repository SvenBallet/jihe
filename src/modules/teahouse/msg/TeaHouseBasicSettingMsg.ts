module FL {
    export class TeaHouseBasicSettingMsg extends NetMsgBase {

        //茶楼ID
        public teaHouseId = 0;

        //是否同IP禁止同桌
        public alikeIpForbindDeskmate = 0;

        //茶楼审核
        public checkTeaHouse = 0;

        //茶楼是否禁止分享
        public forbidShare = 0;

        //战绩重置时间
        public recordResetTime = 0;

        //修改楼层名称
        public teahouseLayerName: string = null;

        //修改楼层公告
        public layerNotice: string = null;

        //楼层
        public teaHouseLayerId = 0;

        public constructor() {
            super(MsgCmdConstant.MSG_TEAHOUSE_BASIC_SETTING);
        }

        public serialize(ar: ObjectSerializer): void {
            super.serialize(ar);
            let self = this;
            self.teaHouseId = ar.sInt(self.teaHouseId);
            self.alikeIpForbindDeskmate = ar.sInt(self.alikeIpForbindDeskmate);
            self.checkTeaHouse = ar.sInt(self.checkTeaHouse);
            self.forbidShare = ar.sInt(self.forbidShare);
            self.recordResetTime = ar.sInt(self.recordResetTime);
            self.teahouseLayerName = ar.sString(self.teahouseLayerName);
            self.layerNotice = ar.sString(self.layerNotice);
            self.teaHouseLayerId = ar.sInt(self.teaHouseLayerId);
        }

    }
}