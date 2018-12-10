module FL {
    /** 茶楼成员---小二管理---添加小二元素视图 */
    export class TeaHouseMemAddWaiterItemView extends eui.ItemRenderer {
        /** 添加按钮 */
        private addBtn: GameButton;
        /** 头像 */
        private headImg: eui.Image;
        /** 昵称 */
        private memberName: eui.Label;
        /** ID */
        private memberID: eui.Label;
        /** 数据源 */
        public data: ITHMemberInfoData;
        constructor() {
            super();
            this.skinName = "skins.TeaHouseMemAddWaiterItemViewSkin";
        }

        protected childrenCreated() {
            let self = this;

            //注册缓动事件
            TouchTweenUtil.regTween(self.addBtn, self.addBtn);

            //注册监听事件
            self.addBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, self.onAdd, self);
            self.initView();
        }

        /** 初始化页面 */
        private initView() {
            if (!this.data) return;
            this.memberID.text = "ID:" + this.data.id;
            this.memberName.text = StringUtil.subStrSupportChinese(this.data.name, 10, "..");
            //设置头像
            if (GConf.Conf.useWXAuth) {
                if (this.data.head) GWXAuth.setRectWXHeadImg(this.headImg, this.data.head);
                else { this.headImg.source = "" };
            }
        }

        /** 添加店小二 */
        private onAdd() {
            ReminderViewUtil.showReminderView({
                hasLeftBtn: true,
                leftCallBack: new MyCallBack(this.sureAdd, this),
                hasRightBtn: true,
                text: "您确定将" + this.memberName.text + "添加成为店小二吗？请谨慎操作"
            })
        }

        /** 确定添加 */
        private sureAdd() {
            let msg = new OptMemberStateMsg();
            msg.teaHouseId = TeaHouseData.curID;
            msg.memberId = this.data.memberID;
            msg.operationType = OptMemberStateMsg.SET_TEAHOUSE_XIAOER;
            console.log(msg);
            console.log(this.data.memberID);
            ServerUtil.sendMsg(msg, MsgCmdConstant.MSG_OPT_TEAHOUSE_MEMBER_ACK);
        }

        protected dataChanged() {
            this.initView();
        }
    }
}