module FL {

    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase - TableBoardCardsDownViewMediator
     * @Description:  //牌桌各个玩家手里的牌 调停者
     * @Create: DerekWu on 2017/11/23 9:40
     * @Version: V1.0
     */
    export class TableBoardCardsHandViewMediator extends puremvc.Mediator implements puremvc.IMediator {

        public static readonly NAME:string = "TableBoardCardsHandViewMediator";

        /** 手里的牌显示操作类 */
        private readonly _upHandGroupHandle:HandGroupHandle;
        private readonly _downHandGroupHandle:MyHandGroupHandle;
        private readonly _leftHandGroupHandle:HandGroupHandle;
        private readonly _rightHandGroupHandle:HandGroupHandle;

        /** 当前提醒出牌的消息，用于点击吃碰杠等的时候可以取到相应的数据 */
        private _remindChuPaiMsg:PlayerOperationNotifyMsg;
        /** 当前选择的操作类型 */
        private _currSelectOperationType:number;

        constructor (pView:TableBoardCardsHandView) {
            super(TableBoardCardsHandViewMediator.NAME, pView);
            this._upHandGroupHandle = new HandGroupHandle(PZOrientation.UP, pView.upHandGroup);
            this._downHandGroupHandle = new MyHandGroupHandle(pView.downHandGroup);
            this._leftHandGroupHandle = new HandGroupHandle(PZOrientation.LEFT, pView.leftHandGroup);
            this._rightHandGroupHandle = new HandGroupHandle(PZOrientation.RIGHT, pView.rightHandGroup);

            //注册事件监听
            this.registerAllEvent(pView);
        }

