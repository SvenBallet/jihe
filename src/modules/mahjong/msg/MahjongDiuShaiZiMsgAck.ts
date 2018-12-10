module FL {
    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase - MahjongDiuShaiZiMsgAck
     * @Description: 丢色子消息，通知客户端
     * @Create: ArielLiang on 2018/6/28 9:58
     * @Version: V1.0
     */
    export class MahjongDiuShaiZiMsgAck extends AbstractNewNetMsgBaseAck {

        /** 丢之前的提示，没有则不提示，黄色文字提示 */
        public beforeDiuShowTipDesc:string;

        /** 色子对象 */
        public mahjongShaiZi:MahjongShaiZi;

        /** 丢之后的提示，没有则不提示，黄色文字提示  */
        public afterDiuShowTipDesc:string;

        constructor() {
            super(MsgCmdConstant.MSG_MAHJONG_DIU_SHAI_ZI_ACK);
        }


        public newSerialize(ar:ObjectSerializer):void {
            this.beforeDiuShowTipDesc = ar.sString(this.beforeDiuShowTipDesc);
            this.mahjongShaiZi = <MahjongShaiZi>ar.sObject(this.mahjongShaiZi);
            this.afterDiuShowTipDesc = ar.sString(this.afterDiuShowTipDesc);
        }
    }
}