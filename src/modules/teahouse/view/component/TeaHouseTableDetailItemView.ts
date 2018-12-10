module FL {
    /** 茶楼桌子详情元素视图 */
    export class TeaHouseTableDetailItemView extends eui.ItemRenderer {
        public headIcon:eui.Image;
        public headIconMask:eui.Image;
        public headStateImg:eui.Image;
        public removeBtn:eui.Image;
        public nameLab:eui.Label;
        public idLab:eui.Label;

        /** 数据源 */
        public data: ITHPlayerInfo;
        /** 状态资源 */
        public stateImgArr: Array<string> = ["th_detail_state_break_png", "th_detail_state_free_png", "th_detail_state_ing_png"];

        constructor() {
            super();
            this.skinName = skins.TeaHouseTableDetailItemView_n;
        }

        protected childrenCreated() {
            this.headIcon.mask = this.headIconMask;
            this.removeBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.removePlayer, this);

            this.initView();
        }

        /** 初始化页面 */
        private initView() {
            if (!this.data) return;
            if (!this.data.info) {
                this.headIcon.source = "";
                this.headIcon.bitmapData = null;
                this.headStateImg.source = this.stateImgArr[1];
                this.removeBtn.visible = false;
                this.nameLab.text = "";
                this.idLab.text = "";
            }
            else {
                let player:GamePlayer = this.data.info;
                if (GConf.Conf.useWXAuth) {
                    GWXAuth.setRectWXHeadImg(this.headIcon, player.headImageUrl);
                }
                this.headStateImg.source = player.isLinkBreken ? this.stateImgArr[0] : this.stateImgArr[2];
                if (TeaHouseData.curPower == ETHPlayerPower.CREATOR || TeaHouseData.curPower == ETHPlayerPower.MANAGER) {
                    this.removeBtn.visible = true;
                }
                else {
                    this.removeBtn.visible = false;
                }
                this.nameLab.text = StringUtil.subStrSupportChinese(player.playerName, 12, "...");
                this.idLab.text = "ID:" + player.playerIndex;
            }
        }

        protected dataChanged() {
            this.initView();
        }

        /**
         * 移除玩家
         */
        private removePlayer() {
            if (TeaHouseData.curPower === ETHPlayerPower.MEMBER || TeaHouseData.curPower === ETHPlayerPower.ILLEGAL) {
                PromptUtil.show("无权限", PromptType.ERROR);
                return;
            }
            ReminderViewUtil.showReminderView({
                hasLeftBtn: true,
                leftCallBack: new MyCallBack(this.confirmRemove, this),
                hasRightBtn: true,
                text: "确定移出玩家吗？"
            })
        }

        private confirmRemove() {
            if (this.data && this.data.info && this.data.info.playerIndex) {
                MvcUtil.send(TeaHouseModule.TH_DETAIL_REMOVE_PLAYER, this.data.info.playerIndex);
            }
        }
    }
}