module FL {
    /** 茶楼模块 */
    export class TeaHouseModule extends FL.ModuleBase {

        /** 模块名 */
        public static readonly NAME = "TeaHouseModule";
        /** 单例 */
        private static _only: TeaHouseModule;

        private constructor() {
            super();
        }

        public static getInstance(): TeaHouseModule {
            if (!this._only) {
                this._only = new TeaHouseModule();
            }
            return this._only;
        }

        /** =============客户端 指令开始================= */
        /** 进入楼层 */
        public static readonly TH_ACCESS_FLOOR: string = "TH_ACCESS_FLOOR";
        /** 进入之前进入过的茶楼 */
        // public static readonly TH_ACCESS_FLOOR: string = "TH_ACCESS_FLOOR";
        /** 茶楼打烊留言 */
        public static readonly TH_IS_OFF: string = "TH_IS_OFF";

        /** 刷新当前楼层信息 */
        public static readonly TH_REFRESH_CURRENT_FLOOR: string = "TH_REFRESH_CURRENT_FLOOR";
        /** 刷新大厅桌子信息 */
        public static readonly TH_REFRESH_TABLE: string = "TH_REFRESH_TABLE";
        /** 刷新茶楼管理页面 */
        public static readonly TH_REFRESH_MGR: string = "TH_REFRESH_MGR";
        /** 更新茶楼钻石 */
        public static readonly TH_UPDATE_THDIAMOND: string = "TH_UPDATE_THDIAMOND";
        /** 更改茶楼状态 */
        public static readonly TH_UPDATE_STATE: string = "TH_UPDATE_STATE";

        /** 处理申请列表红点 */
        public static readonly TH_HANDLE_APPLY_REDPOINT: string = "TH_HANDLE_APPLY_REDPOINT";

        /** 刷新经营状况 */
        public static readonly TH_REFRESH_RUNSTATE: string = "TH_REFRESH_RUNSTATE";
        /** 刷新我的战绩 */
        public static readonly TH_REFRESH_MY_RECORD: string = "TH_REFRESH_MY_RECORD";
        /** 刷新茶楼战榜 */
        public static readonly TH_REFRESH_RANKING: string = "TH_REFRESH_RANKING";
        /** 刷新总的战绩 */
        public static readonly TH_REFRESH_ALL_RECORD: string = "TH_REFRESH_ALL_RECORD";
        /** 刷新大赢家 */
        public static readonly TH_REFRESH_WINNER: string = "TH_REFRESH_WINNER";

        /** 显示成员列表 */
        public static readonly TH_SHOW_MEM_LIST: string = "TH_SHOW_MEM_LIST";
        /** 显示申请成员列表 */
        public static readonly TH_SHOW_MEM_APPLY: string = "TH_SHOW_MEM_APPLY";
        /** 顯示小二列表 */
        public static readonly TH_SHOW_MEM_WAITER: string = "TH_SHOW_MEM_WAITER";

        /** 获取成员列表 */
        public static readonly TH_GET_MEM_LIST: string = "TH_GET_MEM_LIST";
        /** 获取申请成员列表 */
        public static readonly TH_GET_MEM_APPLY: string = "TH_GET_MEM_APPLY";

        /** 查看茶楼战绩排行榜消息 */
        public static readonly TH_SHOW_TEA_HOUSE_RANK_LIST: string = "TH_SHOW_TEA_HOUSE_RANK_LIST";

        /** 茶楼详情高权限踢出玩家 */
        public static readonly TH_DETAIL_REMOVE_PLAYER: string = "TH_DETAIL_REMOVE_PLAYER";

