module FL {

    /**
     * 回放速度
     */
    // export enum ReplaySpeedEnum {
    //     /** ONE 速度最慢，定时器每n下处理一下逻辑 */
    //     ONE = 4, TWO = 2, FOUR = 1
    // }

    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase - MahjongLogReplay
     * @Description:  // 麻将游戏日志回放
     * @Create: DerekWu on 2018/1/17 18:48
     * @Version: V1.0
     */
    export class MahjongLogReplay {

        /** 定时器跳动时间间隔(单位：毫秒) */
        private static readonly _tickerTimes: number = 300;

        /** 重播定时器 */
        private static _replayTicker: Game.Timer;
        /** 当前播放速度 */
        private static _currSpeed: ReplaySpeedEnum;
        /** 麻将模块代理 */
        private static _mjProxy: MahjongProxy;
        /** 公共模块代理 */
        private static _proxy: RFGameProxy;
        /** 游戏日志信息 */
        private static _gameLog: GameLogInfo;

        /** 开始游戏返回结果【进入牌桌之后就返回，并不是开始打麻将】 */
        private static _requestStartGameMsgAck: NewIntoGameTableMsgAck;

        /** 真正开始打麻将 */
        private static _gameStartMsg: MahjongStartCircleGameMsgAck;

        /** 记录当前的播放操作记录的索引位置 */
        private static _currPlayIndex: number;
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
            GameConstant.setCurrentGame(EGameType.MAHJONG);
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

