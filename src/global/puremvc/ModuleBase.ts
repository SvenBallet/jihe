module FL {
    /**
     * 
     * @Name:  FL - ModuleBase
     * @Description:  //模块的基类
     * @Create: DerekWu on 2017/7/28 21:52
     * @Version: V1.0
     */
    export abstract class ModuleBase {

        /** 代理列表，在 new 的时候初始化 */
        protected _proxys:Array<puremvc.IProxy> = new Array<puremvc.IProxy>();
        /** 指令列表，在 new 的时候初始化 */
        protected _commands:Array<CmdVO> = new Array<CmdVO>();
        /** 服务端令列表，在 new 的时候初始化 */
        protected _serverCmds:Array<ServerCmd> = new Array<ServerCmd>();

        protected constructor() {
            //初始化数据
            this.init();
        }

        /**
         * 初始化
         */
        protected abstract init():void;

        /**
         * 获取模块注册代理类列表，注册或者移除的时候用
         */
        public moduleProxys():Array<puremvc.IProxy> {
            return this._proxys;
        }

        /**
         * 获取注册模块指令列表，注册或者移除的时候用
         */
        public moduleCmdVOs():Array<CmdVO> {
            return this._commands;
        }

        /**
         * 获取注册模块服务端指令处理列表，注册或者移除的时候用
         */
        public serverCmdVOs(): Array<ServerCmd> {
            return this._serverCmds;
        }

        /**
         * 注册完成之后执行
         */
        public afterRegister():void {}

        /**
         * 删除完成之后执行
         */
        public afterDelete():void {}

    }

    // export interface IModule {
    //
    //     /**
    //      * 获取模块注册代理类列表，注册或者移除的时候用
    //      */
    //     moduleProxys():Array<puremvc.IProxy>;
    //
    //     /**
    //      * 获取注册模块指令列表，注册或者移除的时候用
    //      */
    //     moduleCmdVOs():Array<CmdVO>;
    //
    //     /**
    //      * 获取注册模块服务端指令处理列表，注册或者移除的时候用
    //      */
    //     serverCmdVOs():Array<ServerCmdVO>;
    //
    //     /**
    //      * 注册完成之后执行
    //      */
    //     afterRegister():void;
    //
    //
    //     /**
    //      * 删除完成之后执行
    //      */
    //     afterDelete():void;
    //
    // }

}