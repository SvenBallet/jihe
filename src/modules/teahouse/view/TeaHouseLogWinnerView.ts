module FL {
    /** 茶楼战绩---大赢家页面 */
    export class TeaHouseLogWinnerView extends eui.Component {
        /** 一键清除 */
        private removeAllBtn: GameButton;

        /** 数据显示组 */
        protected scroller: eui.Scroller;
        protected dataGroup: eui.DataGroup;
        /** 显示数据源 */
        protected arrCollection: eui.ArrayCollection;

        /** 数据源 */
        protected data: ITHRankingItemData[];

        constructor() {
            super();
            this.left = this.top = this.right = this.bottom = 0;
            this.skinName = "skins.TeaHouseLogWinnerViewSkin";
        }

        protected childrenCreated() {
            let self = this;
            //注册缓动事件
            TouchTweenUtil.regTween(self.removeAllBtn, self.removeAllBtn);
            //注册监听事件
            self.removeAllBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, self.removeAll, self);
            this.dataGroup.useVirtualLayout = false;

            self.initView();
        }

        /** 初始化页面 */
        protected initView() {
            //---test
            // this.data = [];
            // for (let i = 0; i < 10; i++) {
            //     let source = <ITHRankingItemData>{};
            //     source.date = "2018/05/05 10:00:00";
            //     source.head = "";
            //     source.id = "" + i;
            //     source.index = i;
            //     source.name = "张三李四王麻子" + i;
            //     source.score = "积分总和：" + i * 100;
            //     source.win = "大赢家次数：" + i;
            //     this.data.push(source);
            // }

            this.scroller.scrollPolicyH = "off";
            if (!this.arrCollection) this.arrCollection = new eui.ArrayCollection();
            this.dataGroup.dataProvider = this.arrCollection;
            this.dataGroup.itemRenderer = TeaHouseLogWinnerItemView;
            this.scroller.viewport = this.dataGroup;
            this.refreshView(this.data);
            this.handleViewByPower();
            TeaHouseMsgHandle.sendWinnerListMsg();
        };

        /**
       * 根据权限显示页面
       */
        private handleViewByPower() {
            if (TeaHouseData.curPower == ETHPlayerPower.MEMBER) {
                this.removeAllBtn.visible = false;
            } else {
                this.removeAllBtn.visible = true;
            }
        }

        /** 刷新页面 */
        public refreshView(data = this.data) {
            this.data = data;
            this.scroller.viewport.scrollV = 0;
            this.arrCollection.replaceAll(this.data);
            this.dataGroup.validateNow();
        }

        /** 一键清除 */
        private removeAll() {
            let msg = new BigWinnerShowAndOptMsg();
            msg.houseLayerNum = TeaHouseData.curFloor;
            msg.teaHouseId = TeaHouseData.curID;
            msg.optType = BigWinnerShowAndOptMsg.DELETE_ALL_BIG_WINNER;
            ServerUtil.sendMsg(msg, MsgCmdConstant.MSG_BIG_WINNER_SHOW_AND_OPT_ACK);
        }
    }
}