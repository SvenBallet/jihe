module FL {
    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase - MahjongGameOverZhuaNiaoMsgAck
     * @Description:  // 抓鸟消息
     * @Create: DerekWu on 2018/6/17 16:41
     * @Version: V1.0
     */
    export class MahjongGameOverZhuaNiaoMsgAck extends AbstractNewNetMsgBaseAck {

        /** 是否159中鸟 */
        public isYiWuJiuZhongNiao:boolean = false;

        /** 所有鸟牌列表 */
        public niaoPaiList:Array<MahjongMaPaiInfo>;

        constructor() {
            super(MsgCmdConstant.MSG_MAHJONG_GAME_OVER_ZHUA_NIAO_ACK);
        }

        public newSerialize(ar: ObjectSerializer): void {
            this.isYiWuJiuZhongNiao = ar.sBoolean(this.isYiWuJiuZhongNiao);
            this.niaoPaiList = <Array<MahjongMaPaiInfo>> ar.sObjArray(this.niaoPaiList);
        }

    }
}