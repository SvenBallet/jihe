module FL {
    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase - MahjongChangShaConfirmHaiDiMoMsg
     * @Description:  // 长沙麻将确定是否海底摸一把
     * @Create: DerekWu on 2018/6/28 11:16
     * @Version: V1.0
     */
    export class MahjongChangShaConfirmHaiDiMoMsg extends NetMsgBase {

        /** 是否摸，否则不摸 */
        public isMo:boolean = false;

        constructor() {
            super(MsgCmdConstant.MSG_MAHJONG_CHANG_SHA_CONFIRM_HAI_DI_MO);
        }

        public serialize(ar:ObjectSerializer):void {
            super.serialize(ar);
            this.isMo = ar.sBoolean(this.isMo);
        }

    }
}