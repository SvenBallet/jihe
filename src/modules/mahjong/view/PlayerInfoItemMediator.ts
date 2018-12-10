module FL {

    export class PlayerInfoItemMediator extends puremvc.Mediator implements puremvc.IMediator {

        public static readonly NAME: string = "PlayerInfoItemMediator";

        constructor(pView: PlayerInfoItem) {
            super(PlayerInfoItemMediator.NAME, pView);
            let self = this;
            pView.baseGroup.addEventListener(egret.TouchEvent.TOUCH_TAP, self.closeView, self);
            pView.roseGroup.addEventListener(egret.TouchEvent.TOUCH_TAP, self.sendProsByType, self);
            pView.eggGroup.addEventListener(egret.TouchEvent.TOUCH_TAP, self.sendProsByType, self);
            pView.kissGroup.addEventListener(egret.TouchEvent.TOUCH_TAP, self.sendProsByType, self);
            pView.shoesGroup.addEventListener(egret.TouchEvent.TOUCH_TAP, self.sendProsByType, self);
            pView.cheerGroup.addEventListener(egret.TouchEvent.TOUCH_TAP, self.sendProsByType, self);
            pView.boomGroup.addEventListener(egret.TouchEvent.TOUCH_TAP, self.sendProsByType, self);
        }

        private closeView(e: egret.Event) {
            MvcUtil.delView(this.viewComponent);
        }

        /**
         * 发送道具
         * @param {egret.Event} e 获取道具类型
         */
        private sendProsByType(e: egret.Event) {
            let prosCounter = this.getSendProsNum();
            /**通过点击目标name属性获取道具类型*/

            // let vTalkingInGameMsg = new TalkingInGameMsg();
            let PZOrient: number = this.getPlayerPos();
            if (PZOrient === PZOrientation.DOWN) {
                PromptUtil.show("不能对自己释放道具！", PromptType.ALERT);
                return;
            }

            let pType: number = parseInt(e.currentTarget.name);
            let selfTablePos: number = this.getOwnPos();
            if (prosCounter >= 5) {
                PromptUtil.show("本局使用次数已达上限！", PromptType.ALERT);
                return;
            }

            let gt = GameConstant.CURRENT_GAMETYPE;
            let vTalkingInGameMsg;
            let ack;
            if (gt === EGameType.MJ) {
                vTalkingInGameMsg = new TalkingInGameMsg();
                ack = MsgCmdConstant.MSG_TALKING_IN_GAME;

            } else if (gt === EGameType.RF || gt === EGameType.MAHJONG) {
                vTalkingInGameMsg = new NewTalkingInGameMsg();
                ack = MsgCmdConstant.MSG_NEW_TALKING_IN_GAME_ACK;
                vTalkingInGameMsg.receiverPos = GameConstant.CURRENT_HANDLE.getTablePos(PZOrient);
            }

            vTalkingInGameMsg.msgNo = pType;
            vTalkingInGameMsg.msgType = 4;
            vTalkingInGameMsg.playerPos = selfTablePos;
            vTalkingInGameMsg.unused_0 = GameConstant.CURRENT_HANDLE.getTablePos(PZOrient);
            ServerUtil.sendMsg(vTalkingInGameMsg, ack);
            this.sendProsCounter(prosCounter);
            console.log(vTalkingInGameMsg);
        }

        /**
         * 获取正在浏览的玩家的桌子方位
         * @returns {number}
         */
        private getPlayerPos(): number {
            let PZOrient = parseInt(egret.localStorage.getItem("PlayerInfoOrientation"));
            return PZOrient;
        }

        /**
         * 获取自己的桌子的方位
         * @returns {number}
         */
        private getOwnPos(): number {
            return GameConstant.CURRENT_HANDLE.getTablePos(PZOrientation.DOWN);
        }


        /**
         * 获取已发送的道具次数
         * @returns {number}
         */
        private getSendProsNum(): number {
            let tablePos: number = this.getOwnPos();
            // let sendProsCounter:number = parseInt(egret.localStorage.getItem("sendProsCounter"+tablePos))?parseInt(egret.localStorage.getItem("sendProsCounter"+tablePos)):0;
            return GameConstant.CURRENT_HANDLE.getSendProsCounterNum("sendProsCounter" + tablePos);
        }

        /**
         * 已发送的道具数缓存
         * @param {number}
         */
        private sendProsCounter(count: number): void {
            let tablePos: number = this.getOwnPos();
            GameConstant.CURRENT_HANDLE.addOneSendProsCounterNum("sendProsCounter" + tablePos);
            // egret.localStorage.setItem("sendProsCounter"+tablePos,count+1+"");
        }

    }
}