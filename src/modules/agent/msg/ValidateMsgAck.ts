module FL{

    export class ValidateMsgAck extends NetMsgBase{

        //result 1 为修改完成
        public result:number=0;

        public optStr:string="";

        constructor(){
            super(MsgCmdConstant.MSG_GAME_PLAYER_UPDATE_PASSWORD_ACK);
            //this.msgCMD = ack;
        }


        public serialize(ar:ObjectSerializer):void {
            super.serialize(ar);
            let self = this;
            self.result = ar.sInt(self.result);
            self.optStr = ar.sString(self.optStr);
        }

    }
}