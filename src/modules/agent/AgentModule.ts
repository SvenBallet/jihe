module FL {

    export class AgentModule extends FL.ModuleBase {

        /** 模块名 */
        public static readonly NAME = "AgentModule";
        /** 单例 */
        private static _only: AgentModule;

        private constructor() {
            super();
        }

        public static getInstance(): AgentModule {
            if (!this._only) {
                this._only = new AgentModule();
            }
            return this._only;
        }

        /** =============客户端 指令开始================= */
        /** 进入代理界面 */
        public static readonly AGENT_INTO_AGENT:string = "AGENT_INTO_AGENT";
        /** 修改密码返回 */
        public static readonly AGENT_UPDATE_PASSWORD:string = "AGENT_UPDATE_PASSWORD";
        /** 获取玩家授权列表 */
        public static readonly AGENT_GET_AUTH_PLAYER:string = "AGENT_GET_AUTH_PLAYER";
        /** 授权玩家返回 */
        public static readonly AGENT_AUTH_PLAYER:string = "AGENT_AUTH_PLAYER";
        /** 下级查询返回 */
        public static readonly AGENT_GET_SUB_PLAYER:string = "AGENT_GET_SUB_PLAYER";
        /** 赠送玩家钻石 */
        public static readonly AGENT_GIVE_PLAYER_DIAMOND:string = "AGENT_GIVE_PLAYER_DIAMOND";
        /** 更新返利数值 */
        public static readonly AGENT_UPDATE_PAY_BACK:string = "AGENT_UPDATE_PAY_BACK";
        /** 获取代理信息 */
        public static readonly AGENT_GET_AGENT_INFO:string = "AGENT_GET_AGENT_INFO";
        /** 跳到代理管理界面*/
        public static readonly AGENT_MGR_SYSTEM:string = "AGENT_MGR_SYSTEM";
        /** 绑定上下级*/
        public static readonly AGENT_SEND_BIND_CODE:string = "AGENT_SEND_BIND_CODE";
        /** 获取副群主代开房记录 */
        public static readonly AGENT_AUTH_PLAYER_GET_ROOM_LIST:string = "AGENT_AUTH_PLAYER_GET_ROOM_LIST";
        /** 更新代理信息 */
        public static readonly AGENT_UPDATE_AGENT_INFO:string = "AGENT_UPDATE_AGENT_INFO";
        /** 分享邀请码 */
        public static readonly AGENT_SHARE_INVITE_CODE:string = "AGENT_SHARE_INVITE_CODE";
        /** 获取代理管理登陆校验 */
        public static readonly AGENT_GET_MGR_SYSTEM_TICKET:string = "AGENT_GET_MGR_SYSTEM_TICKET";

        /** =============客户端 指令结束================= */

        protected init(): void {
            let self = this;
            let vProxy:AgentProxy = AgentProxy.getInstance();
            self._proxys.push(vProxy);

            //注册服务端指令
            let vServerCmds:Array<ServerCmd> = self._serverCmds;
            vServerCmds.push(ServerCmd.buildSendCmd(MsgCmdConstant.MSG_GAME_BUY_ITEM));
            // vServerCmds.push(ServerCmd.buildCallBack(MsgCmdConstant.MSG_AGENT_DAIKAI_ACK, AgentDaiKaiMsgAck, vProxy.exeAgentDaiKaiMsgAck, vProxy));
            vServerCmds.push(ServerCmd.buildTranspond(MsgCmdConstant.MSG_AGENT_DAIKAI_ACK, AgentDaiKaiMsgAck, AgentModule.AGENT_INTO_AGENT));
            vServerCmds.push(ServerCmd.buildSendCmd(MsgCmdConstant.MSG_GAME_SEND_PLAYER_OPERATIOIN_STRING));
            vServerCmds.push(ServerCmd.buildCallBack(MsgCmdConstant.MSG_GAME_PLAYER_UPDATE_PASSWORD_ACK, ValidateMsgAck, vProxy.exeValidateMsgAck, vProxy));
            vServerCmds.push(ServerCmd.buildCallBack(MsgCmdConstant.MSG_AGENT_PLAYER_ACK, AgentRoomMsgAck, vProxy.exeAgentRoomMsgAck, vProxy));
            vServerCmds.push(ServerCmd.buildCallBack(MsgCmdConstant.MSG_GAME_GET_PLAYER_DIAMOND_LOG_ACK, GetPlayerDiamondLogAck, vProxy.exeGetPlayerDiamondLogAck, vProxy));
            vServerCmds.push(ServerCmd.buildSendCmd(MsgCmdConstant.MSG_AGENT_INFO));
            vServerCmds.push(ServerCmd.buildCallBack(MsgCmdConstant.MSG_AGENT_INFO_ACK, RequestAgentInfoAck, vProxy.exeRequestAgentInfoAck, vProxy));
            vServerCmds.push(ServerCmd.buildSendCmd(MsgCmdConstant.MSG_AGENT_TICKET));
            vServerCmds.push(ServerCmd.buildCallBack(MsgCmdConstant.MSG_AGENT_TICKET_ACK, RequestAgentTicketAck, vProxy.exeRequestAgentTicketAck, vProxy));
            vServerCmds.push(ServerCmd.buildSendCmd(MsgCmdConstant.MSG_GAME_BIND_AGENT));
            vServerCmds.push(ServerCmd.buildCallBack(MsgCmdConstant.MSG_GAME_BIND_AGENT_ACK, RequestBindAgentAck, vProxy.exeRequestBindAgentAck, vProxy));

            //注册客户端指令
            let vCommands = self._commands;
            vCommands.push(new CmdVO(AgentModule.AGENT_INTO_AGENT, AgentCmd));
            vCommands.push(new CmdVO(AgentModule.AGENT_UPDATE_PASSWORD, AgentCmd));
            vCommands.push(new CmdVO(AgentModule.AGENT_GET_AUTH_PLAYER, AgentCmd));
            vCommands.push(new CmdVO(AgentModule.AGENT_AUTH_PLAYER, AgentCmd));
            vCommands.push(new CmdVO(AgentModule.AGENT_GET_SUB_PLAYER, AgentCmd));
            vCommands.push(new CmdVO(AgentModule.AGENT_GIVE_PLAYER_DIAMOND, AgentCmd));
            vCommands.push(new CmdVO(AgentModule.AGENT_MGR_SYSTEM, AgentCmd));
            vCommands.push(new CmdVO(AgentModule.AGENT_SHARE_INVITE_CODE, AgentCmd));
            vCommands.push(new CmdVO(AgentModule.AGENT_GET_MGR_SYSTEM_TICKET, AgentCmd));
            vCommands.push(new CmdVO(AgentModule.AGENT_SEND_BIND_CODE, AgentCmd));

            SerializerCache.registerByName(AgentBase.NAME, AgentBase);
            SerializerCache.registerByName(AgentRoomRecord.NAME, AgentRoomRecord);
            SerializerCache.registerByName(PlayerOperationLog.NAME, PlayerOperationLog);

        }

    }
}