module FL {
    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase - MJGameChooseZuoLaPao
     * @Description:  坐拉跑选择
     * @Create: ArielLiang on 2018/1/22 20:40
     * @Version: V1.0
     */
    export class MJGameChooseZuoLaPao extends BaseView {

        //调停者名字，删除界面的时候会自动移除
        public readonly mediatorName: string;
        //界面层级，UI框架自动管理
        public readonly viewLayer: ViewLayerEnum = ViewLayerEnum.BOTTOM;


        public zuoLaPaoGroup:eui.Group;

        public buZuoBtn:GameButton;
        public zuoBtn1:GameButton;
        public zuoBtn2:GameButton;

        public buLaBtn:GameButton;
        public laBtn1:GameButton;
        public laBtn2:GameButton;

        public buPaoBtn:GameButton;
        public paoBtn1:GameButton;
        public paoBtn2:GameButton;

        /** 时间 */
        public timeLabel:eui.Label;

        /** 定时器 */
        private _timeTickerTimer:Game.Timer;
        /** 倒计时剩余时间（秒） */
        private _leftTimes:number;

        /** 选择坐拉跑通知消息 */
        private readonly _zuoLaPaoNotifyMsg:PlayerZuoLaPaoNotifyMsg;

        /** 选择的坐拉跑消息 */
        private readonly _zuoLaPaoInfo:PlayerZuoLaPaoInfo;

        public constructor(msg:PlayerZuoLaPaoNotifyMsg) {
            super();
            this.skinName = "skins.MJGameChooseZuoLaPaoSkin";
            this._zuoLaPaoNotifyMsg = msg;
            this.horizontalCenter = 0, this.bottom = 0;
            this._leftTimes = 15;
            this._zuoLaPaoInfo = new PlayerZuoLaPaoInfo();
        }

        protected childrenCreated():void{
            super.childrenCreated();
            let self = this;

            //注册按钮点击缓动
            if (self._zuoLaPaoNotifyMsg.isNeedXiaZuo) {
                // 坐
                TouchTweenUtil.regTween(self.buZuoBtn, self.buZuoBtn);
                TouchTweenUtil.regTween(self.zuoBtn1, self.zuoBtn1);
                TouchTweenUtil.regTween(self.zuoBtn2, self.zuoBtn2);
                self.buZuoBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, self.chooseBuZuo, self);
                self.zuoBtn1.addEventListener(egret.TouchEvent.TOUCH_TAP, self.chooseZuo1, self);
                self.zuoBtn2.addEventListener(egret.TouchEvent.TOUCH_TAP, self.chooseZuo2, self);
            } else {
                self.zuoLaPaoGroup.removeChild(self.buZuoBtn);
                self.zuoLaPaoGroup.removeChild(self.zuoBtn1);
                self.zuoLaPaoGroup.removeChild(self.zuoBtn2);
            }

            if (self._zuoLaPaoNotifyMsg.isNeedXiaLa) {
                // 拉
                TouchTweenUtil.regTween(self.buLaBtn, self.buLaBtn);
                TouchTweenUtil.regTween(self.laBtn1, self.laBtn1);
                TouchTweenUtil.regTween(self.laBtn2, self.laBtn2);
                self.buLaBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, self.chooseBuLa, self);
                self.laBtn1.addEventListener(egret.TouchEvent.TOUCH_TAP, self.chooseLa1, self);
                self.laBtn2.addEventListener(egret.TouchEvent.TOUCH_TAP, self.chooseLa2, self);
            } else {
                self.zuoLaPaoGroup.removeChild(self.buLaBtn);
                self.zuoLaPaoGroup.removeChild(self.laBtn1);
                self.zuoLaPaoGroup.removeChild(self.laBtn2);
            }

