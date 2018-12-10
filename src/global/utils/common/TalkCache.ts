module FL {
    /**
     * 语音通话播放队列
     * @copyright 深圳市天天爱科技有限公司
     * @author Sven
     * @date 2018/4/26
     */
    export class TalkCache {
        public static talkMsgList: Array<any> = [];
        
        /**
         * 压入语音消息
         */
        public static pushMsg(msg: any) {
            TalkCache.talkMsgList.push(msg);

            // 直接播放，不需要等待播放完成
            if (TalkCache.talkMsgList.length == 1) {
                TalkCache.playTalk(msg);
            }
        }

        /**
         * 播放完一个消息后
         */
        public static nextTalk() {
            console.log("CACHE LIST[0]=="+TalkCache.talkMsgList[0]);
            if (!TalkCache.talkMsgList[0]) {
                TalkCache.clearTalkList();
                return;
            }
            // 隐藏当前语音动画
            MvcUtil.send(CommonModule.COMMON_HIDE_TALK_ANI, TalkCache.talkMsgList[0]);

            TalkCache.talkMsgList.shift();
            TalkCache.playTalk(TalkCache[0]);
        }

        /**
         * 播放
         */
        public static playTalk(msg: any) {
            if (!msg) return;
            // 显示语音动画
            MvcUtil.send(CommonModule.COMMON_SHOW_TALK_ANI, msg);

            // 调用原生播放
            let jsonData = {
                "eventType": SendNativeMsgType.SEND_NATIVE_RECORD_PLAY,
                "data": {
                    "voiceData": msg.audioBase64
                }
            }
            NativeBridge.getInstance().sendNativeMessage(JSON.stringify(jsonData));
        }

        /**
         * 清空语音
         */
        public static clearTalkList() {
            TalkCache.talkMsgList = [];
        }
    }
}