module FL {

    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase - PayCmd
     * @Description:  //充值命令处理
     * @Create: DerekWu on 2018/1/2 14:51
     * @Version: V1.0
     */
    export class PayCmd extends puremvc.SimpleCommand implements puremvc.ICommand {

        public constructor() {
            super();
        }

        public execute(notification:puremvc.INotification):void {
            let data:any = notification.getBody();
            switch(notification.getName()) {
                case PayModule.PAY_REQ_WXGZH_ACK:{
                    this.exeGameBuyItemWXGZHAckMsg(data);
                    break;
                }
            }
        }

        /**
         * 处理微信公众号买钻石
         * @param {FL.GameBuyItemWXGZHAckMsg} msg
         */
        public exeGameBuyItemWXGZHAckMsg(msg:GameBuyItemWXGZHAckMsg):void {
            if (msg.result === 0) {
                if (GConf.Conf.useWXAuth) {
                    let vPayInfo:any = JSON.parse(msg.sign);
                    WXJssdk.wx().chooseWXPay({
                        timestamp: vPayInfo.timeStamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
                        nonceStr: vPayInfo.nonceStr, // 支付签名随机串，不长于 32 位
                        package: vPayInfo.package, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=\*\*\*）
                        signType: vPayInfo.signType, // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
                        paySign: vPayInfo.paySign, // 支付签名
                        success: function (res) {
                            // egret.log(res);
                            PromptUtil.show("购买成功！", PromptType.SUCCESS);
                        }
                    });
                } else {
                    PromptUtil.show("请在微信中进行购买！", PromptType.ERROR);
                }
            } else {
                PromptUtil.show("购买失败！", PromptType.ERROR);
            }
        }

    }
}