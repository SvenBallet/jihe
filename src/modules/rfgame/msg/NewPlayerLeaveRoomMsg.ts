module FL {
    export class NewPlayerLeaveRoomMsg extends NetMsgBase {
        /** 离开标记，
         * （0=客户端程序进入后台的离开（不真正离开，只是暂时），
         * 1=非房主的真正离开，
         * 2=房主直接解散房间,
         * 3=回到游戏【从后台切回来的时候直接通知其他人】，
         * 4=返回大厅（不真正离开，只是暂时））
         * */
        public leaveFlag: number = 0;//int

        public constructor() {
            super(MsgCmdConstant.MSG_PLAYER_LEAVE_ROOM);
        }

        public serialize(ar: ObjectSerializer): void {
            super.serialize(ar);
            let self = this;
            self.leaveFlag = ar.sInt(self.leaveFlag);
        }
    }
}