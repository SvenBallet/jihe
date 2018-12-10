module FL {
    /**
     * 客服界面调停者
     */
    export class CustomerViewMediator extends puremvc.Mediator implements puremvc.IMediator {

        //注册到pureMvc中的名字，不能重复，否则会覆盖
        public static readonly NAME:string = "CustomerViewMediator";

        public vView:CustomerView = this.viewComponent;

        constructor (pView:CustomerView) {
            super(SetViewMediator.NAME, pView);
            let self = this;
            pView.closeBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, self.closeView, self);
            pView.sureBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, self.closeView, self);
            pView.copyBtn1.addEventListener(egret.TouchEvent.TOUCH_TAP, self.copyLab1, self);
            pView.copyBtn2.addEventListener(egret.TouchEvent.TOUCH_TAP, self.copyLab2, self);
        }
            
        private closeView(e:egret.Event):void {
            MvcUtil.delView(this.viewComponent);
        }

        private copyLab1() {
            PromptUtil.show("复制成功", PromptType.SUCCESS);
            let jsonData = {
                "eventType": SendNativeMsgType.SEND_NATIVE_SET_CLIPBOARD,
                "data": {
                            "clipboardStr": this.vView.wxLab1.text
                        }
                }
            NativeBridge.getInstance().sendNativeMessage(JSON.stringify(jsonData));

            MvcUtil.send(CommonModule.COMMON_NATIVE_OPEN_CHOOSE_ROAD);
        }

        private copyLab2() {
            PromptUtil.show("复制成功", PromptType.SUCCESS);
            let jsonData = {
                "eventType": SendNativeMsgType.SEND_NATIVE_SET_CLIPBOARD,
                "data": {
                            "clipboardStr": this.vView.wxLab2.text
                        }
                }
            NativeBridge.getInstance().sendNativeMessage(JSON.stringify(jsonData));

            MvcUtil.send(CommonModule.COMMON_NATIVE_OPEN_CHOOSE_ROAD);
        }
    }
}