module FL {

    /**
     * 触摸卡牌移动方向
     */
    export enum ECardTouchOrientation {
        Default,//初始状态
        Left,//左滑
        Right,//右滑
    }

    /** 我的手牌操作类 */
    export class RFMyHandGroupHandle extends eui.Component {
        /** 显示组 */
        private readonly _viewGroup: eui.Group;
        /** 触摸组 */
        private readonly _touchGroup: eui.Group;
        /** 操作按钮组 */
        private readonly _controlGroup: eui.Group;

        /** 提示按钮 */
        public promptBtn: eui.Image;
        /** 不要按钮 */
        public rejectBtn: eui.Image;
        /** 出牌按钮 */
        public playBtn: eui.Image;
        /** 要不起按钮 */
        public ybqBtn: eui.Image;

        /** 当前手牌对象数组 */
        private cardObjsArr: RFHandCardItemView[] = [];
        /** 记录当前手牌对象坐标x的数组 */
        private posArr: number[] = [];
        /** 选中的卡牌index数组 */
        private choseArr: number[] = [];
        /** 未被选中的卡牌index数组 */
        private unChoseArr: number[] = [];
        /** 需要被遮罩的卡牌 */
        private shadeArr: number[] = [];

        /** 卡牌数据对应index的map */
        private cardIdxMap: { [id: number]: number } = {};
        /** 提示卡牌data数组 */
        private promptArr: any[] = [];
        /** 提示卡牌index数组 */
        private promptIndexArr: any[] = [];
        /** 牌背数组*/
        private cardBackArr: Array<eui.Image> = [];

        private flag_promptNum: number = 0;//当前点击提示按钮的次数

        /** 卡牌滤镜 */
        private colorFilter: egret.ColorMatrixFilter = null;

        /** 最大手牌数为20 */
        private maxCardNum = 20;
        /** 牌之间的间距 */
        private cardGap = 60;
        /** 单张牌最大的宽度 */
        private maxCardWid = 138;
        /** 牌的缩放系数 */
        private scaleNum = 1;

        /** 卡牌动画计时器 */
        private _cardTimer: Game.Timer;
        /** 当前动画手牌数 */
        private _cardAniNum: number = 0;

        /** 实际手牌数 */
        private _cardNum: number = 0;

        /** 触摸开始坐标x */
        private flag_s_x: number = 0;
        /** 触摸开始对应卡牌index */
        private flag_s_index: number = -1;
        /** 当前触摸卡牌index */
        private flag_c_index: number = -1;
        /** 上一次的触摸移动方向 */
        private flag_orientation = ECardTouchOrientation.Default;

        /** 是否管牌 */
        private flag_isMgr: boolean = false;
        /** 当前牌型 */
        private flag_curPattern: number = 0;
        /** 当前牌型大小 */
        private flag_curPatSize: number = 0;
        /** 当前牌型长度 */
        private flag_curPatLeng: number = 0;
        /** 当前牌总长度 */
        private flag_curTotalLeng: number = 0;
        /** 是否要的起，只有在管牌时有效的值 */
        private flag_isBigger: boolean = false;

        public constructor() {
            super();
            this.horizontalCenter = 0;
            this.bottom = this.top = 0;
            this.skinName = "skins.RFMyHandGroupViewSkin";
        }

