module FL {
    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase - AbstractNewNetMsgBaseAck
     * @Description:  // 抽象新消息返回对象，所有新的返回消息都继承这个类
     * @Create: DerekWu on 2018/4/11 15:09
     * @Version: V1.0
     */
    export abstract class AbstractNewNetMsgBaseAck extends NetMsgBase {

        /** 新消息返回结果，所有的返回消息继承这个类，0 = 成功，-1=使用提示，1=仅取消客户端ReqLoading */
        private newNetMsgBaseAckResult: number = 0;

        private newShowTipAckMsg: NewShowTipAckMsg = null;

        public serialize(ar: ObjectSerializer): void {
            super.serialize(ar);
            let self = this;
            self.newNetMsgBaseAckResult = ar.sByte(self.newNetMsgBaseAckResult);
            if (self.newNetMsgBaseAckResult == 0) {
                this.newSerialize(ar);
            } else if (self.newNetMsgBaseAckResult == -1) {
                self.newShowTipAckMsg = new NewShowTipAckMsg();
                self.newShowTipAckMsg.needSerializeMsgBase = false;
                self.newShowTipAckMsg.serialize(ar);
            }
        }

        /**
         * 子类实现这个方法
         * @param ar
         */
        public abstract newSerialize(ar: ObjectSerializer): void;
    }
}