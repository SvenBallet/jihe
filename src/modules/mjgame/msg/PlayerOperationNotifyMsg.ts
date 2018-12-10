module FL {
    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase - PlayerOperationNotifyMsg
     * @Description:  //游戏服务器通知客户端，轮到玩家操作了
     * @Create: DerekWu on 2017/11/14 20:24
     * @Version: V1.0
     */
    export class PlayerOperationNotifyMsg extends NetMsgBase {

        public operation:number;
        public player_table_pos:number;
        public chi_card_value:number;
        public peng_card_value:number; // 确认胡牌中 中鸟5个之后的其他
        public target_card:number;
        public cardLeftNum:number;//剩余多少张牌
        //吃听标识位
        public chi_flag:number; // 确认胡牌中 中鸟前5个

        //打出哪些牌可以听
        public tingList:Array<number>;

        constructor() {
            super(MsgCmdConstant.MSG_GAME_PLAYER_OPERATION_NOTIFY);
        }

        public serialize(ar:ObjectSerializer):void {
            super.serialize(ar);
            let self = this;
            //
            self.operation=ar.sInt(self.operation);
            self.player_table_pos=ar.sInt(self.player_table_pos);
            //
            self.chi_card_value=ar.sInt(self.chi_card_value);
            self.peng_card_value=ar.sInt(self.peng_card_value);

            self.target_card=ar.sInt(self.target_card);
            self.cardLeftNum=ar.sInt(self.cardLeftNum);

            self.chi_flag = ar.sInt(self.chi_flag);
            //
            self.tingList=<Array<number>>ar.sByteArray(self.tingList);
        }

        /**
         * 是否包含这个操作
         * @param {number} pOperation
         * @returns {boolean}
         */
        public hasOperation(pOperation:number):boolean {
            return (this.operation&pOperation) === pOperation;
        }

    }
}