        /**
         * 注册事件监听
         */
        private registerAllEvent(pView:TableBoardCardsHandView):void {
            let self = this;
            //添加自己手牌区域的监听，用来出牌
            self._downHandGroupHandle.realHandViewGroup.addEventListener(egret.TouchEvent.TOUCH_TAP, self._downHandGroupHandle.touchMyHandCardArea, self._downHandGroupHandle);
            self._downHandGroupHandle.realHandViewGroup.addEventListener(egret.TouchEvent.TOUCH_BEGIN, self._downHandGroupHandle.touchBeginMyHandCardArea, self._downHandGroupHandle);

            //注册按钮事件
            pView.guoBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, self.touchGuoBtn, self);
            pView.chiBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, self.touchChiBtn, self);
            pView.pengBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, self.touchPengBtn, self);
            pView.gangBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, self.touchGangBtn, self);
            pView.tingBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, self.touchTingBtn, self);
            pView.huBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, self.touchHuBtn, self);

            //选择事件
            pView.oneGroup.addEventListener(egret.TouchEvent.TOUCH_TAP, self.touchSelectOne, self);
            pView.twoGroup.addEventListener(egret.TouchEvent.TOUCH_TAP, self.touchSelectTwo, self);
            pView.threeGroup.addEventListener(egret.TouchEvent.TOUCH_TAP, self.touchSelectThree, self);
        }

        /**
         * 注册之后调用
         */
        public onRegister():void {
            // egret.log("--TableBoardCardsHandViewMediator--onRegister");
            // 监听屏幕尺寸改变
            egret.MainContext.instance.stage.addEventListener(egret.Event.RESIZE, this.resizeEgretState, this);
        }

        /**
         * 移除之后调用
         */
        public onRemove():void {
            // egret.log("--TableBoardCardsHandViewMediator--onRemove");
            egret.MainContext.instance.stage.removeEventListener(egret.Event.RESIZE, this.resizeEgretState, this);
        }

        /**
         * 感兴趣的通知指令
         * @returns {Array<any>}
         */
        public listNotificationInterests():Array<any> {
            return [
                MJGameModule.MJGAME_CHI,
                MJGameModule.MJGAME_PENG,
                MJGameModule.MJGAME_MING_GANG,
                MJGameModule.MJGAME_AN_GANG,
                MJGameModule.MJGAME_BU_GANG,
                MJGameModule.MJGAME_TING,
                MJGameModule.MJGAME_REFRESH_HAND_PAI,
                MJGameModule.MJGAME_REMIND_CHU_PAI,
                MJGameModule.MJGAME_HU_CARD_LIST_UPDATE,
                MJGameModule.MJGAME_OPERATION_CANCEL,
                MJGameModule.MJGAME_REPLAY_MO_PAI
            ];
        }

        /**
         * 处理通知
         * @param {puremvc.INotification} pNotification
         */
        public handleNotification(pNotification:puremvc.INotification):void{
            let data:any = pNotification.getBody();
            switch(pNotification.getName()) {
                case MJGameModule.MJGAME_CHI:{
                    this.chi(data);
                    break;
                }
                case MJGameModule.MJGAME_PENG:{
                    this.peng(data);
                    break;
                }
                case MJGameModule.MJGAME_MING_GANG:{
                    this.mingGang(data);
                    break;
                }
                case MJGameModule.MJGAME_AN_GANG:{
                    this.anGang(data);
                    break;
                }
                case MJGameModule.MJGAME_BU_GANG:{
                    this.buGang(data);
                    break;
                }
                case MJGameModule.MJGAME_TING:{
                    this.ting(data);
                    break;
                }
                case MJGameModule.MJGAME_REFRESH_HAND_PAI:{
                    this.refreshHandPai(data);
                    break;
                }
                case MJGameModule.MJGAME_REMIND_CHU_PAI:{
                    this.remindChuPai(data);
                    break;
                }
                case MJGameModule.MJGAME_HU_CARD_LIST_UPDATE:{
                    this._downHandGroupHandle.huCardListUpdate(data);
                    break;
                }
                case MJGameModule.MJGAME_OPERATION_CANCEL:{
                    //隐藏按钮
                    this.getView().hideAllGroup();
                    //取消手牌所有选中
                    this._downHandGroupHandle.cancelAllSelected();
                    break;
                }
                case MJGameModule.MJGAME_REPLAY_MO_PAI:{
                    this.moPai(data);
                    break;
                }
            }
        }

        /**
         * 获得手里牌显示组操作对象
         * @param {FL.PZOrientation} pzOrientation
         * @returns {FL.HuaGroupHandle}
         */
        private getHandGroupHandle(pzOrientation:PZOrientation):HandGroupHandle {
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
            self._upHandGroupHandle.resetView(MJGameHandler.getPlayerCardDown(PZOrientation.UP));
            self._downHandGroupHandle.resetView(MJGameHandler.getPlayerCardDown(PZOrientation.DOWN));
            self._leftHandGroupHandle.resetView(MJGameHandler.getPlayerCardDown(PZOrientation.LEFT));
            self._rightHandGroupHandle.resetView(MJGameHandler.getPlayerCardDown(PZOrientation.RIGHT));

            self._downHandGroupHandle.resetViewHandCard(MJGameHandler.getHandCardArray(PZOrientation.DOWN));
            if (MJGameHandler.isReplay()) {
                // 重播
                self._upHandGroupHandle.resetViewHandCard(MJGameHandler.getHandCardArray(PZOrientation.UP));
                self._leftHandGroupHandle.resetViewHandCard(MJGameHandler.getHandCardArray(PZOrientation.LEFT));
                self._rightHandGroupHandle.resetViewHandCard(MJGameHandler.getHandCardArray(PZOrientation.RIGHT));
            } else {
                self._upHandGroupHandle.resetHideHandCard();
                self._leftHandGroupHandle.resetHideHandCard();
                self._rightHandGroupHandle.resetHideHandCard();
            }

            // 因为头像移动有可能存在缓动的情况(头像缓存时间是200毫秒)，所以延迟重设一个下下面玩家头像点击区域
            MyCallBackUtil.delayedCallBack(300, self.getView().resetHeadViewDownClickAreaPos, self.getView());
        }

        /**
         * 屏幕尺寸改变重设位置
         * @param {egret.Event} e
         */
        private resizeEgretState(e:egret.Event) {
            MyCallBackUtil.delayedCallBack(200, this.getView().resetHeadViewDownClickAreaPos, this.getView());
            // this.getView().resetHeadViewDownClickAreaPos();
        }


        /**
         * 吃牌
         * @param {FL.PlayerTableOperationMsg} msg
         */
        private chi(msg:PlayerTableOperationMsg):void {
            // 获得吃牌
            let vChiCard1:number = msg.opValue & 0xFF;
            let vChiCard2:number = msg.opValue >> 8 & 0xFF;
            let vChiCard3:number = msg.opValue >> 16 & 0xFF;
            let vChiCard4:number = msg.opValue >> 24 & 0xFF;

            // 需要移除的数组
            let vRemoveArray:number[] = [];
            if (vChiCard1 !== vChiCard4) vRemoveArray.push(vChiCard1);
            if (vChiCard2 !== vChiCard4) vRemoveArray.push(vChiCard2);
            if (vChiCard3 !== vChiCard4) vRemoveArray.push(vChiCard3);

            // 删除两个吃牌
            this.handleOneCardDown(msg, vRemoveArray);
        }

        /**
         * 碰牌
         * @param {FL.PlayerTableOperationMsg} msg
         */
        private peng(msg:PlayerTableOperationMsg):void {
            let vPengCardValue:number = msg.opValue & 0xFF;
            //删除两个碰牌
            this.handleOneCardDown(msg, [vPengCardValue,vPengCardValue]);
        }

        /**
         * 明杠
         * @param {FL.PlayerTableOperationMsg} msg
         */
        private mingGang(msg:PlayerTableOperationMsg):void {
            //判断是否是通知消息
            if (msg.opValue === GameConstant.MAHJONG_OPERTAION_GANG_NOTIFY) {
                //特效和声音已经改放到 TableBoardEffectViewMediator
                // let vPZOrientation:PZOrientation = MJGameHandler.getPZOrientation(msg.player_table_pos);
                //播放杠动画 和 声音
                //播放音效
                // MJGameSoundHandler.gang(vPZOrientation);
            } else {
                let vGangCardValue:number = msg.opValue & 0xFF;
                this.handleOneCardDown(msg, [vGangCardValue, vGangCardValue, vGangCardValue]);
            }
        }

        /**
         * 暗杠
         * @param {FL.PlayerTableOperationMsg} msg
         */
        private anGang(msg:PlayerTableOperationMsg):void {
            let vPZOrientation:PZOrientation = MJGameHandler.getPZOrientation(msg.player_table_pos);
            //播放音效
            MJGameSoundHandler.gang(vPZOrientation);
            let vGangCardValue:number = msg.opValue & 0xFF;
            this.handleOneCardDown(msg, [vGangCardValue, vGangCardValue, vGangCardValue, vGangCardValue]);
        }

        /**
         * 补杠
         * @param {FL.PlayerTableOperationMsg} msg
         */
        private buGang(msg:PlayerTableOperationMsg):void {
            let vPZOrientation:PZOrientation = MJGameHandler.getPZOrientation(msg.player_table_pos);
            //播放音效
            MJGameSoundHandler.gang(vPZOrientation);
            let vGangCardValue:number = msg.opValue & 0xFF;
            this.handleOneCardDown(msg, [vGangCardValue]);
        }

        /**
         * 听牌，只处理自己的
         * @param {FL.PZOrientation} pzOrientation
         */
        private ting(pzOrientation:PZOrientation):void {
            // egret.log("## Hand pzOrientation="+pzOrientation);
            if (pzOrientation === PZOrientation.DOWN) {
                this._downHandGroupHandle.addTingIcon();
            }
        }

        /**
         * 处理一个cardDown
         * @param {FL.PlayerTableOperationMsg} msg
         * @param {number[]} removeArray
         */
        private handleOneCardDown(msg:PlayerTableOperationMsg, removeArray:number[]):void {
            let vPZOrientation:PZOrientation = MJGameHandler.getPZOrientation(msg.player_table_pos);
            let vHandGroupHandle:HandGroupHandle = this.getHandGroupHandle(vPZOrientation);
            let vCardDown:CardDown = new CardDown();
            vCardDown.type = msg.operation;
            vCardDown.cardValue = msg.opValue;
            vCardDown.chuOffset = msg.chuOffset;
            vHandGroupHandle.addCardDown(vCardDown);
            if (vPZOrientation === PZOrientation.DOWN || MJGameHandler.isReplay()) {
                let vMaxCardNum:number = 14;
                // cardDown.type === GameConstant.MAHJONG_OPERTAION_MING_GANG || cardDown.type === GameConstant.MAHJONG_OPERTAION_AN_GANG || cardDown.type === GameConstant.MAHJONG_OPERTAION_BU_GANG
                if (msg.operation === GameConstant.MAHJONG_OPERTAION_MING_GANG || msg.operation === GameConstant.MAHJONG_OPERTAION_AN_GANG || msg.operation === GameConstant.MAHJONG_OPERTAION_BU_GANG) {
                    vMaxCardNum = 13;
                }
                //删除牌后刷新
                vHandGroupHandle.resetViewHandCardByRemoveArray(removeArray, vMaxCardNum);
            } else {
                //刷新隐藏牌
                vHandGroupHandle.resetHideHandCard();
            }
        }

        /**
         * 刷新手牌
         * @param {{tabelPos: number; handCards: Array<number>}} handCardObj
         */
        private refreshHandPai(handCardObj:{tablePos:number, handCards:Array<number>}):void {
            if (handCardObj && handCardObj.handCards && handCardObj.handCards.length > 0) {
                let vPZOrientation:PZOrientation = MJGameHandler.getPZOrientation(handCardObj.tablePos);
                let vHandGroupHandle:HandGroupHandle = this.getHandGroupHandle(vPZOrientation);
                vHandGroupHandle.resetViewHandCard(handCardObj.handCards);
            }
        }

        /**
         * 摸进一张牌，只在回放的时候使用
         */
        private moPai(pMoPai:{tablePos:number, cardValue:number}): void {
            //获得操作类
            let vPZOrientation:PZOrientation = MJGameHandler.getPZOrientation(pMoPai.tablePos);
            let vHandGroupHandle:HandGroupHandle = this.getHandGroupHandle(vPZOrientation);
            vHandGroupHandle.addLastViewCard(pMoPai.cardValue);
        }

        /**
         * 提醒玩家该出牌了，其中有一个新模进来的牌
         * @param {FL.PlayerOperationNotifyMsg} msg
         */
        private remindChuPai(msg:PlayerOperationNotifyMsg):void {
            let self = this;
            //获得操作类
            let vPZOrientation:PZOrientation = MJGameHandler.getPZOrientation(msg.player_table_pos);
            if (vPZOrientation !== PZOrientation.DOWN) return;

            let vHandGroupHandle:HandGroupHandle = self.getHandGroupHandle(vPZOrientation);
            // self._downHandGroupHandle.cancelAllSelected();
            //隐藏所有的操作组
            if (vPZOrientation === PZOrientation.DOWN) {
                this.getView().hideAllGroup();
                this._downHandGroupHandle.cancelAllSelected();
            }
            //如果新摸进来的牌>0，则添加这个牌到最后一个
            if (NumberUtil.isAndNumber(msg.operation, GameConstant.MAHJONG_OPERTAION_CHU) && msg.chi_card_value > 0) {
                vHandGroupHandle.addLastViewCard(msg.chi_card_value);
                if (MJGameHandler.isHuaCard(msg.chi_card_value)) {
                    //如果是花，马上打出去
                    //往服务器发送出牌指令,延时400毫秒
                    MyCallBackUtil.delayedCallBack(500, self._downHandGroupHandle.removeLastAndChu, self._downHandGroupHandle);
                    //关闭开关
                    self.closeTouchHandCardSwitch();
                    //强行打开可操作开关
                    // MJGameHandler.touchHandCardSwitch.compelOpen();
                } else {
                    //强行打开可操作开关
                    MJGameHandler.touchHandCardSwitch.compelOpen();
                }
            } else {
                //强行打开可操作开关
                MJGameHandler.touchHandCardSwitch.compelOpen();
            }

            //处理按钮组逻辑，只有自己才用处理
            self.exeButtonGroupLogic(msg);

        }

        /**
         * 关闭开关
         */
        private closeTouchHandCardSwitch():void {
            //关闭可操作开关
            MJGameHandler.touchHandCardSwitch.close();
            //延时打开开关
            //打开回调
            // let vOpenCallBack:MyCallBack = MJGameHandler.touchHandCardSwitch.genCurrOpenCallBack();
            // MyCallBackUtil.delayedCallBack(3000, vOpenCallBack.apply, vOpenCallBack);
        }

        /**
         * 处理按钮组逻辑, 只有自己才用处理
         * @param {FL.PlayerOperationNotifyMsg} msg
         */
        private exeButtonGroupLogic(msg:PlayerOperationNotifyMsg):void {
            let self = this;
            //只有自己才用处理
            let vPZOrientation:PZOrientation = MJGameHandler.getPZOrientation(msg.player_table_pos);
            if (vPZOrientation !== PZOrientation.DOWN) return;
            if (NumberUtil.isAndNumber(msg.operation, GameConstant.MAHJONG_OPERTAION_CHI)
                || NumberUtil.isAndNumber(msg.operation, GameConstant.MAHJONG_OPERTAION_PENG)
                || NumberUtil.isAndNumber(msg.operation, GameConstant.MAHJONG_OPERTAION_MING_GANG)
                || NumberUtil.isAndNumber(msg.operation, GameConstant.MAHJONG_OPERTAION_AN_GANG)
                || NumberUtil.isAndNumber(msg.operation, GameConstant.MAHJONG_OPERTAION_BU_GANG)
                || NumberUtil.isAndNumber(msg.operation, GameConstant.MAHJONG_OPERTAION_TING)
                || NumberUtil.isAndNumber(msg.operation, GameConstant.MAHJONG_OPERTAION_HU)) {

                //定义操作数组
                let vOperationArray:number[] = [];

                //是否已经将手中选中的牌改为未选中
                // let vIsCancelAllSelect:boolean = false;

                //提示吃碰杠听
                //吃
                if (NumberUtil.isAndNumber(msg.operation, GameConstant.MAHJONG_OPERTAION_CHI)) {
                    vOperationArray.push(GameConstant.MAHJONG_OPERTAION_CHI);
                    let vChiCard1:number = msg.chi_card_value >> 24 & 0xFF;
                    let vChiCard2:number = msg.chi_card_value >> 16 & 0xFF;
                    let vChiCard3:number = msg.chi_card_value >> 8 & 0xFF;
                    let vChiCard4:number = msg.chi_card_value & 0xFF;
                    if (vChiCard1 > 0) self._downHandGroupHandle.selectOneCardValue(vChiCard1);
                    if (vChiCard2 > 0) self._downHandGroupHandle.selectOneCardValue(vChiCard2);
                    if (vChiCard3 > 0) self._downHandGroupHandle.selectOneCardValue(vChiCard3);
                    if (vChiCard4 > 0) self._downHandGroupHandle.selectOneCardValue(vChiCard4);
                }
                //碰
                if (NumberUtil.isAndNumber(msg.operation, GameConstant.MAHJONG_OPERTAION_PENG)) {
                    vOperationArray.push(GameConstant.MAHJONG_OPERTAION_PENG);
                    self._downHandGroupHandle.selectOneCardValue(msg.peng_card_value&0xFF);
                }
                //杠
                if (NumberUtil.isAndNumber(msg.operation, GameConstant.MAHJONG_OPERTAION_MING_GANG)
                    || NumberUtil.isAndNumber(msg.operation, GameConstant.MAHJONG_OPERTAION_AN_GANG)
                    || NumberUtil.isAndNumber(msg.operation, GameConstant.MAHJONG_OPERTAION_BU_GANG)) {
                    vOperationArray.push(GameConstant.MAHJONG_OPERTAION_MING_GANG);
                    let vGangCardValue1:number = msg.peng_card_value&0xFF;
                    self._downHandGroupHandle.selectOneCardValue(vGangCardValue1);

                    let vGangCardValue2:number = (msg.peng_card_value>>8)&0xFF;
                    if (vGangCardValue2 > 0) {
                        self._downHandGroupHandle.selectOneCardValue(vGangCardValue2);
                    }
                    //最多3个杠
                    let vGangCardValue3:number = (msg.peng_card_value>>16)&0xFF;
                    if (vGangCardValue3 > 0) {
                        self._downHandGroupHandle.selectOneCardValue(vGangCardValue3);
                    }
                }
                //听
                if (NumberUtil.isAndNumber(msg.operation, GameConstant.MAHJONG_OPERTAION_TING)) {
                    vOperationArray.push(GameConstant.MAHJONG_OPERTAION_TING);
                    self._downHandGroupHandle.selectCardGroup(msg.tingList);
                }
                //胡
                if (NumberUtil.isAndNumber(msg.operation, GameConstant.MAHJONG_OPERTAION_HU)) {
                    vOperationArray.push(GameConstant.MAHJONG_OPERTAION_HU);
                }

                if (vOperationArray.length > 0) {
                    //显示操作按钮
                    self.getView().viewButtonGroup(vOperationArray);
                    //设置值，按下按钮之后有些要从这里取值
                    self._remindChuPaiMsg = msg;
                }

            }
        }

        /**
         * 获得显示组件
         * @returns {FL.TableBoardCardsHandView}
         */
        private getView():TableBoardCardsHandView {
            return <TableBoardCardsHandView>this.viewComponent;
        }


        /**
         * 点击过按钮
         * @param {egret.TouchEvent} e
         */
        private touchGuoBtn(e:egret.TouchEvent):void {
            MJGameMsgHandler.sendCancelOperationMsg();
            this.getView().hideButtonGroup();
            this._downHandGroupHandle.cancelAllSelected();
        }

        /**
         * 点击吃按钮
         * byte c1 = pl.findCardInHand(card + 1);
             byte c2 = pl.findCardInHand(card + 2);
             byte c_1 = pl.findCardInHand(card - 1);
             byte c_2 = pl.findCardInHand(card - 2);
             //
             if (c_1 > 0 && c_2 > 0) {
                card_value |= c_2 | (c_1 << 8);
                found = true;
            }
             //
             if (c_1 > 0 && c1 > 0) {
                card_value |= (c1 << 16) | (c_1 << 8);
                found = true;
            }
             //
             if (c1 > 0 && c2 > 0) {
                card_value |= (c2 << 24) | (c1 << 16);
                found = true;
            }
         * @param {egret.TouchEvent} e
         */
        private touchChiBtn(e:egret.TouchEvent):void {
            // 吃
            let vMsg:PlayerOperationNotifyMsg = this._remindChuPaiMsg;
            // 获得牌
            let vChiCard1:number = vMsg.chi_card_value & 0xFF;
            let vChiCard2:number = vMsg.chi_card_value >> 8 & 0xFF;
            let vChiCard3:number = vMsg.chi_card_value >> 16 & 0xFF;
            let vChiCard4:number = vMsg.chi_card_value >> 24 & 0xFF;
            // 吃牌数组
            let vCardArray:number[][] = [];
            if (vChiCard1 > 0 && vChiCard2 > 0) {
                vCardArray.push([vChiCard1, vChiCard2, vChiCard2+1]);
            }
            if (vChiCard2 > 0 && vChiCard3 > 0) {
                vCardArray.push([vChiCard2, vChiCard3, vChiCard2+1]);
            }
            if (vChiCard3 > 0 && vChiCard4 > 0) {
                vCardArray.push([vChiCard3, vChiCard4, vChiCard3-1]);
            }
            if (vCardArray.length === 1) {
                // 只有一个，直接吃
                MJGameMsgHandler.sendChiMsg(vCardArray[0][0] | vCardArray[0][1] << 8);
            } else {
                this._currSelectOperationType = GameConstant.MAHJONG_OPERTAION_CHI;
                // 多个则需要选择
                this.getView().viewSelectGroup(vCardArray);
            }
            // 隐藏操作按钮
            this.getView().hideButtonGroup();
            // 设置不能操作，关闭开关
            this.closeTouchHandCardSwitch();
        }

        /**
         * 点击碰按钮
         * @param {egret.TouchEvent} e
         */
        private touchPengBtn(e:egret.TouchEvent):void {
            // egret.log("touchPengBtn");
            MJGameMsgHandler.sendPengMsg(this._remindChuPaiMsg.peng_card_value&0xFFFF);
            // this.getView().hideButtonGroup();
            this.getView().hideAllGroup();
            //设置不能操作，关闭开关
            this.closeTouchHandCardSwitch();
        }

        /**
         * 点击杠按钮
         * @param {egret.TouchEvent} e
         */
        private touchGangBtn(e:egret.TouchEvent):void {
            let vPlayerOperationNotifyMsg:PlayerOperationNotifyMsg = this._remindChuPaiMsg;
            //获得牌
            let vGangCardValue1:number = vPlayerOperationNotifyMsg.peng_card_value&0xFF;
            let vGangCardValue2:number = (vPlayerOperationNotifyMsg.peng_card_value>>8)&0xFF;
            //最多同时3个杠
            let vGangCardValue3:number = (vPlayerOperationNotifyMsg.peng_card_value>>16)&0xFF;
            if (vGangCardValue2 > 0) {
                //有多个杠弹出多个杠界面
                let vCardArray:number[][] = [];
                vCardArray.push([vGangCardValue1, vGangCardValue1, vGangCardValue1, vGangCardValue1]);
                vCardArray.push([vGangCardValue2, vGangCardValue2, vGangCardValue2, vGangCardValue2]);
                if (vGangCardValue3 > 0) vCardArray.push([vGangCardValue3, vGangCardValue3, vGangCardValue3, vGangCardValue3]);
                this._currSelectOperationType = GameConstant.MAHJONG_OPERTAION_MING_GANG;
                this.getView().viewSelectGroup(vCardArray);
            } else {
                //所有杠否发明杠消息，服务端会自己判断
                MJGameMsgHandler.sendMingGaneMsg(vGangCardValue1);
            }
            this.getView().hideButtonGroup();
            //设置不能操作，关闭开关
            this.closeTouchHandCardSwitch();
        }

        /**
         * 点击听按钮
         * @param {egret.TouchEvent} e
         */
        private touchTingBtn(e:egret.TouchEvent):void {
            let self = this;
            MJGameMsgHandler.sendTingMsg();
            //把不能听牌的牌设置为不能打，只能打可以听牌的牌
            self._downHandGroupHandle.cancelAllSelected();
            self._downHandGroupHandle.selectCardGroup(self._remindChuPaiMsg.tingList);
            self._downHandGroupHandle.setAllNoSelectNotCanSelect();
            // self.getView().hideButtonGroup();
            self.getView().hideAllGroup();
        }

        /**
         * 点击胡按钮
         * @param {egret.TouchEvent} e
         */
        private touchHuBtn(e:egret.TouchEvent):void {
            let self = this;
            MJGameMsgHandler.sendHuMsg();
            // self.getView().hideButtonGroup();
            self.getView().hideAllGroup();
            self._downHandGroupHandle.cancelAllSelected();
            //设置不能操作，关闭开关
            self.closeTouchHandCardSwitch();
        }

        /**
         * 点击第一个选择组，没有处理吃的情况
         * @param {egret.TouchEvent} e
         */
        private touchSelectOne(e:egret.TouchEvent):void {
            this.selectGroup(0);
        }

        /**
         * 点击第二个选择组，没有处理吃的情况
         * @param {egret.TouchEvent} e
         */
        private touchSelectTwo(e:egret.TouchEvent):void {
            this.selectGroup(1);
        }

        /**
         * 点击第三个选择组，没有处理吃的情况
         * @param {egret.TouchEvent} e
         */
        private touchSelectThree(e:egret.TouchEvent):void {
            this.selectGroup(2);
        }

        /**
         * 选择杠
         * @param {number} index
         */
        private selectGroup(index:number):void {
            if (this._currSelectOperationType === GameConstant.MAHJONG_OPERTAION_MING_GANG) {
                //获得牌
                let vGangCardValue:number = (this._remindChuPaiMsg.peng_card_value >> (index * 8))&0xFF;
                //所有杠否发明杠消息，服务端会自己判断
                MJGameMsgHandler.sendMingGaneMsg(vGangCardValue);
            } else if (this._currSelectOperationType === GameConstant.MAHJONG_OPERTAION_CHI) {
                // 吃
                let vMsg:PlayerOperationNotifyMsg = this._remindChuPaiMsg;
                // 获得牌
                let vChiCard1:number = vMsg.chi_card_value & 0xFF;
                let vChiCard2:number = vMsg.chi_card_value >> 8 & 0xFF;
                let vChiCard3:number = vMsg.chi_card_value >> 16 & 0xFF;
                let vChiCard4:number = vMsg.chi_card_value >> 24 & 0xFF;
                // 吃牌数组
                let vCardArray:number[][] = [];
                if (vChiCard1 > 0 && vChiCard2 > 0) {
                    vCardArray.push([vChiCard1, vChiCard2, vChiCard2+1]);
                }
                if (vChiCard2 > 0 && vChiCard3 > 0) {
                    vCardArray.push([vChiCard2, vChiCard3, vChiCard2+1]);
                }
                if (vChiCard3 > 0 && vChiCard4 > 0) {
                    vCardArray.push([vChiCard3, vChiCard4, vChiCard3-1]);
                }
                MJGameMsgHandler.sendChiMsg(vCardArray[index][0] | vCardArray[index][1] << 8);
            }
            this.getView().hideAllGroup();
            //设置不能操作，关闭开关
            this.closeTouchHandCardSwitch();
        }

    }





}