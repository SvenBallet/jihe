module FL {

    export class PlayerOperationLog implements IBaseObject {

        public static readonly NAME:string = "com.linyun.base.domain.PlayerOperationLog";

        /** 序列化类的名字，用来序列化对象用，必须和服务端的类型对应 */
        public readonly sClassName: string = PlayerOperationLog.NAME;

        /** 行为涉及到的钱或物品的数量*/
        private opGold:number=0;

        /** 操作类型 */
        private operationType:number=0;
        private operationSubType:number=0;
        /** 玩家金币数量 */
        private playerGold:number=0;
        /** 操作细节 */
        private opDetail:string="";
        private dateStr:string="";


        public serialize(ar:ObjectSerializer):void {
            let self = this;
            self.playerGold = ar.sInt(self.playerGold);
            self.opGold = ar.sInt(self.opGold);
            self.operationType = ar.sInt(self.operationType);
            self.operationSubType = ar.sInt(self.operationSubType);
            self.dateStr = ar.sString(self.dateStr);
            self.opDetail = ar.sString(self.opDetail);
        }

    }
}