module FL {
    /**
     * 选择玩家人数模式
     * @author DerekWu
     *
     */
    export class NewGameTableSelectPlayerNumPatternMsg extends NetMsgBase {
        /**
         * 玩家人数 0 表示取消模式，其他表示选择的人数
         */
        public playerNum: number = 0;

        public constructor() {
            super(MsgCmdConstant.MSG_NEW_GAME_TABLE_SELECT_PLAYER_NUM_PATTERN);
        }

        public serialize(ar: ObjectSerializer): void {
            super.serialize(ar);
            let self = this;
            self.playerNum = ar.sInt(self.playerNum);
        }
    }
}