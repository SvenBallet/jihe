module FL {
    /** 单张扑克数据接口 */
    export interface ICardData {
        id: any;//服务器传来的ID
        type: ECardIconType;//花色
        value: number;//值
    }

    /**
     * 牌组数据接口
     */
    export interface ICardsData {
        type: ECardEffectType;//出牌效果
        data: ICardData[];//扑克数据数组
        value: number;//代表对应的资源的值，默认为空
    }

    /** 出牌数据接口 */
    export interface IChuCardData {
        chuPos: number;
        chuData: ICardsData
    }

    // /** 
    //  * 出牌数据接口
    //  */
    // export interface IChuCardData {
    //     data: { chuPos: number, chuData: ICardsData };
    //     nextPos: number;//下一个出牌的pos
    // }

    /** 扑克游戏数据 */
    export class RFGameData {
        /** 开始游戏返回结果【进入牌桌之后就返回，并不是开始打】 */
        public static requestStartGameMsgAck: NewIntoGameTableMsgAck;

        /** 真正开始打牌 */
        public static gameStartMsg: PokerStartCircleGameMsgAck;

        /** 游戏房间人数限制 */
        public static gameMaxNum: number = 4;

        /** 玩家手牌数据 */
        public static playerCardsData: { [tablePos: number]: ICardData[] } = {};
        /** 玩家最后一次出牌数据 */
        public static playerLastCards: { [tablePos: number]: ICardsData } = {};

        /** 玩家操作时间 */
        public static playerOpTime: number = 0;

        /** 游戏房间最大卡牌数 */
        public static gameMaxCardNum: number = 20;

        /** 当前房间是否显示剩余总牌数 */
        public static isShowRestCardsNum: boolean = false;

        /** 当前房间总余牌数 */
        public static restTotalCardsNum: number = 0;
        /** 当前房间总余牌列表 */
        public static restCardsData: ICardData[] = [];

        /** 是否显示每个玩家的手牌数 */
        public static isShowHandCardsNum: boolean = false;

        /** 是否需要准备 */
        public static isNeedReady: boolean = false;

        /** 玩家信息 */
        public static playerInfo: { [tablePos: number]: GamePlayer } = {};

        /** 玩家gps信息 */
        public static playerGps: { [tablePos: number]: NewUpdateGPSPositionMsgAck } = {};

        /** 游戏状态 */
        public static gameState: EGameState = EGameState.NULL;

        /** 是否回放 */
        public static isReplay: boolean = false;

        /** 牌局结算界面 */
        public static gameOverMsgAck: PaoDeKuaiGameOverSettleAccountsMsgAck;

        /** VIP结算 */
        public static vipRoomCloseMsg: NewVipRoomOverSettleAccountsMsgAck;

        /** 滚动公告 */
        public static ScrollMsg: ScrollMsg;

        /** 回放列表 */
        public static pokerRefreshhistoryMsgAck: PokerRefreshHistoryMsgAck;
    }
}