module FL {
    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase - PlayerXiaMaNotifyMsg
     * @Description:  // 砀山玩法，服务器通知客户端下马消息
     * @Create: DerekWu on 2018/1/24 9:10
     * @Version: V1.0
     */
    export class PlayerXiaMaNotifyMsg extends NetMsgBase {

        /**
         * 0通知客户端不需要下码，1通知客户端需要下码
         */
        public xiaMaValue: number = 0;

        constructor() {
            super(MsgCmdConstant.MSG_XIA_MA_MSG);
        }

        public serialize(ar: ObjectSerializer): void {
            super.serialize(ar);
            let self = this;
            self.xiaMaValue = ar.sInt(self.xiaMaValue);
        }

    }
}