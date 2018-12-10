module FL {
    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase - MJRoomOverItem
     * @Description:  //麻将房间结束条目
     * @Create: DerekWu on 2017/12/9 14:34
     * @Version: V1.0
     */
    export class MJRoomOverItem extends eui.Component {
        public bg1:eui.Image;
        public bg2:eui.Image;

        /** 玩家信息组 */
        public playerInfoGroup: eui.Group;

        /** 头像 */
        public headImg: eui.Image;
        /** 玩家名字 */
        public playerName: eui.Label;
        /** 玩家ID */
        public playerId: eui.Label;
        /** 大赢家标志 */
        public winFlag: eui.Image;
        /** 房主标志 */
        public roomOwnerFlag: eui.Image;
        /** 解散者标志 */
        public dismissFlag: eui.Image;
        /** 分数组 */
        public scoreGroup: eui.Group;
        /** 分数 */
        // private _scoreBitmapText:egret.BitmapText;

        /** 中间文本信息组 */
        public textInfoGroup: eui.Group;
        // public huLabel: eui.Label;  //胡牌次数
        // public dianPaoLabel: eui.Label; //点炮次数
        // public gongGangLabel: eui.Label; //公杠次数
        // public anGangLabel: eui.Label; //暗杠次数
        // public zhongMaLabel: eui.Label; //中码次数

        /** 是否已经初始化 */
        private _isInit: boolean;
        /** 文本显示*/
        public scroller: eui.Scroller;
        public dataGroup: eui.DataGroup;

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
         * @param {FL.PlayerGameOverMsgAck} pVipRoomCloseMsg
         * @param {FL.SimplePlayer} pSimplePlayer
         */
        public resetItem(pVipRoomCloseMsg: VipRoomCloseMsg, pSimplePlayer: SimplePlayer): void {
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

            //设置头像
            if (GConf.Conf.useWXAuth) {
                // GWXAuth.setCircleWXHeadImg(self.headImg, pSimplePlayer.headImgUrl, self.playerInfoGroup, 55,62,46);
                GWXAuth.setRectWXHeadImg(self.headImg, pSimplePlayer.headImgUrl);
            }
            // else {
            //     GWXAuth.setCircleWXHeadImg(self.headImg, "http://wx.qlogo.cn/mmopen/vi_32/UmK17f9nicVrMhSQAbft5KOfKdIiaSFUHiaOTpxVum5JZ8G5zibHzzLkTJBicEuibL44kmuc8X0NpUrfgqrFKBh5jM9Q/0", self.playerInfoGroup, 55,62,46);
            // }

            //是否显示房主标识
            if (pVipRoomCloseMsg.unused_1 === pSimplePlayer.tablePos) {
                ViewUtil.addChildBefore(self.playerInfoGroup, self.roomOwnerFlag, self.scoreGroup);
            } else {
                ViewUtil.removeChild(self.playerInfoGroup, self.roomOwnerFlag);
            }

            // 解散者标志
            if (pVipRoomCloseMsg.dismissPlayerPos === pSimplePlayer.tablePos) {
                ViewUtil.addChildBefore(self.playerInfoGroup, self.dismissFlag, self.scoreGroup);
            } else {
                ViewUtil.removeChild(self.playerInfoGroup, self.dismissFlag);
            }

            //是否显示大赢家标识，赢的分数必须大于0
            if (pVipRoomCloseMsg.winPos === pSimplePlayer.tablePos && pSimplePlayer.gold > 0) {
                ViewUtil.addChildBefore(self.playerInfoGroup, self.winFlag, self.scoreGroup);
            } else {
                ViewUtil.removeChild(self.playerInfoGroup, self.winFlag);
            }

            //玩家名字,需要截断，和牌局里面的差不多
            self.playerName.text = StringUtil.subStrSupportChinese(pSimplePlayer.playerName, 10, "..");
            //玩家Id
            self.playerId.text = ""+pSimplePlayer.palyerIndex;

            //设置胡牌次数等
            // self.huLabel.text = "胡牌次数：" + pSimplePlayer.winCount;
            // self.dianPaoLabel.text = "点炮次数：" + pSimplePlayer.dianpaoCount;
            // self.gongGangLabel.text = "公杠次数：" + ((pSimplePlayer.hitHorseCount >> 8) & 0xFF);
            // self.anGangLabel.text = "暗杠次数：" + ((pSimplePlayer.hitHorseCount >> 16) & 0xFF);
            // if (MJGameHandler.roomOverHasZhongMa()) {
            //     ViewUtil.addChild(self.textInfoGroup, self.zhongMaLabel);
            //     self.zhongMaLabel.text = "中鸟次数：" + pSimplePlayer.zhongNiaoCount;
            // } else {
            //     ViewUtil.removeChild(self.textInfoGroup, self.zhongMaLabel);
            // }

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

        }

        /**
         * 重置本条目（新）
         * @param {FL.PlayerGameOverMsgAck} pVipRoomCloseMsg
         * @param {FL.SimplePlayer} pSimplePlayer
         */
        public newResetItem(pVipRoomCloseMsg: NewVipRoomOverSettleAccountsMsgAck, pSimplePlayer: VipRoomOverPlayer): void {
            let self = this;
            if (!pSimplePlayer) {
                //不存在，删除显示，只保留背景
                ViewUtil.removeChild(self, self.playerInfoGroup);
                self.bg1.visible = false;
                self.bg2.visible = false;
                return;
            } else {
                ViewUtil.addChild(self, self.playerInfoGroup);
                self.bg1.visible = true;
                self.bg2.visible = true;
            }

            //初始化
            self.init();

            //设置头像
            if (GConf.Conf.useWXAuth) {
                // GWXAuth.setCircleWXHeadImg(self.headImg, pSimplePlayer.headImgUrl, self.playerInfoGroup, 55,62,46);
                GWXAuth.setRectWXHeadImg(self.headImg, pSimplePlayer.headImgUrl);
            }
            // else {
            //     GWXAuth.setCircleWXHeadImg(self.headImg, "http://wx.qlogo.cn/mmopen/vi_32/UmK17f9nicVrMhSQAbft5KOfKdIiaSFUHiaOTpxVum5JZ8G5zibHzzLkTJBicEuibL44kmuc8X0NpUrfgqrFKBh5jM9Q/0", self.playerInfoGroup, 55,62,46);
            // }

            //是否显示房主标识
            if (pVipRoomCloseMsg.unused_1 === pSimplePlayer.tablePos) {
                ViewUtil.addChildBefore(self.playerInfoGroup, self.roomOwnerFlag, self.scoreGroup);
            } else {
                ViewUtil.removeChild(self.playerInfoGroup, self.roomOwnerFlag);
            }

            // 解散者标志
            if (pVipRoomCloseMsg.dismissPlayerPos === pSimplePlayer.tablePos) {
                ViewUtil.addChildBefore(self.playerInfoGroup, self.dismissFlag, self.scoreGroup);
            } else {
                ViewUtil.removeChild(self.playerInfoGroup, self.dismissFlag);
            }

            //是否显示大赢家标识，赢的分数必须大于0
            if (pVipRoomCloseMsg.winPos === pSimplePlayer.tablePos && pSimplePlayer.score > 0) {
                ViewUtil.addChildBefore(self.playerInfoGroup, self.winFlag, self.scoreGroup);
            } else {
                ViewUtil.removeChild(self.playerInfoGroup, self.winFlag);
            }

            //玩家名字,需要截断，和牌局里面的差不多
            self.playerName.text = StringUtil.subStrSupportChinese(pSimplePlayer.playerName, 10, "..");
            //玩家Id
            self.playerId.text = "" + pSimplePlayer.playerIndex;

            //设置胡牌次数等
            // self.huLabel.text = pSimplePlayer.itemStr[0] + ":" + pSimplePlayer.temValue[0];
            // self.dianPaoLabel.text = pSimplePlayer.itemStr[1] + ":" + pSimplePlayer.temValue[1];
            // self.gongGangLabel.text = pSimplePlayer.itemStr[2] + ":" + pSimplePlayer.temValue[2];
            // self.anGangLabel.text = pSimplePlayer.itemStr[3] + ":" + pSimplePlayer.temValue[3];

            // if (MJGameHandler.roomOverHasZhongMa()) {
            //     ViewUtil.addChild(self.textInfoGroup, self.zhongMaLabel);
            //     self.zhongMaLabel.text = "中鸟次数：" + pSimplePlayer.temValue[4];
            // } else {
            //     ViewUtil.removeChild(self.textInfoGroup, self.zhongMaLabel);
            // }
            this.initScroller(pSimplePlayer);

            //设置分数
            let vScoreText: string;
            if (pSimplePlayer.score > 0) {
                // self._scoreBitmapText.font = RES.getRes("game_score_fnt");
                vScoreText = "+" + pSimplePlayer.score;
            } else {
                // self._scoreBitmapText.font = RES.getRes("game_score_gray_fnt");
                vScoreText = "" + pSimplePlayer.score;
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

        }

        /** 初始化文本显示 */
        private initScroller(data: VipRoomOverPlayer) {
            let arr = [];
            let textArr = data.itemStr;
            let valueArr = data.temValue;
            textArr.forEach((x, index) => {
                arr.push(x + ":" + valueArr[index]);
            });
            this.dataGroup.dataProvider = new eui.ArrayCollection(arr);
            this.dataGroup.itemRenderer = MahjongRoomOverItemTextItem;
            this.scroller.viewport = this.dataGroup;
        }

        /** 从显示列表移除时清除头像*/
        public clearHeadImg() {
            this.headImg.source = null;
            this.headImg.bitmapData = null;
        }
    }
}