module FL {

    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase - MJGameData
     * @Description:  //麻将游戏数据
     * @Create: DerekWu on 2017/11/21 11:36
     * @Version: V1.0
     */
    export class MJGameData {

        /** 开始游戏返回结果【进入牌桌之后就返回，并不是开始打麻将】 */
        public static requestStartGameMsgAck: RequestStartGameMsgAck;

        /** 真正开始打麻将 */
        public static gameStartMsg: GameStartMsg;

        /** 打麻将结束信息（已废弃），界面展示一次的数据不用存储 */
        // public static playerGameOverMsgAck:PlayerGameOverMsgAck;

        /** 麻将游戏房间人数限制 */
        public static gameMaxNum: number = 4;

        /** 玩家信息 */
        public static playerInfo: { [tablePos: number]: SimplePlayer } = {};

        /** 玩家gps信息 */
        public static playerGps: { [tablePos: number]: UpdatePlayerGPSMsg } = {};

        /** 剩余牌的数量，用数据绑定实现更新 */
        public static cardLeftNum: BindAttr<number> = new BindAttr<number>(0);

        /** 麻将游戏状态 */
        public static mjGameState: EGameState = EGameState.NULL;

        /** 是否回放 */
        public static isReplay: boolean = false;

        /** 当前轮到的操作方向 */
        public static currOperationOrientation: PZOrientation = PZOrientation.UP;

        /** 玩家自己当前补花的数量，用来判断自动补花的时候是否需要播放动画 */
        public static myBuhuaNum: number = 0;

        /** 是否接收到胡牌信息 */
        public static isReceivedHuInfo: boolean = false;
        /** 剩余未出的牌数量*/
        public static restCards: { [cardValue: number]: number } = {};

        /** 是否开始播放鸟效果 */
        public static isStartNiaoEffect: boolean = false;
        /** 转转麻将鸟牌信息列表 */
        public static zhuanzhuanNiaoArray: Array<{ card: number, isZhong: boolean, pos: number }>;

        /** 牌局结算界面 */
        public static playerGameOverMsgAck: PlayerGameOverMsgAck;

        /** VIP结算 */
        public static vipRoomCloseMsg: VipRoomCloseMsg;

        /** 滚动公告 */
        public static ScrollMsg: ScrollMsg;

        /** 已经下好的坐拉跑信息 */
        public static zuoLaPaoInfo: { [tablePos: number]: PlayerZuoLaPaoInfo } = {};

        /** 已经下好的下码信息 */
        public static xiaMaInfo: { [tablePos: number]: number } = {};

    }

}