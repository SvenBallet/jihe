module FL {
    /**  给客户端发送的提示玩家出牌消息，给提示的玩家发送提示列表，给其他玩家不发送 */
    export class PokerRemindPlayCardMsgAck extends AbstractNewNetMsgBaseAck {

        /** 是否管牌，不是管牌则没有提示按钮，是管牌则有提示按钮 */
        public isMgrCard: boolean = false;//boolean

        /** 牌型 */
        public handPatterns: number = 0;//int

        /** 是否要的起 */
        public isHasBigger: boolean = false;//boolean

        /** 出牌到期时间 */
        public chuExpirationTimes: dcodeIO.Long = dcodeIO.Long.ZERO;//long

        /** 提示出牌的列表(提示牌的张数1+提示牌列表1+提示牌的张数2+提示牌列表2) */
        public remindCards: Array<number> = null;//List<Byte>

        /** 是否可以一次出完 */
        public isAllPlayInOnce: boolean = false;//boolean

        /** 是否可以不要 */
        public isCanNotPlay: boolean = true;//boolean

        /** 是否要不起自动操作 */
        public isYaoBuQiZiDong: boolean = false;

        /** 是否加入老房间后提示 */
        public isJoinOldGameTable: boolean = false;

        /** 牌型大小 */
        public handPatternsSize: number = 0;
        /** 牌型数量（长度） */
        public handPatternsNum: number = 0;
        /** 上家出牌总长度*/
	    public lastAllLength: number = 0;

        public constructor() {
            super(MsgCmdConstant.MSG_POKER_REMIND_PLAY_CARD_ACK);
        }

        public newSerialize(ar: ObjectSerializer): void {
            let self = this;
            self.isMgrCard = ar.sBoolean(self.isMgrCard);
            self.handPatterns = ar.sInt(self.handPatterns);
            self.isHasBigger = ar.sBoolean(self.isHasBigger);
            self.chuExpirationTimes = ar.sLong(self.chuExpirationTimes);
            self.remindCards = <Array<number>>ar.sByteArray(self.remindCards);
            self.isAllPlayInOnce = ar.sBoolean(self.isAllPlayInOnce);
            self.isCanNotPlay = ar.sBoolean(self.isCanNotPlay);
            self.isYaoBuQiZiDong = ar.sBoolean(self.isYaoBuQiZiDong);
            self.isJoinOldGameTable = ar.sBoolean(self.isJoinOldGameTable);
            self.handPatternsSize = ar.sInt(self.handPatternsSize);
            self.handPatternsNum = ar.sInt(self.handPatternsNum);
            self.lastAllLength = ar.sInt(self.lastAllLength);
        }

        /** 解析提示出牌列表 
         * @param {number[]} data //原始数据
         * @returns {any[]} saveArr //解析后的数据存储的数组
        */
        public static serializeRemindCards(data: number[]) {
            if (!data || !data.length) return;
            let saveArr = [];
            let index = 0;
            let indexArr = [];
            for (let i = 0; i < data.length; ++i) {
                if (i == index) {
                    if (index == 0) {
                        index += data[i] + 1;
                        continue;
                    }
                    saveArr.push(indexArr);
                    indexArr = [];
                    index += data[i] + 1;
                    continue;
                }
                indexArr.push(data[i]);
            }
            saveArr.push(indexArr);
            return saveArr;
            // let fst = data.shift();
            // saveArr.push(data.splice(0, fst));
            // return this.serializeRemindCards(data, saveArr, callback);
        }
    }
}