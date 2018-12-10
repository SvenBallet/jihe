module FL {
    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase - MJGameModule
     * @Description:  //麻将游戏模块
     * @Create: DerekWu on 2017/11/14 18:48
     * @Version: V1.0
     */
    export class MJGameModule extends FL.ModuleBase {

        /** 模块名 */
        public static readonly NAME = "MJGameModule";
        /** 单例 */
        private static _onlyOne:MJGameModule;

        private constructor() {
            super();
        }

        public static getInstance():MJGameModule {
            if (!this._onlyOne) {
                this._onlyOne = new MJGameModule();
            }
            return this._onlyOne;
        }

        /** =============客户端 指令开始================= */
        /** 进入麻将房间 */
        public static readonly MJGAME_INTO_ROOM:string = "MJGAME_INTO_ROOM";
        /** 开始麻将游戏 */
        public static readonly MJGAME_START_GAME:string = "MJGAME_START_GAME";
        /** 麻将游戏结束，用来告知所有的界面，游戏已经结束了，但是并不马上打开牌局结束界面，牌局结算界面需要更具不同的结束类型来延迟 */
        public static readonly MJGAME_GAME_OVER:string = "MJGAME_GAME_OVER";
        /** VIP房间结算 */
        public static readonly MJGAME_VIP_ROOM_CLOSE:string = "MJGAME_VIP_ROOM_CLOSE";
        /** 打开游戏结束面板 */
        public static readonly MJGAME_OPEN_GAME_OVER_VIEW:string = "MJGAME_OPEN_GAME_OVER_VIEW";
        /** 等待或者关闭VIP房间 */
        public static readonly MJGAME_WAITING_OR_CLOSE_VIP:string = "MJGAME_WAITING_OR_CLOSE_VIP";

        /** 更新玩家信息指令 新玩家加入 玩家离开 gps显示标志等 */
        public static readonly MJGAME_UPDATE_PLAYER:string = "MJGAME_UPDATE_PLAYER";
        /** 玩家正式打出牌 */
        public static readonly MJGAME_CHU_PAI:string = "MJGAME_CHU_PAI";
        /** 玩家摸到一张牌后，提醒玩家出牌，顺便回附带是否可以吃碰杠听胡等 */
        public static readonly MJGAME_REMIND_CHU_PAI:string = "MJGAME_REMIND_CHU_PAI";
        /** 给选中的牌在中间出牌区域增加遮罩 */
        public static readonly MJGAME_ADD_SHADE_TO_SELECT:string = "MJGAME_ADD_SHADE_TO_SELECT";
        /** 删除所有中间区域在出牌上的遮罩 */
        public static readonly MJGAME_DEL_ALL_CHU_CARD_SHADE:string = "MJGAME_DEL_ALL_CHU_CARD_SHADE";
        /** 刷新手牌 */
        public static readonly MJGAME_REFRESH_HAND_PAI:string = "MJGAME_REFRESH_HAND_PAI";
        /** 补花指令 */
        public static readonly MJGAME_BU_HUA:string = "MJGAME_BUHUA";
        /** 吃 */
        public static readonly MJGAME_CHI:string = "MJGAME_CHI";
        /** 碰 */
        public static readonly MJGAME_PENG:string = "MJGAME_PENG";
        /** 明杠 */
        public static readonly MJGAME_MING_GANG:string = "MJGAME_MING_GANG";
        /** 暗杠 */
        public static readonly MJGAME_AN_GANG:string = "MJGAME_AN_GANG";
        /** 补杠 */
        public static readonly MJGAME_BU_GANG:string = "MJGAME_BU_GANG";
        /** 听牌了 */
        public static readonly MJGAME_TING:string = "MJGAME_TING";
        /** 胡 */
        public static readonly MJGAME_HU:string = "MJGAME_HU";
        /** 牌局中分数更新 */
        public static readonly MJGAME_SCORE_UPDATE:string = "MJGAME_SCORE_UPDATE";
        /** 提示轮到谁操作了 */
        public static readonly MJGAME_TIP_PLAYER_HANDLE:string = "MJGAME_TIP_PLAYER_HANDLE";
        /** 玩家打出的牌，被吃碰杠走了 */
        public static readonly MJGAME_REMOE_CHU_CARD:string = "MJGAME_REMOE_CHU_CARD";
        /** 通知玩家更新胡牌列表 */
        public static readonly MJGAME_HU_CARD_LIST_UPDATE:string = "MJGAME_HU_CARD_LIST_UPDATE";
        /** 通知玩家取消操作 */
        public static readonly MJGAME_OPERATION_CANCEL:string = "MJGAME_OPERATION_CANCEL";
        /** 我自己超时自动出牌 */
        public static readonly MJGAME_MY_OVERTIME_AUTO_CHU:string = "MJGAME_MY_OVERTIME_AUTO_CHU";

        /** 播放中鸟动画 */
        public static readonly MJGAME_PLAY_ZHONG_NIAO: string = "MJGAME_PLAY_ZHONG_NIAO";

        /** 淮北玩法，开局通知玩家选择下坐拉跑 */
        public static readonly MJGAME_NOTIFY_START_ZUO_LA_PAO:string = "MJGAME_NOTIFY_START_ZUO_LA_PAO";
        /** 淮北玩法，玩家选择的下坐拉跑 */
        public static readonly MJGAME_SELECTED_ZUO_LA_PAO:string = "MJGAME_SELECTED_ZUO_LA_PAO";
        /** 砀山玩法，开局通知玩家选择下码 */
        public static readonly MJGAME_NOTIFY_START_XIA_MA:string = "MJGAME_NOTIFY_START_XIA_MA";
        /** 砀山玩法，玩家选择的下码 */
        public static readonly MJGAME_SELECTED_XIA_MA:string = "MJGAME_SELECTED_XIA_MA";

        /** 牌局回放中的摸牌指令 */
        public static readonly MJGAME_REPLAY_MO_PAI:string = "MJGAME_REPLAY_MO_PAI";

        /** 互动表情 */
        public static readonly MJGAME_SEND_PROS:string = "MJGAME_SEND_PROS";
        /** 表情 */
        public static readonly MJGAME_SEND_FACE:string = "MJGAME_SEND_FACE";
        /** 快捷文字 */
        public static readonly MJGAME_SEND_QUICK_TEXT:string = "MJGAME_SEND_QUICK_TEXT";
        /** 文字 */
        public static readonly MJGAME_SEND_TEXT:string = "MJGAME_SEND_TEXT";

        /** 添加滚动公告 */
        public static readonly MJGAME_ADD_SCROLL_MSG:string = "MJGAME_ADD_SCROLL_MSG";


        /** =============客户端 指令结束================= */

        protected init(): void {
            let self = this;
            let vProxy:MJGameProxy = MJGameProxy.getInstance();
            self._proxys.push(vProxy);

            //初始化麻将图片资源
            MJGameHandler.initCardResMap();
            //初始化麻将声音资源
            MJGameSoundHandler.initCardSoundResMap();

            //注册服务端指令
            let vServerCmds:Array<ServerCmd> = self._serverCmds;
            vServerCmds.push(ServerCmd.buildSendCmd(MsgCmdConstant.MSG_GAME_START_GAME_REQUEST));
            vServerCmds.push(ServerCmd.buildCallBack(MsgCmdConstant.MSG_GAME_START_GAME_REQUEST_ACK, RequestStartGameMsgAck, vProxy.exeRequestStartGameMsgAck, vProxy));
            vServerCmds.push(ServerCmd.buildSendCmd(MsgCmdConstant.MSG_GAME_GAME_OPERTAION));
            vServerCmds.push(ServerCmd.buildCallBack(MsgCmdConstant.MSG_GAME_GAME_OPERTAION_ACK, PlayerGameOpertaionAckMsg, vProxy.exePlayerGameOpertaionAckMsg1, vProxy));
            vServerCmds.push(ServerCmd.buildCallBack(MsgCmdConstant.MSG_GAME_START_GAME, GameStartMsg, vProxy.exeGameStartMsg, vProxy));
            vServerCmds.push(ServerCmd.buildCallBack(MsgCmdConstant.MSG_GAME_PLAYER_OPERATION_NOTIFY, PlayerOperationNotifyMsg, vProxy.exePlayerOperationNotifyMsg1, vProxy));
            vServerCmds.push(ServerCmd.buildCallBack(MsgCmdConstant.MSG_GAME_PLAYER_TABLE_OPERATION, PlayerTableOperationMsg, vProxy.exePlayerTableOperationMsg1, vProxy));
            // vServerCmds.push(ServerCmd.buildSendCmd(MsgCmdConstant.MSG_GAME_GAME_OVER));
            vServerCmds.push(ServerCmd.buildCallBack(MsgCmdConstant.MSG_GAME_GAME_OVER_ACK, PlayerGameOverMsgAck, vProxy.exePlayerGameOverMsgAck, vProxy));
            vServerCmds.push(ServerCmd.buildSendCmd(MsgCmdConstant.MSG_GAME_VIP_CREATE_ROOM));
            vServerCmds.push(ServerCmd.buildCallBack(MsgCmdConstant.MSG_GAME_VIP_ROOM_CLOSE, VipRoomCloseMsg, vProxy.exeVipRoomCloseMsg, vProxy));
            vServerCmds.push(ServerCmd.buildCallBack(MsgCmdConstant.MSG_UPDATE_GPS_POSITION, UpdatePlayerGPSMsg, vProxy.exeUpdatePlayerGPSMsg, vProxy));

            // 淮北玩法坐拉跑
            vServerCmds.push(ServerCmd.buildTranspond(MsgCmdConstant.MSG_ZUO_LA_PAO_MSG, PlayerZuoLaPaoNotifyMsg, MJGameModule.MJGAME_NOTIFY_START_ZUO_LA_PAO));
            vServerCmds.push(ServerCmd.buildCallBack(MsgCmdConstant.MSG_ZUO_LA_PAO_MSG_ACK, PlayerZuoLaPaoNotifyMsgAck, vProxy.exePlayerZuoLaPaoNotifyMsgAck1, vProxy));

            // 砀山玩法下码
            vServerCmds.push(ServerCmd.buildTranspond(MsgCmdConstant.MSG_XIA_MA_MSG, PlayerXiaMaNotifyMsg, MJGameModule.MJGAME_NOTIFY_START_XIA_MA));
            vServerCmds.push(ServerCmd.buildCallBack(MsgCmdConstant.MSG_XIA_MA_VALUE_MSG, PlayerXiaMaValueNotifyMsg, vProxy.exePlayerXiaMaValueNotifyMsg1, vProxy));

            vServerCmds.push(ServerCmd.buildCallBack(MsgCmdConstant.MSG_TALKING_IN_GAME, TalkingInGameMsg, vProxy.exeTalkingInGameMsg, vProxy));
            vServerCmds.push(ServerCmd.buildCallBack(MsgCmdConstant.MSG_SYSTEM_NOTIFY_MSG, SystemNotifyMsg, vProxy.exeSystemNotifyMsg, vProxy));
            // 游戏日志
            vServerCmds.push(ServerCmd.buildCallBack(MsgCmdConstant.MSG_GET_PLAYER_GAME_LOG, GetPlayerGameLogMsg, vProxy.exeGetPlayerGameLogMsg, vProxy));
            // 游戏弹窗通知
            vServerCmds.push(ServerCmd.buildCallBack(MsgCmdConstant.MSG_SHOW_TIP_MSG_ACK, ShowTipAckMsg, vProxy.exeShowTipAckMsg, vProxy));

            //注册客户端指令
            let vCommands = self._commands;
            vCommands.push(new CmdVO(MJGameModule.MJGAME_INTO_ROOM, MJGameCmd));
            vCommands.push(new CmdVO(MJGameModule.MJGAME_START_GAME, MJGameCmd));
            vCommands.push(new CmdVO(MJGameModule.MJGAME_HU, MJGameCmd));
            vCommands.push(new CmdVO(MJGameModule.MJGAME_OPEN_GAME_OVER_VIEW, MJGameCmd));
            vCommands.push(new CmdVO(MJGameModule.MJGAME_VIP_ROOM_CLOSE, MJGameCmd));
            vCommands.push(new CmdVO(MJGameModule.MJGAME_WAITING_OR_CLOSE_VIP, MJGameCmd));
            vCommands.push(new CmdVO(MJGameModule.MJGAME_ADD_SCROLL_MSG, MJGameCmd));

            vCommands.push(new CmdVO(MJGameModule.MJGAME_NOTIFY_START_ZUO_LA_PAO, MJGameCmd));
            vCommands.push(new CmdVO(MJGameModule.MJGAME_NOTIFY_START_XIA_MA, MJGameCmd));

            vCommands.push(new CmdVO(MJGameModule.MJGAME_PLAY_ZHONG_NIAO, MJGameCmd));
            // vCommands.push(new CmdVO(CommonModule.COMMON_INIT_LOGIN_INFO, CommonCmd));
            // vCommands.push(new CmdVO(CommonModule.COMMON_ERROR_ASYNC, CommonCmd));
            // vCommands.push(new CmdVO(CommonModule.COMMON_SHOW_PROMPT, CommonCmd));
            // vCommands.push(new CmdVO(AppModule.APP_SOCKET_INIT_COMPLETE, CommonCmd));
            // vCommands.push(new CmdVO(CommonModule.COMMON_START_LOADING, LoadingCmd));

            //注册序列化对象
            SerializerCache.registerByName(SimplePlayer.NAME, SimplePlayer);
            SerializerCache.registerByName(PlayerOperationDesc.NAME, PlayerOperationDesc);
            SerializerCache.registerByName(GameLogInfo.NAME, GameLogInfo);
            SerializerCache.registerByName(PlayerZuoLaPaoInfo.NAME, PlayerZuoLaPaoInfo);
            SerializerCache.registerByName(GameOverScoreDetail.NAME, GameOverScoreDetail);
            SerializerCache.registerByName(GameOverScoreDetailItem.NAME, GameOverScoreDetailItem);

        }

    }
}