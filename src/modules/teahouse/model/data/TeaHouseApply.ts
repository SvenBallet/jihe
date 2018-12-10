module FL {
    export class TeaHouseApply implements IBaseObject {
        public static readonly NAME: string = "com.linyun.xgamenew.domain.teahouse.TeaHouseApply";
        /** 序列化类的名字，用来序列化对象用，必须和服务端的类型对应 */
        public readonly sClassName: string = TeaHouseApply.NAME;
        //ID
        public applyId: dcodeIO.Long;
        //茶楼ID
        public teaHouseId;
        //玩家ID
        public playerIndex;
        //玩家名称
        public playerName: string;
        //头像
        public headImageUrl: string;

        public serialize(ar: ObjectSerializer): void {
            let self = this;
            self.applyId = ar.sLong(self.applyId);
            self.teaHouseId = ar.sInt(self.teaHouseId);
            self.playerIndex = ar.sInt(self.playerIndex);
            self.playerName = ar.sString(self.playerName);
            self.headImageUrl = ar.sString(self.headImageUrl);
        }
    }
}