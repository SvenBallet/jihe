module FL {
    /**
     * 异步错误
     * @Name:  FL - AsyncError
     * @Company 深圳市天天爱科技有限公司 版权所有
     * @Description:  无详细描述
     * @Create: DerekWu on 2017/8/25 22:10
     * @Version: V1.0
     */
    export class AsyncError {

        /** 单例 */
        private static instance:AsyncError;

        private constructor() {}

        public static getInstance():AsyncError {
            if (!this.instance) {
                this.instance = new AsyncError();
            }
            return this.instance;
        }

        public static exeError(e: any):void {
            this.getInstance().exeCatchError(e);
        }

        private exeCatchError(e: any): void {
            egret.error(e);
            FL.MvcUtil.send(FL.CommonModule.COMMON_ERROR_ASYNC, e);
        }
    }
}