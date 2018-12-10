module FL {
    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase - MahjongUpdateScoreMsgAck
     * @Description:  // 更新分数
     * @Create: DerekWu on 2018/6/28 10:35
     * @Version: V1.0
     */
    export class MahjongUpdateScoreMsgAck extends NetMsgBase {
        /**动作类型，暗杠 明杠。。。*/
        public actionType:number;
        /**结算类型   积分1,金币2.。。。。。。*/
        public settleType:number;
        /**具体结算信息，按玩家位置 */
        public scoreInfos:Array<MahjongUpdateScorePlayerInfo>;

        public constructor() {
            super(MsgCmdConstant.MSG_UPDATE_SCORE_ACK);
        }

        public serialize(ar:ObjectSerializer):void {
            super.serialize(ar);
            this.actionType=ar.sByte(this.actionType);
            this.settleType=ar.sByte(this.settleType);
            this.scoreInfos=<Array<MahjongUpdateScorePlayerInfo>> ar.sObjArray(this.scoreInfos);
        }

    }
}