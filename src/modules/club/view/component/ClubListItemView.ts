module FL {
    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase - ClubListItemView
     * @Description:  俱乐部列表条目
     * @Create: ArielLiang on 2018/3/7 17:43
     * @Version: V1.0
     */
    export class ClubListItemView extends eui.Component {

        /** 进入俱乐部*/
        public enterBtn: GameButton;

        public vClub: Club;

        public clubTitle: eui.Label;

        public clubID: eui.Label;

        public clubMember: eui.Label;

        /** 是否已加入俱乐部：0：未加入；1：已加入；*/
        public isJoined: number;

        constructor(pClub: Club) {
            super();
            this.verticalCenter = this.horizontalCenter = 0;
            this.skinName = "skins.ClubListItemViewSkin";
            this.vClub = pClub;
        }

        protected childrenCreated(): void {
            super.childrenCreated();
            let self = this;

            self.initView();

            //注册按钮点击缓动
            TouchTweenUtil.regTween(self.enterBtn, self.enterBtn);

            self.enterBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, self.joinClub, self);

        }

        private initView(): void {
            let self = this;
            self.isJoined = self.vClub.myState;
            self.clubTitle.text = self.vClub.name;
            self.clubID.text = "" + self.vClub.id;
            self.clubMember.text = "成员：" + self.vClub.onlineNum + "/" + self.vClub.memberNum;
            if (self.isJoined) {
                self.enterBtn.labelDisplay.text = "进入";
            } else {
                self.enterBtn.labelDisplay.text = "申请加入";
            }
        }

        private joinClub(): void {
            if (this.isJoined) {
                ClubData.vClub = this.vClub;
                MvcUtil.addView(ClubBaseView.getInstance());
            } else {
                let vApplyClubMsg: ApplyClubMsg = new ApplyClubMsg();
                vApplyClubMsg.clubId = parseInt(this.clubID.text);
                ServerUtil.sendMsg(vApplyClubMsg, MsgCmdConstant.MSG_APPLY_CLUB_ACK);
            }

        }
    }
}