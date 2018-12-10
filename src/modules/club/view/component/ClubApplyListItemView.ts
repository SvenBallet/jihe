module FL {
    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase - ClubApplyListItemView
     * @Description: 申请列表
     * @Create: HoyeLee on 2018/3/13 18:18
     * @Version: V1.0
     */
    export class ClubApplyListItemView extends eui.ItemRenderer {
        /** 昵称 */
        public memberName: eui.Label;
        /** ID */
        public memberID: eui.Label;
        /** 申请时间 */
        public applyTime: eui.Label;
        /** 同意 */
        public agreeBtn: GameButton;
        /** 拒绝 */
        public refuseBtn: GameButton;

        public data: ClubApply;

        public constructor() {
            super();
            // this.verticalCenter = this.horizontalCenter = 0;
            this.left = this.right = 0;
            this.top = this.bottom = 0;
            this.skinName = "skins.ClubApplyListViewItemSkin";
        }

        protected childrenCreated(): void {
            super.childrenCreated();
            let self = this;
            self.initView();

            //注册按钮点击缓动
            TouchTweenUtil.regTween(self.agreeBtn, self.agreeBtn);
            TouchTweenUtil.regTween(self.refuseBtn, self.refuseBtn);

            //注册事件监听
            self.agreeBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, self.opperationApply, self);
            self.refuseBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, self.opperationApply, self);
        }

        /**
         * 操作，同意或拒绝
         * @param {egret.TouchEvenr} e
         */
        private opperationApply(e: egret.TouchEvent) {
            if (!this.data) return;
            let type;
            if (e.currentTarget == this.agreeBtn) {
                type = OptApplyListMsg.AGREE;
            } else {
                type = OptApplyListMsg.REJECT;
            }
            let msg = new OptApplyListMsg();
            msg.applyId = this.data.applyId;
            msg.clubId = this.data.clubId;
            msg.type = type;
            ServerUtil.sendMsg(msg, MsgCmdConstant.MSG_OPT_APPLY_LIST);
        }

        private initView() {
            if (!this.data) return;
            this.memberID.text = "" + this.data.playerIndex;
            this.memberName.text = StringUtil.subStrSupportChinese(this.data.playerName, 6, "...");
            this.applyTime.text = StringUtil.formatDate("yyyy-MM-dd", new Date(this.data.applyTime));
        }

        protected dataChanged() {
            this.initView();
        }
    }

}