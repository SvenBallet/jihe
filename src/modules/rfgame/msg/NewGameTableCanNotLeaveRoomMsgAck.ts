module FL {
    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase - NewGameTableCanNotLeaveRoomMsgAck
     * @Description:  // 新游戏桌子不能离开了的消息，通知客户端
     * @Create: DerekWu on 2018/7/6 17:49
     * @Version: V1.0
     */
    export class NewGameTableCanNotLeaveRoomMsgAck extends AbstractNewNetMsgBaseAck {

        public constructor() {
            super(MsgCmdConstant.NEW_GAME_TABLE_CAN_NOT_LEAVE_ROOM);
        }

        public newSerialize(ar: ObjectSerializer): void {

        }

    }
}