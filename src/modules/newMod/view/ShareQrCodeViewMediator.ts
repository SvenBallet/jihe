module FL {
    /**
     * 客服界面调停者
     */
    export class ShareQrCodeViewMediator extends puremvc.Mediator implements puremvc.IMediator {

        //注册到pureMvc中的名字，不能重复，否则会覆盖
        public static readonly NAME:string = "ShareQrCodeViewMediator";

        public vView:ShareQrCodeView = this.viewComponent;

        // 分享方式
        public shareRoad: ShareWXRoad = ShareWXRoad.SHARE_SESSION;
        public sharePlatform: SharePlatform = SharePlatform.SHARE_WX;
        public mView: ShareQrCodeView;

        constructor (pView:ShareQrCodeView) {
            super(SetViewMediator.NAME, pView);
            let self = this;
            self.mView = pView;
            pView.closeBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, self.closeView, self);
            pView.shareFriendsBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, ()=>{
                this.shareRoad = ShareWXRoad.SHARE_SESSION;
                this.share();
            }, self);
            pView.shareFriendsBtn0.addEventListener(egret.TouchEvent.TOUCH_TAP, ()=>{
                this.shareRoad = ShareWXRoad.SHARE_TIMELINE;
                this.share();
            }, self);
            pView.shareFriendsBtn1.addEventListener(egret.TouchEvent.TOUCH_TAP, ()=>{
                this.shareRoad = ShareWXRoad.SHARE_SESSION;
                this.sharePlatform = SharePlatform.SHARE_XL;
                this.share();
            }, self);

            Game.CommonUtil.addTapGap(pView.shareFriendsBtn, 3500);
            Game.CommonUtil.addTapGap(pView.shareFriendsBtn0, 3500);
        }
            
        private closeView(e:egret.Event):void {
            MvcUtil.delView(this.viewComponent);
        }

        private share() {
            if (!Game.CommonUtil.isNative) {
                return;
            }

            this.mView.tipsLab.visible = false;
            this.mView.shareTipsLab.visible = true;
            egret.Tween.get(this)
            .wait(2000)
            .call(()=>{
                this.mView.tipsLab.visible = true;
                this.mView.shareTipsLab.visible = false;
            },this)

            let rt:egret.RenderTexture = new egret.RenderTexture;
            rt.drawToTexture(this.mView.qrCodeGro, new egret.Rectangle(0,0,240,340));
            let base64Data = rt.toDataURL("image/jpeg");

            let shareData = new nativeShareData();
            shareData.type = ShareWXType.SHARE_IMG;
            shareData.baseStr = base64Data;
            shareData.road = this.shareRoad + "";
            shareData.platform = this.sharePlatform;
            shareData.origionAppID = ShareAppIDManager.shareAppID;
            NativeBridge.getInstance().mShareData = shareData;

            let jsonData = {
                "eventType": SendNativeMsgType.SEND_NATIVE_SHARE_TO_WX,
                "data": shareData
            }
            NativeBridge.getInstance().sendNativeMessage(JSON.stringify(jsonData));
        }
    }
}