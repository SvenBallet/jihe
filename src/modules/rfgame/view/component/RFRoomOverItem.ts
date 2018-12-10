module FL {
    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase - RFRoomOverItem
     * @Description:  //跑得快房间结束条目
     * @Create: ArielLiang on 2018/4/23 16:26
     * @Version: V1.0
     */
    export class RFRoomOverItem extends eui.Component {
        public bg1:eui.Image;

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
        /** 单局最高分*/
        public huLabel: eui.Label;
        /** 扔出炸弹数*/
        public dianPaoLabel: eui.Label;
        /** 胜利局数*/
        public gongGangLabel: eui.Label;
        /** 失败局数*/
        public anGangLabel: eui.Label;

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
                self._isInit = true;
            }
        }

        /**
         * 重置本条目
         * @param {FL.NewVipRoomOverSettleAccountsMsgAck} pVipRoomCloseMsg
         * @param {FL.VipRoomOverPlayer} roomOverPlayer
         */
        public resetItem(msg: NewVipRoomOverSettleAccountsMsgAck, roomOverPlayer: VipRoomOverPlayer): void {
            let self = this;
            if (!roomOverPlayer) {
                // //不存在，不处理，外部会处理
                // ViewUtil.removeChild(self, self.playerInfoGroup);
                // self.bg1.visible = false;
                return;
            }
            // else {
                // ViewUtil.addChild(self, self.playerInfoGroup);
                // self.bg1.visible = true;
            // }

            //初始化
            self.init();

            //设置头像
            if (GConf.Conf.useWXAuth) {
                GWXAuth.setCircleWXHeadImg(self.headImg, roomOverPlayer.headImgUrl, self.playerInfoGroup, 59+150/2, -7+150/2, (150/2)-10);
            }
            if (!roomOverPlayer.headImgUrl) {
                let circle: egret.Shape = new egret.Shape();
                circle.graphics.beginFill(0xffffff);
                circle.graphics.drawCircle(59+150/2, -7+150/2, (150/2)-10);
                circle.graphics.endFill();
                self.playerInfoGroup.addChild(circle);
                self.headImg.mask = circle;
                let key = "headIcon_" + roomOverPlayer.headImg + "_jpg";
                this.headImg.source = key;
            }

            //是否显示房主标识
            if (msg.creatorPos === roomOverPlayer.tablePos) {
                ViewUtil.addChildBefore(self.playerInfoGroup, self.roomOwnerFlag, self.scoreGroup);
            } else {
                ViewUtil.removeChild(self.playerInfoGroup, self.roomOwnerFlag);
            }

            // 解散者标志
            if (msg.dismissPlayerPos === roomOverPlayer.tablePos) {
                ViewUtil.addChildBefore(self.playerInfoGroup, self.dismissFlag, self.scoreGroup);
            } else {
                ViewUtil.removeChild(self.playerInfoGroup, self.dismissFlag);
            }

            //是否显示大赢家标识，赢的分数必须大于0
            if (msg.winPos === roomOverPlayer.tablePos) {
                ViewUtil.addChildBefore(self.playerInfoGroup, self.winFlag, self.scoreGroup);
            } else {
                ViewUtil.removeChild(self.playerInfoGroup, self.winFlag);
            }

            //玩家名字,需要截断，和牌局里面的差不多
            self.playerName.text = StringUtil.subStrSupportChinese(roomOverPlayer.playerName, 10, "..");
            //玩家Id
            self.playerId.text = "ID:" + roomOverPlayer.playerIndex;

            //设置分数
            let vScoreText: string;
            if (roomOverPlayer.score > 0) {
                vScoreText = "+" + roomOverPlayer.score;
            } else {
                vScoreText = "" + roomOverPlayer.score;
            }

            //改为图片显示分数
            self.scoreGroup.removeChildren();
            let vScoreImageArray: eui.Image[] = MJGameHandler.genScoreImageArrayRed(vScoreText);
            for (let vIndex: number = 0; vIndex < vScoreImageArray.length; ++vIndex) {
                self.scoreGroup.addChild(vScoreImageArray[vIndex]);
            }

            this.initScroller(roomOverPlayer);
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

        // private resetSize(data: VipRoomOverPlayer): void {
        //     let textArr = data.itemStr;
        //     if (textArr.length >= 6) {
        //         this.scroller.height = 180;
        //         this.scoreGroup.y = 328;
        //     } else {
        //         this.scroller.height = 150;
        //         this.scoreGroup.y = 313;
        //     }
        // }

        /** 从显示列表移除时清除头像*/
        public clearHeadImg() {
            this.headImg.source = null;
            this.headImg.bitmapData = null;
        }
    }
}