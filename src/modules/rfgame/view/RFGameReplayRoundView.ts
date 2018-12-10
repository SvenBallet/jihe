module FL {

    /**
     * 麻将切换回放局数界面
     */
    export class RFGameReplayRoundView extends BaseView {

        /** 单例 */
        private static _onlyOne: RFGameReplayRoundView;

        //调停者名字，删除界面的时候会自动移除
        public readonly mediatorName: string;
        //界面层级，UI框架自动管理
        public readonly viewLayer: ViewLayerEnum = ViewLayerEnum.BOTTOM;

        public nextBtn:eui.Image;
        public lastBtn:eui.Image;
        public nextImg:eui.Image;
        public lastImg:eui.Image;
        public roundLabel:eui.Label;

        private constructor() {
            super();
            this.bottom = 40;
            this.right = 20;
            this.skinName = skins.MJGameReplayRoundViewSkin;
            // 可触摸, 这里已经屏蔽了所有向下的事件
            this.touchEnabled = true;
        }

        public static getInstance():RFGameReplayRoundView {
            if (!this._onlyOne) {
                this._onlyOne = new RFGameReplayRoundView();
            }
            return this._onlyOne;
        }

        protected createChildren():void {
            super.childrenCreated();
            let self = this;
            //注册按钮点击缓动
            TouchTweenUtil.regTween(self.nextBtn, self.nextImg);
            TouchTweenUtil.regTween(self.lastBtn, self.lastImg);
            //注册按钮点击事件
            self.nextBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, self.nextRound, self);
            self.lastBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, self.lastRound, self);
        }

        /** 添加到界面以后框架自动调用 */
        protected onAddView():void {
            this.roundLabel.text = "第" + RFGameData.requestStartGameMsgAck.currPlayCount + "局";
        }

        private nextRound() {
            let index = RFGameData.requestStartGameMsgAck.currPlayCount + 1;
            this.getPlayerGameLog(index);
        }

        private lastRound() {
            let index = RFGameData.requestStartGameMsgAck.currPlayCount - 1;
            if (index > 0) {
                this.getPlayerGameLog(index);
            }
        }

        private getPlayerGameLog(handIndex:number) {
            let vGetPlayerGameLogMsg:GetPlayerGameLogMsg = new GetPlayerGameLogMsg();
            vGetPlayerGameLogMsg.gameTableID = RFGameLogReplay.gameTableID;
            vGetPlayerGameLogMsg.handIndex = handIndex;
            vGetPlayerGameLogMsg.date = RFGameLogReplay.dateStr.substr(0,10).replace(/-/g,"");
            ServerUtil.sendMsg(vGetPlayerGameLogMsg);
        }
    }

}