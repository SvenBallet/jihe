module FL {
    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase - GetVipRoomListMsg
     * @Description:  //登录指令
     * @Create: DerekWu on 2017/11/10 9:31
     * @Version: V1.0
     */
    export class GetVipRoomListMsg extends NetMsgBase {

        //账号密码
        public playerID: string = "";
       

        constructor() {
            super(MsgCmdConstant.MSG_GET_VIP_ROOM_RECORD);
        }

        public serialize(ar:ObjectSerializer):void {
            super.serialize(ar);
            let self = this;
            self.playerID = ar.sString(self.playerID);
        }
    }
}