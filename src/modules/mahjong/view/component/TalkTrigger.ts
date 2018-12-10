module FL {
    /**
     * 录音触发器
     * @copyright 深圳市天天爱科技有限公司
     * @author Sven
     * @date 2018/4/18
     */
    export class TalkTrigger extends eui.Component {
        public talkImg:eui.Image;
        private talkMod: TalkState;
        
        private recordBeginTime:number;       //录音时间
        private recordBeginPos:number;   //录音点击位置
        private recordEndPos:number;     //录音结束位置
        private moveFlag:boolean = false;
        private endFlag:boolean = false;
        private _timeTickerTimer: Game.Timer;
        private readonly thresholdValue: number = 30;

        public constructor() {
            super();
            this.skinName = skins.TalkTriggerSkin;
        }
    
        protected childrenCreated() {
            let self = this;

            TouchTweenUtil.regTween(self.talkImg, self.talkImg);
            self.talkImg.addEventListener(egret.TouchEvent.TOUCH_BEGIN, self.exeMicroBegin, self);
        }

        /**绑定TalkState */
        public bindTalkUI(talkUI: TalkState) {
            this.talkMod = talkUI;
        }

        private exeMicroBegin(event: egret.TouchEvent) {
            if (!Game.CommonUtil.isNative) return;

            egret.MainContext.instance.stage.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.exeMicroMove, this);
            this.talkImg.addEventListener(egret.TouchEvent.TOUCH_END, this.exeMicroEnd, this);
            this.talkImg.addEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, this.exeMicroEnd, this);

            let self = this;
            this.moveFlag = false;
            this.endFlag = false;
            this.recordBeginTime = egret.getTimer();
            this.recordBeginPos = event.stageY;
            self.startTickerTimer();

            self.talkMod.show(TalkUIState.TALKING, true);

            let sendData = {
                "eventType": SendNativeMsgType.SEND_NATIVE_RECORD_BEGIN,
                "data": {
                }
            }
            NativeBridge.getInstance().sendNativeMessage(JSON.stringify(sendData));
        }

        private exeMicroEnd(event: egret.TouchEvent) {
            egret.MainContext.instance.stage.removeEventListener(egret.TouchEvent.TOUCH_MOVE, this.exeMicroMove, this);
            this.talkImg.removeEventListener(egret.TouchEvent.TOUCH_END, this.exeMicroEnd, this);
            this.talkImg.removeEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, this.exeMicroEnd, this);
            if (this.endFlag) return;

            this.talkMod.hide();
            this.overTape();
        }

        private exeMicroMove(event: egret.TouchEvent) {
            if (this.endFlag) return;

            this.moveFlag = true;
            this.recordEndPos = event.stageY;

            let moveDis = this.recordBeginPos - this.recordEndPos;
            if (moveDis > this.thresholdValue) {
                this.talkMod.show(TalkUIState.CANCLE);
            }
            else {
                this.talkMod.show(TalkUIState.TALKING);
            }
        }

        private overTape() {
            this.stopTickerTimer();
            this.endFlag = true;

            let state: RecordResult;
            if ( (egret.getTimer()-this.recordBeginTime) < 1000 ) {
                this.talkMod.show(TalkUIState.SHORT);

                state = RecordResult.RECORD_CANCLE;
            }
            else if ( this.moveFlag && ( (this.recordBeginPos - this.recordEndPos) > this.thresholdValue ) ) {
                state = RecordResult.RECORD_CANCLE;
            }
            else {
                state = RecordResult.RECORD_SUCCESS;
            }

            let jsonData = {
                "eventType": SendNativeMsgType.SEND_NATIVE_RECORD_END,
                "data": {
                    "state": state
                }
            }
            NativeBridge.getInstance().sendNativeMessage(JSON.stringify(jsonData));
        }

        /**定时任务 TalkState.progressTime */
        private ticker() {
            let self = this;

            self.talkMod.hide();
            self.overTape();
        }

        private startTickerTimer(): void {
            let self = this;
            if (!self._timeTickerTimer) {
                let timer: Game.Timer = new Game.Timer(TalkState.progressTime);
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
}