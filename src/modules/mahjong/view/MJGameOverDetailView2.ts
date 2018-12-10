module FL {
    /**
     * 麻将结算详情面板
     * @copyright 深圳市天天爱科技有限公司
     * @author Sven
     * @date 2018/6/26
     */
    export class MJGameOverDetailView extends eui.Component {
        /** 调停者名字，删除界面的时候会自动移除，为空则没有调停者 */
        public readonly mediatorName: string = "";
        /** 界面层级，UI框架自动管理 */
        public readonly viewLayer: ViewLayerEnum = ViewLayerEnum.POPUP_ONLY;

        public huCard:eui.Group;
        public wanfaDesc:eui.Label;
        public baseItemGro:eui.Group;
        public nameItem:FL.MJGameOverDetailItem;
        public idItem:FL.MJGameOverDetailItem;
        public zhuangItem:FL.MJGameOverDetailItem;
        public detailScro:eui.Scroller;
        public detailItemGroup:eui.Group;
        public closeBtnGroup:eui.Group;
        public closeBtn:eui.Image;
        public wanfaScr:eui.Scroller;

        /** 游戏结束消息 */
        private readonly _gameOverMsg:MahjongGameOverMsgAck;

        constructor(pGameOverMsg:MahjongGameOverMsgAck) {
            super();
            this._gameOverMsg = Game.CommonUtil.deepCopy(pGameOverMsg);
            this.verticalCenter = this.horizontalCenter = 0;
            this.skinName = "skins.MJGameOverDetailViewSkinN";
            //不可触摸
            // this.touchEnabled = false;
        }

        protected childrenCreated():void {
            super.childrenCreated();
            let self = this;
            // 注册按钮点击缓动
            TouchTweenUtil.regTween(self.closeBtnGroup, self.closeBtn);

            // 监听按钮点击事件
            self.closeBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, self.close, self);

            // 初始化界面显示
            this.init();
        }

         /**
         * 初始化
         */
        private init(): void {
            let self = this;
            // 设置胡的牌图片
            let vHuCard: number = 0;
            for (let i = 0;i < this._gameOverMsg.playerInfos.length;i ++) {
                if (this._gameOverMsg.playerInfos[i] && this._gameOverMsg.playerInfos[i].huCards && this._gameOverMsg.playerInfos[i].huCards[0]) {
                    vHuCard = this._gameOverMsg.playerInfos[i].huCards[0];
                    break;
                }
            }
            if (vHuCard) {
                let huCartItem = MahjongCardManager.getMahjongCommonCard(vHuCard, self.huCard.width, self.huCard.height);
                self.huCard.addChild(huCartItem);
            }
            else {
                self.huCard.removeChildren();
            }
            
            // 设置详细描述
            let text = self.wanfaDesc.text = MahjongHandler.getGameOverDetailWanfaDesc();
            let totalLineHeight = self.wanfaDesc.size + self.wanfaDesc.lineSpacing;
            let maxLine = Math.floor(self.wanfaScr.height/totalLineHeight);
            let totalLine = Math.floor((self.wanfaDesc.height+4)/totalLineHeight);
            if (totalLine < maxLine) {
                for (let i = 0;i < maxLine - totalLine;i ++) {
                    text = "\n" + text;
                }
                self.wanfaDesc.text = text;
            }
            else {
                self.wanfaScr.height -= 10;
            }

            let nameList: Array<string> = [];
            let idList: Array<string> = [];
            self._gameOverMsg.playerInfos.sort((a, b)=>{
                return a.tablePos - b.tablePos;
            })
            for (let i = 0;i < self._gameOverMsg.playerInfos.length;i ++) {
                let itemData: MahjongGameOverPlayerInfo = self._gameOverMsg.playerInfos[i];
                nameList.push(itemData.playerName);
                idList.push(itemData.playerIndex+"");
            }

            // TEST
            // let addNum = 10;
            // for (let i = 0;i < addNum;i ++) {
            //     self._gameOverMsg.scoreDetails.push(self._gameOverMsg.scoreDetails[1]);
            // }

            let nameItemData = new MahjongGameOverScoreDetailItem();
            nameItemData.desc = "玩家";
            nameItemData.viewStyle = 0;
            nameItemData.values = nameList;
            self.nameItem.initItem(nameItemData);
            self.nameItem.changeImgColor();

            let idItemData = new MahjongGameOverScoreDetailItem();
            idItemData.desc = "ID";
            idItemData.viewStyle = 0;
            idItemData.values = idList;
            self.idItem.initItem(idItemData);

            let zhuangItemData: MahjongGameOverScoreDetailItem;
            for (let i = 0;i < self._gameOverMsg.scoreDetails.length;i ++) {
                if (self._gameOverMsg.scoreDetails[i].desc == "庄闲") {
                    zhuangItemData = self._gameOverMsg.scoreDetails.splice(i, 1)[0];
                }
            }
            if (zhuangItemData) {
                self.zhuangItem.initItem(zhuangItemData);
            }

            // 宽高自适应
            self.baseItemGro.width = self.detailScro.width = self.nameItem.width/5 * (nameList.length+1);
            self.detailScro.width += 5;
            if (self._gameOverMsg.scoreDetails.length > 5) {
                self.detailScro.height = self.nameItem.height * 5 - 20;
            }
            else {
                self.detailScro.height = self.nameItem.height * self._gameOverMsg.scoreDetails.length + 10;
            }

            for (let i = 0;i < self._gameOverMsg.scoreDetails.length;i ++) {
                let item: MJGameOverDetailItem = new MJGameOverDetailItem(self._gameOverMsg.scoreDetails[i]);
                self.detailItemGroup.addChild(item);
            }
        }

        /**
         * 关闭界面
         */
        private close(): void {
            MvcUtil.delView(this);
        }
    }
}