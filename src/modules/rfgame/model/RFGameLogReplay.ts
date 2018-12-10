module FL {
    //跑得快游戏日志回放
    export class RFGameLogReplay {
        /** 定时器跳动时间间隔(单位：毫秒) */
        private static readonly _tickerTimes: number = 500;

        /** 重播定时器 */
        private static _replayTicker: Game.Timer;
        /** 当前播放速度 */
        private static _currSpeed: ReplaySpeedEnum;
        /** 麻将模块代理 */
        private static _proxy: RFGameProxy;
        /** 游戏日志信息 */
        private static _gameLog: GameLogInfo;

        /** 开始游戏返回结果【进入牌桌之后就返回，并不是开始游戏】 */
        private static _requestStartGameMsgAck: NewIntoGameTableMsgAck;

        /** 真正开始游戏 */
        private static _gameStartMsg: PokerStartCircleGameMsgAck;

        /** 记录当前的播放操作记录的索引位置 */
        private static _currPlayIndex: number;

        // /** 剩余总牌数 */
        // private static _leftCardsNum: number;
        // /** 剩余总牌数据 */
        // private static _leftCardsData: number[] = [];
        /** 剩余牌操作位置记录 */
        private static _leftPlayOps: PlayerOperationDesc;
        /** 开始时间*/
        public static beginTimes: string = "";
        /** 结束时间*/
        public static endTimes: string = "";
        /** 房间长ID */
        public static gameTableID: string = "";
        /** 传参需要的时间*/
        public static dateStr: string = "";

        /**
       * 开始回放
       * @param {FL.GetPlayerGameLogMsg} msg
       */
        public static startReplay(msg: GetPlayerGameLogMsg): void {
            let self = this;
            //设置当前游戏操作类型
            GameConstant.setCurrentGame(EGameType.RF);
            self.beginTimes = msg.beginDate;
            self.endTimes = msg.date;
            self.gameTableID = msg.gameTableID;
            self.dateStr = msg.dateStr;
            // 解压游戏日志
            let vInflate: Zlib.Inflate = new Zlib.Inflate(msg.data.bytes);
            let vOutBuffer = vInflate.decompress();
            let vByteArray: egret.ByteArray = new egret.ByteArray(vOutBuffer.buffer);
            vByteArray.position = 0;
            let vGameLogInfo: GameLogInfo = new GameLogInfo();
            vGameLogInfo.serialize(new ObjectSerializer(true, vByteArray));
            self._gameLog = vGameLogInfo;

            // 设置代理
            if (!self._proxy) {
                self._proxy = RFGameProxy.getInstance();
            }

            // 设置定时器
            if (!self._replayTicker) {
                self._replayTicker = new Game.Timer(self._tickerTimes);
                self._replayTicker.addEventListener(egret.TimerEvent.TIMER, self.tickerUpdate, self);
            }

            // 设置速度为1
            self._currSpeed = ReplaySpeedEnum.ONE;
            // 初始化当前索引
            self._currPlayIndex = 0;

            // 初始化开始游戏指令
            self.initNewIntoGameTableMsgAck();
            self.initPokerStartCircleGameMsgAck();

            self._proxy.exeNewIntoGameTableMsgAck(self._requestStartGameMsgAck, true);
            self._proxy.exePokerStartCircleGameMsgAck(self._gameStartMsg);

            // 启动定时器
            self._replayTicker.start();
        }

        /**
      * 停止播放
      */
        public static stopPlay(): void {
            if (this._replayTicker) {
                this._replayTicker.stop();
            }
        }

        /**
         * 停止后的继续播放
         */
        public static goOnPlay(): void {
            if (this._replayTicker) {
                this._replayTicker.reset();
                // 重置计数器
                if (this._gameLog) {
                    this._replayTicker.start();
                }
            }
        }

        /**
         * 改变当前速度
         * @param {FL.ReplaySpeedEnum} pReplaySpeedEnum
         */
        public static changeSpeed(pReplaySpeedEnum: ReplaySpeedEnum): void {
            this._currSpeed = pReplaySpeedEnum;
        }

        /**
         * 获得当前速度
         * @returns {FL.ReplaySpeedEnum}
         */
        public static getCurrSpeed(): ReplaySpeedEnum {
            return this._currSpeed;
        }

        /**
         * 结束播放
         */
        public static endPlay(): void {
            if (this._replayTicker)
                this._replayTicker.reset();
            this._gameLog = null;
            this._requestStartGameMsgAck = null;
            this._gameStartMsg = null;
        }

        /** SimplePlayer 转成GamePlayer */
        private static spToGplayer(player: SimplePlayer[]) {
            let gPlayers = [];
            for (let i = 0; i < player.length; ++i) {
                let gPlayer = new GamePlayer();
                // gPlayer.address = player.;
                gPlayer.chip = player[i].gold;
                gPlayer.headImageUrl = player[i].headImgUrl;
                gPlayer.headImg = player[i].headImg;
                gPlayer.ip = player[i].ip;
                gPlayer.playerID = player[i].playerID;
                gPlayer.playerIndex = player[i].palyerIndex;
                gPlayer.playerName = player[i].playerName;
                gPlayer.sex = player[i].sex;
                gPlayer.tablePos = player[i].tablePos;
                gPlayers.push(gPlayer);
            }
            return gPlayers;
        }

        /** 初始化 */
        private static initNewIntoGameTableMsgAck(): void {
            let vGameLog: GameLogInfo = this._gameLog;
            let vMsg: NewIntoGameTableMsgAck = new NewIntoGameTableMsgAck();
            // vMsg.result = ErrorCodeConstant.CMD_EXE_OK;
            // 当前玩家座位
            let vTablePos: number = 0;
            let vPlayers: Array<SimplePlayer> = vGameLog.players, vIndex: number = 0, vLength: number = vPlayers.length;
            let vGPlayers: Array<GamePlayer> = this.spToGplayer(vPlayers);
            for (; vIndex < vLength; ++vIndex) {
                if (vGPlayers[vIndex].playerID === LobbyData.playerVO.playerID) {
                    vTablePos = vGPlayers[vIndex].tablePos;
                }
                // 重设一定在桌子上
                vGPlayers[vIndex].tableState = 1;
            }
            // 设置玩家座位
            vMsg.playerPos = vTablePos;
            // 设置vipTableID
            vMsg.vipRoomID = vGameLog.vipRoomIndex;
            // 设置玩家
            vMsg.gamePlayers = vGPlayers;
            // 设置玩法
            // vMsg.newPlayWay = vGameLog.playWay;
            vMsg.mainGamePlayRule = vGameLog.mainGamePlayRule;
            vMsg.subGamePlayRuleList = vGameLog.minorGamePlayRuleList;
            // 设置总局数
            vMsg.totalPlayCount = vGameLog.handsTotal;
            // 设置当前局数
            vMsg.currPlayCount = vGameLog.handIndex;
            // 设置人数
            vMsg.playersNumber = vLength;

            // 茶楼相关
            vMsg.teaHouseId = vGameLog.teaHouseId;
            vMsg.teaHouseLayer = vGameLog.teaHouseLayer;
            vMsg.teaHouseDesk = vGameLog.teaHouseDesk;
            vMsg.beginTimes = this.beginTimes;
            vMsg.endTimes = this.endTimes;

            // 房主位置
            vMsg.createPlayerID = vGameLog.createPlayerID;

            this._requestStartGameMsgAck = vMsg;
            this._proxy.exeNewIntoGameTableMsgAck(vMsg, true);
        }

        private static initPokerStartCircleGameMsgAck(): void {
            let self = this;
            let vGameLog: GameLogInfo = self._gameLog;
            let vMsg: PokerStartCircleGameMsgAck = new PokerStartCircleGameMsgAck();
            // 我的座位
            vMsg.myTablePos = self._requestStartGameMsgAck.playerPos;
            vMsg.playerInfos = new Array<PokerGameStartPlayerInfo>();
            // // 设置圈数
            // vMsg.quanNum = vGameLog.handIndex;

            // 设置玩家手牌
            let vPlayerOps: Array<PlayerOperationDesc> = vGameLog.playerOps;
            //是否显示剩余牌
            for (let i = 0; i < vPlayerOps.length; ++i) {
                if (vPlayerOps[i].opCode === GameConstant.MSG_POKER_LEFT_PAI) {
                    self._leftPlayOps = vPlayerOps[i];
                    break;
                }
            }
            vMsg.leftTotalCardNum = (self._leftPlayOps.opValue1) ? self._leftPlayOps.opValue1 : -1;
            do {
                let vCurrOp: PlayerOperationDesc = vPlayerOps[self._currPlayIndex];
                // if (self._currPlayIndex === 0) {
                //     // 设置癞子标识
                //     vMsg.unused_0 = vCurrOp.opValue1;
                //     // 设置庄家位置 和 房主位置
                //     let vDealerPos: number = vCurrOp.opValue2 & 0xFF;
                //     let vCreatorPos: number = (vCurrOp.opValue2 >> 8) & 0xFF;
                //     vMsg.dealerPos = vDealerPos;
                //     self._requestStartGameMsgAck.createPlayerID = vGameLog.players[vCreatorPos].playerID;
                // }
                let info: PokerGameStartPlayerInfo = new PokerGameStartPlayerInfo();
                info.handCards = vCurrOp.vlist;
                info.handCardNum = vCurrOp.vlist.length;
                info.isChuOnce = false;
                info.lastChuCards = new Array();
                info.tablePos = vCurrOp.tablePos;
                // 设置玩家手牌
                // if (vCurrOp.tablePos === 0) vMsg.playerInfos.push(info);
                // if (vCurrOp.tablePos === 1) vMsg.playerInfos.push(info);
                // if (vCurrOp.tablePos === 2) vMsg.playerInfos.push(info);
                // if (vCurrOp.tablePos === 3) vMsg.playerInfos.push(info);
                vMsg.playerInfos.push(info);
                ++self._currPlayIndex;
            } while (vPlayerOps[self._currPlayIndex].opCode === GameConstant.MSG_POKER_SEND_PAI);
            this._gameStartMsg = vMsg;
            this._proxy.exePokerStartCircleGameMsgAck(vMsg);
        }

        /**
         * 出牌
         */
        private static chuCard(vCurrOp: PlayerOperationDesc) {
            let self = this;
            let msg = new PokerPlayCardNotifyMsgAck();
            msg.chuPlayerCardLeftNum = vCurrOp.cardLeftNum;
            msg.playerPos = vCurrOp.tablePos;
            msg.playCards = vCurrOp.vlist;
            msg.handPatterns = vCurrOp.opValue1;
            msg.totalCardLeftNum = this._leftPlayOps.opValue1;
            msg.isMgrCard = (vCurrOp.opValue2) ? true : false;
            let preCards = RFGameData.playerCardsData[vCurrOp.tablePos];
            let rest = preCards.filter(x => vCurrOp.vlist.indexOf(x.id) == -1);
            let restCards = new Array();
            rest.forEach(x => restCards.unshift(x.id));
            msg.handCards = restCards;
            this._proxy.exePokerPlayCardNotifyMsgAck(msg);
        }

        /**
         * 不出牌
         */
        private static noChuCard(vCurrOp: PlayerOperationDesc) {
            let self = this;
            let msg = new PokerNotPlayCardNotifyMsgAck();
            msg.playerPos = vCurrOp.tablePos;
            msg.notPlayType = 0;
            this._proxy.exePokerNotPlayCardNotifyMsgAck(msg);
        }

        /** 显示剩余牌 */
        private static showRest() {
            let leftOps = this._leftPlayOps;
            if (leftOps.opValue1 == -1) return;//不显示
            let msg = new PokerGameOverViewHandCardsMsgAck();
            msg.leftCards = leftOps.vlist;
            this._proxy.exePokerGameOverViewHandCardsMsgAck(msg);
        }

        /**
        * 定时器更新
        * @param {egret.TimerEvent} e
        */
        private static tickerUpdate(e: egret.TimerEvent): void {
            let self = this;
            if (self._replayTicker.currentCount % self._currSpeed !== 0) {
                // 跳出条件
                return;
            }
            while (true) {
                // 当前操作
                let vCurrOp: PlayerOperationDesc = self._gameLog.playerOps[self._currPlayIndex];
                if (!vCurrOp) {
                    // 没有则表示结束回放
                    self.endPlay();
                    self.showRest();
                    return;
                }
                // 发送提醒玩家出牌指令，变化中间指示方向
                // let vPlayerOperationNotifyMsg: PlayerOperationNotifyMsg = new PlayerOperationNotifyMsg();
                // vPlayerOperationNotifyMsg.operation = GameConstant.MAHJONG_OPERTAION_TIP;
                // vPlayerOperationNotifyMsg.player_table_pos = vCurrOp.tablePos;
                // vPlayerOperationNotifyMsg.cardLeftNum = vCurrOp.cardLeftNum;
                // this._proxy.exePlayerOperationNotifyMsg(vPlayerOperationNotifyMsg);
                // 分别处理各种操作
                if (vCurrOp.opCode === GameConstant.MSG_POKER_CHU_PAI) {
                    //出牌
                    self.chuCard(vCurrOp);
                } else if (vCurrOp.opCode === GameConstant.MSG_POKER_BU_CHU_PAI) {
                    //不出牌
                    self.noChuCard(vCurrOp);
                }

                // 当前播放索引位置自增
                ++self._currPlayIndex;
                return;
            }
        }
    }
}