/**
 * 
 * @Name:  FL - IModuleManager
 * @Description:  模块管理接口
 * @Create: DerekWu on 2016/4/8 16:25
 * @Version: V1.0
 */
module FL {
    export class ModuleManager {

        private static _moduleMap:Map<string, ModuleBase> = new Map<string, ModuleBase>();

        private static _appFacade:AppFacade = AppFacade.getInstance();

        /**
         * 注册模块
         * @param pModuleName
         * @param pModule
         */
        public static regModule(pModuleName:string, pModule:ModuleBase):void {
            this._moduleMap.put(pModuleName, pModule);
            this._appFacade.sendNotification(AppModule.APP_REG_MODULE, pModule);
            ServerMsgUtil.regServerCmd(pModule);
            pModule.afterRegister();
        }

        /**
         * 删除模块，主要是删除模块已经注册的proxys和commonds
         * @param pModuleName
         */
        public static delModule(pModuleName:string):void {
            //不能删除基础模块
            if (pModuleName == AppModule.NAME) return;
            //其他则可以删除
            var vOneModule:ModuleBase = this._moduleMap.remove(pModuleName);
            if (vOneModule) {
                this._appFacade.sendNotification(AppModule.APP_DEL_MODULE, vOneModule);
                ServerMsgUtil.delServerCmd(vOneModule);
                vOneModule.afterDelete();
            }
        }

        /**
         * 获取模块
         * @param pModuleName
         * @returns {IModule}
         */
        public static getModule(pModuleName:string):ModuleBase {
            return this._moduleMap.get(pModuleName);
        }
    }
}