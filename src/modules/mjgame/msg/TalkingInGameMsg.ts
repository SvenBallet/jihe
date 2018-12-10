module FL {
    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase - TalkingInGameMsg
     * @Description:  //游戏中说话
     * @Create: DerekWu on 2017/11/22 9:08
     * @Version: V1.0
     */
     export class TalkingInGameMsg extends NetMsgBase {

        //说话玩家的座位号
        public playerPos:number = 0;
        //性别
        public playerSex:number = 0;
        //说话类型  0：系统自带快捷语音 1：系统表情 2:自定义文字,3语音
        public msgType:number = 0;
        //快捷语音编号、表情编号
        public msgNo:number = 0;
        //自定义文字内容
        public msgText:string = "";
        //语音
        public audio:Array<number> = new Array<number>();
        public audioBase64: string = "";

        constructor() {
            super(MsgCmdConstant.MSG_TALKING_IN_GAME);
        }

        public serialize(ar:ObjectSerializer):void {
            super.serialize(ar);
            let self = this;
            self.playerPos = ar.sInt(self.playerPos);
            self.playerSex = ar.sInt(self.playerSex);
            self.msgType = ar.sInt(self.msgType);
            self.msgNo = ar.sInt(self.msgNo);
            self.msgText = ar.sString(self.msgText);
            //
            if(self.msgType==3)
            {
                self.audio = <Array<number>>ar.sByteArray(self.audio);
            }
            else if (self.msgType==5) {
                self.audioBase64 = ar.sString(self.audioBase64);
            }
        }

    }
}