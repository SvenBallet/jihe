module FL {
    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase - ClubDissmissRoomMsg
     * @Description:  //  ClubDissmissRoomMsg
     * @Create: DerekWu on 2018/4/28 11:22
     * @Version: V1.0
     */
    export class ClubDissmissRoomMsg extends NetMsgBase {
        /** 俱乐部ID */
        public clubId: number = 0;
        /** vip房间Id */
        public vipRoomId: number = 0;

        constructor() {
            super(MsgCmdConstant.MSG_CLUB_DISSMISS_ROOM);
        }

        public serialize(ar: ObjectSerializer): void {
            super.serialize(ar);
            let self = this;
            self.clubId = ar.sInt(self.clubId);
            self.vipRoomId = ar.sInt(self.vipRoomId);
        }

    }
}