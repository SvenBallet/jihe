module FL {

    export class ActivityKaifangAwardViewMediator extends puremvc.Mediator implements puremvc.IMediator {

        //注册到pureMvc中的名字，不能重复，否则会覆盖
        public static readonly NAME:string = "ActivityKaifangAwardViewMediator";

        public vItem:ActivityKaifangAwardView = this.viewComponent;

        constructor (pView:ActivityKaifangAwardView) {
            super(ActivityKaifangAwardViewMediator.NAME, pView);
            let self = this;
            pView.createRoom.addEventListener(egret.TouchEvent.TOUCH_TAP, self.createRoom, self);
        }



        private createRoom(e:egret.Event):void{
            MvcUtil.addView(new DelLayerView(ViewLayerEnum.BOTTOM_ONLY));
            //进入创建游戏界面
            MvcUtil.addView(new LobbyCreateGameView());
        }

    }
}