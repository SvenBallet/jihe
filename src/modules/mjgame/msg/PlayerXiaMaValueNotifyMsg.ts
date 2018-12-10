module FL {
    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase - PlayerXiaMaValueNotifyMsg
     * @Description:  // 砀山玩法，服务器通知客户端玩家下马值的消息
     * @Create: DerekWu on 2018/1/24 9:13
     * @Version: V1.0
     */
    export class PlayerXiaMaValueNotifyMsg extends NetMsgBase {
        /**
         * 玩家座位号List
         */
        public tablePositons:Array<number>;
        /**
         * 玩家下马值List
         */
        public xiaMaValues:Array<number>;

        constructor() {
            super(MsgCmdConstant.MSG_XIA_MA_VALUE_MSG);
        }

        public serialize(ar: ObjectSerializer): void {
            super.serialize(ar);
            let self = this;
            self.tablePositons = <Array<number>>ar.sIntArray(self.tablePositons);
            self.xiaMaValues = <Array<number>>ar.sIntArray(self.xiaMaValues);
        }

    }
}