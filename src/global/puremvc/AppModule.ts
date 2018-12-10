/**
 * 
 * @Name:  FL - AppModule
 * @Description:  //基础模块
 * @Create: DerekWu on 2016/4/8 16:27
 * @Version: V1.0
 */
module FL {
    export class AppModule extends ModuleBase {

        /** 模块名 */
        public static readonly NAME = "AppModule";
        /** 单例 */
        private static instance:AppModule;

        private constructor() {
            super();
        }

        public static getInstance():AppModule {
            if (!this.instance) {
                this.instance = new AppModule();
            }
            return this.instance;
        }

        /** =============指令开始================= */
        /** 注册模块客户端逻辑指令 */
        public static readonly APP_REG_MODULE:string = "APP_REG_MODULE";
        /** 删除模块客户端逻辑指令 */
        public static readonly APP_DEL_MODULE:string = "APP_DEL_MODULE";

        /** socket 准备完毕，关闭，发生错误的指令 */
        public static readonly APP_SOCKET_INIT_COMPLETE:string = "APP_SOCKET_INIT_COMPLETE";
        public static readonly APP_SOCKET_CLOSED:string = "APP_SOCKET_CLOSED";
        public static readonly APP_SOCKET_ERROR:string = "APP_SOCKET_ERROR";

        /** 添加页面 */
        public static readonly APP_ADD_VIEW:string = "APP_ADD_VIEW";
        /** 删除页面 */
        public static readonly APP_DEL_VIEW:string = "APP_DEL_VIEW";

        /** 切换至后台 */
        public static readonly APP_INTO_BACKSTAGE:string = "APP_INTO_BACKSTAGE";
        /** 从后台切换回来 */
        public static readonly APP_BACK_FROM_BACKSTAGE:string = "APP_BACK_FROM_BACKSTAGE";
        /** =============指令结束================= */

        protected init(): void {
            //初始化代理，这存放数据，这里需要重新重新实例化
            let vProxys = this._proxys;
            vProxys.push(AppProxy.getInstance());

            //初始化指令
            // let vCommands = this._commands;
            // vCommands.push(new CmdVO(AppModule.L_ADD_VIEW));
            // vCommands.push(new CmdVO(AppModule.L_DEL_VIEW));

            //初始化服务端指令
        }



    }
}