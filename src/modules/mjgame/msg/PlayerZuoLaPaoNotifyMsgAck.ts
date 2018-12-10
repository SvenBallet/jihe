module FL {
    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase - PlayerZuoLaPaoNotifyMsgAck
     * @Description:  // 玩家坐拉跑通知消息
     * @Create: DerekWu on 2018/1/24 9:07
     * @Version: V1.0
     */
    export class PlayerZuoLaPaoNotifyMsgAck extends NetMsgBase {

        /**
         * 使用此字段通知客户端关于玩家坐拉跑的信息
         */
        public playerZuoLaPaoInfoList:Array<PlayerZuoLaPaoInfo>;

        constructor() {
            super(MsgCmdConstant.MSG_ZUO_LA_PAO_MSG_ACK);
        }

        public serialize(ar: ObjectSerializer): void {
            super.serialize(ar);
            let self = this;
            self.playerZuoLaPaoInfoList = <Array<PlayerZuoLaPaoInfo>>ar.sObjArray(self.playerZuoLaPaoInfoList);
        }

    }
}