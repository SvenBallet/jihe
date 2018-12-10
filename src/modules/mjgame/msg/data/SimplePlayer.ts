module FL {
    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase - SimplePlayer
     * @Description:  //对战发给客户端的
     * @Create: DerekWu on 2017/11/14 18:58
     * @Version: V1.0
     */
    export class SimplePlayer implements IBaseObject {

        public static readonly NAME: string = "com.linyun.base.domain.SimplePlayer";
        /** 序列化类的名字，用来序列化对象用，必须和服务端的类型对应 */
        public readonly sClassName: string = SimplePlayer.NAME;

        //ID
        public playerID: string = "";

        /**玩家游戏中昵称**/
        public playerName: string = "";

        /**头像索引**/
        public headImg: number;
        public headImgUrl: string = "";
        /** 玩家货币0 金币*/
        public gold: number;

        public tablePos: number;

        /**性别*/
        public sex: number;

        /**索引号,类似qq号*/
        public palyerIndex: number;

        public desc: string = "";

        public fan: number;//输赢的番
        //牌局结局
        public gameResult: number;

        //是否可以加为好友
        public canFriend: number;

        /** 是否坐在桌子上，1：在桌上；0：在大厅或者离线；2：离开了  */
        public inTable: number;

        /**VIP房间统计数据*/
        public zhuangCount = 0;
        public winCount = 0;
        public dianpaoCount = 0;
        public hitHorseCount = 0;
        public gangCount = 0;

        public ip = "";
        public gameState: number;
        public zhongNiaoCount: number = 0;

        public serialize(ar: ObjectSerializer): void {
            let self = this;
            self.playerID = ar.sString(self.playerID);
            self.playerName = ar.sString(self.playerName);
            self.headImg = ar.sInt(self.headImg);
            self.headImgUrl = ar.sString(self.headImgUrl);
            self.sex = ar.sInt(self.sex);
            self.palyerIndex = ar.sInt(self.palyerIndex);
            self.gold = ar.sInt(self.gold);
            self.tablePos = ar.sInt(self.tablePos);
            self.desc = ar.sString(self.desc);
            self.fan = ar.sInt(self.fan);
            self.gameResult = ar.sInt(self.gameResult);
            self.canFriend = ar.sInt(self.canFriend);
            self.inTable = ar.sInt(self.inTable);

            self.zhuangCount = ar.sInt(self.zhuangCount);
            self.winCount = ar.sInt(self.winCount);
            self.dianpaoCount = ar.sInt(self.dianpaoCount);
            self.hitHorseCount = ar.sInt(self.hitHorseCount);
            self.gangCount = ar.sInt(self.gangCount);
            self.ip = ar.sString(self.ip);
            self.gameState = ar.sInt(self.gameState);
            self.zhongNiaoCount = ar.sInt(self.zhongNiaoCount);
        }

    }
}