module FL {
    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase_ChangSha - MahjongPlayerChooseItemMsgAck
     * @Description: 麻将中玩家选项选择通知
     * @Create: ArielLiang on 2018/6/5 11:57
     * @Version: V1.0
     */
    export class MahjongPlayerChooseItemMsgAck extends AbstractNewNetMsgBaseAck{

        /**
         * 操作信息
         */
        public operInfoList:Array<OperateInfo> = new Array<OperateInfo>();

        public constructor() {
            super(MsgCmdConstant.MSG_MAHJONG_PLAYER_CHOOSE_ITEM_ACK);
        }

        public newSerialize(ar:ObjectSerializer):void {
            this.operInfoList = <Array<OperateInfo>> ar.sObjArray(this.operInfoList);
        }
    }
}