            if (!self._mjProxy) {
                self._mjProxy = MahjongProxy.getInstance();
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
            self.initMahjongStartCircleGameMsg();

            self._proxy.exeNewIntoGameTableMsgAck(self._requestStartGameMsgAck, true);
            self._mjProxy.exeMahjongStartCircleGameMsgAck(self._gameStartMsg);

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
         * 获取当前局数
         */
        public static get curentRound(): number {
            return this._gameLog.handIndex;
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
            // this._proxy.exeNewIntoGameTableMsgAck(vMsg, true);
        }

        private static initMahjongStartCircleGameMsg(): void {
            let self = this;
            let vGameLog: GameLogInfo = self._gameLog;
            let vMsg: MahjongStartCircleGameMsgAck = new MahjongStartCircleGameMsgAck();
            // 我的座位
            vMsg.myTablePos = self._requestStartGameMsgAck.playerPos;
            vMsg.playerInfos = new Array<MahjongGameStartPlayerInfo>();
            // 设置圈数
            // vMsg.quanNum = vGameLog.handIndex;
            // 设置玩家手牌
            let vPlayerOps: Array<PlayerOperationDesc> = vGameLog.playerOps;
            do {
                let vCurrOp: PlayerOperationDesc = vPlayerOps[self._currPlayIndex];
                if (self._currPlayIndex === 0) {
                    // 设置癞子标识
                    vMsg.unused_0 = vCurrOp.opValue1;
                    // 设置庄家位置 和 房主位置
                    let vDealerPos: number = vCurrOp.opValue2 & 0xFF;
                    let vCreatorPos: number = (vCurrOp.opValue2 >> 8) & 0xFF;
                    vMsg.dealerPos = vDealerPos;
                    self._requestStartGameMsgAck.createPlayerID = vGameLog.players[vCreatorPos].playerID;
                }

                //剩余牌数
                vMsg.cityWallInfo.cardLeftNum = vCurrOp.cardLeftNum;

                // 设置玩家手牌
                let playerInfo:MahjongGameStartPlayerInfo = new MahjongGameStartPlayerInfo();
                playerInfo.tablePos = vCurrOp.tablePos;
                playerInfo.handCards = vCurrOp.vlist;
                playerInfo.chuCards = new Array<number>();
                playerInfo.cardDowns = new Array<MahjongCardDown>();

                vMsg.playerInfos.push(playerInfo);

                ++self._currPlayIndex;
            } while (vPlayerOps[self._currPlayIndex].opCode === GameConstant.MSG_MAHJONG_SEND_CARDS);

            // 设置玩法
            // vMsg = self._requestStartGameMsgAck.mainGamePlayRule;

            // 设置癞子
            vMsg.laiZiCards = vGameLog.laiZiCards;
            vMsg.huaCards = vGameLog.huaCards;

            // 庄家位置
            vMsg.dealerPos = vGameLog.dealerPos;

            this._gameStartMsg = vMsg;
            // this._mjProxy.exeMahjongStartCircleGameMsgAck(vMsg);
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

        /**
         * 通过玩家座位获得玩家手牌
         * @param {number} pTablePos
         * @returns {Array<number>}
         */
        private static getHandCardArrayByPos(pTablePos: number): Array<number> {
            let vMsg: MahjongStartCircleGameMsgAck = this._gameStartMsg;
            // 设置玩家手牌
            for(let i=0,iLength=vMsg.playerInfos.length; i<iLength; ++i){
                if(vMsg.playerInfos[i].tablePos === pTablePos){
                    return vMsg.playerInfos[i].handCards;
                }
            }
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
                    return;
                }

                // 分别处理各种操作
                if(vCurrOp.opCode === GameConstant.MSG_MAHJONG_XIAO_HU){
                    self.publishCard(vCurrOp);
                }else if (vCurrOp.opCode === GameConstant.MSG_MAHJONG_MO_CARD) {
                    self.playMoPai(vCurrOp);
                } else if (vCurrOp.opCode === GameConstant.MSG_MAHJONG_CHU_CARD) {
                    self.playChu(vCurrOp);
                } else if (vCurrOp.opCode === GameConstant.MSG_MAHJONG_CHI) {
                    self.playChi(vCurrOp);
                }else if (vCurrOp.opCode === GameConstant.MSG_MAHJONG_PENG) {
                    self.playPeng(vCurrOp);
                } else if (vCurrOp.opCode === GameConstant.MSG_MAHJONG_GANG) {
                    self.playGang(vCurrOp);
                } else if (vCurrOp.opCode === GameConstant.MSG_MAHJONG_UPDATE_SCORE) {
                    self.playUpdateScore(vCurrOp);
                } else if (vCurrOp.opCode === GameConstant.MSG_MAHJONG_ZI_MO_HU || vCurrOp.opCode === GameConstant.MSG_MAHJONG_JIE_PAO_HU) {
                    self.playHu(vCurrOp,vCurrOp.opCode);
                } else if (vCurrOp.opCode === GameConstant.MSG_MAHJONG_ZHUA_NIAO) {
                    self.playZhongNiao(vCurrOp);
                } else if (vCurrOp.opCode === GameConstant.MSG_MAHJONG_ADD_CHU_CARD) {
                    self.playAddChuCard(vCurrOp);
                } else if (vCurrOp.opCode === GameConstant.MSG_MAHJONG_CHANG_SHA_VIEW_GANG_CARD) {
                    self.changShaViewGangCard(vCurrOp);
                } else if (vCurrOp.opCode === GameConstant.MSG_MAHJONG_CHANG_SHA_HIDE_GANG_CARD) {
                    self.changShaHideGangCard(vCurrOp);
                } else if(vCurrOp.opCode === GameConstant.MSG_MAHJONG_CHANG_SHA_PIAO_FEN){
                    self.changShaPiaoFen(vCurrOp);
                } else if (vCurrOp.opCode === GameConstant.MAHJONG_OPERTAION_CANCEL) {
                    // 服务端回放中只插入了过胡
                    self.playGuoHu(vCurrOp);
                }
                MahjongData.cardLeftNum.value = vCurrOp.cardLeftNum;

                // 发送提醒玩家出牌指令，变化中间指示方向
                let vMsg: MahjongRemindPlayerOperationMsgAck = new MahjongRemindPlayerOperationMsgAck();
                vMsg.operationPlayerPos = vCurrOp.tablePos;
                this._mjProxy.exeMahjongRemindPlayerOperationMsgAck(vMsg);

                // 当前播放索引位置自增
                ++self._currPlayIndex;
                return;
            }

        }

