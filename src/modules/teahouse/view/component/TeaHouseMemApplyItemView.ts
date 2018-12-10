module FL {
    /** 茶楼成员---审核成员元素视图 */
    export class TeaHouseMemApplyItemView extends eui.ItemRenderer {
        /** 头像 */
        private headImg: eui.Image;
        /** 昵称 */
        private memberName: eui.Label;
        /** ID */
        private memberID: eui.Label;
        /** 拒绝按钮 */
        private rejectBtn: GameButton;
        /** 同意按钮 */
        private agreeBtn: GameButton;

        /** 数据源 */
        public data: TeaHouseApply;
        constructor() {
            super();
            this.left = this.top = this.right = this.bottom = 0;
            this.skinName = "skins.TeaHouseMemApplyItemViewSkin";
        }

        protected childrenCreated() {
            let self = this;
            //注册缓动事件
            TouchTweenUtil.regTween(self.agreeBtn, self.agreeBtn);
            TouchTweenUtil.regTween(self.rejectBtn, self.rejectBtn);

            //注册监听事件
            self.agreeBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, self.onAgree, self);
            self.rejectBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, self.onReject, self);
            self.initView();
        }

        /**初始化视图 */
        private initView() {
            if (!this.data) return;
            this.memberID.text = "ID:" + this.data.playerIndex;
            this.memberName.text = StringUtil.subStrSupportChinese(this.data.playerName, 10, "..");
            //设置头像
            if (GConf.Conf.useWXAuth) {
                if (this.data.headImageUrl) GWXAuth.setRectWXHeadImg(this.headImg, this.data.headImageUrl);
                else { this.headImg.source = "" };
            }
        }

        /** 同意 */
        private onAgree() {
            if (!this.data) return;
            let msg = new OptTeaHouseApplyMsg();
            msg.applyId = this.data.applyId;
            msg.teaHouseId = this.data.teaHouseId;
            msg.type = 1;
            ServerUtil.sendMsg(msg, MsgCmdConstant.MSG_OPT_TEAHOUSE_APPLY_ACK);
        }

        /** 拒绝 */
        private onReject() {
            if (!this.data) return;
            let msg = new OptTeaHouseApplyMsg();
            msg.applyId = this.data.applyId;
            msg.teaHouseId = this.data.teaHouseId;
            msg.type = 0;
            ServerUtil.sendMsg(msg, MsgCmdConstant.MSG_OPT_TEAHOUSE_APPLY_ACK);
        }

        protected dataChanged() {
            this.initView();
        }
    }
}