module FL {

    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase - MJGameReplayHandleView
     * @Description:  // 麻将回放操作界面
     * @Create: DerekWu on 2018/1/19 11:02
     * @Version: V1.0
     */
    export class MJGameReplayHandleView extends BaseView {

        /** 单例 */
        private static _onlyOne: MJGameReplayHandleView;

        //调停者名字，删除界面的时候会自动移除
        public readonly mediatorName: string;
        //界面层级，UI框架自动管理
        public readonly viewLayer: ViewLayerEnum = ViewLayerEnum.BOTTOM;

        /** 暂停 或者 按钮 */
        public pauseOrReplayBtnGroup:eui.Group;
        public pauseOrReplayBtn:eui.Image;

        /** 改变速度按钮 增加速度，当速度满了的时候，图片变成减速，再点就是变成 x1*/
        public changeSpeedBtnGroup:eui.Group;
        public changeSpeedBtn:eui.Image;

        public changeSpeedBtnGroupS:eui.Group;
        public changeSpeedBtnS:eui.Image;

        /** 显示文字 */
        // public speedText:eui.Label;

        private constructor() {
            super();
            this.verticalCenter = -20;
            this.horizontalCenter = 0;
            this.skinName = "skins.MJGameReplayHandleViewSkin";
            // 可触摸, 这里已经屏蔽了所有向下的事件
            this.touchEnabled = true;
        }

        public static getInstance():MJGameReplayHandleView {
            if (!this._onlyOne) {
                this._onlyOne = new MJGameReplayHandleView();
            }
            return this._onlyOne;
        }

        protected createChildren():void {
            super.childrenCreated();
            let self = this;
            //注册按钮点击缓动
            TouchTweenUtil.regTween(self.pauseOrReplayBtnGroup, self.pauseOrReplayBtn);
            TouchTweenUtil.regTween(self.changeSpeedBtnGroup, self.changeSpeedBtn);
            TouchTweenUtil.regTween(self.changeSpeedBtnGroupS, self.changeSpeedBtnS);
            //注册按钮点击事件
            self.pauseOrReplayBtnGroup.addEventListener(egret.TouchEvent.TOUCH_TAP, self.pauseOrReplay, self);
            self.changeSpeedBtnGroup.addEventListener(egret.TouchEvent.TOUCH_TAP, self.changeSpeed, self);
            self.changeSpeedBtnGroupS.addEventListener(egret.TouchEvent.TOUCH_TAP, self.changeSpeedSlow, self);

            // // 重置速度显示
            // self.resetSpeedView();
        }

        /** 添加到界面以后框架自动调用 */
        protected onAddView():void {
            this.pauseOrReplayBtn.source = "pause_png";
            // 重置速度显示
            // this.resetSpeedView();
        }

        /**
         * 暂停 或者 继续播放
         * @param {egret.TouchEvent} e
         */
        private pauseOrReplay(e:egret.TouchEvent):void {
            if (this.pauseOrReplayBtn.source === "play_png") {
                this.pauseOrReplayBtn.source = "pause_png";
                MahjongLogReplay.goOnPlay();
            } else {
                this.pauseOrReplayBtn.source = "play_png";
                MahjongLogReplay.stopPlay();
            }
        }

        /**
         * 改变速度
         * @param {egret.TouchEvent} e
         */
        private changeSpeed(e:egret.TouchEvent):void {
            let vCurrSpeed:ReplaySpeedEnum = MahjongLogReplay.getCurrSpeed();
            if (vCurrSpeed === ReplaySpeedEnum.ONE) {
                MahjongLogReplay.changeSpeed(ReplaySpeedEnum.TWO);
            } else if (vCurrSpeed === ReplaySpeedEnum.TWO) {
                MahjongLogReplay.changeSpeed(ReplaySpeedEnum.FOUR);
            } else if (vCurrSpeed === ReplaySpeedEnum.FOUR) {
                // MahjongLogReplay.changeSpeed(ReplaySpeedEnum.ONE);
            }
            // 重置速度显示
            // this.resetSpeedView();
        }

        /**
         * 改变速度
         * @param {egret.TouchEvent} e
         */
        private changeSpeedSlow(e:egret.TouchEvent):void {
            let vCurrSpeed:ReplaySpeedEnum = MahjongLogReplay.getCurrSpeed();
            if (vCurrSpeed === ReplaySpeedEnum.ONE) {
                // MahjongLogReplay.changeSpeed(ReplaySpeedEnum.FOUR);
            } else if (vCurrSpeed === ReplaySpeedEnum.TWO) {
                MahjongLogReplay.changeSpeed(ReplaySpeedEnum.ONE);
            } else if (vCurrSpeed === ReplaySpeedEnum.FOUR) {
                MahjongLogReplay.changeSpeed(ReplaySpeedEnum.TWO);
            }
            // 重置速度显示
            // this.resetSpeedView();
        }

        /**
         * 重置速度显示
         */
        // private resetSpeedView(): void {
        //     let vCurrSpeed:ReplaySpeedEnum = MahjongLogReplay.getCurrSpeed();
        //     if (vCurrSpeed === ReplaySpeedEnum.ONE) {
        //         this.speedText.text = "x1";
        //         this.changeSpeedBtn.source = "fast_png";
        //     } else if (vCurrSpeed === ReplaySpeedEnum.TWO) {
        //         this.speedText.text = "x2";
        //         this.changeSpeedBtn.source = "fast_png";
        //     } else if (vCurrSpeed === ReplaySpeedEnum.FOUR) {
        //         this.speedText.text = "x4";
        //         this.changeSpeedBtn.source = "slow_png";
        //     }
        // }

    }

}