module FL {
    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase - MJGameChooseXiaMa
     * @Description:  下码选择
     * @Create: ArielLiang on 2018/1/22 20:40
     * @Version: V1.0
     */
    export class MJGameChooseXiaMa extends BaseView {

        //调停者名字，删除界面的时候会自动移除
        public readonly mediatorName: string;
        //界面层级，UI框架自动管理
        public readonly viewLayer: ViewLayerEnum = ViewLayerEnum.BOTTOM;

        public xiaMaGroup:eui.Group;

        public xiaMaBtn:GameButton;
        public buXiaMaBtn:GameButton;

        /** 时间 */
        public timeLabel:eui.Label;

        /** 定时器 */
        private _timeTickerTimer:Game.Timer;
        /** 倒计时剩余时间（秒） */
        private _leftTimes:number;

        public constructor() {
            super();
            this.skinName = "skins.MJGameChooseXiaMaSkin";
            this.horizontalCenter = 0, this.bottom = 0;
            this._leftTimes = 15;
        }

        protected childrenCreated():void{
            super.childrenCreated();
            let self = this;
            //注册按钮点击缓动
            TouchTweenUtil.regTween(self.xiaMaBtn, self.xiaMaBtn);
            TouchTweenUtil.regTween(self.buXiaMaBtn, self.buXiaMaBtn);
            self.xiaMaBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, self.chooseXiaMa, self);
            self.buXiaMaBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, self.chooseBuXiaMa, self);

        }

        private chooseXiaMa(e:egret.TouchEvent):void{
            this.exeChoose(1);
        }

        private chooseBuXiaMa(e:egret.TouchEvent):void{
            this.exeChoose(0);
        }

        private exeChoose(xiaMaValue: number): void {
            //发送消息个服务器
            let vPlayerTableOperationMsg:PlayerTableOperationMsg = new PlayerTableOperationMsg();
            vPlayerTableOperationMsg.operation = GameConstant.GAME_OPERTAION_XIA_MA;
            vPlayerTableOperationMsg.opValue = xiaMaValue;
            ServerUtil.sendMsg(vPlayerTableOperationMsg);

            // 关闭界面
            MvcUtil.delView(this);
        }

        /** 添加到舞台以后框架自动调用 */
        protected onAddView():void {
            //启动定时任务
            this.startTickerTimer();
        }

        /** 从舞台移除以后框架自动调用 */
        protected onRemView():void {
            this.stopTickerTimer();
        }

        /**
         * 启动定时任务
         */
        public startTickerTimer():void {
            let self = this;
            //添加定时任务,1秒钟任务一次
            if (!self._timeTickerTimer) {
                let timer: Game.Timer = new Game.Timer(1000);
                timer.addEventListener(egret.TimerEvent.TIMER, self.updateTimer, self);
                self._timeTickerTimer = timer;
            }
            if (!self._timeTickerTimer.running) {
                self._timeTickerTimer.start();
            }
        }

        /**
         * 停止定时任务
         */
        public stopTickerTimer():void {
            let self = this;
            //添加定时任务,1秒钟任务一次
            if (self._timeTickerTimer) {
                if (self._timeTickerTimer.running) {
                    self._timeTickerTimer.stop();
                }
            }
        }

        /**
         * 定时器更新
         */
        public updateTimer(e:egret.TimerEvent):void {
            let self = this;
            //递减
            self._leftTimes--;
            //设置时间
            if (self._leftTimes >= 0) {
                self.timeLabel.text = ""+self._leftTimes;
            } else {
                self.timeLabel.text = "0";
                self.stopTickerTimer();
            }
        }
    }
}