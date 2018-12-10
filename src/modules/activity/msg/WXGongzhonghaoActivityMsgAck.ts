module FL {

    export class WXGongzhonghaoActivityMsgAck extends NetMsgBase {


        public GongzhonghaoName:string;
        public hasGuanZhuWeixinGongzhonghao:number;
        public diamondNumbers:number;
        public hasGetedDiamond:number;
        public isOpen:number;
        public httpLinkAddress:string;

        constructor() {
            super(MsgCmdConstant.MSG_WX_GONGZHONGHAO_ACTIVITY_ACK);
        }

        public serialize(ar:ObjectSerializer):void {
            super.serialize(ar);
            let self = this;
            self.GongzhonghaoName = ar.sString(self.GongzhonghaoName);
            self.hasGuanZhuWeixinGongzhonghao = ar.sInt(self.hasGuanZhuWeixinGongzhonghao);
            self.diamondNumbers = ar.sInt(self.diamondNumbers);
            self.hasGetedDiamond = ar.sInt(self.hasGetedDiamond);
            self.isOpen = ar.sInt(self.isOpen);
            self.httpLinkAddress = ar.sString(self.httpLinkAddress);

        }

    }
}