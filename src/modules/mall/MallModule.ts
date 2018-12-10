module FL {

    export class MallModule extends FL.ModuleBase {

        /** 模块名 */
        public static readonly NAME = "MallModule";
        /** 单例 */
        private static _only: MallModule;

        private constructor() {
            super();
        }

        public static getInstance(): MallModule {
            if (!this._only) {
                this._only = new MallModule();
            }
            return this._only;
        }

        /** =============客户端 指令开始================= */
        /** 进入购物中心 */
        public static readonly MALL_INTO_MALL:string = "MALL_INTO_MALL";

        /** =============客户端 指令结束================= */

        protected init(): void {
            let self = this;
            let vProxy:MallProxy = MallProxy.getInstance();
            self._proxys.push(vProxy);
            
            //注册服务端指令
            let vServerCmds:Array<ServerCmd> = self._serverCmds;
            vServerCmds.push(ServerCmd.buildSendCmd(MsgCmdConstant.MSG_GAME_REFRESH_ITEM_BASE));
            vServerCmds.push(ServerCmd.buildCallBack(MsgCmdConstant.MSG_GAME_REFRESH_ITEM_BASE_ACK, RefreshItemBaseACK, vProxy.exeMsgGameRefreshItemBaseACK, vProxy));

            //注册客户端指令
            let vCommands = self._commands;
            vCommands.push(new CmdVO(MallModule.MALL_INTO_MALL, MallCmd));


        }

    }
}