            // 跑
            TouchTweenUtil.regTween(self.buPaoBtn, self.buPaoBtn);
            TouchTweenUtil.regTween(self.paoBtn1, self.paoBtn1);
            TouchTweenUtil.regTween(self.paoBtn2, self.paoBtn2);
            self.buPaoBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, self.chooseBuPao, self);
            self.paoBtn1.addEventListener(egret.TouchEvent.TOUCH_TAP, self.choosePao1, self);
            self.paoBtn2.addEventListener(egret.TouchEvent.TOUCH_TAP, self.choosePao2, self);

        }

        private chooseBuZuo(e:egret.TouchEvent):void{
            this._zuoLaPaoInfo.zuoNumber = 0;
            this.choosedZuo();
        }

        private chooseZuo1(e:egret.TouchEvent):void{
            this._zuoLaPaoInfo.zuoNumber = 1;
            this.choosedZuo();
        }

        private chooseZuo2(e:egret.TouchEvent):void{
            this._zuoLaPaoInfo.zuoNumber = 2;
            this.choosedZuo();
        }

        private choosedZuo(): void {
            let self = this;
            self.buZuoBtn.alpha = self.zuoBtn1.alpha = self.zuoBtn2.alpha = 0.5;
            self.buZuoBtn.touchEnabled = self.zuoBtn1.touchEnabled = self.zuoBtn2.touchEnabled = false;
            // 处理选择
            self.exeChoose();
        }

        private chooseBuLa(e:egret.TouchEvent):void{
            this._zuoLaPaoInfo.laNumber = 0;
            this.choosedLa();
        }

        private chooseLa1(e:egret.TouchEvent):void{
            this._zuoLaPaoInfo.laNumber = 1;
            this.choosedLa();
        }

        private chooseLa2(e:egret.TouchEvent):void{
            this._zuoLaPaoInfo.laNumber = 2;
            this.choosedLa();
        }

        private choosedLa(): void {
            let self = this;
            self.buLaBtn.alpha = self.laBtn1.alpha = self.laBtn2.alpha = 0.5;
            self.buLaBtn.touchEnabled = self.laBtn1.touchEnabled = self.laBtn2.touchEnabled = false;
            // 处理选择
            self.exeChoose();
        }

        private chooseBuPao(e:egret.TouchEvent):void{
            this._zuoLaPaoInfo.paoNumber = 0;
            this.choosedPao();
        }

        private choosePao1(e:egret.TouchEvent):void{
            this._zuoLaPaoInfo.paoNumber = 1;
            this.choosedPao();
        }

        private choosePao2(e:egret.TouchEvent):void{
            this._zuoLaPaoInfo.paoNumber = 2;
            this.choosedPao();
        }

        private choosedPao(): void {
            let self = this;
            self.buPaoBtn.alpha = self.paoBtn1.alpha = self.paoBtn2.alpha = 0.5;
            self.buPaoBtn.touchEnabled = self.paoBtn1.touchEnabled = self.paoBtn2.touchEnabled = false;
            // 处理选择
            self.exeChoose();
        }

        private exeChoose(): void {
            let vZuoLaPaoInfo: PlayerZuoLaPaoInfo = this._zuoLaPaoInfo;
            if (vZuoLaPaoInfo.paoNumber >= 0 && (vZuoLaPaoInfo.zuoNumber >= 0 || vZuoLaPaoInfo.laNumber >= 0)) {
                let vTempZuo:number = vZuoLaPaoInfo.zuoNumber >= 0?vZuoLaPaoInfo.zuoNumber:0;
                let vTempLa:number = vZuoLaPaoInfo.laNumber >= 0?vZuoLaPaoInfo.laNumber:0;
                let vTempPao:number = vZuoLaPaoInfo.paoNumber >= 0?vZuoLaPaoInfo.paoNumber:0;
                //发送消息个服务器
                let vPlayerTableOperationMsg:PlayerTableOperationMsg = new PlayerTableOperationMsg();
                vPlayerTableOperationMsg.operation = GameConstant.GAME_OPERTAION_XIA_ZUO_LA_PAO;
                vPlayerTableOperationMsg.opValue = (vTempPao << 16) | (vTempLa << 8) | (vTempZuo);
                ServerUtil.sendMsg(vPlayerTableOperationMsg);
                // 关闭界面
                MvcUtil.delView(this);
            }
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