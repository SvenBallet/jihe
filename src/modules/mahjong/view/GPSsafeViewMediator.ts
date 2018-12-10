module FL {

    export class GPSsafeViewMediator extends puremvc.Mediator implements puremvc.IMediator {

        public static readonly NAME:string = "GPSsafeViewMediator";

        constructor (pView:GPSsafeView) {
            super(GPSsafeViewMediator.NAME, pView);
            let self = this;
            pView.closeBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, self.closeView, self);
        }

        private closeView(e:egret.Event){
            MvcUtil.delView(this.viewComponent);
        }

    }
}