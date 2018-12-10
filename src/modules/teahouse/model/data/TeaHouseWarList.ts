module FL {
    export class TeaHouseWarList implements IBaseObject {
        public static readonly NAME: string = "com.linyun.xgamenew.domain.teahouse.TeaHouseWarList";
        /** 序列化类的名字，用来序列化对象用，必须和服务端的类型对应 */
        public readonly sClassName: string = TeaHouseWarList.NAME;
        // 头像
        public headUrl;
        // 昵称
        public name;
        // ID
        public playerIndex;
        // 大赢家次数
        public bigWinCount;
        // 总积分
        public score;
        // 时间
        public time: dcodeIO.Long;
        // 总场次
        public totalCount: number;

        public serialize(ar: ObjectSerializer): void {
            let self = this;
            self.headUrl = ar.sString(self.headUrl);
            self.name = ar.sString(self.name);
            self.playerIndex = ar.sInt(self.playerIndex);
            self.bigWinCount = ar.sInt(self.bigWinCount);
            self.score = ar.sInt(self.score);
            self.time = ar.sLong(self.time);
            self.totalCount = ar.sInt(self.totalCount);
        }
    }
}