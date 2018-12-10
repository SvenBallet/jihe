module FL {
    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase - NewVipRoomOverSettleAccountsMsgAck
     * @Description:  VIP房间结束结算消息
     * @Create: ArielLiang on 2018/4/20 17:56
     * @Version: V1.0
     */
    export class NewVipRoomOverSettleAccountsMsgAck extends AbstractNewNetMsgBaseAck {

        /**
         * 大赢家 -1 则没有赢家
         */
        public winPos:number = -1;

        /**
         * 自己的牌桌方位
         */
        public myTablePos:number = 0;

        /** 房主位置 */
        public creatorPos:number = 0;

        /** 房间号 */
        public vipRoomID:number = 0;

        /** 是否解散 */
        public isDismiss:boolean = false;

        /**
         * 游戏结束玩家结束信息
         */
        public roomOverPlayerInfos:Array<VipRoomOverPlayer> = new Array<VipRoomOverPlayer>();

        /**
         * 房间类型，0：正常，1：代开房，2：俱乐部房间
         */
        public createType:number = 0;

        /** 结束时间 */
        public overTimes:dcodeIO.Long = dcodeIO.Long.ZERO;

        /** 解散者位置，只有 isDismiss = true 时这个值才有效 */
        public dismissPlayerPos:number = -1;

        /**玩法 */
        public mainWay: number;
        /**玩了多少局 */
        public playNum: number;
        /**总局数 */
        public totalCount: number; 

        public constructor() {
            super(MsgCmdConstant.MSG_VIP_ROOM_OVER_SETTLE_ACCOUNTS);
        }

        public newSerialize(ar:ObjectSerializer):void {
            let self = this;
            self.winPos = ar.sByte(self.winPos);
            self.myTablePos = ar.sByte(self.myTablePos);
            self.creatorPos = ar.sByte(self.creatorPos);
            self.vipRoomID = ar.sInt(self.vipRoomID);
            self.isDismiss = ar.sBoolean(self.isDismiss);
            self.roomOverPlayerInfos = <Array<VipRoomOverPlayer>>ar.sObjArray(self.roomOverPlayerInfos);
            self.createType = ar.sByte(self.createType);
            self.overTimes = ar.sLong(self.overTimes);
            self.dismissPlayerPos = ar.sByte(self.dismissPlayerPos);
            self.mainWay = ar.sInt(self.mainWay);
            self.playNum = ar.sInt(self.playNum);
            self.totalCount = ar.sInt(self.totalCount);
        }

    }
}