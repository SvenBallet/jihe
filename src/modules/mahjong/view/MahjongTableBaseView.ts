module FL {

    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase - MahjongTableBaseView
     * @Description:  //牌桌基础界面
     * @Create: DerekWu on 2017/11/21 15:45
     * @Version: V1.0
     */
    export class MahjongTableBaseView extends BaseView {

        /** 单例 */
        private static _onlyOne: MahjongTableBaseView;

        //调停者名字，删除界面的时候会自动移除
        public readonly mediatorName: string = MahjongTableBaseViewMediator.NAME;
        //界面层级，UI框架自动管理
        public readonly viewLayer: ViewLayerEnum = ViewLayerEnum.BOTTOM_ONLY;

        /** 牌桌背景，用来界面编辑的时候用，初始化完毕后即会移除 */
        public pzBg: eui.Image;

        /** 玩家头像等显示信息  上下左右 */
        public headViewUp: PZHeadAreaView;
        public headViewDown: PZHeadAreaView;
        public headViewLeft: PZHeadAreaView;
        public headViewRight: PZHeadAreaView;

        /** 中间区域 复制房间Id按钮  分享按钮  等待中文字 */
        public middleGroup: eui.Group;
        // public copyRoomId:eui.Image;
        // public inviteFriend:eui.Image;
        public inviteFriend: eui.Image;
        public waitingLabel: eui.Label;
        public copyRoomId: FL.GameButton;

        /** 调停者 */
        private _mediator: MahjongTableBaseViewMediator;

        /** 定时更新耐心等待...文字定时任务 */
        private _tickerUpdateWaitingLabelTimer: Game.Timer;

        /** 准备按钮 */
        public readyBtn: eui.Image;
        private flag_ready: boolean;

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

        public static getInstance(): MahjongTableBaseView {
            if (!this._onlyOne) {
                this._onlyOne = new MahjongTableBaseView();
                // this._onlyOne.in
            }
            return this._onlyOne;
        }

        protected childrenCreated(): void {
            super.childrenCreated();
            let self = this;
            //删除牌桌背景
            self.removeChild(self.pzBg);
            //注册按钮点击缓动
            TouchTweenUtil.regTween(self.copyRoomId, self.copyRoomId);
            TouchTweenUtil.regTween(self.inviteFriend, self.inviteFriend);
            TouchTweenUtil.regTween(self.readyBtn, self.readyBtn);

            //调停者
            self._mediator = new MahjongTableBaseViewMediator(self);
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
        }

        /**
         * 进入牌桌
         */
        public intoTableBoard(): void {
            let self = this;

            //显示中间区域
            ViewUtil.addChild(self, self.middleGroup);

            //是否金币场
            let vIsVipRoom: boolean = MahjongHandler.isVipRoom(); //判断是否金币场
            if (!vIsVipRoom) {
                //金币场删除两个按钮
                ViewUtil.removeChild(self.middleGroup, self.copyRoomId);
                ViewUtil.removeChild(self.middleGroup, self.inviteFriend);
                //文字摆中间
                // self.waitingLabel.y = 88;
            } else {
                //非金币场增加两个按钮
                if (Game.CommonUtil.isNative) {
                    ViewUtil.addChild(self.middleGroup, self.copyRoomId);
                }
                else {
                    ViewUtil.removeChild(self.middleGroup, self.copyRoomId);
                }
                // APPSTORE屏蔽
                if (!NativeBridge.IOSMask) {
                    ViewUtil.addChild(self.middleGroup, self.inviteFriend);
                }
                //文字摆下面
                // self.waitingLabel.y = 196;
            }

            //初始化各个头像区域的数据
            self.initHeadArea(PZOrientation.UP);
            self.initHeadArea(PZOrientation.DOWN);
            self.initHeadArea(PZOrientation.LEFT);
            self.initHeadArea(PZOrientation.RIGHT);

            //是否显示准备按钮
            self.isShowReadyBtn(MahjongData.isNeedReady);
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
         * 初始化头像区域
         * @param {FL.PZOrientation} pPZOrientation
         */
        private initHeadArea(pPZOrientation: PZOrientation): void {
            let self = this;
            let vPZHeadAreaView: PZHeadAreaView = self.getHeadAreaView(pPZOrientation);
            let vGamePlayer: GamePlayer = MahjongHandler.getGamePlayerInfo(pPZOrientation);
            if (vGamePlayer === null) {
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

                if (vGamePlayer) {
                    self.updateHeadAreaDate(pPZOrientation, vPZHeadAreaView, vGamePlayer);
                }
            }
        }

        /**
         * 更新头像区域界面数据
         * @param {FL.PZOrientation} pPZOrientation
         * @param {FL.PZHeadAreaView} pPZHeadAreaView
         * @param {FL.GamePlayer} pGamePlayer
         */
        private updateHeadAreaDate(pPZOrientation: PZOrientation, pPZHeadAreaView: PZHeadAreaView, pGamePlayer: GamePlayer): void {
            let self = this;
            this.isHideMidGroup();
            //没有数据则重新初始化
            if (!pGamePlayer) {
                //初始化
                pPZHeadAreaView.init(pPZOrientation);
                return;
            }

            // 设置离线标记和名字
            pPZHeadAreaView.setOfflineAndLeaveFlagAndNameByGamePlayer(pGamePlayer);

            // // 名字颜色  (废弃)
            // let vNameColor: number = 0xFFFFFF;
            // let vOfflineFlag: number = 0;
            // if (pGamePlayer.isLinkBreken) {
            //     vNameColor = 0xAFAEAE;
            //     vOfflineFlag = 2;
            // } else if (pGamePlayer.tableState === 0 || pGamePlayer.tableState === 4) {
            //     vOfflineFlag = 1;
            //     vNameColor = 0xAFAEAE;
            // }
            // // 设置是否离线等标记
            // pPZHeadAreaView.setOfflineAndLeaveFlag(vOfflineFlag);
            // //设置名字
            // pPZHeadAreaView.setPlayerName(pGamePlayer.playerName, vNameColor);

            if (GConf.Conf.useWXAuth) {
                pPZHeadAreaView.setPlayerHeadImg(pGamePlayer.headImageUrl, pGamePlayer.headImg);
            } else {
                // pPZHeadAreaView.setPlayerHeadImg("http://thirdwx.qlogo.cn/mmopen/vi_32/DYAIOgq83eqib9XObtKBOgduTeXfPLHByicoJZF53jicQqyEJ1DKA58ISQpdclEaxc6zPian1nPL4f80tHLicsxFh9A/0");
                pPZHeadAreaView.setPlayerHeadImg(null, pGamePlayer.headImg);
            }

            //判断是否金币场，显示金币还是分数
            let vIsGold: boolean = !MahjongHandler.isVipRoom();
            pPZHeadAreaView.setPlayerScoreOrGold(pGamePlayer.chip, pGamePlayer.zhongTuScore, pGamePlayer.scoreChipRate);

            if (MahjongHandler.getGameState() === EGameState.WAITING_START) {
                //等待开始状态
                //是否Ok
                // let vIsOk: boolean = pGamePlayer.tableState === 1 ? true : false;
                let vIsOk = pGamePlayer.isReady;
                if (pGamePlayer.tableState === GameConstant.PALYER_GAME_STATE_IN_TABLE_GAME_OVER_WAITING_TO_CONTINUE) {
                    vIsOk = false;
                }
                pPZHeadAreaView.setOkIcon(vIsOk);
                //是都显示gps
                // let vGpsInfo:UpdatePlayerGPSMsg = MJGameData.playerGps[pGamePlayer.tablePos];
                let vGpsInfo: NewUpdateGPSPositionMsgAck = MahjongHandler.getPlayerGPS(pPZOrientation);
                pPZHeadAreaView.isGpsOn = vIsOk && vGpsInfo ? true : false;
                pPZHeadAreaView.setGpsIcon(pPZHeadAreaView.isGpsOn);
                //是否是房主
                let vIsRoomOwner: boolean = MahjongHandler.isRoomOwner2(pGamePlayer);
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
            if (MahjongHandler.getGameState() === EGameState.WAITING_START && MahjongHandler.isVipRoom()) {
                // 人数满了隐藏 邀请好友按钮
                let vCurrPlayerNum: number = 0;
                if (MahjongHandler.getGamePlayerInfo(PZOrientation.UP)) vCurrPlayerNum++;
                if (MahjongHandler.getGamePlayerInfo(PZOrientation.DOWN)) vCurrPlayerNum++;
                if (MahjongHandler.getGamePlayerInfo(PZOrientation.LEFT)) vCurrPlayerNum++;
                if (MahjongHandler.getGamePlayerInfo(PZOrientation.RIGHT)) vCurrPlayerNum++;
                if (vCurrPlayerNum === MahjongHandler.getRoomPlayerMaxNum()) {
                    ViewUtil.removeChild(self.middleGroup, self.inviteFriend);
                    ViewUtil.removeChild(self.middleGroup, self.copyRoomId);
                } else {
                    // APPSTORE屏蔽
                    if (!NativeBridge.IOSMask) {
                        ViewUtil.addChild(self.middleGroup, self.inviteFriend);
                    }
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
            let vGpsInfoUp: NewUpdateGPSPositionMsgAck = MahjongHandler.getPlayerGPS(PZOrientation.UP);
            let vGpsInfoLeft: NewUpdateGPSPositionMsgAck = MahjongHandler.getPlayerGPS(PZOrientation.LEFT);
            let vGpsInfoRight: NewUpdateGPSPositionMsgAck = MahjongHandler.getPlayerGPS(PZOrientation.RIGHT);
            let vGpsInfoDown: NewUpdateGPSPositionMsgAck = MahjongHandler.getPlayerGPS(PZOrientation.DOWN);

            self.headViewUp.isGpsOn = vGpsInfoUp ? true : false;
            self.headViewDown.isGpsOn = vGpsInfoDown ? true : false;
            self.headViewLeft.isGpsOn = vGpsInfoLeft ? true : false;
            self.headViewRight.isGpsOn = vGpsInfoRight ? true : false;

            if (self.headViewUp.isGpsOn && self.headViewRight.isGpsOn) {
                if (GPSsafeView.getGPSDistance(vGpsInfoUp, vGpsInfoRight) <= GPSsafeView.INSECURE_DISTANCE) {
                    self.headViewUp.setCloseDistanceFlag(true);
                    self.headViewRight.setCloseDistanceFlag(true);
                }
            }
            if (self.headViewLeft.isGpsOn && self.headViewUp.isGpsOn) {
                if (GPSsafeView.getGPSDistance(vGpsInfoUp, vGpsInfoLeft) <= GPSsafeView.INSECURE_DISTANCE) {
                    self.headViewLeft.setCloseDistanceFlag(true);
                    self.headViewUp.setCloseDistanceFlag(true);
                }
            }
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
         * 更新头像区域
         * @param {FL.PZOrientation} pPZOrientation
         */
        public updateHeadArea(pPZOrientation: PZOrientation): void {
            let vPZHeadAreaView: PZHeadAreaView = this.getHeadAreaView(pPZOrientation);
            let vGamePlayer: GamePlayer = MahjongHandler.getGamePlayerInfo(pPZOrientation);
            this.updateHeadAreaDate(pPZOrientation, vPZHeadAreaView, vGamePlayer);
            this.checkInsecureDistance();
            MvcUtil.send(MahjongModule.MAHJONG_SHOW_PIAO,pPZOrientation);
        }

        /**
         * 开始游戏
         */
        public startGame(): void {
            //获得庄的方向
            let vZhuangPZOrientation: PZOrientation = MahjongHandler.getDealerOrientation();
            let self = this;
            //开始游戏处理各个头像区域的数据
            self.exeHeadAreaStartGame(PZOrientation.UP, vZhuangPZOrientation);
            self.exeHeadAreaStartGame(PZOrientation.DOWN, vZhuangPZOrientation);
            self.exeHeadAreaStartGame(PZOrientation.LEFT, vZhuangPZOrientation);
            self.exeHeadAreaStartGame(PZOrientation.RIGHT, vZhuangPZOrientation);
            self.checkInsecureDistance();

            //停止定时器
            self.stopTickerTimer();

            //隐藏中间界面
            // self.removeChild(self.middleGroup);
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
            let vGamePlayer: GamePlayer = MahjongHandler.getGamePlayerInfo(pPZOrientation);
            if (vGamePlayer !== null) {
                this.updateHeadArea(pPZOrientation);
                vPZHeadAreaView.startGame(pPZOrientation);
                //看看是否是庄
                if (pPZOrientation === pZhuangPZOrientation) {
                    vPZHeadAreaView.setZhuangIcon(true);
                }
                //是否是房主
                let vIsRoomOwner: boolean = MahjongHandler.isRoomOwner2(vGamePlayer);
                vPZHeadAreaView.setRoomOwnerIcon(vIsRoomOwner);
            }

        }

        /**
         * 添加听牌
         * @param {FL.PZOrientation} pzOrientation
         */
        public addPlayerTingIcon(pzOrientation: PZOrientation): void {
            if (pzOrientation !== PZOrientation.DOWN) {
                let vPZHeadAreaView: PZHeadAreaView = this.getHeadAreaView(pzOrientation);
                vPZHeadAreaView.setTingIcon(true);
            }
        }

        /**
         * 显示语音动画
         */
        public showTalkAni(msg: any) {
            let orientation: PZOrientation = MahjongHandler.getPZOrientation(msg.playerPos);
            let headView: PZHeadAreaView = this.getHeadAreaView(orientation);
            headView.showTalkAni();
        }

        /**
         * 隐藏语音动画
         */
        public hideTalkAni(msg: any) {
            let orientation: PZOrientation = MahjongHandler.getPZOrientation(msg.playerPos);
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
    }
}