module FL {
    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase - PayModule
     * @Description:  //充值模块 
     * @Create: DerekWu on 2017/11/10 16:13
     * @Version: V1.0
     */
    export class PayModule extends FL.ModuleBase {

        /** 模块名 */
        public static readonly NAME = "PayModule";
        /** 单例 */
        private static _only: PayModule;

        private constructor() {
            super();
        }

        public static getInstance(): PayModule {
            if (!this._only) {
                this._only = new PayModule();
            }
            return this._only;
        }

        /** =============客户端 指令开始================= */
        /** 请求微信公众号充值回复 */
        public static readonly PAY_REQ_WXGZH_ACK:string = "PAY_REQ_WXGZH_ACK";


        /** =============客户端 指令结束================= */

        protected init(): void {
            let self = this;
            let vProxy:PayProxy = PayProxy.getInstance();
            self._proxys.push(vProxy);

            //注册服务端指令
            let vServerCmds:Array<ServerCmd> = self._serverCmds;
            vServerCmds.push(ServerCmd.buildCallBack(MsgCmdConstant.MSG_GAME_BUY_ITEM_ACK, GameBuyItemAckMsg, vProxy.exeGameBuyItemAckMsg, vProxy));
            vServerCmds.push(ServerCmd.buildTranspond(MsgCmdConstant.MSG_GAME_BUY_ITEM_WXGZH_ACK, GameBuyItemWXGZHAckMsg, PayModule.PAY_REQ_WXGZH_ACK));

            //注册客户端指令
            let vCommands = self._commands;
            vCommands.push(new CmdVO(PayModule.PAY_REQ_WXGZH_ACK, PayCmd));

        }

    }
}