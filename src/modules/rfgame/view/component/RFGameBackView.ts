module FL {
    /**
     * 客服界面
     */
    export class RFGameBackView extends BaseView {

        //调停者名字，删除界面的时候会自动移除
        public readonly mediatorName: string = SetViewMediator.NAME;
        //界面层级，UI框架自动管理
        public readonly viewLayer: ViewLayerEnum = ViewLayerEnum.POPUP_ONLY;

        public fillBg:eui.Rect;
        public listGro:eui.Group;
        public rightCardGroup:eui.Group;

        //添加界面的缓动
        public addTween:Array<any> = [{data:[{scaleX:0.8, scaleY:0.8}, {scaleX:1, scaleY:1}, 200, Game.Ease.backOut]}];

        constructor () {
            super();
            this.top = this.bottom = this.left = this.right = 0;
            this.skinName = skins.RFGameBackViewSkin;
        }

        protected childrenCreated():void {
            super.childrenCreated();
            this.listGro.removeChildren();
            this.fillBg.addEventListener(egret.TouchEvent.TOUCH_TAP, this.touchBg, this);
            this.initView();
        }

        private initView(){
            if (!RFGameData.pokerRefreshhistoryMsgAck) {
                PromptUtil.show("暂无回放记录", PromptType.ALERT);
                return;
            }

            let oriList: Array<PokerOutCardItem> = RFGameData.pokerRefreshhistoryMsgAck.outCardHistoryList;
            oriList.sort((a, b)=>{
                return b.tablePos - a.tablePos;
            })

            // 单个玩家去重，即只显示玩家的一次出牌。要显示多次出牌，注释这一块代码即可
            let tarList: Array<PokerOutCardItem> = [];
            let pushPos: number = -1;
            for (let i = oriList.length-1;i >= 0;i --) {
                if (oriList[i].tablePos != pushPos) {
                    tarList.push(oriList[i]);
                    pushPos = oriList[i].tablePos;
                }
            }
            oriList = tarList;

            let nameX: number = 10;
            let cardGroX: number = 200;
            let cardGroY: number = 30;
            let nameOffsetY: number = 30;
            let lineGap: number = 100;
            let addedNamePos = -1;
            for(let i = 0;i < oriList.length;i ++) {
                if (oriList[i].tablePos != addedNamePos) {
                    let name: eui.Label = this.getNameLabel(oriList[i].tablePos);
                    name.x = nameX;
                    name.y = cardGroY + nameOffsetY;
                    this.listGro.addChild(name);
                    addedNamePos = oriList[i].tablePos;
                }

                let cards: eui.Group = this.getCardsGro(oriList[i].outList);
                cards.x = cardGroX;
                cards.y = cardGroY;
                this.listGro.addChild(cards);
                cardGroY += lineGap;
            }
        }

        private getNameLabel(pos: number): eui.Label {
            let player: GamePlayer = RFGameData.playerInfo[pos];
            let nameLab: eui.Label = new eui.Label();
            nameLab.fontFamily = "Microsoft YaHei";
            nameLab.size = 24;
            nameLab.width = 180;
            nameLab.textAlign ="center";
            nameLab.text = StringUtil.subStrSupportChinese(player.playerName, 8, "..")
            return nameLab;
        }

        private getCardsGro(list: Array<number>): eui.Group {
            let gro: eui.Group = new eui.Group();
            gro.width = 446;
            gro.height = 78;
            let layout: eui.HorizontalLayout = new eui.HorizontalLayout();
            layout.gap = -30;
            gro.layout = layout;

            let cardScale = 0.4;
            let cardList: Array<ICardData> = RFGameHandle.getCardData(list);
            for (let i = 0;i < cardList.length;i ++) {
                let card = RFCardItemPool.getCardItem();
                card.initView(cardList[i]);
                card.scaleX = cardScale;
                card.scaleY = cardScale;
                gro.addChild(card);
            }
            return gro;
        }

        private touchBg() {
            MvcUtil.delView(this);
        }
    }
}