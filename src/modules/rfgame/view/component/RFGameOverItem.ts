module FL {
    export class RFGameOverItem extends eui.Component {
        /** 玩家信息组 */
        public playerInfoGroup: eui.Group;
        /** 房主位置ICON */
        public roomOwnerIcon: eui.Image;
        /** 头像图片 */
        public headImg: eui.Image;
        /** 玩家名字 */
        public playerName: eui.Label;
        /** 剩牌 */
        public restNum: eui.Label;
        /** 炸弹 */
        public zhandanNum: eui.Label;
        /** 积分 */
        public scoreNum: eui.Label;
        /** 春天 */
        public springImg: eui.Image;
        /** 红桃十扎鸟 */
        public heart10Img: eui.Image;

        /** 分数组,分数居中放在这个组中 */
        public scoreGroup: eui.Group;

        /** 是否初始化 */
        private _isInit: boolean = false;

        public cardList:eui.Group;

        /**
         * 初始化
         */
        private init(): void {
            let self = this;
            if (!self._isInit) {
                self.touchEnabled = false, self.touchChildren = false;
                self._isInit = true;
            }
        }

        public resetItem(msg: PaoDeKuaiGameOverSettleAccountsMsgAck, playerInfo: PaoDeKuaiGameOverPlayer, extraFlag: boolean = false) {
            let self = this;
            // 清除牌
            self.cardList.removeChildren();
            if (!playerInfo) {
                //不存在，删除显示，只保留背景
                ViewUtil.removeChild(self, self.playerInfoGroup);
                extraFlag && self.setCardList(msg.residueCards);
                // 剩余牌显示
                return;
            } else {
                ViewUtil.addChild(self, self.playerInfoGroup);
            }
            //初始化
            self.init();
            //设置头像
            if (GConf.Conf.useWXAuth) {
                // GWXAuth.setCircleWXHeadImg(self.headImg, playerInfo.headImgUrl, self.playerInfoGroup, 63,56,46);
                // GWXAuth.setRectWXHeadImg(this.headImg, playerInfo.headImageUrl);
                GWXAuth.setCircleWXHeadImg(self.headImg, playerInfo.headImageUrl, self.playerInfoGroup, 15+95/2, 6+95/2, (95/2)-6);
            }
            if (!playerInfo.headImageUrl) {
                let circle: egret.Shape = new egret.Shape();
                circle.graphics.beginFill(0xffffff);
                circle.graphics.drawCircle(15+95/2, 6+95/2, (95 / 2)-6);
                circle.graphics.endFill();
                self.playerInfoGroup.addChild(circle);
                self.headImg.mask = circle;
                let key = "headIcon_" + playerInfo.headImg + "_jpg";
                this.headImg.source = key;
            }

            //玩家名字,需要截断，和牌局里面的差不多
            self.playerName.text = StringUtil.subStrSupportChinese(playerInfo.playerName, 10, ".");

            self.isSpring(playerInfo.isChunTian);
            self.isHeart10(playerInfo.redTen);
            self.setRestNum(playerInfo.leftCardNum);
            self.setZhadanNum(playerInfo.zhaDanNum);
            self.setScoreNum(playerInfo.score);
            self.isRoomOwner(playerInfo.tablePos);
            self.setCardList(playerInfo.chuCards, playerInfo.handCards);
        }

        /**
         * 设置牌
         */
        private setCardList(list: Array<number>, handList: Array<number> = []) {
            let cardScale = 0.4;
            let cardList: Array<ICardData> = RFGameHandle.getCardData(list);
            let handCardList: Array<ICardData> = RFGameHandle.getCardData(handList);

            for (let i = 0;i < cardList.length;i ++) {
                let card = new RFHandCardItemView();
                card.initView(cardList[i]);
                card.scaleX = cardScale;
                card.scaleY = cardScale;
                card.showLightShade(!this.inHand(handCardList, cardList[i]));
                this.cardList.addChild(card);
            }
        }

        private inHand(handCardList: Array<ICardData>, card: ICardData):boolean {
            for (let i = 0;i < handCardList.length;i ++) {
                if (handCardList[i].id == card.id) {
                    return true;
                }
            }
            return false;
        }

        /**
         * 是否房主
         */
        private isRoomOwner(tablePos: number) {
            this.roomOwnerIcon.visible = (RFGameHandle.isRoomOwner(RFGameHandle.getPZOrientation(tablePos)));
        }

        /**
         * 是否春天
         */
        private isSpring(flag: boolean) {
            this.springImg.visible = flag;
        }

        /** 是否红桃十扎鸟 */
        private isHeart10(flag: boolean) {
            this.heart10Img.visible = flag;
        }

        /** 设置剩牌 */
        private setRestNum(num: number) {
            this.restNum.text = "" + num;
        }

        /** 设置炸弹数 */
        private setZhadanNum(num: number) {
            this.zhandanNum.text = "" + num;
        }

        /** 设置积分 */
        private setScoreNum(num: number) {
            let vScoreText: string;
            if (num > 0) {
                vScoreText = "+" + num;
            } else {
                vScoreText = "" + num;
            }
            // this.scoreNum.text = vScoreText;
            this.scoreGroup.removeChildren();
            let vScoreImageArray: eui.Image[] = MJGameHandler.genScoreImageArray(vScoreText);
            for (let vIndex: number = 0; vIndex < vScoreImageArray.length; ++vIndex) {
                this.scoreGroup.addChild(vScoreImageArray[vIndex]);
            }
        }
        
        /** 从显示列表移除时清除头像*/
        public clearHeadImg() {
            this.headImg.source = null;
            this.headImg.bitmapData = null;
        }
    }
}