        /**
         * 长沙麻将飘分选择
         * @param {FL.PlayerOperationDesc} pCurrOp
         */
        public static changShaPiaoFen(pCurrOp: PlayerOperationDesc): void{
            let piaoFenList:Array<OperateInfo> = new Array<OperateInfo>();
            for(let i=0,iLength=pCurrOp.vlist.length; i<iLength; i+=3){
                let info:OperateInfo = new OperateInfo();
                info.playerPos = pCurrOp.vlist[i];
                info.operType = pCurrOp.vlist[i+1];
                info.operValue = pCurrOp.vlist[i+2];
                piaoFenList.push(info);
            }

            for (let i:number = 0;i<piaoFenList.length;i++) {
                let playerPos:number = piaoFenList[i].playerPos;
                MahjongData.piaoFenInfo[playerPos] = piaoFenList[i].operValue;
                let pPZOrientation: PZOrientation = MahjongHandler.getPZOrientation(playerPos);
                MvcUtil.send(MahjongModule.MAHJONG_SHOW_PIAO,pPZOrientation);
            }
        }

        /**
         * 小胡显示牌
         * @param {FL.PlayerOperationDesc} pCurrOp
         */
        public static publishCard(pCurrOp: PlayerOperationDesc): void{
            let vMahjongPublishCard:MahjongPublishCardMsgAck = new MahjongPublishCardMsgAck();
            vMahjongPublishCard.playerPos = pCurrOp.tablePos;
            vMahjongPublishCard.action = pCurrOp.opValue1;
            vMahjongPublishCard.cards = pCurrOp.vlist;
            MvcUtil.send(MahjongModule.MAHJONG_PUBLISH_CARD,vMahjongPublishCard);
        }

        /**
         * 播放摸牌
         * @param {FL.PlayerOperationDesc} pCurrOp
         */
        private static playMoPai(pCurrOp: PlayerOperationDesc): void {
            // 处理数据
            let vCurrHandCards:Array<number> = this.getHandCardArrayByPos(pCurrOp.tablePos);

            vCurrHandCards.push(pCurrOp.opValue1);
            // 处理回放
            this._mjProxy.exeReplayMoPai(pCurrOp);
        }

        /**
         * 播放出牌
         * @param {FL.PlayerOperationDesc} pCurrOp
         */
        private static playChu(pCurrOp: PlayerOperationDesc): void {
            // 处理数据
            let vCurrHandCards: Array<number> = this.getHandCardArrayByPos(pCurrOp.tablePos);

            // 删除一张出的牌
            for (let vIndex: number = 0, vLength: number = vCurrHandCards.length; vIndex < vLength; ++vIndex) {
                if (vCurrHandCards[vIndex] === pCurrOp.opValue1) {
                    vCurrHandCards.splice(vIndex, 1);
                    break;
                }
            }
            // 排个序
            vCurrHandCards.sort(function (a, b) {
                let aLaizi:boolean = MahjongHandler.isLaiZi(a);
                let bLaizi:boolean = MahjongHandler.isLaiZi(b);
                if (aLaizi === bLaizi) {
                    return a - b;
                } else if (aLaizi && !bLaizi) {
                    return -1;
                } else {
                    return 1;
                }
            });

            // 出牌值
            let vChuCardValue: number = pCurrOp.opValue1;
            if (MJGameHandler.isHuaCard(pCurrOp.opValue1)) {
                // 处理花牌
                // let vPlayerTableOperationMsg:PlayerTableOperationMsg = new PlayerTableOperationMsg();
                // vPlayerTableOperationMsg.operation = GameConstant.MAHJONG_OPERTAION_BU_HUA;
                // vPlayerTableOperationMsg.player_table_pos = pCurrOp.tablePos;
                // vPlayerTableOperationMsg.card_value = vChuCardValue;
                // vPlayerTableOperationMsg.cardLeftNum = pCurrOp.cardLeftNum;
                // this._mjProxy.exePlayerTableOperationMsg(vPlayerTableOperationMsg);
                // 如果是花赋值为0
                vChuCardValue = 0;
            }
            // 模拟指令发送
            let vMsg: MahjongPlayCardMsgAck = new MahjongPlayCardMsgAck();
            vMsg.playerPos = pCurrOp.tablePos;
            vMsg.playCard = vChuCardValue;
            vMsg.handCards = vCurrHandCards;
            this._mjProxy.exeMahjongPlayCardMsgAck(vMsg);
        }

