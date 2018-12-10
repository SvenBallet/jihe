module FL {
    /** 创建茶楼消息返回 */
    export class CreateTeaHouseMsgACK extends AbstractNewNetMsgBaseAck {
        /**
         * 创建结果
         */
        public isCreatTeaHouseResult: boolean = false;

        public constructor() {
            super(MsgCmdConstant.MSG_CREATE_TEAHOUSE_ACK);
        }

        public newSerialize(ar: ObjectSerializer): void {
            //
            let self = this;
            self.isCreatTeaHouseResult = ar.sBoolean(self.isCreatTeaHouseResult);
        }
    }
}