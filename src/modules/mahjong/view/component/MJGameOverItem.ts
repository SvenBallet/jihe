module FL {
    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase - MJGameOverItem
     * @Description:  //麻将游戏结束条款，一条记录
     * @Create: DerekWu on 2017/12/6 16:22
     * @Version: V1.0
     */
    export class MJGameOverItem extends eui.Component {

        /** 玩家信息组 */
        public playerInfoGroup: eui.Group;

        /** 庄家位置 */
        public dealerFlag: eui.Image;
        /** 房主位置ICON */
        public roomOwnerIcon: eui.Image;
        /** 头像图片 */
        public headImg: eui.Image;
        /** 玩家名字 */
        public playerName: eui.Label;
        /** 游戏结果描述 */
        public gameResultDesc: eui.Label;

        /** 手牌显示组，包含吃碰杠的表现，癞子滤镜等 */
        public handCardGroup: eui.Group;
        /** 花牌显示组一，超过5个的放入第二个组，但是超过10个后就平均分 */
        public huaCardGroupOne: eui.Group;
        /** 花牌显示组二 */
        public huaCardGroupTwo: eui.Group;

        /** 分数组,分数居中放在这个组中 */
        public scoreGroup: eui.Group;
        /** 分数 */
        // private _scoreBitmapText:egret.BitmapText;

        /** 胡的牌图片，只有一个玩家有 */
        public huCardImg: eui.Group;
        public huCardImg0: eui.Group;
        /** 胡的标记 */
        public huFlagImg: eui.Image;


        /** 拥有的显示的图片数量 和 图片列表，本界面使用的图片列表，永不删除 */
        public _viewCardNum: number = 0;
        public _imgArray: eui.Image[] = [];

        /** 是否已经初始化 */
        private _isInit: boolean;

        /**
         * 初始化
         */
        private init(): void {
            let self = this;
            if (!self._isInit) {
                self.touchEnabled = false, self.touchChildren = false;
                // let vScoreBitmapText:egret.BitmapText = new egret.BitmapText();
                // // vScoreBitmapText.font = RES.getRes("game_score_fnt");
                // vScoreBitmapText.font = RES.getRes("game_score_gray_fnt");
                // vScoreBitmapText.text = "0";
                // self._scoreBitmapText = vScoreBitmapText;
                // self.scoreGroup.addChild(vScoreBitmapText);
                self._isInit = true;
            }
        }

        /**
         * 重置本条目
         * @param {FL.PlayerGameOverMsgAck} pGameOverMsg
         * @param {FL.SimplePlayer} pSimplePlayer
         */
        public resetItem(pGameOverMsg: PlayerGameOverMsgAck, pSimplePlayer: SimplePlayer): void {
            let self = this;
            if (!pSimplePlayer) {
                //不存在，删除显示，只保留背景
                ViewUtil.removeChild(self, self.playerInfoGroup);
                return;
            } else {
                ViewUtil.addChild(self, self.playerInfoGroup);
            }

            //初始化
            self.init();
            //重置显示图片数量
            self._viewCardNum = 0;

            self.headImg.source = "";

            //设置头像
            if (GConf.Conf.useWXAuth) {
                // GWXAuth.setCircleWXHeadImg(self.headImg, pSimplePlayer.headImgUrl, self.playerInfoGroup, 63,56,46);
                // GWXAuth.setRectWXHeadImg(self.headImg, pSimplePlayer.headImgUrl);
                GWXAuth.setCircleWXHeadImg(self.headImg, pSimplePlayer.headImgUrl, self.playerInfoGroup, 15+95/2, 6+95/2, (95/2)-6);
            }
            if (!pSimplePlayer.headImgUrl) {
                console.log("FUCK BEGIN");
                let circle: egret.Shape = new egret.Shape();
                circle.graphics.beginFill(0xffffff);
                circle.graphics.drawCircle(15+95/2, 6+95/2, (95 / 2)-6);
                circle.graphics.endFill();
                self.playerInfoGroup.addChild(circle);
                self.headImg.mask = circle;
                let key = "headIcon_" + pSimplePlayer.headImg + "_jpg";
                this.headImg.source = key
                console.log("FUCK END");
            }
            // else {
            //     GWXAuth.setCircleWXHeadImg(self.headImg, "http://wx.qlogo.cn/mmopen/vi_32/UmK17f9nicVrMhSQAbft5KOfKdIiaSFUHiaOTpxVum5JZ8G5zibHzzLkTJBicEuibL44kmuc8X0NpUrfgqrFKBh5jM9Q/0", self.playerInfoGroup, 63,56,46);
            // }

            //是否显示庄家标识
            if (pGameOverMsg.dealerPos === pSimplePlayer.tablePos) {
                ViewUtil.addChild(self.playerInfoGroup, self.dealerFlag);
            } else {
                ViewUtil.removeChild(self.playerInfoGroup, self.dealerFlag);
            }

            // 是否显示房主标志
            if (MJGameHandler.isRoomOwner2(pSimplePlayer)) {
                ViewUtil.addChild(self.playerInfoGroup, self.roomOwnerIcon);
            } else {
                ViewUtil.removeChild(self.playerInfoGroup, self.roomOwnerIcon);
            }

            //玩家名字,需要截断，和牌局里面的差不多
            self.playerName.text = StringUtil.subStrSupportChinese(pSimplePlayer.playerName, 10, "");
            //牌局结束文本 和 颜色
            self.gameResultDesc.text = pSimplePlayer.desc;
            if (NumberUtil.isAndNumber(pSimplePlayer.gameResult, GameConstant.MAHJONG_HU_CODE_DIAN_PAO)) {
                self.gameResultDesc.textColor = 0x0057cd;
            } else {
                self.gameResultDesc.textColor = 0xC56F00;
            }

            //设置是否胡牌
            // if (pGameOverMsg.huPos === pSimplePlayer.tablePos) {
            if (pGameOverMsg.isHuByTablePos(pSimplePlayer.tablePos)) {
                let vHuCard: number = pGameOverMsg.getHuCardByPos(pSimplePlayer.tablePos);
                let card1 = MahjongCardManager.getMahjongCommonCard(vHuCard, self.huCardImg.width, self.huCardImg.height);
                self.huCardImg.addChild(card1);
                if (MJGameHandler.isLaiZi(vHuCard)) {
                    // self.huCardImg.filters = [MJGameHandler.huaColorFilter];
                } else {
                    self.huCardImg.filters = null;
                }
                ViewUtil.addChild(self.playerInfoGroup, self.huCardImg);
                ViewUtil.addChild(self.playerInfoGroup, self.huFlagImg);
            } else {
                ViewUtil.removeChild(self.playerInfoGroup, self.huFlagImg);
                ViewUtil.removeChild(self.playerInfoGroup, self.huCardImg);
            }

            //设置分数
            let vScoreText: string;
            if (pSimplePlayer.gold > 0) {
                // self._scoreBitmapText.font = RES.getRes("game_score_fnt");
                vScoreText = "+" + pSimplePlayer.gold;
            } else {
                // self._scoreBitmapText.font = RES.getRes("game_score_gray_fnt");
                vScoreText = "" + pSimplePlayer.gold;
            }
            //设置分数文本  和 位置
            // self._scoreBitmapText.text = vScoreText;
            // if (vScoreText.length === 1) {
            //     self._scoreBitmapText.x = 60;
            // } else if (vScoreText.length === 2) {
            //     self._scoreBitmapText.x = 40;
            // } else if (vScoreText.length === 3) {
            //     self._scoreBitmapText.x = 20;
            // } else {
            //     self._scoreBitmapText.x = 0;
            // }
            //改为图片显示分数
            self.scoreGroup.removeChildren();
            let vScoreImageArray: eui.Image[] = MJGameHandler.genScoreImageArray(vScoreText);
            for (let vIndex: number = 0; vIndex < vScoreImageArray.length; ++vIndex) {
                self.scoreGroup.addChild(vScoreImageArray[vIndex]);
            }

            //设置手牌
            self.resetHandCard(pGameOverMsg.getCardDownArray(pSimplePlayer.tablePos), pGameOverMsg.getHandCardArray(pSimplePlayer.tablePos));

            let vGetMainGamePlayRule: number = MJGameHandler.getMainGamePlayRule();
            if (vGetMainGamePlayRule === MJGamePlayWay.ZHUANZHUAN) {

            }
            // 设置鸟牌
            self.resetNiaoCard(pSimplePlayer.tablePos);

            // 设置花牌
            //self.resetHuaCard(pGameOverMsg.getCardDownArray(pSimplePlayer.tablePos));
        }

        /**
         * 重置本条目
         * @param {FL.PlayerGameOverMsgAck} pGameOverMsg
         * @param {FL.SimplePlayer} pPlayerInfo
         */
        public newResetItem(pGameOverMsg: MahjongGameOverMsgAck, pPlayerInfo: MahjongGameOverPlayerInfo): void {
            let self = this;
            if (!pPlayerInfo) {
                //不存在，删除显示，只保留背景
                ViewUtil.removeChild(self, self.playerInfoGroup);
                return;
            } else {
                ViewUtil.addChild(self, self.playerInfoGroup);
            }

            //初始化
            self.init();
            //重置显示图片数量
            self._viewCardNum = 0;
            self.headImg.source = "";

            //设置头像
            if (GConf.Conf.useWXAuth) {
                // GWXAuth.setCircleWXHeadImg(self.headImg, pSimplePlayer.headImgUrl, self.playerInfoGroup, 63,56,46);
                // GWXAuth.setRectWXHeadImg(self.headImg, pPlayerInfo.headImageUrl);
                GWXAuth.setCircleWXHeadImg(self.headImg, pPlayerInfo.headImageUrl, self.playerInfoGroup, 15+95/2, 6+95/2, (95/2)-6);
            }
            if (!pPlayerInfo.headImageUrl) {
                let circle: egret.Shape = new egret.Shape();
                circle.graphics.beginFill(0xffffff);
                circle.graphics.drawCircle(15+95/2, 6+95/2, (95 / 2)-6);
                circle.graphics.endFill();
                self.playerInfoGroup.addChild(circle);
                self.headImg.mask = circle;
                let key = "headIcon_" + pPlayerInfo.headImg + "_jpg";
                this.headImg.source = key
            }
            // else {
            //     GWXAuth.setCircleWXHeadImg(self.headImg, "http://wx.qlogo.cn/mmopen/vi_32/UmK17f9nicVrMhSQAbft5KOfKdIiaSFUHiaOTpxVum5JZ8G5zibHzzLkTJBicEuibL44kmuc8X0NpUrfgqrFKBh5jM9Q/0", self.playerInfoGroup, 63,56,46);
            // }

            //是否显示庄家标识
            if (pPlayerInfo.isDealer) {
                ViewUtil.addChild(self.playerInfoGroup, self.dealerFlag);
            } else {
                ViewUtil.removeChild(self.playerInfoGroup, self.dealerFlag);
            }

            // 是否显示房主标志
            if (pPlayerInfo.isCreator) {
                ViewUtil.addChild(self.playerInfoGroup, self.roomOwnerIcon);
            } else {
                ViewUtil.removeChild(self.playerInfoGroup, self.roomOwnerIcon);
            }

            //玩家名字,需要截断，和牌局里面的差不多
            self.playerName.text = StringUtil.subStrSupportChinese(pPlayerInfo.playerName, 10, "");
            //牌局结束文本 和 颜色
            self.gameResultDesc.text = pPlayerInfo.desc;
            if (pPlayerInfo.flag == 1) {
                self.gameResultDesc.textColor = 0xFFFF80;
            } else {
                self.gameResultDesc.textColor = 0x53FFB8;
            }

            //设置是否胡牌
            // if (pGameOverMsg.huPos === pSimplePlayer.tablePos) {
            ViewUtil.removeChild(self.playerInfoGroup, self.huFlagImg);
            ViewUtil.removeChild(self.playerInfoGroup, self.huCardImg0);
            ViewUtil.removeChild(self.playerInfoGroup, self.huCardImg);
            if (pPlayerInfo.huCards && pPlayerInfo.huCards.length > 0) {
                let vHuCard: number = pPlayerInfo.huCards[0];
                let card1 = MahjongCardManager.getMahjongCommonCard(vHuCard, self.huCardImg.width, self.huCardImg.height);
                self.huCardImg.addChild(card1);
                if (pPlayerInfo.flag === 3 && MahjongHandler.isLaiZi(vHuCard)) {
                    // self.huCardImg.filters = [MahjongHandler.huaColorFilter];
                } else {
                    self.huCardImg.filters = null;
                }
                ViewUtil.addChild(self.playerInfoGroup, self.huCardImg);
                if (pPlayerInfo.huCards.length > 1) {
                    let vHuCard0: number = pPlayerInfo.huCards[1];
                    let card1 = MahjongCardManager.getMahjongCommonCard(vHuCard0, self.huCardImg0.width, self.huCardImg0.height);
                    self.huCardImg0.addChild(card1);
                    if (pPlayerInfo.flag === 3 && MahjongHandler.isLaiZi(vHuCard0)) {
                        // self.huCardImg0.filters = [MahjongHandler.huaColorFilter];
                    } else {
                        self.huCardImg0.filters = null;
                    }
                    ViewUtil.addChild(self.playerInfoGroup, self.huCardImg0);
                }
                ViewUtil.addChild(self.playerInfoGroup, self.huFlagImg);
            }

            //设置分数
            let vScoreText: string;
            if (pPlayerInfo.score > 0) {
                // self._scoreBitmapText.font = RES.getRes("game_score_fnt");
                vScoreText = "+" + pPlayerInfo.score;
            } else {
                // self._scoreBitmapText.font = RES.getRes("game_score_gray_fnt");
                vScoreText = "" + pPlayerInfo.score;
            }
            //设置分数文本  和 位置
            // self._scoreBitmapText.text = vScoreText;
            // if (vScoreText.length === 1) {
            //     self._scoreBitmapText.x = 60;
            // } else if (vScoreText.length === 2) {
            //     self._scoreBitmapText.x = 40;
            // } else if (vScoreText.length === 3) {
            //     self._scoreBitmapText.x = 20;
            // } else {
            //     self._scoreBitmapText.x = 0;
            // }
            //改为图片显示分数
            self.scoreGroup.removeChildren();
            let vScoreImageArray: eui.Image[] = MahjongHandler.genScoreImageArray(vScoreText);
            for (let vIndex: number = 0; vIndex < vScoreImageArray.length; ++vIndex) {
                self.scoreGroup.addChild(vScoreImageArray[vIndex]);
            }

            //设置手牌
            self.newResetHandCard(pPlayerInfo);

            // 设置马牌、鸟牌、花牌等
            self.newResetNiaoCard(pPlayerInfo);

        }

        /**
         * 重置手牌,包含吃碰杠的牌，和剩下的手牌
         * @param {Array<FL.CardDown>} cardDownArray
         * @param {Array<number>} handCardArray
         */
        private resetHandCard(cardDownArray: Array<CardDown>, handCardArray: Array<number>): void {
            let self = this;
            //清除所有
            self.handCardGroup.removeChildren();
            //处理吃碰杠，返回已经吃碰杠了几个，用来计算手牌的初始位置
            let vCardDownNum: number = self.handleCardDown(cardDownArray);
            //计算第一个手牌的位置
            let vFirstHandPosX: number = 0;
            if (vCardDownNum > 0) {
                vFirstHandPosX = vCardDownNum * 143 + 13;
            }
            //设置手上剩余的牌
            let vIndex: number = 0, vLength: number = handCardArray.length, vCurrCardImage: MahjongCardItem;
            for (; vIndex < vLength; ++vIndex) {
                vCurrCardImage = self.getHandOrHuaImage(handCardArray[vIndex], true);
                vCurrCardImage.x = vFirstHandPosX + vIndex * 45;
                self.handCardGroup.addChild(vCurrCardImage);
            }
        }

        /**
         * 重置手牌,包含吃碰杠的牌，和剩下的手牌
         * @param {Array<FL.CardDown>} cardDownArray
         * @param {Array<number>} handCardArray
         */
        private newResetHandCard(pPlayerInfo: MahjongGameOverPlayerInfo): void {
            let self = this;
            //清除所有
            self.handCardGroup.removeChildren();
            let cardDownArray: Array<MahjongCardDown> = pPlayerInfo.cardDowns;
            //处理吃碰杠，返回已经吃碰杠了几个，用来计算手牌的初始位置
            let vCardDownNum: number = self.newHandleCardDown(cardDownArray);
            //计算第一个手牌的位置
            let vFirstHandPosX: number = 0;
            if (vCardDownNum > 0) {
                vFirstHandPosX = vCardDownNum * 143 + 13;
            }
            //设置手上剩余的牌
            let vIndex: number = 0, vLength: number = pPlayerInfo.handCards.length, vCurrCardImage: MahjongCardItem;
            for (; vIndex < vLength; ++vIndex) {
                vCurrCardImage = self.getHandOrHuaImage(pPlayerInfo.handCards[vIndex], true);
                vCurrCardImage.x = vFirstHandPosX + vIndex * 45;
                self.handCardGroup.addChild(vCurrCardImage);
            }
        }

        /**
         * 处理吃碰杠，返回吃碰杠的数量
         * @param {Array<FL.CardDown>} cardDownArray
         * @returns {number}
         */
        private handleCardDown(cardDownArray: Array<CardDown>): number {
            let self = this;
            let vCardDownIndex: number = 0;
            //再添加显示
            if (cardDownArray && cardDownArray.length > 0) {
                let vIndex: number = 0, vLength: number = cardDownArray.length, vCurrCardDown: CardDown;
                for (; vIndex < vLength; ++vIndex) {
                    vCurrCardDown = cardDownArray[vIndex];
                    if (vCurrCardDown.type !== 0) {
                        //添加一个CardDown
                        self.addOneCardDown(vCurrCardDown, vCardDownIndex);
                        vCardDownIndex++;
                    }
                }
            }
            return vCardDownIndex;
        }

        /**
         * 处理吃碰杠，返回吃碰杠的数量
         * @param {Array<FL.CardDown>} cardDownArray
         * @returns {number}
         */
        private newHandleCardDown(cardDownArray: Array<MahjongCardDown>): number {
            let self = this;
            let vCardDownIndex: number = 0;
            //再添加显示
            if (cardDownArray && cardDownArray.length > 0) {
                let vIndex: number = 0, vLength: number = cardDownArray.length, vCurrCardDown: MahjongCardDown;
                for (; vIndex < vLength; ++vIndex) {
                    vCurrCardDown = cardDownArray[vIndex];
                    // if (vCurrCardDown.type !== 0) {
                    //添加一个 MahjongCardDown
                    self.newAddOneCardDown(vCurrCardDown, vCardDownIndex);
                    vCardDownIndex++;
                    // }
                }
            }
            return vCardDownIndex;
        }

        /**
         * 添加一个吃碰杠
         * @param {FL.CardDown} pOneCardDown
         * @param {number} cardDownIndex
         */
        private addOneCardDown(pOneCardDown: CardDown, cardDownIndex: number): void {
            let self = this;
            //计算第一个牌的开始位置
            let vFirstPosX: number = cardDownIndex * 143;
            //获得灰度牌的位置
            let vGrayPos: number = -1;
            if (pOneCardDown.type !== GameConstant.MAHJONG_OPERTAION_AN_GANG && pOneCardDown.type !== GameConstant.MAHJONG_OPERTAION_CHI) {
                vGrayPos = pOneCardDown.chuOffset + 1;
                if (pOneCardDown.chuOffset === 0 && ((pOneCardDown.cardValue >> 24) & 0xFF) > 0) {
                    vGrayPos = 3;
                }
            }
            let vIndex: number = 0, vCurrCardValue: number, vCurrCardImage: MahjongCardItem;
            for (; vIndex < 4; ++vIndex) {
                vCurrCardValue = (pOneCardDown.cardValue >> (8 * vIndex)) & 0xFF;
                if (vCurrCardValue > 0) {
                    if (vIndex === 3 && pOneCardDown.type === GameConstant.MAHJONG_OPERTAION_CHI) {
                        // 尺不处理最后一张
                        break;
                    }
                    vCurrCardImage = self.getHandOrHuaImage(vCurrCardValue, true);
                    //计算每个牌的坐标
                    if (vIndex === 3) {
                        vCurrCardImage.x = vFirstPosX + 45;
                        vCurrCardImage.y = -10;
                    } else {
                        if (pOneCardDown.type === GameConstant.MAHJONG_OPERTAION_AN_GANG) {
                            //暗杠前3个盖着
                            vCurrCardImage = MahjongCardManager.getMahjongCommonCard(vCurrCardValue, 45, 68, true);
                        }
                        vCurrCardImage.x = vFirstPosX + vIndex * 45;
                    }
                    //设置灰度滤镜
                    if (vGrayPos === vIndex) {
                        vCurrCardImage.filters = [MJGameHandler.gameOverCardDownChuOffsetColorFilter];
                    }
                    //添加到显示
                    self.handCardGroup.addChild(vCurrCardImage);
                }
            }
        }

        /**
         * 添加一个吃碰杠
         * @param {FL.CardDown} pOneCardDown
         * @param {number} cardDownIndex
         */
        private newAddOneCardDown(pOneCardDown: MahjongCardDown, cardDownIndex: number): void {
            let self = this;
            //计算第一个牌的开始位置
            let vFirstPosX: number = cardDownIndex * 143;
            //获得灰度牌的位置
            let vGrayPos: number = -1;
            if (pOneCardDown.sCardDownType !== MahjongActionEnum.AN_GANG && pOneCardDown.sCardDownType !== MahjongActionEnum.CHI) {
                vGrayPos = pOneCardDown.sChuOffset + 1;
                if (pOneCardDown.sChuOffset === 0 && pOneCardDown.sCards[4] && pOneCardDown.sCards[4] > 0) {
                    vGrayPos = 3;
                }
            }
            let vIndex: number = 0, vCurrCardValue: number, vCurrCardImage: MahjongCardItem;
            for (; vIndex < 4; ++vIndex) {
                // vCurrCardValue = (pOneCardDown.cardValue >> (8 * vIndex)) & 0xFF;
                vCurrCardValue = pOneCardDown.sCards[vIndex];
                if (vCurrCardValue && vCurrCardValue > 0) {
                    if (vIndex === 3 && pOneCardDown.sCardDownType === MahjongActionEnum.CHI) {
                        // 尺不处理最后一张
                        break;
                    }
                    vCurrCardImage = self.getHandOrHuaImage(vCurrCardValue, false, true);
                    //计算每个牌的坐标
                    if (vIndex === 3) {
                        vCurrCardImage.x = vFirstPosX + 45;
                        vCurrCardImage.y = -10;
                    } else {
                        if (pOneCardDown.sCardDownType === MahjongActionEnum.AN_GANG) {
                            //暗杠前3个盖着
                            vCurrCardImage = MahjongCardManager.getMahjongCommonCard(vCurrCardValue, 45, 68, true);
                        }
                        vCurrCardImage.x = vFirstPosX + vIndex * 45;
                    }
                    //设置灰度滤镜
                    if (vGrayPos === vIndex) {
                        vCurrCardImage.filters = [MahjongHandler.gameOverCardDownChuOffsetColorFilter];
                    }
                    //添加到显示
                    self.handCardGroup.addChild(vCurrCardImage);
                }
            }
        }

        /**
         * 重设鸟牌
         * @param {number} tablePos
         */
        private resetNiaoCard(tablePos: number): void {
            let self = this;
            //清空当前花牌显示
            self.huaCardGroupOne.removeChildren();
            self.huaCardGroupTwo.removeChildren();
            let vNiaoArray = MJGameHandler.getZhuanZhuanNiaoArrayByPos(tablePos);
            if (vNiaoArray && vNiaoArray.length > 0) {
                //计算第一组放鸟牌的数量
                let vHuaCardInOneGroupNumber: number = Math.ceil(vNiaoArray.length / 2);
                //设置第一个组的y坐标
                if (vNiaoArray.length > 5) {
                    self.huaCardGroupOne.y = 3;
                } else {
                    self.huaCardGroupOne.y = 33;
                }
                //判断最小
                if (vHuaCardInOneGroupNumber < 5) vHuaCardInOneGroupNumber = 5;
                //定义类型
                let vIndex: number = 0, vLength: number = vNiaoArray.length, vCurrSelectGroup: eui.Group, vCurrPosX: number, vNiaoCard: NiaoCard;
                for (; vIndex < vLength; ++vIndex) {
                    if (vIndex < vHuaCardInOneGroupNumber) {
                        vCurrSelectGroup = self.huaCardGroupOne, vCurrPosX = vIndex;
                    } else {
                        vCurrSelectGroup = self.huaCardGroupTwo, vCurrPosX = vIndex - vHuaCardInOneGroupNumber;
                    }
                    //获得一个vNiaoCard
                    vNiaoCard = new NiaoCard(true);
                    vNiaoCard.reset(vNiaoArray[vIndex]);
                    vNiaoCard.x = vCurrPosX * 40;
                    vCurrSelectGroup.addChild(vNiaoCard);
                }
            }
        }

        /**
         * 重设鸟牌(新)
         */
        private newResetNiaoCard(pPlayerInfo: MahjongGameOverPlayerInfo): void {
            let self = this;
            //清空当前花牌显示
            self.huaCardGroupOne.removeChildren();
            self.huaCardGroupTwo.removeChildren();
            if (pPlayerInfo.maCards && pPlayerInfo.maCards.length > 0) {
                let vNiaoArray: Array<{ card: number, isZhong: boolean, pos: number }> = [];
                for (let vIndex: number = 0; vIndex < pPlayerInfo.maCards.length; ++vIndex) {
                    let vMahjongMaPaiInfo: MahjongMaPaiInfo = pPlayerInfo.maCards[vIndex];
                    vNiaoArray.push({ card: vMahjongMaPaiInfo.card, isZhong: vMahjongMaPaiInfo.isZhong, pos: vMahjongMaPaiInfo.tablePos });
                }
                //计算第一组放鸟牌的数量
                let vHuaCardInOneGroupNumber: number = Math.ceil(vNiaoArray.length / 2);
                //设置第一个组的y坐标
                if (vNiaoArray.length > 3) {
                    self.huaCardGroupOne.y = 3;
                } else {
                    self.huaCardGroupOne.y = 33;
                }
                //判断最小
                if (vHuaCardInOneGroupNumber < 3) vHuaCardInOneGroupNumber = 3;
                //定义类型
                let vIndex: number = 0, vLength: number = vNiaoArray.length, vCurrSelectGroup: eui.Group, vCurrPosX: number, vNiaoCard: NiaoCard;
                for (; vIndex < vLength; ++vIndex) {
                    if (vIndex < vHuaCardInOneGroupNumber) {
                        vCurrSelectGroup = self.huaCardGroupOne, vCurrPosX = vIndex;
                    } else {
                        vCurrSelectGroup = self.huaCardGroupTwo, vCurrPosX = vIndex - vHuaCardInOneGroupNumber;
                    }
                    //获得一个vNiaoCard
                    vNiaoCard = new NiaoCard(true);
                    vNiaoCard.reset(vNiaoArray[vIndex]);
                    vNiaoCard.x = vCurrPosX * 40;
                    vCurrSelectGroup.addChild(vNiaoCard);
                }
            }
        }

        /**
         * 重置花牌
         * @param {Array<FL.CardDown>} cardDownArray
         */
        private resetHuaCard(cardDownArray: Array<CardDown>): void {
            let self = this;
            //清空当前花牌显示
            self.huaCardGroupOne.removeChildren();
            self.huaCardGroupTwo.removeChildren();
            //获得花牌列表
            let vCardArray: Array<number> = MJGameHandler.getHuaCardArrayByCardDownArray(cardDownArray);
            //计算第一组放花牌的数量
            let vHuaCardInOneGroupNumber: number = Math.ceil(vCardArray.length / 2);
            //设置第一个组的y坐标
            if (vCardArray.length > 5) {
                self.huaCardGroupOne.y = 3;
            } else {
                self.huaCardGroupOne.y = 33;
            }
            //判断最小
            if (vHuaCardInOneGroupNumber < 5) vHuaCardInOneGroupNumber = 5;
            //定义类型
            let vIndex: number = 0, vLength: number = vCardArray.length, vCurrSelectGroup: eui.Group, vCurrPosX: number, vHuaImage: MahjongCardItem;
            for (; vIndex < vLength; ++vIndex) {
                if (vIndex < vHuaCardInOneGroupNumber) {
                    vCurrSelectGroup = self.huaCardGroupOne, vCurrPosX = vIndex;
                } else {
                    vCurrSelectGroup = self.huaCardGroupTwo, vCurrPosX = vIndex - vHuaCardInOneGroupNumber;
                }
                //获得一个花图片
                vHuaImage = self.getHandOrHuaImage(vCardArray[vIndex], false);
                vHuaImage.x = vCurrPosX * 40;
                vCurrSelectGroup.addChild(vHuaImage);
            }
        }

        /**
         * 获得一张手牌或者花的图片
         * @param {number} cardValue
         * @param {boolean} isHand
         * @returns {eui.Image}
         */
        private getHandOrHuaImage(cardValue: number, isHand: boolean, isCardDown: boolean = false):MahjongCardItem {
            let self = this;
            let vImage: MahjongCardItem;
            if (isHand || isCardDown) {
                vImage = MahjongCardManager.getMahjongCommonCard(cardValue, 45, 68);
                if (MJGameHandler.isLaiZi(cardValue)) {
                    vImage.filters = [MJGameHandler.laiziColorFilter];
                } else {
                    vImage.filters = null
                }
            } else {
                vImage = MahjongCardManager.getMahjongCommonCard(cardValue, 40, 60);
                vImage.filters = null;
            }
            vImage.y = 0;
            self._viewCardNum++;
            return vImage;
        }

        /** 从显示列表移除时清除头像*/
        public clearHeadImg() {
            this.headImg.source = null;
            this.headImg.bitmapData = null;
        }
    }
}