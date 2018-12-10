module FL {
    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase - MJGameHandler
     * @Description:  //麻将游戏Handler
     * @Create: DerekWu on 2017/11/22 11:56
     * @Version: V1.0
     */
    export class MahjongHandler {

        /**
         * 通过方向获取牌桌位置
         * @param {FL.PZOrientation} pPZOrientation
         * @returns {number} 负数则表示这个方向上没有位置，不能坐人
         */
        public static getTablePos(pPZOrientation: PZOrientation): number {
            if (!MahjongData.requestStartGameMsgAck) {
                return;
            }
            //下面永远是自己
            if (pPZOrientation === PZOrientation.DOWN) {
                return MahjongData.requestStartGameMsgAck.playerPos;
            }
            //牌桌人数
            let vGameMaxNum: number = MahjongData.gameMaxNum;
            //处理2人麻将
            if (vGameMaxNum === 2) {
                if (pPZOrientation === PZOrientation.LEFT || pPZOrientation === PZOrientation.RIGHT) {
                    //2人麻将只有上面
                    return -1;
                } else {
                    return MahjongData.requestStartGameMsgAck.playerPos === 0 ? 1 : 0;
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
            let vMyTablePos: number = MahjongData.requestStartGameMsgAck.playerPos;
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
            return MahjongData.requestStartGameMsgAck;
        }

        /**
         * 获取当前房间最大游戏人数
         */
        public static getGameMaxNum() {
            return MahjongData.gameMaxNum;
        }

        /**
         * 通过牌桌位置获取方向
         * @param {number} pTablePos
         * @returns {FL.PZOrientation}
         */
        public static getPZOrientation(pTablePos: number): PZOrientation {
            if (!MahjongData.requestStartGameMsgAck) {
                return;
            }
            //我的桌子位置
            let vMyTablePos: number = MahjongData.requestStartGameMsgAck.playerPos;
            if (vMyTablePos === pTablePos) {
                return PZOrientation.DOWN;
            }
            //牌桌人数
            let vGameMaxNum: number = MahjongData.gameMaxNum;
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
         * 获得游戏中的玩家信息
         * @param {FL.PZOrientation} pPZOrientation
         * @returns {FL.GamePlayer}
         */
        public static getGamePlayerInfo(pPZOrientation: PZOrientation): GamePlayer {
            let vPZOrientationTablePos: number = this.getTablePos(pPZOrientation);
            if (vPZOrientationTablePos === -1) {
                return null;
            } else {
                return MahjongData.playerInfo[vPZOrientationTablePos];
            }
        }

        /**
         * 获取玩家Gps数据
         * @param {FL.PZOrientation} pPZOrientation
         * @returns {FL.UpdatePlayerGPSMsg}
         */
        public static getPlayerGPS(pPZOrientation: PZOrientation): NewUpdateGPSPositionMsgAck {
            let vPZOrientationTablePos: number = this.getTablePos(pPZOrientation);
            if (vPZOrientationTablePos === -1) {
                return null;
            } else {
                return MahjongData.playerGps[vPZOrientationTablePos];
            }
        }

        /**
         * 获得牌局开始信息
         * @returns {FL.gameStartMsg}
         */
        public static getGameStartMsg(): MahjongStartCircleGameMsgAck {
            return MahjongData.gameStartMsg;
        }

        /**
         * 是否听牌，主要用户断线重连的判断
         * @param {FL.PZOrientation} pzOrientation
         * @returns {boolean}
         */
        // public static isTing(pzOrientation: PZOrientation): boolean {
        //     let vTablePos: number = this.getTablePos(pzOrientation);
        //     if (vTablePos !== -1) {
        //         let vTingFlag: number = MahjongData.gameStartMsg.tingPlayers >> (vTablePos * 8) & 0xFF;
        //         return vTingFlag === 1;
        //     }
        // }

        /**
         * 获得玩家数组
         * @returns {FL.GamePlayer[]}
         */
        public static getGamePlayerArray(): GamePlayer[] {
            let vResultArray: GamePlayer[] = [];
            if (MahjongData.playerInfo[0]) vResultArray.push(MahjongData.playerInfo[0]);
            if (MahjongData.playerInfo[1]) vResultArray.push(MahjongData.playerInfo[1]);
            if (MahjongData.playerInfo[2]) vResultArray.push(MahjongData.playerInfo[2]);
            if (MahjongData.playerInfo[3]) vResultArray.push(MahjongData.playerInfo[3]);
            return vResultArray;
        }

        /**
         * 增加新玩家或者玩家离开桌子
         * @param {FL.PlayerGameOpertaionAckMsg} msg
         * @param {boolean} isAdd 是否是增加，不是则是离开桌子
         */
        public static addNewOrLeftTablePlayer(msg: PlayerGameOpertaionAckMsg, isAdd: boolean): void {
            // let vCurrPlayer: GamePlayer = MahjongData.playerInfo[msg.tablePos];
            // if (!vCurrPlayer) {
            //     vCurrPlayer = new GamePlayer();
            //     MahjongData.playerInfo[msg.tablePos] = vCurrPlayer;
            // }
            // vCurrPlayer.playerID = msg.playerID;
            // vCurrPlayer.playerName = msg.playerName;
            // vCurrPlayer.headImg = msg.headImg;
            // vCurrPlayer.headImgUrl = msg.targetPlayerName;
            // vCurrPlayer.sex = msg.sex;
            // vCurrPlayer.palyerIndex = msg.playerIndex;
            // vCurrPlayer.gold = msg.gold;
            // vCurrPlayer.tablePos = msg.tablePos;
            // vCurrPlayer.canFriend = msg.canFriend;
            // let vTempInTable = 1;
            // if (!isAdd) {
            //     if (MahjongData.requestStartGameMsgAck.vipRoomID !== 0) {
            //         //非金币场
            //         vTempInTable = 2;
            //     }
            // }
            // vCurrPlayer.inTable = vTempInTable; ///** 是否坐在桌子上，1：在桌上；0：在大厅或者离线；2：离开了  */
            // vCurrPlayer.ip = msg.ip;
            // if (this.getGameState() === EGameState.WAITING_START) {
            //     vCurrPlayer.gameState = GameConstant.PALYER_GAME_STATE_IN_TABLE_READY;
            // } else {
            //     vCurrPlayer.gameState = GameConstant.PALYER_GAME_STATE_IN_TABLE_PLAYING;
            // }
        }


        /**
         * 通过吃碰杠的牌列表，获得花牌列表
         * @param {Array<FL.CardDown>} cardDownArray
         * @returns {Array<number>}
         */
        public static getHuaCardArrayByCardDownArray(cardDownArray: Array<CardDown>): Array<number> {
            let vCardArray: Array<number> = new Array<number>();
            //再添加显示
            if (cardDownArray && cardDownArray.length > 0) {
                let vIndex: number = 0, vLength: number = cardDownArray.length, vCurrCardDown: CardDown,
                    vCardValue: number, vHuaValue: number;
                for (; vIndex < vLength; ++vIndex) {
                    vCurrCardDown = cardDownArray[vIndex];
                    if (vCurrCardDown.type === 0) {
                        //类型0是花牌
                        vCardValue = vCurrCardDown.cardValue;
                        vHuaValue = vCardValue & 0xFF;
                        if (vHuaValue !== 0) vCardArray.push(vHuaValue);
                        vHuaValue = (vCardValue >> 8) & 0xFF;
                        if (vHuaValue !== 0) vCardArray.push(vHuaValue);
                        vHuaValue = (vCardValue >> 16) & 0xFF;
                        if (vHuaValue !== 0) vCardArray.push(vHuaValue);
                        vHuaValue = vCardValue >> 24;
                        if (vHuaValue !== 0) vCardArray.push(vHuaValue);
                    }
                }
            }
            return vCardArray;
        }

        /**
         * 是否是vip房间，不是则是金币场
         * @returns {boolean}
         */
        public static isVipRoom(): boolean {
            return MahjongData.requestStartGameMsgAck.vipRoomID !== 0;
        }

        /**
         * 是否重播，回放
         * @returns {boolean}
         */
        public static isReplay(): boolean {
            return MahjongData.isReplay;
        }

        /**
         * 设置重播
         * @param {boolean} isReplay
         */
        // public static setIsReplay(isReplay:boolean): void {
        //     MahjongData.isReplay = isReplay;
        // }

        /**
         * 获得麻将游戏状态
         * @returns {FL.MJGameState}
         */
        public static getGameState(): EGameState {
            return MahjongData.mjGameState;
        }

        /**
         * 设置麻将游戏状态
         * @param {FL.MJGameState} pMJGameState
         */
        public static setGameState(pMJGameState: EGameState): void {
            MahjongData.mjGameState = pMJGameState;
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
        }

        public static removeGameLocalData(): void {
            //移除发送道具次数缓存
            egret.localStorage.removeItem("sendProsCounter0");
            egret.localStorage.removeItem("sendProsCounter1");
            egret.localStorage.removeItem("sendProsCounter2");
            egret.localStorage.removeItem("sendProsCounter3");
        }

        private static getOnlyGameKey(): string {
            let vKey: string = "";
            let vGamePlayerArray: GamePlayer[] = this.getGamePlayerArray();
            for (let vIndex: number = 0, vLength: number = vGamePlayerArray.length; vIndex < vLength; ++vIndex) {
                let vOneGamePlayer: GamePlayer = vGamePlayerArray[vIndex];
                vKey += vOneGamePlayer.playerID;
            }
            if (this.isVipRoom()) {
                vKey += this.getVipRoomId();
                vKey += this.getCreatePlayerID();
                vKey += this.getRemainGameCount();
            } else {
                vKey += this.getDealerPos();
            }
            vKey += this.getTablePos(PZOrientation.DOWN);
            // egret.log(vKey);
            return vKey;
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
            if (!MahjongData.playerInfo[player.tablePos]) {
                vIsAdd = true;
            }
            MahjongData.playerInfo[player.tablePos] = player;
            return {orientation:pzOrientation, isAdd:vIsAdd};
        }

        /**
         * 获得房间创建者ID
         * @returns {string}
         */
        public static getCreatePlayerID(): string {
            return MahjongData.requestStartGameMsgAck.createPlayerID;
        }

        /**
         * 是否是房主
         * @param {FL.PZOrientation} pzOrientation
         * @returns {boolean}
         */
        public static isRoomOwner(pzOrientation: PZOrientation): boolean {
            let vGamePlayer: GamePlayer = this.getGamePlayerInfo(pzOrientation);
            return this.getCreatePlayerID() === vGamePlayer.playerID;
        }

        /**
         * 是否是房主
         * @param {FL.GamePlayer} pGamePlayer
         * @returns {boolean}
         */
        public static isRoomOwner2(pGamePlayer: GamePlayer): boolean {
            if (pGamePlayer) {
                return this.getCreatePlayerID() === pGamePlayer.playerID;
            } else {
                return false;
            }
        }

        /**
         * 获得当前房间最大玩家数量
         * @returns {number}
         */
        public static getRoomPlayerMaxNum(): number {
            return MahjongData.requestStartGameMsgAck.playersNumber;
        }

        public static getCreateType(): number {
            return MahjongData.requestStartGameMsgAck.createType;
        }

        /**
         * 获得剩余局数，即剩余游戏次数
         * @returns {number}
         */
        public static getRemainGameCount(): number {
            // let vRequestStartGameMsgAck:RequestStartGameMsgAck = MahjongData.requestStartGameMsgAck;
            return MahjongData.requestStartGameMsgAck.totalPlayCount - MahjongData.requestStartGameMsgAck.currPlayCount;
        }

        /**
         * 获得当前局数
         * @returns {number}
         */
        public static getCurrentHand(): number {
            return MahjongData.requestStartGameMsgAck.currPlayCount;
        }

        /**
         * 获得当前局数
         * @returns {number}
         */
        public static getQuanNum(): number {
            return MahjongData.requestStartGameMsgAck.currPlayCount;
        }

        /**
         * 是否可以离开房间
         * @returns {boolean}
         */
        public static isCanLeaveRoom(): boolean {
            return MahjongData.requestStartGameMsgAck.isCanLeaveRoom;
        }

        /**
         * 获得玩家飘分信息
         * @param {FL.PZOrientation} pPZOrientation
         * @returns {number}
         */
        public static getPlayerPiaoFenInfo(pPZOrientation: PZOrientation): number {
            return MahjongData.piaoFenInfo[this.getTablePos(pPZOrientation)];
        }

        /**
         * 获取剩余牌数（未打出的牌）
         * @param {number} cardValue
         * @returns {number}
         */
        public static getRestCardNum(cardValue: number): number {
            let restCard: number;
            if (MahjongData.restCards[cardValue] == null) {
                restCard = 4;
            } else {
                restCard = MahjongData.restCards[cardValue];
            }
            return restCard;
        }

        /**
         * 设置剩余牌数（减去已打出的牌）
         * @param {number} cardValue
         * @param number
         */
        public static setRestCardNum(cardValue: number, number):void {

            MahjongData.restCards[cardValue] = MahjongHandler.getRestCardNum(cardValue)-number;

        }

        /**
         * 设置剩余牌数（加上已打出的牌，因为吃碰杠的时候会减掉）
         * @param {number} cardValue
         * @param number
         */
        public static addRestCardNum(cardValue: number, number):void {

            MahjongData.restCards[cardValue] = MahjongHandler.getRestCardNum(cardValue)+number;

        }

        /**
         * 获取动作选牌
         * @param {number} actionId
         * @returns {number}
         */
        public static getActionCard(actionId: number): number {
            return MahjongData.actionList[actionId];
        }

        /**
         * 获取听牌信息
         * @param {number} cardValue
         * @returns {Array<FL.MahjongTingInfo>}
         */
        public static getTingCardInfoList(cardValue: number): Array<MahjongTingInfo> {
            let tingCardInfoList: Array<MahjongSelectPlayCardTingInfo> = MahjongData.tingCardInfoList;
            if (!tingCardInfoList || tingCardInfoList.length === 0) {
                return null;
            }
            for (let i = 0, length = tingCardInfoList.length; i < length; ++i) {
                if (tingCardInfoList[i].selectPlayCard === cardValue) {
                    return tingCardInfoList[i].tingList;
                }
            }
            return null;
        }

        /**
         * 获得我已经补花的数量
         * @returns {number}
         */
        public static getMyBuhuaNum(): number {
            return MahjongData.myBuhuaNum;
        }

        /**
         * 增加我的补花数量
         * @param {number} addNum
         */
        public static addMyBuhuaNum(addNum: number): void {
            MahjongData.myBuhuaNum += addNum;
        }

        /**
         * 重置我的补花数量
         */
        public static resetMyBuhuaNum(): void {
            MahjongData.myBuhuaNum = 0;
        }

        /**
         * 获得玩家操作时间
         * @returns {number}
         */
        public static getPlayerOperationTime(): number {
            return MahjongData.playerOpTime;
        }

        /**
         * 获得庄玩家方向
         * @returns {FL.PZOrientation}
         */
        public static getDealerOrientation(): PZOrientation {
            return this.getPZOrientation(MahjongData.gameStartMsg.dealerPos);
        }

        /**
         * 获得庄玩家位置
         * @returns {number}
         */
        public static getDealerPos(): number {
            return MahjongData.gameStartMsg.dealerPos;
        }

        /**
         * 获得当前操作方向
         * @returns {FL.PZOrientation}
         */
        public static getCurrOperationOrientation(): PZOrientation {
            return MahjongData.currOperationOrientation;
        }

        /**
         * 设置当前操作方向
         * @returns {FL.PZOrientation}
         */
        public static setCurrOperationOrientation(pPZOrientation: PZOrientation): PZOrientation {
            return MahjongData.currOperationOrientation = pPZOrientation;
        }

        /**
         * 触摸点击手里牌的开关，只有开关打开才能操作
         * @type {FL.TouchSwitch}
         */
        public static touchHandCardSwitch: TouchSwitch = new TouchSwitch();

        /**
         * 获得剩余牌的绑定Id
         * @returns {number}
         */
        public static getCardLeftNumBindId(): number {
            return MahjongData.cardLeftNum.attrId;
        }

        /**
         * 获得剩余牌数量
         * @returns {number}
         */
        public static getCardLeftNum(): number {
            return MahjongData.cardLeftNum.value;
        }

        /**
         * 是否看得到其他玩家的暗杠
         * @returns {boolean}
         */
        public static isShowOtherPlayerAnGang(): boolean {
            let vSubGamePlayRuleList: Array<number> = MahjongData.requestStartGameMsgAck.subGamePlayRuleList;
            if (vSubGamePlayRuleList && vSubGamePlayRuleList.length > 0) {
                return vSubGamePlayRuleList.indexOf(MJGameSubRule.XIAN_SHI_AN_GANG) >= 0;
            }
            return false;
        }

        /**
         * 通过常量获得房间最大人数
         * @param {number} constant
         * @returns {number}
         */
        // public static getRoomMaxPlayerNumByConstant(constant:number): number {
        //     if (constant === GameConstant.GAME_PLAY_RULE_3_REN) {
        //         return 3;
        //     } else if (constant === GameConstant.GAME_PLAY_RULE_2_REN) {
        //         return 2;
        //     } else {
        //         return 4;
        //     }
        // }

        /**
         * 是否断线重连
         * @returns {boolean}
         */
        public static isOfflineRecover(): boolean {
            let vGameStartMsg: MahjongStartCircleGameMsgAck = MahjongData.gameStartMsg;
            let isOff = false;
            let info = vGameStartMsg.playerInfos;
            for (let i = 0; i < info.length; ++i) {
                if (info[i].chuCards.length > 0) {//有人出过牌，必定是断线重连
                    isOff = true;
                    break;
                }
            }
            return isOff;
        }

        /**
         * 是否连庄
         * @returns {boolean}
         */
        public static isDealerAgain(): boolean {
            return MahjongData.gameStartMsg.dealerPos === 1;
        }

        /**
         * 获得癞子 标志 牌
         * @returns {number}
         */
        public static getLaiziFlagCardNum(): number {
            return MahjongData.gameStartMsg.unused_0;
        }

        public static getLastChuCard(): number {
            return MahjongData.lastChuCard;
        }

        public static setLastChuCard(pCard:number): void {
            MahjongData.lastChuCard = pCard;
        }

        /**
         * 获得不能出的牌的名字，返回 非 null  则不能出
         * @param {number} pCard
         * @returns {string} 返回 非 null  则不能出
         */
        public static getNotChuCardName(pCard:number): string {
            let vNoPlayCards: Array<number> = MahjongData.gameStartMsg.noPlayCards;
            if (vNoPlayCards && vNoPlayCards.length > 0) {
                let vIndex: number = vNoPlayCards.indexOf(pCard);
                if (vIndex !== -1) {
                    return MahjongData.gameStartMsg.noPlayCardNames[vIndex];
                }
            }
            return null;
        }

        /**
         * 癞子颜色过滤器
         * @type {egret.ColorMatrixFilter}
         */
        // public static laiziColorFilter = new egret.ColorMatrixFilter([
        //     0, 0, 0, 0, 0,
        //     0, 1, 0, 0, 0,
        //     0, 0, 0, 0, 0,
        //     0, 0, 0, 1, 0
        // ]);
        public static laiziColorFilter = null;

        /**
         * 听颜色过滤器
         */
        public static tingColorFilter = new egret.ColorMatrixFilter([
            0, 0, 0, 0, 0,
            0, 1, 0, 0, 0,
            0, 0, 0, 0, 0,
            0, 0, 0, 1, 0
        ]);

        /**
         * 游戏结束吃碰杠中 碰谁的标志
         * @type {egret.ColorMatrixFilter}
         */
        public static gameOverCardDownChuOffsetColorFilter = new egret.ColorMatrixFilter([
            0.7, 0, 0, 0, 0,
            0, 0.7, 0, 0, 0,
            0, 0, 0.7, 0, 0,
            0, 0, 0, 1, 0
        ]);

        /**
         * 花牌颜色过滤器
         * @type {egret.ColorMatrixFilter}
         */
        public static huaColorFilter = new egret.ColorMatrixFilter([
            0, 0, 0, 0, 0,
            0, 1, 0, 0, 0,
            0, 0, 0, 0, 0,
            0, 0, 0, 1, 0
        ]);

        /**
         * 回放中新摸进来的牌颜色过滤器
         * @type {egret.ColorMatrixFilter}
         */
        public static replayNewCardColorFilter = new egret.ColorMatrixFilter([
            1, 0, 0, 0, 0,
            0, 1, 0, 0, 0,
            0, 0, 0, 0, 0,
            0, 0, 0, 1, 0
        ]);

        /**
         * 是否是癞子
         * @param {number} cd
         * @returns {boolean}
         */
        public static isLaiZi(cd: number): boolean {
            let vLaiZiCards: Array<number> = MahjongData.gameStartMsg.laiZiCards;
            if (vLaiZiCards && vLaiZiCards.length > 0) {
                return vLaiZiCards.indexOf(cd) >= 0;
            }
            return false;
        }

        /**
         * 获取麻将动作图片资源名字
         * @param {number} action
         * @returns {string}
         */
        public static getActionImageResName(action: number): string {
            switch (action) {
                case MahjongActionEnum.GUO:
                    return "btnGuo_png";
                case MahjongActionEnum.CHI:
                    return "btnCanChi_png";
                case MahjongActionEnum.PENG:
                    return "btnCanPeng_png";
                case MahjongActionEnum.QIANG_GANG_HU:
                case MahjongActionEnum.JIE_PAO:
                case MahjongActionEnum.ZI_MO:
                    return "btnCanHu_png";
                case MahjongActionEnum.BAO_TING:
                    return "btnChi_png";  //TODO 缺少听图片
                case MahjongActionEnum.MING_GANG:
                case MahjongActionEnum.BU_GANG:
                case MahjongActionEnum.AN_GANG:
                case MahjongActionEnum.CHANG_SHA_AN_GANG:
                case MahjongActionEnum.CHANG_SHA_MING_GANG:
                case MahjongActionEnum.CHANG_SHA_BU_GANG:
                    return "btnCanGang_png";
                case MahjongActionEnum.CHANG_SHA_AN_BU_ZHANG:
                case MahjongActionEnum.CHANG_SHA_MING_BU_ZHANG:
                case MahjongActionEnum.CHANG_SHA_BU_BU_ZHANG:
                    return "btnCanBu_png";
                case MahjongActionEnum.CHANG_SHA_DASIXI:
                    return "btnDaSiXi_png";
                case MahjongActionEnum.CHANG_SHA_DASIXI_ZHONGTU:
                    return "btnZhongTuSiXi_png";
                case MahjongActionEnum.CHANG_SHA_BANBANHU:
                    return "btnBanBanHu_png";
                case MahjongActionEnum.CHANG_SHA_QUEYISE:
                    return "btnQueYiSe_png";
                case MahjongActionEnum.CHANG_SHA_LIULIUSHUN:
                case MahjongActionEnum.CHANG_SHA_LIULIUSHUN_ZHONGTU:
                    return "btnLiuLiuShun_png";
                case MahjongActionEnum.CHANG_SHA_YIZHIHUA:
                    return "btnYiZhiHua_png";
                case MahjongActionEnum.CHANG_SHA_3TONG:
                    return "btnSanTong_png";
                case MahjongActionEnum.CHANG_SHA_JIEJIEGAO:
                    return "btnJieJieGao_png";
                default:
                    return "";
            }
        }

        /**
         * 获取麻将动作图片资源宽度
         * @param {number} action
         * @returns {string}
         */
        public static getActionImageResWidth(action: number): number {
            switch (action) {
                case MahjongActionEnum.CHANG_SHA_DASIXI:
                    return 244;
                case MahjongActionEnum.CHANG_SHA_DASIXI_ZHONGTU:
                    return 369;
                case MahjongActionEnum.CHANG_SHA_BANBANHU:
                    return 244;
                case MahjongActionEnum.CHANG_SHA_QUEYISE:
                    return 244;
                case MahjongActionEnum.CHANG_SHA_LIULIUSHUN:
                case MahjongActionEnum.CHANG_SHA_LIULIUSHUN_ZHONGTU:
                    return 244;
                case MahjongActionEnum.CHANG_SHA_YIZHIHUA:
                    return 244;
                case MahjongActionEnum.CHANG_SHA_3TONG:
                    return 172;
                case MahjongActionEnum.CHANG_SHA_JIEJIEGAO:
                    return 244;
                default:
                    return 144;
            }
        }

        /**
         * 获得玩法字符串 房间号 + 玩法 或者 金币场 + 玩法
         * @returns {string}
         */
        public static getRoomAndWanfaStr(): string {
            let vRoomAndWanfaInfoText: string = "";
            let vvipRoomID: number = MahjongData.requestStartGameMsgAck.vipRoomID;
            if (vvipRoomID === 0) {
                vRoomAndWanfaInfoText += this.getMJGameNameText();
                vRoomAndWanfaInfoText += " 金币场"

            } else {
                if (MahjongData.requestStartGameMsgAck.teaHouseId) {
                    vRoomAndWanfaInfoText += this.getMJGameNameText();
                    vRoomAndWanfaInfoText += " 茶楼" + MahjongData.requestStartGameMsgAck.teaHouseId;
                    vRoomAndWanfaInfoText += " " + MahjongData.requestStartGameMsgAck.teaHouseLayer;
                    vRoomAndWanfaInfoText += "楼" + MahjongData.requestStartGameMsgAck.teaHouseDesk + "桌";
                    // vRoomAndWanfaInfoText += "楼99桌";
                    // vRoomAndWanfaInfoText += " 房号" + vvipRoomID;

                } else {
                    vRoomAndWanfaInfoText += this.getMJGameNameText();
                    // vRoomAndWanfaInfoText += " 房号" + vvipRoomID;
                }
            }
            return vRoomAndWanfaInfoText;
        }

        /**
         * 是否茶馆桌子
         * @returns {boolean}
         */
        public static isTeaHouseTable(): boolean {
            return MahjongData.requestStartGameMsgAck.teaHouseId > 0;
        }

        /**
         * 获得VIP房间Id
         * @returns {string}
         */
        public static getVipRoomId(): string {
            if (!(MahjongData && MahjongData.requestStartGameMsgAck && MahjongData.requestStartGameMsgAck.vipRoomID)) {
                return "";
            }
            return "" + MahjongData.requestStartGameMsgAck.vipRoomID;
        }

        /**
         * 获得主玩法规则
         * @returns {number}
         */
        public static getMainGamePlayRule(): number {
            return MahjongData.requestStartGameMsgAck.mainGamePlayRule;
        }

        /**
         * 获得麻将游戏名字文本
         * @param {number} playWay
         * @returns {string}
         */
        public static getMJGameNameText(mainGamePlayRule?: number): string {
            if (!mainGamePlayRule) {
                mainGamePlayRule = MahjongData.requestStartGameMsgAck.mainGamePlayRule;
            }
            if (mainGamePlayRule === MJGamePlayWay.ZHUANZHUAN || mainGamePlayRule === MJGamePlayWay.ZHUAN_ZHUAN_MJ) {
                return "转转麻将";
            } else if (mainGamePlayRule === MJGamePlayWay.CHANG_SHA_MJ) {
                return "长沙麻将";
            } else if (mainGamePlayRule === MJGamePlayWay.HONG_ZHONG_MJ) {
                return "红中麻将";
            }
            return "";
            // if (this.hasVipRule(MJGamePlayWay.SUZHOU, playWay)) {
            //     return "宿州麻将";
            // } else if (this.hasVipRule(MJGamePlayWay.LINGBIJIAZI, playWay)) {
            //     return "灵璧夹子";
            // } else if (this.hasVipRule(MJGamePlayWay.LINGBIGONGZI, playWay)) {
            //     return "灵璧带拱子";
            // } else if (this.hasVipRule(MJGamePlayWay.HUAIBEI, playWay)) {
            //     return "淮北玩法";
            // } else if (this.hasVipRule(MJGamePlayWay.DANGSHAN, playWay)) {
            //     return "砀山玩法";
            // }
        }

        /**
         * 判断vip规则
         * @param {number} rule
         * @param {number} playWay
         * @returns {boolean}
         */
        // public static hasVipRule(rule:number, playWay?:number):boolean {
        //     if (playWay) {
        //         return ((playWay & rule) === rule);
        //     } else {
        //         return ((MahjongData.requestStartGameMsgAck.newPlayWay & rule) === rule);
        //     }
        // }

        /**
         * 是否含有子玩法
         * @param {number} rule
         * @param {Array<number>} minorGamePlayRuleList
         * @returns {boolean}
         */
        public static hasMinorGamePlayRule(rule: number, minorGamePlayRuleList?: Array<number>): boolean {
            if (!minorGamePlayRuleList) {
                minorGamePlayRuleList = MahjongData.requestStartGameMsgAck.subGamePlayRuleList;
            }
            return minorGamePlayRuleList.indexOf(rule) >= 0;
        }

        /**
         * 是否立马打开游戏结束面板
         * @returns {boolean}
         */
        // public static isOpenGameOverView(): boolean {
        //     if (!MahjongData.isReceivedHuInfo || !MJGameHandler.isVipRoom() || (!MJGameHandler.hasMinorGamePlayRule(GameConstant.GAME_PLAY_RULE_ZZ_NIAO_JIA_FEN) && !MJGameHandler.hasMinorGamePlayRule(GameConstant.GAME_PLAY_RULE_ZZ_NIAO_JIA_FAN))) {
        //         return true;
        //     }
        //     return false;
        // }

        /**
         * 是否房费均摊
         * @returns {boolean}
         */
        public static isMorePlayerPay(): boolean {
            return MahjongData.requestStartGameMsgAck.payType === 1;
        }

        /**
         * 是否是代开房
         * @returns {boolean}
         */
        // public static isAgentCreateRoom():boolean {
        //     if (this.isVipRoom()) {
        //         return MahjongData.requestStartGameMsgAck.vipRoomID >= 600000 && MahjongData.requestStartGameMsgAck.vipRoomID < 900000;
        //     } else {
        //         return null;
        //     }
        // }

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
                vWanfaDescStr += MahjongData.requestStartGameMsgAck.playersNumber + "人";
            }
            return vWanfaDescStr;
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
                mainGamePlayRule = MahjongData.requestStartGameMsgAck.mainGamePlayRule;
            }
            if (!minorGamePlayRuleList) {
                minorGamePlayRuleList = MahjongData.requestStartGameMsgAck.subGamePlayRuleList;
            }
            if (mainGamePlayRule === MJGamePlayWay.ZHUAN_ZHUAN_MJ) {
                if (minorGamePlayRuleList.indexOf(MJGameSubRule.ZHUAN_ZHUAN_DIAN_PAO_HU) >= 0) {
                    vWanfaDescStr += "点炮胡(可抢杠)\n";
                } else {
                    vWanfaDescStr += "自摸胡\n";
                }
                if (minorGamePlayRuleList.indexOf(MJGameSubRule.ZHUAN_ZHUAN_ZHUANG_XIAN) >= 0) {
                    vWanfaDescStr += "庄闲(算分)\n";
                }
                if (minorGamePlayRuleList.indexOf(MJGameSubRule.ZHUAN_ZHUAN_KE_HU_QI_DUI) >= 0) {
                    vWanfaDescStr += "可胡7对\n";
                }
                if (minorGamePlayRuleList.indexOf(MJGameSubRule.YOU_HU_BI_HU) >= 0) {
                    vWanfaDescStr += "有胡必胡\n";
                }
                let isNiaoJiaFen: boolean = minorGamePlayRuleList.indexOf(MJGameSubRule.ZHUAN_ZHUAN_ZHONG_NIAO_JIA_FEN) >= 0;
                let isNiaoJiaFan: boolean = minorGamePlayRuleList.indexOf(MJGameSubRule.ZHUAN_ZHUAN_ZHONG_NIAO_FAN_BEI) >= 0;
                if (isNiaoJiaFen) {
                    vWanfaDescStr += "中鸟加分\n";
                } else if (isNiaoJiaFan) {
                    vWanfaDescStr += "中鸟翻倍\n";
                }
                if (isNiaoJiaFen || isNiaoJiaFan) {
                    if (minorGamePlayRuleList.indexOf(MJGameSubRule.ZHUAN_ZHUAN_AN_ZHUAN_JIA_ZHONG_NIAO) >= 0) {
                        vWanfaDescStr += "按庄家中鸟\n";
                    } else if (minorGamePlayRuleList.indexOf(MJGameSubRule.ZHUAN_ZHUAN_159_ZHONG_NIAO) >= 0) {
                        vWanfaDescStr += "159中鸟\n";
                    }
                    if (isNiaoJiaFen) {
                        // 加分
                        if (minorGamePlayRuleList.indexOf(MJGameSubRule.ZHUAN_ZHUAN_ZHUA_ER_NIAO) >= 0) {
                            vWanfaDescStr += "抓2鸟\n";
                        } else if (minorGamePlayRuleList.indexOf(MJGameSubRule.ZHUAN_ZHUAN_ZHUA_SI_NIAO) >= 0) {
                            vWanfaDescStr += "抓4鸟\n";
                        } else if (minorGamePlayRuleList.indexOf(MJGameSubRule.ZHUAN_ZHUAN_ZHUA_LIU_NIAO) >= 0) {
                            vWanfaDescStr += "抓6鸟\n";
                        }
                    } else {
                        // 翻倍
                        if (minorGamePlayRuleList.indexOf(MJGameSubRule.ZHUAN_ZHUAN_ZHUA_YI_NIAO) >= 0) {
                            vWanfaDescStr += "抓1鸟\n";
                        } else if (minorGamePlayRuleList.indexOf(MJGameSubRule.ZHUAN_ZHUAN_ZHUA_ER_NIAO) >= 0) {
                            vWanfaDescStr += "抓2鸟\n";
                        }
                    }
                } else {
                    vWanfaDescStr += "不抓鸟\n";
                }
            }

            if (mainGamePlayRule === MJGamePlayWay.CHANG_SHA_MJ) {
                if (minorGamePlayRuleList.indexOf(MJGameSubRule.CHANG_SHA_ZHUANG_XIAN) >= 0) {
                    vWanfaDescStr += "庄闲\n";
                }
                if (minorGamePlayRuleList.indexOf(MJGameSubRule.CHANG_SHA_PIAO_FEN) >= 0) {
                    vWanfaDescStr += "飘分\n";
                }
                if (minorGamePlayRuleList.indexOf(MJGameSubRule.CHANG_SHA_LIU_LIU_SHUN) >= 0) {
                    vWanfaDescStr += "六六顺\n";
                }
                if (minorGamePlayRuleList.indexOf(MJGameSubRule.CHANG_SHA_QIE_YI_SE) >= 0) {
                    vWanfaDescStr += "缺一色\n";
                }
                if (minorGamePlayRuleList.indexOf(MJGameSubRule.CHANG_SHA_BAN_BAN_HU) >= 0) {
                    vWanfaDescStr += "板板胡\n";
                }
                if (minorGamePlayRuleList.indexOf(MJGameSubRule.CHANG_SHA_DA_SI_XI) >= 0) {
                    vWanfaDescStr += "大四喜\n";
                }
                if (minorGamePlayRuleList.indexOf(MJGameSubRule.CHANG_SHA_JIE_JIE_GAO) >= 0) {
                    vWanfaDescStr += "节节高\n";
                }
                if (minorGamePlayRuleList.indexOf(MJGameSubRule.CHANG_SHA_SAN_TONG) >= 0) {
                    vWanfaDescStr += "三同\n";
                }
                if (minorGamePlayRuleList.indexOf(MJGameSubRule.CHANG_SHA_YI_ZHI_HUA) >= 0) {
                    vWanfaDescStr += "一枝花\n";
                }
                if (minorGamePlayRuleList.indexOf(MJGameSubRule.CHANG_SHA_ZHONG_TU_SI_XI) >= 0) {
                    vWanfaDescStr += "中途四喜\n";
                }
                let isNiaoJiaFen: boolean = minorGamePlayRuleList.indexOf(MJGameSubRule.CHANG_SHA_ZHONG_NIAO_JIA_FEN) >= 0;
                let isNiaoJiaFan: boolean = minorGamePlayRuleList.indexOf(MJGameSubRule.CHANG_SHA_ZHONG_NIAO_FAN_BEI) >= 0;
                if (isNiaoJiaFen) {
                    vWanfaDescStr += "中鸟加分\n";
                } else if (isNiaoJiaFan) {
                    vWanfaDescStr += "中鸟翻倍\n";
                }
                if (isNiaoJiaFen || isNiaoJiaFan) {
                    if (isNiaoJiaFen) {
                        // 加分
                        if (minorGamePlayRuleList.indexOf(MJGameSubRule.CHANG_SHA_ZHONG_ER_NIAO) >= 0) {
                            vWanfaDescStr += "抓2鸟\n";
                        } else if (minorGamePlayRuleList.indexOf(MJGameSubRule.CHANG_SHA_ZHONG_SI_NIAO) >= 0) {
                            vWanfaDescStr += "抓4鸟\n";
                        } else if (minorGamePlayRuleList.indexOf(MJGameSubRule.CHANG_SHA_ZHONG_LIU_NIAO) >= 0) {
                            vWanfaDescStr += "抓6鸟\n";
                        }
                    } else {
                        // 翻倍
                        if (minorGamePlayRuleList.indexOf(MJGameSubRule.CHANG_SHA_ZHONG_YI_NIAO) >= 0) {
                            vWanfaDescStr += "抓1鸟\n";
                        } else if (minorGamePlayRuleList.indexOf(MJGameSubRule.CHANG_SHA_ZHONG_ER_NIAO) >= 0) {
                            vWanfaDescStr += "抓2鸟\n";
                        }
                    }
                } else {
                    vWanfaDescStr += "不抓鸟\n";
                }
            }

            if (mainGamePlayRule === MJGamePlayWay.HONG_ZHONG_MJ) {
                if (minorGamePlayRuleList.indexOf(MJGameSubRule.HONG_ZHONG_DIAN_PAO_HU) >= 0) {
                    vWanfaDescStr += "点炮胡(可抢杠)\n";
                }
                else if (minorGamePlayRuleList.indexOf(MJGameSubRule.HONG_ZHONG_ZI_MO_HU_QIANG_GANG) >= 0) {
                    vWanfaDescStr += "自模胡(可抢杠)\n";
                }
                else {
                    vWanfaDescStr += "自摸胡\n";
                }
                if (minorGamePlayRuleList.indexOf(MJGameSubRule.HONG_ZHONG_ZHUANG_XIAN) >= 0) {
                    vWanfaDescStr += "庄闲(算分)\n";
                }
                if (minorGamePlayRuleList.indexOf(MJGameSubRule.HONG_ZHONG_KE_HU_QI_DUI) >= 0) {
                    vWanfaDescStr += "可胡7对\n";
                }
                if (minorGamePlayRuleList.indexOf(MJGameSubRule.YOU_HU_BI_HU) >= 0) {
                    vWanfaDescStr += "有胡必胡\n";
                }
                if (minorGamePlayRuleList.indexOf(MJGameSubRule.HONG_ZHONG_PIAO_FEN) >= 0) {
                    vWanfaDescStr += "飘分\n";
                }
                if (minorGamePlayRuleList.indexOf(MJGameSubRule.HONG_ZHONG_WU_HONG_ZHONG_FAN_BEI) >= 0) {
                    vWanfaDescStr += "无红中翻倍\n";
                }
                let isNiaoJiaFen: boolean = minorGamePlayRuleList.indexOf(MJGameSubRule.HONG_ZHONG_ZHONG_NIAO_JIA_FEN) >= 0;
                let isNiaoJiaFan: boolean = minorGamePlayRuleList.indexOf(MJGameSubRule.HONG_ZHONG_ZHONG_NIAO_FAN_BEI) >= 0;
                if (isNiaoJiaFen) {
                    vWanfaDescStr += "中鸟加分\n";
                } else if (isNiaoJiaFan) {
                    vWanfaDescStr += "中鸟翻倍\n";
                }
                if (isNiaoJiaFen || isNiaoJiaFan) {
                    if (minorGamePlayRuleList.indexOf(MJGameSubRule.HONG_ZHONG_AN_ZHUAN_JIA_ZHONG_NIAO) >= 0) {
                        vWanfaDescStr += "按庄家中鸟\n";
                    } else if (minorGamePlayRuleList.indexOf(MJGameSubRule.HONG_ZHONG_159_ZHONG_NIAO) >= 0) {
                        vWanfaDescStr += "159中鸟\n";
                    }
                    if (isNiaoJiaFen) {
                        if (minorGamePlayRuleList.indexOf(MJGameSubRule.HONG_ZHONG_YI_MA_QUAN_ZHONG) >= 0) {
                            vWanfaDescStr += "一码全中\n";
                        }
                        else if (minorGamePlayRuleList.indexOf(MJGameSubRule.HONG_ZHONG_WEI_YI_PIAO_NIAO) != -1) {
                            vWanfaDescStr += '围一飘鸟\n';
                        }
                        else {
                            // 加分
                            if (minorGamePlayRuleList.indexOf(MJGameSubRule.HONG_ZHONG_ZHUA_ER_NIAO) >= 0) {
                                vWanfaDescStr += "抓2鸟\n";
                            } else if (minorGamePlayRuleList.indexOf(MJGameSubRule.HONG_ZHONG_ZHUA_SI_NIAO) >= 0) {
                                vWanfaDescStr += "抓4鸟\n";
                            } else if (minorGamePlayRuleList.indexOf(MJGameSubRule.HONG_ZHONG_ZHUA_LIU_NIAO) >= 0) {
                                vWanfaDescStr += "抓6鸟\n";
                            }
                        }
                    } else if(isNiaoJiaFan) {
                        if (minorGamePlayRuleList.indexOf(MJGameSubRule.HONG_ZHONG_YI_MA_QUAN_ZHONG) >= 0) {
                            vWanfaDescStr += "一码全中\n";
                        }
                        else if (minorGamePlayRuleList.indexOf(MJGameSubRule.HONG_ZHONG_WEI_YI_PIAO_NIAO) != -1) {
                            vWanfaDescStr += '围一飘鸟\n';
                        }
                        else {
                            // 翻倍
                            if (minorGamePlayRuleList.indexOf(MJGameSubRule.HONG_ZHONG_ZHUA_YI_NIAO) >= 0) {
                                vWanfaDescStr += "抓1鸟\n";
                            } else if (minorGamePlayRuleList.indexOf(MJGameSubRule.HONG_ZHONG_ZHUA_ER_NIAO) >= 0) {
                                vWanfaDescStr += "抓2鸟\n";
                            }
                        }
                    }
                } else {
                    vWanfaDescStr += "不抓鸟\n";
                }
            }
            return vWanfaDescStr;
        }

        /**
         * 获得Vip房间分享Title
         * @returns {string}
         */
        public static getVipRoomShareTitle(): string {
            // let vMyGamePlayer:GamePlayer = this.getGamePlayerInfo(PZOrientation.DOWN);
            // let vPlayerName:string = StringUtil.subStrSupportChinese(vMyGamePlayer.playerName, 8);
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
            // let vMyGamePlayer:GamePlayer = this.getGamePlayerInfo(PZOrientation.DOWN);
            // let vPlayerName:string = StringUtil.subStrSupportChinese(vMyGamePlayer.playerName, 8);
            // return "【"+vPlayerName+"】邀请你加入房间："+this.getVipRoomId()+"-【"+this.getMJGameNameText()+"】";
            // return GConf.Conf.gameName+" 房号:"+this.getVipRoomId()+" 玩法:"+this.getMJGameNameText();
            return GConf.Conf.gameName + " 房号:" + roomId;
        }

        /**
         * 获得Vip房间分享描述
         * @returns {string}
         */
        public static getVipRoomShareDesc(): string {
            //代开房 宿州麻将 4局
            let vRequestStartGameMsgAck = MahjongData.requestStartGameMsgAck;
            let vDesc: string = "";
            // if (this.isAgentCreateRoom()) {
            //     vDesc += "代开房 "
            // }
            if (vRequestStartGameMsgAck.createType === 1) {
                vDesc += "代开房 ";
            } else if (vRequestStartGameMsgAck.createType === 2) {
                vDesc += "俱乐部开房 ";
            }
            // vDesc += "房号："+this.getVipRoomId()+"，"+MahjongData.requestStartGameMsgAck.totalHand+"局，";
            vDesc += this.getMJGameNameText() + " " + vRequestStartGameMsgAck.totalPlayCount + "局，";
            // vDesc += this.getMJGameNameText() + " ";
            vDesc += this.getWanfaSubDescStr().replace(/\n/g, " ");
            if (this.isMorePlayerPay()) {
                vDesc += " 房费均摊"
            }
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
            // vDesc += this.getMJGameNameText(playWay) + " "+MahjongData.requestStartGameMsgAck.totalHand+"局，";
            vDesc += this.getMJGameNameText(mainGamePlayRule) + " " + totalHand + "局，";
            // vDesc += this.getMJGameNameText() + " ";
            vDesc += this.getWanfaSubDescStr(mainGamePlayRule, minorGamePlayRuleList, playerNum).replace(/\n/g, " ");
            // if (this.isMorePlayerPay()) {
            //     vDesc +=" 房费均摊"
            // }
            vDesc += "，速度来战!";
            return vDesc;
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
            //俱乐部 宿州麻将 4局
            let vDesc: string = "俱乐部 ";
            // vDesc += this.getMJGameNameText(playWay) + " "+MahjongData.requestStartGameMsgAck.totalHand+"局，";
            vDesc += this.getMJGameNameText(mainGamePlayRule) + " " + totalHand + "局，";
            // vDesc += this.getMJGameNameText() + " ";
            vDesc += this.getWanfaSubDescStr(mainGamePlayRule, minorGamePlayRuleList, playerNum).replace(/\n/g, " ");
            // if (this.isMorePlayerPay()) {
            //     vDesc +=" 房费均摊"
            // }
            vDesc += "，速度来战!";
            return vDesc;
        }

        /**
         * 获得Vip房间结束大赢家信息
         * @returns {FL.GamePlayer}
         */
        public static getVipRoomOverWinPlayer(): GamePlayer {
            return MahjongData.playerInfo[MahjongData.vipRoomCloseMsg.winPos];
        }

        /**
         * 获得Vip房间结束分享Title
         * @returns {string}
         */
        public static getVipRoomOverShareTitle(): string {
            let vWinPlayer: GamePlayer = this.getVipRoomOverWinPlayer();
            //设置分数
            let vScoreText: string;
            if (vWinPlayer.chip > 0) {
                vScoreText = "+" + vWinPlayer.chip;
            } else {
                vScoreText = "" + vWinPlayer.chip;
            }
            let vWinPlayerName: string = StringUtil.subStrSupportChinese(vWinPlayer.playerName, 8, "");
            // return this.getMJGameNameText()+" "+this.getVipRoomId()+"房\n大赢家-"+vWinPlayerName+"："+vScoreText;
            return GConf.Conf.gameName + " 房号:" + this.getVipRoomId() + "\n" + vWinPlayerName + "：" + vScoreText + "(大赢家)";
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

        /**
         * 是否是花牌
         * @param {number} cd
         * @returns {boolean}
         */
        public static isHuaCard(cd: number): boolean {
            let huaCards: Array<number> = MahjongData.gameStartMsg.huaCards;
            if (huaCards && huaCards.length > 0) {
                return huaCards.indexOf(cd) >= 0;
            }
            return false;
        }

        /**
         * 上下左右方向  存储各自方向麻将的资源名
         * 上：对家打出的牌，自己打出的牌
         * 下：自己手里的牌
         * 左：上家打出的牌
         * 右：下家打出的牌
         */
        private static _cardResMap: { [pzOrientation: number]: { [cardNo: number]: string } } = {};

        /**
         * 获得牌的资源名
         * @param {FL.PZOrientation} pzOrientation
         * @param {number} cardNum
         * @returns {string}
         */
        public static getCardResName(pzOrientation: PZOrientation, cardNum: number): string {
            return Storage.getMJPBResPrefix()+this._cardResMap[pzOrientation][cardNum];
        }

        public static gete_mj_b_up_png(): string {
            return Storage.getMJPBResPrefix()+"e_mj_b_up_png";
        }

        public static gete_mj_b_left_png(): string {
            return Storage.getMJPBResPrefix()+"e_mj_b_left_png";
        }

        public static getB_wind_9_png(): string {
            return Storage.getMJPBResPrefix()+"B_wind_9_png";
        }

        public static gete_mj_left_png(): string {
            return Storage.getMJPBResPrefix()+"e_mj_left_png";
        }

        public static gete_mj_right_png(): string {
            return Storage.getMJPBResPrefix()+"e_mj_right_png";
        }

        /**
         * 初始化资源
         */
        public static initCardResMap(): void {
            this._cardResMap[PZOrientation.UP] = this.genOneResMap("B");
            this._cardResMap[PZOrientation.DOWN] = this.genOneResMap("M");
            this._cardResMap[PZOrientation.LEFT] = this.genOneResMap("L");
            this._cardResMap[PZOrientation.RIGHT] = this.genOneResMap("R");
        }

        /**
         * 生成一组
         * @param {string} prefix
         * @returns {{[p: number]: string}}
         */
        private static genOneResMap(prefix: string): { [cardNo: number]: string } {
            //定义一个Map对象
            let vOneResMap: { [cardNo: number]: string } = {};
            //万子，一万到九万
            let startNum: number = 1, endNum: number = 9, tempCardNo: number = 1;
            for (; startNum <= endNum; ++startNum, ++tempCardNo) {
                vOneResMap[startNum] = prefix + "_character_" + tempCardNo + "_png";
            }
            //条子，一条到九条
            startNum = 17, endNum = 25, tempCardNo = 1;
            for (; startNum <= endNum; ++startNum, ++tempCardNo) {
                vOneResMap[startNum] = prefix + "_bamboo_" + tempCardNo + "_png";
            }
            //筒子，一筒到九筒
            startNum = 33, endNum = 41, tempCardNo = 1;
            for (; startNum <= endNum; ++startNum, ++tempCardNo) {
                vOneResMap[startNum] = prefix + "_dot_" + tempCardNo + "_png";
            }
            //字 东南西北中发白
            startNum = 49, endNum = 55, tempCardNo = 1;
            for (; startNum <= endNum; ++startNum, ++tempCardNo) {
                vOneResMap[startNum] = prefix + "_wind_" + tempCardNo + "_png";
            }
            //花 春夏秋冬，梅兰菊竹
            startNum = 65, endNum = 72, tempCardNo = 1;
            for (; startNum <= endNum; ++startNum, ++tempCardNo) {
                vOneResMap[startNum] = prefix + "_hua_" + tempCardNo + "_png";
            }
            //返回
            return vOneResMap;
        }

        /**
         * 获得玩家吃碰杠的牌，其中也包含了花牌
         * @param {FL.PZOrientation} pzOrientation
         * @returns {Array<FL.CardDown>}
         */
        public static getPlayerCardDown(pzOrientation: PZOrientation): Array<MahjongCardDown> {
            let vGameStartMsg: MahjongStartCircleGameMsgAck = MahjongData.gameStartMsg;
            if (vGameStartMsg) {
                let vTablePos: number = this.getTablePos(pzOrientation);
                let playersInfo = vGameStartMsg.playerInfos;
                for (let i = 0; i < playersInfo.length; ++i) {
                    if (vTablePos === playersInfo[i].tablePos)
                        return playersInfo[i].cardDowns
                }
            }
            //没有则返回null
            return null;
        }

        /**
         * 获得手里的牌
         * @param {FL.PZOrientation} pzOrientation
         * @returns {Array<number>}
         */
        public static getHandCardArray(pzOrientation: PZOrientation): Array<number> {
            let vTablePos: number = this.getTablePos(pzOrientation);
            // if (!this.isReplay() && vTablePos != MahjongData.gameStartMsg.myTablePos) {
            //     // 不是回放不能获取其他方向的数据
            //     return null;
            // }
            let vGameStartMsg: MahjongStartCircleGameMsgAck = MahjongData.gameStartMsg;
            if (vGameStartMsg) {
                let playersInfo = vGameStartMsg.playerInfos;
                for (let i = 0; i < playersInfo.length; ++i) {
                    if (vTablePos === playersInfo[i].tablePos)
                        return playersInfo[i].handCards;
                }
            }
        }

        /**
         * 获得出牌的那个玩家，即吃碰杠的目标玩家
         * @param chuPlTablePos
         * @param pengGangPlTablePos
         * @param maxPlayerNumber
         */
        public static getChuOffset(chuPlTablePos:number, pengGangPlTablePos:number, maxPlayerNumber:number): number {
            let offset = chuPlTablePos - pengGangPlTablePos;
            if (maxPlayerNumber == 4) {
                if (offset == 2 || offset == -2)
                    return 0;
                else if (offset == 1 || offset == -3)
                    return 1;
                else if (offset == -1 || offset == 3)
                    return -1;
                else {
                    // LOG.error("setChuOffset error,chu=" + chuPlTablePos + ",peng gang=" + pengGangPlTablePos);
                }
            } else if (maxPlayerNumber == 3) {
                if (offset == 1 || offset == -2)
                    return 1;
                else if (offset == -1 || offset == 2)
                    return -1;
                else {
                    // LOG.error("setChuOffset error,chu=" + chuPlTablePos + ",peng gang=" + pengGangPlTablePos);
                }
            } else if (maxPlayerNumber == 2) {
                return 0;
            }
        }

        /**
         * 设置手牌
         * @param {Array<number>} handCards
         * @param {FL.PZOrientation} pzOrientation
         */
        public static setHandCardArray(handCards: Array<number>, pzOrientation: PZOrientation): void {
            if (this.isReplay()) {
                let vTablePos: number = this.getTablePos(pzOrientation);
                let playersInfo = MahjongData.gameStartMsg.playerInfos;
                for (let i = 0; i < playersInfo.length; ++i) {
                    if (vTablePos === playersInfo[i].tablePos)
                        playersInfo[i].handCards = handCards;
                }
            }
        }

        /**
         * 通过补花补回来的牌，获得补花列表，和手里牌列表
         * @param {Array<number>} buhuaBackCards
         * @param {FL.PZOrientation} pzOrientation
         * @returns {{huaCards: number[]; handCards: number[]}}
         */
        public static getHuaHandCardsObj(buhuaBackCards: Array<number>, pzOrientation: PZOrientation): { huaCards: number[], handCards: number[] } {
            // let vMyCards:Array<number> = MahjongData.gameStartMsg.myCards;
            let vMyCards: Array<number> = this.getHandCardArray(pzOrientation);
            let vHuaCardArray: number[] = [];
            let vHandCardArray: number[] = [];
            let vIndex: number = 0, vLength: number = vMyCards.length, vCurrCardValue: number;
            for (; vIndex < vLength; ++vIndex) {
                vCurrCardValue = vMyCards[vIndex];
                if (this.isHuaCard(vCurrCardValue)) {
                    vHuaCardArray.push(vCurrCardValue);
                } else {
                    vHandCardArray.push(vCurrCardValue);
                }
            }
            vIndex = 0, vLength = buhuaBackCards.length;
            for (; vIndex < vLength; ++vIndex) {
                vHandCardArray.push(buhuaBackCards[vIndex]);
            }
            //排个序
            // vHandCardArray.sort(function (a, b) {
            //     return a - b
            // });

            // 回放模式在这里设置手牌
            if (this.isReplay()) {
                this.setHandCardArray(vHandCardArray, pzOrientation);
            }

            //返回
            return { huaCards: vHuaCardArray, handCards: vHandCardArray };
        }

        /**
         * 获得玩家已经打出的牌
         * @param {FL.PZOrientation} pzOrientation
         * @returns {Array<number>}
         */
        public static getPlayerChuCard(pzOrientation: PZOrientation): Array<number> {
            let vGameStartMsg: MahjongStartCircleGameMsgAck = MahjongData.gameStartMsg;
            if (vGameStartMsg) {
                let vTablePos: number = this.getTablePos(pzOrientation);
                let playersInfo = MahjongData.gameStartMsg.playerInfos;
                for (let i = 0; i < playersInfo.length; ++i) {
                    if (vTablePos === playersInfo[i].tablePos)
                        return playersInfo[i].chuCards;
                }
            }
            return null;
        }

        /**
         * 获得最后出牌玩家位置
         * @returns {number}
         */
        public static getLastChuCardPlayerPos(): number {
            let vGameStartMsg: MahjongStartCircleGameMsgAck = MahjongData.gameStartMsg;
            if (vGameStartMsg) {
                return vGameStartMsg.lastChuCardPlayerPos;
            }
            return 0;
        }

        /**
         * 获得最后出牌信息
         * @returns {{chuPos: number; chuCard: number}}
         */
        public static getLastChuCardInfo(): { chuPos: number, chuCard: number } {
            let vGameStartMsg: MahjongStartCircleGameMsgAck = MahjongData.gameStartMsg;
            let playersInfo = MahjongData.gameStartMsg.playerInfos;
            let lastChuCard: number;
            for (let i = 0; i < playersInfo.length; ++i) {
                if (vGameStartMsg.lastChuCardPlayerPos === playersInfo[i].tablePos)
                    lastChuCard = playersInfo[i].chuCards[playersInfo[i].chuCards.length - 1];
            }
            return { chuPos: vGameStartMsg.lastChuCardPlayerPos, chuCard: lastChuCard ? lastChuCard : 0 };
        }

        /**
         * 生成分数图片列表
         * @param {string} scoreStr
         * @returns {eui.Image[]}
         */
        public static genScoreImageArray(scoreStr: string): eui.Image[] {
            let vImageArray: eui.Image[] = [];
            let vResNamePrefix: string;
            for (let vIndex: number = 0; vIndex < scoreStr.length; ++vIndex) {
                let vCurrStr: string = scoreStr.substr(vIndex, 1);
                if (vIndex === 0) {
                    if (vCurrStr === "+") {
                        vResNamePrefix = "go_y_";
                    } else {
                        vResNamePrefix = "go_g_";
                    }
                }
                let vOneImage: eui.Image = new eui.Image();
                vOneImage.width = 40, vOneImage.height = 51, vOneImage.source = vResNamePrefix + vCurrStr + "_png";
                vImageArray.push(vOneImage);
            }
            return vImageArray;
        }

        /**
         * 通过游戏结束消息获得胡的牌
         * @param {FL.PlayerGameOverMsgAck} gameOverMsg
         * @returns {number}
         */
        public static getHuCard(gameOverMsg: PlayerGameOverMsgAck): number {
            let vHuPos: number = (gameOverMsg.huPos & 0xFF) - 1;
            if (vHuPos === 0) {
                return gameOverMsg.p1HuCard;
            } else if (vHuPos === 1) {
                return gameOverMsg.p2HuCard;
            } else if (vHuPos === 2) {
                return gameOverMsg.p3HuCard;
            } else if (vHuPos === 3) {
                return gameOverMsg.p4HuCard;
            }
        }

        /**
         * 获得游戏结束明细的玩法描述信息，显示在游戏结束明细界面
         * @returns {string}
         */
        public static getGameOverDetailWanfaDesc(): string {
            let vResultStr: string = "";
            if (this.isVipRoom()) {
                vResultStr += "第" + this.getQuanNum() + "局\n";
            }
            vResultStr += this.getWanfaSubDescStrNoPersonNum()
            if (this.isVipRoom()) {
                vResultStr += "房间号：" + this.getVipRoomId();
            } else {
                vResultStr += "金币场";
            }
            return vResultStr;
        }

        public static isReceivedHuInfo(): boolean {
            return MahjongData.isReceivedHuInfo;
        }

        public static isStartNiaoEffect(): boolean {
            return MahjongData.isStartNiaoEffect;
        }

        public static setStartNiaoEffect(isStart: boolean): void {
            MahjongData.isStartNiaoEffect = isStart;
        }

        // public static getZhuanZhuanNiaoArray(): Array<{ card: number, isZhong: boolean, pos: number }> {
        //     return MahjongData.zhuanzhuanNiaoArray;
        // }

        /**
         * 设置转转鸟信息列表，以供后面游戏结束界面使用
         * @param {Array<{card: number; isZhong: boolean; pos: number}>} niaoArray
         */
        // public static setZhuanZhuanNiaoArray(niaoArray: Array<{ card: number, isZhong: boolean, pos: number }>): void {
        //     MahjongData.zhuanzhuanNiaoArray = niaoArray;
        // }
        //
        // public static getZhuanZhuanNiaoArrayByPos(tablePos: number): Array<{ card: number, isZhong: boolean, pos: number }> {
        //     let vCurrPosArray: Array<{ card: number, isZhong: boolean, pos: number }> = [];
        //     let vAllArray = MahjongData.zhuanzhuanNiaoArray;
        //     if (vAllArray && vAllArray.length > 0) {
        //         for (let vIndex: number = 0; vIndex < vAllArray.length; ++vIndex) {
        //             if (vAllArray[vIndex].pos === tablePos) {
        //                 vCurrPosArray.push(vAllArray[vIndex]);
        //             }
        //         }
        //     }
        //     return vCurrPosArray;
        // }
        //
        /**
         * 获得游戏结束消息
         * @returns {FL.MahjongGameOverMsgAck}
         */
        public static getMahjongGameOverMsgAck(): MahjongGameOverMsgAck {
            return MahjongData.gameOverMsgAck;
        }

        public static getNewIntoGameTableMsgAck(): NewIntoGameTableMsgAck {
            return MahjongData.requestStartGameMsgAck;
        }

        //
        // public static getVipRoomCloseMsg(): VipRoomCloseMsg {
        //     return MahjongData.vipRoomCloseMsg;
        // }

        /**
         * 重置游戏数据
         */
        public static resetMahjongData(): void {
            //清空玩家信息
            MahjongData.playerInfo = {};
            //清空gps信息
            MahjongData.playerGps = {};
            //置空
            MahjongData.gameStartMsg = null;
            // 最后出的牌
            MahjongData.lastChuCard = 0;

            MahjongData.isReceivedHuInfo = false;
            MahjongData.gameOverMsgAck = null;
            MahjongData.vipRoomCloseMsg = null;

            MahjongData.isStartNiaoEffect = false;
            MahjongData.changshaNiaoArray = null;
            MahjongData.piaoFenInfo = {};
            MahjongData.restCards = {};
            MahjongData.tingCardInfoList = null;
            MahjongData.huCardInfoList = null;
            MahjongData.actionList = null;
            MahjongData.isMyFirstHandCards = false;
            MahjongData.isFirstEnter = false;
        }

    }
}