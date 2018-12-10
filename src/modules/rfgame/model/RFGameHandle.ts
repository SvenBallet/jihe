module FL {
    export class RFGameHandle {
        /**
         * 处理游戏开始数据
         */
        public static handleStartData() {
            let msg = this.getGameStartMsg();
            if (!msg) return;
            let info = msg.playerInfos;
            let vMyTablePos = msg.myTablePos;
            RFGameData.playerCardsData = {};
            //处理牌桌上玩家的数据
            for (let i = 0; i < info.length; ++i) {
                RFGameData.playerCardsData[info[i].tablePos] = this.getCardData(info[i].handCards);
                if (info[i].isChuOnce) {
                    //表示是出过牌的，断线重连
                    let cardsData = <ICardsData>{};
                    cardsData.data = this.getCardData(info[i].lastChuCards);
                    cardsData.type = 0;
                    cardsData.value = 0;
                    if (info[i].handCardNum == 1) {
                        //表示报单
                        cardsData.type = ECardEffectType.SingleEnd;
                    }
                    // if (!info[i].lastChuCards.length) {
                    //     //表示要不起
                    // }
                    RFGameData.playerLastCards[info[i].tablePos] = cardsData;
                }
            }
        }

        public static getNextPokerGameStartPlayerInfo(tablePos:number): PokerGameStartPlayerInfo {
            let vNextPos: number = this.getNextPos(tablePos);
            return this.getPokerGameStartPlayerInfo(vNextPos);
        }

        public static getNextPos(tablePos:number):number { 
            let afterOperationPlayerPos = tablePos+1;
            if (afterOperationPlayerPos >= this.getGameStartMsg().playerInfos.length) { 
                afterOperationPlayerPos = 0;
            }
            return afterOperationPlayerPos;
        }

        public static getPokerGameStartPlayerInfo(tablePos:number): PokerGameStartPlayerInfo {
            let vPokerStartCircleGameMsgAck: PokerStartCircleGameMsgAck = this.getGameStartMsg();
            let vPlayerInfos: Array<PokerGameStartPlayerInfo> = vPokerStartCircleGameMsgAck.playerInfos;
            for (let vIndex:number = 0; vIndex < vPlayerInfos.length; ++vIndex) {
                if (vPlayerInfos[vIndex].tablePos == tablePos) {
                    return vPlayerInfos[vIndex];
                }
            }
        }

        // //获得出牌的游戏内数据
        // public static getChuCardsData(pattern: ECardPatternType, data: number[], chuPos: number) {
        //     let cardsData = <ICardsData>{};
        //     cardsData.data = this.getCardData(data);
        //     //处理出牌牌型效果
        //     cardsData.type = ECardEffectType[ECardEffectType[pattern]];
        //     //处理出牌效果对应资源值


        //     let chuCardData = <IChuCardData>{};
        //     chuCardData.chuPos = chuPos;
        //     return chuCardData;
        // }

        // //获得对应资源值
        // public static getCardResValue(type, data: ICardData[]) {
        //     let value;
        //     if (type == ECardEffectType.Single
        //         || type == ECardEffectType.Double
        //         || type == ECardEffectType.Zhadan) {
        //         value = data[0].value;
        //     }
        // }

        //获得卡牌游戏内数据
        public static getCardData(data: number[]): ICardData[] {
            let cardArr = [];
            for (let j = data.length - 1; j >= 0; --j) {
                let carddata = <ICardData>{};
                carddata.id = data[j];
                let value = (data[j] >> 4) & 0xF;
                carddata.value = value;
                let color = data[j] & 0xF;
                if (value == 15) {
                    //大王
                    color = ECardIconType.JokerL;
                } else if (value == 14) {
                    //小王
                    color = ECardIconType.JokerS;
                }
                carddata.type = ECardIconType[ECardIconType[color]];
                cardArr.push(carddata);
            }
            return cardArr;
        }

        public static getSendProsCounterNum(sendProsCounterKey: string): number {
            let vLocalStorage = egret.localStorage;
            let vSendProsCounter = vLocalStorage.getItem(sendProsCounterKey);
            if (vSendProsCounter) {
                return parseInt(vSendProsCounter.split(":")[1]);
            }
        }

        public static addOneSendProsCounterNum(sendProsCounterKey: string): void {
            let vLocalStorage = egret.localStorage;
            let vSendProsCounter = vLocalStorage.getItem(sendProsCounterKey);
            if (vSendProsCounter) {
                let vCurrNum: number = parseInt(vSendProsCounter.split(":")[1]);
                vLocalStorage.setItem(sendProsCounterKey, vSendProsCounter.split(":")[0] + ":" + (vCurrNum + 1));
            }
            // else {
            //     vLocalStorage.setItem(sendProsCounterKey, vSendProsCounter + ":1");
            // }
        }

        public static removeGameLocalData(): void {
            //移除发送道具次数缓存
            egret.localStorage.removeItem("sendProsCounter0");
            egret.localStorage.removeItem("sendProsCounter1");
            egret.localStorage.removeItem("sendProsCounter2");
            egret.localStorage.removeItem("sendProsCounter3");
        }

        /**
         * 获得牌局开始信息
         * @returns {FL.gameStartMsg}
         */
        public static getGameStartMsg(): PokerStartCircleGameMsgAck {
            return RFGameData.gameStartMsg;
        }

        /**
         * 获得庄玩家方向
         * @returns {FL.PZOrientation}
         */
        public static getDealerOrientation(): PZOrientation {

            // return this.getPZOrientation(RFGameData.gameStartMsg.dealerPos);
            return;
        }

        /**
         * 通过牌桌位置获取方向
         * @param {number} pTablePos
         * @returns {FL.PZOrientation}
         */
        public static getPZOrientation(pTablePos: number): PZOrientation {
            if (!RFGameData.requestStartGameMsgAck) {
                return;
            }
            //我的桌子位置
            let vMyTablePos: number = RFGameData.requestStartGameMsgAck.playerPos;
            if (vMyTablePos === pTablePos) {
                return PZOrientation.DOWN;
            }
            //牌桌人数
            let vGameMaxNum: number = RFGameData.gameMaxNum;
            if (vGameMaxNum === 2) {
                return PZOrientation.UP;
            }
            //获得左边的坐标
            let vLeftTablePos: number = this.getTablePos(PZOrientation.LEFT);
            if (vLeftTablePos === pTablePos) {
                return PZOrientation.LEFT;
            } else {
                if (vGameMaxNum === 3) {
                    return PZOrientation.RIGHT;
                } else {
                    //获得右边坐标
                    let vRightTablePos: number = this.getTablePos(PZOrientation.RIGHT);
                    if (vRightTablePos === pTablePos) {
                        return PZOrientation.RIGHT;
                    } else {
                        return PZOrientation.UP;
                    }
                }
            }
        }

        /**
         * 通过方向获取牌桌位置
         * @param {FL.PZOrientation} pPZOrientation
         * @returns {number} 负数则表示这个方向上没有位置，不能坐人
         */
        public static getTablePos(pPZOrientation: PZOrientation): number {
            if (!RFGameData.requestStartGameMsgAck) {
                return;
            }
            //下面永远是自己
            if (pPZOrientation === PZOrientation.DOWN) {
                return RFGameData.requestStartGameMsgAck.playerPos;
            }
            //牌桌人数
            let vGameMaxNum: number = RFGameData.gameMaxNum;
            //处理2人麻将
            if (vGameMaxNum === 2) {
                if (pPZOrientation === PZOrientation.LEFT || pPZOrientation === PZOrientation.RIGHT) {
                    //2人麻将只有上面
                    return -1;
                } else {
                    return RFGameData.requestStartGameMsgAck.playerPos === 0 ? 1 : 0;
                }
            }
            if (vGameMaxNum === 3) {
                if (pPZOrientation === PZOrientation.UP) {
                    //3人麻将只有左右
                    return -1;
                }
            }
            //位置距离
            let vPosDistance: number = 0;
            if (pPZOrientation === PZOrientation.LEFT) {
                vPosDistance = -1;
            } else if (pPZOrientation === PZOrientation.RIGHT) {
                vPosDistance = 1;
            } else if (pPZOrientation === PZOrientation.UP) {
                vPosDistance = 2;
            }
            //我的桌子位置
            let vMyTablePos: number = RFGameData.requestStartGameMsgAck.playerPos;
            //计算方向对应的牌桌索引
            let vResultPos: number = vMyTablePos + vPosDistance;
            if (vResultPos >= vGameMaxNum) {
                vResultPos -= vGameMaxNum;
            } else if (vResultPos < 0) {
                vResultPos += vGameMaxNum;
            }
            return vResultPos;
        }

        public static getRequestStartGameMsgAck() : any {
            return RFGameData.requestStartGameMsgAck;
        }

        /**
         * 获得游戏中的玩家信息
         * @param {FL.PZOrientation} pPZOrientation
         * @returns {FL.GamePlayer}
         */
        public static getGamePlayerInfo(pPZOrientation: PZOrientation): GamePlayer {
            let vPZOrientationTablePos: number = this.getTablePos(pPZOrientation);
            if (vPZOrientationTablePos === -1) {
                return null;
            } else {
                return RFGameData.playerInfo[vPZOrientationTablePos];
            }
        }

        /**
         * 更新游戏中的玩家信息
         * @param {FL.GamePlayer} player
         * @returns {{orientation: FL.PZOrientation; isAdd: boolean}}
         */
        public static setGamePlayerInfo(player: GamePlayer): {orientation:PZOrientation, isAdd:boolean} {
            if (!player) return;
            let pzOrientation: PZOrientation = this.getPZOrientation(player.tablePos);
            let vIsAdd: boolean = false;
            if (!RFGameData.playerInfo[player.tablePos]) {
                vIsAdd = true;
            }
            RFGameData.playerInfo[player.tablePos] = player;
            return {orientation:pzOrientation, isAdd:vIsAdd};
        }

        /**
         * 获得玩家数组
         * @returns {FL.GamePlayer[]}
         */
        public static getGamePlayerArray(): GamePlayer[] {
            let vResultArray: GamePlayer[] = [];
            if (RFGameData.playerInfo[0]) vResultArray.push(RFGameData.playerInfo[0]);
            if (RFGameData.playerInfo[1]) vResultArray.push(RFGameData.playerInfo[1]);
            if (RFGameData.playerInfo[2]) vResultArray.push(RFGameData.playerInfo[2]);
            if (RFGameData.playerInfo[3]) vResultArray.push(RFGameData.playerInfo[3]);
            return vResultArray;
        }

        /**
         * 触摸点击手里牌的开关，只有开关打开才能操作
         * @type {FL.TouchSwitch}
         */
        public static touchHandCardSwitch: TouchSwitch = new TouchSwitch();


        /**
         * 获取玩家Gps数据
         * @param {FL.PZOrientation} pPZOrientation
         * @returns {FL.NewUpdateGPSPositionMsgAck}
         */
        public static getPlayerGPS(pPZOrientation: PZOrientation): NewUpdateGPSPositionMsgAck {
            let vPZOrientationTablePos: number = this.getTablePos(pPZOrientation);
            if (vPZOrientationTablePos === -1) {
                return null;
            } else {
                return RFGameData.playerGps[vPZOrientationTablePos];
            }
        }

        /**
         * 获得当前房间最大玩家数量
         * @returns {number}
         */
        public static getRoomPlayerMaxNum(): number {
            return RFGameData.requestStartGameMsgAck.playersNumber;
        }


        /**
         * 是否是房主
         * @param {FL.PZOrientation} pzOrientation
         * @returns {boolean}
         */
        public static isRoomOwner(pzOrientation: PZOrientation): boolean {
            let vSimplePlayer: GamePlayer = this.getGamePlayerInfo(pzOrientation);
            return this.getCreatePlayerID() === vSimplePlayer.playerID;
        }


        /**
         * 是否是房主
         * @param {FL.GamePlayer} pSimplePlayer
         * @returns {boolean}
         */
        public static isRoomOwner2(pSimplePlayer: GamePlayer): boolean {
            if (pSimplePlayer) {
                return this.getCreatePlayerID() === pSimplePlayer.playerID;
            } else {
                return false;
            }
        }

        /**
         * 获得房间创建者ID
         * @returns {string}
         */
        public static getCreatePlayerID(): string {
            return RFGameData.requestStartGameMsgAck.createPlayerID;
        }

        /**
         * 是否房费均摊
         * @returns {boolean}
         */
        public static isMorePlayerPay(): boolean {
            return RFGameData.requestStartGameMsgAck.payType === 1;
        }

        /**
         * 是否重播，回放
         * @returns {boolean}
         */
        public static isReplay(): boolean {
            return RFGameData.isReplay;
        }

        /**
         * 是否是vip房间，不是则是金币场
         * @returns {boolean}
         */
        public static isVipRoom(): boolean {
            return RFGameData.requestStartGameMsgAck.vipRoomID !== 0;
        }

        /**
         * 是否断线重连
         * @returns {boolean}
         */
        public static isOfflineRecover(): boolean {
            let vGameStartMsg: PokerStartCircleGameMsgAck = RFGameData.gameStartMsg;
            let isOff = false;
            let info = vGameStartMsg.playerInfos;
            for (let i = 0; i < info.length; ++i) {
                if (info[i].isChuOnce) {//有人出过牌，必定是断线重连
                    isOff = true;
                    break;
                }
            }
            return isOff;
        }

        /**
        * 是否立马打开游戏结束面板
        * @returns {boolean}
        */
        public static isOpenGameOverView(): boolean {
            if (!RFGameHandle.isVipRoom()) {
                return true;
            }
            return false;
        }


        /**
         * 获得游戏状态
         * @returns {FL.EGameState}
         */
        public static getGameState(): EGameState {
            return RFGameData.gameState;
        }

        /**
         * 设置游戏状态
         * @param {FL.EGameState} pRFGameState
         */
        public static setGameState(pRFGameState: EGameState): void {
            RFGameData.gameState = pRFGameState;
        }

        /**
         * 获得当前局数
         * @returns {number}
         */
        public static getCurrentHand(): number {
            return RFGameData.requestStartGameMsgAck.currPlayCount;
        }

        /**
         * 获得总局数
         */
        public static getTotalHand(): number {
            return RFGameData.requestStartGameMsgAck.totalPlayCount;
        }

        /**
         * 是否可以离开房间
         * @returns {boolean}
         */
        public static isCanLeaveRoom(): boolean {
            return RFGameData.requestStartGameMsgAck.isCanLeaveRoom;
        }

        /**
         * 获得剩余局数，即剩余游戏次数
         * @returns {number}
         */
        public static getRemainGameCount(): number {
            // let vRequestStartGameMsgAck:RequestStartGameMsgAck = RFGameData.requestStartGameMsgAck;
            return RFGameData.requestStartGameMsgAck.totalPlayCount - RFGameData.requestStartGameMsgAck.currPlayCount;
        }

        /**
      * 获取当前房间最大游戏人数
      */
        public static getGameMaxNum() {
            return RFGameData.gameMaxNum;
        }


        /**
         * 获得玩家操作时间
         * @returns {number}
         */
        public static getPlayerOperationTime(): number {
            // return RFGameData.gameStartMsg.playerOperationTime;
            return RFGameData.playerOpTime;
        }

        /**
         * 获得玩法详细描述
         * @param {number} playWay
         * @param {number} playerNum
         * @returns {string}
         */
        public static getWanfaDescStr(mainGamePlayRule?: number, minorGamePlayRuleList?: Array<number>, playerNum?: number): string {
            let vDesc = this.getWanfaSubDescStr(mainGamePlayRule, minorGamePlayRuleList, playerNum);
            if (this.isMorePlayerPay()) {
                vDesc += "\n房费均摊"
            }
            return vDesc;
        }

        public static getWanfaSubDescStr(mainGamePlayRule?: number, minorGamePlayRuleList?: Array<number>, playerNum?: number): string {
            let vWanfaDescStr: string = this.getWanfaSubDescStrNoPersonNum(mainGamePlayRule, minorGamePlayRuleList);
            // 人数
            if (playerNum) {
                vWanfaDescStr += playerNum + "人";
            } else {
                vWanfaDescStr += RFGameData.requestStartGameMsgAck.playersNumber + "人";
            }
            return vWanfaDescStr;
        }

        /**
         * 获得玩法字符串 房间号 + 玩法 或者 金币场 + 玩法
         * @returns {string}
         */
        public static getRoomAndWanfaStr(): string {
            let vRoomAndWanfaInfoText: string = "";
            let vVipTableID: number = RFGameData.requestStartGameMsgAck.vipRoomID;
            if (vVipTableID === 0) {
                vRoomAndWanfaInfoText += this.getCardGameNameText();
                vRoomAndWanfaInfoText += " 金币场"

            } else {
                if (RFGameData.requestStartGameMsgAck.teaHouseId) {
                    vRoomAndWanfaInfoText += this.getCardGameNameText();
                    vRoomAndWanfaInfoText += " 茶楼" + RFGameData.requestStartGameMsgAck.teaHouseId;
                    vRoomAndWanfaInfoText += " " + RFGameData.requestStartGameMsgAck.teaHouseLayer;
                    vRoomAndWanfaInfoText += "楼" + RFGameData.requestStartGameMsgAck.teaHouseDesk + "桌";
                    // vRoomAndWanfaInfoText += " 房号" + vVipTableID;

                } else {
                    vRoomAndWanfaInfoText += this.getCardGameNameText();
                    // vRoomAndWanfaInfoText += " 房号" + vVipTableID;
                }
            }
            return vRoomAndWanfaInfoText;
        }

        /**
         * 获得扑克游戏名字文本
         * @param {number} playWay
         * @returns {string}
         */
        public static getCardGameNameText(mainGamePlayRule?: number): string {
            if (!mainGamePlayRule) {
                mainGamePlayRule = RFGameData.requestStartGameMsgAck.mainGamePlayRule;
            }
            if (mainGamePlayRule === ECardGamePlayWay.JING_DIAN_PAO_DE_KUAI) {
                return "经典跑得快";
            }
            if (mainGamePlayRule === ECardGamePlayWay.SHI_WU_ZHANG_PAO_DE_KUAI) {
                return "十五张跑得快";
            }
            return "";
        }

        /** 检查当前牌组类型是否一致 */
        public static checkCardType(cards: ICardData[], curType: ECardPatternType) {

            // let len = cards.length;
            // if (!len) return null;
            // let _value;//参考值
            // let isSame = true;//是否相同
            // let _sameNum;//相同的数量
            // let _nextNum;//相邻的数量
            // let type;
            // switch (len) {
            //     case 1:
            //         type = ECardEffectType.Single;
            //         break;
            //     case 2:
            //         if (cards[0].value == cards[1].value) {
            //             type = ECardEffectType.Double;
            //         } else
            //             type = null;
            //         break;
            //     case 3:
            //         _value = cards[0].value;
            //         cards.forEach(x => {
            //             if (x.value != _value) type = isSame = false;
            //         });
            //         if (!isSame) type = null;
            //         else type = ECardEffectType.Sandaiyi;
            //         break;
            //     case 4:
            //         _sameNum = 0;
            //         for (let i = cards.length - 1; i > 0; i--) {
            //             if (cards[i].value - cards[i - 1].value == 0) {
            //                 _sameNum++;
            //                 _value = cards[i].value;
            //             } else {
            //                 isSame = false;
            //             }
            //         }
            //         if (isSame) type = ECardEffectType.Zhadan;
            //         else {
            //             if (_sameNum == 3) {
            //                 type = ECardEffectType.Sandaiyi;
            //             } else type = null;
            //         }
            //         break;
            //     case 5:
            //         _sameNum = 0;
            //         _nextNum = 0;
            //         for (let i = cards.length - 1; i > 0; i--) {
            //             if (cards[i].value - cards[i - 1].value == 0) {
            //                 _sameNum++;
            //             } else if (cards[i].value - cards[i - 1].value == 1) {
            //                 _nextNum++;
            //             }
            //         }
            //         if (_nextNum == 4) type = ECardEffectType.Shunzi;
            //         else if (_sameNum == 3) type = ECardEffectType.Sandaier;
            //         else type = null;
            //         break;
            //     default:
            //         type = null;
            //         break;
            // }
        }

        /**
         * 没有玩家数量的描述
         * @param {number} mainGamePlayRule
         * @param {Array<number>} minorGamePlayRuleList
         * @returns {string}
         */
        public static getWanfaSubDescStrNoPersonNum(mainGamePlayRule?: number, minorGamePlayRuleList?: Array<number>): string {
            let vWanfaDescStr: string = "";
            if (!mainGamePlayRule) {
                mainGamePlayRule = RFGameData.requestStartGameMsgAck.mainGamePlayRule;
            }
            if (!minorGamePlayRuleList) {
                minorGamePlayRuleList = RFGameData.requestStartGameMsgAck.subGamePlayRuleList;
            }
            if (mainGamePlayRule === ECardGamePlayWay.JING_DIAN_PAO_DE_KUAI || mainGamePlayRule === ECardGamePlayWay.SHI_WU_ZHANG_PAO_DE_KUAI) {

                if (minorGamePlayRuleList.indexOf(ECardGameType.SHI_WU_ZHANG) >= 0 && mainGamePlayRule === ECardGamePlayWay.JING_DIAN_PAO_DE_KUAI) {
                    vWanfaDescStr += "十五张\n";
                }
                // else {
                //     vWanfaDescStr += "经典玩法\n";
                // }
                if (minorGamePlayRuleList.indexOf(ECardGameType.LOW_SPEED_MODE) >= 0) {
                    vWanfaDescStr += "普通模式\n";
                }
                if (minorGamePlayRuleList.indexOf(ECardGameType.QUICK_SPEED_MODE) >= 0) {
                    vWanfaDescStr += "快速模式\n";
                }
                if (minorGamePlayRuleList.indexOf(ECardGameType.HEI_TAO_SAN_FIRST) >= 0) {
                    vWanfaDescStr += "首局先出黑桃三\n";
                }
                if (minorGamePlayRuleList.indexOf(ECardGameType.HONG_TAO_SHI_ZHA_NIAO) >= 0) {
                    vWanfaDescStr += "红桃十扎鸟\n";
                }
                if (minorGamePlayRuleList.indexOf(ECardGameType.SHOW_REST_CARD_NUM) >= 0) {
                    vWanfaDescStr += "显示剩余牌数\n";
                } else {
                    vWanfaDescStr += "不显示剩余牌数\n";
                }
                // else {
                //     vWanfaDescStr += "随机\n";
                // }
                if (minorGamePlayRuleList.indexOf(ECardGameType.ZHA_DAN_BU_KE_CHAI) >= 0) {
                    vWanfaDescStr += "炸弹不可拆\n";
                }
                if (minorGamePlayRuleList.indexOf(ECardGameType.SI_GE_DAI_ER_PAI) >= 0) {
                    vWanfaDescStr += "允许4带2\n";
                }
                if (minorGamePlayRuleList.indexOf(ECardGameType.SI_GE_DAI_SAN_PAI) >= 0) {
                    vWanfaDescStr += "允许4带3\n";
                }
                if (minorGamePlayRuleList.indexOf(ECardGameType.SAN_GE_SHAO_DAI_CHU_WAN) >= 0) {
                    vWanfaDescStr += "三张可少带出完\n";
                }
                if (minorGamePlayRuleList.indexOf(ECardGameType.SAN_GE_SHAO_DAI_JIE_WAN) >= 0) {
                    vWanfaDescStr += "三张可少带接完\n";
                }
                if (minorGamePlayRuleList.indexOf(ECardGameType.FEI_JI_SHAO_DAI_CHU_WAN) >= 0) {
                    vWanfaDescStr += "飞机可少带出完\n";
                }
                if (minorGamePlayRuleList.indexOf(ECardGameType.FEI_JI_SHAO_DAI_JIE_WAN) >= 0) {
                    vWanfaDescStr += "飞机可少带接完\n";
                }
                // else {
                //     //vWanfaDescStr += "炸弹可拆\n";
                //     if (minorGamePlayRuleList.indexOf(ECardGameType.SI_GE_BU_DAI_PAI) >= 0) {
                //         vWanfaDescStr += "四个不能带牌\n";
                //     } else if (minorGamePlayRuleList.indexOf(ECardGameType.SI_GE_DAI_SAN_PAI) >= 0) {
                //         vWanfaDescStr += "四个能带三张牌\n";
                //     } else if (minorGamePlayRuleList.indexOf(ECardGameType.SI_GE_DAI_ER_PAI) >= 0) {
                //         vWanfaDescStr += "四个能带二张牌\n";
                //     }
                // }

            }
            return vWanfaDescStr;
        }

        /**
         * 初始化游戏本地数据
         */
        public static initGameLocalData(): void {
            let vTablePos: number = this.getTablePos(PZOrientation.DOWN);
            this.initSendProsCounter("sendProsCounter" + vTablePos);
        }

        private static initSendProsCounter(sendProsCounterKey: string): void {
            let vLocalStorage = egret.localStorage;
            let vSendProsCounter0 = vLocalStorage.getItem(sendProsCounterKey);
            if (vSendProsCounter0) {
                let vStrArray = vSendProsCounter0.split(":");
                if (this.getOnlyGameKey() !== vStrArray[0]) {
                    // egret.log(this.getOnlyGameKey());
                    // egret.log(vStrArray[0]);
                    vLocalStorage.setItem(sendProsCounterKey, this.getOnlyGameKey() + ":" + 0);
                }
            } else {
                vLocalStorage.setItem(sendProsCounterKey, this.getOnlyGameKey() + ":" + 0);
            }
        }

        private static getOnlyGameKey(): string {
            let vKey: string = "";
            let vSimplePlayerArray: GamePlayer[] = this.getGamePlayerArray();
            for (let vIndex: number = 0, vLength: number = vSimplePlayerArray.length; vIndex < vLength; ++vIndex) {
                let vOneSimplePlayer: GamePlayer = vSimplePlayerArray[vIndex];
                vKey += vOneSimplePlayer.playerID;
            }
            if (this.isVipRoom()) {
                vKey += this.getVipRoomId();
                vKey += this.getCreatePlayerID();
                vKey += this.getRemainGameCount();
            } else {
                // vKey += this.getDealerPos();
            }
            vKey += this.getTablePos(PZOrientation.DOWN);
            // egret.log(vKey);
            return vKey;
        }

        /**
       * 获得Vip房间分享Title
       * @returns {string}
       */
        public static getVipRoomShareTitle(): string {
            // let vMySimplePlayer:SimplePlayer = this.getGamePlayerInfo(PZOrientation.DOWN);
            // let vPlayerName:string = StringUtil.subStrSupportChinese(vMySimplePlayer.playerName, 8);
            // return "【"+vPlayerName+"】邀请你加入房间："+this.getVipRoomId()+"-【"+this.getMJGameNameText()+"】";
            // return GConf.Conf.gameName+" 房号:"+this.getVipRoomId()+" 玩法:"+this.getMJGameNameText();
            // if (roomId) {
            //     return GConf.Conf.gameName+" 房号:"+roomId;
            // } else {
            return GConf.Conf.gameName + " 房号:" + this.getVipRoomId();
            // }
        }

        /**
         * 获得Vip房间分享Title（代开房）
         * @param {number} roomId
         * @returns {string}
         */
        public static getAgentVipRoomShareTitle(roomId: number): string {
            // let vMySimplePlayer:SimplePlayer = this.getGamePlayerInfo(PZOrientation.DOWN);
            // let vPlayerName:string = StringUtil.subStrSupportChinese(vMySimplePlayer.playerName, 8);
            // return "【"+vPlayerName+"】邀请你加入房间："+this.getVipRoomId()+"-【"+this.getMJGameNameText()+"】";
            // return GConf.Conf.gameName+" 房号:"+this.getVipRoomId()+" 玩法:"+this.getMJGameNameText();
            return GConf.Conf.gameName + " 房号:" + roomId;
        }

        /**
        * 获得Vip房间分享描述（俱乐部开房）
        * @param {number} totalHand
        * @param {number} mainGamePlayRule
        * @param {number} mainGamePlayRule
        * @param {number} playerNum
        * @returns {string}
        */
        public static getClubVipRoomShareDesc(totalHand: number, mainGamePlayRule: number, minorGamePlayRuleList: Array<number>, playerNum: number): string {
            //俱乐部 跑得快 4局
            let vDesc: string = "俱乐部 ";
            // vDesc += this.getMJGameNameText(playWay) + " "+MJGameData.requestStartGameMsgAck.totalHand+"局，";
            vDesc += this.getCardGameNameText(mainGamePlayRule) + " " + totalHand + "局，";
            // vDesc += this.getMJGameNameText() + " ";
            vDesc += this.getWanfaSubDescStr(mainGamePlayRule, minorGamePlayRuleList, playerNum).replace(/\n/g, " ");
            // if (this.isMorePlayerPay()) {
            //     vDesc +=" 房费均摊"
            // }
            vDesc += "，速度来战!";
            return vDesc;
        }

        /**
         * 获得Vip房间分享描述（代开房）
         * @param {number} totalHand
         * @param {number} mainGamePlayRule
         * @param {number} mainGamePlayRule
         * @param {number} playerNum
         * @returns {string}
         */
        public static getAgentVipRoomShareDesc(totalHand: number, mainGamePlayRule: number, minorGamePlayRuleList: Array<number>, playerNum: number): string {
            //代开房 宿州麻将 4局
            let vDesc: string = "代开房 ";
            // vDesc += this.getMJGameNameText(playWay) + " "+MJGameData.requestStartGameMsgAck.totalHand+"局，";
            vDesc += this.getCardGameNameText(mainGamePlayRule) + " " + totalHand + "局，";
            // vDesc += this.getMJGameNameText() + " ";
            vDesc += this.getWanfaSubDescStr(mainGamePlayRule, minorGamePlayRuleList, playerNum).replace(/\n/g, " ");
            // if (this.isMorePlayerPay()) {
            //     vDesc +=" 房费均摊"
            // }
            vDesc += "，速度来战!";
            return vDesc;
        }


        /**
      * 获得Vip房间分享描述
      * @returns {string}
      */
        public static getVipRoomShareDesc(): string {
            //代开房 宿州麻将 4局
            let vRequestStartGameMsgAck = RFGameData.requestStartGameMsgAck;
            let vDesc: string = "";
            // if (this.isAgentCreateRoom()) {
            //     vDesc += "代开房 "
            // }
            if (vRequestStartGameMsgAck.createType === 1) {
                vDesc += "代开房 ";
            } else if (vRequestStartGameMsgAck.createType === 2) {
                vDesc += "俱乐部开房 ";
            }
            // vDesc += "房号："+this.getVipRoomId()+"，"+MJGameData.requestStartGameMsgAck.totalHand+"局，";
            vDesc += this.getCardGameNameText() + " " + vRequestStartGameMsgAck.totalPlayCount + "局，";
            // vDesc += this.getMJGameNameText() + " ";
            vDesc += this.getWanfaSubDescStr().replace(/\n/g, " ");
            if (this.isMorePlayerPay()) {
                vDesc += " 房费均摊"
            }
            vDesc += "，速度来战!";
            return vDesc;
        }

        /**
       * 获得VIP房间Id
       * @returns {string}
       */
        public static getVipRoomId(): string {
            if (!(RFGameData && RFGameData.requestStartGameMsgAck && RFGameData.requestStartGameMsgAck.vipRoomID)) {
                return "";
            }
            return "" + RFGameData.requestStartGameMsgAck.vipRoomID;
        }

        /**
      * 获得Vip房间结束分享Title
      * @returns {string}
      */
        public static getVipRoomOverShareTitle(): string {
            let vWinPlayer: VipRoomOverPlayer = this.getVipRoomOverWinPlayer();
            //设置分数
            let vScoreText: string;
            if (vWinPlayer.score > 0) {
                vScoreText = "+" + vWinPlayer.score;
            } else {
                vScoreText = "" + vWinPlayer.score;
            }
            // let vWinPlayerName: string = StringUtil.subStrSupportChinese(vWinPlayer.playerName, 8);
            // // return this.getMJGameNameText()+" "+this.getVipRoomId()+"房\n大赢家-"+vWinPlayerName+"："+vScoreText;
            // return GConf.Conf.gameName + " 房号:" + this.getVipRoomId() + "\n大赢家 " + vWinPlayerName + "：" + vScoreText;
            let vWinPlayerName: string = StringUtil.subStrSupportChinese(vWinPlayer.playerName, 8, "");
            // return this.getMJGameNameText()+" "+this.getVipRoomId()+"房\n大赢家-"+vWinPlayerName+"："+vScoreText;
            return GConf.Conf.gameName + " 房号:" + this.getVipRoomId() + "\n" + vWinPlayerName + "：" + vScoreText + "(大赢家)";
        }

        /**
        * 获得Vip房间结束大赢家信息
        * @returns {FL.VipRoomOverPlayer}
        */
        public static getVipRoomOverWinPlayer(): VipRoomOverPlayer {
            return RFGameData.vipRoomCloseMsg.roomOverPlayerInfos[RFGameData.vipRoomCloseMsg.winPos];
        }

        /**
        * 获得Vip房间结束分享内容
        * @returns {string}
        */
        public static getVipRoomOverShareDesc(): string {
            let vVipRoomCloseMsg: NewVipRoomOverSettleAccountsMsgAck = RFGameData.vipRoomCloseMsg;
            let vPlayerArray: Array<VipRoomOverPlayer> = vVipRoomCloseMsg.roomOverPlayerInfos;
            let vDescStr: string = "";
            for (let vIndex: number = 0, vLength: number = vPlayerArray.length; vIndex < vLength; ++vIndex) {
                let vCurrPlayer: VipRoomOverPlayer = vPlayerArray[vIndex];
                if (vCurrPlayer.tablePos !== vVipRoomCloseMsg.winPos) {
                    // vDescStr += StringUtil.subStrSupportChinese(vCurrPlayer.playerName, 8) + "：";
                    vDescStr += StringUtil.subStrSupportChinese(vCurrPlayer.playerName, 8, "") + "：";
                    if (vCurrPlayer.score > 0) {
                        vDescStr += "+" + vCurrPlayer.score;
                    } else {
                        vDescStr += "" + vCurrPlayer.score;
                    }
                    if (vIndex !== vLength - 1) {
                        vDescStr += "\n";
                    }
                }
            }
            return vDescStr;
        }

        //     /**
        //    * 获得庄玩家位置
        //    * @returns {number}
        //    */
        //     public static getDealerPos(): number {
        //         return RFGameData.gameStartMsg.;
        //     }

        /**
       * 重置游戏数据
       */
        public static resetGameData(): void {
            //清空玩家信息
            RFGameData.playerInfo = {};
            //清空gps信息
            RFGameData.playerGps = {};
            //清空玩家手牌数据
            RFGameData.playerCardsData = {};
            //清空玩家最后出牌数据
            RFGameData.playerLastCards = {};
            //置空
            RFGameData.gameStartMsg = null;
            RFGameData.gameOverMsgAck = null;
            RFGameData.vipRoomCloseMsg = null;
            RFGameData.pokerRefreshhistoryMsgAck = null;
            RFGameData.ScrollMsg = null;
        }

        public static getGameOverMsgAck(): PaoDeKuaiGameOverSettleAccountsMsgAck {
            return RFGameData.gameOverMsgAck;
        }

        public static getVipRoomCloseMsg(): NewVipRoomOverSettleAccountsMsgAck {
            return RFGameData.vipRoomCloseMsg;
        }

        public static getNewIntoGameTableMsgAck(): NewIntoGameTableMsgAck {
            return RFGameData.requestStartGameMsgAck;
        }
    }
}