module FL {
    /** 玩家手牌界面 */
    export class RFGameHandCardsView extends BaseView {
        /** 单例 */
        private static _onlyOne: RFGameHandCardsView;

        //调停者名字，删除界面的时候会自动移除
        public readonly mediatorName: string = RFGameHandCardsViewMediator.NAME;
        //界面层级，UI框架自动管理
        public readonly viewLayer: ViewLayerEnum = ViewLayerEnum.BOTTOM;

        /** 调停者 */
        private _mediator: RFGameHandCardsViewMediator;

        /** 下方手牌组，即玩家自己所在 */
        public myHandGroup: eui.Group;
        public myHandGroupHandle: RFMyHandGroupHandle;
        /** 上方手牌组 */
        public upHandGroup: eui.Group;
        public upCardsNum: eui.Label;//余牌数
        public upCardsGroup: eui.Group;//手牌显示组

        /** 左方手牌组 */
        public leftHandGroup: eui.Group;
        public leftCardsNum: eui.Label;
        public leftCardsGroup: eui.Group;//手牌显示组

        /** 右方手牌组 */
        public rightHandGroup: eui.Group;
        public rightCardsNum: eui.Label;
        public rightCardsGroup: eui.Group;//手牌显示组

        /** 全场剩余牌组 */
        public restCardGroup: eui.Group;
        public restCardNum: eui.Label;
        public restViewGroup: eui.Group;

        /** 报单图片缓存 */
        private _imgObjsMap = {};

        /** 计时器 */
        public timerGroup: eui.Group;
        public timerTens: eui.Image;
        public timerUnits: eui.Image;

        public static getInstance(): RFGameHandCardsView {
            if (!this._onlyOne) {
                this._onlyOne = new RFGameHandCardsView();
            }
            return this._onlyOne;
        }

        public constructor() {
            super();
            this.verticalCenter = 0;
            this.horizontalCenter = 0;
            this.top = this.bottom = this.left = this.right = 0;
            this.skinName = "skins.RFGameHandCardsViewSkin";
            //最后初始化调停者
            let self = this;
            self._mediator = new RFGameHandCardsViewMediator(self);
        }

        protected childrenCreated() {
            super.childrenCreated();
            // this.initView();
        }

        /** 初始化视图 */
        public initView() {
            //---test
            this.remAllSingleEnd();
            this.remAllCardsGroup();
            this.myHandGroupHandle.resetView(true);
            this.showViewByNum(RFGameData.gameMaxNum);
            this.isShowRestCards(RFGameData.isShowRestCardsNum);
            this.isShowRestHandCards(RFGameData.isShowHandCardsNum);
            this.isShowTimer(false);
            this.isShowControl(false);
            this.isShowRestCardsGroup();
        }

        /** 添加到界面以后框架自动调用 */
        protected onAddView(): void {
            MvcUtil.regMediator(this._mediator);
        }

        /** 从界面移除后自动调用 */
        protected onRemView(): void {
            this.remAllSingleEnd();
            this.remAllCardsGroup();
            this.myHandGroupHandle.distroyDelayedYbqPlay();
        }

        /** 是否显示全场剩余牌数 */
        public isShowRestCards(flag: boolean) {
            if (!flag) {
                if (this.restCardGroup.parent) this.restCardGroup.parent.removeChild(this.restCardGroup);
                if (this.restViewGroup.parent) this.restViewGroup.parent.removeChild(this.restViewGroup);
            } else {
                let props = RFGameViewPropsHandle.getRestProps(GameConstant.CURRENT_GAMETYPE);
                if (props) {
                    RFGameViewPropsHandle.addPropsToObj(this.restViewGroup, props.pos);
                }
                /** 清空显示 */
                for (let i = this.restViewGroup.numChildren - 1; i >= 0; i--) {
                    let card: any = this.restViewGroup.getChildAt(i);
                    RFCardItemPool.recoverCardItem(card);
                }
                this.restViewGroup.removeChildren();
                this.addChild(this.restCardGroup);
                this.addChild(this.restViewGroup);
            }
        }

        /** 绘制剩余卡牌 */
        public drawRest(cards: ICardData[], flag: boolean) {
            if (!flag) return;//不显示            
            let props = RFGameViewPropsHandle.getRestProps(GameConstant.CURRENT_GAMETYPE);
            let tempY = 0;
            let tempX = 0;
            if (props) {
                for (let i = 0; i < cards.length; i++) {
                    if (i / 9 == 1) {//第9个的时候转行
                        tempX = 0;
                        tempY = 80;
                    }
                    let card = RFCardItemPool.getCardItem();
                    card.initView(cards[i]);
                    card.scaleX = props.vcp.scale;
                    card.scaleY = props.vcp.scale;
                    card.x = tempX + Math.abs(props.vcp.gap);
                    card.y = tempY;
                    tempX += Math.abs(props.vcp.gap);
                    this.restViewGroup.addChild(card);
                }
            }

            // cards.forEach(x => {
            //     let card = RFCardItemPool.getCardItem();

            // })
        }

