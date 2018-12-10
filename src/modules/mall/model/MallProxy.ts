module FL {

    export class MallProxy extends puremvc.Proxy {

        /** 代理名 */
        public static readonly NAME:string = "MallProxy";
        /** 单例 */
        private static _only:MallProxy;

        private constructor() {
            super(MallProxy.NAME);
        }

        public static getInstance():MallProxy {
            if (!this._only) {
                this._only = new MallProxy();
            }
            return this._only;
        }

        /**
         * 商品消息返回
         * @param {FL.RefreshItemBaseACK} msg
         */
        public exeMsgGameRefreshItemBaseACK(msg:RefreshItemBaseACK):void{
            MvcUtil.send(MallModule.MALL_INTO_MALL, msg);
        }

    }
}