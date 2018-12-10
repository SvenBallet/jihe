module FL {
    /** 退出茶楼消息 */
    export class ExitTeaHouseMsg extends NetMsgBase {
        //茶楼ID
        public teaHouseId = 0;
        //玩家ID
        public playerIndex = 0;

        public constructor() {
            super(MsgCmdConstant.MSG_EXIT_TEAHOUSE);
        }

        public serialize(ar: ObjectSerializer): void {
            super.serialize(ar);
            let self = this;
            self.teaHouseId = ar.sInt(self.teaHouseId);
            self.playerIndex = ar.sInt(self.playerIndex);
        }
    }

}