        /**
         * 是否显示剩余手牌显示组，仅回放时有用
         */
        public isShowRestCardsGroup() {
            if (!RFGameHandle.isReplay()) return;
            let l = RFGameHandle.getTablePos(PZOrientation.LEFT);
            let r = RFGameHandle.getTablePos(PZOrientation.RIGHT);
            let u = RFGameHandle.getTablePos(PZOrientation.UP);
            if (RFGameData.playerCardsData[l]) {
                this.drawCards(RFGameData.playerCardsData[l], PZOrientation.LEFT);
            }
            if (RFGameData.playerCardsData[r]) {
                this.drawCards(RFGameData.playerCardsData[r], PZOrientation.RIGHT);
            }
            if (RFGameData.playerCardsData[u]) {
                this.drawCards(RFGameData.playerCardsData[u], PZOrientation.UP);
            }
        }

        /**
         * 根据牌桌方向绘制余牌
         */
        public drawCards(cards: ICardData[], pzOrientation: PZOrientation) {
            if (!cards) return;
            let group = this.getCardsGroup(pzOrientation);
            let tempY = 0;
            let tempX = 0;
            let rotation = 0;
            let border = (380 - (25 * cards.length) - 25) / 2;
            if (pzOrientation == PZOrientation.LEFT) {
                rotation = 90;
                tempX = 40;
                for (let i = 0; i < cards.length; ++i) {
                    let card = RFCardItemPool.getCardItem();
                    card.initView(cards[i]);
                    card.scaleX = 0.4;
                    card.scaleY = 0.4;
                    card.x = tempX + 55;
                    card.rotation = rotation;
                    card.y = tempY + 25 + border;
                    tempY += 25;
                    group.addChild(card);
                }
            }
            else if (pzOrientation == PZOrientation.RIGHT || pzOrientation == PZOrientation.UP) {
                rotation = -90;
                tempY = 55 + cards.length * 25;
                for (let i = cards.length - 1; i >= 0; --i) {
                    let card = RFCardItemPool.getCardItem();
                    card.initView(cards[i]);
                    card.scaleX = 0.4;
                    card.scaleY = 0.4;
                    card.x = tempX;
                    card.rotation = rotation;
                    card.y = tempY + border;
                    tempY -= 25;
                    group.addChild(card);
                }
            }
            // else if (pzOrientation == PZOrientation.UP) {
            //     for (let i = 0; i < cards.length; ++i) {
            //         let card = RFCardItemPool.getCardItem();
            //         card.initView(cards[i]);
            //         card.scaleX = 0.4;
            //         card.scaleY = 0.4;
            //         card.x = tempX - 50 + border;
            //         card.rotation = rotation;
            //         card.y = tempY + 30;
            //         tempX += 25;
            //         group.addChild(card);
            //     }
            // }
        }

        /**
         * 通过牌桌方向获取余牌手牌显示组件
         */
        private getCardsGroup(pzOrientation: PZOrientation) {
            if (pzOrientation === PZOrientation.UP) {
                return this.upCardsGroup;
            } else if (pzOrientation === PZOrientation.DOWN) {
                return;
            } else if (pzOrientation === PZOrientation.LEFT) {
                return this.leftCardsGroup;
            } else if (pzOrientation === PZOrientation.RIGHT) {
                return this.rightCardsGroup;
            }
        }

        /**
         * 根据牌桌方向清空余牌手牌显示组件
         */
        public remCardsGroup(pzOrientation: PZOrientation) {
            let group: eui.Group = this.getCardsGroup(pzOrientation);
            if (!group) return;
            for (let i = group.numChildren - 1; i >= 0; i--) {
                let card: any = group.getChildAt(i);
                RFCardItemPool.recoverCardItem(card);
            }
            group.removeChildren();
        }

        /** 清除所有余牌手牌显示组 */
        public remAllCardsGroup() {
            this.remCardsGroup(PZOrientation.UP);
            this.remCardsGroup(PZOrientation.LEFT);
            this.remCardsGroup(PZOrientation.RIGHT);
        }

        /** 改变全场余牌数显示 */
        public changeRestCardsNum(num: number) {
            this.restCardNum.text = "剩余牌数：" + num;
        }

        /** 根据人数显示页面 */
        private showViewByNum(playerNum: number) {
            this.upHandGroup.visible = true;
            this.myHandGroup.visible = true;
            this.leftHandGroup.visible = true;
            this.rightHandGroup.visible = true;
            switch (playerNum) {
                case 2://2个人
                    this.leftHandGroup.visible = false;
                    this.rightHandGroup.visible = false;
                    break;
                case 3://3个人
                    this.upHandGroup.visible = false;
                    break;
            }
        }

