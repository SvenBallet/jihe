module FL {
    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase - AgentDaiKaiInfo
     * @Description:  俱乐部代开房
     * @Create: ArielLiang on 2018/3/15 19:53
     * @Version: V1.0
     */
    export class AgentDaiKaiInfo implements IBaseObject {

        public static readonly NAME:string = "com.linyun.base.domain.AgentDaiKaiInfo";

        /** 序列化类的名字，用来序列化对象用，必须和服务端的类型对应 */
        public readonly sClassName: string = AgentDaiKaiInfo.NAME;
        /**
         * 房间代号
         */
        public tableId: number = 0;


        public primaryType: number = 0;

        /**
         * 圈数
         */
        public quanNum: number = 0;

        /**
         * 玩家人数
         */
        public playerNum: number = 0;

        /**
         * 在线玩家人数
         */
        public onlinePlayerNum: number = 0;

        /**
         * 主玩法
         */
        public MainGamePlayRule: number = 0;

        /**
         * 子玩法
         */
        public MinorGamePlayRuleList: Array<number> = new Array<number>();

        public playerList: Array<SimplePlayer> = new Array<SimplePlayer>();


        public serialize(ar: ObjectSerializer): void {
            let self = this;
            self.tableId = ar.sInt(self.tableId);
            self.primaryType = ar.sInt(self.primaryType);
            self.quanNum = ar.sInt(self.quanNum);
            self.playerNum = ar.sInt(self.playerNum);
            self.onlinePlayerNum = ar.sInt(self.onlinePlayerNum);
            self.MainGamePlayRule = ar.sInt(self.MainGamePlayRule);
            self.MinorGamePlayRuleList = ar.sIntArray(self.MinorGamePlayRuleList);
            self.playerList = <Array< SimplePlayer>>ar.sObjArray(self.playerList);
        }
    }
        
}