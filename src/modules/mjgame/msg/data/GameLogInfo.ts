module FL {
    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase - GameLogInfo
     * @Description:  // 游戏日志序列化类
     * @Create: DerekWu on 2018/1/17 16:56
     * @Version: V1.0
     */
    export class GameLogInfo implements IBaseObject {

        public static readonly NAME: string = "com.linyun.xgame.domain.GameLogInfo";
        /** 序列化类的名字，用来序列化对象用，必须和服务端的类型对应 */
        public readonly sClassName: string = GameLogInfo.NAME;

        //
        public gameTableID: string = "";
        public handIndex: number = 0;//第几局
        public handsTotal: number = 0;//总共几局
        public playWay: number = 0;//玩法
        public vipRoomIndex: number = 0;
        public players: Array<SimplePlayer>;
        public playerOps: Array<PlayerOperationDesc>;
        public shareID: number = 0;

        /**
         * 主玩法
         */
        public mainGamePlayRule: number = 0;

        /**
         * 子玩法
         */
        public minorGamePlayRuleList: Array<number> = new Array<number>();


        /** 茶楼ID */
        public teaHouseId = 0;
        /** 楼层  */
        public teaHouseLayer = 0;
        /** 桌子序号 */
        public teaHouseDesk = 0;

        /** 麻将癞子列表，没有则是null */
        public laiZiCards: Array<number>;

        /** 麻将花牌列表，没有则是null */
        public huaCards: Array<number>;

        /** 开始时间  */
        public startTimes:dcodeIO.Long = dcodeIO.Long.ZERO;

        /** 房主ID */
        public createPlayerID: string;
        /** 庄家位置 */
        public dealerPos: number = 0;

        //
        public serialize(ar: ObjectSerializer): void {
            let self = this;
            self.gameTableID = ar.sString(self.gameTableID);
            self.handIndex = ar.sInt(self.handIndex);
            self.handsTotal = ar.sInt(self.handsTotal);
            self.playWay = ar.sInt(self.playWay);
            self.vipRoomIndex = ar.sInt(self.vipRoomIndex);
            //
            self.players = <Array<SimplePlayer>>ar.sObjArray(self.players);
            //
            self.playerOps = <Array<PlayerOperationDesc>>ar.sObjArray(self.playerOps);

            self.mainGamePlayRule = ar.sInt(self.mainGamePlayRule);
            self.minorGamePlayRuleList = <Array<number>>ar.sIntArray(self.minorGamePlayRuleList);

            self.teaHouseId = ar.sInt(self.teaHouseId);
            self.teaHouseLayer = ar.sInt(self.teaHouseLayer);
            self.teaHouseDesk = ar.sInt(self.teaHouseDesk);
            self.laiZiCards = <Array<number>>ar.sByteArray(self.laiZiCards);
            self.huaCards = <Array<number>>ar.sByteArray(self.huaCards);
            self.startTimes = ar.sLong(self.startTimes);

            self.createPlayerID = ar.sString(self.createPlayerID);
            self.dealerPos = ar.sInt(self.dealerPos);
        }

    }
}