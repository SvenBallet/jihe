module FL {

    /**
     * 回放速度
     */
    export enum ReplaySpeedEnum {
        /** ONE 速度最慢，定时器每n下处理一下逻辑 */
        ONE = 4, TWO = 2, FOUR = 1
    }

    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase - MJGameLogReplay
     * @Description:  // 麻将游戏日志回放
     * @Create: DerekWu on 2018/1/17 18:48
     * @Version: V1.0
     */
    export class MJGameLogReplay {

        /** 定时器跳动时间间隔(单位：毫秒) */
        private static readonly _tickerTimes: number = 300;

        /** 重播定时器 */
        private static _replayTicker: Game.Timer;
        /** 当前播放速度 */
        private static _currSpeed: ReplaySpeedEnum;
        /** 麻将模块代理 */
        private static _mjProxy: MJGameProxy;
        /** 游戏日志信息 */
        private static _gameLog: GameLogInfo;

        /** 开始游戏返回结果【进入牌桌之后就返回，并不是开始打麻将】 */
        private static _requestStartGameMsgAck: RequestStartGameMsgAck;

        /** 真正开始打麻将 */
        private static _gameStartMsg: GameStartMsg;

        /** 记录当前的播放操作记录的索引位置 */
        private static _currPlayIndex: number;

        /**
         * 开始回放
         * @param {FL.GetPlayerGameLogMsg} msg
         */
        public static startReplay(msg: GetPlayerGameLogMsg): void {
            let self = this;
            //设置当前游戏操作类型
            GameConstant.setCurrentGame(EGameType.MJ);
            // 解压游戏日志
            let vInflate: Zlib.Inflate = new Zlib.Inflate(msg.data.bytes);
            let vOutBuffer = vInflate.decompress();
            let vByteArray: egret.ByteArray = new egret.ByteArray(vOutBuffer.buffer);
            vByteArray.position = 0;
            let vGameLogInfo: GameLogInfo = new GameLogInfo();
            vGameLogInfo.serialize(new ObjectSerializer(true, vByteArray));
            self._gameLog = vGameLogInfo;

            // 设置代理
            if (!self._mjProxy) {
                self._mjProxy = MJGameProxy.getInstance();
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
            self.initRequestStartGameMsgAck();
            self.initGameStartMsg();

            self._mjProxy.exeRequestStartGameMsgAck(self._requestStartGameMsgAck, true);
            self._mjProxy.exeGameStartMsg(self._gameStartMsg);

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

        private static initRequestStartGameMsgAck(): void {
            let vGameLog: GameLogInfo = this._gameLog;
            let vMsg: RequestStartGameMsgAck = new RequestStartGameMsgAck();
            // 标识成功
            vMsg.result = ErrorCodeConstant.CMD_EXE_OK;
            // 当前玩家座位
            let vTablePos: number = 0;
            let vPlayers: Array<SimplePlayer> = vGameLog.players, vIndex: number = 0, vLength: number = vPlayers.length;
            for (; vIndex < vLength; ++vIndex) {
                if (vPlayers[vIndex].playerID === LobbyData.playerVO.playerID) {
                    vTablePos = vPlayers[vIndex].tablePos;
                }
                // 重设一定在桌子上
                vPlayers[vIndex].inTable = 1;
            }
            // 设置玩家座位
            vMsg.tablePos = vTablePos;
            // 设置vipTableID
            vMsg.vipTableID = vGameLog.vipRoomIndex;
            // 设置玩家
            vMsg.players = vPlayers;
            // 设置玩法
            // vMsg.newPlayWay = vGameLog.playWay;
            vMsg.mainGamePlayRule = vGameLog.mainGamePlayRule;
            vMsg.minorGamePlayRuleList = vGameLog.minorGamePlayRuleList;
            // 设置总局数
            vMsg.totalHand = vGameLog.handsTotal;
            // 设置当前局数
            vMsg.currentHand = vGameLog.handIndex;
            // 设置人数
            vMsg.playersNumber = vLength;

            this._requestStartGameMsgAck = vMsg;
            // this._mjProxy.exeRequestStartGameMsgAck(vMsg, true);
        }

        private static initGameStartMsg(): void {
            let self = this;
            let vGameLog: GameLogInfo = self._gameLog;
            let vMsg: GameStartMsg = new GameStartMsg();
            // 我的座位
            vMsg.myTablePos = self._requestStartGameMsgAck.tablePos;
            // 设置圈数
            vMsg.quanNum = vGameLog.handIndex;
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

                // 设置玩家手牌
                if (vCurrOp.tablePos === 0) vMsg.player0HandCards = vCurrOp.vlist;
                if (vCurrOp.tablePos === 1) vMsg.player1HandCards = vCurrOp.vlist;
                if (vCurrOp.tablePos === 2) vMsg.player2HandCards = vCurrOp.vlist;
                if (vCurrOp.tablePos === 3) vMsg.player3HandCards = vCurrOp.vlist;
                // 设置一下我的手牌
                if (vCurrOp.tablePos === vMsg.myTablePos) vMsg.myCards = vCurrOp.vlist;

                ++self._currPlayIndex;
            } while (vPlayerOps[self._currPlayIndex].opCode === GameConstant.MAHJONG_OPERTAION_LOG_SEND_CARDS);

            // 设置玩法
            vMsg.newPlayWay = self._requestStartGameMsgAck.newPlayWay;
            // 设置已经出牌 和吃碰杠 为 空
            vMsg.player0Cards = new Array<number>();
            vMsg.player1Cards = new Array<number>();
            vMsg.player2Cards = new Array<number>();
            vMsg.player3Cards = new Array<number>();
            vMsg.player0CardsDown = new Array<CardDown>();
            vMsg.player1CardsDown = new Array<CardDown>();
            vMsg.player2CardsDown = new Array<CardDown>();
            vMsg.player3CardsDown = new Array<CardDown>();

            this._gameStartMsg = vMsg;
            // this._mjProxy.exeGameStartMsg(vMsg);
        }

        /**
         * 通过玩家座位获得玩家手牌
         * @param {number} pTablePos
         * @returns {Array<number>}
         */
        private static getHandCardArrayByPos(pTablePos: number): Array<number> {
            let vMsg: GameStartMsg = this._gameStartMsg;
            // 设置玩家手牌
            if (pTablePos === 0) return vMsg.player0HandCards;
            if (pTablePos === 1) return vMsg.player1HandCards;
            if (pTablePos === 2) return vMsg.player2HandCards;
            if (pTablePos === 3) return vMsg.player3HandCards;
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
                if (vCurrOp.opCode === GameConstant.MAHJONG_OPERTAION_MO_CARD) {
                    self.playMoPai(vCurrOp);
                } else if (vCurrOp.opCode === GameConstant.MAHJONG_OPERTAION_CHU) {
                    self.playChu(vCurrOp);
                } else if (vCurrOp.opCode === GameConstant.MAHJONG_OPERTAION_BU_HUA) {
                    // 只处理 vList 有值的情况， 其他的在出牌的时候处理
                    if (vCurrOp.opValue1 === 0) {
                        // ++self._currPlayIndex;
                        // continue;
                        self.playAutoBuHua(vCurrOp);
                    } else {
                        self.playBuHua(vCurrOp);
                    }
                } else if (vCurrOp.opCode === GameConstant.MAHJONG_OPERTAION_CHI) {
                    self.playChi(vCurrOp);
                } else if (vCurrOp.opCode === GameConstant.MAHJONG_OPERTAION_PENG) {
                    self.playPeng(vCurrOp);
                } else if (vCurrOp.opCode === GameConstant.MAHJONG_OPERTAION_MING_GANG) {
                    self.playGang(vCurrOp);
                } else if (vCurrOp.opCode === GameConstant.MAHJONG_OPERTAION_TING) {
                    self.playTing(vCurrOp);
                } else if (vCurrOp.opCode === GameConstant.MAHJONG_OPERTAION_PLAYER_HU_CONFIRMED) {
                    self.playHu(vCurrOp);
                } else if (vCurrOp.opCode === GameConstant.GAME_OPERTAION_GANG_LE_JIU_YOU) {
                    self.playGangLeJiuYou(vCurrOp);
                    // 下一个操作
                    let vNextOp: PlayerOperationDesc = self._gameLog.playerOps[self._currPlayIndex + 1];
                    if (vNextOp && vNextOp.opCode === GameConstant.GAME_OPERTAION_GANG_LE_JIU_YOU) {
                        ++self._currPlayIndex;
                        continue;
                    } else {
                        ++self._currPlayIndex;
                        break;
                    }
                } else if (vCurrOp.opCode === GameConstant.GAME_OPERTAION_XIA_ZUO_LA_PAO) {
                    self.playXiaZuoLaPao(vCurrOp);
                } else if (vCurrOp.opCode === GameConstant.GAME_OPERTAION_XIA_MA) {
                    self.playXiaMa(vCurrOp);
                } else if (vCurrOp.opCode === GameConstant.GAME_OPERTAION_ZHONG_NIAO) {
                    self.playZhongNiao(vCurrOp);
                }

                // 发送提醒玩家出牌指令，变化中间指示方向
                let vPlayerOperationNotifyMsg: PlayerOperationNotifyMsg = new PlayerOperationNotifyMsg();
                vPlayerOperationNotifyMsg.operation = GameConstant.MAHJONG_OPERTAION_TIP;
                vPlayerOperationNotifyMsg.player_table_pos = vCurrOp.tablePos;
                vPlayerOperationNotifyMsg.cardLeftNum = vCurrOp.cardLeftNum;
                this._mjProxy.exePlayerOperationNotifyMsg(vPlayerOperationNotifyMsg);

                // 当前播放索引位置自增
                ++self._currPlayIndex;
                return;
            }

        }

        /**
         * 播放摸牌
         * @param {FL.PlayerOperationDesc} pCurrOp
         */
        private static playMoPai(pCurrOp: PlayerOperationDesc): void {
            // 处理数据
            this.getHandCardArrayByPos(pCurrOp.tablePos).push(pCurrOp.opValue1);
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
                return a - b
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
            let vPlayerTableOperationMsg: PlayerTableOperationMsg = new PlayerTableOperationMsg();
            vPlayerTableOperationMsg.operation = GameConstant.MAHJONG_OPERTAION_CHU;
            vPlayerTableOperationMsg.player_table_pos = pCurrOp.tablePos;
            vPlayerTableOperationMsg.card_value = vChuCardValue;
            vPlayerTableOperationMsg.cardLeftNum = pCurrOp.cardLeftNum;
            vPlayerTableOperationMsg.handCards = vCurrHandCards;
            this._mjProxy.exePlayerTableOperationMsg(vPlayerTableOperationMsg);
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
                this._mjProxy.exePlayerOperationNotifyMsg(vPlayerOperationNotifyMsg);
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
            this._mjProxy.exePlayerTableOperationMsg(vPlayerTableOperationMsg);
        }

        /**
         * 播放吃
         * @param {FL.PlayerOperationDesc} pCurrOp
         */
        private static playChi(pCurrOp: PlayerOperationDesc): void {

            // 获得牌
            let vTargetCard: number = pCurrOp.opValue1 >> 16 & 0xFF;
            let vCard1: number = pCurrOp.opValue1 >> 8 & 0xFF;
            let vCard2: number = pCurrOp.opValue1 & 0xFF;

            // 删除两张手里的牌
            this.removePlayerHandCard(pCurrOp.tablePos, [vCard1, vCard2]);

            let vCardArray: number[] = []
            vCardArray.push(vTargetCard);
            vCardArray.push(vCard1);
            vCardArray.push(vCard2);

            // 排个序
            vCardArray.sort(function (a, b) {
                return a - b
            });

            // 吃
            let vPlayerTableOperationMsg: PlayerTableOperationMsg = new PlayerTableOperationMsg();
            vPlayerTableOperationMsg.operation = GameConstant.MAHJONG_OPERTAION_CHI;
            vPlayerTableOperationMsg.player_table_pos = pCurrOp.tablePos;
            vPlayerTableOperationMsg.opValue = (vTargetCard << 24) | (vCardArray[2] << 16) | (vCardArray[1] << 8) | vCardArray[0];
            vPlayerTableOperationMsg.cardLeftNum = pCurrOp.cardLeftNum;
            vPlayerTableOperationMsg.chuOffset = pCurrOp.opValue2;
            this._mjProxy.exePlayerTableOperationMsg(vPlayerTableOperationMsg);

            // 玩家打出的牌被吃碰杠走了
            let vPlayerOperationNotifyMsg: PlayerOperationNotifyMsg = new PlayerOperationNotifyMsg();
            vPlayerOperationNotifyMsg.operation = GameConstant.MAHJONG_OPERTAION_REMOE_CHU_CARD;
            vPlayerOperationNotifyMsg.player_table_pos = pCurrOp.opValue2;
            vPlayerOperationNotifyMsg.cardLeftNum = pCurrOp.cardLeftNum;
            this._mjProxy.exePlayerOperationNotifyMsg(vPlayerOperationNotifyMsg);

        }

        /**
         * 播放碰牌
         * @param {FL.PlayerOperationDesc} pCurrOp
         */
        private static playPeng(pCurrOp: PlayerOperationDesc): void {

            let vPengCardValue: number = pCurrOp.opValue1 & 0xff;
            // 删除两张手里的牌
            this.removePlayerHandCard(pCurrOp.tablePos, [vPengCardValue, vPengCardValue]);

            // 碰
            let vPlayerTableOperationMsg: PlayerTableOperationMsg = new PlayerTableOperationMsg();
            vPlayerTableOperationMsg.operation = GameConstant.MAHJONG_OPERTAION_PENG;
            vPlayerTableOperationMsg.player_table_pos = pCurrOp.tablePos;
            vPlayerTableOperationMsg.opValue = (vPengCardValue << 16) | (vPengCardValue << 8) | vPengCardValue;
            vPlayerTableOperationMsg.card_value = vPengCardValue | (vPengCardValue << 8);
            vPlayerTableOperationMsg.cardLeftNum = pCurrOp.cardLeftNum;
            vPlayerTableOperationMsg.chuOffset = pCurrOp.opValue2;
            this._mjProxy.exePlayerTableOperationMsg(vPlayerTableOperationMsg);

            // 玩家打出的牌被吃碰杠走了
            let vPlayerOperationNotifyMsg: PlayerOperationNotifyMsg = new PlayerOperationNotifyMsg();
            vPlayerOperationNotifyMsg.operation = GameConstant.MAHJONG_OPERTAION_REMOE_CHU_CARD;
            vPlayerOperationNotifyMsg.player_table_pos = (pCurrOp.opValue1 >> 8) & 0xFF;
            vPlayerOperationNotifyMsg.cardLeftNum = pCurrOp.cardLeftNum;
            this._mjProxy.exePlayerOperationNotifyMsg(vPlayerOperationNotifyMsg);

        }

        /**
         * 删除玩家手牌
         * @param {number} pTablePos
         * @param {number[]} removeArray
         */
        private static removePlayerHandCard(pTablePos: number, removeArray: number[]): void {
            // 处理数据
            let vCurrHandCards: Array<number> = this.getHandCardArrayByPos(pTablePos);
            //删除数组的索引
            let vRemoveArrayIndex: number = 0, vIndex: number = 0;
            for (; vIndex < vCurrHandCards.length; ++vIndex) {
                let vCurrCard = vCurrHandCards[vIndex];
                if (vRemoveArrayIndex === removeArray.length) {
                    return;
                } else if (removeArray[vRemoveArrayIndex] === vCurrCard) {
                    vRemoveArrayIndex++;
                    vCurrHandCards.splice(vIndex, 1);
                    vIndex--;
                }
            }
        }

        /**
         * 播放杠
         * @param {FL.PlayerOperationDesc} pCurrOp
         */
        private static playGang(pCurrOp: PlayerOperationDesc): void {
            // 杠的牌
            let vGangCardValue: number = pCurrOp.opValue1 & 0xff;

            // 杠
            let vPlayerTableOperationMsg: PlayerTableOperationMsg = new PlayerTableOperationMsg();
            vPlayerTableOperationMsg.operation = pCurrOp.opValue2;

            vPlayerTableOperationMsg.player_table_pos = pCurrOp.tablePos;
            vPlayerTableOperationMsg.opValue = vGangCardValue | (vGangCardValue << 8) | (vGangCardValue << 16) | (vGangCardValue << 24);
            vPlayerTableOperationMsg.card_value = pCurrOp.opValue1;
            vPlayerTableOperationMsg.cardLeftNum = pCurrOp.cardLeftNum;
            vPlayerTableOperationMsg.chuOffset = parseInt(pCurrOp.opStr);
            this._mjProxy.exePlayerTableOperationMsg(vPlayerTableOperationMsg);

            // 明杠要从已经打出的牌中拿走一张牌
            if (pCurrOp.opValue2 === GameConstant.MAHJONG_OPERTAION_MING_GANG) {
                let vPlayerOperationNotifyMsg: PlayerOperationNotifyMsg = new PlayerOperationNotifyMsg();
                vPlayerOperationNotifyMsg.operation = GameConstant.MAHJONG_OPERTAION_REMOE_CHU_CARD;
                vPlayerOperationNotifyMsg.player_table_pos = parseInt(pCurrOp.opStr);
                vPlayerOperationNotifyMsg.cardLeftNum = pCurrOp.cardLeftNum;
                this._mjProxy.exePlayerOperationNotifyMsg(vPlayerOperationNotifyMsg);
                // 删除三张手里的牌
                this.removePlayerHandCard(pCurrOp.tablePos, [vGangCardValue, vGangCardValue, vGangCardValue]);
            } else if (pCurrOp.opValue2 === GameConstant.MAHJONG_OPERTAION_AN_GANG) {
                // 删除四张手里的牌
                this.removePlayerHandCard(pCurrOp.tablePos, [vGangCardValue, vGangCardValue, vGangCardValue, vGangCardValue]);
            } else if (pCurrOp.opValue2 === GameConstant.MAHJONG_OPERTAION_BU_GANG) {
                // 删除一张手里的牌
                this.removePlayerHandCard(pCurrOp.tablePos, [vGangCardValue]);
            }

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
            this._mjProxy.exePlayerTableOperationMsg(vPlayerTableOperationMsg);
        }

        /**
         * 播放胡
         * @param {FL.PlayerOperationDesc} pCurrOp
         */
        private static playHu(pCurrOp: PlayerOperationDesc): void {
            let vPlayerOperationNotifyMsg: PlayerOperationNotifyMsg = new PlayerOperationNotifyMsg();
            vPlayerOperationNotifyMsg.operation = GameConstant.MAHJONG_OPERTAION_PLAYER_HU_CONFIRMED;
            vPlayerOperationNotifyMsg.player_table_pos = pCurrOp.tablePos;
            vPlayerOperationNotifyMsg.target_card = pCurrOp.opValue1;
            vPlayerOperationNotifyMsg.cardLeftNum = pCurrOp.cardLeftNum;
            this._mjProxy.exePlayerOperationNotifyMsg(vPlayerOperationNotifyMsg);
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
            this._mjProxy.exePlayerTableOperationMsg(vPlayerTableOperationMsg);
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
            this._mjProxy.exePlayerZuoLaPaoNotifyMsgAck(vPlayerZuoLaPaoNotifyMsgAck);
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
            this._mjProxy.exePlayerXiaMaValueNotifyMsg(vPlayerXiaMaValueNotifyMsg);
        }

        /**
         * 转转麻将玩法 播放中鸟
         * @param {FL.PlayerOperationDesc} pCurrOp
         */
        private static playZhongNiao(pCurrOp: PlayerOperationDesc): void {
            // let vPlayerXiaMaValueNotifyMsg:PlayerXiaMaValueNotifyMsg = new PlayerXiaMaValueNotifyMsg();
            // vPlayerXiaMaValueNotifyMsg.tablePositons = [];
            // vPlayerXiaMaValueNotifyMsg.xiaMaValues = [];
            // vPlayerXiaMaValueNotifyMsg.tablePositons.push(pCurrOp.tablePos);
            // vPlayerXiaMaValueNotifyMsg.xiaMaValues.push(pCurrOp.vlist[0]);
            // this._mjProxy.exePlayerXiaMaValueNotifyMsg(vPlayerXiaMaValueNotifyMsg);
            MvcUtil.send(MJGameModule.MJGAME_PLAY_ZHONG_NIAO, pCurrOp.vlist);
        }

    }

}