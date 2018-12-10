/**
 * 
 * @Name:  FL - AppCmd
 * @Description:  App模块指令
 * @Create: DerekWu on 2016/4/8 18:04
 * @Version: V1.0
 */
module FL {
    export class AppCmd extends puremvc.SimpleCommand implements puremvc.ICommand {

        public constructor() {
            super();
        }

        public execute(pNotification:puremvc.INotification):void {
            let appProxy:AppProxy = <AppProxy>this.facade().retrieveProxy(AppProxy.NAME);
            var data:any = pNotification.getBody();
            // switch(pNotification.getName()) {
            //    case AppModule.L_SEND_MSG:{
            //        // applicationProxy.requestGet(data);
            //        break;
            //    }
            // }
        }

    }
}