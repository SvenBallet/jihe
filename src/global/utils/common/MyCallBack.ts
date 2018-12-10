module FL {
    /**
     * 自定义的回调对象
     * @Name:  FL - common
     * @Company 
     * @Description:  无详细描述
     * @Create: DerekWu on 2017/8/13 14:15
     * @Version: V1.0
     */
    export class MyCallBack {

        private readonly callback:Function;
        private readonly thisObj:any;
        private readonly params:any[];

        constructor(callBack:Function, thisObj:any, ...params:any[]) {
            this.callback = callBack;
            this.thisObj = thisObj;
            if (params.length > 0) this.params = params;
        }

        public apply():any {
            if (this.params) {
                return this.callback.apply(this.thisObj, this.params);
            } else {
                return this.callback.apply(this.thisObj);
            }
        }

        public call(...addParams:any[]):any {
            if (addParams.length > 0) {
                if (this.params) {
                    return this.callback.apply(this.thisObj, this.params.concat(addParams));
                } else {
                    return this.callback.apply(this.thisObj, addParams);
                }
            } else {
                return this.apply();
            }
        }

    }

    /**
     * 回调工具类
     */
    export class MyCallBackUtil {

        /**
         * 延时回调
         * @param pDelayedTimes
         * @param callBack
         * @param thisObj
         * @param params
         */
        public static delayedCallBack(pDelayedTimes:number, callBack:Function, thisObj:any, ...params:any[]):void {
            let vOneMyCallBack:MyCallBack = new MyCallBack(callBack, thisObj, ...params);
            this.delayedMyCallBack(pDelayedTimes, vOneMyCallBack);
        }

        /**
         * 延时回调
         * @param pDelayedTimes
         * @param pMyCallBack
         */
        public static delayedMyCallBack(pDelayedTimes:number, pMyCallBack:MyCallBack):void {
            Game.Tween.get(pMyCallBack).wait(pDelayedTimes).call(pMyCallBack.apply, pMyCallBack);
        }

        /**
         * 延时处理点击按钮开启，固定一秒，仅用于客户端有异步逻辑时使用
         * @param pMyCallBack
         */
        public static delayedEnabledButton(pMyCallBack:MyCallBack):void {
            this.delayedMyCallBack(1000, pMyCallBack);
        }

    }

}