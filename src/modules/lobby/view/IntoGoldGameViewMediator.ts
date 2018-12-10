module FL {
    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase - IntoGoldGameViewMediator
     * @Description:  //调停者
     * @Create: DerekWu on 2017/11/21 10:44
     * @Version: V1.0
     */
    export class IntoGoldGameViewMediator extends puremvc.Mediator implements puremvc.IMediator {

        public static readonly NAME:string = "IntoGoldGameViewMediator";

        constructor (pView:IntoGoldGameView) {
            super(IntoGoldGameViewMediator.NAME, pView);
            let self = this;
            pView.startGameGroup.addEventListener(egret.TouchEvent.TOUCH_TAP, self.startGame, self);
            pView.closeGroup.addEventListener(egret.TouchEvent.TOUCH_TAP, self.closeView, self);
            pView.wanfaRadioGroup.addEventListener(eui.UIEvent.CHANGE, self.radioChangeHandler, self);
        }

        private startGame(e:egret.Event):void {
            let vView:IntoGoldGameView = (<IntoGoldGameView>this.viewComponent);
            let radioGroup: eui.RadioButtonGroup = vView.wanfaRadioGroup;
            // egret.log(radioGroup.selectedValue);

            // PromptUtil.show(Local.text(1100),"pSucc");


            // let vRequestStartGameMsg:RequestStartGameMsg = new RequestStartGameMsg();
            // vRequestStartGameMsg.roomID = radioGroup.selectedValue;
            // ServerUtil.sendMsg(vRequestStartGameMsg, MsgCmdConstant.MSG_GAME_START_GAME_REQUEST_ACK);

            let vNewIntoGoldGameSceneMsg:NewIntoGoldGameSceneMsg = new NewIntoGoldGameSceneMsg();
            vNewIntoGoldGameSceneMsg.goldGameSceneRoomID = radioGroup.selectedValue;
            ServerUtil.sendMsg(vNewIntoGoldGameSceneMsg, MsgCmdConstant.MSG_SHOW_TIP_MSG_ACK_NEW);
        }

        private closeView(e:egret.Event):void {
            MvcUtil.delView(this.viewComponent);
        }

        private radioChangeHandler(evt:eui.UIEvent):void {
            let radioGroup: eui.RadioButtonGroup = evt.target;
            Storage.setGoldPlayWay(radioGroup.selectedValue);
        }

    }
}