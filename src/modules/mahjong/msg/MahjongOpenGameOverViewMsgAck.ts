module FL {
    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase - MahjongOpenGameOverViewMsgAck
     * @Description:  //打开游戏结束界面
     * @Create: DerekWu on 2018/6/17 18:09
     * @Version: V1.0
     */
    export class MahjongOpenGameOverViewMsgAck extends AbstractNewNetMsgBaseAck {

        public constructor() {
            super(MsgCmdConstant.MSG_MAHJONG_OPEN_GAME_OVER_VIEW_ACK);
        }

        newSerialize(ar: FL.ObjectSerializer): void {

        }
    }

}