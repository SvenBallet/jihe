module FL {

    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase - WeChatConstant
     * @Description:  //微信相关常量类
     * @Create: DerekWu on 2018/1/10 11:00
     * @Version: V1.0
     */
    export class WeChatConstant {

        /** 最小录音间隔时间（毫秒），避免过于频繁的点击 */
        public static readonly RECORD_INTERVAL_TIMES:number = 2000;

        /** 最少录音时间（毫秒） */
        public static readonly RECORD_MIN_TIMES:number = 1000;
        /** 最大录音时间（毫秒） */
        public static readonly RECORD_MAX_TIMES:number = 15000;
        /** 停止录音动作的等待时间（毫秒），在这个时间之内没有后续动作则停止动作失效 */
        public static readonly STOP_ACTION_WAITING_TIMES:number = 1000;
        /** 上传语音的最大时间（毫秒），超过这个时间上传失败 */
        public static readonly UPLOAD_VOICE_MAX_TIMES:number = 6000;
        /** 下载语音的最大时间（毫秒），超过这个时间下载失败 */
        public static readonly DOWNLOAD_VOICE_MAX_TIMES:number = 6000;

    }

}