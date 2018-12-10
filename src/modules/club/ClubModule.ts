module FL {
    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase - ClubModule
     * @Description:  俱乐部模块
     * @Create: ArielLiang on 2018/3/7 10:09
     * @Version: V1.0
     */
    export class ClubModule extends FL.ModuleBase {

        /** 模块名 */
        public static readonly NAME = "ClubModule";
        /** 单例 */
        private static _only: ClubModule;

        private constructor() {
            super();
        }

        public static getInstance(): ClubModule {
            if (!this._only) {
                this._only = new ClubModule();
            }
            return this._only;
        }

        /** =============客户端 指令开始================= */
        /** 进入俱乐部 */
        public static readonly CLUB_INTO_CLUB: string = "CLUB_INTO_CLUB";
        /** 搜索俱乐部 */
        public static readonly CLUB_SEARCH_CLUB_LIST: string = "CLUB_SEARCH_CLUB_LIST";
        /** 展示俱乐部列表 */
        public static readonly CLUB_SHOW_CLUB_LIST: string = "CLUB_SHOW_CLUB_LIST";
        /** 创建俱乐部返回 */
        public static readonly CLUB_CREATE_CLUB: string = "CLUB_CREATE_CLUB";
        /** 刷新钻石数量 */
        public static readonly CLUB_REFRESH_DIAMOND: string = "CLUB_REFRESH_DIAMOND";
        /** 获取房间列表*/
        public static readonly CLUB_GET_ROOM_LIST: string = "CLUB_GET_ROOM_LIST";
        /** 展示房间列表 */
        public static readonly CLUB_SHOW_ROOM_LIST: string = "CLUB_SHOW_ROOM_LIST";
        /** 获取成员列表*/
        public static readonly CLUB_GET_MEMBER_LIST: string = "CLUB_GET_MEMBER_LIST";
        /** 展示成员列表 */
        public static readonly CLUB_SHOW_MEMBER_LIST: string = "CLUB_SHOW_MEMBER_LIST";
        //---HoyeLee
        /** 排行榜 */
        public static readonly CLUB_SHOW_RANK_LIST: string = "CLUB_SHOW_RANK_LIST";
        /** 日志记录 */
        public static readonly CLUB_SHOW_LOG_LIST: string = "CLUB_SHOW_LOG_LIST";
        /** 公告编辑返回 */
        public static readonly CLUB_NOTICE_MODIFY: string = "CLUB_NOTICE_MODIFY";
        /** 解散俱乐部返回 */
        public static readonly CLUB_DISMISS_CLUB: string = "CLUB_DISMISS_CLUB";
        /** 退出俱乐部返回 */
        public static readonly CLUB_EXIT_CLUB: string = "CLUB_EXIT_CLUB";
        /** 显示申请列表 */
        public static readonly CLUB_SHOW_APPLY_LIST: string = "CLUB_SHOW_APPLY_LIST";
        /** 操作申请列表选项返回 */
        public static readonly CLUB_OPT_APPLY_LIST: string = "CLUB_OPT_APPLY_LIST";
        /** 刷新当前视图 */
        public static readonly CLUB_REFRESH_VIEW: string = "CLUB_REFRESH_VIEW";

        /** 显示管理成员弹出页 */
        public static readonly CLUB_SHOW_BUBBLE_VIEW: string = "CLUB_SHOW_BUBBLE_VIEW";

        /** 创建俱乐部页面关闭 */
        public static readonly CLUB_CREATE_CLUB_CLOSE: string = "CLUB_CREATE_CLUB_CLOSE";

        /** 客户端进入俱乐部里面 */
        public static readonly CLUB_CLIENT_INTO_CLUB_INSIDE: string = "CLUB_CLIENT_INTO_CLUB_INSIDE";

        //-------

        /** =============客户端 指令结束================= */

        protected init(): void {
            let self = this;
            let vProxy: ClubProxy = ClubProxy.getInstance();
            self._proxys.push(vProxy);


            //注册服务端指令
            let vServerCmds: Array<ServerCmd> = self._serverCmds;
            vServerCmds.push(ServerCmd.buildSendCmd(MsgCmdConstant.MSG_CREATE_CLUB));
            vServerCmds.push(ServerCmd.buildCallBack(MsgCmdConstant.MSG_CREATE_CLUB_ACK, CreateClubMsgAck, vProxy.exeCreateClubMsgAck, vProxy));
            vServerCmds.push(ServerCmd.buildSendCmd(MsgCmdConstant.MSG_SEARCH_CLUB));
            vServerCmds.push(ServerCmd.buildCallBack(MsgCmdConstant.MSG_SEARCH_CLUB_ACK, SearchClubMsgAck, vProxy.exeSearchClubMsgAck, vProxy));
            vServerCmds.push(ServerCmd.buildSendCmd(MsgCmdConstant.MSG_APPLY_CLUB));
            vServerCmds.push(ServerCmd.buildCallBack(MsgCmdConstant.MSG_APPLY_CLUB_ACK, ApplyClubMsgAck, vProxy.exeApplyClubMsgAck, vProxy));
            vServerCmds.push(ServerCmd.buildSendCmd(MsgCmdConstant.MSG_CLUB_GET_INFO));
            vServerCmds.push(ServerCmd.buildCallBack(MsgCmdConstant.MSG_CLUB_GET_INFO_ACK, ClubGetInfoMsgAck, vProxy.exeClubGetInfoMsgAck, vProxy));
            vServerCmds.push(ServerCmd.buildSendCmd(MsgCmdConstant.MSG_SET_TABLE_SETTINGS));
            vServerCmds.push(ServerCmd.buildCallBack(MsgCmdConstant.MSG_SET_TABLE_SETTINGS_ACK, SetTableSettingsMsgAck, vProxy.exeSetTableSettingsMsgAck, vProxy));
            vServerCmds.push(ServerCmd.buildSendCmd(MsgCmdConstant.MSG_GET_TABLE_SETTINGS));
            vServerCmds.push(ServerCmd.buildCallBack(MsgCmdConstant.MSG_GET_TABLE_SETTINGS_ACK, GetTableSettingsMsgAck, vProxy.exeGetTableSettingsMsgAck, vProxy));
            vServerCmds.push(ServerCmd.buildSendCmd(MsgCmdConstant.MSG_OPT_DIAMOND));
            vServerCmds.push(ServerCmd.buildCallBack(MsgCmdConstant.MSG_OPT_DIAMOND_ACK, ClubOptDiamondMsgAck, vProxy.exeClubOptDiamondMsgAck, vProxy));
            vServerCmds.push(ServerCmd.buildSendCmd(MsgCmdConstant.MSG_SHOW_MEMBER_LIST));
            vServerCmds.push(ServerCmd.buildCallBack(MsgCmdConstant.MSG_SHOW_MEMBER_LIST_ACK, ShowMemberListMsgAck, vProxy.exeShowMemberListMsgAck, vProxy));
            vServerCmds.push(ServerCmd.buildSendCmd(MsgCmdConstant.MSG_OPT_MEMBER));
            vServerCmds.push(ServerCmd.buildCallBack(MsgCmdConstant.MSG_OPT_MEMBER_ACK, OptMemberMsgAck, vProxy.exeOptMemberMsgAck, vProxy));
            vServerCmds.push(ServerCmd.buildSendCmd(MsgCmdConstant.MSG_SHOW_RANK));
            vServerCmds.push(ServerCmd.buildCallBack(MsgCmdConstant.MSG_SHOW_RANK_ACK, ShowRankMsgAck, vProxy.exeShowRankMsgAck, vProxy));
            vServerCmds.push(ServerCmd.buildSendCmd(MsgCmdConstant.MSG_CLUB_LOG));
            vServerCmds.push(ServerCmd.buildCallBack(MsgCmdConstant.MSG_CLUB_LOG_ACK, ClubLogMsgAck, vProxy.exeClubLogMsgAck, vProxy));
            vServerCmds.push(ServerCmd.buildSendCmd(MsgCmdConstant.MSG_CLUB_MODIFY));
            vServerCmds.push(ServerCmd.buildCallBack(MsgCmdConstant.MSG_CLUB_MODIFY_ACK, ClubModifyMsgAck, vProxy.exeClubModifyMsgAck, vProxy));
            vServerCmds.push(ServerCmd.buildSendCmd(MsgCmdConstant.MSG_CLUB_DISMISS));
            vServerCmds.push(ServerCmd.buildCallBack(MsgCmdConstant.MSG_CLUB_DISMISS_ACK, ClubDismissMsgAck, vProxy.exeClubDismissMsgAck, vProxy));
            vServerCmds.push(ServerCmd.buildSendCmd(MsgCmdConstant.MSG_CLUB_EXIT));
            vServerCmds.push(ServerCmd.buildCallBack(MsgCmdConstant.MSG_CLUB_EXIT_ACK, ClubExitMsgAck, vProxy.exeClubExitMsgAck, vProxy));
            vServerCmds.push(ServerCmd.buildSendCmd(MsgCmdConstant.MSG_SHOW_APPLY_LIST));
            vServerCmds.push(ServerCmd.buildCallBack(MsgCmdConstant.MSG_SHOW_APPLY_LIST_ACK, ShowApplyListMsgAck, vProxy.exeShowApplyListMsgAck, vProxy));
            vServerCmds.push(ServerCmd.buildSendCmd(MsgCmdConstant.MSG_OPT_APPLY_LIST));
            vServerCmds.push(ServerCmd.buildCallBack(MsgCmdConstant.MSG_OPT_APPLY_LIST_ACK, OptApplyListMsgAck, vProxy.exeOptApplyListMsgAck, vProxy));



            //注册序列化对象
            SerializerCache.registerByName(Club.NAME, Club);
            SerializerCache.registerByName(ClubMember.NAME, ClubMember);
            SerializerCache.registerByName(ClubOperationLog.NAME, ClubOperationLog);
            SerializerCache.registerByName(ClubApply.NAME, ClubApply);
            SerializerCache.registerByName(ClubPlanSetting.NAME, ClubPlanSetting);
            SerializerCache.registerByName(AgentDaiKaiInfo.NAME, AgentDaiKaiInfo);

            //注册客户端指令
            let vCommands = self._commands;
            vCommands.push(new CmdVO(ClubModule.CLUB_INTO_CLUB, ClubCmd));
            vCommands.push(new CmdVO(ClubModule.CLUB_SEARCH_CLUB_LIST, ClubCmd));
            vCommands.push(new CmdVO(ClubModule.CLUB_CLIENT_INTO_CLUB_INSIDE, ClubCmd));

        }

    }
}