        /**
         * 播放自动补花
         * @param {FL.PlayerOperationDesc} pCurrOp
         */
        private static playAutoBuHua(pCurrOp: PlayerOperationDesc): void {
            if (pCurrOp.vlist && pCurrOp.vlist.length > 0) {
                let vPlayerOperationNotifyMsg: PlayerOperationNotifyMsg = new PlayerOperationNotifyMsg();
                vPlayerOperationNotifyMsg.operation = GameConstant.MAHJONG_OPERTAION_BU_HUA;
                vPlayerOperationNotifyMsg.player_table_pos = pCurrOp.tablePos;
                vPlayerOperationNotifyMsg.tingList = pCurrOp.vlist;
                // this._mjProxy.exePlayerOperationNotifyMsg(vPlayerOperationNotifyMsg);
            }
        }

        /**
         * 播放补花
         * @param {FL.PlayerOperationDesc} pCurrOp
         */
        private static playBuHua(pCurrOp: PlayerOperationDesc): void {
            // 处理花牌
            let vPlayerTableOperationMsg: PlayerTableOperationMsg = new PlayerTableOperationMsg();
            vPlayerTableOperationMsg.operation = GameConstant.MAHJONG_OPERTAION_BU_HUA;
            vPlayerTableOperationMsg.player_table_pos = pCurrOp.tablePos;
            vPlayerTableOperationMsg.card_value = pCurrOp.opValue1;
            vPlayerTableOperationMsg.cardLeftNum = pCurrOp.cardLeftNum;
            // this._mjProxy.exePlayerTableOperationMsg(vPlayerTableOperationMsg);
        }

        /**
         * 播放吃
         * @param {FL.PlayerOperationDesc} pCurrOp
         */
        private static playChi(pCurrOp: PlayerOperationDesc): void {

            // 吃
            let vMahjongActionResult: MahjongActionSelectMsgAck = new MahjongActionSelectMsgAck();
            vMahjongActionResult.action = MahjongActionEnum.CHI;
            vMahjongActionResult.playerPos = pCurrOp.tablePos;
            vMahjongActionResult.cards = pCurrOp.vlist;
            // vMahjongActionResult.cards = (vTargetCard << 24) | (vCardArray[2] << 16) | (vCardArray[1] << 8) | vCardArray[0];
            MvcUtil.send(MahjongModule.MAHJONG_ACTION_EFFECT, vMahjongActionResult);
            // this._mjProxy.exeMahjongActionResultSetMsgAck(vMahjongActionResult);

            let vMahjongChangeCardDown:MahjongChangeCardDownMsgAck = new MahjongChangeCardDownMsgAck();
            vMahjongChangeCardDown.playerPos = pCurrOp.tablePos;
            vMahjongChangeCardDown.cardDown = this.changeListToCardDown(MahjongCardDownTypeEnum.CHI, pCurrOp);
            vMahjongChangeCardDown.isAdd = true;
            vMahjongChangeCardDown.handCards = this.removePlayerHandCard(pCurrOp.tablePos, ArrayUtil.removeOneBuildNewArray(pCurrOp.vlist, pCurrOp.opValue1));
            MvcUtil.send(MahjongModule.MAHJONG_CHANGE_CARD_DOWN, vMahjongChangeCardDown);

            // 玩家打出的牌被吃碰杠走了
            let vMahjongRemoveChuCard: MahjongRemoveChuCardMsgAck = new MahjongRemoveChuCardMsgAck();
            vMahjongRemoveChuCard.playerPos = pCurrOp.opValue2;
            vMahjongRemoveChuCard.card = pCurrOp.opValue1;
            vMahjongRemoveChuCard.cardIndex = parseInt(pCurrOp.opStr);
            MvcUtil.send(MahjongModule.MAHJONG_REMOVE_CHU_CARD, vMahjongRemoveChuCard);
            // this._mjProxy.exePlayerOperationNotifyMsg(vPlayerOperationNotifyMsg);

        }

