/**
 * 
 * @Name:  FL - AppFacade
 * @Description:  pureMVC 你懂的
 * @Create: DerekWu on 2016/4/8 15:50
 * @Version: V1.0
 */
module FL {
    // import Facade = puremvc.Facade;
    // import IFacade = puremvc.IFacade;
    export class AppFacade extends puremvc.Facade implements puremvc.IFacade{

        /** 模块名 */
        public static readonly NAME = "AppFacade";

        /** 单例 */
        private static instance:AppFacade;

        private constructor() {
            super(AppFacade.NAME);
        }

        /**
         * 获取 AppFacade 实例
         * @returns {AppFacade}
         */
        public static getInstance():AppFacade {
            if (!this.instance) {
                this.instance = new AppFacade();
            }
            return this.instance;
        }

        /**
         * 初始化
         */
        public initializeController():void {
            super.initializeController();
        }

        private _isStart:boolean = false;

        /**
         * 启动PureMVC，在应用程序中调用此方法，并传递应用程序本身的引用
         * @param	root - 跟容器
         */
        public start(root:eui.UILayer):void {
            if (!this._isStart) {
                this.registerCommand(AppModule.APP_REG_MODULE, ModuleCmd);
                this.registerCommand(AppModule.APP_DEL_MODULE, ModuleCmd);
                ModuleManager.regModule(AppModule.NAME, AppModule.getInstance());
                this.registerMediator(RootViewMediator.getInstance(root));
                this._isStart = true;
            }
        }

    }
}