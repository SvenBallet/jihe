module FL {
    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase - NewIntoOldGameTableMsg
     * @Description:  进入老的游戏桌子，在断线重连，和在大厅点击开房和加入开房的时候时候，如果玩家有在游戏中则会直接进入游戏
     * @Create: ArielLiang on 2018/4/17 17:52
     * @Version: V1.0
     */
    export class NewIntoOldGameTableMsg extends NetMsgBase {

        public constructor()
        {
            super(MsgCmdConstant.MSG_INTO_OLD_GAME_TABLE);
        }

    }
}