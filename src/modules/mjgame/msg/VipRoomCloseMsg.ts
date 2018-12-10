module FL {
    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase - VipRoomCloseMsg
     * @Description:  //vip房间结束
     * @Create: DerekWu on 2017/11/14 21:20
     * @Version: V1.0
     */
    export class VipRoomCloseMsg extends NetMsgBase {

        /**最佳炮手*/
        public paoPos:number;

        /**大赢家*/
        public winPos:number;

        public players:Array<SimplePlayer>;

        /** 房间类型（0=正常，1=代开房，2=俱乐部房间） */
        public roomType: number = 0;

        /** 解散者位置，只有 isDismiss = true 时这个值才有效 */
        public dismissPlayerPos: number = -1;

        constructor() {
            super(MsgCmdConstant.MSG_GAME_VIP_ROOM_CLOSE);
        }

        public serialize(ar:ObjectSerializer):void {
            super.serialize(ar);
            let self = this;
            self.paoPos = ar.sInt(self.paoPos);
            self.winPos = ar.sInt(self.winPos);
            self.players=<Array<SimplePlayer>>ar.sObjArray(self.players);
            self.roomType = ar.sInt(self.roomType);
            self.dismissPlayerPos = ar.sByte(self.dismissPlayerPos);
        }

    }
}