        /**
         * Array<number>转MahjongCardDown
         * @param {FL.MahjongActionEnum} cardDownType
         * @param {FL.PlayerOperationDesc} pCurrOp
         * @returns {FL.MahjongCardDown}
         */
        private static changeListToCardDown(cardDownType:MahjongCardDownTypeEnum, pCurrOp: PlayerOperationDesc):MahjongCardDown{
            let cardDown:MahjongCardDown = new MahjongCardDown();
            cardDown.sCardDownType = cardDownType;
            cardDown.sChuOffset = MahjongHandler.getChuOffset(pCurrOp.opValue2, pCurrOp.tablePos, this._requestStartGameMsgAck.playersNumber);
            cardDown.sCards = pCurrOp.vlist;

            return cardDown;
        }

        /**
         * 播放碰牌
         * @param {FL.PlayerOperationDesc} pCurrOp
         */
        private static playPeng(pCurrOp: PlayerOperationDesc): void {

            // 碰
            let vMahjongActionResult: MahjongActionSelectMsgAck = new MahjongActionSelectMsgAck();
            vMahjongActionResult.action = MahjongActionEnum.PENG;
            vMahjongActionResult.playerPos = pCurrOp.tablePos;
            vMahjongActionResult.cards = pCurrOp.vlist;
            MvcUtil.send(MahjongModule.MAHJONG_ACTION_EFFECT,vMahjongActionResult);
            // this._mjProxy.exeMahjongActionResultSetMsgAck(vMahjongActionResult);

            let vMahjongChangeCardDown:MahjongChangeCardDownMsgAck = new MahjongChangeCardDownMsgAck();
            vMahjongChangeCardDown.playerPos = pCurrOp.tablePos;
            vMahjongChangeCardDown.cardDown = this.changeListToCardDown(MahjongCardDownTypeEnum.PENG, pCurrOp);
            vMahjongChangeCardDown.isAdd = true;
            vMahjongChangeCardDown.handCards =  this.removePlayerHandCard(pCurrOp.tablePos, ArrayUtil.removeOneBuildNewArray(pCurrOp.vlist, pCurrOp.opValue1));
            MvcUtil.send(MahjongModule.MAHJONG_CHANGE_CARD_DOWN, vMahjongChangeCardDown);

            // 玩家打出的牌被吃碰杠走了
            let vMahjongRemoveChuCard: MahjongRemoveChuCardMsgAck = new MahjongRemoveChuCardMsgAck();
            vMahjongRemoveChuCard.playerPos = pCurrOp.opValue2;
            vMahjongRemoveChuCard.card = pCurrOp.opValue1;
            vMahjongRemoveChuCard.cardIndex =parseInt(pCurrOp.opStr);
            MvcUtil.send(MahjongModule.MAHJONG_REMOVE_CHU_CARD,vMahjongRemoveChuCard);
            // this._mjProxy.exePlayerOperationNotifyMsg(vPlayerOperationNotifyMsg);

        }

        /**
         * 删除玩家手牌
         * @param {number} pTablePos
         * @param {number[]} removeArray
         */
        private static removePlayerHandCard(pTablePos: number, removeArray: number[]): number[] {
            // 处理数据
            let vCurrHandCards: Array<number> = this.getHandCardArrayByPos(pTablePos);
            //删除数组的索引
            let vRemoveArrayIndex: number = 0, vIndex: number = 0;
            for (; vIndex < vCurrHandCards.length; ++vIndex) {
                let vCurrCard = vCurrHandCards[vIndex];
                if (vRemoveArrayIndex === removeArray.length) {
                    break;
                } else if (removeArray[vRemoveArrayIndex] === vCurrCard) {
                    vRemoveArrayIndex++;
                    vCurrHandCards.splice(vIndex, 1);
                    vIndex--;
                }
            }
            return vCurrHandCards;
        }

