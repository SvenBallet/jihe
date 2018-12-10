module FL {

    export class WXGongzhonghaoActivityMsg extends NetMsgBase {

        public unionID:string = "";

        constructor() {
            super(MsgCmdConstant.MSG_WX_GONGZHONGHAO_ACTIVITY);
        }

        public serialize(ar:ObjectSerializer):void {
            super.serialize(ar);
            let self = this;
            self.unionID = "otZ9g1OKKvZcexuUDg9fAXP92XLw";
            self.unionID = ar.sString(self.unionID);
        }
    }
}