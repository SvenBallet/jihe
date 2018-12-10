module FL {
    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase - SetTableSettingsMsg
     * @Description:  开房设置
     * @Create: ArielLiang on 2018/3/15 16:41
     * @Version: V1.0
     */
    export class SetTableSettingsMsg extends NetMsgBase
    {
        public clubId:number = 0;		//俱乐部ID
        /**
         * 主玩法
         */
        public mainGamePlayRule:number = 0;
        /**
         * 子玩法
         */
        public minorGamePlayRuleList:Array<number> = new Array<number>();
        public autoKaiFang:boolean = false;	//是否自动开房
        public personNum:number = 0;	//玩家人数
        public quanNum:number = 0;		//圈数
        public clientData:string;	//客户端数据

        constructor()
        {
            super(MsgCmdConstant.MSG_SET_TABLE_SETTINGS);
        }

        public serialize(ar:ObjectSerializer):void
        {
            super.serialize(ar);
            let self = this;
            self.clubId = ar.sInt(self.clubId);
            self.mainGamePlayRule = ar.sInt(self.mainGamePlayRule);
            self.minorGamePlayRuleList = ar.sIntArray(self.minorGamePlayRuleList);
            self.autoKaiFang = ar.sBoolean(self.autoKaiFang);
            self.personNum = ar.sInt(self.personNum);
            self.quanNum = ar.sInt(self.quanNum);
            self.clientData = ar.sString(self.clientData);
        }
    }
}