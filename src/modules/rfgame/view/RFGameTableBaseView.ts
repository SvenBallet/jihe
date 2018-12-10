module FL {
    /** 牌桌基础界面 */
    export class RFGameTableBaseView extends BaseView {
        /** 单例 */
        private static _onlyOne: RFGameTableBaseView;

        //调停者名字，删除界面的时候会自动移除
        public readonly mediatorName: string = RFGameTableBaseViewMediator.NAME;
        //界面层级，UI框架自动管理
        public readonly viewLayer: ViewLayerEnum = ViewLayerEnum.BOTTOM_ONLY;

        /** 牌桌背景，用来界面编辑的时候用，初始化完毕后即会移除 */
        public pzBg: eui.Image;

        /** 玩家头像等显示信息  上下左右 */
        public headViewUp: PZHeadAreaView;
        public headViewDown: PZHeadAreaView;
        public headViewLeft: PZHeadAreaView;
        public headViewRight: PZHeadAreaView;

        /** 底层触摸层，用于重置当前手牌显示状态 */
        public touchGroup: eui.Group;

        /** 中间区域 复制房间Id按钮  分享按钮  等待中文字 */
        public middleGroup: eui.Group;
        public inviteFriend: eui.Image;
        public waitingLabel: eui.Label;
        public copyRoomId: GameButton;

        /** 准备按钮 */
        public readyBtn: eui.Image;
        private flag_ready: boolean;

        /** 调停者 */
        private _mediator: RFGameTableBaseViewMediator;

        /** 定时更新耐心等待...文字定时任务 */
        private _tickerUpdateWaitingLabelTimer: Game.Timer;

        private constructor() {
            super();
            this.top = this.bottom = this.left = this.right = 0;
            this.skinName = "skins.TableBoardBaseViewSkin";
            //不可触摸
            this.touchEnabled = false;
            this.addEventListener(egret.Event.REMOVED_FROM_STAGE,this.onRemove,this);
        }

        private onRemove() {
            let self = this;
            // self.headViewUp.clearHeadImg();
            // self.headViewDown.clearHeadImg();
            // self.headViewLeft.clearHeadImg();
            // self.headViewRight.clearHeadImg();
        }

        public static getInstance(): RFGameTableBaseView {
            if (!this._onlyOne) {
                this._onlyOne = new RFGameTableBaseView();
                // this._onlyOne.in
            }
            return this._onlyOne;
        }

        protected childrenCreated(): void {
            super.childrenCreated();
            let self = this;
            //删除牌桌背景
            self.removeChild(self.pzBg);
            this.touchGroup = new eui.Group();
            this.touchGroup.top = this.touchGroup.bottom = this.touchGroup.left = this.touchGroup.right = 0;
            this.addChildAt(this.touchGroup, 0);
            //注册按钮点击缓动
            TouchTweenUtil.regTween(self.copyRoomId, self.copyRoomId);
            TouchTweenUtil.regTween(self.inviteFriend, self.inviteFriend);
            TouchTweenUtil.regTween(self.readyBtn, self.readyBtn);

            //调停者
            self._mediator = new RFGameTableBaseViewMediator(self);
        }

        /** 添加到舞台以后框架自动调用 */
        protected onAddView(): void {
            MvcUtil.regMediator(this._mediator);
            //启动定时任务
            this.startTickerTimer();
        }

        /** 从舞台移除以后框架自动调用 */
        protected onRemView(): void {
            this.stopTickerTimer();
            //销毁卡牌对象池
            RFCardItemPool.destoryPool();
        }

        /**
        * 进入牌桌
        */
        public intoTableBoard(): void {
            // console.log("into ok");
            let self = this;
            //初始化各个头像区域的数据
            self.initHeadArea(PZOrientation.UP);
            self.initHeadArea(PZOrientation.DOWN);
            self.initHeadArea(PZOrientation.LEFT);
            self.initHeadArea(PZOrientation.RIGHT);

            //显示中间区域
            ViewUtil.addChild(self, self.middleGroup);

            //是否金币场
            let vIsVipRoom: boolean = RFGameHandle.isVipRoom(); //判断是否金币场
            if (!vIsVipRoom) {
                //金币场删除两个按钮
                ViewUtil.removeChild(self.middleGroup, self.copyRoomId);
                ViewUtil.removeChild(self.middleGroup, self.inviteFriend);
                //文字摆中间
                // self.waitingLabel.y = 88;
            } else {
                //非金币场增加两个按钮
                // ViewUtil.addChild(self.middleGroup, self.copyRoomId);
                // ViewUtil.addChild(self.middleGroup, self.inviteFriend);
                //文字摆下面
                // self.waitingLabel.y = 196;
                //非金币场增加两个按钮
                // if (Game.CommonUtil.isNative) {
                //     ViewUtil.addChild(self.middleGroup, self.copyRoomId);
                // }
                // else {
                //     ViewUtil.removeChild(self.middleGroup, self.copyRoomId);
                // }
                // ViewUtil.addChild(self.middleGroup, self.inviteFriend);
                //如果人数满了，则隐藏中间按钮
                this.isHideMidGroup();
            }

            //是否显示准备按钮
            self.isShowReadyBtn(RFGameData.isNeedReady);
            //手牌操作开关关闭
            RFGameHandle.touchHandCardSwitch.close();
        }

        /**
        * 开始游戏
        */
        public startGame(): void {
            //获得庄的方向
            let vZhuangPZOrientation: PZOrientation = RFGameHandle.getDealerOrientation();
            let self = this;
            //开始游戏处理各个头像区域的数据
            self.exeHeadAreaStartGame(PZOrientation.UP, vZhuangPZOrientation);
            self.exeHeadAreaStartGame(PZOrientation.DOWN, vZhuangPZOrientation);
            self.exeHeadAreaStartGame(PZOrientation.LEFT, vZhuangPZOrientation);
            self.exeHeadAreaStartGame(PZOrientation.RIGHT, vZhuangPZOrientation);

            //停止定时器
            self.stopTickerTimer();

            //隐藏中间界面
            ViewUtil.removeChild(self, self.middleGroup);
            //隐藏准备按钮
            self.isShowReadyBtn(false);
        }

        /**
        * 处理开始游戏
        * @param {FL.PZOrientation} pPZOrientation
        * @param pZhuangPZOrientation
        */
        private exeHeadAreaStartGame(pPZOrientation: PZOrientation, pZhuangPZOrientation): void {
            let self = this;
            let vPZHeadAreaView: PZHeadAreaView = self.getHeadAreaView(pPZOrientation);
            let vSimplePlayer: GamePlayer = RFGameHandle.getGamePlayerInfo(pPZOrientation);
            if (vSimplePlayer !== null) {
                this.updateHeadArea(pPZOrientation);
                vPZHeadAreaView.startGame(pPZOrientation);
                //看看是否是庄
                if (pPZOrientation === pZhuangPZOrientation) {
                    vPZHeadAreaView.setZhuangIcon(true);
                }
                //是否是房主
                let vIsRoomOwner: boolean = RFGameHandle.isRoomOwner2(vSimplePlayer);
                vPZHeadAreaView.setRoomOwnerIcon(vIsRoomOwner);
            }
        }

        /**
       * 初始化头像区域
       * @param {FL.PZOrientation} pPZOrientation
       */
        private initHeadArea(pPZOrientation: PZOrientation): void {
            let self = this;
            let vPZHeadAreaView: PZHeadAreaView = self.getHeadAreaView(pPZOrientation);
            let vSimplePlayer: GamePlayer = RFGameHandle.getGamePlayerInfo(pPZOrientation);
            if (vSimplePlayer === null) {
                //没有这个位置
                // self.removeChild(vPZHeadAreaView);
                ViewUtil.removeChild(self, vPZHeadAreaView);
            } else {
                //必须存在
                // let vIndex:number = self.getChildIndex(vPZHeadAreaView);
                // if (vIndex === -1) self.addChild(vPZHeadAreaView);
                ViewUtil.addChild(self, vPZHeadAreaView);
                //初始化
                vPZHeadAreaView.init(pPZOrientation);

                if (vSimplePlayer) {
                    self.updateHeadAreaDate(pPZOrientation, vPZHeadAreaView, vSimplePlayer);
                }
            }
        }

        /**
       * 更新头像区域界面数据
       * @param {FL.PZOrientation} pPZOrientation
       * @param {FL.PZHeadAreaView} pPZHeadAreaView
       * @param {FL.GamePlayer} pSimplePlayer
       */
        private updateHeadAreaDate(pPZOrientation: PZOrientation, pPZHeadAreaView: PZHeadAreaView, pSimplePlayer: GamePlayer): void {
            let self = this;
            self.isHideMidGroup();
            //没有数据则重新初始化
            if (!pSimplePlayer) {
                //初始化
                pPZHeadAreaView.init(pPZOrientation);
                return;
            }
            // //名字颜色
            // let vNameColor: number = 0xFFFFFF;
            let vGpsInfo: NewUpdateGPSPositionMsgAck = RFGameHandle.getPlayerGPS(pPZOrientation);
            // if (pSimplePlayer.tableState === 2) {
            //     vNameColor = 0xAFAEAE;
            //     pPZHeadAreaView.setOfflineFlag(false);
            // } else {
            //     if (pSimplePlayer.tableState !== 1) {
            //         vNameColor = 0xAFAEAE;
            //         pPZHeadAreaView.setOfflineFlag(true);
            //     } else if (pSimplePlayer.tableState === GameConstant.PALYER_GAME_STATE_IN_TABLE_GAME_OVER_WAITING_TO_CONTINUE) {
            //         vNameColor = 0xAFAEAE;
            //         pPZHeadAreaView.setOfflineFlag(true);
            //     } else {
            //         pPZHeadAreaView.setOfflineFlag(false);
            //     }
            // }

            // 设置离线标记和名字
            pPZHeadAreaView.setOfflineAndLeaveFlagAndNameByGamePlayer(pSimplePlayer);

            if (GConf.Conf.useWXAuth) {
                pPZHeadAreaView.setPlayerHeadImg(pSimplePlayer.headImageUrl, pSimplePlayer.headImg);
            } else {
                // pPZHeadAreaView.setPlayerHeadImg("http://wx.qlogo.cn/mmopen/vi_32/UmK17f9nicVrMhSQAbft5KOfKdIiaSFUHiaOTpxVum5JZ8G5zibHzzLkTJBicEuibL44kmuc8X0NpUrfgqrFKBh5jM9Q/0");
                pPZHeadAreaView.setPlayerHeadImg(null, pSimplePlayer.headImg);
            }

            //判断是否金币场，显示金币还是分数
            let vIsGold: boolean = !RFGameHandle.isVipRoom();
            pPZHeadAreaView.setPlayerScoreOrGold(pSimplePlayer.chip, pSimplePlayer.zhongTuScore, pSimplePlayer.scoreChipRate);
            if (RFGameHandle.getGameState() === EGameState.WAITING_START) {
                //等待开始状态
                //是否Ok
                // let vIsOk: boolean = pSimplePlayer.tableState === 1 ? true : false;
                // if (pSimplePlayer.tableState === GameConstant.PALYER_GAME_STATE_IN_TABLE_GAME_OVER_WAITING_TO_CONTINUE) {
                //     vIsOk = false;
                // }
                let vIsOk = pSimplePlayer.isReady;
                pPZHeadAreaView.setOkIcon(vIsOk);
                //是都显示gps
                // let vGpsInfo:UpdatePlayerGPSMsg = MJGameData.playerGps[pSimplePlayer.tablePos];
                pPZHeadAreaView.isGpsOn = vIsOk && vGpsInfo ? true : false;
                pPZHeadAreaView.setGpsIcon(pPZHeadAreaView.isGpsOn);
                //是否是房主
                let vIsRoomOwner: boolean = RFGameHandle.isRoomOwner2(pSimplePlayer);
                pPZHeadAreaView.setRoomOwnerIcon(vIsRoomOwner);
                //庄家位置，进入游戏才有
                pPZHeadAreaView.setZhuangIcon(false);
                if (pPZOrientation === PZOrientation.DOWN) {
                    self.changeReadyState(!vIsOk);
                }
            }

        }

        /**
         * 根据房间已有人数及状态，确定是否隐藏中间按钮
         */
        private isHideMidGroup() {
            let self = this;
            if (RFGameHandle.getGameState() === EGameState.WAITING_START && RFGameHandle.isVipRoom()) {
                // 人数满了隐藏 邀请好友按钮
                let vCurrPlayerNum: number = 0;
                if (RFGameHandle.getGamePlayerInfo(PZOrientation.UP)) vCurrPlayerNum++;
                if (RFGameHandle.getGamePlayerInfo(PZOrientation.DOWN)) vCurrPlayerNum++;
                if (RFGameHandle.getGamePlayerInfo(PZOrientation.LEFT)) vCurrPlayerNum++;
                if (RFGameHandle.getGamePlayerInfo(PZOrientation.RIGHT)) vCurrPlayerNum++;
                if (vCurrPlayerNum === RFGameHandle.getRoomPlayerMaxNum()) {
                    ViewUtil.removeChild(self.middleGroup, self.inviteFriend);
                    ViewUtil.removeChild(self.middleGroup, self.copyRoomId);
                } else {
                    ViewUtil.addChild(self.middleGroup, self.inviteFriend);
                    if (Game.CommonUtil.isNative) {
                        ViewUtil.addChild(self.middleGroup, self.copyRoomId);
                    }
                    else {
                        ViewUtil.removeChild(self.middleGroup, self.copyRoomId);
                    }
                }
            }

            if (MahjongHandler.getGameState() == EGameState.PLAYING || MahjongHandler.getGameState() == EGameState.PLAYER_READY_OVER) {
                ViewUtil.removeChild(self.middleGroup, self.inviteFriend);
                ViewUtil.removeChild(self.middleGroup, self.copyRoomId);
            }
        }

        /**
         * 距离过近计算
         */
        private checkInsecureDistance(): void {
            let self = this;
            let vGpsInfoUp: NewUpdateGPSPositionMsgAck = RFGameHandle.getPlayerGPS(PZOrientation.UP);
            let vGpsInfoLeft: NewUpdateGPSPositionMsgAck = RFGameHandle.getPlayerGPS(PZOrientation.LEFT);
            let vGpsInfoRight: NewUpdateGPSPositionMsgAck = RFGameHandle.getPlayerGPS(PZOrientation.RIGHT);
            let vGpsInfoDown: NewUpdateGPSPositionMsgAck = RFGameHandle.getPlayerGPS(PZOrientation.DOWN);

            self.headViewUp.isGpsOn = vGpsInfoUp ? true : false;
            self.headViewDown.isGpsOn = vGpsInfoDown ? true : false;
            self.headViewLeft.isGpsOn = vGpsInfoLeft ? true : false;
            self.headViewRight.isGpsOn = vGpsInfoRight ? true : false;

            if (self.headViewUp.isGpsOn && self.headViewDown.isGpsOn) {
                if (GPSsafeView.getGPSDistance(vGpsInfoUp, vGpsInfoDown) <= GPSsafeView.INSECURE_DISTANCE) {
                    self.headViewDown.setCloseDistanceFlag(true);
                    self.headViewUp.setCloseDistanceFlag(true);
                }
            }
            if (self.headViewLeft.isGpsOn && self.headViewRight.isGpsOn) {
                if (GPSsafeView.getGPSDistance(vGpsInfoLeft, vGpsInfoRight) <= GPSsafeView.INSECURE_DISTANCE) {
                    self.headViewLeft.setCloseDistanceFlag(true);
                    self.headViewRight.setCloseDistanceFlag(true);
                }
            }
            if (self.headViewLeft.isGpsOn && self.headViewDown.isGpsOn) {
                if (GPSsafeView.getGPSDistance(vGpsInfoLeft, vGpsInfoDown) <= GPSsafeView.INSECURE_DISTANCE) {
                    self.headViewLeft.setCloseDistanceFlag(true);
                    self.headViewDown.setCloseDistanceFlag(true);
                }
            }
            if (self.headViewRight.isGpsOn && self.headViewDown.isGpsOn) {
                if (GPSsafeView.getGPSDistance(vGpsInfoRight, vGpsInfoDown) <= GPSsafeView.INSECURE_DISTANCE) {
                    self.headViewRight.setCloseDistanceFlag(true);
                    self.headViewDown.setCloseDistanceFlag(true);
                }
            }

        }


        /**
       * 通过方向获得头像区域 
       * @param {FL.PZOrientation} pPZOrientation
       * @returns {FL.PZHeadAreaView}
       */
        public getHeadAreaView(pPZOrientation: PZOrientation): PZHeadAreaView {
            if (pPZOrientation === PZOrientation.UP) {
                return this.headViewUp;
            } else if (pPZOrientation === PZOrientation.DOWN) {
                return this.headViewDown;
            } else if (pPZOrientation === PZOrientation.LEFT) {
                return this.headViewLeft;
            } else if (pPZOrientation === PZOrientation.RIGHT) {
                return this.headViewRight;
            }
        }

        /**
         * 更新头像区域
         * @param {FL.PZOrientation} pPZOrientation
         */
        public updateHeadArea(pPZOrientation: PZOrientation): void {
            let vPZHeadAreaView: PZHeadAreaView = this.getHeadAreaView(pPZOrientation);
            let vSimplePlayer: GamePlayer = RFGameHandle.getGamePlayerInfo(pPZOrientation);
            this.updateHeadAreaDate(pPZOrientation, vPZHeadAreaView, vSimplePlayer);
            this.checkInsecureDistance();
        }

        /**
         * 更新等待Label
         */
        private tickerUpdateWaitingLabel(): void {
            let vPointNum: number = this._tickerUpdateWaitingLabelTimer.currentCount % 4;
            let vPointStr: string = "";
            if (vPointNum === 1) {
                vPointStr = ".";
            } else if (vPointNum === 2) {
                vPointStr = "..";
            } else if (vPointNum === 3) {
                vPointStr = "...";
            }
            this.waitingLabel.text = "请稍等，牌局马上开始" + vPointStr;
        }

        /**
      * 启动定时任务
      */
        private startTickerTimer(): void {
            let self = this;
            //添加定时任务,半秒钟任务一次
            if (!self._tickerUpdateWaitingLabelTimer) {
                let timer: Game.Timer = new Game.Timer(500);
                timer.addEventListener(egret.TimerEvent.TIMER, self.tickerUpdateWaitingLabel, self);
                self._tickerUpdateWaitingLabelTimer = timer;
            }
            if (!self._tickerUpdateWaitingLabelTimer.running) {
                self._tickerUpdateWaitingLabelTimer.start();
            }
        }

        /**
        * 停止定时任务
        */
        private stopTickerTimer(): void {
            let self = this;
            //添加定时任务,1秒钟任务一次
            if (self._tickerUpdateWaitingLabelTimer) {
                if (self._tickerUpdateWaitingLabelTimer.running) {
                    self._tickerUpdateWaitingLabelTimer.stop();
                }
            }
        }

        /**
        * 显示语音动画
        */
        public showTalkAni(msg: any) {
            let orientation: PZOrientation = RFGameHandle.getPZOrientation(msg.playerPos);
            let headView: PZHeadAreaView = this.getHeadAreaView(orientation);
            headView.showTalkAni();
        }

        /**
         * 隐藏语音动画
         */
        public hideTalkAni(msg: any) {
            let orientation: PZOrientation = RFGameHandle.getPZOrientation(msg.playerPos);
            let headView: PZHeadAreaView = this.getHeadAreaView(orientation);
            headView.hideTalkAni();
        }

        /**
         * 是否显示准备按钮
         */
        public isShowReadyBtn(flag: boolean) {
            this.readyBtn.visible = flag;
        }

        /**
         * 改变准备按钮显示状态
         */
        public changeReadyState(flag: boolean) {
            this.readyBtn.source = (flag) ? 'ready_png' : 'noready_png';
            this.flag_ready = flag;
        }

        /** 获取当前准备状态 */
        public getCurReadyState() {
            return this.flag_ready;
        }

        private _timeTickerTimer: Game.Timer;
        private curPzHead: PZHeadAreaView;
        private curLeng: number = 0;
        /** 开始出牌倒计时 */
        public showOutTime(pos: PZOrientation) {
            this.curPzHead = this.getHeadAreaView(pos);
            let time: number = RFGameHandle.getPlayerOperationTime();
            if (time < 0) time = 0;
            this.curPzHead.showTimeOut(this.curLeng, time*10);
            this.startTickerTimerCircle();
        }
        
        /** 隐藏出牌倒计时 */
        public hideOutTime() {
            this.curLeng += 1;
            this.curPzHead.hideTimeOut();
        }

        /**
         * 启动定时任务
         */
        private startTickerTimerCircle(): void {
            let self = this;
            if (!self._timeTickerTimer) {
                let timer: Game.Timer = new Game.Timer(100);
                timer.addEventListener(egret.TimerEvent.TIMER, self.updateTimer, self);
                self._timeTickerTimer = timer;
            }
            if (!self._timeTickerTimer.running) {
                this.curLeng = 0;
                self._timeTickerTimer.start();
            }
        }

        private updateTimer() {
            if (this.curPzHead) {
                this.curPzHead.updateTimer();
            }
        }

        /**
         * 停止定时任务
         */
        public stopTickerTimerCircle(): void {
            let self = this;
            if (self._timeTickerTimer) {
                if (self._timeTickerTimer.running) {
                    self._timeTickerTimer.stop();
                }
            }
        }
    }
}