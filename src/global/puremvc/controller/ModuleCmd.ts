/**
 * 
 * @Name:  FL - ModuleCmd
 * @Description:  模块指令
 * @Create: DerekWu on 2016/4/8 18:06
 * @Version: V1.0
 */
module FL {
    export class ModuleCmd extends puremvc.SimpleCommand implements puremvc.ICommand {

        public constructor() {
            super();
        }

        public execute(pNotification:puremvc.INotification):void {
            let vModule:ModuleBase = pNotification.getBody();
            switch(pNotification.getName()) {
                case AppModule.APP_REG_MODULE:{
                    this.regModule(vModule);
                    break;
                }
                case AppModule.APP_DEL_MODULE:{
                    this.delModule(vModule);
                    break;
                }
            }
        }

        /**
         * 注册模块，注册代理和指令，注意：重复的代理和指令抛出异常
         * @param pModule
         */
        private regModule(pModule:ModuleBase):void {
            let vAppFacade:puremvc.IFacade = this.facade();
            let vModuleProxys:Array<puremvc.IProxy> = pModule.moduleProxys();
            for (let i=vModuleProxys.length-1; i>=0; i--) {
                let vOneProxy:puremvc.IProxy = vModuleProxys[i];
                if (vAppFacade.hasProxy(vOneProxy.getProxyName())) {
                    throw new Error("### proxy name="+vOneProxy.getProxyName() + " is exists");
                } else {
                    vAppFacade.registerProxy(vOneProxy);
                }
            }
            let vModuleCmdVOs:Array<CmdVO> = pModule.moduleCmdVOs();
            for (let i=vModuleCmdVOs.length-1; i>=0; i--) {
                let vOneCmdVO:CmdVO = vModuleCmdVOs[i];
                if (vAppFacade.hasCommand(vOneCmdVO.key)) {
                    throw new Error("### cmd name="+vOneCmdVO.key + " is exists");
                } else {
                    vAppFacade.registerCommand(vOneCmdVO.key, vOneCmdVO.command);
                }
            }
            // pModule.afterRegister();
        }

        /**
         * 删除模块，删除代理和指令
         * @param pModule
         */
        private delModule(pModule:ModuleBase):void {
            let vAppFacade:puremvc.IFacade = this.facade();
            let vModuleProxys:Array<puremvc.IProxy> = pModule.moduleProxys();
            for (let i=vModuleProxys.length-1; i>=0; i--) {
                vAppFacade.removeProxy(vModuleProxys[i].getProxyName());
            }
            let vModuleCmdVOs:Array<CmdVO> = pModule.moduleCmdVOs();
            for (let i=vModuleCmdVOs.length-1; i>=0; i--) {
                let vOneCmdVO:CmdVO = vModuleCmdVOs[i];
                vAppFacade.removeCommand(vOneCmdVO.key);
            }
            // pModule.afterDelete();
        }

    }
}