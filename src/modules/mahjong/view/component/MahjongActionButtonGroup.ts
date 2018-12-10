module FL {
    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase - MahjongActionButtonGroup
     * @Description:  // 麻将动作按钮
     * @Create: DerekWu on 2018/6/20 14:59
     * @Version: V1.0
     */
    export class MahjongActionButtonGroup extends eui.Group {
        /** 按钮图片 */
        public actionImg:eui.Image;
        // /** 显示牌的图片1 */
        // public cardImg1:eui.Image;
        // /** 显示牌的图片2(胡两个牌的时候用) */
        // public cardImg2:eui.Image;
        // /** 胡牌时牌的背景图片（胡牌的时候用） */
        // public huCardBgImg:eui.Image;
        // /** 胡牌时背景上面显示的分数 */
        // public huCardScoreLable:eui.Label;

        /** 当前动作列表，只有一个值的时候直接发出，有多个值的时候弹出选择组 */
        public actionResultArray:Array<MahjongActionResult>;

        /**  */
        public mahjongTableCardsHandView:MahjongTableCardsHandView;

        constructor(pActionResult:Array<MahjongActionResult>, pMahjongTableCardsHandView:MahjongTableCardsHandView) {
            super();
            this.actionResultArray = pActionResult;
            this.mahjongTableCardsHandView = pMahjongTableCardsHandView;
            this.height = 136;
            this.init();
        }

        private init() {
            let vFirstActionResult:MahjongActionResult = this.actionResultArray[0];
            if (vFirstActionResult.action > 0xFFFFFF) {
                // 胡牌
                this.initHuAction();
            } else {
                // 其他
                this.initOtherAction();
            }
            // 监听点击图片
            TouchTweenUtil.regTween(this.actionImg, this.actionImg);
            this.actionImg.addEventListener(egret.TouchEvent.TOUCH_TAP, this.selectAction, this);
        }

        /**
         * 胡牌特殊处理
         */
        private initHuAction() {
            let vFirstActionResult:MahjongActionResult = this.actionResultArray[0];
            // 动作图片
            let vImg:eui.Image = this.genActionImg(vFirstActionResult.action);
            this.actionImg = vImg;
            // 看一下胡几张牌，最多两张
            let vHuCard1:number = vFirstActionResult.targetCard & 0xFF;
            let vHuCard2:number = (vFirstActionResult.targetCard >> 8) & 0xFF;
            if (vHuCard2 > 0) {
                // 胡两张
                this.width = 218+52;
            } else {
                this.width = 218;
            }
            // 背景图
            let vCardBg:eui.Image = new eui.Image();
            vCardBg.source = "hubg_png";
            vCardBg.x = 129, vCardBg.y = 8, vCardBg.height = 120;
            if (vHuCard2 > 0) { // 胡两张
                vCardBg.width = 76+52;
            } else {
                vCardBg.width = 76;
            }
            this.addChild(vCardBg);
            // 胡牌图片1
            let vHuCardImg: MahjongCardItem = MahjongCardManager.getMahjongCommonCard(vHuCard1, 52, 78);
            vHuCardImg.x = 141, vHuCardImg.y = 18;
            this.addChild(vHuCardImg);
            if (vHuCard2 > 0) { // 胡两张
                let vHuCardImg2:MahjongCardItem = MahjongCardManager.getMahjongCommonCard(vHuCard1, 52, 78);
                vHuCardImg2.x = 141 + 52, vHuCardImg2.y = 18;
                this.addChild(vHuCardImg2);
            }
            // 分数
            let vScoreLable:eui.Label = new eui.Label();
            vScoreLable.fontFamily = "SimHei";
            vScoreLable.textColor = 0xFFFFFF;
            vScoreLable.size = 22;
            vScoreLable.textAlign = "center";
            vScoreLable.verticalAlign = "middle";
            vScoreLable.x = 129, vScoreLable.y = 97, vScoreLable.height = 22;
            if (vHuCard2 > 0) { // 胡两张
                vScoreLable.width = 80+52;
                vScoreLable.text = "共" + vFirstActionResult.value + "分";
            } else {
                vScoreLable.width = 80;
                vScoreLable.text = vFirstActionResult.value + "分";
            }
            this.addChild(vScoreLable);

            // 最后添加动作图片
            this.addChild(vImg);
        }

        /**
         * 初始化其他动作
         */
        private initOtherAction() {
            let vFirstActionResult:MahjongActionResult = this.actionResultArray[0];
            // 动作图片
            let vImg:eui.Image = this.genActionImg(vFirstActionResult.action);
            this.actionImg = vImg;
            // 看一下有没有标志牌
            let vFlagCard:number = vFirstActionResult.targetCard;
            if (vFirstActionResult.action === MahjongActionEnum.AN_GANG && this.actionResultArray.length > 1) {
                // 多个暗杠不显示标志牌
                vFlagCard = 0;
            }
            if (vFirstActionResult.action === MahjongActionEnum.GUO || vFlagCard === 0x52) {
                vFlagCard = 0;
            }
            if (vFlagCard > 0) {
                // 有标志牌
                this.width = vImg.width + 66;
                // 背景图
                let vCardBg:eui.Image = new eui.Image();
                vCardBg.source = "hubg_png";
                vCardBg.x = vImg.width - 20, vCardBg.y = 21, vCardBg.width = 70, vCardBg.height = 94;
                this.addChild(vCardBg);
                // 标志牌图片
                let vFlagCardImg: MahjongCardItem = MahjongCardManager.getMahjongCommonCard(vFlagCard, 52, 78);
                vFlagCardImg.x = vImg.width - 11, vFlagCardImg.y = 29
                this.addChild(vFlagCardImg);
            } else {
                this.width = vImg.width;
            }
            // 最后添加动作图片
            this.addChild(vImg);

            // 调整过大小
            if (vFirstActionResult.action === MahjongActionEnum.GUO) {
                this.scaleX = this.scaleY = 0.65;
            }
        }

        /**
         * 生成动作图片
         * @param {number} action
         * @returns {eui.Image}
         */
        private genActionImg(action:number):eui.Image {
            let vImg:eui.Image = new eui.Image();
            let vResName: string = MahjongHandler.getActionImageResName(action);
            // let vRes:egret.Texture = RES.getRes(vResName);
            vImg.source = vResName;
            vImg.height = 136; // 高度统一
            vImg.width  = MahjongHandler.getActionImageResWidth(action);
            vImg.x = vImg.width/2, vImg.y = 68;
            vImg.anchorOffsetX = vImg.x, vImg.anchorOffsetY = vImg.y; // 锚点
            return vImg;
        }

        /**
         * 选择动作
         */
        private selectAction(): void {
            if (this.actionResultArray.length > 1) {
                // 有多选，展示子选择
                for (let vIndex:number = 0; vIndex < this.actionResultArray.length; ++vIndex) {
                    let vSubGroupArray:Array<MahjongActionSubSelectGroup> = [];
                    for (let vIndex:number = 0; vIndex < this.actionResultArray.length; ++vIndex) {
                        let vMahjongActionResult: MahjongActionResult = this.actionResultArray[vIndex];
                        let vMahjongActionSubSelectGroup: MahjongActionSubSelectGroup = new MahjongActionSubSelectGroup(vMahjongActionResult, this.mahjongTableCardsHandView);
                        vSubGroupArray.push(vMahjongActionSubSelectGroup);
                    }
                    this.mahjongTableCardsHandView.newViewSelectGroup(vSubGroupArray);
                }
            } else {
                let vMahjongActionSelectMsg: MahjongActionSelectMsg = new MahjongActionSelectMsg();
                vMahjongActionSelectMsg.selectActionId = this.actionResultArray[0].id;
                ServerUtil.sendMsg(vMahjongActionSelectMsg); // 选择当前动作
                this.mahjongTableCardsHandView.selectActionOver(); // 隐藏
                // 选择过
                if (vMahjongActionSelectMsg.selectActionId === 1) {
                    MvcUtil.send(MahjongModule.MAHJONG_ACTION_SELECT_GUO);
                }
                MahjongData.thisMyMahjongMoOneCardMsgAck = null;
            }
        }

    }
}