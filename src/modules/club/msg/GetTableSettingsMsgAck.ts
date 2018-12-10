module FL {
    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase - GetTableSettingsMsgAck
     * @Description:  获取开房设置返回
     * @Create: ArielLiang on 2018/3/15 17:05
     * @Version: V1.0
     */
    export class GetTableSettingsMsgAck extends NetMsgBase
    {
        public clubId:number = 0;
        public settings:Array<ClubPlanSetting> = null;

        constructor()
        {
            super(MsgCmdConstant.MSG_GET_TABLE_SETTINGS_ACK);
        }


        public serialize(ar:ObjectSerializer):void
        {
            super.serialize(ar);
            let self = this;
            self.clubId = ar.sInt(self.clubId);
            self.settings = <Array<ClubPlanSetting>>ar.sObjArray(self.settings);
        }
    }
}