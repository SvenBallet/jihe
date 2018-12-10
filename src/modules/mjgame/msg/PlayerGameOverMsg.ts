module FL {
    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase - PlayerGameOverMsg
     * @Description:  //发送游戏结束
     * @Create: DerekWu on 2017/11/14 20:59
     * @Version: V1.0
     */
    export class PlayerGameOverMsg extends NetMsgBase {

        public score:number;

        constructor() {
            super(MsgCmdConstant.MSG_GAME_GAME_OVER);
        }

        public serialize(ar:ObjectSerializer):void {
            super.serialize(ar);
            let self = this;
            //
            self.score = ar.sInt(self.score);
        }

    }
}