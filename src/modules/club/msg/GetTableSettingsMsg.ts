module FL {
    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase - GetTableSettingsMsg
     * @Description:  获取开房设置
     * @Create: ArielLiang on 2018/3/15 17:01
     * @Version: V1.0
     */
    export class GetTableSettingsMsg extends NetMsgBase
    {
        public clubId:number = 0;

        constructor()
        {
            super(MsgCmdConstant.MSG_GET_TABLE_SETTINGS);
        }

        public serialize(ar:ObjectSerializer):void
        {
            super.serialize(ar);
            let self = this;
            self.clubId = ar.sInt(self.clubId);
        }
    }
}