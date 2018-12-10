module FL {

    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase_ChangSha - MahjongProxy
     * @Description:  麻将游戏代理
     * @Create: ArielLiang on 2018/5/31 11:59
     * @Version: V1.0
     */
    export class MahjongProxy extends puremvc.Proxy {

        /** 代理名 */
        public static readonly NAME: string = "MahjongProxy";
        /** 单例 */
        private static instance: MahjongProxy;

        /** 每秒定时器 */
        private _secondTicker: Game.Timer;

        /** 游戏当前进入后台的离线状态 */
        // private _isExeGameIntoBack:boolean = false;
        /**麻将托管状态 */
        public static tuoGuanState: boolean = false;

        private constructor() {
            super(MahjongProxy.NAME);
        }

        public static getInstance(): MahjongProxy {
            if (!this.instance) {
                let vNewMJGameProxy = new MahjongProxy();
                this.instance = vNewMJGameProxy;
            }
            return this.instance;
        }

        /**
         * 是否可以接收服务端的消息
         * @returns {boolean}
         */
        private isCanReceiveServerMsg(): boolean {
            return !GameConstant.CURRENT_HANDLE.isReplay() && GameConstant.CURRENT_HANDLE.getGameState() !== EGameState.NULL;
        }

        public exeMahjongPlayCardMsgAck1(msg:MahjongPlayCardMsgAck):void{
            if (this.isCanReceiveServerMsg()) {
                this.exeMahjongPlayCardMsgAck(msg);
            }
        }

        public exeMahjongPlayCardMsgAck(msg:MahjongPlayCardMsgAck):void{

            ReqLoadingViewUtil.delReqLoadingView();

            // egret.log(msg);
            // 设置剩余的牌
            MahjongData.cardLeftNum.value = msg.totalCardLeftNum;

            // 不是我自己的话播放特效和音效,托管状态播放自己的出牌音效
            let vPZOrientation = MahjongHandler.getPZOrientation(msg.playerPos);
            // if ((vPZOrientation !== PZOrientation.DOWN) || MahjongProxy.tuoGuanState || GameConstant.CURRENT_HANDLE.isReplay()) {
            if (vPZOrientation !== PZOrientation.DOWN || MahjongProxy.tuoGuanState || GameConstant.CURRENT_HANDLE.isReplay()) {
                MvcUtil.send(MahjongModule.MAHJONG_PLAY_CHU_PAI_EFFECT, {
                    playerPos:msg.playerPos,
                    playCard:msg.playCard
                });
                // 出牌到中间
                MvcUtil.send(MahjongModule.MAHJONG_CHU_PAI_NOTIFY,msg);
            } else {
                // 自己出牌清空最后出的牌
                MahjongHandler.setLastChuCard(0);
            }
            // 刷新手牌
            MvcUtil.send(MahjongModule.MAHJONG_REFRESH_HAND_CARD,{
                tablePos: msg.playerPos,
                handCards: msg.handCards
            });
        }

        public exeMahjongMoOneCardMsgAck1(msg:MahjongMoOneCardMsgAck):void{
            if (this.isCanReceiveServerMsg()) {
                this.exeMahjongMoOneCardMsgAck(msg);
            }
        }

        public exeMahjongMoOneCardMsgAck(msg:MahjongMoOneCardMsgAck):void{
            // 设置剩余的牌
            MahjongData.cardLeftNum.value = msg.totalCardLeftNum;
            MvcUtil.send(MahjongModule.MAHJONG_MO_PAI,msg);
        }

        public exeMahjongRemindPlayerOperationMsgAck1(msg:MahjongRemindPlayerOperationMsgAck):void{
            if (this.isCanReceiveServerMsg()) {
                this.exeMahjongRemindPlayerOperationMsgAck(msg);
            }
        }

        public exeMahjongRemindPlayerOperationMsgAck(msg:MahjongRemindPlayerOperationMsgAck):void{
            //egret.log(msg);
            MvcUtil.send(MahjongModule.MAHJONG_REMIND_CHU_PAI,msg);
            MahjongData.playerOpTime = Math.floor((msg.expirationTimes.toNumber() - ServerUtil.getServerTime()) / 1000);
            //提示玩家出牌
            MvcUtil.send(MahjongModule.MAHJONG_REMIND_PLAYER_HANDLE,msg.operationPlayerPos);
        }

        public exeMahjongStartCircleGameMsgAck1(msg:MahjongStartCircleGameMsgAck):void{
            if (MahjongHandler.isReplay() || !MahjongHandler.getRequestStartGameMsgAck()) {
                let vNewIntoOld: NewIntoOldGameTableMsg = new NewIntoOldGameTableMsg();
                ServerUtil.sendMsg(vNewIntoOld);
            } else {
                this.exeMahjongStartCircleGameMsgAck(msg);
            }
        }

        public exeMahjongStartCircleGameMsgAck(msg:MahjongStartCircleGameMsgAck):void{
            GameConstant.setCurrentGame(EGameType.MAHJONG);
            // 停止回放
            if(!MahjongHandler.isReplay()) MahjongLogReplay.endPlay();
            if(!RFGameHandle.isReplay()) RFGameLogReplay.endPlay();
            MahjongProxy.tuoGuanState = false;
            // egret.log(msg);
            if (!GameConstant.CURRENT_HANDLE.isReplay() && GameConstant.CURRENT_HANDLE.getGameState() === EGameState.NULL && !GlobalData.isIntoBack) {
                // 给服务器发送回到游戏消息
                let msg = new NewPlayerLeaveRoomMsg();
                msg.leaveFlag = 3;
                ServerUtil.sendMsg(msg);
            }
            //设置值
            MahjongData.gameStartMsg = msg;
            //标记状态，游戏中
            MahjongHandler.setGameState(EGameState.PLAYING);
            // 设置剩余的牌
            MahjongData.cardLeftNum.value = msg.cityWallInfo.cardLeftNum;
            //开局关闭自己触摸点击开关
            MahjongHandler.touchHandCardSwitch.close();
            //重置补花数量
            MahjongHandler.resetMyBuhuaNum();
            //当前手牌为第一手牌
            MahjongData.isMyFirstHandCards = true;
            MahjongData.isFirstEnter = true;

            //更新显示头像
            let num = msg.playerInfos.length;

            for (let i = 0; i < num; i++) {
                let vPZOrientation = MahjongHandler.getPZOrientation(i);
                MvcUtil.send(MahjongModule.MAHJONG_UPDATE_PLAYER_HEAD_AREA, vPZOrientation);
            }


            //开始游戏
            MvcUtil.send(MahjongModule.MAHJONG_START_GAME);

            //查询是否有人请求解散桌子
            // let vPlayerGameOpertaionMsg: PlayerGameOpertaionMsg = new PlayerGameOpertaionMsg();
            // vPlayerGameOpertaionMsg.opertaionID = GameConstant.GAME_OPERTAION_QUERY_TABLE_DISMISS;
            // ServerUtil.sendMsg(vPlayerGameOpertaionMsg);
        }

        public exeMahjongSendItemToChosenMsg1(msg:MahjongSendItemToChosenMsg):void{
            if (this.isCanReceiveServerMsg()) {
                this.exeMahjongSendItemToChosenMsg(msg);
            }
        }

        public exeMahjongSendItemToChosenMsg(msg:MahjongSendItemToChosenMsg):void{
            //egret.log(msg);
            if(msg.operateType == EMahjongChooseItem.PIAO_FEN){
                //标记状态，准备结束
                MahjongHandler.setGameState(EGameState.PLAYER_READY_OVER);
                MvcUtil.send(MahjongModule.MAHJONG_CHOOSE_PIAO);
            }
        }

        public exeMahjongPlayerChooseItemMsgAck1(msg:MahjongPlayerChooseItemMsgAck):void{
            if (this.isCanReceiveServerMsg()) {
                this.exeMahjongPlayerChooseItemMsgAck(msg);
            }
        }

        public exeMahjongPlayerChooseItemMsgAck(msg:MahjongPlayerChooseItemMsgAck):void{
            //egret.log(msg);
            for (let i:number = 0;i<msg.operInfoList.length;i++) {
                let playerPos:number = msg.operInfoList[i].playerPos;
                MahjongData.piaoFenInfo[playerPos] = msg.operInfoList[i].operValue;
                let pPZOrientation: PZOrientation = MahjongHandler.getPZOrientation(playerPos);
                MvcUtil.send(MahjongModule.MAHJONG_SHOW_PIAO,pPZOrientation);
            }
        }

        public exeMahjongSelectPlayCardTingMsgAck1(msg:MahjongSelectPlayCardTingMsgAck):void{
            if (this.isCanReceiveServerMsg()) {
                this.exeMahjongSelectPlayCardTingMsgAck(msg);
            }
        }

        public exeMahjongSelectPlayCardTingMsgAck(msg:MahjongSelectPlayCardTingMsgAck):void{
            //egret.log(msg);
            MahjongData.tingCardInfoList = msg.playCardTingInfoList;
            MvcUtil.send(MahjongModule.MAHJONG_UPDATE_TING_LIST, msg.playCardTingInfoList);
        }

        public exeMahjongChangeCardDownMsgAck1(msg:MahjongChangeCardDownMsgAck):void{
            if (this.isCanReceiveServerMsg()) {
                this.exeMahjongChangeCardDownMsgAck(msg);
            }
        }

        public exeMahjongChangeCardDownMsgAck(msg:MahjongChangeCardDownMsgAck): void {
            MvcUtil.send(MahjongModule.MAHJONG_CHANGE_CARD_DOWN, msg);
        }

        public exeMahjongAlreadyTingMsgAck1(msg:MahjongAlreadyTingMsgAck):void{
            if (this.isCanReceiveServerMsg()) {
                this.exeMahjongAlreadyTingMsgAck(msg);
            }
        }

        public exeMahjongAlreadyTingMsgAck(msg:MahjongAlreadyTingMsgAck):void{
            //egret.log(msg);
            MahjongData.tingCardInfoList = null;
            MahjongData.huCardInfoList = msg.tingList;
            MvcUtil.send(MahjongModule.MAHJONG_UPDATE_HU_LIST, msg.tingList);
        }

        public exeMahjongActionSelectMsgAck1(msg:MahjongActionSelectMsgAck):void{
            if (this.isCanReceiveServerMsg()) {
                this.exeMahjongActionSelectMsgAck(msg);
            }
        }

        public exeMahjongActionSelectMsgAck(msg:MahjongActionSelectMsgAck):void{
            MvcUtil.send(MahjongModule.MAHJONG_ACTION_EFFECT, msg);
        }

        public exeMahjongActionResultSetMsgAck1(msg:MahjongActionResultSetMsgAck):void{
            if (this.isCanReceiveServerMsg()) {
                this.exeMahjongActionResultSetMsgAck(msg);
            }
        }

        public exeMahjongActionResultSetMsgAck(msg:MahjongActionResultSetMsgAck):void{
            //egret.log(msg);
            MvcUtil.send(MahjongModule.MAHJONG_UPDATE_ACTION_LIST,msg.actionList);
        }

        /**
         * 处理麻将结束
         * @param {FL.MahjongGameOverMsgAck} msg
         */
        public exeMahjongGameOverMsgAck(msg:MahjongGameOverMsgAck): void {
            MahjongData.gameOverMsgAck = msg;
            if (MahjongData.isCanShowGameOverViewByOverMsg) {
                MvcUtil.send(MahjongModule.MAHJONG_OPEN_GAME_OVER_VIEW);
            }
        }

        /**
         * 刷新当前玩家自己的手牌（不包含吃碰杠的牌）（打牌出错之后使用）
         * @param {FL.MahjongGameOverMsgAck} msg
         */
        public exeMahjongRefreshHandCardMsgAck(msg:MahjongRefreshHandCardMsgAck): void {
            let vMyTablePos: number = MahjongHandler.getTablePos(PZOrientation.DOWN);
            MvcUtil.send(MahjongModule.MAHJONG_REFRESH_HAND_CARD,{
                tablePos: vMyTablePos,
                handCards: msg.handCards
            });
        }

        /**
         * 处理回放的摸牌
         * @param {FL.PlayerOperationDesc} pCurrOp
         */
        public exeReplayMoPai(pCurrOp: PlayerOperationDesc): void {
            MvcUtil.send(MahjongModule.MAHJONG_MO_PAI, { playerPos: pCurrOp.tablePos, cardValue: pCurrOp.opValue1 });
            MJGameData.cardLeftNum.value = pCurrOp.cardLeftNum;
        }

    }
}