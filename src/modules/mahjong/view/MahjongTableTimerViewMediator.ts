module FL {

    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase - MahjongTableTimerViewMediator
     * @Description:  //调停者
     * @Create: DerekWu on 2017/11/21 15:37
     * @Version: V1.0
     */
    export class MahjongTableTimerViewMediator extends puremvc.Mediator implements puremvc.IMediator {

        public static readonly NAME:string = "MahjongTableTimerViewMediator";

        /** 倒计时 */
        private _tickerTimer:Game.Timer;

        /** 当前显示的时间 */
        private _times:number = 0;

        constructor (pView:MahjongTableTimerView) {
            super(MahjongTableTimerViewMediator.NAME, pView);
        }

        /**
         * 注册之后调用
         */
        // public onRegister():void {
        //     egret.log("----onRegister");
        // }

        /**
         * 移除之后调用
         */
        public onRemove():void {
            if (this._tickerTimer && this._tickerTimer.running) {
                this._tickerTimer.stop();
            }
        }

        /**
         * 感兴趣的通知指令
         * @returns {Array<any>}
         */
        public listNotificationInterests():Array<any> {
            return [
                MahjongModule.MAHJONG_REMIND_PLAYER_HANDLE
            ];
        }

        /**
         * 处理通知
         * @param {puremvc.INotification} pNotification
         */
        public handleNotification(pNotification:puremvc.INotification):void {
            let data:any = pNotification.getBody();
            switch(pNotification.getName()) {
                case MahjongModule.MAHJONG_REMIND_PLAYER_HANDLE:{
                    this.tipPlayerHandle(data);
                    break;
                }
            }
        }

        /**
         * 处理提示玩家操作
         * @param {number} tablePos
         */
        private tipPlayerHandle(tablePos:number):void {
            //获得牌桌方向
            let vPZOrientation:PZOrientation = MahjongHandler.getPZOrientation(tablePos);
            this.tipPlayerHandleByOrientation(vPZOrientation);
        }

        /**
         *  处理提示玩家操作 通过方向
         * @param {FL.PZOrientation} pPZOrientation
         */
        public tipPlayerHandleByOrientation(pPZOrientation:PZOrientation):void {
            //获得界面
            let vView:MahjongTableTimerView = <MahjongTableTimerView>this.viewComponent;
            //改变方向
            vView.changeHandleOrientation(pPZOrientation);
            //重新开始定时器
            this.restartTimer();
            //设置当前操作方向
            MahjongHandler.setCurrOperationOrientation(pPZOrientation);
        }

        /**
         * 重新开始定时器
         */
        public restartTimer():void {
            let self = this;
            if (!MahjongHandler.isReplay()) {
                if (!self._tickerTimer) {
                    let vTimer:Game.Timer = new Game.Timer(1000);
                    vTimer.addEventListener(egret.TimerEvent.TIMER, self.tickerUpdate, self);
                    self._tickerTimer = vTimer;
                }
                if (!self._tickerTimer.running) {
                    self._tickerTimer.start();
                } else {
                    self._tickerTimer.reset();
                    self._tickerTimer.start();
                }
                //设置总时间
                self.setTimerView(MahjongHandler.getPlayerOperationTime());
            } else {
                //设置总时间 回放中 一直为 0
                self.setTimerView(0);
            }
        }

        /**
         * 没秒更新
         */
        private tickerUpdate():void {
            //设置时间
            this.setTimerView(MahjongHandler.getPlayerOperationTime()-this._tickerTimer.currentCount);
        }


        /**
         * 设置时间显示
         * @param {number} second
         */
        private setTimerView(second:number):void {
            if (second >= 100) {
                second = 99;
            } else if (second < 0) {
                second = 0;
            }
            if (this._times !== second) {
                let vTensDigit:number = Math.floor(second/10);
                let vUnitsDigit:number = second%10;
                //获得界面
                let vView:MahjongTableTimerView = <MahjongTableTimerView>this.viewComponent;
                vView.timerTensDigit.source = vTensDigit+"_png";
                vView.timerUnitsDigit.source = vUnitsDigit+"_png";
                this._times = second;
            }
        }

    }

}