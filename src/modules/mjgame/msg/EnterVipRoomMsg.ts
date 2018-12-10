module FL {
    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase - EnterVipRoomMsg
     * @Description:  //进入VIP房间指令
     * @Create: DerekWu on 2017/12/8 15:04
     * @Version: V1.0
     */
    export class EnterVipRoomMsg extends NetMsgBase {

        public tableID:string = "";
        public psw:string = "";
        public roomID:number;

        constructor() {
            super(MsgCmdConstant.MSG_GAME_ENTER_VIP_ROOM);
        }

        public serialize(ar:ObjectSerializer):void {
            super.serialize(ar);
            let self = this;
            self.tableID = ar.sString(self.tableID);
            self.psw = ar.sString(self.psw);
            self.roomID=ar.sInt(self.roomID);
        }
    }
}