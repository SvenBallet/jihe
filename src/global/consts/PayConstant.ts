module FL {

    /**
     * *支付常量
     */

    export class PayConstant {

        /** oss 平台*/
        public static PAY_HISTORY_PLATFORM_TYPE_TEST:number = 0;
        /** 联通平台*/
        public static PAY_HISTORY_PLATFORM_TYPE_UNI_PAY:number = 1;

        /** 电信天翼平台*/
        public static PAY_HISTORY_PLATFORM_TYPE_E_SURFING:number = 2;



        /** OPPO平台*/
        public static PAY_HISTORY_PLATFORM_TYPE_OPPO:number = 3;
        /** UUCun平台*/
        public static PAY_HISTORY_PLATFORM_TYPE_UUCUN:number = 4;

        /** 支付宝*/
        public static PAY_HISTORY_PLATFORM_TYPE_ALIPAY:number = 5;

        /** 微信平台*/
        public static PAY_HISTORY_PLATFORM_TYPE_WX_PAY:number = 6;

        /**一卡通*/
        public static PAY_HISTORY_PLATFORM_TYPE_YI_KA_TONG:number = 7;

        /**ios内支付*/
        public static PAY_HISTORY_PLATFORM_TYPE_IPA_PAY:number = 8;

        /**充值记录当前状态*/
        /** 0 充值回调通知接收到未实际发放到玩家账号*/
        public static PAY_HISTORY_CUR_STATE_NOTICE_REACH:number = 0;
        /** 1 充值回调通知接收到已实际发放到玩家账号*/
        public static PAY_HISTORY_CUR_STATE_SUCCESS:number = 1;
        /** 2 特殊状态  玩家发起一个请求就生成一个可以过期的订单*/
        public static PAY_HISTORY_CUR_STATE_CALLBACK_SUCCESS:number = 2;

    }

}