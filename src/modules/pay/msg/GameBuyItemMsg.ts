module FL{

    export class GameBuyItemMsg extends NetMsgBase{

        /** 道具ID */
        public itemID:number;
        /** 购买数量 */
        public count:number = 0;
        /** 支付类型：【支付宝-5】/【微信支付-6】/【联通支付-3】/【一卡通-7】）/ 【ios内支付-8】/【h5微信公众号支付-9】*/
        public payType:number = 0;
        /** 一卡通卡号 */
        public cardNo:string = "";
        /** 一卡通密码 */
        public cardPwd:string = "";

        constructor(params:any){
            super(MsgCmdConstant.MSG_GAME_BUY_ITEM);
            this.itemID = params.itemID;
            this.count = params.count;
            this.payType = params.payType;
            this.cardNo = params.cardNo;
            this.cardPwd = params.cardPwd;
            this.unused_0 = params.unused_0?params.unused_0:0;
            this.unused_1 = params.unused_1?params.unused_1:0;
            this.unused_2 = params.unused_2?params.unused_2:0;
            this.unused_3 = params.unused_3?params.unused_3:0;
        }


        public serialize(ar:ObjectSerializer):void {
            super.serialize(ar);
            let self = this;
            self.itemID = ar.sInt(self.itemID);
            self.count = ar.sInt(self.count);
            self.payType = ar.sInt(self.payType);
            self.cardNo = ar.sString(self.cardNo);
            self.cardPwd = ar.sString(self.cardPwd);
        }

    }
}