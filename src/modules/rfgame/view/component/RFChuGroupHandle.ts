module FL {

    /**
     * 出牌显示界面
     */
    export class RFChuGroupHandle {
        /** 出牌显示组 */
        private readonly _viewGroup: eui.Group;
        private _cardGroup: eui.Group;
        /** 特效显示组 */
        public _effectGroup: eui.Group;
        /** 特效组操作 */
        private _effectHandle: RFCardEffectHandle;

        /** 每个显示组的最多放的牌数量，默认是20个 */
        private _subGroupMaxCardNum: number = 20;
        /** 牌间距 */
        private cardGap: number = -20;
        /** 每张牌的缩放系数 */
        private cardScale: number = 1;
        /** 单张牌最大宽度 */
        private cardMaxWid: number = 138;
        /** 牌桌方向 */
        private readonly _pzOrientation: PZOrientation;
        /** 卡牌数据数组 */
        public data: ICardsData = null;

        constructor(pPZOrientation: PZOrientation, pViewGroup: eui.Group) {
            this._pzOrientation = pPZOrientation;
            this._viewGroup = pViewGroup;
            this._cardGroup = new eui.Group();
            this._effectGroup = new eui.Group();
            this._effectHandle = new RFCardEffectHandle(this, pPZOrientation);

            // this._cardGroup.width = 380;
            // this._cardGroup.height = 100;
            // // this._cardGroup.layout = this.getLayout(pPZOrientation);
            // this._effectGroup.width = 380;
            // this._effectGroup.height = 100;

            this.initPos(pPZOrientation);
            this._viewGroup.addChild(this._cardGroup);
            this._viewGroup.addChild(this._effectGroup);
        }

        /**
         * 初始化位置
         */
        private initPos(pPZOrientation: PZOrientation) {
            //初始化位置和尺寸
            let chuProps = RFGameViewPropsHandle.getChuProps(this._pzOrientation, GameConstant.CURRENT_GAMETYPE);
            if (!chuProps) return;
            RFGameViewPropsHandle.addPropsToObj(this._cardGroup, chuProps.chu);
            RFGameViewPropsHandle.addPropsToObj(this._effectGroup, chuProps.eff);
            RFGameViewPropsHandle.addPropsToObj(this._viewGroup, chuProps.vie);
            if (RFGameHandle.isReplay()) {
                //重放时需要调整左右的位置
                if (pPZOrientation == PZOrientation.RIGHT || pPZOrientation == PZOrientation.UP) {
                    this._viewGroup.right = 310;
                } else if (pPZOrientation == PZOrientation.LEFT) {
                    this._viewGroup.left = 260;
                }
            }
            // if (pPZOrientation === PZOrientation.UP) {
            //     this._viewGroup.width = 380;
            //     this._viewGroup.height = 100;
            //     this._viewGroup.horizontalCenter = 0;
            //     this._viewGroup.top = 200;//horizontalCenter="-15" top="111"
            // } else {
            //     if (pPZOrientation === PZOrientation.DOWN) {
            //         this._viewGroup.width = 380;
            //         this._viewGroup.height = 100;
            //         this._viewGroup.horizontalCenter = 0;
            //         this._viewGroup.bottom = 240;// bottom="250" horizontalCenter="-15"
            //     } else if (pPZOrientation === PZOrientation.LEFT) {
            //         this._viewGroup.width = 380;
            //         this._viewGroup.height = 100;
            //         this._viewGroup.left = (RFGameHandle.isReplay()) ? 260 : 190;
            //         this._viewGroup.verticalCenter = -150;// left="255" verticalCenter="-81"
            //     } else if (pPZOrientation === PZOrientation.RIGHT) {
            //         this._viewGroup.width = 380;
            //         this._viewGroup.height = 100;
            //         this._viewGroup.right = (RFGameHandle.isReplay()) ? 290 : 220;
            //         this._viewGroup.verticalCenter = -150;//right="236" verticalCenter="-81"
            //     }
            // }
        }

        /** 初始化属性 */
        private initProps() {
            // let maxNum = RFGameData.gameMaxCardNum;
            // let gap = -30;
            // this._subGroupMaxCardNum = maxNum;
            // this.cardGap = gap;
            // let _gap = Math.abs(gap);
            // let _w = (this._viewGroup.width + _gap * maxNum) / maxNum;
            // this.cardScale = _w / this.cardMaxWid;


            // let maxNum = RFGameData.gameMaxCardNum;
            // switch (maxNum) {
            //     case 20:
            //         this.cardScale = 0.65;
            //         this.cardGap = -30;
            //         break;
            //     default:
            //         this.cardScale = 0.75;
            //         this.cardGap = -35;
            //         break;
            // }

            let chuProps = RFGameViewPropsHandle.getChuProps(this._pzOrientation, GameConstant.CURRENT_GAMETYPE);
            if (!chuProps) return;
            // this.cardGap = (chuProps.vcp.gap) ? chuProps.vcp.gap : -35;
            this.cardGap = -40;
            this.cardScale = (chuProps.vcp.scale) ? chuProps.vcp.scale : 0.75;
        }

        /** 根据方向获取对应布局 */
        private getLayout(pPZOrientation: PZOrientation) {
            // let layout = new eui.HorizontalLayout();
            let layout = new eui.TileLayout();
            if (pPZOrientation === PZOrientation.UP) {
                layout.horizontalGap = this.cardGap;
                layout.verticalGap = -70;
                layout.requestedColumnCount = 9;
                // layout.gap = this.cardGap;
                layout.horizontalAlign = "center";
            } else {
                if (pPZOrientation === PZOrientation.DOWN) {
                    // layout.gap = this.cardGap;
                    layout.horizontalGap = this.cardGap;
                    layout.verticalGap = -70;
                    layout.requestedColumnCount = 9;
                    layout.horizontalAlign = "center";
                } else if (pPZOrientation === PZOrientation.LEFT) {
                    // layout.gap = this.cardGap;
                    layout.horizontalGap = this.cardGap;
                    layout.verticalGap = -70;
                    layout.requestedColumnCount = 9;
                    layout.horizontalAlign = "center";
                } else if (pPZOrientation === PZOrientation.RIGHT) {
                    // layout.gap = this.cardGap;
                    layout.horizontalGap = this.cardGap;
                    layout.verticalGap = -70;
                    layout.requestedColumnCount = 9;
                    layout.horizontalAlign = "center";
                }
            }
            return layout;
        }

        /**
         * 重置显示内容
         */
        public resetView(data: ICardsData, useAni: boolean = true) {
            this.initProps();
            this.initPos(this._pzOrientation);
            //先清空显示
            for (let i = this._cardGroup.numChildren - 1; i >= 0; i--) {
                let card: any = this._cardGroup.getChildAt(i);
                RFCardItemPool.recoverCardItem(card);
            }
            this._cardGroup.removeChildren();
            if (!data) return;
            this.data = null;
            // this._effectGroup.removeChildren();
            //---test
            this.data = data;
            //绘制卡牌前是否使用特效
            if (useAni) this._effectHandle.handleEffect(this.data.type, this.data.value);
            else {
                this.drawCards(this.data.data);
                //如果是报单，添加报单特效
                if (this.data.type == ECardEffectType.SingleEnd) {
                    MvcUtil.send(RFGameModule.CARD_SINGLE_END, this._pzOrientation);
                }
            }
        }

        /** 绘制当前显示牌 */
        public drawCards(cards: Array<ICardData>) {
            if (!cards) return;
            let tempY = 0;
            let tempX = 0;
            let len = cards.length;
            if (len > 9) len = 9;

            //左：左对齐，右：右对齐，上下：居中
            let border = 0;
            //是否转行
            let isTurn = true;
            // let border = (this._pzOrientation === PZOrientation.LEFT || this._pzOrientation === PZOrientation.RIGHT) ? 0 : (380 - len * Math.abs(this.cardGap)) / 2;
            if (this._pzOrientation === PZOrientation.LEFT) {
                border = 0;
            } else if (this._pzOrientation === PZOrientation.RIGHT || this._pzOrientation === PZOrientation.UP) {
                border = (380 - (len + 3) * Math.abs(this.cardGap));
            }
            else {
                len = cards.length;
                border = (380 - len * Math.abs(this.cardGap)) / 2 + this.cardGap;
                isTurn = false;
            }
            // let border = 0;

            for (let i = 0; i < cards.length; i++) {
                if (i / 9 == 1 && isTurn) {//第9个的时候转行
                    tempX = 0;
                    tempY = 80;
                }
                let card = RFCardItemPool.getCardItem();
                card.initView(cards[i]);
                card.scaleX = this.cardScale;
                card.scaleY = this.cardScale;
                card.x = tempX + Math.abs(this.cardGap) + border;
                card.y = tempY;
                tempX += Math.abs(this.cardGap);
                this._cardGroup.addChild(card);
            }
        }
    }
}