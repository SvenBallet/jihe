module FL {

    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase - TableBoardCardsDownViewMediator
     * @Description:  //牌桌各个玩家手里的牌 调停者
     * @Create: DerekWu on 2017/11/23 9:40
     * @Version: V1.0
     */
    export class MahjongTableCardsHandViewMediator extends puremvc.Mediator implements puremvc.IMediator {

        public static readonly NAME:string = "MahjongTableCardsHandViewMediator";

        /** 手里的牌显示操作类 */
        private readonly _upHandGroupHandle:MahjongHandGroupHandler;
        private readonly _downHandGroupHandle:MahjongMyHandGroupHandle;
        private readonly _leftHandGroupHandle:MahjongHandGroupHandler;
        private readonly _rightHandGroupHandle:MahjongHandGroupHandler;

        /** 当前选择的操作类型 */
        // private _currSelectOperationType:number;

        constructor (pView:MahjongTableCardsHandView) {
            super(MahjongTableCardsHandViewMediator.NAME, pView);
            this._upHandGroupHandle = new MahjongHandGroupHandler(PZOrientation.UP, pView.upHandGroup);
            this._downHandGroupHandle = new MahjongMyHandGroupHandle(pView.downHandGroup);
            this._leftHandGroupHandle = new MahjongHandGroupHandler(PZOrientation.LEFT, pView.leftHandGroup);
            this._rightHandGroupHandle = new MahjongHandGroupHandler(PZOrientation.RIGHT, pView.rightHandGroup);

            //注册事件监听
            this.registerAllEvent(pView);
        }

        /**
         * 注册事件监听
         */
        private registerAllEvent(pView:MahjongTableCardsHandView):void {
            let self = this;
            let vView: MahjongTableCardsHandView = this.getView();
            //添加自己手牌区域的监听，用来出牌
            self._downHandGroupHandle.realHandViewGroup.addEventListener(egret.TouchEvent.TOUCH_TAP, self._downHandGroupHandle.touchMyHandCardArea, self._downHandGroupHandle);
            self._downHandGroupHandle.realHandViewGroup.addEventListener(egret.TouchEvent.TOUCH_BEGIN, self._downHandGroupHandle.touchBeginMyHandCardArea, self._downHandGroupHandle);
            vView._selectChiGangGroup.addEventListener(egret.TouchEvent.TOUCH_TAP, vView.hideSelectGroup, vView);
        }

        /**
         * 注册之后调用
         */
        public onRegister():void {
            // egret.log("--MahjongTableCardsHandViewMediator--onRegister");
            // 监听屏幕尺寸改变
            egret.MainContext.instance.stage.addEventListener(egret.Event.RESIZE, this.resizeEgretState, this);
        }

        /**
         * 移除之后调用
         */
        public onRemove():void {
            // egret.log("--MahjongTableCardsHandViewMediator--onRemove");
            egret.MainContext.instance.stage.removeEventListener(egret.Event.RESIZE, this.resizeEgretState, this);
        }

        /**
         * 感兴趣的通知指令
         * @returns {Array<any>}
         */
        public listNotificationInterests():Array<any> {
            return [
                MahjongModule.MAHJONG_REMIND_CHU_PAI,
                MahjongModule.MAHJONG_MO_PAI,
                MahjongModule.MAHJONG_CHANGE_CARD_DOWN,
                MahjongModule.MAHJONG_REFRESH_HAND_CARD,
                MahjongModule.MAHJONG_UPDATE_TING_LIST,
                MahjongModule.MAHJONG_UPDATE_HU_LIST,
                MahjongModule.MAHJONG_UPDATE_ACTION_LIST,
                MahjongModule.MAHJONG_ACTION_SELECT_CANCEL,
                MahjongModule.MAHJONG_ACTION_SELECT_GUO,
                MahjongModule.MAHJONG_UP_CARD_MIDDLE_ARROWS_CHANGE
            ];
        }

        /**
         * 处理通知
         * @param {puremvc.INotification} pNotification
         */
        public handleNotification(pNotification:puremvc.INotification):void{
            let data:any = pNotification.getBody();
            switch(pNotification.getName()) {
                case MahjongModule.MAHJONG_CHANGE_CARD_DOWN:{
                    this.changeCardDown(data);
                    break;
                }
                case MahjongModule.MAHJONG_REFRESH_HAND_CARD:{
                    this.refreshHandPai(data);
                    break;
                }
                case MahjongModule.MAHJONG_REMIND_CHU_PAI:{
                    this.remindChuPai(data);
                    break;
                }
                case MahjongModule.MAHJONG_UPDATE_TING_LIST:{
                    this._downHandGroupHandle.updateTingCardList(data);
                    break;
                }
                case MahjongModule.MAHJONG_UPDATE_HU_LIST:{
                    this._downHandGroupHandle.updateHuCardList(data);
                    break;
                }
                case MahjongModule.MAHJONG_UPDATE_ACTION_LIST:{
                    this.getView().newViewActionButtonGroup(data);
                    break;
                }
                case MahjongModule.MAHJONG_ACTION_SELECT_CANCEL:{
                    //隐藏按钮
                    this.getView().hideAllGroup();
                    //取消手牌所有选中
                    this._downHandGroupHandle.cancelAllSelected();
                    break;
                }
                case MahjongModule.MAHJONG_MO_PAI:{
                    this.moPai(data);
                    break;
                }
                case MahjongModule.MAHJONG_ACTION_SELECT_GUO:{
                    this.actionSelectGuo();
                    break;
                }
                case MahjongModule.MAHJONG_UP_CARD_MIDDLE_ARROWS_CHANGE:{
                    this.getView().upCardMiddleArrowsChange(data);
                    break;
                }
            }
        }

        /**
         * 获得手里牌显示组操作对象
         * @param {FL.PZOrientation} pzOrientation
         * @returns {FL.HuaGroupHandle}
         */
        private getHandGroupHandle(pzOrientation:PZOrientation) {
            if (pzOrientation === PZOrientation.UP) {
                return this._upHandGroupHandle;
            } else if (pzOrientation === PZOrientation.DOWN) {
                return this._downHandGroupHandle;
            } else if (pzOrientation === PZOrientation.LEFT) {
                return this._leftHandGroupHandle;
            } else if (pzOrientation === PZOrientation.RIGHT) {
                return this._rightHandGroupHandle;
            }
        }

        /**
         * 开始游戏，重置显示
         */
        public startGame():void {
            let self = this;
            self._upHandGroupHandle.resetView(MahjongHandler.getPlayerCardDown(PZOrientation.UP));
            self._downHandGroupHandle.resetView(MahjongHandler.getPlayerCardDown(PZOrientation.DOWN));
            self._leftHandGroupHandle.resetView(MahjongHandler.getPlayerCardDown(PZOrientation.LEFT));
            self._rightHandGroupHandle.resetView(MahjongHandler.getPlayerCardDown(PZOrientation.RIGHT));

            self._downHandGroupHandle.resetViewHandCard(MahjongHandler.getHandCardArray(PZOrientation.DOWN));
            if (MahjongHandler.isReplay()) {
                // 重播
                self._upHandGroupHandle.resetViewHandCard(MahjongHandler.getHandCardArray(PZOrientation.UP));
                self._leftHandGroupHandle.resetViewHandCard(MahjongHandler.getHandCardArray(PZOrientation.LEFT));
                self._rightHandGroupHandle.resetViewHandCard(MahjongHandler.getHandCardArray(PZOrientation.RIGHT));
            } else {
                self._upHandGroupHandle.resetHideHandCard(MahjongHandler.getHandCardArray(PZOrientation.UP));
                self._leftHandGroupHandle.resetHideHandCard(MahjongHandler.getHandCardArray(PZOrientation.LEFT));
                self._rightHandGroupHandle.resetHideHandCard(MahjongHandler.getHandCardArray(PZOrientation.RIGHT));
                // 关闭开关
                self.closeTouchHandCardSwitch();
            }

            // 因为头像移动有可能存在缓动的情况(头像缓存时间是200毫秒)，所以延迟重设一个下下面玩家头像点击区域
            // MyCallBackUtil.delayedCallBack(300, self.getView().resetHeadViewDownClickAreaPos, self.getView());
        }

        /**
         * 屏幕尺寸改变重设位置
         * @param {egret.Event} e
         */
        private resizeEgretState(e:egret.Event) {
            // MyCallBackUtil.delayedCallBack(200, this.getView().resetHeadViewDownClickAreaPos, this.getView());
            // this.getView().resetHeadViewDownClickAreaPos();
        }

        /**
         * 改变CardDown
         * @param {FL.MahjongChangeCardDownMsgAck} msg
         */
        private changeCardDown(msg:MahjongChangeCardDownMsgAck): void {
            let vPZOrientation:PZOrientation = MahjongHandler.getPZOrientation(msg.playerPos);
            let vHandGroupHandle:MahjongHandGroupHandler = this.getHandGroupHandle(vPZOrientation);
            MahjongData.lastActionPZoriatation = vPZOrientation;
            vHandGroupHandle.addCardDown(msg.cardDown);
            if (vPZOrientation === PZOrientation.DOWN || MahjongHandler.isReplay()) {
                //刷新
                vHandGroupHandle.resetViewHandCard(msg.handCards);
            } else {
                //刷新隐藏牌
                vHandGroupHandle.resetHideHandCard(msg.handCards);
            }
        }

        /**
         * 刷新手牌
         * @param {{tabelPos: number; handCards: Array<number>}} handCardObj
         */
        private refreshHandPai(handCardObj:{tablePos:number, handCards:Array<number>}):void {
            if (handCardObj && handCardObj.handCards && handCardObj.handCards.length > 0) {
                let vPZOrientation:PZOrientation = MahjongHandler.getPZOrientation(handCardObj.tablePos);
                let vHandGroupHandle:MahjongHandGroupHandler = this.getHandGroupHandle(vPZOrientation);
                // vHandGroupHandle.resetViewHandCard(handCardObj.handCards);
                if (vPZOrientation === PZOrientation.DOWN || MahjongHandler.isReplay()) {
                    //刷新
                    vHandGroupHandle.resetViewHandCard(handCardObj.handCards);
                } else {
                    //刷新隐藏牌
                    vHandGroupHandle.resetHideHandCard(handCardObj.handCards);
                }
            }
        }

        /**
         * 摸进一张牌
         */
        private moPai(msg:MahjongMoOneCardMsgAck): void {
            //获得操作类
            let self = this;
            let vPZOrientation:PZOrientation = MahjongHandler.getPZOrientation(msg.playerPos);
            let vHandGroupHandle:MahjongHandGroupHandler = this.getHandGroupHandle(vPZOrientation);

            // 清除本次我的摸牌消息
            MahjongData.thisMyMahjongMoOneCardMsgAck = null;

            // vHandGroupHandle.addLastViewCard(msg.cardValue);
            //如果新摸进来的牌>0，则添加这个牌到最后一个
            if (msg.cardValue > 0) {
                if (msg.cardValue === 0x51) { // 暗牌
                    vHandGroupHandle.addLastHideCard();
                } else {
                    vHandGroupHandle.addLastViewCard(msg.cardValue);
                }
                if (vPZOrientation === PZOrientation.DOWN) {
                    // vHandGroupHandle.a
                    //减去剩余牌数
                    MahjongHandler.setRestCardNum(msg.cardValue,1);
                    if(MahjongData.huCardInfoList){
                        MvcUtil.send(MahjongModule.MAHJONG_UPDATE_HU_LIST,MahjongData.huCardInfoList);
                    }

                    if (MahjongHandler.isHuaCard(msg.cardValue)) {
                        //如果是花，马上打出去
                        self.delayedAutoPlayLastMoCard();
                        //关闭开关
                        self.closeTouchHandCardSwitch();
                        //强行打开可操作开关
                        // MahjongHandler.touchHandCardSwitch.compelOpen();
                    } else if (msg.isAutoPlayMoCard) {
                        if (!msg.hasActionAfterMoCard) {
                            self.delayedAutoPlayLastMoCard();
                        }
                        MahjongData.thisMyMahjongMoOneCardMsgAck = msg;
                        //关闭开关
                        self.closeTouchHandCardSwitch();
                    } else {
                        //强行打开可操作开关
                        MahjongHandler.touchHandCardSwitch.compelOpen();
                    }
                }
            } else {
                if (vPZOrientation === PZOrientation.DOWN) {
                    //强行打开可操作开关
                    MahjongHandler.touchHandCardSwitch.compelOpen();
                }
            }

            // 处理按钮组逻辑，只有自己才用处理
            // self.exeButtonGroupLogic(msg);
        }

        private actionSelectGuo(): void {
            let vMahjongMoOneCardMsgAck: MahjongMoOneCardMsgAck = MahjongData.thisMyMahjongMoOneCardMsgAck;
            if (vMahjongMoOneCardMsgAck) {
                if (vMahjongMoOneCardMsgAck.isAutoPlayMoCard && vMahjongMoOneCardMsgAck.hasActionAfterMoCard) {
                    this.delayedAutoPlayLastMoCard(500);
                    //关闭开关
                    this.closeTouchHandCardSwitch();
                }
                MahjongData.thisMyMahjongMoOneCardMsgAck = null;
            }
        }

        /**
         * 延时自动打牌，延时默认1000毫秒
         * @param {number} delayedTimes
         */
        private delayedAutoPlayLastMoCard(delayedTimes: number = 1000): void {
            //往服务器发送出牌指令,延时默认1000毫秒
            MyCallBackUtil.delayedCallBack(delayedTimes, this._downHandGroupHandle.removeLastAndChu, this._downHandGroupHandle);
        }

        /**
         * 提醒玩家该出牌了
         * @param {FL.PlayerOperationNotifyMsg} msg
         */
        private remindChuPai(msg:MahjongRemindPlayerOperationMsgAck):void {
            let self = this;
            //获得操作类
            let vPZOrientation:PZOrientation = MahjongHandler.getPZOrientation(msg.operationPlayerPos);

            if (vPZOrientation !== PZOrientation.DOWN){
                // let vHandGroupHandle:MahjongHandGroupHandler = this.getHandGroupHandle(vPZOrientation);
                // vHandGroupHandle.resetViewHandCard(MahjongHandler.getHandCardArray(vPZOrientation));
                this.closeTouchHandCardSwitch();
                return;
            } else {
                //this.getView().hideAllGroup();
                this._downHandGroupHandle.cancelAllSelected();
                let vMahjongMoOneCardMsgAck: MahjongMoOneCardMsgAck = MahjongData.thisMyMahjongMoOneCardMsgAck;
                if (vMahjongMoOneCardMsgAck && vMahjongMoOneCardMsgAck.isAutoPlayMoCard) {
                    // 自动打牌
                    this.closeTouchHandCardSwitch();
                } else {
                    this.openTouchHandCardSwitch();
                }

            }

        }

        /**
         * 关闭开关
         */
        public closeTouchHandCardSwitch():void {
            //关闭可操作开关
            MahjongHandler.touchHandCardSwitch.close();
            //延时打开开关
            //打开回调
            // let vOpenCallBack:MyCallBack = MahjongHandler.touchHandCardSwitch.genCurrOpenCallBack();
            // MyCallBackUtil.delayedCallBack(3000, vOpenCallBack.apply, vOpenCallBack);
        }

        /**
         * 打开开关
         */
        public openTouchHandCardSwitch():void {
            //关闭可操作开关
            MahjongHandler.touchHandCardSwitch.compelOpen();
            //延时打开开关
            //打开回调
            // let vOpenCallBack:MyCallBack = MahjongHandler.touchHandCardSwitch.genCurrOpenCallBack();
            // MyCallBackUtil.delayedCallBack(3000, vOpenCallBack.apply, vOpenCallBack);
        }

        /**
         * 获得显示组件
         * @returns {FL.MahjongTableCardsHandView}
         */
        private getView():MahjongTableCardsHandView {
            return <MahjongTableCardsHandView>this.viewComponent;
        }


    }
}