module FL {
    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase - NewIntoGoldGameSceneMsg
     * @Description:  // 新的进入金币场消息
     * @Create: DerekWu on 2018/4/28 17:41
     * @Version: V1.0
     */
    export class NewIntoGoldGameSceneMsg extends NetMsgBase {

        /**
         * 金币场房间ID
         */
        public goldGameSceneRoomID:number = 0;

        constructor() {
            super(MsgCmdConstant.MSG_NEW_INTO_GOLD_GAME_SCENE);
        }

        public serialize(ar:ObjectSerializer):void {
            super.serialize(ar);
            let self = this;
            self.goldGameSceneRoomID=ar.sInt(self.goldGameSceneRoomID);
        }

    }
}