module FL {

    export class MJGameChatViewMediator extends puremvc.Mediator implements puremvc.IMediator {

        public static readonly NAME: string = "MJGameChatViewMediator";

        public vView: MJGameChatView = this.viewComponent;

        constructor(pView: MJGameChatView) {
            super(MJGameChatViewMediator.NAME, pView);
            let self = this;
            pView.delGroup.addEventListener(egret.TouchEvent.TOUCH_TAP, self.closeView, self);
            pView.faceBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, self.changeFaceView, self);
            pView.textBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, self.changeTextView, self);
            pView.submitBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, self.sendText, self);

            self.addFaceGroupEventListener();
            self.addTextGroupEventListener();
        }

        private closeView(): void {
            MvcUtil.delView(this.viewComponent);
        }

        /**
         * 切换到表情面板
         * @param {egret.Event} e
         */
        private changeFaceView(e: egret.Event): void {
            let self = this;
            self.vView.faceBtn.source = MJGameChatView.FACE_CHOSEN;
            self.vView.textBtn.source = MJGameChatView.TEXT_UNCHOSEN;
            self.vView.faceImg.source = MJGameChatView.FACE_IMG_CHOSEN;
            self.vView.textImg.source = MJGameChatView.TEXT_IMG_UNCHOSEN;
            self.vView.arrowImg.y = 148;
            self.vView.faceGroup.visible = true;
            self.vView.textGroup.visible = false;
        }

        /**
         * 切换到文字面板
         * @param {egret.Event} e
         */
        private changeTextView(e: egret.Event): void {
            let self = this;
            self.vView.textBtn.source = MJGameChatView.TEXT_CHOSEN;
            self.vView.faceBtn.source = MJGameChatView.FACE_UNCHOSEN;
            self.vView.faceImg.source = MJGameChatView.FACE_IMG_UNCHOSEN;
            self.vView.textImg.source = MJGameChatView.TEXT_IMG_CHOSEN;
            self.vView.arrowImg.y = 470;
            self.vView.faceGroup.visible = false;
            self.vView.textGroup.visible = true;
        }

        /**
         * 给表情组的每个表情添加点击事件
         */
        private addFaceGroupEventListener(): void {
            let self = this;
            let cArr = self.vView.faceImgGroup.$children;
            let cArrLength = cArr.length;
            for (let i = 0; i < cArrLength; i++) {
                cArr[i].addEventListener(egret.TouchEvent.TOUCH_TAP, self.sendFace, self);
            }
        }

        /**
         * 给文字组的每条文字添加点击事件
         */
        private addTextGroupEventListener(): void {
            let self = this;
            let cArr = self.vView.textLabelGroup.$children;
            let cArrLength = cArr.length;
            for (let i = 0; i < cArrLength; i++) {
                cArr[i].addEventListener(egret.TouchEvent.TOUCH_TAP, self.sendQuickText, self);
            }
        }

        /**
         * 发送表情
         * @param {egret.Event} e
         */
        private sendFace(e: egret.Event): void {
            let fType = e.currentTarget.name;
            let gt = GameConstant.CURRENT_GAMETYPE;
            let vTalkingInGameMsg;
            let ack;
            if (gt == EGameType.MJ) {
                vTalkingInGameMsg = new TalkingInGameMsg();
                ack = MsgCmdConstant.MSG_TALKING_IN_GAME;

            } else if (gt == EGameType.RF || gt == EGameType.MAHJONG) {
                vTalkingInGameMsg = new NewTalkingInGameMsg();
                ack = MsgCmdConstant.MSG_NEW_TALKING_IN_GAME_ACK;
            }
            vTalkingInGameMsg.msgNo = fType;
            vTalkingInGameMsg.msgType = 1;
            vTalkingInGameMsg.playerPos = GameConstant.CURRENT_HANDLE.getTablePos(PZOrientation.DOWN);
            ServerUtil.sendMsg(vTalkingInGameMsg, ack);
            this.closeView();
            console.log(vTalkingInGameMsg);

        }

        /**
         * 发送快捷文字
         * @param {egret.Event} e
         */
        private sendQuickText(e: egret.Event): void {
            let tType = e.currentTarget.name;
            let gt = GameConstant.CURRENT_GAMETYPE;
            let vTalkingInGameMsg;
            let ack;
            if (gt == EGameType.MJ) {
                vTalkingInGameMsg = new TalkingInGameMsg();
                ack = MsgCmdConstant.MSG_TALKING_IN_GAME;

            } else if (gt == EGameType.RF || gt == EGameType.MAHJONG) {
                vTalkingInGameMsg = new NewTalkingInGameMsg();
                ack = MsgCmdConstant.MSG_NEW_TALKING_IN_GAME_ACK;
            }
            vTalkingInGameMsg.msgNo = tType;
            vTalkingInGameMsg.msgType = 0;
            vTalkingInGameMsg.playerPos = GameConstant.CURRENT_HANDLE.getTablePos(PZOrientation.DOWN);
            ServerUtil.sendMsg(vTalkingInGameMsg, ack);
            this.closeView();
            console.log(vTalkingInGameMsg);

        }

        /**
         * 发送文字
         * @param {egret.Event} e
         */
        private sendText(e: egret.Event): void {
            let textCon: string = this.vView.inputText.text;
            if (!textCon || textCon == "") {
                PromptUtil.show("发送的内容不能为空", PromptType.ERROR);
                return;
            }
            // let vTalkingInGameMsg = new TalkingInGameMsg();
            let gt = GameConstant.CURRENT_GAMETYPE;
            let vTalkingInGameMsg;
            let ack;
            if (gt == EGameType.MJ) {
                vTalkingInGameMsg = new TalkingInGameMsg();
                ack = MsgCmdConstant.MSG_TALKING_IN_GAME;

            } else if (gt == EGameType.RF || gt == EGameType.MAHJONG) {
                vTalkingInGameMsg = new NewTalkingInGameMsg();
                ack = MsgCmdConstant.MSG_NEW_TALKING_IN_GAME_ACK;
            }
            vTalkingInGameMsg.msgText = textCon;
            vTalkingInGameMsg.msgType = 2;
            vTalkingInGameMsg.playerPos = GameConstant.CURRENT_HANDLE.getTablePos(PZOrientation.DOWN);
            // ServerUtil.sendMsg(vTalkingInGameMsg, MsgCmdConstant.MSG_TALKING_IN_GAME);
            ServerUtil.sendMsg(vTalkingInGameMsg, ack);
            this.vView.inputText.text = "";

            this.closeView();
            console.log(vTalkingInGameMsg);

        }


    }
}