module FL {

    // export class LoadingTask {
    //
    //     public static readonly game_ui = "game_ui";
    //     public static readonly game_ui_w = 100;
    //
    //     public static readonly game_base = "game_base";
    //     public static readonly game_base_w = 100;
    //
    //     public static readonly game_base = "game_base";
    //     public static readonly game_base_w = 100;
    //
    //     public static readonly game_base = "game_base";
    //     public static readonly game_base_w = 100;
    //
    //     public static readonly game_base = "game_base";
    //     public static readonly game_base_w = 100;
    //
    //     public static readonly game_base = "game_base";
    //     public static readonly game_base_w = 100;
    //
    // }

    /**
     * 加载指令处理类
     * @Name:  FL - LoadingCmd
     * @Company 深圳市天天爱科技有限公司 版权所有
     * @Description:  无详细描述
     * @Create: DerekWu on 2017/8/13 9:14
     * @Version: V1.0
     */
    export class LoadingCmd extends puremvc.SimpleCommand implements puremvc.ICommand {

        public constructor() {
            super();
        }

        public execute(notification:puremvc.INotification):void {
            let data:any = notification.getBody();
            switch(notification.getName()) {
                case CommonModule.COMMON_PRELOAD_OVER:{
                    //初始化游戏的预加载结束，开始Loading对应的资源
                    let vMyCallBack:MyCallBack = new MyCallBack(this.firstLoading, this);
                    //MvcUtil.send(CommonModule.COMMON_START_LOADING, vMyCallBack);
                    this.startLoading(vMyCallBack);
                    break;
                }
                case CommonModule.COMMON_START_LOADING:{
                    this.startLoading(data);
                    break;
                }
            }
        }

        /**
         * 处理预加载结束指令
         */
        private startLoading(pMyCallBack:MyCallBack) {
            if (CommonHandler.getLoadingView()) {
                egret.error("# LoadingView is exists...");
                return;
            }
            // try {
                //加载loading组员组
                // await RES.loadGroup("loading");
                //创建loading界面
                let vLoadingView:LoadingView = new LoadingView();
                // MvcUtil.send(AppModule.APP_ADD_VIEW, vLoadingView);
                MvcUtil.addView(vLoadingView);
                //设置唯一的loading界面
                CommonHandler.setLoadingView(vLoadingView);
                //回调回去设置进度任务
                pMyCallBack.call(vLoadingView);
            // } catch (e) {
            //     FL.AsyncError.exeError(e);
            // }
        }

        /**
         * 加载分类：
         *
         *     防沉迷提示
         *
         * 1.预加载（exml。预加载组）；  步骤：启动mvc 设置日志级别 连接服务器 启动3D引擎
         * 2.打开loading资源加载界面；  加载 loading 资源组
         * 3.ui资源加载；
         * 4.基础配置资源（必要资源，和非必要资源）； game_base
         * 5.合图图片等公共资源；
         *
         *          ====== 如果是开发模式，则弹出填写账号界面，版号版本同样弹出，但是需要密码，固定密码123456 ======
         *
         *
         * 6.地图格子资源，登陆格子资源，玩家城市里面玩家数据对应的动画配置等资源；
         * 7.unity场景资源加载；
         */
        private async firstLoading(pLoadingView:LoadingView) {
            try {
                //加载game_ui资源
                //let vUIGroupLoadingOverCallBack:MyCallBack = new MyCallBack(this.testTaskCallBack, this, 199); //回调函数
                // let vUIGroupLoadingTask:LoadingTaskReporter = new LoadingTaskReporter("game_ui", 100, vUIGroupLoadingOverCallBack); //加载任务
                let vUIGroupLoadingTask:LoadingTaskReporter = new LoadingTaskReporter("game_ui", 100);
                //添加加载game_ui任务
                pLoadingView.addTaskReporter(vUIGroupLoadingTask);

                //加载基础配置game_base资源
                let vGameBaseGroupLoadingTask:LoadingTaskReporter = new LoadingTaskReporter("game_base", 150);
                //添加加载game_base任务
                pLoadingView.addTaskReporter(vGameBaseGroupLoadingTask);

                //添加公共3D资源的任务
                let vCommonResGroupLoadingTask:LoadingTaskReporter = new LoadingTaskReporter("common_3d", 100);
                pLoadingView.addTaskReporter(vCommonResGroupLoadingTask);

                //确认基础资源解析结束的任务 base_res_parse_over
                let vOverBaseGroupLoadingTask:LoadingTaskReporter = new LoadingTaskReporter("base_res_parse_over", 30);
                //添加加载 base_res_parse_over 任务
                pLoadingView.addTaskReporter(vOverBaseGroupLoadingTask);

                //区分开发者模式和正式模式的区别
                if (GConf.Conf.isDev) {
                    //设置加载完成的回调
                    pLoadingView.overCallBack = new MyCallBack(this.openLoginPlan, this);
                } else {
                    //添加动态资源组加载任务 dynamic_res
                    let vDynamicResGroupLoadingTask:LoadingTaskReporter = new LoadingTaskReporter("dynamic_res", 200);
                    //添加加载 dynamic_res 任务
                    pLoadingView.addTaskReporter(vDynamicResGroupLoadingTask);

                    //添加unity场景资源加载任务 unity_scene_res
                    let vUnitySceneResGroupLoadingTask:LoadingTaskReporter = new LoadingTaskReporter("unity_scene_res", 200);
                    //添加加载 unity_scene_res 任务
                    pLoadingView.addTaskReporter(vUnitySceneResGroupLoadingTask);

                    //添加场景数据初始化任务 init_scene_data
                    let vInitSceneDataLoadingTask:LoadingTaskReporter = new LoadingTaskReporter("init_scene_data", 50);
                    //添加加载 init_scene_data 任务
                    pLoadingView.addTaskReporter(vInitSceneDataLoadingTask);
                }

                //加载资源
                await RES.loadGroup("game_ui", 0, vUIGroupLoadingTask);
                await RES.loadGroup("game_base", 0, vGameBaseGroupLoadingTask);
                await RES.loadGroup("common_3d", 0, vCommonResGroupLoadingTask);

                //保证前面的资源已经完全异步解析了
                Game.AsyncQueue.addToQueueWithProgress(this.baseResParseOver, vOverBaseGroupLoadingTask, this);

                //Log.debug("start firstLoading");
            } catch (e) {
                FL.AsyncError.exeError(e);
            }
        }

        /**
         * 基础资源解析完毕
         */
        private baseResParseOver():void {

            // CommonConf.init();

            //推进后续的工作，可以跨控制器组装剩下的Loading
            MvcUtil.send(CommonModule.COMMON_BASE_RES_PARSE_OVER);
        }

        private openLoginPlan():void {
            //设置为空
            // LoadingCmd.loadingView = null;
            // Log.debug("# openLoginPlan ...");
            let vLoginView:LoginView = new LoginView();
            MvcUtil.send(AppModule.APP_ADD_VIEW, vLoginView);
        }

    }

}