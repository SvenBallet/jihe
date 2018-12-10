module FL {

    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase - RequestStartGameMsgAck
     * @Description:  //收到的开始游戏消息
     * @Create: DerekWu on 2017/11/14 18:55
     * @Version: V1.0
     */
    export class RequestStartGameMsgAck extends NetMsgBase {

        public result:number; //结果
        public gold:number;  //玩家金币
        public roomID:number=-1;//
        public tablePos:number; //玩家所在牌桌位置
        //如果是vip桌子，这个不是0
        public vipTableID:number;
        //如果是vip桌子，房主名字
        public creatorName:string = "";
        //房主ID
        public createPlayerID:string = "";
        public players:Array<SimplePlayer>=new Array<SimplePlayer>();
        //
        public newPlayWay:number; //玩法
        public totalHand:number;  //总局数
        public currentHand:number;  //当前局数 生育局数 = 总局数 - 当前局数

        /**
         * 主玩法
         */
        public mainGamePlayRule: number = 0;

        /**
         * 子玩法
         */
        public minorGamePlayRuleList: Array<number> = new Array<number>();

        /**
         * 玩家人数
         */
        public playersNumber: number = 0;

        /**
         * 多人支付标识，0房主支付, 1房费均摊
         */
        public payType: number = 0;

        /**
         * 开房的标识，0代表普通，1代表代开房，2代表俱乐部开房
         */
        public roomType: number = 0;

        // public unused_0: number;  //代开房标识 AGENT_TABLE_FLAG = 0x12AB;
        // public unused_1: number; //房间人数限制
        // public unused_2: number; // 多人支付标识，0房主支付 1多人支付
        // public unused_3: number;

        constructor() {
            super(MsgCmdConstant.MSG_GAME_START_GAME_REQUEST_ACK);
        }

        public serialize(ar:ObjectSerializer):void {
            super.serialize(ar);
            let self = this;
            //
            self.result=ar.sInt(self.result);
            self.gold=ar.sInt(self.gold);
            self.roomID=ar.sInt(self.roomID);
            self.tablePos=ar.sInt(self.tablePos);
            //
            self.vipTableID=ar.sInt(self.vipTableID);
            self.creatorName=ar.sString(self.creatorName);
            self.createPlayerID = ar.sString(self.createPlayerID);
            self.players=<Array<SimplePlayer>>ar.sObjArray(self.players);

            //
            self.newPlayWay=ar.sInt(self.newPlayWay);
            self.totalHand=ar.sInt(self.totalHand);
            self.currentHand=ar.sInt(self.currentHand);
            //

            self.mainGamePlayRule = ar.sInt(self.mainGamePlayRule);
            self.minorGamePlayRuleList = <Array<number>>ar.sIntArray(self.minorGamePlayRuleList);
            self.playersNumber = ar.sInt(self.playersNumber);
            self.payType = ar.sInt(self.payType);
            self.roomType = ar.sInt(self.roomType);
        }

    }

}