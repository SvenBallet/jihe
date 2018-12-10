module FL {

    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase - PlayerVO
     * @Description:  //玩家显示数据对象
     * @Create: DerekWu on 2017/11/11 15:28
     * @Version: V1.0
     */
    export class PlayerVO {

        /** 玩家字符串ID */
        public readonly playerID: string;
        /** 玩家数字ID 玩家索引号，类似于QQ号，系统唯一 1000 是默认值，如果玩家的值为1000的话，则表示他是老玩家需重新分配号码 */
        public readonly playerIndex: number;
        public readonly account: string;
        /** 玩家名字 */
        public readonly playerName: string;
        /** 头像 */
        public readonly headImageUrl: string;

        /** 玩家金币数量 */
        public readonly gold: BindAttr<number>;
        /** 玩家钻石数量 */
        public readonly diamond: BindAttr<number>;
        /** 玩家类型 */
        public playerType: number;
        /** 上级玩家ID*/
        public parentIndex: number;

        /** 积分*/
        public score: BindAttr<number>;
        /** 胜利记录*/
        public wons: BindAttr<number>;
        /** 失败记录*/
        public loses: BindAttr<number>;
        /** 逃跑记录*/
        public escape: BindAttr<number>;
        /** 返利*/
        public payBack: number;
        /** 新增代理等级*/
        public agentLevel: number;
        /** 邀请码*/
        public inviteCode: number = 0;


        /** 微信分享获得钻石数量 */
        public weChatShareGetDiamondCount: number = 0;


        constructor(player: Player) {
            this.playerID = player.playerID;
            this.playerIndex = player.playerIndex;
            this.account = player.account;
            this.playerName = player.playerName;
            this.headImageUrl = player.headImageUrl;
            this.playerType = player.playerType;
            this.parentIndex = player.parentIndex;
            this.payBack = player.payBack;
            this.agentLevel = player.agentLevel;
            this.inviteCode = player.inviteCode;
            this.gold = new BindAttr<number>(player.gold);
            this.diamond = new BindAttr<number>(player.diamond);
            this.score = new BindAttr<number>(player.score);
            this.wons = new BindAttr<number>(player.wons);
            this.loses = new BindAttr<number>(player.loses);
            this.escape = new BindAttr<number>(player.escape);
        }

    }

}