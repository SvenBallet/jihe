/**
 * 
 * @Name:  FL - RootViewMediator
 * @Description:  //root界面调停者，你懂的
 * @Create: DerekWu on 2016/4/8 18:29
 * @Version: V1.0
 */
module FL {
    export class RootViewMediator extends puremvc.Mediator implements puremvc.IMediator {

        public static readonly NAME:string = "RootViewMediator";

        /** 单例 */
        private static _onlyOne:RootViewMediator;

        private constructor(root:eui.UILayer) {
            let vRootView:RootView = RootView.getInstance(root);
            super(RootViewMediator.NAME, vRootView);
        }

        public static getInstance(root:eui.UILayer):RootViewMediator {
            if (!this._onlyOne) {
                this._onlyOne = new RootViewMediator(root);
            }
            return this._onlyOne;
        }

        // private get rootView():RootView {
        //     return <RootView>this.viewComponent;
        // }

        public listNotificationInterests():Array<any> {
            return [
                AppModule.APP_ADD_VIEW,
                AppModule.APP_DEL_VIEW
            ];
        }

        public handleNotification(pNotification:puremvc.INotification):void{
            var data:any = pNotification.getBody();
            switch(pNotification.getName()){
                case AppModule.APP_ADD_VIEW:{  //添加显示对象
                    (<RootView>this.viewComponent).fl_addElement(data);
                    break;
                }
                case AppModule.APP_DEL_VIEW:{  //删除显示对象
                    (<RootView>this.viewComponent).fl_removeElement(data);
                    break;
                }
            }
        }

    }
}