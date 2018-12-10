module FL {
    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase - MJGameHandler
     * @Description:  //麻将游戏Handler
     * @Create: DerekWu on 2017/11/22 11:56
     * @Version: V1.0
     */
    export class MJGameHandler {

        /**
         * 通过方向获取牌桌位置
         * @param {FL.PZOrientation} pPZOrientation
         * @returns {number} 负数则表示这个方向上没有位置，不能坐人
         */
        public static getTablePos(pPZOrientation: PZOrientation): number {
            //下面永远是自己
            if (pPZOrientation === PZOrientation.DOWN) {
                return MJGameData.requestStartGameMsgAck.tablePos;
            }
            //牌桌人数
            let vGameMaxNum: number = MJGameData.gameMaxNum;
            //处理2人麻将
            if (vGameMaxNum === 2) {
                if (pPZOrientation === PZOrientation.LEFT || pPZOrientation === PZOrientation.RIGHT) {
                    //2人麻将只有上面
                    return -1;
                } else {
                    return MJGameData.requestStartGameMsgAck.tablePos === 0 ? 1 : 0;
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
            let vMyTablePos: number = MJGameData.requestStartGameMsgAck.tablePos;
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
            return MJGameData.requestStartGameMsgAck;
        }

        /**
         * 获取当前房间最大游戏人数
         */
        public static getGameMaxNum() {
            return MJGameData.gameMaxNum;
        }

        /**
         * 通过牌桌位置获取方向
         * @param {number} pTablePos
         * @returns {FL.PZOrientation}
         */
        public static getPZOrientation(pTablePos: number): PZOrientation {
            //我的桌子位置
            let vMyTablePos: number = MJGameData.requestStartGameMsgAck.tablePos;
            if (vMyTablePos === pTablePos) {
                return PZOrientation.DOWN;
            }
            //牌桌人数
            let vGameMaxNum: number = MJGameData.gameMaxNum;
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
         * @returns {FL.SimplePlayer}
         */
        public static getGamePlayerInfo(pPZOrientation: PZOrientation): SimplePlayer {
            let vPZOrientationTablePos: number = this.getTablePos(pPZOrientation);
            if (vPZOrientationTablePos === -1) {
                return null;
            } else {
                return MJGameData.playerInfo[vPZOrientationTablePos];
            }
        }

        /**
         * 获取玩家Gps数据
         * @param {FL.PZOrientation} pPZOrientation
         * @returns {FL.UpdatePlayerGPSMsg}
         */
        public static getPlayerGPS(pPZOrientation: PZOrientation): UpdatePlayerGPSMsg {
            let vPZOrientationTablePos: number = this.getTablePos(pPZOrientation);
            if (vPZOrientationTablePos === -1) {
                return null;
            } else {
                return MJGameData.playerGps[vPZOrientationTablePos];
            }
        }

        /**
         * 获得牌局开始信息
         * @returns {FL.gameStartMsg}
         */
        public static getGameStartMsg(): GameStartMsg {
            return MJGameData.gameStartMsg;
        }

        /**
         * 是否听牌，主要用户断线重连的判断
         * @param {FL.PZOrientation} pzOrientation
         * @returns {boolean}
         */
        public static isTing(pzOrientation: PZOrientation): boolean {
            let vTablePos: number = this.getTablePos(pzOrientation);
            if (vTablePos !== -1) {
                let vTingFlag: number = MJGameData.gameStartMsg.tingPlayers >> (vTablePos * 8) & 0xFF;
                return vTingFlag === 1;
            }
        }

        /**
         * 获得玩家数组
         * @returns {FL.SimplePlayer[]}
         */
        public static getGamePlayerArray(): SimplePlayer[] {
            let vResultArray: SimplePlayer[] = [];
            if (MJGameData.playerInfo[0]) vResultArray.push(MJGameData.playerInfo[0]);
            if (MJGameData.playerInfo[1]) vResultArray.push(MJGameData.playerInfo[1]);
            if (MJGameData.playerInfo[2]) vResultArray.push(MJGameData.playerInfo[2]);
            if (MJGameData.playerInfo[3]) vResultArray.push(MJGameData.playerInfo[3]);
            return vResultArray;
        }

        /**
         * 增加新玩家或者玩家离开桌子
         * @param {FL.PlayerGameOpertaionAckMsg} msg
         * @param {boolean} isAdd 是否是增加，不是则是离开桌子
         */
        public static addNewOrLeftTablePlayer(msg: PlayerGameOpertaionAckMsg, isAdd: boolean): void {
            let vCurrPlayer: SimplePlayer = MJGameData.playerInfo[msg.tablePos];
            if (!vCurrPlayer) {
                vCurrPlayer = new SimplePlayer();
                MJGameData.playerInfo[msg.tablePos] = vCurrPlayer;
            }
            vCurrPlayer.playerID = msg.playerID;
            vCurrPlayer.playerName = msg.playerName;
            vCurrPlayer.headImg = msg.headImg;
            vCurrPlayer.headImgUrl = msg.targetPlayerName;
            vCurrPlayer.sex = msg.sex;
            vCurrPlayer.palyerIndex = msg.playerIndex;
            vCurrPlayer.gold = msg.gold;
            vCurrPlayer.tablePos = msg.tablePos;
            vCurrPlayer.canFriend = msg.canFriend;
            let vTempInTable = 1;
            if (!isAdd) {
                if (MJGameData.requestStartGameMsgAck.vipTableID !== 0) {
                    //非金币场
                    vTempInTable = 2;
                }
            }
            vCurrPlayer.inTable = vTempInTable; ///** 是否坐在桌子上，1：在桌上；0：在大厅或者离线；2：离开了  */
            vCurrPlayer.ip = msg.ip;
            if (this.getGameState() === EGameState.WAITING_START) {
                vCurrPlayer.gameState = GameConstant.PALYER_GAME_STATE_IN_TABLE_READY;
            } else {
                vCurrPlayer.gameState = GameConstant.PALYER_GAME_STATE_IN_TABLE_PLAYING;
            }
        }

        /**
        * 更新玩家金币和钻石
        * @param {number} tablePos
        * @return {Object} {gold,diamond}
        */
        public static updateGoldNum(tablePos: number): { gold, diamond } {
            let vGetGameStartMsg: GameStartMsg = MJGameHandler.getGameStartMsg();
            let gold: number = 0, diamond: number = 0;
            if (vGetGameStartMsg) {
                if (tablePos === 0) {
                    gold = vGetGameStartMsg.player0Gold;
                    diamond = vGetGameStartMsg.player0Win;
                } else if (tablePos === 1) {
                    gold = vGetGameStartMsg.player1Gold;
                    diamond = vGetGameStartMsg.player1Win;
                } else if (tablePos === 2) {
                    gold = vGetGameStartMsg.player2Gold;
                    diamond = vGetGameStartMsg.player2Win;
                } else if (tablePos === 3) {
                    gold = vGetGameStartMsg.player3Gold;
                    diamond = vGetGameStartMsg.player3Win;
                }
            }
            MJGameData.playerInfo[tablePos].gold = gold;
            return { gold: gold, diamond: diamond }
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
            return MJGameData.requestStartGameMsgAck.vipTableID !== 0;
        }

        /**
         * 是否重播，回放
         * @returns {boolean}
         */
        public static isReplay(): boolean {
            return MJGameData.isReplay;
        }

        /**
         * 设置重播
         * @param {boolean} isReplay
         */
        // public static setIsReplay(isReplay:boolean): void {
        //     MJGameData.isReplay = isReplay;
        // }

        /**
         * 获得麻将游戏状态
         * @returns {FL.MJGameState}
         */
        public static getGameState(): EGameState {
            return MJGameData.mjGameState;
        }

        /**
         * 设置麻将游戏状态
         * @param {FL.MJGameState} pMJGameState
         */
        public static setGameState(pMJGameState: EGameState): void {
            MJGameData.mjGameState = pMJGameState;
        }

        /**
         * 房间结束 牌局结算中是否有中码项
         * @returns {boolean}
         */
        public static roomOverHasZhongMa(): boolean {
            return true;
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
            let vSimplePlayerArray: SimplePlayer[] = this.getGamePlayerArray();
            for (let vIndex: number = 0, vLength: number = vSimplePlayerArray.length; vIndex < vLength; ++vIndex) {
                let vOneSimplePlayer: SimplePlayer = vSimplePlayerArray[vIndex];
                vKey += vOneSimplePlayer.playerID;
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
         * 获得房间创建者ID
         * @returns {string}
         */
        public static getCreatePlayerID(): string {
            return MJGameData.requestStartGameMsgAck.createPlayerID;
        }

        /**
         * 是否是房主
         * @param {FL.PZOrientation} pzOrientation
         * @returns {boolean}
         */
        public static isRoomOwner(pzOrientation: PZOrientation): boolean {
            let vSimplePlayer: SimplePlayer = this.getGamePlayerInfo(pzOrientation);
            return this.getCreatePlayerID() === vSimplePlayer.playerID;
        }

        /**
         * 是否是房主
         * @param {FL.SimplePlayer} pSimplePlayer
         * @returns {boolean}
         */
        public static isRoomOwner2(pSimplePlayer: SimplePlayer): boolean {
            if (pSimplePlayer) {
                return this.getCreatePlayerID() === pSimplePlayer.playerID;
            } else {
                return false;
            }
        }

        /**
         * 获得当前房间最大玩家数量
         * @returns {number}
         */
        public static getRoomPlayerMaxNum(): number {
            return MJGameData.requestStartGameMsgAck.playersNumber;
        }

        public static getRoomType(): number {
            return MJGameData.requestStartGameMsgAck.roomType;
        }

        /**
         * 获得剩余局数，即剩余游戏次数
         * @returns {number}
         */
        public static getRemainGameCount(): number {
            // let vRequestStartGameMsgAck:RequestStartGameMsgAck = MJGameData.requestStartGameMsgAck;
            return MJGameData.requestStartGameMsgAck.totalHand - MJGameData.gameStartMsg.quanNum;
        }

        /**
         * 获得当前局数
         * @returns {number}
         */
        public static getCurrentHand(): number {
            return MJGameData.requestStartGameMsgAck.currentHand;
        }

        /**
         * 获得当前局数
         * @returns {number}
         */
        public static getQuanNum(): number {
            return MJGameData.gameStartMsg.quanNum;
        }

        /**
         * 获得我已经补花的数量
         * @returns {number}
         */
        public static getMyBuhuaNum(): number {
            return MJGameData.myBuhuaNum;
        }

        /**
         * 增加我的补花数量
         * @param {number} addNum
         */
        public static addMyBuhuaNum(addNum: number): void {
            MJGameData.myBuhuaNum += addNum;
        }

        /**
         * 重置我的补花数量
         */
        public static resetMyBuhuaNum(): void {
            MJGameData.myBuhuaNum = 0;
        }

        /**
         * 获得玩家操作时间
         * @returns {number}
         */
        public static getPlayerOperationTime(): number {
            return MJGameData.gameStartMsg.playerOperationTime;
        }

        /**
         * 获得庄玩家方向
         * @returns {FL.PZOrientation}
         */
        public static getDealerOrientation(): PZOrientation {
            return this.getPZOrientation(MJGameData.gameStartMsg.dealerPos);
        }

        /**
         * 获得庄玩家位置
         * @returns {number}
         */
        public static getDealerPos(): number {
            return MJGameData.gameStartMsg.dealerPos;
        }

        /**
         * 获得当前操作方向
         * @returns {FL.PZOrientation}
         */
        public static getCurrOperationOrientation(): PZOrientation {
            return MJGameData.currOperationOrientation;
        }

        /**
         * 设置当前操作方向
         * @returns {FL.PZOrientation}
         */
        public static setCurrOperationOrientation(pPZOrientation: PZOrientation): PZOrientation {
            return MJGameData.currOperationOrientation = pPZOrientation;
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
            return MJGameData.cardLeftNum.attrId;
        }

        /**
         * 是否看得到其他玩家的暗杠
         * @returns {boolean}
         */
        public static isShowOtherPlayerAnGang(): boolean {
            if (MJGameData.requestStartGameMsgAck.mainGamePlayRule === MJGamePlayWay.ZHUANZHUAN) {
                return true;
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
            let vGameStartMsg: GameStartMsg = MJGameData.gameStartMsg;
            return vGameStartMsg.player0Cards.length > 0
                || vGameStartMsg.player1Cards.length > 0
                || vGameStartMsg.player2Cards.length > 0
                || vGameStartMsg.player3Cards.length > 0
                || vGameStartMsg.player0CardsDown.length > 0
                || vGameStartMsg.player1CardsDown.length > 0
                || vGameStartMsg.player2CardsDown.length > 0
                || vGameStartMsg.player3CardsDown.length > 0;
        }

        /**
         * 是否连庄
         * @returns {boolean}
         */
        public static isDealerAgain(): boolean {
            return MJGameData.gameStartMsg.isDealerAgain === 1;
        }

        /**
         * 获得癞子 标志 牌
         * @returns {number}
         */
        public static getLaiziFlagCardNum(): number {
            return MJGameData.gameStartMsg.unused_0;
        }

        /**
         * 癞子颜色过滤器
         * @type {egret.ColorMatrixFilter}
         */
        public static laiziColorFilter = new egret.ColorMatrixFilter([
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
            0, 0, 0, 0, 0,
            0, 0, 0, 0, 0,
            0, 0, 1, 0, 0,
            0, 0, 0, 1, 0
        ]);

        /**
         * 是否是癞子，服务端拷贝过来的代码
         * @param {number} cd
         * @returns {boolean}
         */
        public static isLaiZi(cd: number): boolean {
            // 转转麻将没有癞子
            return false;
            // let fanCard = MJGameData.gameStartMsg.unused_0;
            // if ( fanCard == 0 )
            // return false;
            //
            // //
            // let laizi = fanCard;
            // laizi++;
            // //
            // if ( laizi == 0xa )
            //     laizi = 1;
            // else if ( laizi == 0x1a )
            //     laizi = 0x11;
            // else if ( laizi == 0x2a )
            //     laizi = 0x21;
            // else if ( laizi == 0x35 )
            //     laizi = 0x31;
            // else if ( laizi == 0x38 ) {
            //     laizi = 0x35;
            // } else if ( fanCard >= 0x41 && fanCard <= 0x44 ) {
            //     if ( cd >= 0x45 && cd <= 0x48 )
            //         return true;
            //     else
            //         return false;
            // } else if ( fanCard >= 0x45 && fanCard <= 0x48 ) {
            //     if ( cd >= 0x41 && cd <= 0x44 )
            //         return true;
            //     else
            //         return false;
            // }
            //
            // if ( laizi == cd )
            //     return true;
            // return false;
        }

        /**
         * 获得玩法字符串 房间号 + 玩法 或者 金币场 + 玩法
         * @returns {string}
         */
        public static getRoomAndWanfaStr(): string {
            let vRoomAndWanfaInfoText: string = "";
            let vVipTableID: number = MJGameData.requestStartGameMsgAck.vipTableID;
            if (vVipTableID === 0) {
                vRoomAndWanfaInfoText += "金币场  |  "
            } else {
                vRoomAndWanfaInfoText += "房间号:" + vVipTableID + "  |  "
            }
            vRoomAndWanfaInfoText += this.getMJGameNameText();
            return vRoomAndWanfaInfoText;
        }

        /**
         * 获得VIP房间Id
         * @returns {string}
         */
        public static getVipRoomId(): string {
            if (!(MJGameData && MJGameData.requestStartGameMsgAck && MJGameData.requestStartGameMsgAck.vipTableID)) {
                return "";
            }
            return "" + MJGameData.requestStartGameMsgAck.vipTableID;
        }

        /**
         * 获得主玩法规则
         * @returns {number}
         */
        public static getMainGamePlayRule(): number {
            return MJGameData.requestStartGameMsgAck.mainGamePlayRule;
        }

        /**
         * 获得麻将游戏名字文本
         * @param {number} playWay
         * @returns {string}
         */
        public static getMJGameNameText(mainGamePlayRule?: number): string {
            if (!mainGamePlayRule) {
                mainGamePlayRule = MJGameData.requestStartGameMsgAck.mainGamePlayRule;
            }
            if (mainGamePlayRule === MJGamePlayWay.ZHUANZHUAN) {
                return "转转麻将";
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
        //         return ((MJGameData.requestStartGameMsgAck.newPlayWay & rule) === rule);
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
                minorGamePlayRuleList = MJGameData.requestStartGameMsgAck.minorGamePlayRuleList;
            }
            return minorGamePlayRuleList.indexOf(rule) >= 0;
        }

        /**
         * 是否立马打开游戏结束面板
         * @returns {boolean}
         */
        public static isOpenGameOverView(): boolean {
            if (!MJGameData.isReceivedHuInfo || !MJGameHandler.isVipRoom() || (!MJGameHandler.hasMinorGamePlayRule(GameConstant.GAME_PLAY_RULE_ZZ_NIAO_JIA_FEN) && !MJGameHandler.hasMinorGamePlayRule(GameConstant.GAME_PLAY_RULE_ZZ_NIAO_JIA_FAN))) {
                return true;
            }
            return false;
        }

        /**
         * 是否房费均摊
         * @returns {boolean}
         */
        public static isMorePlayerPay(): boolean {
            return MJGameData.requestStartGameMsgAck.payType === 1;
        }

        /**
         * 是否是代开房
         * @returns {boolean}
         */
        // public static isAgentCreateRoom():boolean {
        //     if (this.isVipRoom()) {
        //         return MJGameData.requestStartGameMsgAck.vipTableID >= 600000 && MJGameData.requestStartGameMsgAck.vipTableID < 900000;
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
                vWanfaDescStr += MJGameData.requestStartGameMsgAck.playersNumber + "人";
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
                mainGamePlayRule = MJGameData.requestStartGameMsgAck.mainGamePlayRule;
            }
            if (!minorGamePlayRuleList) {
                minorGamePlayRuleList = MJGameData.requestStartGameMsgAck.minorGamePlayRuleList;
            }
            if (mainGamePlayRule === MJGamePlayWay.ZHUANZHUAN) {
                if (minorGamePlayRuleList.indexOf(GameConstant.GAME_PLAY_RULE_DIAN_PAO) >= 0) {
                    vWanfaDescStr += "点炮胡(可抢杠)\n";
                } else {
                    vWanfaDescStr += "自摸胡\n";
                }
                if (minorGamePlayRuleList.indexOf(GameConstant.GAME_PLAY_RULE_ZHUANG_XIAN) >= 0) {
                    vWanfaDescStr += "庄闲(算分)\n";
                }
                if (minorGamePlayRuleList.indexOf(GameConstant.GAME_PLAY_RULE_ZZ_7_DUI) >= 0) {
                    vWanfaDescStr += "可胡7对\n";
                }
                if (minorGamePlayRuleList.indexOf(GameConstant.GAME_PLAY_RULE_MUST_HU) >= 0) {
                    vWanfaDescStr += "有胡必胡\n";
                }
                let isNiaoJiaFen: boolean = minorGamePlayRuleList.indexOf(GameConstant.GAME_PLAY_RULE_ZZ_NIAO_JIA_FEN) >= 0;
                let isNiaoJiaFan: boolean = minorGamePlayRuleList.indexOf(GameConstant.GAME_PLAY_RULE_ZZ_NIAO_JIA_FAN) >= 0;
                if (isNiaoJiaFen) {
                    vWanfaDescStr += "中鸟加分\n";
                } else if (isNiaoJiaFan) {
                    vWanfaDescStr += "中鸟翻倍\n";
                }
                if (isNiaoJiaFen || isNiaoJiaFan) {
                    if (minorGamePlayRuleList.indexOf(GameConstant.GAME_PLAY_RULE_ZZ_ZHUANG_NIAO) >= 0) {
                        vWanfaDescStr += "按庄家中鸟\n";
                    } else if (minorGamePlayRuleList.indexOf(GameConstant.GAME_PLAY_RULE_ZZ_159_NIAO) >= 0) {
                        vWanfaDescStr += "159中鸟\n";
                    }
                    if (isNiaoJiaFen) {
                        // 加分
                        if (minorGamePlayRuleList.indexOf(GameConstant.GAME_PLAY_RULE_ZZ_2_NIAO) >= 0) {
                            vWanfaDescStr += "抓2鸟\n";
                        } else if (minorGamePlayRuleList.indexOf(GameConstant.GAME_PLAY_RULE_ZZ_4_NIAO) >= 0) {
                            vWanfaDescStr += "抓4鸟\n";
                        } else if (minorGamePlayRuleList.indexOf(GameConstant.GAME_PLAY_RULE_ZZ_6_NIAO) >= 0) {
                            vWanfaDescStr += "抓6鸟\n";
                        }
                    } else {
                        // 翻倍
                        if (minorGamePlayRuleList.indexOf(GameConstant.GAME_PLAY_RULE_ZZ_1_NIAO) >= 0) {
                            vWanfaDescStr += "抓1鸟\n";
                        } else if (minorGamePlayRuleList.indexOf(GameConstant.GAME_PLAY_RULE_ZZ_2_NIAO) >= 0) {
                            vWanfaDescStr += "抓2鸟\n";
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
         * 获得Vip房间分享描述
         * @returns {string}
         */
        public static getVipRoomShareDesc(): string {
            //代开房 宿州麻将 4局
            let vRequestStartGameMsgAck = MJGameData.requestStartGameMsgAck;
            let vDesc: string = "";
            // if (this.isAgentCreateRoom()) {
            //     vDesc += "代开房 "
            // }
            if (vRequestStartGameMsgAck.roomType === 1) {
                vDesc += "代开房 ";
            } else if (vRequestStartGameMsgAck.roomType === 2) {
                vDesc += "俱乐部开房 ";
            }
            // vDesc += "房号："+this.getVipRoomId()+"，"+MJGameData.requestStartGameMsgAck.totalHand+"局，";
            vDesc += this.getMJGameNameText() + " " + vRequestStartGameMsgAck.totalHand + "局，";
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
            // vDesc += this.getMJGameNameText(playWay) + " "+MJGameData.requestStartGameMsgAck.totalHand+"局，";
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
            // vDesc += this.getMJGameNameText(playWay) + " "+MJGameData.requestStartGameMsgAck.totalHand+"局，";
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
         * @returns {FL.SimplePlayer}
         */
        public static getVipRoomOverWinPlayer(): SimplePlayer {
            return MJGameData.vipRoomCloseMsg.players[MJGameData.vipRoomCloseMsg.winPos];
        }

        /**
         * 获得Vip房间结束分享Title
         * @returns {string}
         */
        public static getVipRoomOverShareTitle(): string {
            let vWinPlayer: SimplePlayer = this.getVipRoomOverWinPlayer();
            //设置分数
            let vScoreText: string;
            if (vWinPlayer.gold > 0) {
                vScoreText = "+" + vWinPlayer.gold;
            } else {
                vScoreText = "" + vWinPlayer.gold;
            }
            let vWinPlayerName: string = StringUtil.subStrSupportChinese(vWinPlayer.playerName, 8, "");
            // return this.getMJGameNameText()+" "+this.getVipRoomId()+"房\n大赢家-"+vWinPlayerName+"："+vScoreText;
            return GConf.Conf.gameName + " 房号:" + this.getVipRoomId() + "\n" + vWinPlayerName + "：" + vScoreText+"(大赢家)";
        }

        /**
         * 获得Vip房间结束分享内容
         * @returns {string}
         */
        public static getVipRoomOverShareDesc(): string {
            let vVipRoomCloseMsg: VipRoomCloseMsg = MJGameData.vipRoomCloseMsg;
            let vPlayerArray: Array<SimplePlayer> = vVipRoomCloseMsg.players;
            let vDescStr: string = "";
            for (let vIndex: number = 0, vLength: number = vPlayerArray.length; vIndex < vLength; ++vIndex) {
                let vCurrPlayer: SimplePlayer = vPlayerArray[vIndex];
                if (vCurrPlayer.tablePos !== vVipRoomCloseMsg.winPos) {
                    vDescStr += StringUtil.subStrSupportChinese(vCurrPlayer.playerName, 8, "") + "：";
                    if (vCurrPlayer.gold > 0) {
                        vDescStr += "+" + vCurrPlayer.gold;
                    } else {
                        vDescStr += "" + vCurrPlayer.gold;
                    }
                    if (vIndex !== vLength - 1) {
                        vDescStr += "\n";
                    }
                }
            }
            return vDescStr;
        }

        /**
         * 是否是花牌，服务端拷贝过来的代码
         * @param {number} cd
         * @returns {boolean}
         */
        public static isHuaCard(cd: number): boolean {
            // if (this.hasVipRule(MJGamePlayWay.SUZHOU)) {
            //     if (this.isLaiZi(cd)) // 如果此牌是癞子，那么必定不是花，此判断针对的是中发白和东这4个牌。
            //         return false;
            //     if (this.hasVipRule(GameConstant.GAME_PLAY_RULE_DONG_FENG_LING) && cd == 0x31)
            //         return true;
            //     if (cd >= 0x35)
            //         return true;
            //     return false;
            // } else if (this.hasVipRule(MJGamePlayWay.LINGBIJIAZI)) {
            //     if ( cd == 0x31 || cd > 0x40) {
            //         return true;
            //     } else if ( cd >= 0x35 && cd <= 0x37) {
            //         return true;
            //     }
            //     return false;
            // } else if (this.hasVipRule(MJGamePlayWay.LINGBIGONGZI)) {
            //     if ( this.isLaiZi(cd) ) {
            //         // 如果此牌是癞子，那么必定不是花，此判断针对的是中发白和东这4个牌。
            //         return false;
            //     }
            //     if ( cd == 0x31 ) {
            //         // 东风令（东风固定是花）
            //         return true;
            //     } else if ( cd >= 0x35 && cd <= 0x37 ) {
            //         return true;
            //     } else if ( cd >= 0x41 && cd <= 0x48 ) {
            //         return true;
            //     }
            //     return false;
            // }
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
            return this._cardResMap[pzOrientation][cardNum];
        }

        /**
         * 获取剩余牌数（未打出的牌）
         * @param {number} cardValue
         * @returns {number}
         */
        public static getRestCardNum(cardValue:number): number {
            return MJGameData.restCards[cardValue];
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
        public static getPlayerCardDown(pzOrientation: PZOrientation): Array<CardDown> {
            let vGameStartMsg: GameStartMsg = MJGameData.gameStartMsg;
            if (vGameStartMsg) {
                let vTablePos: number = this.getTablePos(pzOrientation);
                if (vTablePos === 0) {
                    return vGameStartMsg.player0CardsDown;
                } else if (vTablePos === 1) {
                    return vGameStartMsg.player1CardsDown;
                } else if (vTablePos === 2) {
                    return vGameStartMsg.player2CardsDown;
                } else if (vTablePos === 3) {
                    return vGameStartMsg.player3CardsDown;
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
            if (pzOrientation === PZOrientation.DOWN) {
                return MJGameData.gameStartMsg.myCards;
            } else {
                if (!this.isReplay()) {
                    // 不是回放不能获取其他方向的数据
                    return null;
                }
                let vTablePos: number = this.getTablePos(pzOrientation);
                if (vTablePos === 0) return MJGameData.gameStartMsg.player0HandCards;
                if (vTablePos === 1) return MJGameData.gameStartMsg.player1HandCards;
                if (vTablePos === 2) return MJGameData.gameStartMsg.player2HandCards;
                if (vTablePos === 3) return MJGameData.gameStartMsg.player3HandCards;
            }
        }

        /**
         * 设置手牌
         * @param {Array<number>} handCards
         * @param {FL.PZOrientation} pzOrientation
         */
        public static setHandCardArray(handCards: Array<number>, pzOrientation: PZOrientation): void {
            if (pzOrientation === PZOrientation.DOWN) {
                MJGameData.gameStartMsg.myCards = handCards;
            }
            if (this.isReplay()) {
                let vTablePos: number = this.getTablePos(pzOrientation);
                if (vTablePos === 0) MJGameData.gameStartMsg.player0HandCards = handCards;
                if (vTablePos === 1) MJGameData.gameStartMsg.player1HandCards = handCards;
                if (vTablePos === 2) MJGameData.gameStartMsg.player2HandCards = handCards;
                if (vTablePos === 3) MJGameData.gameStartMsg.player3HandCards = handCards;
            }
        }

        /**
         * 通过补花补回来的牌，获得补花列表，和手里牌列表
         * @param {Array<number>} buhuaBackCards
         * @param {FL.PZOrientation} pzOrientation
         * @returns {{huaCards: number[]; handCards: number[]}}
         */
        public static getHuaHandCardsObj(buhuaBackCards: Array<number>, pzOrientation: PZOrientation): { huaCards: number[], handCards: number[] } {
            // let vMyCards:Array<number> = MJGameData.gameStartMsg.myCards;
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
            vHandCardArray.sort(function (a, b) {
                return a - b
            });

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
            let vGameStartMsg: GameStartMsg = MJGameData.gameStartMsg;
            if (vGameStartMsg) {
                // if (pzOrientation === PZOrientation.DOWN) {
                //     return vGameStartMsg.myCards;
                // }
                let vTablePos: number = this.getTablePos(pzOrientation);
                if (vTablePos === 0) {
                    return vGameStartMsg.player0Cards;
                } else if (vTablePos === 1) {
                    return vGameStartMsg.player1Cards;
                } else if (vTablePos === 2) {
                    return vGameStartMsg.player2Cards;
                } else if (vTablePos === 3) {
                    return vGameStartMsg.player3Cards;
                }
            }
            //没有则返回null
            return null;
        }

        /**
         * 获得最后出牌信息
         * @returns {{chuPos: number; chuCard: number}}
         */
        public static getLastChuCardInfo(): { chuPos: number, chuCard: number } {
            let vGameStartMsg: GameStartMsg = MJGameData.gameStartMsg;
            return { chuPos: vGameStartMsg.chuCardPlayerIndex, chuCard: vGameStartMsg.chuCard };
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
                
                vOneImage.width = 40, vOneImage.height = 51;
                vOneImage.source = vResNamePrefix + vCurrStr + "_png";
                vImageArray.push(vOneImage);
            }
            return vImageArray;
        }

        /**
         * 生成分数图片列表, 红蓝版
         * @param {string} scoreStr
         * @returns {eui.Image[]}
         */
        public static genScoreImageArrayRed(scoreStr: string): eui.Image[] {
            let vImageArray: eui.Image[] = [];
            let vResNamePrefix: string = "go_g_";
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
                
                vOneImage.width = 45, vOneImage.height = 60;
                let arr: Array<string> = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "-", "+"];
                if (arr.indexOf(vCurrStr) < 0) {
                    vCurrStr = "+";
                }
                vOneImage.source = vResNamePrefix + vCurrStr + "_n_png";
                vImageArray.push(vOneImage);
            }
            return vImageArray;
        }

        /**
         * 获得玩家坐拉跑信息
         * @param {FL.PZOrientation} pPZOrientation
         * @returns {FL.PlayerZuoLaPaoInfo}
         */
        public static getPlayerZuoLaPaoInfo(pPZOrientation: PZOrientation): PlayerZuoLaPaoInfo {
            return MJGameData.zuoLaPaoInfo[this.getTablePos(pPZOrientation)];
        }

        /**
         * 获得玩家下码信息
         * @param {FL.PZOrientation} pPZOrientation
         * @returns {number}
         */
        public static getPlayerXiaMaInfo(pPZOrientation: PZOrientation): number {
            return MJGameData.xiaMaInfo[this.getTablePos(pPZOrientation)];
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
            return MJGameData.isReceivedHuInfo;
        }

        public static isStartNiaoEffect(): boolean {
            return MJGameData.isStartNiaoEffect;
        }

        public static setStartNiaoEffect(isStart: boolean): void {
            MJGameData.isStartNiaoEffect = isStart;
        }

        // public static getZhuanZhuanNiaoArray(): Array<{ card: number, isZhong: boolean, pos: number }> {
        //     return MJGameData.zhuanzhuanNiaoArray;
        // }

        /**
         * 设置转转鸟信息列表，以供后面游戏结束界面使用
         * @param {Array<{card: number; isZhong: boolean; pos: number}>} niaoArray
         */
        public static setZhuanZhuanNiaoArray(niaoArray: Array<{ card: number, isZhong: boolean, pos: number }>): void {
            MJGameData.zhuanzhuanNiaoArray = niaoArray;
        }

        public static getZhuanZhuanNiaoArrayByPos(tablePos: number): Array<{ card: number, isZhong: boolean, pos: number }> {
            let vCurrPosArray: Array<{ card: number, isZhong: boolean, pos: number }> = [];
            let vAllArray = MJGameData.zhuanzhuanNiaoArray;
            if (vAllArray && vAllArray.length > 0) {
                for (let vIndex: number = 0; vIndex < vAllArray.length; ++vIndex) {
                    if (vAllArray[vIndex].pos === tablePos) {
                        vCurrPosArray.push(vAllArray[vIndex]);
                    }
                }
            }
            return vCurrPosArray;
        }

        public static getPlayerGameOverMsgAck(): PlayerGameOverMsgAck {
            return MJGameData.playerGameOverMsgAck;
        }

        public static getVipRoomCloseMsg(): VipRoomCloseMsg {
            return MJGameData.vipRoomCloseMsg;
        }

        /**
         * 重置游戏数据
         */
        public static resetMJGameData(): void {
            //清空玩家信息
            MJGameData.playerInfo = {};
            //清空gps信息
            MJGameData.playerGps = {};
            //置空
            MJGameData.gameStartMsg = null;
            // 坐拉跑 和 下码清空，先写到这，后面再说
            MJGameData.zuoLaPaoInfo = {};
            MJGameData.xiaMaInfo = {};

            MJGameData.isReceivedHuInfo = false;
            MJGameData.playerGameOverMsgAck = null;
            MJGameData.vipRoomCloseMsg = null;

            MJGameData.isStartNiaoEffect = false;
            MJGameData.zhuanzhuanNiaoArray = null;
        }

    }
}