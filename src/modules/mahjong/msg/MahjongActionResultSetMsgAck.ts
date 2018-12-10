module FL {
    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase - MahjongActionResultSetMsgAck
     * @Description:  麻将动作结果集通知消息，吃碰杠听胡等
     * @Create: ArielLiang on 2018/6/13 14:53
     * @Version: V1.0
     */
    export class MahjongActionResultSetMsgAck  extends AbstractNewNetMsgBaseAck {

        /** 所有的动作列表 */
        public actionList:Array<MahjongActionResult>;

        constructor() {
            super(MsgCmdConstant.MSG_MAHJONG_ACTION_RESULT_SET_ACK);
        }


        public newSerialize(ar:ObjectSerializer):void {
                this.actionList = <Array<MahjongActionResult>> ar.sObjArray(this.actionList);
            }

        }
}