        protected init(): void {
            let self = this;
            let vProxy: TeaHouseProxy = TeaHouseProxy.getInstance();
            self._proxys.push(vProxy);

            //注册服务端指令
            let vServerCmds: Array<ServerCmd> = self._serverCmds;
            vServerCmds.push(ServerCmd.buildSendCmd(MsgCmdConstant.MSG_CREATE_TEAHOUSE));
            vServerCmds.push(ServerCmd.buildCallBack(MsgCmdConstant.MSG_CREATE_TEAHOUSE_ACK, CreateTeaHouseMsgACK, vProxy.exeCreateTeaHouseMsgACK, vProxy));
            vServerCmds.push(ServerCmd.buildCallBack(MsgCmdConstant.MSG_ACCESS_TEAHOUSE_LAYER_ACK, AccessTeaHouseLayerMsgAck, vProxy.exeAccessTeaHouseLayerMsgAck, vProxy));
            vServerCmds.push(ServerCmd.buildCallBack(MsgCmdConstant.MSG_GET_TEAHOUSE_LAYER_LIST_ACK, GetTeaHouseLayerListMsgAck, vProxy.exeGetTeaHouseLayerListMsgAck, vProxy));
            vServerCmds.push(ServerCmd.buildCallBack(MsgCmdConstant.MSG_ACCESS_TEAHOUSE_ACK, AccessTeaHouseMsgAck, vProxy.exeAccessTeaHouseMsgAck, vProxy));
            vServerCmds.push(ServerCmd.buildCallBack(MsgCmdConstant.MSG_ADD_TEAHOUSE_MEMEBER_ACK, AddTeaHouseMemberMsgAck, vProxy.exeAddTeahouseMemberMsgAck, vProxy));
            vServerCmds.push(ServerCmd.buildCallBack(MsgCmdConstant.MSG_UPDATE_TEAHOUSE_DESK, UpdateTeaHouseDeskMsgAck, vProxy.exeUpdateTeaHouseDeskMsgAck, vProxy));
            vServerCmds.push(ServerCmd.buildCallBack(MsgCmdConstant.MSG_APPLY_TEAHOUSE_ACK, ApplyTeaHouseMsgAck, vProxy.exeApplyTeaHouseMsgAck, vProxy));
            vServerCmds.push(ServerCmd.buildCallBack(MsgCmdConstant.MSG_TEAHOUSE_SHOW_MEMBER_LIST_ACK, ShowTeaHouseMemberListMsgAck, vProxy.exeShowTeaHouseMemberListMsgAck, vProxy));
            vServerCmds.push(ServerCmd.buildCallBack(MsgCmdConstant.MSG_TEAHOUSE_SHOW_APPLY_LIST_ACK, ShowApplyTeaHouseListMsgAck, vProxy.exeShowApplyTeaHouseListMsgAck, vProxy));
            vServerCmds.push(ServerCmd.buildCallBack(MsgCmdConstant.MSG_TEAHOUSE_BASIC_SETTING_ACK, TeaHouseBasicSettingMsgAck, vProxy.exeTeaHouseBasicSettingMsgAck, vProxy));
            vServerCmds.push(ServerCmd.buildCallBack(MsgCmdConstant.MSG_OPT_TEAHOUSE_APPLY_ACK, OptTeaHouseApplyMsgAck, vProxy.exeOptTeaHouseApplyMsgAck, vProxy));
            vServerCmds.push(ServerCmd.buildCallBack(MsgCmdConstant.MSG_OPT_TEAHOUSE_MEMBER_ACK, OptMemberStateMsgAck, vProxy.exeOptMemberStateMsgAck, vProxy));
            vServerCmds.push(ServerCmd.buildCallBack(MsgCmdConstant.MSG_OPT_TEAHOUSE_DIAMOND_ACK, OptTeaHouseDiamondMsgAck, vProxy.exeOptTeaHouseDiamondMsgAck, vProxy));
            vServerCmds.push(ServerCmd.buildCallBack(MsgCmdConstant.MSG_OPT_TEAHOUSE_STATE_ACK, OptTeaHouseStateMsgAck, vProxy.exeOptTeaHouseStateMsgAck, vProxy));
            vServerCmds.push(ServerCmd.buildCallBack(MsgCmdConstant.MSG_GET_TEAHOUSE_MY_RECORD_ACK, GetTeaHouseMyRecordMsgAck, vProxy.exeGetTeaHouseMyRecordMsgAck, vProxy));
            vServerCmds.push(ServerCmd.buildCallBack(MsgCmdConstant.MSG_GET_TEAHOUSE_ALL_RECORD_ACK, GetTeaHouseAllRecordMsgAck, vProxy.exeGetTeaHouseAllRecordMsgAck, vProxy));
            vServerCmds.push(ServerCmd.buildCallBack(MsgCmdConstant.MSG_BIG_WINNER_SHOW_AND_OPT_ACK, BigWinnerShowAndOptMsgAck, vProxy.exeBigWinnerShowAndOptMsgAck, vProxy));
            vServerCmds.push(ServerCmd.buildCallBack(MsgCmdConstant.MSG_GET_TEAHOUSE_PERFORMANCE_ACK, GetTeaHousePerformanceMsgAck, vProxy.exeGetTeaHousePerformanceMsgAck, vProxy));
            vServerCmds.push(ServerCmd.buildCallBack(MsgCmdConstant.MSG_SHOW_TEAHOUSE_WARS_LIST_ACK, ShowTeaHouseWarsListMsgAck, vProxy.exeShowTeaHouseWarsListMsgAck, vProxy));
            vServerCmds.push(ServerCmd.buildCallBack(MsgCmdConstant.MSG_EXIT_TEAHOUSE_ACK, ExitTeaHouseMsgAck, vProxy.exeExitTeaHouseMsgAck, vProxy));
            vServerCmds.push(ServerCmd.buildCallBack(MsgCmdConstant.MSG_TEAHOUSE_APPLY_COUNT_ACK, TeaHouseApplyCountMsgAck, vProxy.exeTeaHouseApplyCountMsgAck, vProxy));
            vServerCmds.push(ServerCmd.buildTranspond(MsgCmdConstant.MSG_SHOW_TEAHOUSE_RANKLIST_ACK, ShowTeaHouseRankListMsgAck, TeaHouseModule.TH_SHOW_TEA_HOUSE_RANK_LIST));

            vServerCmds.push(ServerCmd.buildCallBack(MsgCmdConstant.MSG_INVITE_TO_JOIN_GAME_MEMBER_LIST_ACK, InviteToJoinMemberListMsgAck, vProxy.exeInviteToJoinMemberListMsgAck, vProxy));
            vServerCmds.push(ServerCmd.buildCallBack(MsgCmdConstant.MSG_INVITE_TO_JOIN_GAME_ACK, InviteToJoinGameMsgAck, vProxy.exeInviteToJoinGameMsgAck, vProxy));
            vServerCmds.push(ServerCmd.buildCallBack(MsgCmdConstant.MSG_INVITE_TO_JOIN_GAME_LOGIC_ACK, InviteToJoinGameLogicHandlerMsgAck, vProxy.exeInviteToJoinGameLogicHandlerMsgAck, vProxy));

            //注册客户端指令
            let vCommands = self._commands;
            vCommands.push(new CmdVO(TeaHouseModule.TH_ACCESS_FLOOR, TeaHouseCmd));
            vCommands.push(new CmdVO(TeaHouseModule.TH_IS_OFF, TeaHouseCmd));
            vCommands.push(new CmdVO(TeaHouseModule.TH_DETAIL_REMOVE_PLAYER, TeaHouseCmd));

            //注册序列化对象
            SerializerCache.registerByName(TeaHouseDeskInfo.NAME, TeaHouseDeskInfo);
            SerializerCache.registerByName(TeaHouseLayer.NAME, TeaHouseLayer);
            SerializerCache.registerByName(TeaHouse.NAME, TeaHouse);
            SerializerCache.registerByName(TeaHouseApply.NAME, TeaHouseApply);
            SerializerCache.registerByName(TeaHouseMember.NAME, TeaHouseMember);
            SerializerCache.registerByName(TeaHousePerformanceAll.NAME, TeaHousePerformanceAll);
            SerializerCache.registerByName(TeaHouseWarList.NAME, TeaHouseWarList);
            SerializerCache.registerByName(TeaHouseRankItem.NAME, TeaHouseRankItem);
            // SerializerCache.registerByName(TeaHouseDeskInfo.NAME, TeaHouseDeskInfo);
        }
    }
}