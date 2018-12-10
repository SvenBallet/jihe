module FL {
    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase_ChangSha - MahjongSendItemToChosenMsg
     * @Description: 发送一些选项给玩家选择
     * @Create: ArielLiang on 2018/6/5 11:49
     * @Version: V1.0
     */
    export class MahjongSendItemToChosenMsg extends NetMsgBase{
        /**
         * 操作时间
         */
        public operateTime:dcodeIO.Long = dcodeIO.Long.ZERO;

        /**
         * 操作选项类型
         */
        public operateType:number = 0;

        public constructor() {
            super(MsgCmdConstant.MSG_MAHJONG_SEND_ITEM_TO_CHOOSE);
        }

        public serialize(ar:ObjectSerializer):void {
            super.serialize(ar);
            this.operateTime = ar.sLong(this.operateTime);
            this.operateType = ar.sInt(this.operateType);
        }
    }
}