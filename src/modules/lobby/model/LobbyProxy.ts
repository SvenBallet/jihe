module FL {
    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase - LobbyProxy
     * @Description:  //大厅代理
     * @Create: DerekWu on 2017/11/10 18:49
     * @Version: V1.0
     */
    export class LobbyProxy extends puremvc.Proxy {

        /** 代理名 */
        public static readonly NAME: string = "LobbyProxy";
        /** 单例 */
        private static _only: LobbyProxy;

        private constructor() {
            super(LobbyProxy.NAME);
        }

        public static getInstance(): LobbyProxy {
            if (!this._only) {
                this._only = new LobbyProxy();
            }
            return this._only;
        }

        /**
         * 处理登录返回，只处理本模块的数据
         * @param {FL.LoginMsgAck} msg
         */
        public exeLoginMsgAck(msg: LoginMsgAck): void {
            if (msg) {
                LobbyData.playerVO = new PlayerVO(msg.player);
                LobbyData.clientConfig = msg.clientParma;
                for (let configParam of msg.clientParma) {
                    if (configParam.paraID == 4001) {
                        LobbyData.anounceMsgText = configParam.paraDesc;
                        break;
                    }
                }
                LobbyData.noticeIsExit = msg.noticeIsExit;
                LobbyData.noticeTitle = msg.noticeTitle;
                LobbyData.noticeContent = msg.noticeContent;
                LobbyData.freeGame = msg.unused_3;
                LobbyData.handsDefintions = msg.handsDefintions;
                LobbyData.diamondCosts = msg.unused_2;
                LobbyData.mahjongNeedDiamond = msg.mahjongNeedDiamond;
                LobbyData.pokerNeedDiamond = msg.pokerNeedDiamond;
                // LobbyData.zipaiNeedDiamond = msg.zipaiNeedDiamond;
                // 监听关闭界面事件
                if (GConf.Conf.useWXAuth) {
                    window.onbeforeunload = function (event) {
                        event.returnValue = "您确定要退出游戏码？";
                        return "您确定要退出游戏码？";
                    }
                }

                // 设置新的分享title 和 描述
                let vTitleSystemConfigPara: SystemConfigPara = LobbyHandler.getOneClientConfig(GameConfigConstant.CONF_H5_SHARE_TO_FRIENDS_TITLE);
                let vDescSystemConfigPara: SystemConfigPara = LobbyHandler.getOneClientConfig(GameConfigConstant.CONF_H5_SHARE_TO_FRIENDS_DESC);
                if (vTitleSystemConfigPara && vDescSystemConfigPara) {
                    (<any>GConf.Conf).shareToFriendsTitle = vTitleSystemConfigPara.valueStr;
                    (<any>GConf.Conf).shareToFriendsDesc = vDescSystemConfigPara.valueStr;
                    // 修复当前分享位置，这里可以理解为重设
                    WeChatJsSdkHandler.repairCurrentShareLocation();
                }

            }
        }

        /**
         * 处理更新玩家属性消息
         * @param {FL.UpdatePlayerPropertyMsg} msg
         */
        public exeUpdatePlayerPropertyMsg(msg: UpdatePlayerPropertyMsg): void {
            egret.log(msg);
            let vPlayerVO: PlayerVO = LobbyData.playerVO;
            vPlayerVO.gold.value = msg.gold;
            vPlayerVO.diamond.value = msg.diamond;
            vPlayerVO.playerType = msg.playerType;
            vPlayerVO.parentIndex = msg.parentIndex;
            vPlayerVO.payBack = msg.payBack;
            vPlayerVO.inviteCode = msg.inviteCode;
            vPlayerVO.agentLevel = msg.agentLevel;
            // TODO 还有其他属性要更新
        }

        /**
         * 处理滚动公告消息
         * @param {FL.ScrollMsg} msg
         */
        public exeScrollMsg(msg: ScrollMsg): void {
            MJGameData.ScrollMsg = msg;
            /**大厅的滚动公告*/
            LobbyRightTopView.getInstance().showAnnounceMsg(msg.msg, msg.removeAllPreviousMsg);
            if (GameConstant.CURRENT_HANDLE.getGameState() != EGameState.NULL) {
                if (GameConstant.CURRENT_GAMETYPE == EGameType.MJ) {
                    /**打麻将界面的滚动公告*/
                    MvcUtil.send(MJGameModule.MJGAME_ADD_SCROLL_MSG);
                } else if (GameConstant.CURRENT_GAMETYPE == EGameType.RF) {
                    //跑得快界面的滚动公告
                    MvcUtil.send(RFGameModule.GAME_ADD_SCROLL_MSG);
                }
            }
        }

        /** 处理大厅茶楼列表消息返回 */
        public exeShowJoinTeaHouseListMsgAck(msg: ShowJoinTeaHouseListMsgAck) {
            console.log(msg);
            LobbyData.teaHouseListData = msg.result;
            MvcUtil.send(LobbyModule.LOBBY_REFRESH_THLIST);
        }

        /**处理实名认证消息返回 */
        public exePlayerRealNameAuthenticationMsgAck(msg: PlayerRealNameAuthenticationMsgAck) {
            console.log(msg);
            LobbyData.verifyRealInfo = msg.isPlayerAuthenticated;
        }
    }
}