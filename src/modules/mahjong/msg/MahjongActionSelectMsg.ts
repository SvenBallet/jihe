module FL {
    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase - MahjongActionSelectMsg
     * @Description: 麻将动作选择消息，吃碰杠听胡等
     * @Create: ArielLiang on 2018/6/13 14:49
     * @Version: V1.0
     */
    export class MahjongActionSelectMsg extends NetMsgBase {

        /** 选择的动作id */
        public selectActionId:number = 0;

        constructor() {
            super(MsgCmdConstant.MSG_MAHJONG_ACTION_SELECT);
        }

        public serialize(ar:ObjectSerializer):void {
            super.serialize(ar);
            this.selectActionId = ar.sInt(this.selectActionId);
        }
    }
}