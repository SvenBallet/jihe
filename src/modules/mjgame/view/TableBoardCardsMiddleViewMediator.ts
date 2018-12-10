module FL {

    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase - TableBoardCardsMiddleViewMediator
     * @Description:  //牌桌显示牌中间区域调停者
     * @Create: DerekWu on 2017/11/23 9:22
     * @Version: V1.0
     */
    export class TableBoardCardsMiddleViewMediator extends puremvc.Mediator implements puremvc.IMediator {

        public static readonly NAME:string = "TableBoardCardsMiddleViewMediator";

        /** 出牌显示操作类 */
        private readonly _upChuGroupHandle:ChuGroupHandle;
        private readonly _downChuGroupHandle:ChuGroupHandle;
        private readonly _leftChuGroupHandle:ChuGroupHandle;
        private readonly _rightChuGroupHandle:ChuGroupHandle;

        /** 上一个出牌 */
        private _lastChuGroupHandle:ChuGroupHandle;

        constructor (pView:TableBoardCardsMiddleView) {
            super(TableBoardCardsMiddleViewMediator.NAME, pView);
            this._upChuGroupHandle = new ChuGroupHandle(PZOrientation.UP, pView.upChuGroup);
            this._downChuGroupHandle = new ChuGroupHandle(PZOrientation.DOWN, pView.downChuGroup);
            this._leftChuGroupHandle = new ChuGroupHandle(PZOrientation.LEFT, pView.leftChuGroup);
            this._rightChuGroupHandle = new ChuGroupHandle(PZOrientation.RIGHT, pView.rightChuGroup);
        }

        /**
         * 注册之后调用
         */
        // public onRegister():void {
        //     egret.log("--TableBoardCardsMiddleViewMediator--onRegister");
        // }

        /**
         * 移除之后调用
         */
        public onRemove():void {
            // egret.log("--TableBoardCardsMiddleViewMediator--onRemove");
            this.removeArrows();
        }

        /**
         * 感兴趣的通知指令
         * @returns {Array<any>}
         */
        public listNotificationInterests():Array<any> {
            return [
                MJGameModule.MJGAME_CHU_PAI,
                MJGameModule.MJGAME_ADD_SHADE_TO_SELECT,
                MJGameModule.MJGAME_DEL_ALL_CHU_CARD_SHADE,
                MJGameModule.MJGAME_REMOE_CHU_CARD
            ];
        }

        /**
         * 处理通知
         * @param {puremvc.INotification} pNotification
         */
        public handleNotification(pNotification:puremvc.INotification):void{
            let data:any = pNotification.getBody();
            switch(pNotification.getName()) {
                case MJGameModule.MJGAME_CHU_PAI:{
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
                case MJGameModule.MJGAME_REMOE_CHU_CARD:{
                    this.removeChuCard(data);
                    break;
                }
            }
        }

        /**
         * 开始游戏，重置显示
         */
        public startGame():void {
            let self = this;
            self._upChuGroupHandle.resetView(MJGameHandler.getPlayerChuCard(PZOrientation.UP));
            self._downChuGroupHandle.resetView(MJGameHandler.getPlayerChuCard(PZOrientation.DOWN));
            self._leftChuGroupHandle.resetView(MJGameHandler.getPlayerChuCard(PZOrientation.LEFT));
            self._rightChuGroupHandle.resetView(MJGameHandler.getPlayerChuCard(PZOrientation.RIGHT));
            //处理最后出牌信息
            let vLastChuCardInfo:{chuPos:number, chuCard:number} = MJGameHandler.getLastChuCardInfo();
            if (vLastChuCardInfo.chuPos >= 0 && vLastChuCardInfo.chuCard > 0) {
                self.exeChuCard(vLastChuCardInfo);
            }
        }

        /**
         * 出牌
         * @param {FL.PlayerTableOperationMsg} msg
         */
        public chuCard(msg:PlayerTableOperationMsg):void {
            // egret.log("##  PlayerTableOperationMsg pos="+msg.player_table_pos+"  cardValue="+msg.card_value);
            this.exeChuCard({chuPos:msg.player_table_pos, chuCard:msg.card_value});
            // //移除箭头
            // this.removeArrows();
            // //获得牌桌方向
            // let vPZOrientation:PZOrientation = MJGameHandler.getPZOrientation(msg.player_table_pos);
            // //当前组
            // let vCurrGroupHandle:ChuGroupHandle = this.getChuGroupHandle(vPZOrientation);
            // vCurrGroupHandle.addOneChuCard(msg.card_value);
            // //记录最后的组
            // this._lastChuGroupHandle = vCurrGroupHandle;
        }

        private exeChuCard(chuCardInfo:{chuPos:number, chuCard:number}):void {
            //移除箭头
            this.removeArrows();
            //获得牌桌方向
            let vPZOrientation:PZOrientation = MJGameHandler.getPZOrientation(chuCardInfo.chuPos);
            //当前组
            let vCurrGroupHandle:ChuGroupHandle = this.getChuGroupHandle(vPZOrientation);
            // vCurrGroupHandle.addOneChuCard(chuCardInfo.chuCard);
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
         */
        private removeChuCard(pzOrientation:PZOrientation):void {
            //移除箭头
            this.removeArrows();
            //当前组
            let vCurrGroupHandle:ChuGroupHandle = this.getChuGroupHandle(pzOrientation);
            //删除最后一个
            vCurrGroupHandle.removeLastChuCard();
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

    }

}