module FL {
    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase - GetPlayerGameLogMsg
     * @Description:  // 获得玩家游戏日志
     * @Create: DerekWu on 2018/1/17 18:03
     * @Version: V1.0
     */
    export class GetPlayerGameLogMsg extends NetMsgBase {

        public handIndex: number = 0;
        public gameTableID: string = "";
        public date: string = "";
        public data: egret.ByteArray;

        public rawLogSize: number = 0;
        public compressedLogSize: number = 0;
        public beginDate: string = "";
        public dateStr: string = "";

        constructor() {
            super(MsgCmdConstant.MSG_GET_PLAYER_GAME_LOG);
        }

        public serialize(ar: ObjectSerializer): void {
            super.serialize(ar);
            let self = this;
            self.handIndex = ar.sInt(self.handIndex);

            self.gameTableID = ar.sString(self.gameTableID);
            self.date = ar.sString(self.date);
            //
            self.data = ar.sBytes(self.data);
            //
            self.rawLogSize = ar.sInt(self.rawLogSize);
            self.compressedLogSize = ar.sInt(self.compressedLogSize);
            self.beginDate = ar.sString(self.beginDate);
            self.dateStr = ar.sString(self.dateStr);
        }

    }
}