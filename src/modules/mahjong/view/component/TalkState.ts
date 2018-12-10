module FL {
    /**
     * 录音界面
     * @copyright 深圳市天天爱科技有限公司
     * @author Sven
     * @date 2018/4/18
     */
    export class TalkState extends eui.Component {
        public microGro:eui.Group;
        public voiceImg:eui.Image;
        public arrowGro:eui.Group;
        public shortGro:eui.Group;
        public progressGro:eui.Group;
        public progressImg:eui.Image;

        private readonly progressMaxWidth:number = 250;
        public static readonly progressTime:number = 1000 * 5;
        private shortUITime: number;
        private curState: TalkUIState = TalkUIState.NORMAL;
        private _timeTickerTimer: Game.Timer;

        // 记录录音前的音量
        private effectRecord: number = 100;
        private bgmusicRecord: number = 100;

        public constructor() {
            super();
            this.skinName = skins.TalkStateSkin;
        }
    
        protected childrenCreated() {
            this.hide(false);
        }

        private init() {
            let self = this;
            
            self.curState = TalkUIState.NORMAL;
            self.microGro.visible = false;
            self.voiceImg.source = "";
            self.arrowGro.visible = false;
            self.shortGro.visible = false;
            self.progressGro.visible = false;
            self.progressImg.width = self.progressMaxWidth;
            egret.Tween.removeTweens(self.progressImg);
            egret.clearTimeout(self.shortUITime);
        }

        /**刷新音量 */
        public reVoice(level: number) {
            console.log("RE VOICE LEVEL===============");
            let voiceImgUrlList = ["", "voice_v1_png", "voice_v2_png", "voice_v3_png","voice_v4_png",
                "voice_v5_png", "voice_v6_png", "voice_v7_png"];
            this.voiceImg.source = voiceImgUrlList[level];
        }

        /**隐藏录音UI */
        public hide(resetMusic:boolean = true) {
            let self = this;

            self.visible = false;
            self.init();
            self.stopTickerTimer();

            if (resetMusic) {
                // 调整游戏其他声音
                SoundManager.resetEffectVolume(this.effectRecord);
                SoundManager.resetBgMusicVolume(this.bgmusicRecord);
            }
        }

        /**
         * 显示录音UI、切换UI状态 
         * @param beginFlag 是否录音开始
         * */
        public show(state: TalkUIState, beginFlag: boolean = false) {
            let self = this;

            self.curState = state;
            self.visible = true;
            egret.clearTimeout(self.shortUITime);
            switch (state) {
                case TalkUIState.TALKING:
                    self.microGro.visible = true;
                    self.arrowGro.visible = false;
                    self.shortGro.visible = false;
                    self.progressGro.visible = true;
                    if (beginFlag) {
                         egret.Tween.get(self.progressImg)
                         .to({width: 0}, TalkState.progressTime);
                         self.startTickerTimer();

                         // 调整游戏其他声音
                        this.effectRecord = Storage.getEffectVolume();
                        this.bgmusicRecord = Storage.getMusicVolume();
                        SoundManager.resetEffectVolume(0);
                        SoundManager.resetBgMusicVolume(0);
                    }
                    break;
                case TalkUIState.CANCLE:
                    self.microGro.visible = false;
                    self.arrowGro.visible = true;
                    self.shortGro.visible = false;
                    self.progressGro.visible = true;
                    break;
                case TalkUIState.SHORT:
                    self.microGro.visible = false;
                    self.arrowGro.visible = false;
                    self.shortGro.visible = true;
                    self.progressGro.visible = false;
                    self.shortUITime = egret.setTimeout(()=>{
                        self.hide();
                    }, this, 1000*1.5)
                    break;
            }
        }

        /**定时获取录音音量 */
        private ticker() {
            let self = this;

            let jsonData = {
                "eventType": SendNativeMsgType.SEND_NATIVE_GET_RECORD_VOICE,
                "data": {}
            }
            NativeBridge.getInstance().sendNativeMessage(JSON.stringify(jsonData));
        }

        private startTickerTimer(): void {
            let intervalTime: number = 1000 * 0.3;
            let self = this;
            if (!self._timeTickerTimer) {
                let timer: Game.Timer = new Game.Timer(intervalTime);
                timer.addEventListener(egret.TimerEvent.TIMER, self.ticker, self);
                self._timeTickerTimer = timer;
            }
            if (!self._timeTickerTimer.running) {
                self._timeTickerTimer.start();
            }
        }

        private stopTickerTimer(): void {
            let self = this;
            if (self._timeTickerTimer) {
                if (self._timeTickerTimer.running) {
                    self._timeTickerTimer.stop();
                }
            }
        }
    }

    /**录音UI显示状态 */
    export enum TalkUIState {
        TALKING,
        CANCLE,
        SHORT,
        NORMAL
    }
}