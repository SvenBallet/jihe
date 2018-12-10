module FL {

    /** 茶楼战绩---大赢家元素视图 */
    export class TeaHouseLogWinnerItemView extends eui.ItemRenderer {
        /** 头像 */
        private headImg: eui.Image;
        /** 昵称 */
        private playerName: eui.Label;
        /** ID */
        private playerID: eui.Label;
        /** 排行 */
        private rankLab: eui.Label;
        /** 清除按钮 */
        private removeBtn: GameButton;
        public data: ITHRankingItemData;
        constructor() {
            super();
            this.top = this.right = this.left = this.bottom = 0;
            this.skinName = "skins.TeaHouseLogWinnerItemViewSkin";
        }

        protected childrenCreated() {
            let self = this;
            //注册缓动事件
            TouchTweenUtil.regTween(self.removeBtn, self.removeBtn);
            //注册监听事件
            self.removeBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, self.onRemove, self);
            self.initView();
        }

        /** 初始化页面 */
        private initView() {
            if (!this.data) return;
            this.playerID.text = this.data.id;
            this.playerName.text = StringUtil.subStrSupportChinese(this.data.name, 10, "..");
            this.rankLab.text = "" + this.data.index;
            //设置头像
            if (GConf.Conf.useWXAuth) {
                if (this.data.head) GWXAuth.setRectWXHeadImg(this.headImg, this.data.head);
                else { this.headImg.source = "" };
            }
            this.handleViewByPower();
        }

        /**
         * 根据权限显示页面
         */
        private handleViewByPower() {
            if (TeaHouseData.curPower == ETHPlayerPower.MEMBER) {
                this.removeBtn.visible = false;
            } else {
                this.removeBtn.visible = true;
            }
        }

        /** 清除 */
        private onRemove() {
            let msg = new BigWinnerShowAndOptMsg();
            msg.houseLayerNum = TeaHouseData.curFloor;
            msg.teaHouseId = TeaHouseData.curID;
            msg.optType = BigWinnerShowAndOptMsg.DELETE_BIG_WINNER;
            msg.playerIndex = this.data.id;
            ServerUtil.sendMsg(msg, MsgCmdConstant.MSG_BIG_WINNER_SHOW_AND_OPT_ACK);
        }

        protected dataChanged() {
            this.initView();
        }
    }
}