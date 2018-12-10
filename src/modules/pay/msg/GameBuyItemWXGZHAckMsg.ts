module FL {

    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase - GameBuyItemWXGZHAckMsg
     * @Description:  //购买道具微信公众号请求支付回复
     * @Create: DerekWu on 2018/1/2 14:32
     * @Version: V1.0
     */
    export class GameBuyItemWXGZHAckMsg extends NetMsgBase {

        /** 请求支付结果0=成功，-1=失败 */
        public result:number = 0;
        /** 订单号  */
        public order:string = "";
        /** 预支付签名Json字符串 */
        public sign:string = "";

        constructor() {
            super(MsgCmdConstant.MSG_GAME_BUY_ITEM_WXGZH_ACK);
        }

        public serialize(ar:ObjectSerializer):void {
            super.serialize(ar);
            let self = this;
            self.result = ar.sInt(self.result);
            self.order = ar.sString(self.order);
            self.sign = ar.sString(self.sign);
        }

    }

}