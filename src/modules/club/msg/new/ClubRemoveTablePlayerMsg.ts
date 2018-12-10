module FL {
    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase - ClubRemoveTablePlayerMsg
     * @Description:  // 俱乐部中移除在桌子上的玩家
     * @Create: DerekWu on 2018/4/28 9:24
     * @Version: V1.0
     */
    export class ClubRemoveTablePlayerMsg extends NetMsgBase {
        /** 俱乐部ID */
        public clubId: number = 0;
        /**
         * 主玩法
         */
        public mainGamePlayRule: number = 0;
        /** vip房间Id */
        public vipRoomId: number = 0;
        /** 移除的玩家索引 */
        public removePlayerIndex: number = 0;

        constructor() {
            super(MsgCmdConstant.MSG_CLUB_REMOVE_TABLE_PLAYER);
        }

        public serialize(ar: ObjectSerializer): void {
            super.serialize(ar);
            let self = this;
            self.clubId = ar.sInt(self.clubId);
            self.mainGamePlayRule = ar.sInt(self.mainGamePlayRule);
            self.vipRoomId = ar.sInt(self.vipRoomId);
            self.removePlayerIndex = ar.sInt(self.removePlayerIndex);
        }
    }
}