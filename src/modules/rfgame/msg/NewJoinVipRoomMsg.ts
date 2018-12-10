module FL {
    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase - NewJoinVipRoomMsg
     * @Description:  加入VIP房间
     * @Create: ArielLiang on 2018/4/17 16:44
     * @Version: V1.0
     */
    export class NewJoinVipRoomMsg extends NetMsgBase {
        /**
         * Vip房间ID
         */
        public vipRoomID:number = 0;
        /**
         * 密码
         */
        public psw:string = "";

        public constructor() {
            super(MsgCmdConstant.MSG_JOIN_VIP_ROOM);
        }

        public serialize(ar:ObjectSerializer) :void{
            super.serialize(ar);
            let self = this;
            self.vipRoomID = ar.sInt(self.vipRoomID);
            self.psw = ar.sString(self.psw);
        }
    }
}