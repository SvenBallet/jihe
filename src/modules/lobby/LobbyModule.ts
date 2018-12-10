module FL {
    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase - LobbyModule
     * @Description:  //大厅模块
     * @Create: DerekWu on 2017/11/10 18:48
     * @Version: V1.0
     */
    export class LobbyModule extends FL.ModuleBase {

        /** 模块名 */
        public static readonly NAME = "LobbyModule";
        /** 单例 */
        private static _only: LobbyModule;

        private constructor() {
            super();
        }

        public static getInstance(): LobbyModule {
            if (!this._only) {
                this._only = new LobbyModule();
            }
            return this._only;
        }

        /** =============客户端 指令开始================= */
        /** 进入大厅 */
        public static readonly LOBBY_INTO_LOBBY: string = "LOBBY_INTO_LOBBY";
        /** 显示分享界面 */
        public static readonly LOBBY_SHOW_SHARE_VIEW: string = "LOBBY_SHOW_SHARE_VIEW";
        /** 显示添加钻石界面 */
        public static readonly LOBBY_SHOW_FREE_DIAMOND_VIEW: string = "LOBBY_SHOW_FREE_DIAMOND_VIEW";
        /** 跳转新游戏下载页 */
        public static readonly LOBBY_OPEN_DOWNLOAD_PAGE: string = "LOBBY_OPEN_DOWNLOAD_PAGE";
        /** 分享到朋友圈并获得了钻石 */
        public static readonly LOBBY_SHARE_CIRCLE_ADD_DIAMOND: string = "LOBBY_SHARE_CIRCLE_ADD_DIAMOND";
        /** 刷新大厅茶楼列表 */
        public static readonly LOBBY_REFRESH_THLIST: string = "LOBBY_REFRESH_THLIST";

        /** =============客户端 指令结束================= */

        /** 绑定邀请码 */
        public static readonly LOBBY_BIND_CODE: string = "LOBBY_BIND_CODE";

        protected init(): void {
            let self = this;
            let vProxy: LobbyProxy = LobbyProxy.getInstance();
            self._proxys.push(vProxy);

            //绑定登录回复消息
            BindManager.addAttrListener(LoginProxy.loginMsgAckBindId(), vProxy.exeLoginMsgAck, vProxy);


            //注册服务端指令
            let vServerCmds: Array<ServerCmd> = self._serverCmds;
            vServerCmds.push(ServerCmd.buildCallBack(MsgCmdConstant.MSG_GAME_UPDATE_PLAYER_PROPERTY, UpdatePlayerPropertyMsg, vProxy.exeUpdatePlayerPropertyMsg, vProxy));
            vServerCmds.push(ServerCmd.buildCallBack(MsgCmdConstant.MSG_GAME_SEND_SCROLL_MES, ScrollMsg, vProxy.exeScrollMsg, vProxy));
            vServerCmds.push(ServerCmd.buildSendCmd(MsgCmdConstant.MSG_SHOW_JOIN_TEAHOUSE_LIST));
            vServerCmds.push(ServerCmd.buildCallBack(MsgCmdConstant.MSG_SHOW_JOIN_TEAHOUSE_LIST_ACK, ShowJoinTeaHouseListMsgAck, vProxy.exeShowJoinTeaHouseListMsgAck, vProxy));
            vServerCmds.push(ServerCmd.buildCallBack(MsgCmdConstant.MSG_REAL_NAME_AUTHENTICATION_ACK, PlayerRealNameAuthenticationMsgAck, vProxy.exePlayerRealNameAuthenticationMsgAck, vProxy));

            //注册序列化对象

            //注册客户端指令
            let vCommands = self._commands;
            vCommands.push(new CmdVO(LobbyModule.LOBBY_INTO_LOBBY, LobbyCmd));
            vCommands.push(new CmdVO(LobbyModule.LOBBY_SHOW_SHARE_VIEW, LobbyCmd));
            vCommands.push(new CmdVO(LobbyModule.LOBBY_SHOW_FREE_DIAMOND_VIEW, LobbyCmd));
            vCommands.push(new CmdVO(LobbyModule.LOBBY_OPEN_DOWNLOAD_PAGE, LobbyCmd));
            vCommands.push(new CmdVO(LobbyModule.LOBBY_SHARE_CIRCLE_ADD_DIAMOND, LobbyCmd));
        }

    }
}