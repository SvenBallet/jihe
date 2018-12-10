module FL {
    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase_ChangSha - MahjongPlayerChooseItemMsg
     * @Description: 麻将中玩家选项选择
     * @Create: ArielLiang on 2018/6/5 11:45
     * @Version: V1.0
     */
    export class MahjongPlayerChooseItemMsg extends NetMsgBase{
        /**
         * 操作信息
         */
        public operChosen:OperateInfo = new OperateInfo();

        public constructor() {
            super(MsgCmdConstant.MSG_MAHJONG_PLAYER_CHOOSE_ITEM);
        }


        public serialize(ar:ObjectSerializer):void {
            super.serialize(ar);
            this.operChosen = <OperateInfo> ar.sObject(this.operChosen);
        }
    }
}