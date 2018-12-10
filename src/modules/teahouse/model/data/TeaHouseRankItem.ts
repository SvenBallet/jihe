module FL {
    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase - TeaHouseRankList
     * @Description:  //
     * @Create: DerekWu on 2018/9/13 17:50
     * @Version: V1.0
     */
    export class TeaHouseRankItem implements IBaseObject {

        public static readonly NAME: string = "com.linyun.xgamenew.domain.teahouse.TeaHouseRankItem";
        /** 序列化类的名字，用来序列化对象用，必须和服务端的类型对应 */
        public readonly sClassName: string = TeaHouseRankItem.NAME;

        //排名
        public rankNo: number = 0;
        //玩家ID
        public playerIndex: number = 0;
        //玩家名字
        public playerName: string;
        //分数
        public sumScore: number = 0;
        //总场次
        public sumPlayNum: number = 0;
        //大赢家次数
        public sumBigWinNum: number = 0;

        public serialize(ar: ObjectSerializer): void {
            let self = this;
            self.rankNo = ar.sInt(self.rankNo);
            self.playerIndex = ar.sInt(self.playerIndex);
            self.playerName = ar.sString(self.playerName);
            self.sumScore = ar.sInt(self.sumScore);
            self.sumPlayNum = ar.sInt(self.sumPlayNum);
            self.sumBigWinNum = ar.sInt(self.sumBigWinNum);
        }
    }
}