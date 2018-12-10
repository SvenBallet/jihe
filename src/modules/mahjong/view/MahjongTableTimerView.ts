module FL {
    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase - MahjongTableTimerView
     * @Description:  //牌桌时间界面
     * @Create: DerekWu on 2017/11/17 14:34
     * @Version: V1.0
     */
    export class MahjongTableTimerView extends BaseView {

        /** 单例 */
        private static _onlyOne:MahjongTableTimerView;

        //调停者名字，删除界面的时候会自动移除
        public readonly mediatorName: string = MahjongTableTimerViewMediator.NAME;
        //界面层级，UI框架自动管理
        public readonly viewLayer: ViewLayerEnum = ViewLayerEnum.BOTTOM;

        /** 左边组，金币场不显示 */
        public leftGroup:eui.Group;
        /** 剩余游戏局数 */
        public remainGameCount:eui.Label;
        /** 剩余麻将牌的数量 */
        public remainCardsCount:eui.Label;

        /** 右边文字背景，和剩余文字 */
        public rightTextBg:eui.Image;
        public rightShengImg:eui.Image;
        public rightZhangImg:eui.Image;
        // public rightRemainLabel:eui.Label;

        /** 上下左右方向底板 */
        public upFlag:eui.Image;
        public downFlag:eui.Image;
        public leftFlag:eui.Image;
        public rightFlag:eui.Image;

        /** 上下左右方向箭头 */
        public upArrows:eui.Image;
        public downArrows:eui.Image;
        public leftArrows:eui.Image;
        public rightArrows:eui.Image;

        /** 倒计时 十位数字和个位数字 */
        public timerTensDigit:eui.Image;
        public timerUnitsDigit:eui.Image;

        /** 最后操作者 的牌桌方向 */
        private _lastHandleOrientation:PZOrientation = null;
        /** 右边剩余张数区域是否显示 */
        private _rightAreaIsView:boolean = true;

        /** 调停者 */
        private _mediator:MahjongTableTimerViewMediator = null;

        private constructor() {
            super();
            this.horizontalCenter = 0, this.verticalCenter = -18;
            this.skinName = "skins.TableBoardTimerViewSkin";
            //不可触摸
            this.touchEnabled = false, this.touchChildren = false;
        }

        public static getInstance():MahjongTableTimerView {
            if (!this._onlyOne) {
                this._onlyOne = new MahjongTableTimerView();
            }
            return this._onlyOne;
        }

        protected childrenCreated():void {
            super.childrenCreated();
            let self = this;
            self._mediator = new MahjongTableTimerViewMediator(self);
            //默认设置半透明
            self.upFlag.alpha = self.downFlag.alpha = self.leftFlag.alpha = self.rightFlag.alpha = 0.3;
            self.removeChild(self.rightArrows);
            self.removeChild(self.leftArrows);
            self.removeChild(self.downArrows);
            self.removeChild(self.upArrows);
        }

        /** 添加到界面以后框架自动调用 */
        protected onAddView():void {
            MvcUtil.regMediator(this._mediator);
            BindManager.addAttrListener(MahjongHandler.getCardLeftNumBindId(), this.changeRemainCardsCount, this);
            //获得出牌玩家方向，并初始化
            //先判断是都断线重连
            // let vIsOfflineRecover:boolean = MahjongHandler.isOfflineRecover();
            // if (!vIsOfflineRecover) {
                //获得庄家位置
                // let vDealerPos:number = MahjongHandler.getDealerPos();
                //恭喜庄家连庄
                // if (MahjongHandler.isDealerAgain() && !MahjongHandler.isReplay()) {
                //     //延时一点点提示
                //     MyCallBackUtil.delayedCallBack(500, PromptUtil.show, PromptUtil, "恭喜庄家连庄！", PromptType.SUCCESS);
                // }
                //庄家提示请优先出牌, 你是庄家请优先出牌!
                // let vMyPos:number = MahjongHandler.getTablePos(PZOrientation.DOWN);
                // if (vDealerPos === vMyPos && !MahjongHandler.isReplay()) {
                //     //延时一点点提示
                //     MyCallBackUtil.delayedCallBack(1000, PromptUtil.show, PromptUtil, "您是庄家请优先出牌!", PromptType.SUCCESS);
                // }
            // }
            //倒计时
            this._mediator.restartTimer();
        }

        /** 从界面上移除以后框架自动调用 */
        protected onRemView():void {
            this.gameOver();
        }

        /**
         * 游戏结束
         */
        public gameOver():void {
            let self = this;
            if (self._lastHandleOrientation !== null) {
                self.discardOrientation(self._lastHandleOrientation);
                //设置操作方向
                self._lastHandleOrientation = null;
            }
        }

        /**
         * 改变数量
         * @param {number} value
         */
        private changeRemainCardsCount(value:number):void {
            let self = this;
            if (value < 0) {
                if (self._rightAreaIsView) {
                    self.rightTextBg.visible = false;
                    self.rightShengImg.visible = false;
                    self.rightZhangImg.visible = false;
                    // self.rightRemainLabel.visible = false;
                    self.remainCardsCount.visible = false;
                    self._rightAreaIsView = false;
                }
            } else {
                if (!self._rightAreaIsView) {
                    self.rightTextBg.visible = true;
                    self.rightShengImg.visible = true;
                    self.rightZhangImg.visible = true;
                    // self.rightRemainLabel.visible = true;
                    self.remainCardsCount.visible = true;
                    self._rightAreaIsView = true;
                }
                self.remainCardsCount.text = "" + value;
            }
        }

        /**
         * 改变操作方向
         * @param {FL.PZOrientation} pPZOrientation
         */
        public changeHandleOrientation(pPZOrientation:PZOrientation):void {
            let self = this;
            //处理老方向
            if (self._lastHandleOrientation !== pPZOrientation) {
                if (self._lastHandleOrientation !== null) {
                    self.discardOrientation(self._lastHandleOrientation);
                }
                //处理新方向
                self.activateOrientation(pPZOrientation);
                //设置操作方向
                self._lastHandleOrientation = pPZOrientation;
            }
        }

        /**
         * 激活一个方向
         */
        private activateOrientation(pPZOrientation:PZOrientation):void {
            let self = this;
            let vFlagImg:eui.Image = self.getFlag(pPZOrientation);
            let vArrowsImg:eui.Image = self.getArrows(pPZOrientation);
            //设置底板不透明
            vFlagImg.alpha = 1;
            //添加箭头及缓动
            ViewUtil.addChildBefore(self, vArrowsImg, self.leftGroup, self.remainCardsCount);
            //设置箭头不透明
            vArrowsImg.alpha = 1;
            let vArrowsTween:Game.Tween = Game.Tween.get(vArrowsImg, {loop:true});
            vArrowsTween.to({alpha:0.1}, 500).to({alpha:1}, 500);
        }

        /**
         * 废弃一个方向
         */
        private discardOrientation(pPZOrientation:PZOrientation):void {
            let self = this;
            let vFlagImg:eui.Image = self.getFlag(pPZOrientation);
            let vArrowsImg:eui.Image = self.getArrows(pPZOrientation);
            //设置底板半透明
            vFlagImg.alpha = 0.5;
            //删除箭头及缓动
            ViewUtil.removeChild(self, vArrowsImg);
            Game.Tween.removeTweens(vArrowsImg);
        }

        /**
         * 获得方向底板 图片
         * @param {FL.PZOrientation} pPZOrientation
         * @returns {eui.Image}
         */
        private getFlag(pPZOrientation:PZOrientation):eui.Image {
            if (pPZOrientation === PZOrientation.UP) {
                return this.upFlag;
            } else if (pPZOrientation === PZOrientation.DOWN) {
                return this.downFlag;
            } else if (pPZOrientation === PZOrientation.LEFT) {
                return this.leftFlag;
            } else if (pPZOrientation === PZOrientation.RIGHT) {
                return this.rightFlag;
            }
        }

        /**
         * 获得方向箭头 图片
         * @param {FL.PZOrientation} pPZOrientation
         * @returns {eui.Image}
         */
        private getArrows(pPZOrientation:PZOrientation):eui.Image {
            if (pPZOrientation === PZOrientation.UP) {
                return this.upArrows;
            } else if (pPZOrientation === PZOrientation.DOWN) {
                return this.downArrows;
            } else if (pPZOrientation === PZOrientation.LEFT) {
                return this.leftArrows;
            } else if (pPZOrientation === PZOrientation.RIGHT) {
                return this.rightArrows;
            }
        }

        /**
         * 开始游戏
         */
        public startGame():void {
            let self = this;
            //房间最大人数
            let vPlayerMaxNum:number = MahjongHandler.getRoomPlayerMaxNum();
            if (vPlayerMaxNum === 3) {
                // self.verticalCenter = -23 - 100;
                self.verticalCenter = -18; // 按照要求更改
            } else {
                self.verticalCenter = -18;
            }
            //判断是不是VIP房间
            if (MahjongHandler.isVipRoom()) {
                ViewUtil.addChildBefore(self, self.leftGroup, self.remainCardsCount);
                self.remainGameCount.text = ""+MahjongHandler.getRemainGameCount();
            } else {
                ViewUtil.removeChild(self, self.leftGroup);
            }
            // //获得出牌玩家方向，并初始化
            // //先判断是都断线重连
            // let vIsOfflineRecover:boolean = MahjongHandler.isOfflineRecover();
            // if (!vIsOfflineRecover) {
                //获得庄家位置
                // let vPZOrientation:PZOrientation = MahjongHandler.getDealerOrientation();
                //self.changeHandleOrientation(vPZOrientation);
            // }
        }

    }
}