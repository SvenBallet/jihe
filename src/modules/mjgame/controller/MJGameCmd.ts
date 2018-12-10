module FL {
    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase - MJGameCmd
     * @Description:  //麻将游戏指令
     * @Create: DerekWu on 2017/11/21 17:01
     * @Version: V1.0
     */
    export class MJGameCmd extends puremvc.SimpleCommand implements puremvc.ICommand {

        public constructor() {
            super();
        }

        public execute(notification: puremvc.INotification): void {
            let data: any = notification.getBody();
            switch (notification.getName()) {
                case MJGameModule.MJGAME_INTO_ROOM: {
                    this.intoMJRoom();
                    break;
                }
                case MJGameModule.MJGAME_START_GAME: {
                    this.startMJGame();
                    break;
                }
                case MJGameModule.MJGAME_HU: {
                    this.hu(data);
                    break;
                }
                case MJGameModule.MJGAME_PLAY_ZHONG_NIAO: {
                    this.playerZhongNiao(data);
                    break;
                }
                case MJGameModule.MJGAME_OPEN_GAME_OVER_VIEW: {
                    this.openGameOverView(data);
                    break;
                }
                case MJGameModule.MJGAME_VIP_ROOM_CLOSE: {
                    this.openMJRoomOverView(data);
                    break;
                }
                case MJGameModule.MJGAME_WAITING_OR_CLOSE_VIP: {
                    this.waitingOrCloseVip(data);
                    break;
                }
                case MJGameModule.MJGAME_ADD_SCROLL_MSG: {
                    this.addScrollMsg();
                    break;
                }
                case MJGameModule.MJGAME_NOTIFY_START_ZUO_LA_PAO: {
                    this.startSelectZuoLaPao(data);
                    break;
                }
                case MJGameModule.MJGAME_NOTIFY_START_XIA_MA: {
                    this.startSelectXiaMa(data);
                    break;
                }
            }
        }

        /**
         * 进入麻将房间
         */
        private intoMJRoom(): void {
            //播放背景音乐
            SoundManager.playBg("game_bg_mp3");
            //设置当前游戏操作类型
            GameConstant.setCurrentGame(EGameType.MJ);
            //添加牌桌背景
            MvcUtil.addView(ViewManager.getTableBoardBg());
            //添加牌桌基础界面
            let vTableBoardBaseView: TableBoardBaseView = TableBoardBaseView.getInstance();
            vTableBoardBaseView.intoTableBoard();
            MvcUtil.addView(vTableBoardBaseView);
            //添加操作界面
            let vTableBoardHandleView: TableBoardHandleView = TableBoardHandleView.getInstance();
            vTableBoardHandleView.intoTableBoard();
            MvcUtil.addView(vTableBoardHandleView);

            // 特效表现层
            let vTableBoardEffectView: TableBoardEffectView = TableBoardEffectView.getInstance();
            vTableBoardEffectView.startGame();
            MvcUtil.addView(vTableBoardEffectView);

            if (!MJGameHandler.isReplay() && MJGameHandler.isVipRoom()) {
                //设置分享内容
                WeChatJsSdkHandler.setShareLocation(ShareLocationEnum.VIP_ROOM);
            } else {
                //设置分享内容
                WeChatJsSdkHandler.setShareLocation(ShareLocationEnum.LOBBY);
            }
            //添加滚动公告栏
            MvcUtil.send(MJGameModule.MJGAME_ADD_SCROLL_MSG);

            // 停止回放
            if (!MJGameHandler.isReplay()) {
                MJGameLogReplay.endPlay();
            }

            // 删除首页显示
            FL.IndexProxy.removeInitView();

        }

        /**
         * 开始麻将游戏
         */
        private startMJGame(): void {
            // 播放背景音乐
            SoundManager.playBg("game_bg_mp3");
            //添加牌桌背景
            MvcUtil.addView(ViewManager.getTableBoardBg());

            // 移除BOTTOM层所有显示对象
            MvcUtil.addView(new DelLayerView(ViewLayerEnum.BOTTOM_ONLY));

            // 牌桌基础界面开始游戏
            let vTableBoardBaseView: TableBoardBaseView = TableBoardBaseView.getInstance();
            vTableBoardBaseView.startGame();
            MvcUtil.addView(vTableBoardBaseView);

            //中间时间界面
            let vTableBoardTimerView: TableBoardTimerView = TableBoardTimerView.getInstance();
            vTableBoardTimerView.startGame();
            MvcUtil.addView(vTableBoardTimerView);

            // 补花界面
            let vTableBoardCardsHuaView: TableBoardCardsHuaView = TableBoardCardsHuaView.getInstance();
            vTableBoardCardsHuaView.startGame();
            MvcUtil.addView(vTableBoardCardsHuaView);

            // 中间出牌界面
            let vTableBoardCardsMiddleView: TableBoardCardsMiddleView = TableBoardCardsMiddleView.getInstance();
            vTableBoardCardsMiddleView.startGame();
            MvcUtil.addView(vTableBoardCardsMiddleView);

            // 玩家手牌界面
            let vTableBoardCardsHandView: TableBoardCardsHandView = TableBoardCardsHandView.getInstance();
            vTableBoardCardsHandView.startGame();
            MvcUtil.addView(vTableBoardCardsHandView);

            // 特效表现层
            let vTableBoardEffectView: TableBoardEffectView = TableBoardEffectView.getInstance();
            MvcUtil.addView(vTableBoardEffectView);
            vTableBoardEffectView.startGame();

            // 添加操作界面并开始游戏
            let vTableBoardHandleView: TableBoardHandleView = TableBoardHandleView.getInstance();
            MvcUtil.addView(vTableBoardHandleView);
            vTableBoardHandleView.startGame();

            // 如果是回放则添加回放操作界面
            if (MJGameHandler.isReplay()) {
                let vMJGameReplayHandleView: MJGameReplayHandleView = MJGameReplayHandleView.getInstance();
                MvcUtil.addView(vMJGameReplayHandleView);

                let vMJGameReplayRoundView: MJGameReplayRoundView = MJGameReplayRoundView.getInstance();
                MvcUtil.addView(vMJGameReplayRoundView);
            }

            // 初始化游戏本地数据
            MJGameHandler.initGameLocalData();


            //----test 
            // MJGameData.isStartNiaoEffect = false;
            // this.playerZhongNiao([17, 1, 0, 7, 1, 0, 1, 1, 0, 37, 1, 0, 21, 1, 0, 17, 1, 0]);
            // MvcUtil.send(MJGameModule.MJGAME_PLAY_ZHONG_NIAO, [17, 1, 0, 7, 1, 0, 1, 1, 0, 37, 1, 0, 21, 1, 0, 17, 1, 0])
        }

        /**
         * 玩家胡牌了
         * @param {FL.PlayerOperationNotifyMsg} msg
         */
        private hu(msg: PlayerOperationNotifyMsg): void {
            let vGetMainGamePlayRule: number = MJGameHandler.getMainGamePlayRule();
            if (vGetMainGamePlayRule === MJGamePlayWay.ZHUANZHUAN) {
                this.playerZhongNiao(msg.tingList);
                // if (!MJGameHandler.isStartNiaoEffect() && msg.tingList && msg.tingList.length > 0) {
                //     MJGameHandler.setStartNiaoEffect(true);
                //     // 转转麻将有中鸟，延时两秒进行，因为还有胡牌动画播放
                //     MyCallBackUtil.delayedCallBack(1500, this.zhongNiao, this, msg);
                // }
            }
        }

        /**
         * 播放中鸟动画
         * @param {Array<number>} niaoList
         */
        private playerZhongNiao(niaoList: Array<number>): void {
            if (!MJGameHandler.isStartNiaoEffect() && niaoList && niaoList.length > 0) {
                MJGameHandler.setStartNiaoEffect(true);
                // 转转麻将有中鸟，延时两秒进行，因为还有胡牌动画播放
                MyCallBackUtil.delayedCallBack(1500, this.zhongNiao, this, niaoList);
            }
        }

        /**
         * 中鸟
         */
        private zhongNiao(niaoList: Array<number>): void {

            // 如果是回放则删除回放操作界面
            if (MJGameHandler.isReplay()) {
                let vMJGameReplayHandleView: MJGameReplayHandleView = MJGameReplayHandleView.getInstance();
                MvcUtil.delView(vMJGameReplayHandleView);

                let vMJGameReplayRoundView: MJGameReplayRoundView = MJGameReplayRoundView.getInstance();
                MvcUtil.delView(vMJGameReplayRoundView);
            }

            // 删除操作界面
            let vTableBoardHandleView: TableBoardHandleView = TableBoardHandleView.getInstance();
            MvcUtil.delView(vTableBoardHandleView);

            // 鸟效果界面
            let vTableBoardZhuaNiaoEffectView: TableBoardZhuaNiaoEffectView = new TableBoardZhuaNiaoEffectView(MJGameHandler.hasMinorGamePlayRule(GameConstant.GAME_PLAY_RULE_ZZ_ZHUANG_NIAO), niaoList);
            MvcUtil.addView(vTableBoardZhuaNiaoEffectView);

            // 添加操作界面
            MvcUtil.addView(vTableBoardHandleView);
            // vTableBoardHandleView.startGame();

        }

        /**
         * 打开游戏结束界面
         * @param {FL.PlayerGameOverMsgAck} msg
         */
        private openGameOverView(msg: PlayerGameOverMsgAck): void {
            if (!msg) {
                msg = MJGameHandler.getPlayerGameOverMsgAck();
            }
            //移除界面
            // MvcUtil.addView(new DelLayerView(ViewLayerEnum.BOTTOM_ONLY));
            //添加界面
            let vMJGameOverView: MJGameOverView = MJGameOverView.getInstance();
            vMJGameOverView.resetView(msg);
            MvcUtil.addView(vMJGameOverView);

            if (MJGameHandler.isVipRoom()) {
                //设置分享内容
                WeChatJsSdkHandler.setShareLocation(ShareLocationEnum.VIP_ROOM_GAME_OVER);
            } else {
                //设置分享内容
                WeChatJsSdkHandler.setShareLocation(ShareLocationEnum.GOLD_GAME_OVER);
            }

            // 删除本地数据
            MJGameHandler.removeGameLocalData();

        }

        /**
         * 打开房间结算界面，牌局结算
         * @param {FL.VipRoomCloseMsg} msg
         */
        private openMJRoomOverView(msg: VipRoomCloseMsg): void {
            if (!msg) {
                msg = MJGameHandler.getVipRoomCloseMsg();
            }
            // 移除界面
            MvcUtil.addView(new DelLayerView(ViewLayerEnum.BOTTOM_ONLY));

            // 添加界面
            let vMJRoomOverView: MJRoomOverView = MJRoomOverView.getInstance();
            vMJRoomOverView.resetView(msg);
            MvcUtil.addView(vMJRoomOverView);

            // 设置分享内容
            WeChatJsSdkHandler.setShareLocation(ShareLocationEnum.ROOM_OVER);

            // 删除本地数据
            MJGameHandler.removeGameLocalData();
        }

        /**
         * 等待或者关闭VIP
         * @param {FL.PlayerGameOpertaionAckMsg} msg
         */
        private waitingOrCloseVip(msg: PlayerGameOpertaionAckMsg): void {

            if (MJGameHandler.isReplay() || MJGameHandler.getGameState() === EGameState.NULL) {
                return;
            }

            //获得界面
            let vDissolveRoomView: DissolveRoomView = DissolveRoomView.getInstance();
            //玩家数组
            let vPlayerArray: SimplePlayer[] = MJGameHandler.getGamePlayerArray();
            //定义状态列表
            let vStateArray: number[] = [];
            //定义显示玩家列表
            let vDisplayPlayerArray: SimplePlayer[] = [];
            //发起者名字
            let vSponsorName: string;
            //循环处理
            for (let vIndex: number = 0; vIndex < vPlayerArray.length; ++vIndex) {
                let vState: number = (msg.unused_0 >> vIndex * 2) & 0x3;
                if (vState !== 0x3) {
                    vStateArray.push(vState);
                    vDisplayPlayerArray.push(vPlayerArray[vIndex]);
                } else {
                    vSponsorName = vPlayerArray[vIndex].playerName;
                }
            }
            //是否是新发起
            let vIsNew: boolean = true;
            for (let vIndex: number = 0; vIndex < vStateArray.length; ++vIndex) {
                if (vStateArray[vIndex] !== 0) {
                    vIsNew = false;
                    break;
                }
            }

            //是否已经显示解散界面
            let vIsDisplay: boolean = vDissolveRoomView.parent ? true : false;
            if (!vIsDisplay) {
                MvcUtil.addView(vDissolveRoomView);
            }

            //新发起的话重置界面，或者新添加
            if (vIsNew || !vIsDisplay) {
                vDissolveRoomView.resetView(vDisplayPlayerArray);
            }
            //界面已经打开，新的发起者
            if (vIsDisplay && vIsNew && vSponsorName) {
                PromptUtil.show("玩家【" + vSponsorName + "】新发起了解散房间请求！", PromptType.ALERT);
            }
            //剩余时间
            // if (vIsNew) {
            //     //默认177
            //     vDissolveRoomView.initLeftTimes(179);
            // } else {
            if (msg.unused_2 > 0) {
                vDissolveRoomView.initLeftTimes(msg.unused_2 - 123);
            } else {
                //默认177
                vDissolveRoomView.initLeftTimes(177);
            }
            // }
            //更新状态和描述
            vDissolveRoomView.updateStateAndDesc(vStateArray, msg.ip);
        }

        /**
         * 打麻将界面的滚动公告
         * @param {FL.ScrollMsg} msg
         */
        public addScrollMsg(): void {
            let msg: ScrollMsg = MJGameData.ScrollMsg;
            if (msg) {
                let vMJGameScrollMsg: MJGameScrollMsg = MJGameScrollMsg.getInstance();
                if (vMJGameScrollMsg.msgLabel.text != "") {
                    //如果已经添加过消息了，则直接更新消息，不用再添加滚动条
                    MvcUtil.delView(vMJGameScrollMsg);
                    MvcUtil.addView(vMJGameScrollMsg);
                    //如果和上一条消息不同则更新，否则不用更新
                    if (msg !== vMJGameScrollMsg.msg) {
                        vMJGameScrollMsg.msg = msg;
                        vMJGameScrollMsg.changeMsg();
                    }
                } else {
                    vMJGameScrollMsg.msg = msg;
                    MvcUtil.addView(vMJGameScrollMsg);
                }
            }
        }

        /**
         * 开始选择坐拉跑
         * @param {FL.PlayerZuoLaPaoNotifyMsg} msg
         */
        private startSelectZuoLaPao(msg: PlayerZuoLaPaoNotifyMsg): void {
            MvcUtil.addView(new MJGameChooseZuoLaPao(msg));
        }

        /**
         * 开始选择下码
         * @param {FL.PlayerXiaMaNotifyMsg} msg
         */
        private startSelectXiaMa(msg: PlayerXiaMaNotifyMsg): void {
            if (msg.xiaMaValue) {
                MvcUtil.addView(new MJGameChooseXiaMa());
            }
        }

    }
}