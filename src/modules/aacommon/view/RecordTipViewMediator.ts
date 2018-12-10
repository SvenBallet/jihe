module FL {
    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase - RecordTipViewMediator
     * @Description:  //调停者
     * @Create: DerekWu on 2017/11/21 10:44
     * @Version: V1.0
     */
    export class RecordTipViewMediator extends puremvc.Mediator implements puremvc.IMediator {

        public static readonly NAME:string = "RecordTipViewMediator";

        /** 倒计时 */
        private _tickerTimer:Game.Timer;

        constructor (pView:RecordTipView) {
            super(RecordTipViewMediator.NAME, pView);
            this.startTimer();
            // 添加监听
            egret.MainContext.instance.stage.addEventListener(egret.TouchEvent.TOUCH_END, this.exeRecordEnd, this);
        }

        private getView():RecordTipView {
            return <RecordTipView>this.viewComponent;
        }

        /**
         * 开始定时器
         */
        public startTimer():void {
            let self = this;
            // 5秒换张图
            let vTimer:Game.Timer = new Game.Timer(300);
            vTimer.addEventListener(egret.TimerEvent.TIMER, self.tickerUpdate, self);
            self._tickerTimer = vTimer;
            vTimer.start();
        }

        /**
         * 移除之后调用
         */
        public onRemove():void {
            if (this._tickerTimer && this._tickerTimer.running) {
                this._tickerTimer.stop();
            }
            // 删除监听
            egret.MainContext.instance.stage.removeEventListener(egret.TouchEvent.TOUCH_END, this.exeRecordEnd, this);
        }

        /**
         * 定时器更新
         */
        private tickerUpdate():void {
            let vRecordTipView:RecordTipView = <RecordTipView>this.viewComponent;
            vRecordTipView.volumeImg.source = "recording_v"+(this._tickerTimer.currentCount%3+1)+"_png";
        }

        private exeRecordEnd(e:egret.TouchEvent):void {
            egret.MainContext.instance.stage.removeEventListener(egret.TouchEvent.TOUCH_END, this.exeRecordEnd, this);
            // this.closeView();
            WeChatJsSdkHandler.stopWeChatRecord(this.getView().startRecordActionId);
        }

        /**
         * 感兴趣的通知指令
         * @returns {Array<any>}
         */
        public listNotificationInterests():Array<any> {
            return [
                CommonModule.COMMON_WE_CHAT_STOP_RECORD
            ];
        }

        /**
         * 处理通知
         * @param {puremvc.INotification} pNotification
         */
        public handleNotification(pNotification:puremvc.INotification):void{
            // let data:any = pNotification.getBody();
            switch(pNotification.getName()) {
                case CommonModule.COMMON_WE_CHAT_STOP_RECORD:{
                    this.closeView();
                    break;
                }
            }
        }

        /**
         * 关闭界面
         */
        private closeView():void {
            MvcUtil.delView(this.viewComponent);
        }

    }
}