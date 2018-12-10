module Game {
    /**
     * 
     * @Name:  Game - ServerCmd
     * @Description:  //异步处理服务器指令
     * @Create: DerekWu on 2017/3/23 20:04
     * @Version: V1.0
     */
    export class ServerCmd {

        /** 服务器返回消息延迟处理存储队列 */
        private static $serverCmdFunctionList:any[] = [];
        private static $serverCmdThisList:any[] = [];
        private static $serverCmdArgsList:any[] = [];

        /**
         * 添加到 服务器返回消息延迟处理存储队列
         * @param method {Function} 要延迟执行的函数
         * @param thisObject {any} 回调函数的this引用
         * @param ...args {any} 函数参数列表
         */
        public static addServerCmd(method:Function,thisObject:any,...args):void {
            let self = this;
            self.$serverCmdFunctionList.push(method);
            self.$serverCmdThisList.push(thisObject);
            self.$serverCmdArgsList.push(args);
        }

        /**
         * 处理服务器返回指令
         */
        public static $exeServerCmd():void {
            let self = this;
            let vTempLength:number = self.$serverCmdFunctionList.length;
            if (vTempLength > 0) {
                let locServerCmdFunctionList = self.$serverCmdFunctionList;
                let locServerCmdThisList = self.$serverCmdThisList;
                let locServerCmdArgsList = self.$serverCmdArgsList;

                self.$serverCmdFunctionList = [];
                self.$serverCmdThisList = [];
                self.$serverCmdArgsList = [];

                for (let i:number = 0; i < vTempLength; ++i) {
                    let func:Function = locServerCmdFunctionList[i];
                    if (func != null) {
                        func.apply(locServerCmdThisList[i], locServerCmdArgsList[i]);
                    }
                }
            }
        }

    }

    /**
     * 
     * @Name:  Game - AsyncLogic
     * @Description:  //延迟逻辑处理
     * @Create: DerekWu on 2017/3/23 20:04
     * @Version: V1.0
     */
    export class AsyncLogic {

        /** 延迟逻辑存储队列 */
        private static $asyncLogicFunctionList:any[] = [];
        private static $asyncLogicThisList:any[] = [];
        private static $asyncLogicArgsList:any[] = [];

        /**
         * 添加到 延迟逻辑存储队列
         * @param method {Function} 要异步调用的函数
         * @param thisObject {any} 函数的this引用
         * @param ...args {any} 函数参数列表
         * @private
         */
        public static addAsyncLogic(method:Function,thisObject:any,...args):void {
            let self = this;
            self.$asyncLogicFunctionList.push(method);
            self.$asyncLogicThisList.push(thisObject);
            self.$asyncLogicArgsList.push(args);
        }

        /**
         * 处理异步逻辑
         */
        public static $exeAsyncLogic() {
            let self = this;
            let vTempLength:number = self.$asyncLogicFunctionList.length;
            if (vTempLength > 0) {
                let locAsyncLogicFunctionList = self.$asyncLogicFunctionList;
                let locAsyncLogicThisList = self.$asyncLogicThisList;
                let locAsyncLogicArgsList = self.$asyncLogicArgsList;

                self.$asyncLogicFunctionList = [];
                self.$asyncLogicThisList = [];
                self.$asyncLogicArgsList = [];

                for (let i:number = 0; i < vTempLength; ++i) {
                    let func:Function = locAsyncLogicFunctionList[i];
                    if (func != null) {
                        func.apply(locAsyncLogicThisList[i], locAsyncLogicArgsList[i]);
                    }
                }
            }
        }

    }

    /**
     * 
     * @Name:  Game - BeforeRender
     * @Description:  //渲染前处理类
     * @Create: DerekWu on 2017/3/23 20:04
     * @Version: V1.0
     */
    export class BeforeRender {

        /** 延迟逻辑存储队列 */
        private static $BeforeRenderFunctionList:any[] = [];
        private static $BeforeRenderThisList:any[] = [];
        private static $BeforeRenderArgsList:any[] = [];

        /**
         * 添加到 延迟逻辑存储队列
         * @param method {Function} 要异步调用的函数
         * @param thisObject {any} 函数的this引用
         * @param ...args {any} 函数参数列表
         * @private
         */
        public static addLogic(method:Function,thisObject:any,...args):void {
            let self = this;
            self.$BeforeRenderFunctionList.push(method);
            self.$BeforeRenderThisList.push(thisObject);
            self.$BeforeRenderArgsList.push(args);
        }

        /**
         * 处理异步逻辑
         */
        public static $exeLogic() {
            let self = this;
            let vTempLength:number = self.$BeforeRenderFunctionList.length;
            if (vTempLength > 0) {
                let locBeforeRenderFunctionList = self.$BeforeRenderFunctionList;
                let locBeforeRenderThisList = self.$BeforeRenderThisList;
                let locBeforeRenderArgsList = self.$BeforeRenderArgsList;

                self.$BeforeRenderFunctionList = [];
                self.$BeforeRenderThisList = [];
                self.$BeforeRenderArgsList = [];

                for (let i:number = 0; i < vTempLength; ++i) {
                    let func:Function = locBeforeRenderFunctionList[i];
                    if (func != null) {
                        func.apply(locBeforeRenderThisList[i], locBeforeRenderArgsList[i]);
                    }
                }
            }
        }

    }
}