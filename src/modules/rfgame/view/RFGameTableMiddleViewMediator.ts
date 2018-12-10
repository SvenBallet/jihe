module FL {
    /** 中间出牌页面 */
    export class RFGameTableMiddleViewMediator extends puremvc.Mediator implements puremvc.IMediator {
        public static readonly NAME: string = "RFGameTableMiddleViewMediator";

        /** 出牌显示操作类 */
        private readonly _upChuGroupHandle: RFChuGroupHandle;
        private readonly _downChuGroupHandle: RFChuGroupHandle;
        private readonly _leftChuGroupHandle: RFChuGroupHandle;
        private readonly _rightChuGroupHandle: RFChuGroupHandle;
        /** 上一个出牌 */
        private _lastChuGroupHandle: RFChuGroupHandle;
        constructor(pView: RFGameTableMiddleView) {
            super(RFGameTableMiddleViewMediator.NAME, pView);
            this._upChuGroupHandle = new RFChuGroupHandle(PZOrientation.UP, pView.upChuGroup);
            this._downChuGroupHandle = new RFChuGroupHandle(PZOrientation.DOWN, pView.downChuGroup);
            this._leftChuGroupHandle = new RFChuGroupHandle(PZOrientation.LEFT, pView.leftChuGroup);
            this._rightChuGroupHandle = new RFChuGroupHandle(PZOrientation.RIGHT, pView.rightChuGroup);
        }

        /**
       * 移除之后调用
       */
        public onRemove(): void {
            // egret.log("--TableBoardCardsMiddleViewMediator--onRemove");
        }

        /**
       * 感兴趣的通知指令
       * @returns {Array<any>}
       */
        public listNotificationInterests(): Array<any> {
            return [
                RFGameModule.RFGAME_CHU_CARDS,
                RFGameModule.GAME_SHOW_TIMER,
                RFGameModule.GAME_OVER_SHOW_HAND
            ];
        }

        /**
         * 处理通知
         * @param {puremvc.INotification} pNotification
         */
        public handleNotification(pNotification: puremvc.INotification): void {
            let data: any = pNotification.getBody();
            switch (pNotification.getName()) {
                case RFGameModule.RFGAME_CHU_CARDS:
                    this.chuCard(data);
                    // let _data: IChuCardData = <IChuCardData>{};
                    // _data.data = data.data;
                    // _data.nextPos = data.nextPos;
                    // this.chuCard(data.data);
                    // //---test
                    // MvcUtil.send(RFGameModule.GAME_SHOW_TIMER, RFGameHandle.getPZOrientation(data.nextPos));
                    break;
                case RFGameModule.GAME_SHOW_TIMER:
                    //清空当前显示组的内容
                    if (data == PZOrientation.DOWN) {  // 按照新要求修改(已经还原)
                        let handle = this.getChuGroupHandle(data);
                        handle.resetView(null);
                    }
                    break;

                case RFGameModule.GAME_OVER_SHOW_HAND:
                    this.overShowHand(data);
                    break;
            }
        }

        /** 出牌 */
        private chuCard(data: IChuCardData) {
            //获得牌桌方向
            let vPZOrientation: PZOrientation = RFGameHandle.getPZOrientation(data.chuPos);
            //当前组
            let vCurrGroupHandle: RFChuGroupHandle = this.getChuGroupHandle(vPZOrientation);
            vCurrGroupHandle.resetView(data.chuData);
            //记录最后的组
            this._lastChuGroupHandle = vCurrGroupHandle;

            if (data.chuData.data && data.chuData.data.length > 0) {
                // 新加的需求，清空别的方向的出的牌
                let vGamePlayers: GamePlayer[] = RFGameHandle.getGamePlayerArray();
                vGamePlayers.forEach((oneGamePlayer) => {
                    if (oneGamePlayer.tablePos != data.chuPos) {
                        vPZOrientation = RFGameHandle.getPZOrientation(oneGamePlayer.tablePos);
                        vCurrGroupHandle = this.getChuGroupHandle(vPZOrientation);
                        vCurrGroupHandle.resetView(null);
                    }
                });
            }
        }

        /**
       * 获得出牌操作组
       * @param {FL.PZOrientation} pPZOrientation
       * @returns {FL.RFChuGroupHandle}
       */
        private getChuGroupHandle(pPZOrientation: PZOrientation): RFChuGroupHandle {
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

        /** 游戏结束摊牌显示 */
        private overShowHand(msg: PokerGameOverViewHandCardsMsgAck) {
            for (let i = 0; i < msg.playerHandCardList.length; ++i) {
                let vPZOrientation = RFGameHandle.getPZOrientation(msg.playerHandCardList[i].tablePos);
                if (vPZOrientation == PZOrientation.DOWN) continue;//自己的方向不摊牌
                let chuGroup = this.getChuGroupHandle(vPZOrientation);
                let cardsData = <ICardsData>{};
                cardsData.data = RFGameHandle.getCardData(msg.playerHandCardList[i].handCards);
                cardsData.type = null;
                cardsData.value = null;
                chuGroup.resetView(cardsData, false);
            }
        }

        /**
       * 开始游戏，重置显示
       */
        public startGame(): void {
            let self = this;
            // ----test 重置时的数据需要核对
            let useAni = true;
            if (RFGameHandle.isOfflineRecover()) useAni = false;//断线重连不播放动画
            self._upChuGroupHandle.resetView(RFGameData.playerLastCards[RFGameHandle.getTablePos(PZOrientation.UP)], useAni);
            self._downChuGroupHandle.resetView(RFGameData.playerLastCards[RFGameHandle.getTablePos(PZOrientation.DOWN)], useAni);
            self._leftChuGroupHandle.resetView(RFGameData.playerLastCards[RFGameHandle.getTablePos(PZOrientation.LEFT)], useAni);
            self._rightChuGroupHandle.resetView(RFGameData.playerLastCards[RFGameHandle.getTablePos(PZOrientation.RIGHT)], useAni);
            //处理最后出牌信息
            // let vLastChuCardInfo: { chuPos: number, chuCard: number } = MJGameHandler.getLastChuCardInfo();
            // if (vLastChuCardInfo.chuPos >= 0 && vLastChuCardInfo.chuCard > 0) {
            //     self.exeChuCard(vLastChuCardInfo);
            // } 
        }


    }
}