module FL {
    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase - GameRoom
     * @Description:  //游戏房间
     * @Create: DerekWu on 2017/11/10 14:57
     * @Version: V1.0
     */
    export class GameRoom implements IBaseObject {

        public static readonly NAME:string = "com.linyun.xgame.domain.GameRoom";
        /** 序列化类的名字，用来序列化对象用，必须和服务端的类型对应 */
        public readonly sClassName: string = GameRoom.NAME;

        public roomID:number;
        public price:number; // 多少金币的场
        public minGold:number; // 最低携带量
        public maxGold:number; // 最高携带量
        public roomType:number; // 1初级场，2中级，3高级，4vip，5单机

        private playerNum:number; //玩家
        private fixedGold:number; // VIP房间固定带入金币
        public supportNewPlayWay:number;// 是否支持新的玩法sd

        public serialize(ar:ObjectSerializer):void {
            let self = this;
            self.roomID = ar.sInt(self.roomID);
            self.price = ar.sInt(self.price);
            self.minGold = ar.sInt(self.minGold);
            self.maxGold = ar.sInt(self.maxGold);
            self.roomType = ar.sInt(self.roomType);
            self.playerNum = ar.sInt(self.playerNum);
            self.fixedGold = ar.sInt(self.fixedGold);
            self.supportNewPlayWay = ar.sInt(self.supportNewPlayWay);
        }

    }
}