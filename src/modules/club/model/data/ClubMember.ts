module FL {
    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase - ClubMember
     * @Description: 俱乐部成员信息序列化类
     * @Create: HoyeLee on 2018/3/10 18:55
     * @Version: V1.0
     */

    export class ClubMember implements IBaseObject {
        public static readonly NAME: string = "com.linyun.xgame.domain.ClubMember";
        /** 序列化类的名字，用来序列化对象用，必须和服务端的类型对应 */
        public readonly sClassName: string = ClubMember.NAME;
        public memberId: dcodeIO.Long = dcodeIO.Long.ZERO;
        public clubId: number;
        public playerIndex: number;
        public playerName: string;
        public level: number;
        public score: dcodeIO.Long = dcodeIO.Long.ZERO;
        public joinTime: number;
        public lastLoginTime: number;
        public valid: number;

        //积分排名
        public order: number = 0;

        public serialize(ar: ObjectSerializer): void {
            let self = this;
            self.memberId = ar.sLong(self.memberId);
            self.clubId = ar.sInt(self.clubId);
            self.playerIndex = ar.sInt(self.playerIndex);
            self.playerName = ar.sString(self.playerName);
            self.level = ar.sInt(self.level);
            self.score = ar.sLong(self.score);
            self.joinTime = ar.sDouble(self.joinTime);
            self.lastLoginTime = ar.sDouble(self.lastLoginTime);
            //
            self.order = ar.sInt(self.order);
        }

    }
}