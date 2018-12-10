/**
 * 
 * @Name:  FL - AppProxy
 * @Description:  //pureMvc 基础代理
 * @Create: DerekWu on 2016/4/8 15:52
 * @Version: V1.0
 */
module FL {
    export class AppProxy extends puremvc.Proxy {
        /** 代理名 */
        public static readonly NAME:string = "AppProxy";
        /** 单例 */
        private static instance:AppProxy;

        /** 数据存储对象 */
        // private _netWorkManager:NetWorkManager;

        /** 是否有同步指令在网络请求列表或者等待列表中 */
        // private _hasSync:boolean = false;

        private constructor(){
            super(AppProxy.NAME);
            //初始化网络管理者
            // this._netWorkManager = new NetWorkManager(this, pReqUrl, this.reqSuccessCallBack, this.reqErrorCallBack);

            //注册第一个http请求的定时任务，3秒执行一次
            // var pTimerVO:TimerVO = new TimerVO(this.timerHttpRequest, 2500, this);
            // TimerManager.regTimer(TimerEnum.HTTP_REQUEST, pTimerVO);
            //
            // //启动定时器
            // TimerManager.start();
        }

        public static getInstance():AppProxy {
            if (!this.instance) {
                this.instance = new AppProxy();
            }
            return this.instance;
        }

        // private reqSuccessCallBack(pEvent:egret.Event, pHasSyncCmd:boolean) {
        //     var loader: egret.URLLoader = <egret.URLLoader>pEvent.target;
        //     var data:egret.URLVariables = loader.data;
        // }
        //
        // private reqErrorCallBack(pEvent:egret.IOErrorEvent) {
        //
        // }

        /**
         * 定时器回调函数
         */
        // private timerHttpRequest():void {
        //     var vReturnHasSync:boolean = this._netWorkManager.timerRequestSendCmd();
        //     console.log("vReturnHasSync="+vReturnHasSync);
        //     if (this._hasSync != vReturnHasSync) {
        //         this._hasSync = vReturnHasSync;
        //         //TODO  发送网络同步状态指令
        //     }
        // }


    }
}