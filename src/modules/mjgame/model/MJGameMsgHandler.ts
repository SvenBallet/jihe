module FL {
    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase - MJGameMsgHandler
     * @Description:  //麻将游戏消息处理
     * @Create: DerekWu on 2017/12/1 17:31
     * @Version: V1.0
     */
    export class MJGameMsgHandler {

        /**
         * 发送玩家操作消息
         * @param {number} operation
         * @param {number} cardValue
         */
        private static sendPlayerTableOperationMsg(operation:number, cardValue:number):void {
            let vPlayerTableOperationMsg:PlayerTableOperationMsg = new PlayerTableOperationMsg();
            vPlayerTableOperationMsg.operation = operation;
            vPlayerTableOperationMsg.card_value = cardValue;
            vPlayerTableOperationMsg.player_table_pos = MJGameHandler.getTablePos(PZOrientation.DOWN);
            ServerUtil.sendMsg(vPlayerTableOperationMsg);
        }


        public static sendPlayCardMsg(playCardIndex:number,cardValue:number):void {
            let vMahjongPlayCardMsg:MahjongPlayCardMsg = new MahjongPlayCardMsg();
            vMahjongPlayCardMsg.playCardIndex = playCardIndex;
            vMahjongPlayCardMsg.playCard = cardValue;
            vMahjongPlayCardMsg.playerPos = MahjongHandler.getTablePos(PZOrientation.DOWN);
            ServerUtil.sendMsg(vMahjongPlayCardMsg);
        }


        /**
         * 玩家选择的动作
         * @param {number} actionId
         */
        public static sendMahjongActionSelectMsg(actionId:number):void{
            let vMahjongActionSelectMsg:MahjongActionSelectMsg = new MahjongActionSelectMsg();
            vMahjongActionSelectMsg.selectActionId = actionId;
            ServerUtil.sendMsg(vMahjongActionSelectMsg);
        }

        /**
         * 发送出牌消息给服务器
         * @param {number} cardValue
         */
        public static sendChuCardMsg(cardValue:number):void {
            this.sendPlayerTableOperationMsg(GameConstant.MAHJONG_OPERTAION_CHU, cardValue);
        }

        /**
         * 发送吃牌消息给服务器
         * @param {number} cardValue
         */
        public static sendChiMsg(cardValue:number):void {
            this.sendPlayerTableOperationMsg(GameConstant.MAHJONG_OPERTAION_CHI, cardValue);
        }

        /**
         * 发送碰牌消息给服务器
         * @param {number} cardValue
         */
        public static sendPengMsg(cardValue:number):void {
            this.sendPlayerTableOperationMsg(GameConstant.MAHJONG_OPERTAION_PENG, cardValue);
        }

        /**
         * 发送明杠消息给服务器
         * @param {number} cardValue
         */
        public static sendMingGaneMsg(cardValue:number):void {
            this.sendPlayerTableOperationMsg(GameConstant.MAHJONG_OPERTAION_MING_GANG, cardValue);
        }

        /**
         * 发送听牌消息给服务器
         */
        public static sendTingMsg():void {
            this.sendPlayerTableOperationMsg(GameConstant.MAHJONG_OPERTAION_TING, 0);
        }

        /**
         * 发送胡牌消息给服务器
         */
        public static sendHuMsg():void {
            this.sendPlayerTableOperationMsg(GameConstant.MAHJONG_OPERTAION_HU, 0);
        }

        /**
         * 发送取消吃碰杠听胡操作消息
         */
        public static sendCancelOperationMsg():void {
            this.sendPlayerTableOperationMsg(GameConstant.MAHJONG_OPERTAION_CANCEL, 0);
        }

    }
}