module FL {
    export class GamePlayer implements IBaseObject {
        public static readonly NAME: string = "com.linyun.xgamenew.core.game.base.GamePlayer";
        /** 序列化类的名字，用来序列化对象用，必须和服务端的类型对应 */
        public readonly sClassName: string = GamePlayer.NAME;
        //ID
        public playerID = "";//String
        /** 玩家游戏中昵称 **/
        public playerName = "";//String
        /** 头像索引 **/
        public headImg = 0;//int
        /** 头像的url */
        public headImageUrl = "";//String
        /** 性别 */
        public sex = 0;//int
        /** 索引号, 玩家的6位数ID */
        public playerIndex = 0;//int
        /** 玩家IP */
        public ip = "";//String
        /** 玩家街道地址 */
        public address = "";//String

        /** 牌桌编号0开始 */
        public tablePos = 0;//int
        /** 牌桌状态，是否坐在桌子上，0：切换到后台暂时离开；1：在桌上；2：等待继续游戏; 4:在大厅 */
        public tableState = 1;//int

        /** 玩家玩游戏的筹码，货币，比如0 金币，比如分数  */
        public chip = 0;//int

        /** 是否准备好了，默认为准备好了，有些游戏需要准备的 */
        public isReady: boolean = true;

        /** 中途获得的分数 */
        public zhongTuScore: number = 0;
        /** 分数兑换筹码的比例 （VIP场是1，金币场是金币的配置）*/
        public scoreChipRate: number = 1;

        /** 用户的是否连接断开 */
        public isLinkBreken: boolean = false;

        /** 玩家已经选择的人数模式，默认0 没有选择模式 */
        public selectedPlayerNumPattern: number = 0;

        public serialize(ar: ObjectSerializer): void {
            let self = this;
            self.playerID = ar.sString(self.playerID);
            self.playerName = ar.sString(self.playerName);
            self.headImg = ar.sInt(self.headImg);
            self.headImageUrl = ar.sString(self.headImageUrl);
            self.sex = ar.sInt(self.sex);
            self.playerIndex = ar.sInt(self.playerIndex);
            self.ip = ar.sString(self.ip);
            self.address = ar.sString(self.address);
            self.tablePos = ar.sInt(self.tablePos);
            self.tableState = ar.sInt(self.tableState);
            self.chip = ar.sInt(self.chip);
            self.isReady = ar.sBoolean(self.isReady);
            self.zhongTuScore = ar.sInt(self.zhongTuScore);
            self.scoreChipRate = ar.sInt(self.scoreChipRate);
            self.isLinkBreken = ar.sBoolean(self.isLinkBreken);
            self.selectedPlayerNumPattern = ar.sInt(self.selectedPlayerNumPattern);
        }
    }
}