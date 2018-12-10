module FL {
    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase - ClubOperationLog
     * @Description: 
     * @Create: HoyeLee on 2018/3/12 15:56
     * @Version: V1.0
     */export class ClubOperationLog implements IBaseObject {
        public static readonly NAME: string = "com.linyun.xgame.domain.ClubOperationLog";
        /** 序列化类的名字，用来序列化对象用，必须和服务端的类型对应 */
        public readonly sClassName: string = ClubOperationLog.NAME;

        private logId: string;
        private clubId: number;
        private playerIndex: number;
        private detail: string;
        private date: number;
        // private date: dcodeIO.Long = dcodeIO.Long.ZERO;

        public serialize(ar: ObjectSerializer): void {
            let self = this;
            self.playerIndex = ar.sInt(self.playerIndex);
            self.detail = ar.sString(self.detail);
            // self.date = ar.sLong(self.date);
            self.date = ar.sDouble(self.date);
            
        }
    }
}