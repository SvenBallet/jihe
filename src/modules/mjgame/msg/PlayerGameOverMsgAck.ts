module FL {
    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase - PlayerGameOverMsgAck
     * @Description:  //收到游戏结束
     * @Create: DerekWu on 2017/11/14 21:02
     * @Version: V1.0
     */
    export class PlayerGameOverMsgAck extends NetMsgBase {

        public roomID:number;
        public players:Array<SimplePlayer> = new Array<SimplePlayer>();

        public dealerPos:number;//庄家位置

        //胡的牌
        public huCard:number;
        public stage:number;//一般这个是0，如果是1表示这个是vip房间结束
        public isVipTable:number;	//是否VIP桌子
        public readyTime:number = 15;	//准备时间

        //宝牌
        public baoCard:number;

        //胡牌位置
        public huPos:number;

        //玩家手牌
        public player0HandCards:Array<number>;
        public player1HandCards:Array<number>;
        public player2HandCards:Array<number>;
        public player3HandCards:Array<number>;

        //吃碰杠的牌
        public player0DownCards:Array<CardDown>;
        public player1DownCards:Array<CardDown>;
        public player2DownCards:Array<CardDown>;
        public player3DownCards:Array<CardDown>;

        //胡的牌
        public p1HuCard:number;
        public p2HuCard:number;
        public p3HuCard:number;
        public p4HuCard:number;

        // 游戏结束计分明细，牌局如果没有人胡牌，值为null
        public scoreDetail:GameOverScoreDetail = null;

        constructor() {
            super(MsgCmdConstant.MSG_GAME_GAME_OVER_ACK);
        }

        public serialize(ar:ObjectSerializer):void {
            super.serialize(ar);
            let self = this;
            //
            self.roomID=ar.sInt(self.roomID);
            //
            self.players=<Array<SimplePlayer>>ar.sObjArray(self.players);
            self.dealerPos=ar.sInt(self.dealerPos);
            //cards=(List<Byte>)ar.sByteArray(cards);
            self.huCard=ar.sInt(self.huCard);

            self.stage=ar.sInt(self.stage);
            self.isVipTable=ar.sInt(self.isVipTable);
            self.readyTime = ar.sInt(self.readyTime);

            self.baoCard = ar.sInt(self.baoCard);

            self.huPos = ar.sInt(self.huPos);

            self.player0HandCards = <Array<number>>ar.sByteArray(self.player0HandCards);
            self.player1HandCards = <Array<number>>ar.sByteArray(self.player1HandCards);
            self.player2HandCards = <Array<number>>ar.sByteArray(self.player2HandCards);
            self.player3HandCards = <Array<number>>ar.sByteArray(self.player3HandCards);

            self.player0DownCards = <Array<CardDown>>ar.sObjArray(self.player0DownCards);
            self.player1DownCards = <Array<CardDown>>ar.sObjArray(self.player1DownCards);
            self.player2DownCards = <Array<CardDown>>ar.sObjArray(self.player2DownCards);
            self.player3DownCards = <Array<CardDown>>ar.sObjArray(self.player3DownCards);

            self.p1HuCard=ar.sInt(self.p1HuCard);
            self.p2HuCard=ar.sInt(self.p2HuCard);
            self.p3HuCard=ar.sInt(self.p3HuCard);
            self.p4HuCard=ar.sInt(self.p4HuCard);

            self.scoreDetail = <GameOverScoreDetail>ar.sObject(self.scoreDetail);
        }

        /**
         * 获得玩家信息
         * @param {number} pos
         */
        public getSimplePlayerByPos(pos:number):SimplePlayer {
            if (pos === 0) {
                return this.players[0];
            } else if (pos === 1) {
                return this.players[1];
            } else if (pos === 2) {
                return this.players[2];
            } else {
                return this.players[3];
            }
        }

        /**
         * 获得胡的牌
         * @param {number} pos
         * @returns {number}
         */
        public getHuCardByPos(pos:number):number {
            if (pos === 0) {
                return this.p1HuCard;
            } else if (pos === 1) {
                return this.p2HuCard;
            } else if (pos === 2) {
                return this.p3HuCard;
            } else {
                return this.p4HuCard;
            }
        }

        /**
         * 获得手牌
         * @param {number} pos
         * @returns {Array<number>}
         */
        public getHandCardArray(pos:number):Array<number> {
            if (pos === 0) {
                return this.player0HandCards;
            } else if (pos === 1) {
                return this.player1HandCards;
            } else if (pos === 2) {
                return this.player2HandCards;
            } else {
                return this.player3HandCards;
            }
        }

        /**
         * 获得吃碰杠的牌，花牌也放在里面了
         * @param {number} pos
         * @returns {Array<FL.CardDown>}
         */
        public getCardDownArray(pos:number):Array<CardDown> {
            if (pos === 0) {
                return this.player0DownCards;
            } else if (pos === 1) {
                return this.player1DownCards;
            } else if (pos === 2) {
                return this.player2DownCards;
            } else {
                return this.player3DownCards;
            }
        }

        /**
         * 是否胡牌
         * @param {number} tablePos
         * @returns {boolean}
         */
        public isHuByTablePos(tablePos:number): boolean {
            let vHuPosArray: number[] = [];
            vHuPosArray.push((this.huPos & 0xFF) - 1);
            vHuPosArray.push((this.huPos >> 8 & 0xFF) - 1);
            vHuPosArray.push((this.huPos >> 16 & 0xFF) - 1);
            vHuPosArray.push((this.huPos >> 24 & 0xFF) - 1);
            if (vHuPosArray.indexOf(tablePos) >= 0) {
                return true;
            } else {
                return false;
            }
        }

    }
}