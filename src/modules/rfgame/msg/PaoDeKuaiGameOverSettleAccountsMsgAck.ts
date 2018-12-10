module FL {
    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase - PaoDeKuaiGameOverSettleAccountsMsgAck
     * @Description:  跑的快游戏结束结算消息
     * @Create: ArielLiang on 2018/4/23 15:33
     * @Version: V1.0
     */
    export class PaoDeKuaiGameOverSettleAccountsMsgAck  extends AbstractNewNetMsgBaseAck {

        /** 游戏结果（0=不输不赢，1=赢了，2=输了）*/
        public result:number = 0;

        /** 游戏结束玩家信息 */
        public playerInfos:Array<PaoDeKuaiGameOverPlayer> = null;

        /** 房主位置 */
        public creatorPos:number = 0;

        /** 庄家位置 */
        public zhuangPos:number = 0;

        /** 房间号 */
        public vipRoomID:number = 0;

        /** 结束时间 */
        public overTimes:dcodeIO.Long = dcodeIO.Long.ZERO;

        /**
         * 总局数
         */
        public totalPlayCount:number = 0;

        /**
         * 密码
         */
        public currPlayCount:number = 0;

        /**
         * 主玩法
         */
        public mainGamePlayRule:number = 0;

        /**
         * 子玩法
         */
        public subGamePlayRuleList:Array<number> = null;

        /** 是否房间结束，默认false（不是则按钮显示继续游戏，是则显示查看牌局结算） */
        public isRoomOver:boolean = false;

        /** 未发出的牌列表*/
        public residueCards: Array<number> = [];

        public constructor() {
            super(MsgCmdConstant.MSG_PAODEKUAI_GAME_OVER_SETTLE_ACCOUNTS);
        }

        public newSerialize(ar:ObjectSerializer):void {
            let self = this;
            self.result = ar.sByte(self.result);
            self.playerInfos = <Array<PaoDeKuaiGameOverPlayer>>ar.sObjArray(self.playerInfos);
            self.creatorPos = ar.sByte(self.creatorPos);
            self.zhuangPos = ar.sByte(self.zhuangPos);
            self.vipRoomID = ar.sInt(self.vipRoomID);
            self.overTimes = ar.sLong(self.overTimes);
            self.totalPlayCount = ar.sByte(self.totalPlayCount);
            self.currPlayCount = ar.sByte(self.currPlayCount);
            self.mainGamePlayRule = ar.sInt(self.mainGamePlayRule);
            self.subGamePlayRuleList = <Array<number>> ar.sIntArray(self.subGamePlayRuleList);
            self.isRoomOver = ar.sBoolean(self.isRoomOver);
            self.residueCards = <Array<number>>ar.sByteArray(self.residueCards);
        }
    }
}