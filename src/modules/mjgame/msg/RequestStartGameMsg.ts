module FL {
    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase - RequestStartGameMsg
     * @Description:  //开始游戏消息
     * @Create: DerekWu on 2017/11/10 16:34
     * @Version: V1.0
     */
    export class RequestStartGameMsg extends NetMsgBase {

        /** 房间Id 查看 MJRoomID */
        public roomID:number;

        constructor() {
            super(MsgCmdConstant.MSG_GAME_START_GAME_REQUEST);
        }

        public serialize(ar:ObjectSerializer):void {
            super.serialize(ar);
            let self = this;
            self.roomID = ar.sInt(self.roomID);
        }



    }
}