module FL {
    /** 进入茶楼消息返回 */
    export class AccessTeaHouseMsgAck extends AbstractNewNetMsgBaseAck {
        //玩家类型(1.老板 2.管理员 4.普通,-1.非成员)
        public memberState = 0;
        //茶楼对象
        public teaHouse: TeaHouse;
        // 创建后的进入。false则需主动发送进入楼层，true则不发送
        public createFlag = false;

        public constructor() {
            super(MsgCmdConstant.MSG_ACCESS_TEAHOUSE_ACK);
        }

        public newSerialize(ar: ObjectSerializer): void {
            let self = this;
            self.memberState = ar.sInt(self.memberState);
            self.teaHouse = <TeaHouse>ar.sObject(self.teaHouse);
            self.createFlag = ar.sBoolean(self.createFlag);
        }
    }
}