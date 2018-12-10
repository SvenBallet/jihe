module FL {
    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase - MahjongChangShaOpenSelectActionViewAfterGangMsgAck
     * @Description: 选择动作 在杠之后 （其他玩家）
     * @Create: ArielLiang on 2018/6/27 11:23
     * @Version: V1.0
     */
    export class MahjongChangShaOpenSelectActionViewAfterGangMsgAck extends AbstractNewNetMsgBaseAck {

        /** 是否打开界面，否则是隐藏界面，这个最优先判断  */
        public isOpenView:boolean = true;
        /** 杠牌玩家位置 */
        public gangPlayerPos:number;
        public card1:number; // 杠牌1
        public card2:number; // 杠牌2

        /** 所有的动作列表 */
        public actionList:Array<MahjongActionResult>;

        constructor() {
            super(MsgCmdConstant.MSG_MAHJONG_CHANG_SHA_OPEN_SELECT_ACTION_VIEW_AFTER_GANG_ACK);
        }

        public newSerialize(ar:ObjectSerializer):void {
            this.isOpenView = ar.sBoolean(this.isOpenView);
            this.gangPlayerPos = ar.sByte(this.gangPlayerPos);
            this.card1 = ar.sByte(this.card1);
            this.card2 = ar.sByte(this.card2);
            this.actionList = <Array<MahjongActionResult>> ar.sObjArray(this.actionList);
        }
    }
}