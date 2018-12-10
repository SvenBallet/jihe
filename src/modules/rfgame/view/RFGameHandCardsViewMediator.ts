module FL {
    export class RFGameHandCardsViewMediator extends puremvc.Mediator implements puremvc.IMediator {

        public static readonly NAME: string = "RFGameHandCardsViewMediator";
        /** 手里的牌显示操作类 */
        private readonly cView: RFGameHandCardsView;

        /** 计时器 */
        private _tickerTimer: Game.Timer;
        /** 当前显示的时间 */
        private _times: number = 0;

        constructor(pView: RFGameHandCardsView) {
            super(RFGameHandCardsViewMediator.NAME, pView);
            this.cView = pView;
            this.cView.myHandGroupHandle = new RFMyHandGroupHandle();
            this.cView.myHandGroup.addChild(this.cView.myHandGroupHandle);
            // this._upHandGroupHandle = new HandGroupHandle(PZOrientation.UP, pView.upHandGroup);
            // this._downHandGroupHandle = new RFMyHandGroupHandle();
            // pView._bottomhandGroup.addChild(this._downHandGroupHandle)
            // this._leftHandGroupHandle = new HandGroupHandle(PZOrientation.LEFT, pView.leftHandGroup);
            // this._rightHandGroupHandle = new HandGroupHandle(PZOrientation.RIGHT, pView.rightHandGroup);
            this.registerAllEvent(pView);
        }

        /**
         * 移除之后调用
         */
        public onRemove(): void {
            if (this._tickerTimer && this._tickerTimer.running) {
                this._tickerTimer.stop();
            }
        }

        /**
         * 注册所有事件
         */
        private registerAllEvent(pView: RFGameHandCardsView): void {
            let self = this;

            // //---test
            // pView.addSingleEndEffect(PZOrientation.RIGHT);
            // pView.addSingleEndEffect(PZOrientation.UP);
            // pView.addSingleEndEffect(PZOrientation.DOWN);
            // pView.addSingleEndEffect(PZOrientation.LEFT);
        }


        /**
         * 感兴趣的通知指令
         * @returns {Array<any>}
         */
        public listNotificationInterests(): Array<any> {
            return [
                AppModule.APP_BACK_FROM_BACKSTAGE,
                RFGameModule.GAME_SHOW_TIMER,
                RFGameModule.GAME_HIDE_TIMER,
                RFGameModule.GAME_SHOW_CONTROL,
                RFGameModule.GAME_HIDE_CONTROL,
                RFGameModule.RESET_HAND_CARDS,
                RFGameModule.CARD_SINGLE_END,
                RFGameModule.REDRAW_HAND_CARDS,
                RFGameModule.RFGAME_CHANGE_REST_CARD_NUM,
                RFGameModule.REMOVE_CARDS_SHADE,
                RFGameModule.RFGAME_CHANGE_REST_TOTAL_NUM,
                RFGameModule.GAME_OVER_SHOW_HAND,
                RFGameModule.RFGAME_CHANGE_POKER_STYLE
            ];
        }

        /**
         * 处理通知
         * @param {puremvc.INotification} pNotification
         */
        public handleNotification(pNotification: puremvc.INotification): void {
            let data: any = pNotification.getBody();
            switch (pNotification.getName()) {
                case AppModule.APP_BACK_FROM_BACKSTAGE:
                    egret.log("# delayedYbqPlay");
                    this.cView.myHandGroupHandle.delayedYbqPlay(1350);
                    break;
                case RFGameModule.GAME_SHOW_TIMER:
                    this.cView.changeTimerPos(data);
                    this.cView.isShowTimer(true);
                    this.restartTimer();
                    // if (data == PZOrientation.DOWN) {
                    //     //强制打开开关
                    //     RFGameHandle.touchHandCardSwitch.compelOpen();
                    //     MvcUtil.send(RFGameModule.GAME_SHOW_CONTROL);
                    // } else {
                    //     MvcUtil.send(RFGameModule.GAME_HIDE_CONTROL);
                    // }
                    break;
                case RFGameModule.GAME_HIDE_TIMER:
                    this.cView.isShowTimer(false);
                    break;
                case RFGameModule.GAME_SHOW_CONTROL:
                    //强制打开开关
                    RFGameHandle.touchHandCardSwitch.compelOpen();
                    this.cView.isShowControl(true);
                    this.cView.myHandGroupHandle.changeControl(data);
                    break;
                case RFGameModule.GAME_HIDE_CONTROL:
                    this.cView.isShowControl(false);
                    break;
                case RFGameModule.RESET_HAND_CARDS:
                    this.cView.myHandGroupHandle.resetCardState();
                    break;
                case RFGameModule.CARD_SINGLE_END:
                    this.cView.addSingleEndEffect(data);
                    break;
                case RFGameModule.REDRAW_HAND_CARDS:
                    this.redrawHandCards(data);
                    break;
                case RFGameModule.RFGAME_CHANGE_REST_CARD_NUM:
                    this.cView.changeRestHandNum(RFGameHandle.getPZOrientation(data.tablePos), data.value);
                    break;
                case RFGameModule.RFGAME_CHANGE_REST_TOTAL_NUM:
                    this.cView.changeRestCardsNum(data);
                    break;
                case RFGameModule.REMOVE_CARDS_SHADE:
                    this.cView.myHandGroupHandle.remShade();
                    // 重置牌选中状态
                    this.cView.myHandGroupHandle.resetCardState();
                    break;
                case RFGameModule.GAME_OVER_SHOW_HAND:
                    this.showRestCards(data);
                    break;
                case RFGameModule.RFGAME_CHANGE_POKER_STYLE:
                    this.changePokerStyle();
                    break;
            }
        }

        /**
         * 更换手牌风格
         */
        public changePokerStyle() {
            let self = this;

            let groArr: Array<eui.Group> = [self.cView.upCardsGroup, self.cView.leftCardsGroup, self.cView.rightCardsGroup];
            for (let j = 0;j < groArr.length;j ++) {
                let group: eui.Group = groArr[j];
                if (!group) return;
                for (let i = group.numChildren - 1; i >= 0; i--) {
                    let card: any = group.getChildAt(i);
                    if (!card || !(card instanceof RFHandCardItemView)) continue;
                    (<RFHandCardItemView>card).rePokerStyle();
                }
            }

            self.cView.myHandGroupHandle.rePokerStyle();
        }

        /**
         * 重新开始定时器
         */
        public restartTimer(): void {
            let self = this;
            if (!RFGameHandle.isReplay()) {
                if (!self._tickerTimer) {
                    let vTimer: Game.Timer = new Game.Timer(1000);
                    vTimer.addEventListener(egret.TimerEvent.TIMER, self.tickerUpdate, self);
                    self._tickerTimer = vTimer;
                }
                if (!self._tickerTimer.running) {
                    self._tickerTimer.reset();
                    self._tickerTimer.start();
                } else { 
                    self._times = 0;
                    self._tickerTimer.reset();
                    self._tickerTimer.start();
                }
                //设置总时间
                self.setTimerView(RFGameHandle.getPlayerOperationTime());
            } else {
                //设置总时间 回放中 一直为 0
                self.setTimerView(0);
            }
        }

        /** 
         * 显示剩余卡牌
         */
        private showRestCards(msg: PokerGameOverViewHandCardsMsgAck) {
            // console.log(msg);
            this.cView.drawRest(RFGameData.restCardsData, RFGameData.isShowRestCardsNum);
        }

        /**
         * 重新绘制手牌
         */
        private redrawHandCards(tablePos: number) {
            let pzOrientation = RFGameHandle.getPZOrientation(tablePos);
            if (pzOrientation === PZOrientation.DOWN) {
                this.cView.myHandGroupHandle.resetView();
            } else {
                this.cView.remCardsGroup(pzOrientation);
                this.cView.drawCards(RFGameData.playerCardsData[tablePos], pzOrientation);
            }
        }

        /**
         * 没秒更新
         */
        private tickerUpdate(): void {
            //设置时间
            this.setTimerView(RFGameHandle.getPlayerOperationTime() - this._tickerTimer.currentCount);
        }


        /**
         * 设置时间显示
         * @param {number} second
         */
        private setTimerView(second: number): void {
            if (second >= 100) {
                second = 99;
            } else if (second < 0) {
                second = 0;
            }
            if (this._times !== second) {
                let vTensDigit: number = Math.floor(second / 10);
                let vUnitsDigit: number = second % 10;
                //获得界面
                this.cView.timerTens.source = vTensDigit + "_png";
                this.cView.timerUnits.source = vUnitsDigit + "_png";
                this._times = second;
            }
        }

        /**
         * 开始游戏，重置显示
         */
        public startGame(): void {
            let self = this;
            this.cView.initView();
            //刷新所有人剩余手牌余牌
            let vMsg: PokerStartCircleGameMsgAck = RFGameHandle.getGameStartMsg();
            vMsg.playerInfos.forEach(x => {
                this.cView.changeRestHandNum(RFGameHandle.getPZOrientation(x.tablePos), x.handCardNum);
            })
            //刷新总余牌数
            this.cView.changeRestCardsNum(RFGameData.restTotalCardsNum);
            // self._downHandGroupHandle.resetViewHandCard(MJGameHandler.getHandCardArray(PZOrientation.DOWN));
            // if (MJGameHandler.isReplay()) {
            //     // 重播
            //     self._upHandGroupHandle.resetViewHandCard(MJGameHandler.getHandCardArray(PZOrientation.UP));
            //     self._leftHandGroupHandle.resetViewHandCard(MJGameHandler.getHandCardArray(PZOrientation.LEFT));
            //     self._rightHandGroupHandle.resetViewHandCard(MJGameHandler.getHandCardArray(PZOrientation.RIGHT));
            // } else {
            //     self._upHandGroupHandle.resetHideHandCard();
            //     self._leftHandGroupHandle.resetHideHandCard();
            //     self._rightHandGroupHandle.resetHideHandCard();
            // }

            // // 因为头像移动有可能存在缓动的情况(头像缓存时间是200毫秒)，所以延迟重设一个下下面玩家头像点击区域
            // MyCallBackUtil.delayedCallBack(300, self.getView().resetHeadViewDownClickAreaPos, self.getView());
        }

        public getView() {
            return this.viewComponent;
        }
    }
}