module FL {

    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase - MahjongTableCardsMiddleViewMediator
     * @Description:  //牌桌显示牌中间区域调停者
     * @Create: DerekWu on 2017/11/23 9:22
     * @Version: V1.0
     */
    export class MahjongTableCardsMiddleViewMediator extends puremvc.Mediator implements puremvc.IMediator {

        public static readonly NAME:string = "MahjongTableCardsMiddleViewMediator";

        /** 出牌显示操作类 */
        private readonly _upChuGroupHandle:ChuGroupHandle;
        private readonly _downChuGroupHandle:ChuGroupHandle;
        private readonly _leftChuGroupHandle:ChuGroupHandle;
        private readonly _rightChuGroupHandle:ChuGroupHandle;

        /** 上一个出牌 */
        private _lastChuGroupHandle:ChuGroupHandle;

        constructor (pView:MahjongTableCardsMiddleView) {
            super(MahjongTableCardsMiddleViewMediator.NAME, pView);
            this._upChuGroupHandle = new ChuGroupHandle(PZOrientation.UP, pView.upChuGroup);
            this._downChuGroupHandle = new ChuGroupHandle(PZOrientation.DOWN, pView.downChuGroup);
            this._leftChuGroupHandle = new ChuGroupHandle(PZOrientation.LEFT, pView.leftChuGroup);
            this._rightChuGroupHandle = new ChuGroupHandle(PZOrientation.RIGHT, pView.rightChuGroup);
        }

        /**
         * 注册之后调用
         */
        // public onRegister():void {
        //     egret.log("--MahjongTableCardsMiddleViewMediator--onRegister");
        // }

        /**
         * 移除之后调用
         */
        public onRemove():void {
            // egret.log("--MahjongTableCardsMiddleViewMediator--onRemove");
            this.removeArrows();
        }

        /**
         * 感兴趣的通知指令
         * @returns {Array<any>}
         */
        public listNotificationInterests():Array<any> {
            return [
                MahjongModule.MAHJONG_REMIND_CHU_PAI,
                MahjongModule.MAHJONG_CHU_PAI_NOTIFY,
                MJGameModule.MJGAME_ADD_SHADE_TO_SELECT,
                MJGameModule.MJGAME_DEL_ALL_CHU_CARD_SHADE,
                // MJGameModule.MJGAME_REMOE_CHU_CARD,
                MahjongModule.MAHJONG_PUBLISH_CARD,
                MahjongModule.MAHJONG_REMOVE_CHU_CARD,
                MahjongModule.MAHJONG_PLAY_ONE_CARD
            ];
        }

        /**
         * 处理通知
         * @param {puremvc.INotification} pNotification
         */
        public handleNotification(pNotification:puremvc.INotification):void{
            let data:any = pNotification.getBody();
            switch(pNotification.getName()) {
                case MahjongModule.MAHJONG_REMIND_CHU_PAI:{
                    this.remindChuPai(data);
                    break;
                }
                case MahjongModule.MAHJONG_CHU_PAI_NOTIFY:{
                    this.chuCard(data);
                    break;
                }
                case MJGameModule.MJGAME_ADD_SHADE_TO_SELECT:{
                    this.addShadeToSelect(data);
                    break;
                }
                case MJGameModule.MJGAME_DEL_ALL_CHU_CARD_SHADE:{
                    this.delAllChuCardShade();
                    break;
                }
                // case MJGameModule.MJGAME_REMOE_CHU_CARD:{
                //     this.removeChuCard(data);
                //     break;
                // }
                case MahjongModule.MAHJONG_PUBLISH_CARD:{
                    this.publishCard(data);
                    break;
                }
                case MahjongModule.MAHJONG_REMOVE_CHU_CARD:{
                    this.removeChuCard(data);
                    break;
                }
                case MahjongModule.MAHJONG_PLAY_ONE_CARD:{
                    this.addChuCard(data);
                    break;
                }
            }
        }

