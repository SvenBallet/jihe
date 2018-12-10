module FL {
    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase - SetTableSettingsMsgAck
     * @Description:  开房设置返回
     * @Create: ArielLiang on 2018/3/15 16:57
     * @Version: V1.0
     */
    export class SetTableSettingsMsgAck extends NetMsgBase
    {
        public result:number = 0;
        public clubId:number = 0;

        public static readonly SUCCESS:number = 0;
        public static readonly ERROR:number = 1;
        public static readonly PRIV_ERROR:number = 2; //权限不足

        constructor()
        {
            super(MsgCmdConstant.MSG_SET_TABLE_SETTINGS_ACK);
        }

        public serialize(ar:ObjectSerializer):void
        {
            super.serialize(ar);
            let self = this;
            self.result = ar.sInt(self.result);
            self.clubId = ar.sInt(self.clubId);
        }
    }
}