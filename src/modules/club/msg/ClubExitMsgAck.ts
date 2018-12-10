module FL {
    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase - ClubExitMsgAck
     * @Description: 退出俱乐部
     * @Create: HoyeLee on 2018/3/13 16:16
     * @Version: V1.0
     */
    export class ClubExitMsgAck extends NetMsgBase {
        public result: number = 0;

        public static readonly SUCCESS = 0;
        public static readonly ERROR = 1; //错误
        public static readonly CREATOR_CAN_NOT_EXIT = 2;	//创建者无法退出
        public static readonly CLUB_NOT_FOUND = 3;

        public constructor() {
            super(MsgCmdConstant.MSG_CLUB_EXIT_ACK);
        }
        public serialize(ar: ObjectSerializer): void {
            super.serialize(ar);
            //
            let self = this;
            self.result = ar.sInt(self.result);
        }
    }
}