        protected childrenCreated() {
            super.childrenCreated();

            let self = this;
            //注册按钮缓动
            TouchTweenUtil.regTween(self.promptBtn, self.promptBtn);
            TouchTweenUtil.regTween(self.rejectBtn, self.rejectBtn);
            TouchTweenUtil.regTween(self.playBtn, self.playBtn);
            TouchTweenUtil.regTween(self.ybqBtn, self.ybqBtn);

            //注册监听事件
            // this._viewGroup.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onChoseCard, this);
            self._touchGroup.addEventListener(egret.TouchEvent.TOUCH_BEGIN, self.onChoseBegin, self);
            self._touchGroup.addEventListener(egret.TouchEvent.TOUCH_END, self.onChoseEnd, self);
            self._touchGroup.addEventListener(egret.TouchEvent.TOUCH_CANCEL, self.onChoseEnd, self);
            self._touchGroup.addEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, self.onChoseEnd, self);
            self.playBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, self.playCards, self);
            self.rejectBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, self.rejectPlay, self);
            self.promptBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, self.promptCards, self);
            self.ybqBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, self.ybqPlay, self);
        }

        /** 初始化属性 */
        private initProps() {
            let maxNum = RFGameData.gameMaxCardNum;
            switch (maxNum) {
                case 20:
                    this.scaleNum = 1.1;
                    this.cardGap = 60;
                    break;
                default:
                    this.scaleNum = 1.16;
                    // this.cardGap = 65;
                    this.cardGap = 71;
                    break;
            }
        }

        /** 初始化滤镜 */
        private initFilter() {
            //滤镜
            //颜色矩阵数组
            // let colorMatrix = [
            //     0.3, 0.3, 0, 0, 0,
            //     0.3, 0.3, 0, 0, 0,
            //     0.3, 0.3, 0, 0, 0,
            //     0, 0, 0, 1, 0
            // ];
            let colorMatrix = [
                0, 0.5, 0, 0, 0,
                0, 0.5, 0, 0, 0,
                0, 0.5, 0, 0, 0,
                0, 0, 0, 1, 0
            ];
            this.colorFilter = new egret.ColorMatrixFilter(colorMatrix);
        }

        public rePokerStyle() {
            for (let i = 0;i < this.cardObjsArr.length;i ++) {
                let card: any = this.cardObjsArr[i];
                if (!card || !(card instanceof RFHandCardItemView)) continue;
                (<RFHandCardItemView>card).rePokerStyle();
            }
        }

        /** 是否显示操作组 */
        public isShowControlGroup(flag: boolean) {
            this._controlGroup.visible = flag;
            if (RFGameHandle.isReplay()) this._controlGroup.visible = false;//回放时不显示操作按钮
        }

        /** 改变按钮显示及功能 */
        public changeControl(msg: PokerRemindPlayCardMsgAck) {
            // console.log(msg);
            if (!msg) return;
            this._needAutoYbqPlay = false; // 自动要不起设置为false

            this.playBtn.visible = true;
            this.promptBtn.visible = true;
            this.rejectBtn.visible = msg.isCanNotPlay;
            this.ybqBtn.visible = true;
            this.promptArr = [];
            this.promptIndexArr = [];
            this.flag_isMgr = msg.isMgrCard;
            this.flag_curPattern = msg.handPatterns;
            this.flag_curPatSize = msg.handPatternsSize;
            this.flag_curPatLeng = msg.handPatternsNum;
            this.flag_curTotalLeng = msg.lastAllLength;
            this.flag_isBigger = msg.isHasBigger;
            if (msg.isAllPlayInOnce) {
                //可以一次出完
                this.playBtn.visible = false;
                this.promptBtn.visible = false;
                this.rejectBtn.visible = msg.isCanNotPlay;
                this.ybqBtn.visible = false;
                this.cardObjsArr.forEach((x, index) => {
                    this.choseCard(index);
                });
                //直接打出牌
                this.playCards(false);
                return;
            }
            if (!msg.isMgrCard) {
                //不是管牌，没有提示按钮，代表这一轮新出牌，随便出
                this.promptBtn.visible = false;
                this.rejectBtn.visible = msg.isCanNotPlay;
                this.ybqBtn.visible = false;
                this.playBtn.x = 545;
                return;
            }
            if (!msg.isHasBigger) {
                //要不起
                this.playBtn.visible = false;
                this.promptBtn.visible = false;
                this.rejectBtn.visible = msg.isCanNotPlay;

                // GlobalData.isIntoBack || GlobalData.isStartBackFromBackDelayed
                if (msg.isYaoBuQiZiDong) {
                    this.ybqBtn.visible = false;
                    this._needAutoYbqPlay = true;
                    this._delayedYbqPlayTimer = null;
                    if (GlobalData.isIntoBack) {
                        this._needAutoYbqPlay = true;
                    } else {
                        let vDelayedTimes: number = 80;
                        if (msg.isJoinOldGameTable) {
                            vDelayedTimes = 1350;
                        }
                        this.delayedYbqPlay(vDelayedTimes);
                    }
                } else {
                    this.ybqBtn.visible = true;
                    this.ybqBtn.x = 545;
                }

                // this.resetCardState();
                // //全部添加遮罩
                // let shadeArr = [];
                // for (let i = 0; i < this.cardObjsArr.length; ++i) {
                //     shadeArr.push(i);
                // }
                // this.shadeArr = shadeArr;
                // this.addShade(this.shadeArr);
                return;
            }

            this.ybqBtn.visible = false;
            this.playBtn.x = 680;
            this.promptArr = PokerRemindPlayCardMsgAck.serializeRemindCards(msg.remindCards);
            if (this.promptArr.length) this.promptArr.forEach(x => {
                this.promptIndexArr.push(this.getCardIndexArr(x));
            });

            let shadeArr = this.getShadeIdxArr();
            if (this.needReset()) {
                if (this.promptArr.length == 1) {
                    // 提示牌型唯一时才自动提示
                    this.promptCards();
                }
                else {
                    this.resetCardState();
                }
            }
            //添加遮罩
            this.addShade(shadeArr);
        }

        /**
         * 销毁延时出牌
         */
        public distroyDelayedYbqPlay(): void {
            if (this._delayedYbqPlayTimer && this._delayedYbqPlayTimer.running) {
                this._delayedYbqPlayTimer.stop();
            }
            this._needAutoYbqPlay = false;
            this._delayedYbqPlayTimer = null;
        }

        /** 自动要不起相关 */
        private _needAutoYbqPlay: boolean = false;
        private _delayedYbqPlayTimer: Game.Timer;
        public delayedYbqPlay(pDelayed: number = 500): void {
            let self = this;
            if (!self._needAutoYbqPlay || GlobalData.isIntoBack) {
                return;
            }
            if (!self._delayedYbqPlayTimer) {
                let vDelayedYbqPlayTimer: Game.Timer = new Game.Timer(pDelayed);
                vDelayedYbqPlayTimer.once(egret.TimerEvent.TIMER, this.delayedYbqPlay, this);
                this._delayedYbqPlayTimer = vDelayedYbqPlayTimer;
                vDelayedYbqPlayTimer.start();
                return;
            }

            let vCurrTimes: number = new Date().getTime();
            if (GlobalData.backFromBackTimes > vCurrTimes - 1300) {
                if (self._delayedYbqPlayTimer && self._delayedYbqPlayTimer.running) {
                    self._delayedYbqPlayTimer.stop();
                }
                let vDelayedYbqPlayTimer: Game.Timer = new Game.Timer(pDelayed);
                vDelayedYbqPlayTimer.once(egret.TimerEvent.TIMER, this.delayedYbqPlay, this);
                this._delayedYbqPlayTimer = vDelayedYbqPlayTimer;
                vDelayedYbqPlayTimer.start();
                return;
            }
            // 要不起
            self.ybqPlay();
            self._needAutoYbqPlay = false;
            if (self._delayedYbqPlayTimer) {
                self._delayedYbqPlayTimer.stop();
            }
            self._delayedYbqPlayTimer = null;
        }

        /**
         * 根据卡牌数据获得其对应index数组
         */
        private getCardIndexArr(data: number[]) {
            if (!this.cardObjsArr || !this.cardObjsArr.length || !data || !data.length) return;
            let indexArr = [];
            data.forEach(x => {
                indexArr.push(this.cardIdxMap[x]);
            }, this);
            return indexArr;
        }

        /** 重置页面 */
        public resetView(useAni: boolean = false) {
            this.initProps();
            for (let i = this._viewGroup.numChildren - 1; i >= 0; i--) {
                let card: any = this._viewGroup.getChildAt(i);
                RFCardItemPool.recoverCardItem(card);
            }
            this._viewGroup.removeChildren();
            this.cardObjsArr = [];
            this.posArr = [];
            this.choseArr = [];
            this.unChoseArr = [];
            this.promptArr = [];
            this.promptIndexArr = [];
            this.shadeArr = [];
            this.cardIdxMap = {};
            this.flag_promptNum = 0;
            this.flag_orientation = ECardTouchOrientation.Default;
            this.flag_c_index = -1;
            this.flag_s_index = -1;
            this.flag_s_x = 0;
            this.flag_isMgr = false;
            this.flag_isBigger = false;
            this.flag_curPattern = 0;
            this.flag_curPatSize = 0;
            this.flag_curPatLeng = 0;
            if (RFGameHandle.isReplay() || RFGameHandle.isOfflineRecover()) useAni = false;//回放、断线重连没有动画
            //是否使用开场动画
            if (useAni) this.initCardAniBegin(RFGameData.playerCardsData[RFGameHandle.getTablePos(PZOrientation.DOWN)]);
            else this.drawCards(RFGameData.playerCardsData[RFGameHandle.getTablePos(PZOrientation.DOWN)]);
        }

        /** 循环绘制当前显示牌 */
        public drawCards(cards: Array<ICardData>) {
            let temp_x = 0;
            let temp_y = 0;
            let _max_cardWid = 140;
            let len = cards.length;
            let _border = (this._viewGroup.width - (len) * this.cardGap) / 2 - this.cardGap + 20;//边距
            // let _border = 0;
            for (let i = 0; i < len; i++) {
                // let card = new RFHandCardItemView(cards[i]);
                let card = RFCardItemPool.getCardItem();
                card.initView(cards[i]);
                card.touchEnabled = false;
                card.scaleX = this.scaleNum;
                card.scaleY = this.scaleNum;
                this.cardObjsArr[this.cardObjsArr.length] = card;
                this.cardIdxMap[cards[i].id] = i;
                card.x = temp_x + _border;
                this._viewGroup.addChild(card);
                this.posArr[this.posArr.length] = card.x;
                temp_x += this.cardGap;
            }
        }

        /** 获得选中的卡牌index数组 */
        public getChoseCardsArr() {
            this.choseArr = [];
            this.unChoseArr = [];
            for (let i = 0; i < this.cardObjsArr.length; i++) {
                if (this.cardObjsArr[i] && this.cardObjsArr[i].getSelected() && this.cardObjsArr[i].flag_isCanSelect) {
                    this.choseArr.push(i);
                } else {
                    this.unChoseArr.push(i);
                }
            }
            return this.choseArr;
        }

        /** 出牌 */
        public playCards(once: boolean = true) {
            if (!RFGameHandle.touchHandCardSwitch.isOpen()) return;//不能触摸
            this.getChoseCardsArr();
            if (!this.choseArr.length) {
                PromptUtil.show('请先选择您想出的卡牌', PromptType.ERROR);
                return;
            }

            if (once) {
                //牌型检测
                if (!this.canPlay()) {
                    return;
                }
                let choseArr = [];
                this.choseArr.forEach(x => {
                    choseArr.push(this.cardObjsArr[x].getData().id);
                });

                let msg = new PokerPlayCardNotifyMsg();
                msg.isMgrCard = this.flag_isMgr;
                msg.handPatterns = this.flag_curPattern;
                msg.chuCards = choseArr;
                ServerUtil.sendMsg(msg, MsgCmdConstant.MSG_PLAY_POKER_CARD_NOTIFY_ACK);

                // 模拟服务端出牌返回消息
                let playMsg: PokerPlayCardNotifyMsgAck = new PokerPlayCardNotifyMsgAck();
                playMsg.playerPos = RFGameHandle.getTablePos(PZOrientation.DOWN);
                playMsg.isMgrCard = this.flag_isMgr;
                playMsg.handPatterns = this.flag_curPattern;

                // 炸弹音效特殊处理
                if (this.choseArr.length == 4 && this.findZHADAN(this.choseArr).length > 0) {
                    playMsg.handPatterns = ECardPatternType.ZHA_DAN;
                }

                // 出牌特殊排序,排序判断不作边界值判断了，依赖canplay里的判断
                let playArr = [];
                let tempArr: Array<number> = [];
                let pat = this.flag_curPattern;
                if (pat == ECardPatternType.SAN_DAI_ER || pat == ECardPatternType.SI_DAI_ER || pat == ECardPatternType.SI_DAI_SAN || pat == ECardPatternType.FEI_JI) {
                    if (pat == ECardPatternType.SAN_DAI_ER){
                        tempArr = this.findSANZHANG(this.choseArr);
                    }
                    else if (this.flag_curPattern == ECardPatternType.SI_DAI_ER || this.flag_curPattern == ECardPatternType.SI_DAI_SAN) {
                        tempArr = this.findZHADAN(this.choseArr)[0];
                    }
                    else if (this.flag_curPattern == ECardPatternType.FEI_JI) {
                        tempArr = this.findFEIJI(this.choseArr);
                    }

                    for (let i = 0;i < this.choseArr.length;i ++) {
                        if (tempArr.indexOf(this.choseArr[i]) < 0) {
                            tempArr.push(this.choseArr[i]);
                        }
                    }
                    for (let i = tempArr.length-1;i >= 0;i --) {
                        playArr.push(this.cardObjsArr[tempArr[i]].getData().id)
                    }
                }
                else {
                    for (let i = this.choseArr.length-1;i >= 0;i --) {
                        playArr.push(this.cardObjsArr[this.choseArr[i]].getData().id);
                    }
                }

                let handArr = [];
                for (let i = this.unChoseArr.length -1 ;i >= 0;i --) {
                    handArr.push(this.cardObjsArr[this.unChoseArr[i]].getData().id);
                }
                playMsg.playCards = playArr;
                playMsg.handCards = handArr;
                playMsg.chuPlayerCardLeftNum = this.unChoseArr.length;
                RFGameProxy.getInstance().exePokerPlayCardNotifyMsgAck(playMsg, false);
                return;
            }

            let choseArr = [];
            this.choseArr.forEach(x => {
                choseArr.push(this.cardObjsArr[x].getData().id);
            });

            let msg = new PokerPlayCardNotifyMsg();
            msg.isMgrCard = this.flag_isMgr;
            msg.handPatterns = this.flag_curPattern;
            msg.chuCards = choseArr;
            ServerUtil.sendMsg(msg, MsgCmdConstant.MSG_PLAY_POKER_CARD_NOTIFY_ACK);
        }

        /** 提示 */
        public promptCards() {
            if (!this.promptArr || !this.promptArr.length) return;
            //---test
            if (this.flag_promptNum == this.promptArr.length) {//点击次数重置
                this.flag_promptNum = 0;
            }
            this.choseCardByIndexArr(this.promptIndexArr[this.flag_promptNum]);
            // this.choseCardByIndexArr(this.getCardIndexArr(this.promptArr[this.flag_promptNum]));
            this.flag_promptNum++;
        }

        /** 不要 */
        public rejectPlay() {
            //---test
            if (!RFGameHandle.touchHandCardSwitch.isOpen()) return;//不能触摸
            // RFGameHandle.touchHandCardSwitch.close();
            // RFGameSoundHandle.passSound(PZOrientation.DOWN);
            let msg = new PokerNotPlayCardNotifyMsg();
            msg.notPlayType = 0;
            ServerUtil.sendMsg(msg, MsgCmdConstant.MSG_NOT_PLAY_POKER_CARD_NOTIFY_ACK);
        }

        /** 要不起 */
        public ybqPlay() {
            if (!RFGameHandle.touchHandCardSwitch.isOpen()) return;//不能触摸
            // RFGameHandle.touchHandCardSwitch.close();
            // RFGameSoundHandle.passSound(PZOrientation.DOWN);
            let msg = new PokerNotPlayCardNotifyMsg();
            msg.notPlayType = 1;
            ServerUtil.sendMsg(msg, MsgCmdConstant.MSG_NOT_PLAY_POKER_CARD_NOTIFY_ACK);
        }

        /** 改变index对应牌的状态 */
        public changeCardState(index: number): boolean {
            if (!this.cardObjsArr[index]) return false;//不存在
            if (index == this.flag_s_index) return false;//起点选中牌不改变状态

            // 给滑过记录的牌标记颜色
            this.cardObjsArr[index].flag_isCanSelect && this.cardObjsArr[index].changeLightShade();

            // 改变选中状态
            this.cardObjsArr[index].changeSelectedState();

            // 滑动结束后统一改变位置
            // this.cardObjsArr[index].y = (this.cardObjsArr[index].getSelected()) ? -50 : 0;

            return true;//已改变
        }

        /** 改变区间内牌的状态 */
        public changeCardsState(min: number, max: number) {
            if (this.flag_orientation == ECardTouchOrientation.Left) {
                //往左
                for (let i = min; i < max; i++) {
                    this.changeCardState(i);
                }
            } else if (this.flag_orientation == ECardTouchOrientation.Right) {
                //往右
                for (let i = min + 1; i <= max; i++) {
                    this.changeCardState(i);
                }
            }
        }

        /** 选中index对应卡牌 */
        public choseCard(index: number) {
            if (!this.cardObjsArr[index]) return false;//不存在
            if (!this.cardObjsArr[index].flag_isCanSelect) return false;//不可被选中
            this.cardObjsArr[index].setSelected(true);
            this.cardObjsArr[index].y = -50;
            return true;//已选中
        }

        /** 根据index数组选中对应卡牌 */
        public choseCardByIndexArr(indexArr: number[]) {
            if (!indexArr) return;
            this.resetCardState();
            for (let i = 0; i < indexArr.length; i++) {
                this.choseCard(indexArr[i]);
            }
        }

        /** 重置当前卡牌状态 */
        public resetCardState() {
            if (!this.cardObjsArr.length) return;
            this.choseArr = [];
            this.unChoseArr = [];
            this.cardObjsArr.forEach(x => {
                x.setSelected(false);
                x.y = 0;
            })
        }

        /** 选择卡牌，触摸开始 */
        private onChoseBegin(e: egret.TouchEvent) {
            if (RFGameHandle.isReplay()) return;//回放时不可触摸
            if (!this.posArr.length) return;//没有牌
            let _s_x = e.localX;//触摸开始的相对坐标x
            this.flag_s_x = _s_x;
            //找出开始触摸点对应所在卡牌，极限位置对应两极
            let index = this.getTouchCardIndex(this.flag_s_x);
            this.flag_s_x = this.posArr[index];
            if (this.cardObjsArr[index] && !this.cardObjsArr[index].flag_isCanSelect) return;//不可选中
            this.changeCardState(index);
            this.flag_s_index = index;
            this.flag_c_index = index;
            this._touchGroup.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.onChoseMove, this);
        }

        /** 选择卡牌，触摸移动    */
        private onChoseMove(e: egret.TouchEvent) {
            if (!this.posArr.length) return;
            let _m_x = e.localX;//当前的位置触摸点所在x
            let index = this.getTouchCardIndex(_m_x);
            if (index != this.flag_c_index) {
                let max;
                let min;
                max = Math.max(index, this.flag_c_index);
                min = Math.min(index, this.flag_c_index);
                let orientation = (this.flag_c_index > index) ? ECardTouchOrientation.Left : ECardTouchOrientation.Right;
                if (this.flag_orientation == ECardTouchOrientation.Default) {
                    //记录最开始滑动的方向
                    this.flag_orientation = orientation;
                }
                if (orientation != this.flag_orientation) {
                    //此次的滑动方向与初始不一致，判断当前位置是否是初始位置的转向，如果是，则重新记录初始滑动方向
                    if (this.flag_orientation == ECardTouchOrientation.Left) {
                        if (index > this.flag_s_index) {
                            //右滑超过初始位置
                            this.flag_orientation = ECardTouchOrientation.Right;
                        }
                    } else if (this.flag_orientation == ECardTouchOrientation.Right) {
                        if (index < this.flag_s_index) {
                            //左滑超过初始位置
                            this.flag_orientation = ECardTouchOrientation.Left;
                        }
                    }
                }
                this.changeCardsState(min, max);
                this.flag_c_index = index;
            }
        }

        /** 选择卡牌，触摸抬起 */
        private onChoseEnd(e: egret.TouchEvent) {
            if (!this.posArr.length) return;
            this.flag_c_index = -1;
            this.flag_s_index = -1;
            this.flag_s_x = 0;
            this.flag_orientation = ECardTouchOrientation.Default;
            this._touchGroup.removeEventListener(egret.TouchEvent.TOUCH_MOVE, this.onChoseMove, this);

            this.changeCardShowFromSelectedState();
        }

        /** 获得触摸到的牌对应index */
        public getTouchCardIndex(posX: number) {
            let index;
            for (let i = 0; i < this.posArr.length; i++) {
                if (this.posArr[i] <= posX && this.posArr[i] + this.cardGap > posX) {
                    index = i;
                    break;
                }
            }
            if (!index && index != 0) {//极限位置特殊处理
                if (this.posArr[0] && this.posArr[0] > posX) {
                    index = 0;
                } else if (this.posArr[this.posArr.length - 1] && this.posArr[this.posArr.length - 1] < posX) {
                    index = this.posArr.length - 1;
                }
            }
            return index;
        }

        /**
         * 获取提示数组总的index数组
         */
        public getPromptIdxArr() {
            if (!this.promptIndexArr || !this.promptIndexArr.length) return;//提示数组为空
            let arr = [];
            for (let i = 0; i < this.promptIndexArr.length; ++i) {
                for (let j = 0; j < this.promptIndexArr[i].length; ++j) {
                    if (arr.indexOf(this.promptIndexArr[i][j]) == -1) {
                        arr.push(this.promptIndexArr[i][j]);
                    }
                }
            }
            arr.sort((a, b) => {
                return a - b;
            })
            return arr;
        }

        /**
         * 根据提示牌组及当前牌型获取当前需要被遮罩的卡牌index数据
         */
        public getShadeIdxArr() {
            let arr = this.getPromptIdxArr();
            // console.log("TIPS-ARR:::", arr);
            if (!arr || !arr.length) return;
            let shadeArr = [];
            if (this.flag_curPattern == ECardPatternType.DAN_ZHANG) {
                let min = arr[arr.length - 1];
                let zhadanIdx = [];
                let zhadan = this.promptIndexArr.filter(x => x.length && x.length == 4);
                if (zhadan.length) {
                    //有炸弹
                    zhadan.forEach(x => {
                        zhadanIdx = zhadanIdx.concat(x);
                    });
                    zhadanIdx.sort((a, b) => {
                        return a - b;
                    });
                    let temp = arr.filter(x => zhadanIdx.indexOf(x) == -1);
                    temp.sort((a, b) => {
                        return a - b;
                    });
                    min = temp[temp.length - 1];
                }
                if (arr.length == zhadanIdx.length) {
                    //全是炸弹
                    for (let i = 0; i < this.cardObjsArr.length; ++i) {
                        if (arr.indexOf(i) == -1) {
                            shadeArr.push(i);
                        }
                    }
                    return shadeArr;
                }
                //单张，比最小的值都小的牌需要被遮罩
                for (let i = min + 1; i < this.cardObjsArr.length; ++i) {
                    shadeArr.push(i);
                }
                shadeArr = shadeArr.filter(x => zhadanIdx.indexOf(x) == -1);
            }
            else if (this.flag_curPattern == ECardPatternType.SAN_DAI_ER
                || this.flag_curPattern == ECardPatternType.SI_DAI_ER
                || this.flag_curPattern == ECardPatternType.SI_DAI_SAN
                || this.flag_curPattern == ECardPatternType.FEI_JI) {
                //三带或四带三，不处理
                return;
            }
            else {//除提示牌以外的都需要被遮罩
                for (let i = 0; i < this.cardObjsArr.length; ++i) {
                    if (arr.indexOf(i) == -1) {
                        shadeArr.push(i);
                    }
                }
            }
            this.shadeArr = shadeArr;
            return shadeArr;
        }

        /**
         * 给牌添加遮罩
         */
        public addShade(shadeArr: number[]) {
            // if (!this.colorFilter) this.initFilter();
            if (!shadeArr) return;
            for (let i = 0; i < shadeArr.length; i++) {
                if (!this.cardObjsArr[shadeArr[i]]) continue;
                // this.cardObjsArr[shadeArr[i]].filters = [this.colorFilter];
                this.cardObjsArr[shadeArr[i]].isShowShade(true);
                this.cardObjsArr[shadeArr[i]].flag_isCanSelect = false;
            }
        }

        /** 移除所有牌的遮罩 */
        public remShade() {
            if (!this.shadeArr) return;
            for (let i = 0; i < this.shadeArr.length; ++i) {
                this.remOneShade(this.shadeArr[i]);
            }
            this.shadeArr = [];
        }

        /** 移除一张牌的遮罩 */
        public remOneShade(index: number) {
            if (!this.cardObjsArr[index]) return;
            // this.cardObjsArr[index].filters = null;
            this.cardObjsArr[index].isShowShade(false);
            this.cardObjsArr[index].flag_isCanSelect = true;
        }

        private _timerDelay = 10;

        /** 初始化卡牌动画开始 */
        public initCardAniBegin(cards: ICardData[]) {
            if (!cards || !cards.length) return;
            this._cardNum = cards.length;
            //获得卡牌的posArr
            let temp_x = 0;
            let temp_y = 0;
            let _max_cardWid = 140;
            let len = cards.length;
            let _border = (this._viewGroup.width - (len) * this.cardGap) / 2 - this.cardGap + 20;//边距
            for (let i = 0; i < len; i++) {
                let card = RFCardItemPool.getCardItem();
                card.initView(cards[i]);
                card.touchEnabled = false;
                card.scaleX = this.scaleNum;
                card.scaleY = this.scaleNum;
                this.cardObjsArr[this.cardObjsArr.length] = card;
                this.cardIdxMap[cards[i].id] = i;
                card.x = temp_x + _border;
                this.posArr[this.posArr.length] = card.x;
                temp_x += this.cardGap;

                // 添加牌到显示组并隐藏
                this._viewGroup.addChild(card);
                card.visible = false;
            }

            // 双重保险延迟，保证一段时间后牌必显示
            let totalTime = this._timerDelay*this._cardNum*3 + 30;
            egret.Tween.get(this)
            .wait(totalTime)
            .call(()=>{
                for (let i = 0;i < this.cardObjsArr.length;i ++) {
                    this.cardObjsArr[i].visible = true;
                }
            }, this)
            let showTimer = new Game.Timer(totalTime);
            showTimer.addEventListener(egret.TimerEvent.TIMER, ()=>{
                for (let i = 0;i < this.cardObjsArr.length;i ++) {
                    this.cardObjsArr[i].visible = true;
                }
            }, this)

            //先一张一张的添加牌的背面
            if (!this._cardTimer) {
                this._cardTimer = new Game.Timer(this._timerDelay);
            }
            this._cardTimer.delay = this._timerDelay;
            this._cardTimer.addEventListener(egret.TimerEvent.TIMER, this.addOneCardBack, this);
            this._cardTimer.reset();
            this._cardTimer.start();
            RFGameSoundHandle.sendCardsSound();
        }

        /** 添加一张卡牌的背面到显示组 */
        private addOneCardBack() {
            if (this._cardAniNum == this._cardNum) {//表示添加到背面动画结束
                this._cardTimer.stop();
                this._cardAniNum = 0;
                this._cardTimer.removeEventListener(egret.TimerEvent.TIMER, this.addOneCardBack, this);
                for (let i = 0;i < this.cardBackArr.length;i ++) {
                    this.cardBackArr[i] && this.cardBackArr[i].parent && this.cardBackArr[i].parent.removeChild(this.cardBackArr[i]);
                }
                this.cardBackArr = [];
                this._cardTimer.delay = this._timerDelay;
                this._cardTimer.addEventListener(egret.TimerEvent.TIMER, this.addOneCard, this);
                this._cardTimer.reset();
                this._cardTimer.start();
                return;
            }
            let cardback = new eui.Image('001_png');
            cardback.scaleX = this.scaleNum;
            cardback.scaleY = this.scaleNum;
            let index = this._cardAniNum;
            cardback.x = this.posArr[this._cardAniNum] + 60;
            cardback.y = 0;
            this._viewGroup.addChild(cardback);
            this.cardBackArr.push(cardback);
            //缓动一下
            Game.Tween.get(cardback).to({ x: this.posArr[index] }, this._timerDelay, Game.Ease.circIn);
            this._cardAniNum++;
        }

        /** 删除卡牌的背面，并将手牌迅速的一张张添加到显示组 */
        private addOneCard() {
            if (this._cardAniNum == this._cardNum) {//表示添加手牌动画结束
                this._cardTimer.stop();
                this._cardTimer.removeEventListener(egret.TimerEvent.TIMER, this.addOneCard, this);
                this._cardAniNum = 0;
                this._cardNum = 0;
                // //----test
                // MvcUtil.send(RFGameModule.GAME_SHOW_TIMER, RFGameHandle.getPZOrientation(RFGameData.gameStartMsg.dealerPos));
                return;
            }
            // 一张一张显示牌
            this.cardObjsArr[this._cardAniNum].visible = true;
            this._cardAniNum++;
        }

        /**根据选中状态、牌型等，改变牌的抬起表现 */
        private changeCardShowFromSelectedState() {
            if (!this.cardObjsArr) return;

            // 被选中的index数组
            let selectedIndexArr: Array<number> = [];
            for (let i = 0; i < this.cardObjsArr.length; i++) {
                if (this.cardObjsArr[i].getSelected()) {
                    selectedIndexArr.push(i);
                }
            }

            // 有抬起的牌，则不帮选牌型
            if (this.haveTaiCard()) {

            }
            else {
                // 有提示牌型
                if (this.promptIndexArr.length > 0) {
                    for (let i = 0; i < this.promptIndexArr.length; i++) {
                        if (this.isContained(selectedIndexArr, this.promptIndexArr[i])) {
                            this.flag_promptNum = i;
                            this.choseCardByIndexArr(this.promptIndexArr[this.flag_promptNum]);
                            break;
                        }
                    }
                }
                else {
                    // 包含连对
                    let liandui: Array<number> = this.findLIANDUI(selectedIndexArr);
                    // 包含顺子
                    let shunza: Array<number> = this.findSHUNZA(selectedIndexArr);
                    // 包含三张
                    let sanzhang: Array<number> = this.findSANZHANG(selectedIndexArr);
                    // 包含对子
                    let duizi: Array<number> = this.findDUIZI(selectedIndexArr);
                    // 包含飞机
                    let feiji: Array<number> = this.findFEIJI(selectedIndexArr);

                    // 滑起3带2时特殊处理
                    if (selectedIndexArr.length == 5 && sanzhang.length > 0) {
                        this.choseCardByIndexArr(selectedIndexArr);
                    }
                    else if (liandui.length >= 4 && liandui.length > shunza.length && liandui.length > sanzhang.length + 2 && liandui.length > feiji.length + feiji.length / 3 * 2) {
                        this.choseCardByIndexArr(liandui);
                    }
                    else if (shunza.length >= 5 && shunza.length > liandui.length && shunza.length > sanzhang.length + 2 && shunza.length > feiji.length + feiji.length / 3 * 2) {
                        this.choseCardByIndexArr(shunza);
                    }
                    else if (sanzhang.length >= 3 && sanzhang.length + 2 > liandui.length && sanzhang.length + 2 > shunza.length && sanzhang.length + 2 > feiji.length + feiji.length / 3 * 2) {
                        this.choseCardByIndexArr(sanzhang);
                    }
                    else if (feiji.length >= 6 && feiji.length + feiji.length / 3 * 2 > liandui.length && feiji.length + feiji.length / 3 * 2 > shunza.length) {
                        this.choseCardByIndexArr(feiji);
                    }
                    else {
                        if (feiji.length >= 6) {
                            this.choseCardByIndexArr(feiji);
                        }
                        else if (shunza.length >= 5) {
                            this.choseCardByIndexArr(shunza);
                        }
                        else if (sanzhang.length >= 3) {
                            this.choseCardByIndexArr(sanzhang);
                        }
                        else if (liandui.length >= 4) {
                            this.choseCardByIndexArr(liandui);
                        }
                        else if (duizi.length >= 2) {
                            this.choseCardByIndexArr(duizi);
                        }
                    }
                }
            }


            // 无牌型、无顺子、无连对滑起什么抬起什么

            for (let i = 0; i < this.cardObjsArr.length; i++) {
                // 抬起还在选中状态的牌
                this.cardObjsArr[i].y = (this.cardObjsArr[i].getSelected()) ? -50 : 0;
                // 能被选中的把遮罩清除
                this.cardObjsArr[i].flag_isCanSelect && this.cardObjsArr[i].showLightShade(false);
            }
        }

        private isContained(arrBig: Array<number>, arrSmall: Array<number>): boolean {
            if (arrBig.length < 1 || arrSmall.length < 1 || arrBig.length < arrSmall.length) {
                return false;
            }

            for (let i = 0; i < arrSmall.length; i++) {
                if (arrBig.indexOf(arrSmall[i]) < 0) {
                    return false;
                }
            }

            return true;
        }

        /**找最长顺子，返回index数组 */
        private findSHUNZA(oriArr: Array<number>): Array<number> {
            if (oriArr.length < 5) return [];

            // 所有顺子
            let targetArr: Array<Array<number>> = [];
            for (let i = 0; i < oriArr.length; i++) {
                let temptArr: Array<number> = [];
                let k = 0;
                let judgeFunc = () => {
                    if (oriArr[i + k + 1] && this.cardObjsArr[oriArr[i + k]].getCardValue() - 1 == this.cardObjsArr[oriArr[i + k + 1]].getCardValue()) {
                        k += 1;
                        return true;
                    }
                    if (oriArr[i + k + 2] && this.cardObjsArr[oriArr[i + k]].getCardValue() - 1 == this.cardObjsArr[oriArr[i + k + 2]].getCardValue()) {
                        k += 2;
                        return true;
                    }
                    if (oriArr[i + k + 3] && this.cardObjsArr[oriArr[i + k]].getCardValue() - 1 == this.cardObjsArr[oriArr[i + k + 3]].getCardValue()) {
                        k += 3;
                        return true;
                    }
                    return false;
                }

                do {
                    temptArr.push(oriArr[i + k]);
                }
                while (judgeFunc())

                if (temptArr.length >= 5) {
                    targetArr.push(temptArr);
                }
            }

            // 找最长顺子
            let longArr: Array<number> = [];
            for (let i = 0; i < targetArr.length; i++) {
                if (targetArr[i].length >= longArr.length) {
                    longArr = targetArr[i];
                }
            }
            return longArr;
        }

        /**找最长连对，返回index数组 */
        private findLIANDUI(oriArr: Array<number>): Array<number> {
            if (oriArr.length < 4) return [];

            let targetArr: Array<Array<number>> = [];
            for (let i = 0; i < oriArr.length; i++) {
                let temptArr: Array<number> = [];
                let k = 0;
                let judgeFunc = () => {
                    if (!(temptArr.length % 2)) {
                        if (oriArr[i + k + 1] && this.cardObjsArr[oriArr[i + k]].getCardValue() - 1 == this.cardObjsArr[oriArr[i + k + 1]].getCardValue()) {
                            k += 1;
                            return true;
                        }

                        if (oriArr[i + k + 2] && this.cardObjsArr[oriArr[i + k]].getCardValue() - 1 == this.cardObjsArr[oriArr[i + k + 2]].getCardValue()) {
                            k += 2;
                            return true;
                        }
                    }
                    else {
                        if (oriArr[i + k + 1] && this.cardObjsArr[oriArr[i + k]].getCardValue() == this.cardObjsArr[oriArr[i + k + 1]].getCardValue()) {
                            k += 1;
                            return true;
                        }
                    }
                    return false;
                }

                do {
                    temptArr.push(oriArr[i + k]);
                }
                while (judgeFunc())

                if (temptArr.length % 2) {
                    temptArr.pop();
                }

                if (temptArr.length >= 4) {
                    targetArr.push(temptArr);
                }
            }

            // 找最长,长度相同则找最小
            let longArr: Array<number> = [];
            for (let i = 0; i < targetArr.length; i++) {
                if (targetArr[i].length >= longArr.length) {
                    longArr = targetArr[i];
                }
            }
            return longArr;
        }

        /**找最小三张，返回index数组 */
        private findSANZHANG(oriArr: Array<number>, judgeZhaDan: boolean = true): Array<number> {
            if (oriArr.length < 3) return [];

            let targetArr: Array<Array<number>> = [];
            let zhaValue: number;
            for (let i = 0; i < oriArr.length; i++) {
                let temptArr: Array<number> = [];
                let k = 0;
                let judgeFunc = () => {
                    if (oriArr[i + k + 1] && this.cardObjsArr[oriArr[i + k]].getCardValue() == this.cardObjsArr[oriArr[i + k + 1]].getCardValue()) {
                        k += 1;
                        return true;
                    }
                    return false;
                }

                do {
                    temptArr.push(oriArr[i + k]);
                }
                while (judgeFunc())

                if (temptArr.length == 3 && this.cardObjsArr[temptArr[0]].getCardValue() != zhaValue) {
                    targetArr.push(temptArr);
                }
                if (temptArr.length == 4) {
                    if (judgeZhaDan) {
                        zhaValue = this.cardObjsArr[temptArr[0]].getCardValue();
                    }
                    else {
                        temptArr.pop();
                        targetArr.push(temptArr);
                    }
                }
            }

            // 找最小
            let longArr: Array<number> = [];
            for (let i = 0; i < targetArr.length; i++) {
                if (targetArr[i].length >= longArr.length) {
                    longArr = targetArr[i];
                }
            }
            return longArr;
        }

        /**找最小飞机，返回index数组 */
        private findFEIJI(oriArr: Array<number>, judgeZhaDan: boolean = true): Array<number> {
            if (oriArr.length < 3) return [];

            let targetArr: Array<Array<number>> = [];
            let zhaValue: number;
            for (let i = 0; i < oriArr.length; i++) {
                let temptArr: Array<number> = [];
                let k = 0;
                let judgeFunc = () => {
                    if (oriArr[i + k + 1] && this.cardObjsArr[oriArr[i + k]].getCardValue() == this.cardObjsArr[oriArr[i + k + 1]].getCardValue()) {
                        k += 1;
                        return true;
                    }
                    return false;
                }

                do {
                    temptArr.push(oriArr[i + k]);
                }
                while (judgeFunc())

                if (temptArr.length == 3 && this.cardObjsArr[temptArr[0]].getCardValue() != zhaValue) {
                    targetArr.push(temptArr);
                }
                if (temptArr.length == 4) {
                    if (judgeZhaDan) {
                        zhaValue = this.cardObjsArr[temptArr[0]].getCardValue();
                    }
                    else {
                        temptArr.pop();
                        targetArr.push(temptArr);
                    }
                }
            }

            let targetArrFeiJi: Array<Array<number>> = [];
            for (let i = 0; i < targetArr.length; i++) {
                let temptArr: Array<number> = [];
                let k = 0;
                let judgeFunc = () => {
                    if (targetArr[i + k + 1] && this.cardObjsArr[targetArr[i + k][0]].getCardValue() - 1 == this.cardObjsArr[targetArr[i + k + 1][0]].getCardValue()) {
                        k += 1;
                        return true;
                    }
                    return false;
                }

                do {
                    temptArr.push(targetArr[i + k][0]);
                    temptArr.push(targetArr[i + k][1]);
                    temptArr.push(targetArr[i + k][2]);
                }
                while (judgeFunc())

                if (temptArr.length % 3 == 0) {
                    targetArrFeiJi.push(temptArr);
                }
            }

            // 找最长,长度相同则找最小
            let longArr: Array<number> = [];
            for (let i = 0; i < targetArrFeiJi.length; i++) {
                if (targetArrFeiJi[i].length >= longArr.length) {
                    longArr = targetArrFeiJi[i];
                }
            }
            return longArr;
        }

        /**找最小对子，返回index数组 */
        private findDUIZI(oriArr: Array<number>): Array<number> {
            if (oriArr.length < 2) return [];

            let targetArr: Array<Array<number>> = [];
            let zhaValue: number;
            for (let i = 0; i < oriArr.length; i++) {
                let temptArr: Array<number> = [];
                let k = 0;
                let judgeFunc = () => {
                    if (oriArr[i + k + 1] && this.cardObjsArr[oriArr[i + k]].getCardValue() == this.cardObjsArr[oriArr[i + k + 1]].getCardValue()) {
                        k += 1;
                        return true;
                    }
                    return false;
                }

                do {
                    temptArr.push(oriArr[i + k]);
                }
                while (judgeFunc())

                if (temptArr.length == 2 && this.cardObjsArr[temptArr[0]].getCardValue() != zhaValue) {
                    targetArr.push(temptArr);
                }
                if (temptArr.length == 4) {
                    zhaValue = this.cardObjsArr[temptArr[0]].getCardValue();
                }
            }

            // 找最小
            let longArr: Array<number> = [];
            for (let i = 0; i < targetArr.length; i++) {
                if (targetArr[i].length >= longArr.length) {
                    longArr = targetArr[i];
                }
            }
            return longArr;
        }

        /** 找炸弹列表 */
        private findZHADAN(oriArr: Array<number>): Array<Array<number>> {
            if (oriArr.length < 4) return [];

            let targetArr: Array<Array<number>> = [];
            for (let i = 0; i < oriArr.length; i++) {
                let temptArr: Array<number> = [];
                let k = 0;
                let judgeFunc = () => {
                    if (oriArr[i + k + 1] && this.cardObjsArr[oriArr[i + k]].getCardValue() == this.cardObjsArr[oriArr[i + k + 1]].getCardValue()) {
                        k += 1;
                        return true;
                    }
                    return false;
                }

                do {
                    temptArr.push(oriArr[i + k]);
                }
                while (judgeFunc())

                if (temptArr.length == 4) {
                    targetArr.push(temptArr);
                }
            }
            return targetArr;
        }


        /**是否有抬起的牌 */
        private haveTaiCard(): boolean {
            for (let i = 0; i < this.cardObjsArr.length; i++) {
                if (this.cardObjsArr[i].y < 0) {
                    return true;
                }
            }
            return false;
        }

        /**是否需要重置牌 */
        private needReset(): boolean {
            let shadeArr = this.getShadeIdxArr();
            // 被选中的index数组
            let selectedIndexArr: Array<number> = [];
            for (let i = 0; i < this.cardObjsArr.length; i++) {
                if (this.cardObjsArr[i].getSelected()) {
                    selectedIndexArr.push(i);
                }
            }
            // 没有抬起的牌，走点击提示逻辑
            if (selectedIndexArr.length == 0) {
                return true;
            }

            for (let i = 0; i < selectedIndexArr.length; i++) {
                if (shadeArr && shadeArr.length > 0 && shadeArr.indexOf(selectedIndexArr[i]) > -1) {
                    // 抬起牌有不可出的牌
                    return true;
                }
            }

            // 要不起则不管
            if (!(this.promptIndexArr && this.promptIndexArr.length > 0)) {
                return false;
            }

            // 提示牌型是两张
            if (this.promptIndexArr[0].length == 2) {
                if (selectedIndexArr.length != 2) {
                    return true;
                }
                else if (this.cardObjsArr[selectedIndexArr[0]].getCardValue() != this.cardObjsArr[selectedIndexArr[1]].getCardValue()) {
                    return true;
                }
                return false;
            }

            // 提示牌型是三张
            if (this.promptIndexArr[0].length == 3) {
                if (selectedIndexArr.length < 3 || selectedIndexArr.length > 5) {
                    return true;
                }
                else {
                    for (let i = 0; i < this.promptIndexArr.length; i++) {
                        if (this.promptIndexArr[i].length == 3) {
                            if (selectedIndexArr.indexOf(this.promptIndexArr[i][0]) > -1 && selectedIndexArr.indexOf(this.promptIndexArr[i][1]) > -1 && selectedIndexArr.indexOf(this.promptIndexArr[i][2]) > -1) {
                                return false;
                            }
                        }
                    }
                    return true;
                }
            }

            // 提示牌型是四张
            if (this.promptIndexArr[0].length == 4) {
                if (selectedIndexArr.length != 4) {
                    return true;
                }
                if (this.cardObjsArr[selectedIndexArr[0]].getCardValue() != this.cardObjsArr[selectedIndexArr[1]].getCardValue()) {
                    return true;
                }
                if (this.cardObjsArr[selectedIndexArr[2]].getCardValue() != this.cardObjsArr[selectedIndexArr[3]].getCardValue()) {
                    return true;
                }
                if (this.cardObjsArr[selectedIndexArr[0]].getCardValue() - 1 != this.cardObjsArr[selectedIndexArr[3]].getCardValue()) {
                    return true;
                }
            }

            // 顺子或三连对以上,飞机暂时不处理
            if (this.promptIndexArr[0].length >= 5) {
                if (selectedIndexArr.length != this.promptIndexArr[0].length) {
                    return true;
                }
                let shunza: Array<number> = this.findSHUNZA(selectedIndexArr);
                let liandui: Array<number> = this.findLIANDUI(selectedIndexArr);

                // 连对、顺子张数不匹配
                if (shunza.length != this.promptIndexArr[0].length && liandui.length != this.promptIndexArr[0].length) {
                    return true;
                }
            }

            return false;
        }

        /**是否可出检测 */
        private canPlay(choseArr: Array<number> = this.choseArr): boolean {
            if (!choseArr || choseArr.length < 1) return false;

            // 选中牌总长度
            let choseLength: number = choseArr.length;
            // 是否是管牌
            let isMgr: boolean = this.flag_isMgr;
            // 需要押的牌型
            let curPattern: ECardPatternType = this.flag_curPattern;
            // 子玩法
            let subList: Array<ECardGameType> = RFGameData.requestStartGameMsgAck.subGamePlayRuleList;
            // 炸弹是否可拆
            let canSplit: boolean = subList.indexOf(ECardGameType.ZHA_DAN_BU_KE_CHAI) < 0;
            let zhaArr = this.findZHADAN(choseArr);
            if (!canSplit && curPattern != ECardPatternType.ZHA_DAN && !(zhaArr.length > 0 && choseLength == 4)) {
                let allArr: Array<number> = [];
                for (let i = 0; i < this.cardObjsArr.length; i++) {
                    allArr.push(i);
                }
                let zhaDanArr: Array<Array<number>> = this.findZHADAN(allArr);
                for (let i = 0;i < zhaDanArr.length;i ++) {
                    if (choseArr.indexOf(zhaDanArr[i][0]) >= 0) {
                        PromptUtil.show("炸弹不可拆，不能这样出牌", PromptType.ALERT);
                        return false;
                    }
                }
            }
            
            let resultArr: Array<number> = [];
            let matchFlag: boolean = false;
            let chosePatValue = 0;
            if (isMgr) {
                // 需要押的牌型大小
                let curPatValue: number = this.flag_curPatSize;
                // 需要押的牌型长度,顺子、连队、飞机才有效,如两连对长度是2
                let curPtnLength: number = this.flag_curPatLeng;
                // 上家出牌总长度
                let curTotalLength: number = this.flag_curTotalLeng;
                
                switch (curPattern) {
                    case ECardPatternType.DAN_ZHANG:
                        if (choseLength == curTotalLength) {
                            matchFlag = true;
                        }
                        else {
                            matchFlag = false;
                        }
                        chosePatValue = this.cardObjsArr[choseArr[0]].getCardCompareValue();
                        if (RFGameHandle.getNextPokerGameStartPlayerInfo(RFGameHandle.getTablePos(PZOrientation.DOWN)).handCardNum == 1) {
                            if (chosePatValue < this.cardObjsArr[0].getCardCompareValue()) {
                                PromptUtil.show("下家报单，单牌必须出最大的", PromptType.ALERT);
                                return false;
                            }
                        }
                        break;
                    case ECardPatternType.DUI_ZI:
                        resultArr = this.findDUIZI(choseArr);
                        if (resultArr.length == curTotalLength && choseLength == curTotalLength) {
                            matchFlag = true;
                            chosePatValue = this.cardObjsArr[resultArr[0]].getCardCompareValue();
                        }
                        else {
                            matchFlag = false;
                        }
                        break;
                    case ECardPatternType.LIAN_DUI:
                        resultArr = this.findLIANDUI(choseArr);
                        if (resultArr.length == curTotalLength && choseLength == curTotalLength) {
                            matchFlag = true;
                            chosePatValue = this.cardObjsArr[resultArr[resultArr.length-1]].getCardCompareValue();
                        }
                        else {
                            matchFlag = false;
                        }
                        break;
                    case ECardPatternType.SHUN_ZI:
                        resultArr = this.findSHUNZA(choseArr);
                        if (resultArr.length == curTotalLength && choseLength == curTotalLength) {
                            matchFlag = true;
                            chosePatValue = this.cardObjsArr[resultArr[resultArr.length-1]].getCardCompareValue();
                        }
                        else {
                            matchFlag = false;
                        }
                        break;
                    case ECardPatternType.SI_DAI_ER:
                    case ECardPatternType.SI_DAI_SAN:
                        let arrS = this.findZHADAN(choseArr);
                        if (arrS.length > 0 && (choseLength == curTotalLength || !this.unChoseArr.length)) {
                            resultArr = arrS[0];
                            matchFlag = true;
                            chosePatValue = this.cardObjsArr[resultArr[0]].getCardCompareValue();
                        }
                        else {
                            matchFlag = false;
                        }
                        break;
                    case ECardPatternType.ZHA_DAN:
                        let arrT = this.findZHADAN(choseArr);
                        if (arrT.length > 0 && choseLength == curTotalLength) {
                            resultArr = arrT[0];
                            matchFlag = true;
                            chosePatValue = this.cardObjsArr[resultArr[0]].getCardCompareValue();
                        }
                        else {
                            matchFlag = false;
                        }
                        break;
                    case ECardPatternType.SAN_DAI_ER:
                        resultArr = this.findSANZHANG(choseArr, false);
                        if ((resultArr.length == 3 || resultArr.length == 4) && choseLength == curTotalLength) {
                            matchFlag = true;
                            chosePatValue = this.cardObjsArr[resultArr[0]].getCardCompareValue();
                        }
                        else {
                            matchFlag = false;
                        }
                        break;
                    case ECardPatternType.FEI_JI:
                        resultArr = this.findFEIJI(choseArr, false);
                        let num = resultArr.length / 3;
                        if (num == curPtnLength && choseLength == curTotalLength) {
                            matchFlag = true;
                            chosePatValue = this.cardObjsArr[resultArr[0]].getCardCompareValue();
                        }
                        else {
                            matchFlag = false;
                        }
                        break;
                    default:
                        matchFlag = false;
                        break;
                }

                // 炸弹轰非炸弹牌型
                let zhaDanArr: Array<Array<number>> = this.findZHADAN(choseArr);
                if (curPattern != ECardPatternType.ZHA_DAN && zhaDanArr.length > 0 && choseLength == 4) {
                    matchFlag = true;
                    chosePatValue = 100;
                }

                if (!matchFlag) {
                    PromptUtil.show("牌型不匹配，不能这样出牌", PromptType.ALERT);
                    return false;
                }
                if (chosePatValue <= curPatValue) {
                    PromptUtil.show("出牌没有大过上一家，不能这样出牌", PromptType.ALERT);
                    return false;
                }
            }
            else {
                // 首局黑桃三
                let blackSan: boolean = subList.indexOf(ECardGameType.HEI_TAO_SAN_FIRST) >= 0;
                let curRound: number = RFGameData.requestStartGameMsgAck.currPlayCount;
                if (blackSan && curRound == 1) {
                    let mainRule: number = RFGameData.requestStartGameMsgAck.mainGamePlayRule;
                    let curCardNum: number = this.cardObjsArr.length;
                    if ((mainRule == ECardGamePlayWay.JING_DIAN_PAO_DE_KUAI && curCardNum == 16) || (mainRule == ECardGamePlayWay.SHI_WU_ZHANG_PAO_DE_KUAI && curCardNum == 15)) {
                        let haveFlag: boolean = false;
                        for (let i = 0;i < this.choseArr.length; i ++) {
                            let card: ICardData = this.cardObjsArr[this.choseArr[i]].getData();
                            if (card.type == ECardIconType.Spade && card.value == 3) {
                                haveFlag = true;
                                break;
                            }
                        }
                        if (!haveFlag) {
                            PromptUtil.show("首局出牌必须包含黑桃三", PromptType.ALERT);
                            return false;
                        }
                    }
                } 

                matchFlag = true;
                if (choseLength == 1) {
                    this.flag_curPattern = ECardPatternType.DAN_ZHANG;
                    chosePatValue = this.cardObjsArr[choseArr[0]].getCardCompareValue();
                    if (RFGameHandle.getNextPokerGameStartPlayerInfo(RFGameHandle.getTablePos(PZOrientation.DOWN)).handCardNum == 1) {
                        if (chosePatValue < this.cardObjsArr[0].getCardCompareValue()) {
                            PromptUtil.show("下家报单，单牌必须出最大的", PromptType.ALERT);
                            return false;
                        }
                    }
                }
                else if (choseLength == 2) {
                    resultArr = this.findDUIZI(choseArr);
                    if (resultArr.length != 2) {
                        matchFlag = false;
                    }
                    this.flag_curPattern = ECardPatternType.DUI_ZI;
                }
                else if (choseLength == 3) {
                    matchFlag = false;
                }
                else if (choseLength == 4) {
                    let arr: Array<Array<number>> = this.findZHADAN(choseArr);
                    resultArr = this.findLIANDUI(choseArr);
                    if (arr.length != 1 && resultArr.length != 4) {
                        matchFlag = false;
                    }
                    else if (arr.length == 1) {
                        this.flag_curPattern = ECardPatternType.ZHA_DAN;
                    }
                    else if (resultArr.length == 4) {
                        this.flag_curPattern = ECardPatternType.LIAN_DUI;
                    }
                }
                else {
                    matchFlag = false;
                    let lianduiArr: Array<number> = this.findLIANDUI(choseArr);
                    let shunziArr: Array<number> = this.findSHUNZA(choseArr);
                    let sandaiArr: Array<number> = this.findSANZHANG(choseArr, false);
                    let zhadanArr: Array<Array<number>> = this.findZHADAN(choseArr);
                    let feijiArr: Array<number> = this.findFEIJI(choseArr);
                    let feijiLen = feijiArr.length/3;

                    if (lianduiArr.length == choseLength) {
                        this.flag_curPattern = ECardPatternType.LIAN_DUI;
                        matchFlag = true;
                    }
                    else if (shunziArr.length == choseLength) {
                        this.flag_curPattern = ECardPatternType.SHUN_ZI;
                        matchFlag = true;
                    }
                    else if (zhadanArr.length &&  zhadanArr[0].length + 2 == choseLength && subList.indexOf(ECardGameType.SI_GE_DAI_ER_PAI) >= 0) {
                        this.flag_curPattern = ECardPatternType.SI_DAI_ER;
                        matchFlag = true;
                    }
                    else if (zhadanArr.length && subList.indexOf(ECardGameType.SI_GE_DAI_SAN_PAI) >= 0 &&  (zhadanArr[0].length + 3 == choseLength || (zhadanArr[0].length + 2 == choseLength && !this.unChoseArr.length)) ) {
                        this.flag_curPattern = ECardPatternType.SI_DAI_SAN;
                        matchFlag = true;
                    }
                    else if (sandaiArr.length + 2 == choseLength) {
                        this.flag_curPattern = ECardPatternType.SAN_DAI_ER;
                        matchFlag = true;
                    }
                    else if (feijiLen*(3+2) == choseLength) {
                        this.flag_curPattern = ECardPatternType.FEI_JI;
                        matchFlag = true;
                    }
                    else {
                        matchFlag = false;
                    }
                }

                if (!matchFlag) {
                    PromptUtil.show("牌型不匹配，不能这样出牌", PromptType.ALERT);
                    return false;
                }
            }

            return true;
        }
    }
}