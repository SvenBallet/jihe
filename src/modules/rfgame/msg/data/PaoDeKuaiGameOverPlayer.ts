module FL {
    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase - PaoDeKuaiGameOverPlayer
     * @Description:  跑得快游戏结束信息
     * @Create: ArielLiang on 2018/4/23 15:39
     * @Version: V1.0
     */
    export class PaoDeKuaiGameOverPlayer implements IBaseObject {

        public static readonly NAME: string = "com.linyun.xgamenew.domain.poker.paodekuai.PaoDeKuaiGameOverPlayer";
        /** 序列化类的名字，用来序列化对象用，必须和服务端的类型对应 */
        public readonly sClassName: string = PaoDeKuaiGameOverPlayer.NAME;

        /** 玩家所在的牌桌位置 */
        public tablePos:number = 0;

        /** 玩家游戏中昵称 **/
        public playerName:string = "";
        /** 头像索引 **/
        public headImg:number = 0;
        /** 头像的url */
        public headImageUrl:string = "";

        /** 是否春天 */
        public isChunTian:boolean = false;

        /** 是否红10 */
        public redTen:boolean = false;

        /** 剩余牌数 */
        public leftCardNum:number = 0;

        /** 炸弹数 */
        public zhaDanNum:number = 0;

        /** 分数 */
        public score:number = 0;

        /** 玩家手牌列表 */
        public handCards: Array<number> = [];

        /** 玩家已经打出的牌列表（所有牌） */
        public chuCards: Array<number> = [];

        public serialize(ar:ObjectSerializer):void {
            let self = this;
            self.tablePos = ar.sByte(self.tablePos);
            self.playerName = ar.sString(self.playerName);
            self.headImg = ar.sInt(self.headImg);
            self.headImageUrl = ar.sString(self.headImageUrl);
            self.isChunTian = ar.sBoolean(self.isChunTian);
            self.redTen = ar.sBoolean(self.redTen);
            self.leftCardNum = ar.sInt(self.leftCardNum);
            self.zhaDanNum = ar.sInt(self.zhaDanNum);
            self.score = ar.sInt(self.score);
            self.handCards = <Array<number>>ar.sByteArray(self.handCards);
            self.chuCards = <Array<number>>ar.sByteArray(self.chuCards);
        }
    }
}