        /**
         * 播放杠
         * @param {FL.PlayerOperationDesc} pCurrOp
         */
        private static playGang(pCurrOp: PlayerOperationDesc): void {
            // 杠的牌
            let vGangCardValue: number = pCurrOp.vlist[0];

            let actionId:number = parseInt(pCurrOp.opStr);

            // 杠
            let vMahjongActionResult: MahjongActionSelectMsgAck = new MahjongActionSelectMsgAck();
            vMahjongActionResult.action = actionId;
            vMahjongActionResult.playerPos = pCurrOp.tablePos;
            vMahjongActionResult.cards = pCurrOp.vlist;
            MvcUtil.send(MahjongModule.MAHJONG_ACTION_EFFECT,vMahjongActionResult);
            // this._mjProxy.exeMahjongActionResultSetMsgAck(vMahjongActionResult);

            let vMahjongChangeCardDown:MahjongChangeCardDownMsgAck = new MahjongChangeCardDownMsgAck();
            vMahjongChangeCardDown.playerPos = pCurrOp.tablePos;
            vMahjongChangeCardDown.isAdd = true;
            // 明杠要从已经打出的牌中拿走一张牌
            if (actionId === MahjongActionEnum.MING_GANG || actionId === MahjongActionEnum.CHANG_SHA_MING_BU_ZHANG) {
                let vMahjongRemoveChuCard: MahjongRemoveChuCardMsgAck = new MahjongRemoveChuCardMsgAck();
                vMahjongRemoveChuCard.playerPos = pCurrOp.opValue2;
                vMahjongRemoveChuCard.card = vGangCardValue;
                vMahjongRemoveChuCard.cardIndex =pCurrOp.opValue1;
                MvcUtil.send(MahjongModule.MAHJONG_REMOVE_CHU_CARD,vMahjongRemoveChuCard);
                vMahjongChangeCardDown.cardDown = this.changeListToCardDown(MahjongCardDownTypeEnum.MING_GANG, pCurrOp);
                // 移除手里3张
                vMahjongChangeCardDown.handCards =  this.removePlayerHandCard(pCurrOp.tablePos, ArrayUtil.removeOneBuildNewArray(pCurrOp.vlist, vGangCardValue));
            } else if (actionId === MahjongActionEnum.AN_GANG || actionId === MahjongActionEnum.CHANG_SHA_AN_BU_ZHANG) {
                vMahjongChangeCardDown.cardDown = this.changeListToCardDown(MahjongCardDownTypeEnum.AN_GANG, pCurrOp);
                // 移除手里4张
                vMahjongChangeCardDown.handCards =  this.removePlayerHandCard(pCurrOp.tablePos, pCurrOp.vlist);
            } else if (actionId === MahjongActionEnum.BU_GANG || actionId === MahjongActionEnum.CHANG_SHA_BU_BU_ZHANG ) {
                vMahjongChangeCardDown.cardDown = this.changeListToCardDown(MahjongCardDownTypeEnum.BU_GANG, pCurrOp);
                // 移除手里1张
                vMahjongChangeCardDown.handCards =  this.removePlayerHandCard(pCurrOp.tablePos, [vGangCardValue]);

            }
            MvcUtil.send(MahjongModule.MAHJONG_CHANGE_CARD_DOWN, vMahjongChangeCardDown);

        }

        /**
         * 更改分数
         * @param {FL.PlayerOperationDesc} pCurrOp
         */
        private static playUpdateScore(pCurrOp: PlayerOperationDesc): void {
            let vMsg: MahjongUpdateScoreMsgAck = new MahjongUpdateScoreMsgAck();
            vMsg.actionType = pCurrOp.opValue1;
            vMsg.settleType = pCurrOp.opValue2;
            let vScoreInfos: Array<MahjongUpdateScorePlayerInfo> = [];
            for (let vIndex:number = 0; vIndex < pCurrOp.vlist.length; vIndex+=2) {
                let vOneInfo: MahjongUpdateScorePlayerInfo = new MahjongUpdateScorePlayerInfo();
                vOneInfo.tablePos =  pCurrOp.vlist[vIndex];
                vOneInfo.score =  pCurrOp.vlist[vIndex + 1];
                vScoreInfos.push(vOneInfo);
            }
            vMsg.scoreInfos = vScoreInfos;
            MvcUtil.send(MahjongModule.MAHJONG_UPDATE_SCORE, vMsg);
        }

        /**
         * 播放听
         * @param {FL.PlayerOperationDesc} pCurrOp
         */
        private static playTing(pCurrOp: PlayerOperationDesc): void {
            // 听
            let vPlayerTableOperationMsg: PlayerTableOperationMsg = new PlayerTableOperationMsg();
            vPlayerTableOperationMsg.operation = GameConstant.MAHJONG_OPERTAION_TING;
            vPlayerTableOperationMsg.player_table_pos = pCurrOp.tablePos;
            // this._mjProxy.exePlayerTableOperationMsg(vPlayerTableOperationMsg);
        }

