module FL {

    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase - TableBoardBaseView
     * @Description:  //牌桌基础界面
     * @Create: DerekWu on 2017/11/21 15:45
     * @Version: V1.0
     */
    export class TableBoardBaseView extends BaseView {

        /** 单例 */
        private static _onlyOne: TableBoardBaseView;

        //调停者名字，删除界面的时候会自动移除
        public readonly mediatorName: string = TableBoardBaseViewMediator.NAME;
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
        public inviteFriend: FL.GameButton;
        public waitingLabel: eui.Label;
        public copyRoomId: FL.GameButton;

        /** 调停者 */
        private _mediator: TableBoardBaseViewMediator;

        /** 定时更新耐心等待...文字定时任务 */
        private _tickerUpdateWaitingLabelTimer: Game.Timer;

        private constructor() {
            super();
            this.top = this.bottom = this.left = this.right = 0;
            this.skinName = "skins.TableBoardBaseViewSkin";
            //不可触摸
            this.touchEnabled = false;
        }

        public static getInstance(): TableBoardBaseView {
            if (!this._onlyOne) {
                this._onlyOne = new TableBoardBaseView();
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

            //调停者
            self._mediator = new TableBoardBaseViewMediator(self);
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
            //初始化各个头像区域的数据
            self.initHeadArea(PZOrientation.UP);
            self.initHeadArea(PZOrientation.DOWN);
            self.initHeadArea(PZOrientation.LEFT);
            self.initHeadArea(PZOrientation.RIGHT);

            //显示中间区域
            ViewUtil.addChild(self, self.middleGroup);

            //是否金币场
            let vIsVipRoom: boolean = MJGameHandler.isVipRoom(); //判断是否金币场
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
            let vSimplePlayer: SimplePlayer = MJGameHandler.getGamePlayerInfo(pPZOrientation);
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
         * @param {FL.SimplePlayer} pSimplePlayer
         */
        private updateHeadAreaDate(pPZOrientation: PZOrientation, pPZHeadAreaView: PZHeadAreaView, pSimplePlayer: SimplePlayer): void {
            let self = this;
            //没有数据则重新初始化
            if (!pSimplePlayer) {
                //初始化
                pPZHeadAreaView.init(pPZOrientation);
                return;
            }
            //名字颜色
            let vNameColor: number = 0xFFFFFF;
            // if (pSimplePlayer.inTable === 2) {
            //     vNameColor = 0xAFAEAE;
            //     pPZHeadAreaView.setOfflineFlag(true);
            // } else {
            //     if (pSimplePlayer.inTable !== 1) {
            //         vNameColor = 0xAFAEAE;
            //         pPZHeadAreaView.setOfflineFlag(true);
            //     } else if (pSimplePlayer.gameState === GameConstant.PALYER_GAME_STATE_IN_TABLE_GAME_OVER_WAITING_TO_CONTINUE) {
            //         vNameColor = 0xAFAEAE;
            //         pPZHeadAreaView.setOfflineFlag(true);
            //     } else {
            //         pPZHeadAreaView.setOfflineFlag(false);
            //     }
            // }
            if (GConf.Conf.useWXAuth) {
                pPZHeadAreaView.setPlayerHeadImg(pSimplePlayer.headImgUrl, pSimplePlayer.headImg);
            } else {
                // pPZHeadAreaView.setPlayerHeadImg("http://wx.qlogo.cn/mmopen/vi_32/UmK17f9nicVrMhSQAbft5KOfKdIiaSFUHiaOTpxVum5JZ8G5zibHzzLkTJBicEuibL44kmuc8X0NpUrfgqrFKBh5jM9Q/0");
                pPZHeadAreaView.setPlayerHeadImg(null, pSimplePlayer.headImg);
            }

            //设置名字
            pPZHeadAreaView.setPlayerName(pSimplePlayer.playerName, vNameColor);

            //判断是否金币场，显示金币还是分数
            let vIsGold: boolean = !MJGameHandler.isVipRoom();
            pPZHeadAreaView.setPlayerScoreOrGold(pSimplePlayer.gold, 0, 0);

            if (MJGameHandler.getGameState() === EGameState.WAITING_START) {
                //等待开始状态
                //是否Ok
                let vIsOk: boolean = pSimplePlayer.inTable === 1 ? true : false;
                if (pSimplePlayer.gameState === GameConstant.PALYER_GAME_STATE_IN_TABLE_GAME_OVER_WAITING_TO_CONTINUE) {
                    vIsOk = false;
                }
                pPZHeadAreaView.setOkIcon(vIsOk);
                //是都显示gps
                // let vGpsInfo:UpdatePlayerGPSMsg = MJGameData.playerGps[pSimplePlayer.tablePos];
                let vGpsInfo: UpdatePlayerGPSMsg = MJGameHandler.getPlayerGPS(pPZOrientation);
                pPZHeadAreaView.isGpsOn = vIsOk && vGpsInfo ? true : false;
                pPZHeadAreaView.setGpsIcon(pPZHeadAreaView.isGpsOn);
                //是否是房主
                let vIsRoomOwner: boolean = MJGameHandler.isRoomOwner2(pSimplePlayer);
                pPZHeadAreaView.setRoomOwnerIcon(vIsRoomOwner);
                //庄家位置，进入游戏才有
                pPZHeadAreaView.setZhuangIcon(false);
            }

            if (MJGameHandler.getGameState() === EGameState.WAITING_START && MJGameHandler.isVipRoom()) {
                // 人数满了隐藏 邀请好友按钮
                let vCurrPlayerNum: number = 0;
                if (MJGameHandler.getGamePlayerInfo(PZOrientation.UP)) vCurrPlayerNum++;
                if (MJGameHandler.getGamePlayerInfo(PZOrientation.DOWN)) vCurrPlayerNum++;
                if (MJGameHandler.getGamePlayerInfo(PZOrientation.LEFT)) vCurrPlayerNum++;
                if (MJGameHandler.getGamePlayerInfo(PZOrientation.RIGHT)) vCurrPlayerNum++;
                if (vCurrPlayerNum === MJGameHandler.getRoomPlayerMaxNum()) {
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

        }

        /**
         * 距离过近计算
         */
        private checkInsecureDistance(): void {
            let self = this;
            let vGpsInfoUp: UpdatePlayerGPSMsg = MJGameHandler.getPlayerGPS(PZOrientation.UP);
            let vGpsInfoLeft: UpdatePlayerGPSMsg = MJGameHandler.getPlayerGPS(PZOrientation.LEFT);
            let vGpsInfoRight: UpdatePlayerGPSMsg = MJGameHandler.getPlayerGPS(PZOrientation.RIGHT);
            let vGpsInfoDown: UpdatePlayerGPSMsg = MJGameHandler.getPlayerGPS(PZOrientation.DOWN);

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
            let vSimplePlayer: SimplePlayer = MJGameHandler.getGamePlayerInfo(pPZOrientation);
            this.updateHeadAreaDate(pPZOrientation, vPZHeadAreaView, vSimplePlayer);
            this.checkInsecureDistance();
        }

        /**
         * 开始游戏
         */
        public startGame(): void {
            //获得庄的方向
            let vZhuangPZOrientation: PZOrientation = MJGameHandler.getDealerOrientation();
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
        }

        /**
         * 处理开始游戏
         * @param {FL.PZOrientation} pPZOrientation
         * @param pZhuangPZOrientation
         */
        private exeHeadAreaStartGame(pPZOrientation: PZOrientation, pZhuangPZOrientation): void {
            let self = this;
            let vPZHeadAreaView: PZHeadAreaView = self.getHeadAreaView(pPZOrientation);
            let vSimplePlayer: SimplePlayer = MJGameHandler.getGamePlayerInfo(pPZOrientation);
            if (vSimplePlayer !== null) {
                vPZHeadAreaView.startGame(pPZOrientation);
                //看看是否是庄
                if (pPZOrientation === pZhuangPZOrientation) {
                    vPZHeadAreaView.setZhuangIcon(true);
                }
                //是否是房主
                let vIsRoomOwner: boolean = MJGameHandler.isRoomOwner2(vSimplePlayer);
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
            let orientation: PZOrientation = MJGameHandler.getPZOrientation(msg.playerPos);
            let headView: PZHeadAreaView = this.getHeadAreaView(orientation);
            headView.showTalkAni();
        }

        /**
         * 隐藏语音动画
         */
        public hideTalkAni(msg: any) {
            let orientation: PZOrientation = MJGameHandler.getPZOrientation(msg.playerPos);
            let headView: PZHeadAreaView = this.getHeadAreaView(orientation);
            headView.hideTalkAni();
        }
    }
}