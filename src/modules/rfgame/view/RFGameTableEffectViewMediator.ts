module FL {
    export class RFGameTableEffectViewMediator extends puremvc.Mediator implements puremvc.IMediator {
        public static readonly NAME: string = "RFGameTableEffectViewMediator";

        constructor(pView: RFGameTableEffectView) {
            super(RFGameTableEffectViewMediator.NAME, pView);
        }

        /**
        * 感兴趣的通知指令
        * @returns {Array<any>}
        */
        public listNotificationInterests(): Array<any> {
            return [
                RFGameModule.GAME_SEND_PROS,
                RFGameModule.GAME_SEND_FACE,
                RFGameModule.GAME_SEND_QUICK_TEXT,
                RFGameModule.GAME_SEND_TEXT,
                RFGameModule.RFGAME_PLAY_CARD_ANI,
                CommonModule.COMMON_SHOW_TALK_ANI_REALY,
                CommonModule.COMMON_HIDE_TALK_ANI_REALY
            ];
        }

        /**
         * 处理通知
         * @param {puremvc.INotification} pNotification
         */
        public handleNotification(pNotification: puremvc.INotification): void {
            let data: any = pNotification.getBody();
            switch (pNotification.getName()) {
                case RFGameModule.GAME_SEND_PROS:
                    this.sendPros(data);
                    break;
                case RFGameModule.GAME_SEND_FACE:
                    this.sendFace(data);
                    break;
                case RFGameModule.GAME_SEND_QUICK_TEXT:
                    this.sendQuickText(data);
                    break;
                case RFGameModule.GAME_SEND_TEXT:
                    this.sendText(data);
                    break;
                case RFGameModule.RFGAME_PLAY_CARD_ANI:
                    this.getView().playAni(data);
                    break;
                case CommonModule.COMMON_SHOW_TALK_ANI_REALY: {
                    console.log("WTF=="+data.scaleX+"x=="+data.x+"y=="+data.y);
                    this.startPlayNativeVoice(data);
                    break;
                }
                case CommonModule.COMMON_HIDE_TALK_ANI_REALY: {
                    this.stopPlayNativeVoice();
                    break;
                }
            }
        }

        /**
        * 快捷文字
        * @param {FL.TalkingInGameMsg} msg
        */
        private sendQuickText(msg): void {
            let sPZOrientation: PZOrientation = RFGameHandle.getPZOrientation(msg.playerPos);
            this.getView().playQuickText(sPZOrientation, msg.msgNo);
        }


        /**
         * 表情
         * @param {FL.TalkingInGameMsg} msg
         */
        private sendFace(msg): void {
            let sPZOrientation: PZOrientation = RFGameHandle.getPZOrientation(msg.playerPos);
            this.getView().playFace(sPZOrientation, msg.msgNo);
        }

        /**
         * 文字
         * @param {FL.TalkingInGameMsg} msg
         */
        private sendText(msg): void {
            let sPZOrientation: PZOrientation = RFGameHandle.getPZOrientation(msg.playerPos);
            this.getView().playText(sPZOrientation, msg.msgText);
        }

        /**
        * 互动表情
        * @param {Object} data
        */
        private sendPros(data: any): void {
            let msg: NewTalkingInGameMsgAck = data.msg;
            let tType = data.tType;
            let hudongNum = msg.msgNo + 1;
            let startPZOrientation: PZOrientation = RFGameHandle.getPZOrientation(msg.playerPos);
            let endPZOrientation: PZOrientation = RFGameHandle.getPZOrientation(msg.receiverPos);
            //送出头像位置
            let startX = RFGameTableEffectView.getInstance().getIconOrientation(startPZOrientation).x,
                startY = RFGameTableEffectView.getInstance().getIconOrientation(startPZOrientation).y;
            //送达头像位置
            let endX = RFGameTableEffectView.getInstance().getIconOrientation(endPZOrientation).x;
            let endY = RFGameTableEffectView.getInstance().getIconOrientation(endPZOrientation).y;
            //发送道具
            this.getView().sendProps([startX, startY], [endX, endY], tType, hudongNum);
        }

        public getView(): RFGameTableEffectView {
            return <RFGameTableEffectView>this.viewComponent;
        }

        private startPlayNativeVoice(data: any) {
            if (Game.CommonUtil.isNative) {
                console.log("getData=="+data.scaleX+"x=="+data.x+"y=="+data.y);
                let talkAni: TalkAni = this.getView().getNativeTalkAni()
                talkAni.scaleX = data.scaleX;
                talkAni.x = data.x;
                talkAni.y = data.y;

                talkAni.showPlay();
            }
        }

        private stopPlayNativeVoice() {
            if (Game.CommonUtil.isNative) {
                this.getView().getNativeTalkAni().hide();
            }
        }
    }
}