        /**
         * 播放胡
         * @param {FL.PlayerOperationDesc} pCurrOp
         */
        private static playHu(pCurrOp: PlayerOperationDesc, actionId:MahjongActionEnum): void {
            // let cards:Array<number> = new Array<number>();
            let vMahjongActionResult: MahjongActionSelectMsgAck = new MahjongActionSelectMsgAck();
            if(actionId === GameConstant.MSG_MAHJONG_ZI_MO_HU){
                vMahjongActionResult.action =  MahjongActionEnum.ZI_MO;
            }else if(actionId === GameConstant.MSG_MAHJONG_JIE_PAO_HU){
                vMahjongActionResult.action =  MahjongActionEnum.JIE_PAO;
            }
            vMahjongActionResult.playerPos = pCurrOp.tablePos;
            // cards.push(pCurrOp.opValue1);
            vMahjongActionResult.cards = pCurrOp.vlist;
            MvcUtil.send(MahjongModule.MAHJONG_ACTION_EFFECT, vMahjongActionResult);
            // this._mjProxy.exePlayerOperationNotifyMsg(vPlayerOperationNotifyMsg);
        }

        /**
         * 播放杠了就有
         * @param {FL.PlayerOperationDesc} pCurrOp
         */
        private static playGangLeJiuYou(pCurrOp: PlayerOperationDesc): void {

            // 杠了就有 再发送杠分和总分给玩家
            let vPlayerTableOperationMsg: PlayerTableOperationMsg = new PlayerTableOperationMsg();
            vPlayerTableOperationMsg.operation = GameConstant.MAHJONG_OPERTAION_SCORE_UPDATE;
            vPlayerTableOperationMsg.player_table_pos = pCurrOp.tablePos;
            vPlayerTableOperationMsg.opValue = pCurrOp.vlist[1]; // 总分
            vPlayerTableOperationMsg.chuOffset = pCurrOp.vlist[2]; // 赢钱人的位置
            vPlayerTableOperationMsg.cardLeftNum = pCurrOp.vlist[3]; // 对应于玩家的钻石数
            vPlayerTableOperationMsg.card_value = pCurrOp.vlist[4]; // 对应于变化的分数
            // msg.opValue=pl.getTableGold(gt.isVipTable());//总分
            // msg.chuOffset=player.getTablePos();//赢钱人的位置
            // msg.cardLeftNum=pl.getDiamond();
            // msg.card_value = 0 - gangScore;
            // if( pl.playerEquals(player) ) {
            //     msg.card_value = score;
            // }
            // this._mjProxy.exePlayerTableOperationMsg(vPlayerTableOperationMsg);
        }

        /**
         * 淮北玩法 播放下坐拉跑
         * @param {FL.PlayerOperationDesc} pCurrOp
         */
        private static playXiaZuoLaPao(pCurrOp: PlayerOperationDesc): void {
            let vPlayerZuoLaPaoNotifyMsgAck: PlayerZuoLaPaoNotifyMsgAck = new PlayerZuoLaPaoNotifyMsgAck();
            vPlayerZuoLaPaoNotifyMsgAck.playerZuoLaPaoInfoList = [];
            let vPlayerZuoLaPaoInfo: PlayerZuoLaPaoInfo = new PlayerZuoLaPaoInfo();
            vPlayerZuoLaPaoInfo.isZuoLaPao = 1;
            vPlayerZuoLaPaoInfo.zuoNumber = pCurrOp.vlist[0];
            vPlayerZuoLaPaoInfo.laNumber = pCurrOp.vlist[1];
            vPlayerZuoLaPaoInfo.paoNumber = pCurrOp.vlist[2];
            vPlayerZuoLaPaoInfo.tablePositon = pCurrOp.tablePos;
            vPlayerZuoLaPaoNotifyMsgAck.playerZuoLaPaoInfoList.push(vPlayerZuoLaPaoInfo);
            // this._mjProxy.exePlayerZuoLaPaoNotifyMsgAck(vPlayerZuoLaPaoNotifyMsgAck);
        }

