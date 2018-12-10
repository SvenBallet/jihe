module FL {
    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase - GameStartMsg
     * @Description:  //牌局开始
     * @Create: DerekWu on 2017/11/14 20:07
     * @Version: V1.0
     */
    export class GameStartMsg extends NetMsgBase {

        public myTablePos: number;
        //自己手里的牌
        public myCards: Array<number>;

        /** 回放的时候用 开始 */
        public player0HandCards: Array<number>;
        public player1HandCards: Array<number>;
        public player2HandCards: Array<number>;
        public player3HandCards: Array<number>;
        /** 回放的时候用 结束 */

            //0号位打出来的牌
        public player0Cards: Array<number>;
        //1出来的牌
        public player1Cards: Array<number>;
        //2打出来的牌
        public player2Cards: Array<number>;
        //3打出来的牌
        public player3Cards: Array<number>;

        //吃碰杠的牌
        public player0CardsDown: Array<CardDown>;
        public player1CardsDown: Array<CardDown>;
        public player2CardsDown: Array<CardDown>;
        public player3CardsDown: Array<CardDown>;

        public chuCardPlayerIndex: number;//出牌玩家的座位
        public chuCard: number;//当前操作玩家打出的牌，断线重链时此字段有值
        public dealerPos: number;//庄家位置
        public quanNum: number;//圈数

        public baoCard: number;//如果听牌，可以看到宝牌
        public tingPlayers: number;//0就是未听牌，1听牌

        public player0Gold: number;//0玩家的金币数量，如果是vip场，就是桌子上的金币
        public player1Gold: number;//1玩家的金币数量
        public player2Gold: number;//2玩家的金币数量
        public player3Gold: number;//3玩家的金币数量

        public player0WinLoseEqual: number;//玩家胜负平
        public player1WinLoseEqual: number;//玩家胜负平
        public player2WinLoseEqual: number;//玩家胜负平
        public player3WinLoseEqual: number;//玩家胜负平

        public player0Win: number;//玩家胜
        public player1Win: number;//玩家胜
        public player2Win: number;//玩家胜
        public player3Win: number;//玩家胜

        public serviceGold: number;//本局服务费

        public OffLinePlayers: number;//玩家是否在线 1：不在线，0在线

        public playerOperationTime: number = 20;//玩家操作时间（出牌时间）

        public isDealerAgain: number;	//1:连庄，0：不是连庄
        //
        public newPlayWay: number;//新玩法

        /**
         * 记录第几手听的牌
         */
        public tingChuCardIndex = 0;

        /**
         * 主玩法
         */
        public mainGamePlayRule: number = 0;

        /**
         * 子玩法
         */
        public minorGamePlayRuleList: Array<number> = new Array<number>();

        // if ( laiZi != 0 ) {
        //     msg.unused_0 = laiZi;
        // }
        // msg.unused_1 = getMaxPlayer();
        // msg.unused_2 = getMorePlayerPay();
        // msg.unused_3 = getCreatorTablePos();

        constructor() {
            super(MsgCmdConstant.MSG_GAME_START_GAME);
        }

        public serialize(ar: ObjectSerializer): void {
            super.serialize(ar);
            let self = this;
            //
            self.myTablePos = ar.sInt(self.myTablePos);
            self.myCards = <Array<number>>ar.sByteArray(self.myCards);
            //
            self.player0Cards = <Array<number>>ar.sByteArray(self.player0Cards);
            self.player1Cards = <Array<number>>ar.sByteArray(self.player1Cards);
            self.player2Cards = <Array<number>>ar.sByteArray(self.player2Cards);
            self.player3Cards = <Array<number>>ar.sByteArray(self.player3Cards);
            //
            self.player0CardsDown = <Array<CardDown>>ar.sObjArray(self.player0CardsDown);
            self.player1CardsDown = <Array<CardDown>>ar.sObjArray(self.player1CardsDown);
            self.player2CardsDown = <Array<CardDown>>ar.sObjArray(self.player2CardsDown);
            self.player3CardsDown = <Array<CardDown>>ar.sObjArray(self.player3CardsDown);

            self.chuCardPlayerIndex = ar.sInt(self.chuCardPlayerIndex);
            self.chuCard = ar.sInt(self.chuCard);
            self.dealerPos = ar.sInt(self.dealerPos);
            self.quanNum = ar.sInt(self.quanNum);

            self.baoCard = ar.sInt(self.baoCard);
            self.tingPlayers = ar.sInt(self.tingPlayers);
            //
            self.player0Gold = ar.sInt(self.player0Gold);
            self.player1Gold = ar.sInt(self.player1Gold);
            self.player2Gold = ar.sInt(self.player2Gold);
            self.player3Gold = ar.sInt(self.player3Gold);


            self.serviceGold = ar.sInt(self.serviceGold);
            self.OffLinePlayers = ar.sInt(self.OffLinePlayers);
            self.playerOperationTime = ar.sInt(self.playerOperationTime);
            self.isDealerAgain = ar.sInt(self.isDealerAgain);
            //
            self.newPlayWay = ar.sInt(self.newPlayWay);
            //
            self.player0Win = ar.sInt(self.player0Win);
            self.player1Win = ar.sInt(self.player1Win);
            self.player2Win = ar.sInt(self.player2Win);
            self.player3Win = ar.sInt(self.player3Win);

            self.player0WinLoseEqual = ar.sInt(self.player0WinLoseEqual);
            self.player1WinLoseEqual = ar.sInt(self.player1WinLoseEqual);
            self.player2WinLoseEqual = ar.sInt(self.player2WinLoseEqual);
            self.player3WinLoseEqual = ar.sInt(self.player3WinLoseEqual);

            self.tingChuCardIndex = ar.sInt(self.tingChuCardIndex);

            self.mainGamePlayRule = ar.sInt(self.mainGamePlayRule);
            self.minorGamePlayRuleList = <Array<number>>ar.sIntArray(self.minorGamePlayRuleList);
        }

    }
}