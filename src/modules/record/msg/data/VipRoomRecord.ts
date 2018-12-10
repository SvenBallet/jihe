module FL {

    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase - RoomRecord
     * @Description:  //玩家数据
     * @Create: DerekWu on 2017/11/10 12:04
     * @Version: V1.0
     */
    export class VipRoomRecord implements IBaseObject {

        public static readonly NAME: string = "com.linyun.base.domain.VipRoomRecord";

        /** 序列化类的名字，用来序列化对象用，必须和服务端的类型对应 */
        public readonly sClassName: string = VipRoomRecord.NAME;

        public recordID = "";
        /** 房间ID */
        public roomID = "";
        /** 房间号 */
        public roomIndex = 0;
        /** 玩家ID */
        public player1ID = "";
        /** 玩家总分 */
        public score1 = dcodeIO.Long.ZERO;
        /** 下家玩家ID */
        public player2Name = "";
        /** 下家总分 */
        public score2 = dcodeIO.Long.ZERO;
        /** 对家玩家ID */
        public player3Name = "";
        /** 对家总分 */
        public score3 = dcodeIO.Long.ZERO;
        /** 上家玩家ID */
        public player4Name = "";
        /** 上家总分 */
        public score4 = dcodeIO.Long.ZERO;
        //
        public totalHandsNum = 0;

        //
        public agentPlayerId;
        /** 俱乐部Id */
        public clubId;

        /** 房主ID */
        public hostName = "";
        /** 房间开始时间 */
        public startTime;
        /** 房间结束时间 */
        public endTime;

        public start = "";

        public end = "";
        public shareID = 0;//分享牌局记录的id，保证3天内是唯一的

        /**
         * 该房间是否已经支付了VIP钻石，0代表未支付，1代表已经支付
         */
        public isPayDiamond = 0;

        public roomType = 0;//房间类型

        public player1RealName = "";

        /** 茶楼ID*/
        public teaHouseId = 0;
        /** 茶楼楼层*/
        public teaHouseLN = 0;
        /** 大赢家*/
        public bigWin = 0;
        /** 子玩法*/
        public minorGamePlayRuleList = new Array<number>();
        public gameId: number = 0;
        public serialize(ar: ObjectSerializer): void {
            // TODO Auto-generated method stub
            // super.serialize(ar);
            let self = this;
            self.roomID = ar.sString(self.roomID);
            self.roomIndex = ar.sInt(self.roomIndex);

            //player1ID = ar.sString(player1ID);
            self.player1ID = ar.sString(self.player1ID);
            self.totalHandsNum = ar.sInt(self.totalHandsNum);


            self.score1 = ar.sLong(self.score1);
            self.player2Name = ar.sString(self.player2Name);
            self.score2 = ar.sLong(self.score2);
            self.player3Name = ar.sString(self.player3Name);
            self.score3 = ar.sLong(self.score3);
            self.player4Name = ar.sString(self.player4Name);
            self.score4 = ar.sLong(self.score4);
            self.hostName = ar.sString(self.hostName);

            self.start = ar.sString(self.start);
            //	end=ar.sString(end);
            //ar.sString(StringUtil.date2String(startTime));
            //ar.sString(StringUtil.date2String(endTime));
            self.end = ar.sString(self.end);
            self.shareID = ar.sInt(self.shareID);
            self.roomType = ar.sInt(self.roomType);
            self.player1RealName = ar.sString(self.player1RealName);
            /*//兼容老版本，这里加总局数
            if(ar.isReadMode())
            {
                end = ar.sString(end);
                shareID=Integer.parseInt(end);
            }else
            {
                String shareIDNum=""+shareID;
                shareIDNum=ar.sString(shareIDNum);
            }*/
            self.minorGamePlayRuleList = ar.sIntArray(self.minorGamePlayRuleList);
            self.gameId = ar.sInt(self.gameId);
        }
    }
}