module FL {
    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase - MahjongGameOverMsgAck
     * @Description: 麻将游戏结束消息
     * @Create: ArielLiang on 2018/6/15 20:23
     * @Version: V1.0
     */
    export class MahjongGameOverMsgAck extends AbstractNewNetMsgBaseAck {

        /** 我的游戏结果（1=自摸 2=胡牌（接炮） 3=点炮 4=赢了 5=不输不赢 6=输了 7=流局） */
        public myGameResult:number = 0;
        /**
         * 自己的牌桌方位
         */
        public myTablePos:number = 0;
        /** 房间号 (0=金币场，其他为房间号)*/
        public vipRoomID:number = 0;
        /** 房间类型，0：正常，1：代开房，2：俱乐部房间，3：茶馆房间 */
        public createType:number = 0;
        /** 玩家信息列表 */
        public playerInfos:Array<MahjongGameOverPlayerInfo>;
        /** 标记牌 */
        public flagCard:number = 0;
        /** 玩法字符串，暂时没用以后再拓展 */
        public playWayDesc:string;
        /** 结束时间 */
        public overTimes:dcodeIO.Long = dcodeIO.Long.ZERO;
        /** 是否房间结束 */
        public isRoomOver:boolean = false;

        /** 计分详细条目列表 */
        public scoreDetails:Array<MahjongGameOverScoreDetailItem>;

        /** 房间ID，vip房间 = 2002 GameConstant.VIP_ROOM_ID， 金币场的话为其他 */
        public roomID:number = 0;

        constructor() {
            super(MsgCmdConstant.MSG_MAHJONG_GAME_OVER_ACK);
        }

        public newSerialize(ar:ObjectSerializer):void {
            this.myGameResult = ar.sByte(this.myGameResult);
            this.myTablePos = ar.sByte(this.myTablePos);
            this.vipRoomID = ar.sInt(this.vipRoomID);
            this.createType = ar.sByte(this.createType);
            this.playerInfos = <Array<MahjongGameOverPlayerInfo>> ar.sObjArray(this.playerInfos);
            this.flagCard = ar.sByte(this.flagCard);
            this.playWayDesc = ar.sString(this.playWayDesc);
            this.overTimes = ar.sLong(this.overTimes);
            this.isRoomOver = ar.sBoolean(this.isRoomOver);
            this.scoreDetails = <Array<MahjongGameOverScoreDetailItem>>ar.sObjArray(this.scoreDetails);
            this.roomID = ar.sInt(this.roomID);
        }

    }
}