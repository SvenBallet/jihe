module FL {
    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase - RESPromiseTaskReporter
     * @Description:  // 资源加载任务报告
     * @Create: DerekWu on 2018/1/23 20:04
     * @Version: V1.0
     */
    export class RESPromiseTaskReporter implements RES.PromiseTaskReporter {
        /** 占用进度条百分之比 */
        private _processRate:number = 10;
        /**
         * 进度回调
         */
        public onProgress(current: number, total: number): void {
            let vRate:number = Math.floor((current/total)*this._processRate);
            let vRealProcessValue:number = Main.indexCurrProcessValue+vRate;
            if (current === total) {
                Main.indexCurrProcessValue+=this._processRate;
            }
            if (vRealProcessValue > 100) {
                vRealProcessValue = 100;
            }
            FL.IndexProxy.setIndexProgress(vRealProcessValue, 100);
        }
    }
}