module FL {
    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase - WeChatVoiceMsg
     * @Description:  //微信录音消息
     * @Create: DerekWu on 2018/1/9 15:06
     * @Version: V1.0
     */
    export class WeChatVoiceMsg extends NetMsgBase {

        // 玩家ID
        public playerID:string = "";
        // 说话玩家的座位号
        public playerPos:number = 0;
        // 录音类型 (1=游戏中录音，其他可以再拓展)
        public voiceType:number = 0;
        // 微信语音serverId
        public voiceServerId:string = "";

        constructor() {
            super(MsgCmdConstant.MSG_WE_CHAT_VOICE);
        }

        public serialize(ar:ObjectSerializer):void {
            super.serialize(ar);
            let self = this;
            self.playerID = ar.sString(self.playerID);
            self.playerPos = ar.sInt(self.playerPos);
            self.voiceType = ar.sInt(self.voiceType);
            self.voiceServerId = ar.sString(self.voiceServerId);
        }

    }
}