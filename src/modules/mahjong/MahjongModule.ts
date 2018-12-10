module FL {
    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase_ChangSha - MahjongModule
     * @Description:  麻将模块
     * @Create: ArielLiang on 2018/5/31 11:59
     * @Version: V1.0
     */
    export class MahjongModule extends FL.ModuleBase {

        /** 模块名 */
        public static readonly NAME = "MahjongModule";
        /** 单例 */
        private static _onlyOne: MahjongModule;

        private constructor() {
            super();
        }

        public static getInstance(): MahjongModule {
            if (!this._onlyOne) {
                this._onlyOne = new MahjongModule();
            }
            return this._onlyOne;
        }

        /** =============客户端 指令开始================= */
        /** 进入麻将桌子 */
        public static readonly MAHJONG_INTO_GAME: string = "MAHJONG_INTO_GAME";
        /** 开始麻将游戏 */
        public static readonly MAHJONG_START_GAME: string = "MAHJONG_START_GAME";
        /** 更新玩家信息指令 新玩家加入 玩家离开 gps显示标志等 */
        public static readonly MAHJONG_UPDATE_PLAYER_HEAD_AREA: string = "MAHJONG_UPDATE_PLAYER_HEAD_AREA";
        /** 玩家数量改变 */
        public static readonly MAHJONG_PLAYER_NUM_CHANGE: string = "MAHJONG_PLAYER_NUM_CHANGE";
        /** 提醒玩家出牌*/
        public static readonly MAHJONG_REMIND_CHU_PAI: string = "MAHJONG_REMIND_CHU_PAI";
        /** 摸一张牌*/
        public static readonly MAHJONG_MO_PAI: string = "MAHJONG_MO_PAI";
        /** 出牌通知*/
        public static readonly MAHJONG_CHU_PAI_NOTIFY: string = "MAHJONG_CHU_PAI_NOTIFY";
        /** 播放出牌特效和音效 */
        public static readonly MAHJONG_PLAY_CHU_PAI_EFFECT: string = "MAHJONG_PLAY_CHU_PAI_EFFECT";
        /** 刷新手牌*/
        public static readonly MAHJONG_REFRESH_HAND_CARD: string = "MAHJONG_REFRESH_HAND_CARD";
        /** 提示玩家操作的桌子提示*/
        public static readonly MAHJONG_REMIND_PLAYER_HANDLE: string = "MAHJONG_REMIND_PLAYER_HANDLE";
        /** 弹出飘选择框*/
        public static readonly MAHJONG_CHOOSE_PIAO: string = "MAHJONG_CHOOSE_PIAO";
        /** 飘分显示*/
        public static readonly MAHJONG_SHOW_PIAO: string = "MAHJONG_SHOW_PIAO";
        /** 更新听牌列表*/
        public static readonly MAHJONG_UPDATE_TING_LIST: string = "MAHJONG_UPDATE_TING_LIST";
        /** 更新胡牌列表*/
        public static readonly MAHJONG_UPDATE_HU_LIST: string = "MAHJONG_UPDATE_HU_LIST";
        /** 更新吃碰杠等动作按钮列表*/
        public static readonly MAHJONG_UPDATE_ACTION_LIST: string = "MAHJONG_UPDATE_ACTION_LIST";
        /** 互动表情 */
        public static readonly GAME_SEND_PROS: string = "GAME_SEND_PROS";
        /** 表情 */
        public static readonly GAME_SEND_FACE: string = "GAME_SEND_FACE";
        /** 快捷文字 */
        public static readonly GAME_SEND_QUICK_TEXT: string = "GAME_SEND_QUICK_TEXT";
        /** 文字 */
        public static readonly GAME_SEND_TEXT: string = "GAME_SEND_TEXT";
        /** 打开麻将游戏结束界面 */
        public static readonly MAHJONG_OPEN_GAME_OVER_VIEW: string = "MAHJONG_OPEN_GAME_OVER_VIEW";
        /** 打开麻将游戏结算界面 */
        public static readonly MAHJONG_OPEN_ROOM_OVER_VIEW: string = "MAHJONG_OPEN_ROOM_OVER_VIEW";
        /** 麻将开始抓鸟 */
        public static readonly MAHJONG_START_ZHUA_NIAO: string = "MAHJONG_START_ZHUA_NIAO";
        /** 麻将明牌 */
        public static readonly MAHJONG_PUBLISH_CARD: string = "MAHJONG_PUBLISH_CARD";
        /** 取消麻将动作 */
        public static readonly MAHJONG_ACTION_SELECT_CANCEL: string = "MAHJONG_ACTION_SELECT_CANCEL";
        /** 麻将改变cardDown，吃碰杠等 */
        public static readonly MAHJONG_CHANGE_CARD_DOWN: string = "MAHJONG_CHANGE_CARD_DOWN";
        /** 麻将动作特效 */
        public static readonly MAHJONG_ACTION_EFFECT: string = "MAHJONG_ACTION_EFFECT";
        /** 麻将移除已出的牌 */
        public static readonly MAHJONG_REMOVE_CHU_CARD: string = "MAHJONG_REMOVE_CHU_CARD";
        /** 超时自动出牌，仅用于显示*/
        public static readonly MAHJONG_GAME_MY_OVERTIME_AUTO_CHU: string = "MAHJONG_GAME_MY_OVERTIME_AUTO_CHU";
        /** 麻将 改变 分数 */
        public static readonly MAHJONG_UPDATE_SCORE: string = "MAHJONG_UPDATE_SCORE";

        /** 麻将 上方中间出牌区域箭头改变 */
        public static readonly MAHJONG_UP_CARD_MIDDLE_ARROWS_CHANGE: string = "MAHJONG_UP_CARD_MIDDLE_ARROWS_CHANGE";

        /** 麻将打一张牌 */
        public static readonly MAHJONG_PLAY_ONE_CARD: string = "MAHJONG_PLAY_ONE_CARD";
        /** 麻将显示两个杠牌 */
        public static readonly MAHJONG_CHANG_SHA_VIEW_GANG_CARD: string = "MAHJONG_CHANG_SHA_VIEW_GANG_CARD";
        /** 麻将杠后打开选择动作界面 */
        public static readonly MAHJONG_SHOW_SELECT_ACTION_VIEW: string = "MAHJONG_SHOW_SELECT_ACTION_VIEW";
        /** 麻将丢色子 */
        public static readonly MAHJONG_THROW_SHAI_ZI: string = "MAHJONG_THROW_SHAI_ZI";

        /** 长沙麻将提示是否海底摸一把 */
        public static readonly MAHJONG_CHANG_SHA_REMINDER_HAI_DI_MO: string = "MAHJONG_CHANG_SHA_REMINDER_HAI_DI_MO";


        /** 麻将动作 玩家选择过 */
        public static readonly MAHJONG_ACTION_SELECT_GUO: string = "MAHJONG_ACTION_SELECT_GUO";
        /** 回放中播放过胡、碰、杠 */
        public static readonly MAHJONG_OPT_GUO: string = "MAHJONG_OPT_GUO";

        /** =============客户端 指令结束================= */

        protected init(): void {
            let self = this;
            let vProxy: MahjongProxy = MahjongProxy.getInstance();
            self._proxys.push(vProxy);

            //初始化麻将图片资源
            MahjongHandler.initCardResMap();
            //初始化麻将声音资源
            MahjongSoundHandler.initCardSoundResMap();

            //注册服务端指令
            let vServerCmds: Array<ServerCmd> = self._serverCmds;
            vServerCmds.push(ServerCmd.buildSendCmd(MsgCmdConstant.MSG_MAHJONG_PLAY_CARD));
            vServerCmds.push(ServerCmd.buildCallBack(MsgCmdConstant.MSG_MAHJONG_PLAY_CARD_ACK, MahjongPlayCardMsgAck, vProxy.exeMahjongPlayCardMsgAck1, vProxy));
            vServerCmds.push(ServerCmd.buildCallBack(MsgCmdConstant.MSG_MAHJONG_MO_ONE_CARD_ACK, MahjongMoOneCardMsgAck, vProxy.exeMahjongMoOneCardMsgAck1, vProxy));
            vServerCmds.push(ServerCmd.buildCallBack(MsgCmdConstant.MSG_MAHJONG_REMIND_PLAYER_OPERATION_ACK, MahjongRemindPlayerOperationMsgAck, vProxy.exeMahjongRemindPlayerOperationMsgAck1, vProxy));
            vServerCmds.push(ServerCmd.buildCallBack(MsgCmdConstant.MSG_START_CIRCLE_MAHJONG_GAME_ACK, MahjongStartCircleGameMsgAck, vProxy.exeMahjongStartCircleGameMsgAck1, vProxy));
            vServerCmds.push(ServerCmd.buildCallBack(MsgCmdConstant.MSG_MAHJONG_SEND_ITEM_TO_CHOOSE, MahjongSendItemToChosenMsg, vProxy.exeMahjongSendItemToChosenMsg1, vProxy));
            vServerCmds.push(ServerCmd.buildSendCmd(MsgCmdConstant.MSG_MAHJONG_PLAYER_CHOOSE_ITEM));
            vServerCmds.push(ServerCmd.buildCallBack(MsgCmdConstant.MSG_MAHJONG_PLAYER_CHOOSE_ITEM_ACK, MahjongPlayerChooseItemMsgAck, vProxy.exeMahjongPlayerChooseItemMsgAck1, vProxy));
            vServerCmds.push(ServerCmd.buildCallBack(MsgCmdConstant.MSG_MAHJONG_SELECT_PLAY_CARD_TING_MSG_ACK, MahjongSelectPlayCardTingMsgAck, vProxy.exeMahjongSelectPlayCardTingMsgAck1, vProxy));
            vServerCmds.push(ServerCmd.buildCallBack(MsgCmdConstant.MSG_MAHJONG_CHANGE_CARD_DOWN_ACK, MahjongChangeCardDownMsgAck, vProxy.exeMahjongChangeCardDownMsgAck1, vProxy));
            vServerCmds.push(ServerCmd.buildCallBack(MsgCmdConstant.MSG_MAHJONG_ALREADY_TING_MSG_ACK, MahjongAlreadyTingMsgAck, vProxy.exeMahjongAlreadyTingMsgAck1, vProxy));
            vServerCmds.push(ServerCmd.buildSendCmd(MsgCmdConstant.MSG_MAHJONG_ACTION_SELECT));
            vServerCmds.push(ServerCmd.buildCallBack(MsgCmdConstant.MSG_MAHJONG_ACTION_SELECT_ACK, MahjongActionSelectMsgAck, vProxy.exeMahjongActionSelectMsgAck1, vProxy));
            vServerCmds.push(ServerCmd.buildCallBack(MsgCmdConstant.MSG_MAHJONG_ACTION_RESULT_SET_ACK, MahjongActionResultSetMsgAck, vProxy.exeMahjongActionResultSetMsgAck1, vProxy));
            vServerCmds.push(ServerCmd.buildCallBack(MsgCmdConstant.MSG_MAHJONG_GAME_OVER_ACK, MahjongGameOverMsgAck, vProxy.exeMahjongGameOverMsgAck, vProxy));
            vServerCmds.push(ServerCmd.buildTranspond(MsgCmdConstant.MSG_MAHJONG_GAME_OVER_ZHUA_NIAO_ACK, MahjongGameOverZhuaNiaoMsgAck, MahjongModule.MAHJONG_START_ZHUA_NIAO));
            vServerCmds.push(ServerCmd.buildTranspond(MsgCmdConstant.MSG_MAHJONG_OPEN_GAME_OVER_VIEW_ACK, MahjongOpenGameOverViewMsgAck, MahjongModule.MAHJONG_OPEN_GAME_OVER_VIEW));
            vServerCmds.push(ServerCmd.buildTranspond(MsgCmdConstant.MSG_MAHJONG_PUBLISH_CARD_ACK, MahjongPublishCardMsgAck, MahjongModule.MAHJONG_PUBLISH_CARD));
            vServerCmds.push(ServerCmd.buildTranspond(MsgCmdConstant.MSG_MAHJONG_ACTION_SELECT_CANCEL_ACK, MahjongActionSelectCancelMsgAck, MahjongModule.MAHJONG_ACTION_SELECT_CANCEL));
            vServerCmds.push(ServerCmd.buildTranspond(MsgCmdConstant.MSG_MAHJONG_REMOVE_CHU_CARD_ACK, MahjongRemoveChuCardMsgAck, MahjongModule.MAHJONG_REMOVE_CHU_CARD));
            vServerCmds.push(ServerCmd.buildTranspond(MsgCmdConstant.MSG_MAHJONG_ADD_CHU_CARD_ACK, MahjongAddChuCardMsgAck, MahjongModule.MAHJONG_PLAY_ONE_CARD));
            vServerCmds.push(ServerCmd.buildTranspond(MsgCmdConstant.MSG_UPDATE_SCORE_ACK, MahjongUpdateScoreMsgAck, MahjongModule.MAHJONG_UPDATE_SCORE));
            vServerCmds.push(ServerCmd.buildCallBack(MsgCmdConstant.MSG_MAHJONG_REFRESH_HAND_CARD_ACK, MahjongRefreshHandCardMsgAck, vProxy.exeMahjongRefreshHandCardMsgAck, vProxy));

            // 长沙麻将
            vServerCmds.push(ServerCmd.buildTranspond(MsgCmdConstant.MSG_MAHJONG_CHANG_SHA_VIEW_GANG_CARD_ACK, MahjongChangShaViewGangCardMsgAck, MahjongModule.MAHJONG_CHANG_SHA_VIEW_GANG_CARD));
            vServerCmds.push(ServerCmd.buildTranspond(MsgCmdConstant.MSG_MAHJONG_CHANG_SHA_OPEN_SELECT_ACTION_VIEW_AFTER_GANG_ACK, MahjongChangShaOpenSelectActionViewAfterGangMsgAck, MahjongModule.MAHJONG_SHOW_SELECT_ACTION_VIEW));
            vServerCmds.push(ServerCmd.buildTranspond(MsgCmdConstant.MSG_MAHJONG_DIU_SHAI_ZI_ACK, MahjongDiuShaiZiMsgAck, MahjongModule.MAHJONG_THROW_SHAI_ZI));
            vServerCmds.push(ServerCmd.buildTranspond(MsgCmdConstant.MSG_MAHJONG_CHANG_SHA_REMINDER_HAI_DI_MO_ACK, MahjongChangShaReminderHaiDiMoMsgAck, MahjongModule.MAHJONG_CHANG_SHA_REMINDER_HAI_DI_MO));
            //注册客户端指令
            let vCommands = self._commands;
            vCommands.push(new CmdVO(MahjongModule.MAHJONG_INTO_GAME, MahjongCmd));
            vCommands.push(new CmdVO(MahjongModule.MAHJONG_START_GAME, MahjongCmd));
            vCommands.push(new CmdVO(MahjongModule.MAHJONG_CHOOSE_PIAO, MahjongCmd));
            vCommands.push(new CmdVO(MahjongModule.MAHJONG_START_ZHUA_NIAO, MahjongCmd));
            vCommands.push(new CmdVO(MahjongModule.MAHJONG_OPEN_GAME_OVER_VIEW, MahjongCmd));
            vCommands.push(new CmdVO(MahjongModule.MAHJONG_PUBLISH_CARD, MahjongCmd));
            vCommands.push(new CmdVO(MahjongModule.MAHJONG_SHOW_SELECT_ACTION_VIEW, MahjongCmd));
            vCommands.push(new CmdVO(MahjongModule.MAHJONG_OPEN_ROOM_OVER_VIEW, MahjongCmd));

            //注册序列化对象
            SerializerCache.registerByName(MahjongCardCityWallInfo.NAME, MahjongCardCityWallInfo);
            SerializerCache.registerByName(MahjongGameStartPlayerInfo.NAME, MahjongGameStartPlayerInfo);
            SerializerCache.registerByName(MahjongCardDown.NAME, MahjongCardDown);
            SerializerCache.registerByName(OperateInfo.NAME, OperateInfo);
            SerializerCache.registerByName(MahjongActionResult.NAME, MahjongActionResult);
            SerializerCache.registerByName(MahjongSelectPlayCardTingInfo.NAME, MahjongSelectPlayCardTingInfo);
            SerializerCache.registerByName(MahjongTingInfo.NAME, MahjongTingInfo);
            SerializerCache.registerByName(MahjongGameOverScoreDetailItem.NAME, MahjongGameOverScoreDetailItem);
            SerializerCache.registerByName(MahjongGameOverPlayerInfo.NAME, MahjongGameOverPlayerInfo);
            SerializerCache.registerByName(MahjongMaPaiInfo.NAME, MahjongMaPaiInfo);
            SerializerCache.registerByName(MahjongShaiZi.NAME, MahjongShaiZi);
            SerializerCache.registerByName(MahjongUpdateScorePlayerInfo.NAME, MahjongUpdateScorePlayerInfo);

        }

    }
}