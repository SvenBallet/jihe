module FL {
    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase - PlayerOperationDesc
     * @Description:  // 游戏日志中的玩家操作描述 序列化类
     * @Create: DerekWu on 2018/1/17 17:06
     * @Version: V1.0
     */
    export class PlayerOperationDesc implements IBaseObject {

        public static readonly NAME: string = "com.linyun.xgame.domain.PlayerOperationDesc";
        /** 序列化类的名字，用来序列化对象用，必须和服务端的类型对应 */
        public readonly sClassName: string = PlayerOperationDesc.NAME;

        //
        public tablePos: number = 0;
        public opCode: number = 0;
        public opValue1: number = 0;
        public opValue2: number = 0;
        public cardLeftNum: number = 0;
        public opStr: string = "";
        public vlist: Array<number>;

        // public keyList:Array<number>;


        public serialize(ar: ObjectSerializer): void {
            let self = this;
            self.tablePos = ar.sInt(self.tablePos);
            self.opCode = ar.sInt(self.opCode);
            self.opValue1 = ar.sInt(self.opValue1);
            self.opValue2 = ar.sInt(self.opValue2);
            self.cardLeftNum = ar.sInt(self.cardLeftNum);
            self.opStr = ar.sString(self.opStr);
            self.vlist = ar.sIntArray(self.vlist);
            //		keyList = (List<Integer>) ar.sIntArray(keyList);
        }
    }
}