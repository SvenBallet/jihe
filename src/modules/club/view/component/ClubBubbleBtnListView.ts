module FL {
    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase - ClubBubbleBtnListView
     * @Description:  按钮弹窗
     * @Create: ArielLiang on 2018/3/13 16:17
     * @Version: V1.0
     */
    export class ClubBubbleBtnListView extends eui.Component {

        public readonly viewLayer: ViewLayerEnum = ViewLayerEnum.POPUP;

        public mgrBtn: GameButton;
        public clubOutBtn: GameButton;
        public memberID: dcodeIO.Long;
        public memberName: string;
        public memberLevel: number;
        public maskImg: eui.Image;
        public flag_index: number = -1;
        public constructor(index: number) {
            super();
            this.skinName = "skins.ClubBubbleBtnListViewSkin";
            this.flag_index = index;
        }

        protected childrenCreated(): void {
            super.childrenCreated();
            let self = this;

            self.initView();
            //注册按钮点击缓动
            TouchTweenUtil.regTween(this.mgrBtn, this.mgrBtn);
            TouchTweenUtil.regTween(this.clubOutBtn, this.clubOutBtn);

            self.mgrBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, self.exeCancelMgr, self);
            self.clubOutBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, self.exeOutOfClub, self);
            self.maskImg.addEventListener(egret.TouchEvent.TOUCH_TAP, self.closeView, self);
        }

        public initView() {
            if (ClubData.vClub.myState != ClubData.CLUB_TYPE_CREATOR) {
                this.mgrBtn.visible = false;
                this.clubOutBtn.y = 12;
            } else {
                this.mgrBtn.visible = true;
                this.clubOutBtn.y = 74;
            }
            if (this.memberLevel === ClubData.CLUB_TYPE_ADMIN) {
                this.mgrBtn.labelDisplay.text = "取消管理员";
            } else if (this.memberLevel === ClubData.CLUB_TYPE_MEMBER) {
                this.mgrBtn.labelDisplay.text = "提升管理员";
            }
        }

        private exeCancelMgr(): void {
            if (this.memberLevel === ClubData.CLUB_TYPE_MEMBER) {
                ReminderViewUtil.showReminderView({
                    hasLeftBtn: true,
                    hasRightBtn: true,
                    leftCallBack: new MyCallBack(this.sentMsg, this, OptMemberMsg.OPT_TYPE_SET_ADMIN),
                    text: "你是否将玩家 " + this.memberName + "提升为管理员？"
                });
            } else if (this.memberLevel === ClubData.CLUB_TYPE_ADMIN) {
                ReminderViewUtil.showReminderView({
                    hasLeftBtn: true,
                    hasRightBtn: true,
                    leftCallBack: new MyCallBack(this.sentMsg, this, OptMemberMsg.OPT_TYPE_CANCEL_ADMIN),
                    text: "你是否将玩家 " + this.memberName + "取消管理员？"
                });
            }
        }

        private exeOutOfClub(): void {
            ReminderViewUtil.showReminderView({
                hasLeftBtn: true,
                hasRightBtn: true,
                leftCallBack: new MyCallBack(this.sentMsg, this, OptMemberMsg.OPT_TYPE_REMOVE),
                text: "你是否将玩家 " + this.memberName + "踢出俱乐部？"
            });
        }

        private sentMsg(operValue: number): void {
            let vOptMemberMsg: OptMemberMsg = new OptMemberMsg();
            vOptMemberMsg.clubId = ClubData.vClub.id;
            vOptMemberMsg.memberId = this.memberID;
            vOptMemberMsg.operationType = operValue;
            ServerUtil.sendMsg(vOptMemberMsg, MsgCmdConstant.MSG_OPT_MEMBER_ACK);
            this.closeView();
        }

        private closeView(): void {
            // this.removeChildren();
            MvcUtil.send(ClubModule.CLUB_SHOW_BUBBLE_VIEW, this.flag_index);
        }
    }
}