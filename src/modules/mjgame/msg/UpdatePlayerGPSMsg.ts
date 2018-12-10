module FL {
    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase - UpdatePlayerGPSMsg
     * @Description:  //更新玩家gps消息
     * @Create: DerekWu on 2017/11/21 18:57
     * @Version: V1.0
     */
    export class UpdatePlayerGPSMsg extends NetMsgBase {

        public px:number = 0.0; //维度
        public py:number = 0.0; //经度
        public pz:number = 0.0; //海拔高度
        public playerTablePos:number = 0; //玩家牌桌编号
        public paddress:string = "";

        constructor() {
            super(MsgCmdConstant.MSG_UPDATE_GPS_POSITION);
        }

        public serialize(ar:ObjectSerializer):void {
            super.serialize(ar);
            let self = this;
            self.px = ar.sDouble(self.px);
            self.py = ar.sDouble(self.py);
            self.pz = ar.sDouble(self.pz);
            //
            self.playerTablePos=ar.sInt(self.playerTablePos);
            self.paddress=ar.sString(self.paddress);
        }

    }
}