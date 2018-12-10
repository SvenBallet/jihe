module FL {

    export class ActivityBaseViewMediator extends puremvc.Mediator implements puremvc.IMediator {

        //注册到pureMvc中的名字，不能重复，否则会覆盖
        public static readonly NAME:string = "ActivityBaseViewMediator";

        public vItem:ActivityBaseView = this.viewComponent;

        constructor (pView:ActivityBaseView) {
            super(ActivityBaseViewMediator.NAME, pView);
            let self = this;
            pView.closeGroup.addEventListener(egret.TouchEvent.TOUCH_TAP, self.closeView, self);
            pView.btnList.addEventListener(eui.ItemTapEvent.ITEM_TAP,this.onChooseItem,this);
        }

        private onChooseItem(e:eui.PropertyEvent):void {
            let index =  this.vItem.btnList.selectedIndex;
            this.vItem.loadContentPage(index);
        }
            
        private closeView(e:egret.Event):void {
            MvcUtil.send(LobbyModule.LOBBY_INTO_LOBBY);
        }


    }
}