        /**
         * 开始游戏，重置显示
         */
        public startGame():void {
            let self = this;
            self._upChuGroupHandle.resetView(MahjongHandler.getPlayerChuCard(PZOrientation.UP));
            self._downChuGroupHandle.resetView(MahjongHandler.getPlayerChuCard(PZOrientation.DOWN));
            self._leftChuGroupHandle.resetView(MahjongHandler.getPlayerChuCard(PZOrientation.LEFT));
            self._rightChuGroupHandle.resetView(MahjongHandler.getPlayerChuCard(PZOrientation.RIGHT));

            // 添加箭头到最后出的牌 addArrowsToLastCard
            let vLastChuPos: number = MahjongHandler.getLastChuCardPlayerPos();
            //获得牌桌方向
            let vPZOrientation:PZOrientation = MahjongHandler.getPZOrientation(vLastChuPos);
            //当前组
            let vCurrGroupHandle:ChuGroupHandle = this.getChuGroupHandle(vPZOrientation);
            vCurrGroupHandle.addArrowsToLastCard();
            //记录最后的组
            this._lastChuGroupHandle = vCurrGroupHandle;
            //处理最后出牌信息
            // let vLastChuCardInfo:{chuPos:number, chuCard:number} = MahjongHandler.getLastChuCardInfo();
            // if (vLastChuCardInfo.chuPos >= 0 && vLastChuCardInfo.chuCard > 0) {
            //     self.exeChuCard(vLastChuCardInfo);
            // }
        }

        /**
         * 提醒玩家该出牌了
         * @param {FL.PlayerOperationNotifyMsg} msg
         */
        private remindChuPai(msg:MahjongRemindPlayerOperationMsgAck):void {
            //获得操作类
            let vPZOrientation:PZOrientation = MahjongHandler.getPZOrientation(msg.operationPlayerPos);
            //当前组
            let vCurrGroupHandle:ChuGroupHandle = this.getChuGroupHandle(vPZOrientation);
            vCurrGroupHandle.hideMingGroup();
        }

        /**
         * 出牌消息回复
         * @param {FL.MahjongPlayCardMsg} msg
         */
        public chuCard(msg:MahjongPlayCardMsgAck):void {
            // egret.log("##  PlayerTableOperationMsg pos="+msg.player_table_pos+"  cardValue="+msg.card_value);
            this.exeChuCard({chuPos:msg.playerPos, chuCard:msg.playCard}, false);
            // //移除箭头
            // this.removeArrows();
            // //获得牌桌方向
            let vPZOrientation:PZOrientation = MahjongHandler.getPZOrientation(msg.playerPos);
            // //当前组
            let vCurrGroupHandle:ChuGroupHandle = this.getChuGroupHandle(vPZOrientation);
            // vCurrGroupHandle.addOneChuCard(msg.card_value);
            //记录最后的组
            this._lastChuGroupHandle = vCurrGroupHandle;

            // 播放牌打在桌子上的音效
            // MahjongSoundHandler.cardToTable();
            //播放出牌音效
            MahjongSoundHandler.chuCard(msg.playCard, vPZOrientation, true);
        }

        /**
         *  添加出牌
         * @param {FL.MahjongPlayCardMsg} msg
         */
        private addChuCard(msg:MahjongAddChuCardMsgAck):void {
            this.exeChuCard({chuPos:msg.playerPos, chuCard:msg.card}, true);
        }

        private exeChuCard(chuCardInfo:{chuPos:number, chuCard:number}, isAdd:boolean):void {
            //移除箭头
            this.removeArrows();
            //获得牌桌方向
            let vPZOrientation:PZOrientation = MahjongHandler.getPZOrientation(chuCardInfo.chuPos);
            //当前组
            let vCurrGroupHandle:ChuGroupHandle = this.getChuGroupHandle(vPZOrientation);
            vCurrGroupHandle.addOneChuCard(chuCardInfo.chuCard, isAdd);
            if(MahjongData.huCardInfoList){
                MvcUtil.send(MahjongModule.MAHJONG_UPDATE_HU_LIST, MahjongData.huCardInfoList);
            }
            //记录最后的组
            this._lastChuGroupHandle = vCurrGroupHandle;
        }

