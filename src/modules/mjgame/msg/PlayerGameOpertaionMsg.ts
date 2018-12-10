module FL {
    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase - PlayerGameOpertaionMsg
     * @Description:  //客户端通知游戏服务器，玩家的某些行为
     * @Create: DerekWu on 2017/11/14 19:29
     * @Version: V1.0
     */
    export class PlayerGameOpertaionMsg extends NetMsgBase {

        public opertaionID:number;
        public opValue:number;

        constructor() {
            super(MsgCmdConstant.MSG_GAME_GAME_OPERTAION);
        }

        public serialize(ar:ObjectSerializer):void {
            super.serialize(ar);
            let self = this;
            self.opertaionID = ar.sInt(self.opertaionID);
            self.opValue = ar.sInt(self.opValue);
        }

    }
}