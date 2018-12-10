module FL {
    export class TeaHouseDeskInfo implements IBaseObject {
        public static readonly NAME: string = "com.linyun.xgamenew.domain.teahouse.TeaHouseDeskInfo";
        /** 序列化类的名字，用来序列化对象用，必须和服务端的类型对应 */
        public readonly sClassName: string = TeaHouseDeskInfo.NAME;
        /** 桌子序号 */
        public deskNum: number;//number
        /** 桌子ID*/
        public tableId: string;//string
        /** 玩家列表 */
        public playerList: Array<GamePlayer>;//List<GamePlayer>
        // 1.可加入  2.正在游戏
        public tableState;
        /** 凳子数量*/
        public totalPlNum;
        /** 打到第几局了*/
	    public curentRound: number;
        /** 总局数 */
        public totalRound: number;

        public serialize(ar: ObjectSerializer): void {
            let self = this;
            self.deskNum = ar.sInt(self.deskNum);
            self.tableId = ar.sString(self.tableId);
            self.playerList = <Array<GamePlayer>>ar.sObjArray(self.playerList);
            self.tableState = ar.sInt(self.tableState);
            self.totalPlNum = ar.sInt(self.totalPlNum);
            self.curentRound = ar.sInt(self.curentRound);
            self.totalRound = ar.sInt(self.totalRound);
        }
    }
}