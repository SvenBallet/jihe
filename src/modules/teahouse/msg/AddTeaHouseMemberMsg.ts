module FL {
    /** 管理员添加成员 */
    export class AddTeaHouseMemberMsg extends NetMsgBase {
        // 茶楼ID
        public teaHouseId: number;
        // 玩家id
        public playerIndex: number;
        // 预留字段
        public flag: number = 0;
        public constructor() {
            super(MsgCmdConstant.MSG_ADD_TEAHOUSE_MEMEBER);
        }

        public serialize(ar: ObjectSerializer): void {
            super.serialize(ar);
            let self = this;
            self.teaHouseId = ar.sInt(self.teaHouseId);
            self.playerIndex = ar.sInt(self.playerIndex);
            self.flag = ar.sInt(self.flag);
        }
    }
}