        /**
         * 砀山玩法 播放下码
         * @param {FL.PlayerOperationDesc} pCurrOp
         */
        private static playXiaMa(pCurrOp: PlayerOperationDesc): void {
            let vPlayerXiaMaValueNotifyMsg: PlayerXiaMaValueNotifyMsg = new PlayerXiaMaValueNotifyMsg();
            vPlayerXiaMaValueNotifyMsg.tablePositons = [];
            vPlayerXiaMaValueNotifyMsg.xiaMaValues = [];
            vPlayerXiaMaValueNotifyMsg.tablePositons.push(pCurrOp.tablePos);
            vPlayerXiaMaValueNotifyMsg.xiaMaValues.push(pCurrOp.vlist[0]);
            // this._mjProxy.exePlayerXiaMaValueNotifyMsg(vPlayerXiaMaValueNotifyMsg);
        }

        /**
         * 转转麻将玩法 播放中鸟
         * @param {FL.PlayerOperationDesc} pCurrOp
         */
        private static playZhongNiao(pCurrOp: PlayerOperationDesc): void {
            let vMahjongGameOverZhuaNiao:MahjongGameOverZhuaNiaoMsgAck = new MahjongGameOverZhuaNiaoMsgAck();
            vMahjongGameOverZhuaNiao.isYiWuJiuZhongNiao = pCurrOp.opValue1===1?true:false;
            let niaoList:Array<MahjongMaPaiInfo> = new Array<MahjongMaPaiInfo>();
            for(let i=0,iLength=pCurrOp.vlist.length; i<iLength; i+=4){
                let info:MahjongMaPaiInfo = new MahjongMaPaiInfo();
                info.tablePos = pCurrOp.vlist[i];
                info.isZhong = pCurrOp.vlist[i+1] === 1?true:false;
                info.cardType = pCurrOp.vlist[i+2];
                info.card = pCurrOp.vlist[i+3];
                niaoList.push(info);
            }
            vMahjongGameOverZhuaNiao.niaoPaiList = niaoList;

            MvcUtil.send(MahjongModule.MAHJONG_START_ZHUA_NIAO, vMahjongGameOverZhuaNiao);
        }

        /**
         * 添加出牌
         * @param {FL.PlayerOperationDesc} pCurrOp
         */
        private static playAddChuCard(pCurrOp: PlayerOperationDesc): void {
            let vMahjongAddChuCardMsgAck:MahjongAddChuCardMsgAck = new MahjongAddChuCardMsgAck();
            vMahjongAddChuCardMsgAck.playerPos = pCurrOp.tablePos;
            vMahjongAddChuCardMsgAck.card =  pCurrOp.opValue1;
            MvcUtil.send(MahjongModule.MAHJONG_PLAY_ONE_CARD, vMahjongAddChuCardMsgAck);
        }

        /**
         * 长沙显示杠牌
         * @param {FL.PlayerOperationDesc} pCurrOp
         */
        private static changShaViewGangCard(pCurrOp: PlayerOperationDesc): void {
            let vMsg:MahjongChangShaViewGangCardMsgAck = new MahjongChangShaViewGangCardMsgAck();
            vMsg.playerPos = pCurrOp.tablePos;
            vMsg.card1 =  pCurrOp.opValue1;
            vMsg.card2 =  pCurrOp.opValue2;
            MvcUtil.send(MahjongModule.MAHJONG_CHANG_SHA_VIEW_GANG_CARD, vMsg);
        }

        /**
         * 长沙隐藏杠牌
         * @param {FL.PlayerOperationDesc} pCurrOp
         */
        private static changShaHideGangCard(pCurrOp: PlayerOperationDesc): void {
            let vMsg:MahjongChangShaViewGangCardMsgAck = new MahjongChangShaViewGangCardMsgAck();
            vMsg.isView = false;
            MvcUtil.send(MahjongModule.MAHJONG_CHANG_SHA_VIEW_GANG_CARD, vMsg);
        }

        /**
         * 麻将过胡、碰、杠
         * 只在回放中生效
         */
        private static playGuoHu(pCurrOp: PlayerOperationDesc) {
            MvcUtil.send(MahjongModule.MAHJONG_OPT_GUO, MahjongHandler.getPZOrientation(pCurrOp.tablePos));
        }
    }

}