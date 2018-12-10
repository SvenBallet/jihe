module FL {
    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase - ClubGetInfoMsgAck
     * @Description:  获取房间列表返回
     * @Create: ArielLiang on 2018/3/15 19:35
     * @Version: V1.0
     */
    export class ClubGetInfoMsgAck extends NetMsgBase
    {
        public clubId:number = 0;			//需要查询的俱乐部ID
        public playerIndex:number = 0;		//需要查询的玩家ID
        public isMember:boolean = false;//是否在该俱乐部
        public club:Array<Club> = null;		//查询返回的俱乐部对象


        constructor()
        {
            super(MsgCmdConstant.MSG_CLUB_GET_INFO_ACK);
        }

        public serialize(ar:ObjectSerializer):void
        {
            super.serialize(ar);
            let self = this;
            self.clubId = ar.sInt(self.clubId);
            self.playerIndex = ar.sInt(self.playerIndex);
            self.isMember = ar.sBoolean(self.isMember);
            self.club = <Array<Club>>ar.sObjArray(self.club);
        }
    }
}