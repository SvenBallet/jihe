module FL {
    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase - ClubApply
     * @Description: 申请列表信息序列化类
     * @Create: HoyeLee on 2018/3/13 18:17
     * @Version: V1.0
     */
    export class ClubApply implements IBaseObject {
        public static readonly NAME: string = "com.linyun.xgame.domain.ClubApply";

        /** 序列化类的名字，用来序列化对象用，必须和服务端的类型对应 */
        public readonly sClassName: string = ClubApply.NAME;
        public applyId: dcodeIO.Long = dcodeIO.Long.ZERO;//long
        // public applyId: number;//long        
        public clubId: number;
        public playerIndex: number;
        public playerName: string;
        public applyTime: number;//Date

        public serialize(ar: ObjectSerializer): void {
            let self = this;
            self.applyId = ar.sLong(self.applyId);
            // self.applyId = ar.sDouble(self.applyId);
            self.clubId = ar.sInt(self.clubId);
            self.playerIndex = ar.sInt(self.playerIndex);
            self.playerName = ar.sString(self.playerName);
            self.applyTime = ar.sDouble(self.applyTime);
        }
    }
}