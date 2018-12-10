module FL {
    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase - ClubGetInfoMsg
     * @Description:  获取房间列表
     * @Create: ArielLiang on 2018/3/15 19:32
     * @Version: V1.0
     */
    export class ClubGetInfoMsg extends NetMsgBase
    {
        public clubId:number = 0;			//需要查询的俱乐部ID
        public playerIndex:number = 0;		//需要查询的玩家ID


        constructor()
        {
            super(MsgCmdConstant.MSG_CLUB_GET_INFO);
        }

        public serialize(ar:ObjectSerializer):void
        {
            super.serialize(ar);
            let self = this;
            self.clubId = ar.sInt(self.clubId);
            self.playerIndex = ar.sInt(self.playerIndex);
        }
    }
}