module FL {
    /** 游戏内聊天 */
    export class NewTalkingInGameMsg extends NetMsgBase {
        /**
		 * 玩家性别 0：男，1：女
		 */
        public playerSex: number = 0;//byte
        /**
		 * 接收玩家座位号，-1：表示所有
		 */
        public receiverPos: number = -1;//byte

		/**
		 * 聊天类型   0：系统自带快捷语音 1：系统表情 2:自定义文字,3:语音,4:互动表情
		 */
        public msgType: number = 0;//byte
		/**
		 * 快捷语音编号、表情编号、互动表情编号
		 */
        public msgNo: number = 0;//int
		/**
		 * 自定义文字内容
		 */
        public msgText: string = "";//String
		/**
		 * 语音
		 */
        public audio: Array<number> = new Array<number>();//List<Byte>
        public audioBase64: string = "";

        public constructor() {
            super(MsgCmdConstant.MSG_NEW_TALKING_IN_GAME);
        }

        public serialize(ar: ObjectSerializer): void {

            super.serialize(ar);
            let self = this;
            self.playerSex = ar.sByte(self.playerSex);
            self.msgType = ar.sByte(self.msgType);
            self.msgNo = ar.sInt(self.msgNo);
            self.msgText = ar.sString(self.msgText);
            self.receiverPos = ar.sByte(self.receiverPos);
            //
            if (self.msgType == 3) {
                self.audio = <Array<number>>ar.sByteArray(self.audio);
            }
            else if (self.msgType==5) {
                self.audioBase64 = ar.sString(self.audioBase64);
            }
        }
    }
}