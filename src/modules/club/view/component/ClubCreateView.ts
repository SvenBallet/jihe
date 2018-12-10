module FL {
    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase - ClubCreateView
     * @Description:  创建俱乐部
     * @Create: ArielLiang on 2018/3/10 14:22
     * @Version: V1.0
     */
    export class ClubCreateView extends BaseView {

        //调停者名字，删除界面的时候会自动移除
        public readonly mediatorName: string = "";
        //界面层级，UI框架自动管理
        public readonly viewLayer: ViewLayerEnum = ViewLayerEnum.POPUP;

        public closeGroup: eui.Image;
        public closeBtn: eui.Image;

        /** 确定*/
        public confirmBtn: GameButton;

        /** 俱乐部名称*/
        public titleInput: eui.TextInput;
        /** 公告编辑*/
        public noticeInput: eui.TextInput;

        constructor() {
            super();
            this.verticalCenter = this.horizontalCenter = 0;
            this.skinName = "skins.ClubCreateViewSkin";
        }

        protected childrenCreated(): void {
            super.childrenCreated();
            let self = this;

            self.titleInput.prompt = "请输入俱乐部名称";
            // self.noticeInput.prompt.textColor = 0x8cbec8;
            self.noticeInput.prompt = "请输入公告内容";

            self.noticeInput.textDisplay.multiline = true;
            self.noticeInput.textDisplay.height = 110;

            //注册按钮点击缓动
            TouchTweenUtil.regTween(self.confirmBtn, self.confirmBtn);
            TouchTweenUtil.regTween(self.closeGroup, self.closeBtn);

            self.closeGroup.addEventListener(egret.TouchEvent.TOUCH_TAP, self.closeView, self);
            self.confirmBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, self.saveValue, self);
        }

        /**
         * 关闭界面
         */
        private closeView(): void {
            MvcUtil.send(ClubModule.CLUB_CREATE_CLUB_CLOSE);
            MvcUtil.delView(this);
        }

        public saveValue(): void {
            let nameLen: number = this.titleInput.text.length;
            let contentLen: number = this.noticeInput.text.length;
            if (nameLen === 0) {
                PromptUtil.show("请输入俱乐部名称", PromptType.ALERT);
            } else if (nameLen > 18) {
                PromptUtil.show("俱乐部名称过长", PromptType.ALERT);
            } else if (contentLen > 200) {
                PromptUtil.show("俱乐部公告不能超过200个字符", PromptType.ALERT);
            } else {
                let vCreateClubMsg: CreateClubMsg = new CreateClubMsg();
                vCreateClubMsg.name = this.titleInput.text;
                vCreateClubMsg.notice = this.noticeInput.text;
                ServerUtil.sendMsg(vCreateClubMsg, MsgCmdConstant.MSG_CREATE_CLUB_ACK);
                this.closeView();
            }
        }

    }
}