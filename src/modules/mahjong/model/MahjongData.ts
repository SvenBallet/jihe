module FL {

    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase - MahjongData
     * @Description:  //麻将游戏数据
     * @Create: DerekWu on 2017/11/21 11:36
     * @Version: V1.0
     */
    export class MahjongData {

        /** 开始游戏返回结果【进入牌桌之后就返回，并不是开始打麻将】 */
        public static requestStartGameMsgAck: NewIntoGameTableMsgAck;

        /** 真正开始打麻将 */
        public static gameStartMsg: MahjongStartCircleGameMsgAck;

        /** 麻将游戏房间人数限制 */
        public static gameMaxNum: number = 4;

        /** 玩家信息 */
        public static playerInfo: { [playerPos: number]: GamePlayer } = {};

        /** 玩家gps信息 */
        public static playerGps: { [playerPos: number]: NewUpdateGPSPositionMsgAck } = {};

        /** 剩余牌的数量，用数据绑定实现更新 */
        public static cardLeftNum: BindAttr<number> = new BindAttr<number>(0);

        /** 麻将游戏状态 */
        public static mjGameState: EGameState = EGameState.NULL;

        /** 玩家操作时间 */
        public static playerOpTime: number = 0;

        /** 是否回放 */
        public static isReplay: boolean = false;

        /** 当前轮到的操作方向 */
        public static currOperationOrientation: PZOrientation = PZOrientation.UP;

        /** 玩家自己当前补花的数量，用来判断自动补花的时候是否需要播放动画 */
        public static myBuhuaNum: number = 0;

        /** 是否接收到胡牌信息 */
        public static isReceivedHuInfo: boolean = false;

        /** 剩余未出的牌数量,去掉手里牌的数量*/
        public static restCards: { [cardValue: number]: number } = {};

        /** 玩家听牌信息,打出去可以听的牌上的一个箭头要包含的信息*/
        public static tingCardInfoList:Array<MahjongSelectPlayCardTingInfo>;
        /** 带胡字和胡牌的列表信息*/
        public static huCardInfoList:Array<MahjongTingInfo>;

        /** 吃碰杠动作列表*/
        public static actionList:{ [actionId: number]: number } = {};

        /** 是否开始播放鸟效果 */
        public static isStartNiaoEffect: boolean = false;
        /** 长沙麻将鸟牌信息列表 */
        public static changshaNiaoArray: Array<{ card: number, isZhong: boolean, pos: number }>;

        /** 游戏结束消息 */
        public static gameOverMsgAck: MahjongGameOverMsgAck;

        /** 收到麻将游戏结束消息得时候是否可以直接打开结束界面 */
        public static isCanShowGameOverViewByOverMsg: boolean = false;

        /** VIP结算 */
        public static vipRoomCloseMsg: NewVipRoomOverSettleAccountsMsgAck;

        /** 滚动公告 */
        public static ScrollMsg: ScrollMsg;

        /** 已经选好的飘分信息 */
        public static piaoFenInfo: { [tablePos: number]: number } = {};
        /** 是否是自己拿到的第一手手牌，如果是则循环一遍算好剩余牌数，不是的话不再计算剩余牌数*/
        public static isMyFirstHandCards:boolean = false;
        /** 是否刚进入游戏, 包括断线重连*/
        public static isFirstEnter:boolean = false;
        /** 上一个吃碰杠操作的玩家*/
        public static lastActionPZoriatation: PZOrientation = PZOrientation.UP;

        /** 是否需要准备 */
        public static isNeedReady: boolean = false;

        /** 我的最后摸牌消息，只有在我自己自动出牌时，并且有动作的时候才会设置值 */
        public static thisMyMahjongMoOneCardMsgAck: MahjongMoOneCardMsgAck;

        /** 最后出的牌 */
        public static lastChuCard: number = 0;
    }

}