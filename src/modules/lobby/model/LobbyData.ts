module FL {
    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase - LobbyData
     * @Description:  //大厅数据
     * @Create: DerekWu on 2017/11/11 14:08
     * @Version: V1.0
     */
    export class LobbyData {

        /** 玩家显示数据 */
        public static playerVO: PlayerVO;
        //客户端配置
        public static clientConfig: Array<SystemConfigPara>;

        /** 跑马灯提示 */
        public static anounceMsgText: string;
        /** 是否有登陆公告要显示 */
        public static noticeIsExit: number;
        /** 标题 */
        public static noticeTitle: string;
        /** 内容 */
        public static noticeContent: string;
        /** 限免开房 */
        public static freeGame: number;

        /** 玩家公网 playerPublicIp */
        public static playerPublicIp: string;

        public static handsDefintions: number;
        /** 麻将返回几局几钻*/
        public static diamondCosts: number;

        /** 大厅茶楼列表数据 */
        public static teaHouseListData: TeaHouse[] = [];

        /** 麻将创建房间需要钻石，列表结构：局数、消耗钻石数、局数、消耗钻石数、局数、消耗钻石数... */
        public static mahjongNeedDiamond: Array<number> = null;
        /** 扑克创建房间需要钻石，列表结构：局数、消耗钻石数、局数、消耗钻石数、局数、消耗钻石数... */
        public static pokerNeedDiamond: Array<number> = null;
        /** 字牌创建房间需要钻石，列表结构：局数、消耗钻石数、局数、消耗钻石数、局数、消耗钻石数... */
        public static zipaiNeedDiamond: Array<number> = null;

        public static verifyRealInfo: number = 0;
    }
}