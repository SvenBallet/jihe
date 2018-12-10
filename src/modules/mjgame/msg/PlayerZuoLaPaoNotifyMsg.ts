module FL {
    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase - PlayerZuoLaPaoNotifyMsg
     * @Description:  // 开局通知玩家下坐拉跑消息
     * @Create: DerekWu on 2018/1/23 20:32
     * @Version: V1.0
     */
    export class PlayerZuoLaPaoNotifyMsg extends NetMsgBase {

        /**
         * 是否需要下坐，0代表不需要，1代表需要
         */
        public isNeedXiaZuo: number = 0;

        /**
         * 是否需要下拉，0代表不需要，1代表需要
         */
        public isNeedXiaLa: number = 0;

        /**
         * 是否需要下跑，0代表不需要，1代表需要
         */
        public isNeedXiaPao: number = 0;

        /**
         * 玩家位置
         */
        public playerTablePosition: number = 0;

        constructor() {
            super(MsgCmdConstant.MSG_ZUO_LA_PAO_MSG);
        }

        public serialize(ar: ObjectSerializer): void {
            super.serialize(ar);
            let self = this;
            //
            self.isNeedXiaZuo = ar.sInt(self.isNeedXiaZuo);
            self.isNeedXiaLa = ar.sInt(self.isNeedXiaLa);
            self.isNeedXiaPao = ar.sInt(self.isNeedXiaPao);
            self.playerTablePosition = ar.sInt(self.playerTablePosition);
        }

    }
}