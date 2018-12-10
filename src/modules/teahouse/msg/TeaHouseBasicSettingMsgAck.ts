module FL {
    export class TeaHouseBasicSettingMsgAck extends AbstractNewNetMsgBaseAck {

        //茶楼ID
        public teaHouseId: number = 0;

        //是否同IP禁止同桌
        public alikeIpForbindDeskmate: number = 0;

        //茶楼审核
        public checkTeaHouse: number = 0;

        //茶楼是否禁止分享
        public forbidShare: number = 0;

        //战绩重置时间
        public recordResetTime: number = 0;

        public constructor() {
            super(MsgCmdConstant.MSG_TEAHOUSE_BASIC_SETTING_ACK);
        }

        public newSerialize(ar: ObjectSerializer): void {
            let self = this;
            self.teaHouseId = ar.sInt(self.teaHouseId);
            self.alikeIpForbindDeskmate = ar.sInt(self.alikeIpForbindDeskmate);
            self.checkTeaHouse = ar.sInt(self.checkTeaHouse);
            self.forbidShare = ar.sInt(self.forbidShare);
            self.recordResetTime = ar.sInt(self.recordResetTime);
        }
    }
}