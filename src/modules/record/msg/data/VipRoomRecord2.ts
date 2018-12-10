module FL {
    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase - VipRoomRecord2
     * @Description:  //玩家数据
     * @Create: ArielLiang on 2018/2/1 20:39
     * @Version: V1.0
     */
    export class VipRoomRecord2 implements IBaseObject {

        public static readonly NAME:string = "com.linyun.base.domain.VipRoomRecord2";

        /** 序列化类的名字，用来序列化对象用，必须和服务端的类型对应 */
        public readonly sClassName: string = VipRoomRecord2.NAME;

        public recordID:string="";
        /** 房间ID */
        public roomID:string="";
        /** 房间号 */
        public roomIndex:number=0;
        /** 玩家ID */
        public player1Name:string="";
        /** 玩家总分 */
        public score1:dcodeIO.Long = dcodeIO.Long.ZERO;
        /** 下家玩家ID */
        public player2Name:string="";
        /** 下家总分 */
        public score2:dcodeIO.Long = dcodeIO.Long.ZERO;
        /** 对家玩家ID */
        public player3Name:string="";
        /** 对家总分 */
        public score3:dcodeIO.Long = dcodeIO.Long.ZERO;
        /** 上家玩家ID */
        public player4Name:string="";
        /** 上家总分 */
        public score4:dcodeIO.Long = dcodeIO.Long.ZERO;
        /** 房主ID */
        public hostName:string="";
        /** 房间开始时间 */
        public startTime:string;
        /** 房间结束时间 */
        public endTime:string;

        public totalHandsNum:number=0;

        //
        public agentPlayerId:string="";


        private start:string="";

        private end:string="";

        private shareID:number = 0;//分享牌局记录的id，保证3天内是唯一的

        public roomType:number; //普通房间0   俱乐部1  代开房2

        //玩家1数据
        public player1RealName:string;

        public serialize(ar:ObjectSerializer):void {
            let self = this;
            self.roomID = ar.sString(self.roomID);
            self.roomIndex = ar.sInt(self.roomIndex);
            self.totalHandsNum = ar.sInt(self.totalHandsNum);

            self.player1Name = ar.sString(self.player1Name);
            self.score1 = ar.sLong(self.score1);
            self.player2Name = ar.sString(self.player2Name);
            self.score2 = ar.sLong(self.score2);
            self.player3Name = ar.sString(self.player3Name);
            self.score3 = ar.sLong(self.score3);
            self.player4Name = ar.sString(self.player4Name);
            self.score4 = ar.sLong(self.score4);
            self.hostName = ar.sString(self.hostName);
            self.start=ar.sString(self.start);
            self.end = ar.sString(self.end);
            self.shareID=ar.sInt(self.shareID);
            self.roomType=ar.sInt(self.roomType);
            self.player1RealName = ar.sString(self.player1RealName);
        }

    }
}