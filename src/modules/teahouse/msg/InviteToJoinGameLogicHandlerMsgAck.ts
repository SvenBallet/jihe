module FL {
    /** 茶楼邀请玩家返回 */
    export class InviteToJoinGameLogicHandlerMsgAck extends AbstractNewNetMsgBaseAck {
        //房间ID
        public roomId: number = 0;
        
        //茶楼名称
        public teaHouseName: string;
        
        //邀请人名称
        public InviterName: string;
        
        //主玩法
        public mainGamePlayRule: number;
        
        // 子玩法数组
        public subGamePlayRuleList: Array<number>;
        
        //总人数
        public totalPlayerNum: number = 0;
        
        //总局数
        public totalPlayCount: number = 0;

        public constructor() {
            super(MsgCmdConstant.MSG_INVITE_TO_JOIN_GAME_LOGIC_ACK);
        }

        public newSerialize(ar: ObjectSerializer): void {
            let self = this;
            self.roomId = ar.sInt(self.roomId);
            self.teaHouseName = ar.sString(self.teaHouseName);
            self.InviterName = ar.sString(self.InviterName);
            self.mainGamePlayRule = ar.sInt(self.mainGamePlayRule);
            self.subGamePlayRuleList = ar.sIntArray(self.subGamePlayRuleList);
            self.totalPlayerNum = ar.sInt(self.totalPlayerNum);
            self.totalPlayCount = ar.sInt(self.totalPlayCount);
        }
    }
}