        /**
         * 给选中的牌在中间区域增加遮罩
         * @param {number} cardValue
         */
        private addShadeToSelect(cardValue:number):void {
            let self = this;
            self._upChuGroupHandle.addSameCardValueShade(cardValue);
            self._downChuGroupHandle.addSameCardValueShade(cardValue);
            self._leftChuGroupHandle.addSameCardValueShade(cardValue);
            self._rightChuGroupHandle.addSameCardValueShade(cardValue);
        }

        /**
         * 移除所有遮罩
         * @constructor
         */
        private delAllChuCardShade():void {
            let self = this;
            self._upChuGroupHandle.removeAllShade();
            self._downChuGroupHandle.removeAllShade();
            self._leftChuGroupHandle.removeAllShade();
            self._rightChuGroupHandle.removeAllShade();
        }

        /**
         * 删除已经显示碰吃碰杠走得牌
         * @param {FL.MahjongRemoveChuCardMsgAck} msg
         */
        private removeChuCard(msg:MahjongRemoveChuCardMsgAck):void {
            //移除箭头
            this.removeArrows();
            //当前组
            let vPZOrientation:PZOrientation = MahjongHandler.getPZOrientation(msg.playerPos);
            let vCurrGroupHandle:ChuGroupHandle = this.getChuGroupHandle(vPZOrientation);
            // if (vPZOrientation === PZOrientation.DOWN || MJGameHandler.isReplay()) {
            vCurrGroupHandle.resetChuCardByRemoveCard(msg.card, msg.cardIndex);
            if(MahjongData.huCardInfoList){
                MvcUtil.send(MahjongModule.MAHJONG_UPDATE_HU_LIST,MahjongData.huCardInfoList);
            }
        }

        /**
         * 获得出牌操作组
         * @param {FL.PZOrientation} pPZOrientation
         * @returns {FL.ChuGroupHandle}
         */
        private getChuGroupHandle(pPZOrientation:PZOrientation):ChuGroupHandle {
            if (pPZOrientation === PZOrientation.UP) {
                return this._upChuGroupHandle;
            } else if (pPZOrientation === PZOrientation.DOWN) {
                return this._downChuGroupHandle;
            } else if (pPZOrientation === PZOrientation.LEFT) {
                return this._leftChuGroupHandle;
            } else if (pPZOrientation === PZOrientation.RIGHT) {
                return this._rightChuGroupHandle;
            }
        }

        /**
         * 移除箭头
         */
        private removeArrows():void {
            let self = this;
            if (self._lastChuGroupHandle) {
                self._lastChuGroupHandle.removeArrows();
                self._lastChuGroupHandle = null;
            }
        }

        /**
         * 麻将明牌
         * @param {FL.MahjongPublishCardMsgAck} msg
         */
        private publishCard(msg:MahjongPublishCardMsgAck): void {
            // egret.log(msg);
            //移除箭头
            this.removeArrows();
            //获得牌桌方向
            let vPZOrientation:PZOrientation = MahjongHandler.getPZOrientation(msg.playerPos);
            //当前组
            let vCurrGroupHandle:ChuGroupHandle = this.getChuGroupHandle(vPZOrientation);
            let delayTime:number = msg.dealy.toNumber();
            if(MahjongData.isReplay){
                delayTime = 2500;
            }
            vCurrGroupHandle.addMingCard(msg.cards,msg.action,delayTime);
            //记录最后的组
            // this._lastChuGroupHandle = vCurrGroupHandle;
        }

    }

}