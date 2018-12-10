module FL {
    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase - GameBuyItemAckMsg
     * @Description:  //购买道具回复消息
     * @Create: DerekWu on 2017/11/10 15:56
     * @Version: V1.0
     */
    export class GameBuyItemAckMsg extends NetMsgBase {

        /** 支付类型：【支付宝-5】/【微信支付-6】/【联通支付-3】/【一卡通-7】）/ 【ios内支付-8】/ 【h5微信公众号支付-9】*/
        public payType:number;
        public orderBytes:egret.ByteArray;
        public order:string ="";

        /**预支付签名*/
        public sign:string="";

        //额外备用字符串
        public otherstr:string="";
        public result:number=0;

        constructor() {
            super(MsgCmdConstant.MSG_GAME_BUY_ITEM_ACK);
        }

        public serialize(ar:ObjectSerializer):void {
            super.serialize(ar);
            let self = this;
            self.payType = ar.sInt(self.payType);
            self.orderBytes = ar.sBytes(self.orderBytes);
            self.order = ar.sString(self.order);
            self.sign = ar.sString(self.sign);
            self.otherstr = ar.sString(self.otherstr);
            self.result = ar.sInt(self.result);
        }

    }
}