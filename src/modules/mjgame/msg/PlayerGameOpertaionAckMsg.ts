module FL {

    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase - PlayerGameOpertaionAckMsg
     * @Description:  //客户端通知游戏服务器，玩家的某些行为，服务器返回
     * @Create: DerekWu on 2017/11/14 19:38
     * @Version: V1.0
     */
    export class PlayerGameOpertaionAckMsg extends NetMsgBase {

        public playerID:string = "";
        public playerName:string = "";
        public targetPlayerName:string = "";
        public opertaionID:number;
        public opValue:number;
        public result:number;

        public playerIndex:number;
        public headImg:number;
        public gold:number;
        public tablePos:number;

        public sex:number;

        public canFriend:number;

        public ip:string = "";

        constructor() {
            super(MsgCmdConstant.MSG_GAME_GAME_OPERTAION_ACK);
        }

        public serialize(ar:ObjectSerializer):void {
            super.serialize(ar);
            let self = this;
            self.playerID=ar.sString(self.playerID);
            //
            self.playerName=ar.sString(self.playerName);
            self.targetPlayerName=ar.sString(self.targetPlayerName);
            //
            self.opertaionID=ar.sInt(self.opertaionID);
            self.opValue=ar.sInt(self.opValue);
            self.result=ar.sInt(self.result);

            self.playerIndex = ar.sInt(self.playerIndex);
            self.headImg=ar.sInt(self.headImg);
            self.sex = ar.sInt(self.sex);
            self.gold=ar.sInt(self.gold);
            self.tablePos=ar.sInt(self.tablePos);

            self.canFriend = ar.sInt(self.canFriend);
            self.ip = ar.sString(self.ip);
        }

    }

}