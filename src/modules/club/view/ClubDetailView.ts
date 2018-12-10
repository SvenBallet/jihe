module FL {
    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase - ClubDetailView
     * @Description:  俱乐部详情
     * @Create: HoyeLee on 2018/3/12 18:25:00
     * @Version: V1.0
     */
    export class ClubDetailView extends BaseView {
        //调停者名字，删除界面的时候会自动移除
        public readonly mediatorName: string = "";
        //界面层级，UI框架自动管理
        public readonly viewLayer: ViewLayerEnum = ViewLayerEnum.POPUP;

        /** 关闭组件 */
        public closeGroup: eui.Group;
        public closeBtn: eui.Image;

        /** 俱乐部名称 */
        public clubName: eui.Label;
        /** 俱乐部ID */
        public clubID: eui.Label;
        /** 俱乐部在线成员数 */
        public clubMember: eui.Label;
        /** 俱乐部创始人 */
        public clubLeader: eui.Label;
        /** 俱乐部公告 */
        public clubNotice: eui.Label;

        /** 保存 */
        public confirmBtn: GameButton;
        /** 退出/解散俱乐部 */
        public leaveBtn: GameButton;

        public constructor() {
            super();
            this.verticalCenter = this.horizontalCenter = 0;
            this.skinName = "skins.ClubDetailViewSkin";
        }

        protected childrenCreated(): void {
            super.childrenCreated();
            let self = this;
            self.initView();
            //注册按钮点击缓动
            TouchTweenUtil.regTween(self.closeGroup, self.closeBtn);
            TouchTweenUtil.regTween(self.confirmBtn, self.confirmBtn);
            TouchTweenUtil.regTween(self.leaveBtn, self.leaveBtn);

            /** 注册监听 */
            this.closeGroup.addEventListener(egret.TouchEvent.TOUCH_TAP, self.closeView, self);
            this.confirmBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, self.confirmSave, self);
            this.leaveBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, self.isLeaveClub, self);

        }

        /** 初始化页面 */
        private initView() {
            let vClub: Club = ClubData.vClub;
            this.clubID.text = "ID: " + vClub.id;
            this.clubName.text = "名称: " + vClub.name;
            this.clubLeader.text = "创建者: " + vClub.creatorPlayerName;
            this.clubMember.text = "成员: " + vClub.onlineNum + "/" + vClub.memberNum;
            this.clubNotice.text = vClub.notice;

            //根据权限改变可视内容
            // let vPlayerVO: PlayerVO = LobbyData.playerVO;
            this.leaveBtn.label = "退出俱乐部";
            this.confirmBtn.visible = true;
            this.clubNotice.touchEnabled = true;
            this.clubNotice.multiline = true;
            this.clubNotice.type = egret.TextFieldType.INPUT;
            switch (vClub.myState) {
                case ClubData.CLUB_TYPE_MEMBER:
                    this.confirmBtn.visible = false;
                    this.clubNotice.touchEnabled = false;
                    break;
                case ClubData.CLUB_TYPE_ADMIN:
                    break;
                case ClubData.CLUB_TYPE_CREATOR:
                    this.leaveBtn.label = "解散俱乐部";
                    break;
                default:
                    break;
            }
        }

        /**
         * 保存公告编辑
         */
        private confirmSave() {
            let vClubModifyMsg = new ClubModifyMsg();
            let vClub = ClubData.vClub;
            vClubModifyMsg.clubId = vClub.id;
            vClubModifyMsg.notice = this.clubNotice.text;
            ServerUtil.sendMsg(vClubModifyMsg, MsgCmdConstant.MSG_CLUB_MODIFY_ACK);
        }

        /**
         * 保存公告编辑返回
         */
        public refreshView(msg: ClubModifyMsgAck) {
            let resCode = msg.result;
            switch (resCode) {
                case ClubModifyMsgAck.ERROR:
                    PromptUtil.show("保存失败", PromptType.ERROR);
                    break;
                case ClubModifyMsgAck.SUCCESS:
                    PromptUtil.show("保存成功", PromptType.ERROR);
                    ClubData.vClub.notice = this.clubNotice.text;
                    break;
                case ClubModifyMsgAck.HAS_BAD_WORD:
                    PromptUtil.show("含有敏感词", PromptType.ERROR);
                    break;
                default:
                    break;
            }
            this.clubNotice.text = ClubData.vClub.notice;
        }

        /**
         * 是否退出/解散俱乐部
         */
        private isLeaveClub() {
            var text = (ClubData.vClub.myState == ClubData.CLUB_TYPE_CREATOR) ? "是否解散俱乐部" : "是否退出俱乐部";
            ReminderViewUtil.showReminderView({
                hasLeftBtn: true,
                hasRightBtn: true,
                leftCallBack: new MyCallBack(this.leaveClub, this),
                text: text
            });
        }

        /**
         * 退出/解散俱乐部
         */
        private leaveClub() {
            var msg;
            var cmd;
            let vClub = ClubData.vClub;
            switch (vClub.myState) {
                case ClubData.CLUB_TYPE_MEMBER:
                    msg = new ClubExitMsg();
                    msg.clubId = vClub.id;
                    cmd = MsgCmdConstant.MSG_CLUB_EXIT_ACK;
                    break;

                case ClubData.CLUB_TYPE_ADMIN:
                    msg = new ClubExitMsg();
                    msg.clubId = vClub.id;
                    cmd = MsgCmdConstant.MSG_CLUB_EXIT_ACK;
                    break;

                case ClubData.CLUB_TYPE_CREATOR:
                    msg = new ClubDismissMsg();
                    msg.clubId = vClub.id;
                    cmd = MsgCmdConstant.MSG_CLUB_DISMISS_ACK;
                    break;

                default:
                    break;
            }
            ServerUtil.sendMsg(msg, cmd);
        }

        /**
         * 解散俱乐部结果返回 
         * @param {any} data
         */
        public dismissClubACK(data: ClubDismissMsgAck) {
            let resCode = data.result;
            switch (resCode) {
                case ClubDismissMsgAck.SUCCESS://成功                   
                    MvcUtil.addView(new ClubListView());
                    MvcUtil.send(ClubModule.CLUB_INTO_CLUB);
                    ReminderViewUtil.showReminderView({
                        hasRightBtn: true,
                        rightBtnText: "确定",
                        text: "解散成功"
                    });
                    break;
                case ClubDismissMsgAck.ERROR://错误
                    PromptUtil.show("未知错误", PromptType.ERROR);
                    break;
                case ClubDismissMsgAck.CLUB_NOT_FOUND://俱乐部不存在
                    PromptUtil.show("还有代开房没结束，无法解散俱乐部", PromptType.ERROR);

                    break;
                case ClubDismissMsgAck.HAS_TABLE_ERROR://还有代开房没结束，无法解散俱乐部
                    PromptUtil.show("还有代开房没结束，无法解散俱乐部", PromptType.ERROR);
                    break;
                case ClubDismissMsgAck.HAS_DIAMOND_ERROR://还有钻石，无法解散俱乐部
                    PromptUtil.show("还有钻石，无法解散俱乐部", PromptType.ERROR);
                    break;
                case ClubDismissMsgAck.PRIV_ERROR://权限不足，无法解散俱乐部
                    PromptUtil.show("权限不足，无法解散俱乐部", PromptType.ERROR);
                    break;
            }
        }

        /**
         * 退出俱乐部返回
         * @param {any} data
         */
        public exitClubACK(data: any) {
            let resCode = data.result;
            switch (resCode) {
                case ClubExitMsgAck.SUCCESS://成功
                    MvcUtil.addView(new ClubListView());
                    MvcUtil.send(ClubModule.CLUB_INTO_CLUB);
                    ReminderViewUtil.showReminderView({
                        hasRightBtn: true,
                        rightBtnText: "确定",
                        text: "退出成功"
                    });
                    break;

                case ClubExitMsgAck.ERROR://错误
                    PromptUtil.show("未知错误", PromptType.ERROR);
                    break;

                case ClubExitMsgAck.CLUB_NOT_FOUND://俱乐部不存在
                    PromptUtil.show("俱乐部不存在", PromptType.ERROR);
                    break;

                case ClubExitMsgAck.CREATOR_CAN_NOT_EXIT://创建者无法退出
                    PromptUtil.show("创建者无法退出", PromptType.ERROR);

                    break;
                default:
                    break;
            }
        }

        /**
         * 关闭界面
         */
        private closeView(): void {
            MvcUtil.delView(this);
        }
    }
}