module FL {
    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase - PlayerTableOperationMsg
     * @Description:  //游戏服务器通知客户端，轮到玩家操作了
     * @Create: DerekWu on 2017/11/14 20:44
     * @Version: V1.0
     */
    export class PlayerTableOperationMsg extends NetMsgBase {

        public operation:number;
        public player_table_pos:number;
        public card_value:number;
        public opValue:number;
        public cardLeftNum:number;//剩余多少张牌
        public chuOffset:number;//谁家出牌导致的这个行为，比如碰杠，谁出的牌，-1上家，0对家，1下家

        //用于刷新玩家牌数据，防止客户端、服务端数据不一致
        public handCards:Array<number>;  //出牌玩家手牌
        public beforeCards:Array<number>;	//出牌玩家已经打出的牌
        public downCards:Array<CardDown>;	//出牌玩家吃、碰牌
        //
        // public tempPl:Player=null;

        constructor() {
            super(MsgCmdConstant.MSG_GAME_PLAYER_TABLE_OPERATION);
        }

        public serialize(ar:ObjectSerializer):void {
            super.serialize(ar);
            let self = this;
            //
            self.operation=ar.sInt(self.operation);
            self.player_table_pos=ar.sInt(self.player_table_pos);
            self.card_value=ar.sInt(self.card_value);
            //
            self.opValue=ar.sInt(self.opValue);
            self.cardLeftNum=ar.sInt(self.cardLeftNum);
            self.chuOffset=ar.sInt(self.chuOffset);
            //
            self.handCards=<Array<number>>ar.sByteArray(self.handCards);
            self.beforeCards=<Array<number>>ar.sByteArray(self.beforeCards);
            self.downCards=<Array<CardDown>>ar.sObjArray(self.downCards);
        }

    }
}