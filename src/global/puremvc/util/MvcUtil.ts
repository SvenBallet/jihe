/**
 * 
 * @Name:  Suduku - MvcUtil
 * @Description:  MvcUtil
 * @Create: DerekWu on 2015/5/26 16:27
 * @Version: V1.0
 */
module FL {
    export class MvcUtil {

        private static readonly FACADE:puremvc.Facade = AppFacade.getInstance();

        /**
         * 请求服务器的指令（同步）
         * @param pCmd 指令号
         * @param pParamObj 参数对象，请简单创建，举例：{playerId:1111223, builId:1233, name:"名字"}
         */
        // public static reqSync(pCmd:string, pParamObj:Object):void {
        //     var vReqBoby = {c:pCmd,b:pParamObj};
        //     this.Facade.sendNotification(AppModule.L_SYNC_REQ_CMD, vReqBoby);
        // }

        /**
         * 请求服务器的指令（异步）
         * @param pCmd 指令号
         * @param pParamObj 参数对象，请简单创建，举例：{playerId:1111223, builId:1233, name:"名字"}
         */
        // public static reqAsyn(pCmd:string, pParamObj:Object):void {
        //     var vReqBoby = {c:pCmd,b:pParamObj};
        //     this.Facade.sendNotification(AppModule.L_ASYN_REQ_CMD, vReqBoby);
        // }

        /**
         * 添加界面
         * @param pView
         */
        public static addView(pView:any):void {
            this.FACADE.sendNotification(AppModule.APP_ADD_VIEW, pView);
        }

        /**
         * 删除界面
         * @param pView
         */
        public static delView(pView:any):void {
            this.FACADE.sendNotification(AppModule.APP_DEL_VIEW, pView);
        }

        /**
         * 发送内部逻辑指令
         * @param pCmd
         * @param pData
         */
        public static send(pCmd:string, pData?:any):void {
            this.FACADE.sendNotification(pCmd, pData);
        }

        /**
         * 注册Mediator
         * @param pMediator
         */
        public static regMediator(pMediator: puremvc.IMediator):void {
            this.FACADE.registerMediator(pMediator);
        }

        /**
         * 删除Mediator
         * @param mediator
         */
        public static delMediator(pMediatorName: string):puremvc.IMediator {
            return this.FACADE.removeMediator(pMediatorName);
        }

    }
}