        /** 根据牌桌方向获取手牌组 */
        public getHandGroup(pzOrientation: PZOrientation) {
            if (pzOrientation === PZOrientation.UP) {
                return this.upHandGroup;
            } else if (pzOrientation === PZOrientation.DOWN) {
                return this.myHandGroup;
            } else if (pzOrientation === PZOrientation.LEFT) {
                return this.leftHandGroup;
            } else if (pzOrientation === PZOrientation.RIGHT) {
                return this.rightHandGroup;
            }
        }

        /** 根据牌桌方向添加报单提示 */
        public addSingleEndEffect(pzOrientation: PZOrientation) {
            let img = this._imgObjsMap[pzOrientation];
            if (!img) {
                img = new eui.Image('SingleEnd_png');
                this._imgObjsMap[pzOrientation] = img;
            }
            let handProps = RFGameViewPropsHandle.getHandProps(pzOrientation, GameConstant.CURRENT_GAMETYPE);
            if (!handProps) return;
            RFGameViewPropsHandle.addPropsToObj(img, handProps.singleEnd);
            let group = this.getHandGroup(pzOrientation);
            group.addChild(img);
            // if (pzOrientation === PZOrientation.UP) {
            //     // img.verticalCenter = -120;
            //     // img.horizontalCenter = -100;
            //     this.upHandGroup.addChild(img);
            // } else if (pzOrientation === PZOrientation.DOWN) {
            //     this.myHandGroup.addChild(img);
            //     // img.horizontalCenter = -500;
            //     // img.verticalCenter = -40;
            // } else if (pzOrientation === PZOrientation.LEFT) {
            //     this.leftHandGroup.addChild(img);
            //     // img.horizontalCenter = -50;
            //     // img.verticalCenter = 110;
            // } else if (pzOrientation === PZOrientation.RIGHT) {
            //     this.rightHandGroup.addChild(img);
            //     // img.horizontalCenter = 50;
            //     // img.verticalCenter = 110;
            // }
        }

        /** 根据牌桌方向移除报单提示 */
        private remSingleEndEffect(pzOrientation: PZOrientation) {
            if (this._imgObjsMap[pzOrientation] && this._imgObjsMap[pzOrientation].parent) {
                this._imgObjsMap[pzOrientation].parent.removeChild(this._imgObjsMap[pzOrientation]);
            }
        }

        /**
         * 移除所有的报单提示
         */
        public remAllSingleEnd() {
            this.remSingleEndEffect(PZOrientation.RIGHT);
            this.remSingleEndEffect(PZOrientation.DOWN);
            this.remSingleEndEffect(PZOrientation.UP);
            this.remSingleEndEffect(PZOrientation.LEFT);
        }

        /**
         * 通过牌桌方向获取余牌显示组件
         */
        private getCardsNumLabel(pzOrientation: PZOrientation) {
            if (pzOrientation === PZOrientation.UP) {
                return this.upCardsNum;
            } else if (pzOrientation === PZOrientation.DOWN) {
                return;
            } else if (pzOrientation === PZOrientation.LEFT) {
                return this.leftCardsNum;
            } else if (pzOrientation === PZOrientation.RIGHT) {
                return this.rightCardsNum;
            }
        }

        /** 通过牌桌方向改变计时器位置 */
        public changeTimerPos(pzOrientation: PZOrientation) {
            let handProps = RFGameViewPropsHandle.getHandProps(pzOrientation, GameConstant.CURRENT_GAMETYPE);
            if (!handProps) return;
            RFGameViewPropsHandle.addPropsToObj(this.timerGroup, handProps.timer);
            let group = this.getHandGroup(pzOrientation);
            group.addChild(this.timerGroup);
        }

        /**
         * 是否显示计时器
         * @param {boolean} flag
         */
        public isShowTimer(flag: boolean) {
            // this.timerGroup.visible = flag;
            this.timerGroup.visible = false;
        }

        /**
         * 是否显示操作按钮
         */
        public isShowControl(flag: boolean) {
            this.myHandGroupHandle.isShowControlGroup(flag);
        }

        /**
         * 是否显示手牌余牌数
         */
        private isShowRestHandCards(flag: boolean) {
            this.upCardsNum.visible = flag;
            this.leftCardsNum.visible = flag;
            this.rightCardsNum.visible = flag;
        }

        /**
         * 改变对应pzorientation的剩余手牌牌数
         */
        public changeRestHandNum(pzOrientation: PZOrientation, num: number) {
            let vLabel = this.getCardsNumLabel(pzOrientation);
            if (!vLabel) return;
            vLabel.text = "" + num;
        }

        /**
         * 开始游戏，重置显示
         */
        public startGame(): void {
            this._mediator.startGame();
        }
    }
}