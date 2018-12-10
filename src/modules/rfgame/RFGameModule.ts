module FL {
    export class RFGameModule extends FL.ModuleBase {
        /** 模块名 */
        public static readonly NAME = "RFGameModule";
        /** 单例 */
        private static _onlyOne: RFGameModule;

        private constructor() {
            super();
        }

        public static getInstance(): RFGameModule {
            if (!this._onlyOne) {
                this._onlyOne = new RFGameModule();
            }
            return this._onlyOne;
        }

        /** =============客户端 指令开始================= */
        /** 进入房间 */
        public static readonly RFGAME_INTO_ROOM: string = "RFGAME_INTO_ROOM";
        /** 开始游戏 */
        public static readonly RFGAME_START_GAME: string = "RFGAME_START_GAME";
        /** 刷新牌桌玩家信息显示 */
        public static readonly RFGAME_REFRESH_PLAYER_INFO: string = "RFGAME_REFRESH_PLAYER_INFO";
        /** 显示出牌 */
        public static readonly RFGAME_CHU_CARDS: string = "RFGAME_CHU_CARDS";
        /** 滚动公告 */
        public static readonly GAME_ADD_SCROLL_MSG: string = "GAME_ADD_SCROLL_MSG";

        /** 显示牌桌计时器 */
        public static readonly GAME_SHOW_TIMER: string = "GAME_SHOW_TIMER";
        /** 隐藏牌桌计时器 */
        public static readonly GAME_HIDE_TIMER: string = "GAME_HIDE_TIMER";

        /** 显示手牌操作按钮组 */
        public static readonly GAME_SHOW_CONTROL: string = "GAME_SHOW_CONTROL";
        /** 隐藏手牌操作按钮组 */
        public static readonly GAME_HIDE_CONTROL: string = "GAME_HIDE_CONTROL";

        /** 改变玩家剩余手牌数 */
        public static readonly RFGAME_CHANGE_REST_CARD_NUM: string = "RFGAME_CHANGE_REST_CARD_NUM";
        /** 改变玩家总余牌数 */
        public static readonly RFGAME_CHANGE_REST_TOTAL_NUM: string = "RFGAME_CHANGE_REST_TOTAL_NUM";
        /** 整理手牌 */
        public static readonly RESET_HAND_CARDS: string = "RESET_HAND_CARDS";
        /** 重新绘制手牌 */
        public static readonly REDRAW_HAND_CARDS: string = "REDRAW_HAND_CARDS";
        /** 移除手牌遮罩 */
        public static readonly REMOVE_CARDS_SHADE: string = "REMOVE_CARDS_SHADE";
        /** 游戏结束摊牌 */
        public static readonly GAME_OVER_SHOW_HAND: string = "GAME_OVER_SHOW_HAND";

        /** 添加报单特效 */
        public static readonly CARD_SINGLE_END: string = "CARD_SINGLE_END";

        /** 超时自动出牌，仅用于显示*/
        public static readonly GAME_MY_OVERTIME_AUTO_CHU: string = "GAME_MY_OVERTIME_AUTO_CHU";

        /** 播放卡牌动画特效 */
        public static readonly RFGAME_PLAY_CARD_ANI: string = "RFGAME_PLAY_CARD_ANI";

        /** 互动表情 */
        public static readonly GAME_SEND_PROS: string = "GAME_SEND_PROS";
        /** 表情 */
        public static readonly GAME_SEND_FACE: string = "GAME_SEND_FACE";
        /** 快捷文字 */
        public static readonly GAME_SEND_QUICK_TEXT: string = "GAME_SEND_QUICK_TEXT";
        /** 文字 */
        public static readonly GAME_SEND_TEXT: string = "GAME_SEND_TEXT";

        /** 申请解散房间 */
        public static readonly RFGAME_APPLY_DISMISS_ROOM: string = "RFGAME_APPLY_DISMISS_ROOM";
        /** 游戏结束*/
        public static readonly RFGAME_OPEN_GAME_OVER_VIEW: string = "RFGAME_OPEN_GAME_OVER_VIEW";
        /** 房间结束*/
        public static readonly RFGAME_OPEN_ROOM_OVER_VIEW: string = "RFGAME_OPEN_ROOM_OVER_VIEW";
        /** 不能离开房间了 */
        public static readonly RFGAME_CAN_NOT_LEAVE_ROOM: string = "RFGAME_CAN_NOT_LEAVE_ROOM";

        /** 更换扑克风格 */
        public static readonly RFGAME_CHANGE_POKER_STYLE: string = "RFGAME_CHANGE_POKER_STYLE";

        protected init() {
            let self = this;
            let vProxy: RFGameProxy = RFGameProxy.getInstance();
            self._proxys.push(vProxy);
            //注册服务端指令
            let vServerCmds: Array<ServerCmd> = self._serverCmds;
            vServerCmds.push(ServerCmd.buildSendCmd(MsgCmdConstant.MSG_JOIN_VIP_ROOM));
            vServerCmds.push(ServerCmd.buildCallBack(MsgCmdConstant.MSG_INTO_GAME_TABLE, NewIntoGameTableMsgAck, vProxy.exeNewIntoGameTableMsgAck, vProxy));
            vServerCmds.push(ServerCmd.buildSendCmd(MsgCmdConstant.MSG_APPLY_DISMISS_ROOM));
            vServerCmds.push(ServerCmd.buildSendCmd(MsgCmdConstant.MSG_OPER_APPLY_DISMISS_ROOM));
            vServerCmds.push(ServerCmd.buildCallBack(MsgCmdConstant.MSG_APPLY_DISMISS_ROOM_ACK, ApplyDismissRoomMsgAck, vProxy.exeApplyDismissRoomMsgAck, vProxy));
            vServerCmds.push(ServerCmd.buildSendCmd(MsgCmdConstant.MSG_NEW_TALKING_IN_GAME));
            vServerCmds.push(ServerCmd.buildCallBack(MsgCmdConstant.MSG_NEW_TALKING_IN_GAME_ACK, NewTalkingInGameMsgAck, vProxy.exeTalkingInGameMsg, vProxy));
            vServerCmds.push(ServerCmd.buildCallBack(MsgCmdConstant.MSG_TABLE_PLAYER_INFO_CHANGE_ACK, NewTablePlayerInfoChangeMsgAck, vProxy.exeNewTablePlayerInfoChangeMsgAck, vProxy));
            vServerCmds.push(ServerCmd.buildSendCmd(MsgCmdConstant.MSG_NEW_UPDATE_PLAYER_GPS_POSITION));
            vServerCmds.push(ServerCmd.buildCallBack(MsgCmdConstant.MSG_NEW_UPDATE_PLAYER_GPS_POSITION_ACK, NewUpdateGPSPositionMsgAck, vProxy.exeNewUpdateGPSPositionMsgAck, vProxy));
            vServerCmds.push(ServerCmd.buildSendCmd(MsgCmdConstant.MSG_PLAYER_LEAVE_ROOM));
            vServerCmds.push(ServerCmd.buildCallBack(MsgCmdConstant.MSG_PLAYER_LEAVE_ROOM_ACK, NewPlayerLeaveRoomMsgAck, vProxy.exeNewPlayerLeaveRoomMsgAck, vProxy));

            vServerCmds.push(ServerCmd.buildCallBack(MsgCmdConstant.MSG_START_CIRCLE_POKER_GAME, PokerStartCircleGameMsgAck, vProxy.exePokerStartCircleGameMsgAck1, vProxy));
            vServerCmds.push(ServerCmd.buildCallBack(MsgCmdConstant.MSG_POKER_REMIND_OTHER_PLAYER_OPERATION_ACK, PokerRemindOtherPlayerOperationMsgAck, vProxy.exePokerRemindOtherPlayerOperationMsgAck, vProxy));
            vServerCmds.push(ServerCmd.buildCallBack(MsgCmdConstant.MSG_POKER_REMIND_PLAY_CARD_ACK, PokerRemindPlayCardMsgAck, vProxy.exePokerRemindPlayCardMsgAck, vProxy));

            vServerCmds.push(ServerCmd.buildSendCmd(MsgCmdConstant.MSG_PLAY_POKER_CARD_NOTIFY));
            vServerCmds.push(ServerCmd.buildCallBack(MsgCmdConstant.MSG_PLAY_POKER_CARD_NOTIFY_ACK, PokerPlayCardNotifyMsgAck, vProxy.exePokerPlayCardNotifyMsgAck, vProxy));

            vServerCmds.push(ServerCmd.buildSendCmd(MsgCmdConstant.MSG_NOT_PLAY_POKER_CARD_NOTIFY));
            vServerCmds.push(ServerCmd.buildCallBack(MsgCmdConstant.MSG_NOT_PLAY_POKER_CARD_NOTIFY_ACK, PokerNotPlayCardNotifyMsgAck, vProxy.exePokerNotPlayCardNotifyMsgAck, vProxy));

            vServerCmds.push(ServerCmd.buildCallBack(MsgCmdConstant.MSG_POKER_GAME_OVER_VIEW_HAND_CRADS_ACK, PokerGameOverViewHandCardsMsgAck, vProxy.exePokerGameOverViewHandCardsMsgAck, vProxy));

            vServerCmds.push(ServerCmd.buildCallBack(MsgCmdConstant.MSG_VIP_ROOM_OVER_SETTLE_ACCOUNTS, NewVipRoomOverSettleAccountsMsgAck, vProxy.exeNewVipRoomOverSettleAccountsMsgAck, vProxy));
            vServerCmds.push(ServerCmd.buildCallBack(MsgCmdConstant.MSG_PAODEKUAI_GAME_OVER_SETTLE_ACCOUNTS, PaoDeKuaiGameOverSettleAccountsMsgAck, vProxy.exePaoDeKuaiGameOverSettleAccountsMsgAck, vProxy));

            vServerCmds.push(ServerCmd.buildSendCmd(MsgCmdConstant.MSG_NEW_GAME_TABLE_PLAYER_READY));
            vServerCmds.push(ServerCmd.buildSendCmd(MsgCmdConstant.MSG_NEW_GAME_TABLE_TUO_GUAN));
            vServerCmds.push(ServerCmd.buildCallBack(MsgCmdConstant.MSG_NEW_GAME_TABLE_TUO_GUAN_ACK, NewGameTableTuoGuanMsgAck, vProxy.exeNewGameTableTuoGuanMsgAck, vProxy));
            vServerCmds.push(ServerCmd.buildCallBack(MsgCmdConstant.NEW_GAME_TABLE_CAN_NOT_LEAVE_ROOM, NewGameTableCanNotLeaveRoomMsgAck, vProxy.exeNewGameTableCanNotLeaveRoomMsgAck, vProxy));

            vServerCmds.push(ServerCmd.buildCallBack(MsgCmdConstant.MSG_POKER_REFRESH_HISTORY, PokerRefreshHistoryMsgAck, vProxy.exePokerRefreshHistoryMsgAck, vProxy));

            // 游戏日志

            // 游戏弹窗通知

            //注册客户端指令
            let vCommands = self._commands;
            vCommands.push(new CmdVO(RFGameModule.RFGAME_INTO_ROOM, RFGameCmd));
            vCommands.push(new CmdVO(RFGameModule.RFGAME_START_GAME, RFGameCmd));
            vCommands.push(new CmdVO(RFGameModule.GAME_ADD_SCROLL_MSG, RFGameCmd));
            vCommands.push(new CmdVO(RFGameModule.RFGAME_APPLY_DISMISS_ROOM, RFGameCmd));
            vCommands.push(new CmdVO(RFGameModule.RFGAME_OPEN_GAME_OVER_VIEW, RFGameCmd));
            vCommands.push(new CmdVO(RFGameModule.RFGAME_OPEN_ROOM_OVER_VIEW, RFGameCmd));

            //注册序列化对象
            SerializerCache.registerByName(GamePlayer.NAME, GamePlayer);
            SerializerCache.registerByName(PokerGameStartPlayerInfo.NAME, PokerGameStartPlayerInfo);
            SerializerCache.registerByName(VipRoomOverPlayer.NAME, VipRoomOverPlayer);
            SerializerCache.registerByName(PokerPlayerHandCard.NAME, PokerPlayerHandCard);
            SerializerCache.registerByName(PaoDeKuaiGameOverPlayer.NAME, PaoDeKuaiGameOverPlayer);
            SerializerCache.registerByName(PokerOutCardItem.NAME, PokerOutCardItem);
        }
    }
}