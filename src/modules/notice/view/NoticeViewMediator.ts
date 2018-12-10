module FL {
    /**
     * 登录界面调停者
     * @Name:  FL - NoticeViewMediator
     * @Company 深圳市天天爱科技有限公司 版权所有
     * @Description:  无详细描述
     * @Create: DerekWu on 2017/8/16 14:30
     * @Version: V1.0
     */
    export class NoticeViewMediator extends puremvc.Mediator implements puremvc.IMediator {

        //注册到pureMvc中的名字，不能重复，否则会覆盖
        public static readonly NAME:string = "NoticeViewMediator";

        constructor (pView:NoticeView) {
            super(NoticeViewMediator.NAME, pView);
            let self = this;
            pView.closeBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, self.closeView, self);
            
        }
            
        private closeView(e:egret.Event):void {
            MvcUtil.delView(this.viewComponent);
        }
    }
}