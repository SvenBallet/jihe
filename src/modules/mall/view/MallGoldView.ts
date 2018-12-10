module FL {

    export class MallGoldView extends eui.Component {

        // public readonly mediatorName: string = "";
        // public readonly viewLayer: ViewLayerEnum = ViewLayerEnum.POPUP;

        //金币图片
        public imgRes:eui.Image;

        //￥符号
        public rmbNum:eui.Label;

        //商品名
        public goldTitle:eui.Label;

        //钻石图标
        public zuanshiImg:eui.Image;

        //钻石数量
        public zuanshiNum:eui.Label;

        public readonly item:ItemBase;

        public index:number;

        constructor (item:ItemBase,index:number) {
            super();
            this.left = this.top = 0;
            this.skinName = "skins.MallGoldViewSkin";
            this.item = item;
            this.index = index;
        }

        protected childrenCreated():void {
            super.childrenCreated();
            this.goldTitle.text = this.item.name;
            if(this.item.property_3 === 1){
                this.imgRes.source ='zuanshi'+this.index+'_png';
                this.rmbNum.text = "￥"+ this.item.price;
                this.removeChild(this.zuanshiNum);
                this.removeChild(this.zuanshiImg);
            } else if(this.item.property_3 === 2){
                this.zuanshiNum.text = ""+this.item.price;
                this.imgRes.source = 'gold'+this.index+'_png';
                this.removeChild(this.rmbNum);
            }
            //注册pureMvc
            this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.buyThisItem, this);
        }

        private buyThisItem(e:egret.TouchEvent):void {
            let vParamsObj:any;
            let vLoadingOverCmd:number;
            if (this.item.property_3 === 1) {
                let conf = LobbyHandler.getOneClientConfig(GameConfigConstant.CONF_WX_CLUB_SERVICE);
                let vPlayerVO: PlayerVO = LobbyData.playerVO;
                if (conf.pro_1 && vPlayerVO.diamond.value >= conf.pro_2) {
                    PromptUtil.show("钻石剩余充足，暂时无需购买", PromptType.ALERT);
                    return;
                }

                if (GConf.Conf.useWXAuth == 1) {
                    vParamsObj = {itemID:this.item.base_id, count:1, payType:9}; //payType = 9，h5微信公众号支付
                    vLoadingOverCmd = MsgCmdConstant.MSG_GAME_BUY_ITEM_WXGZH_ACK;
                }
                else if (GConf.Conf.useWXAuth == 2 || FL.GConf.Conf.useWXAuth == 3) {
                    if (NativeBridge.IOSMask) {
                        let idStr = String(this.item.base_id);
                        idStr = idStr.slice(1);
                        let idData = {
                            "eventType": FL.SendNativeMsgType.SEND_NATIVE_IAP_PAY,
                            "data": {
                                "productId": "com.tta.mjgame_hunanh5_1" + idStr
                            }
                        }
                        FL.NativeBridge.getInstance().sendNativeMessage(JSON.stringify(idData));
                        return;
                    }
                    // 微信支付
                    else {
                        console.log("wx pay");
                        vParamsObj = {itemID:this.item.base_id, count:1, payType:6};
                        vLoadingOverCmd = MsgCmdConstant.MSG_GAME_BUY_ITEM_WXGZH_ACK;
                    }
                }
                else {
                    PromptUtil.show("请在微信中进行购买！", PromptType.ALERT);
                    return;
                }
            } else {
                vParamsObj = {itemID:this.item.base_id, count:1};
                vLoadingOverCmd = MsgCmdConstant.MSG_GAME_GAME_OPERTAION_ACK;
            }
            let vGameBuyItemMsg:GameBuyItemMsg = new GameBuyItemMsg(vParamsObj);
            ServerUtil.sendMsg(vGameBuyItemMsg, vLoadingOverCmd);
        }

    }
}