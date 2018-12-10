module FL {
    export class RFGameCmd extends puremvc.SimpleCommand implements puremvc.ICommand {
        public constructor() {
            super();
        }

        public execute(notification: puremvc.INotification): void {
            let data: any = notification.getBody();
            switch (notification.getName()) {
                case RFGameModule.RFGAME_INTO_ROOM:
                    this.intoRoom();
                    break;
                case RFGameModule.RFGAME_START_GAME:
                    this.startGame();
                    break;
                case RFGameModule.GAME_ADD_SCROLL_MSG:
                    this.addScrollMsg();
                    break;
                case RFGameModule.RFGAME_APPLY_DISMISS_ROOM: {
                    this.waitingCloseRoom(data);
                    break;
                }
                case RFGameModule.RFGAME_OPEN_GAME_OVER_VIEW: {
                    this.openGameOverView(data);
                    break;
                }
                case RFGameModule.RFGAME_OPEN_ROOM_OVER_VIEW: {
                    this.openRFRoomOverView(data);
                    break;
                }
            }
        }

        /**
        * 游戏界面的滚动公告
        * @param {FL.ScrollMsg} msg
        */
        public addScrollMsg(): void {
            let msg: ScrollMsg = RFGameData.ScrollMsg;
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

        //----test data
        public static initAck() {
            //设置已经进入游戏
            CommonHandler.setIsIntoGame(true);

            //设置数据
            let msg = new NewIntoGameTableMsgAck();
            msg.createPlayerID = "129056";
            msg.creatorName = "122";
            msg.mainGamePlayRule = ECardGamePlayWay.JING_DIAN_PAO_DE_KUAI;
            msg.payType = 0;
            msg.vipRoomID = 3;
            let players = [];
            for (let i = 0; i < 4; i++) {
                let player = new GamePlayer();
                player.playerName = "笑话" + i;
                player.tablePos = i;
                player.sex = i;
                players.push(player);
            }

            msg.gamePlayers = players;
            msg.playersNumber = 4;
            msg.playerPos = 2;
            msg.createType = 0;
            RFGameData.requestStartGameMsgAck = msg;

            let s = new PokerStartCircleGameMsgAck();
            s.myTablePos = 2;
            let infos = [];
            for (let i = 0; i < 4; ++i) {
                let info = new PokerGameStartPlayerInfo();
                info.handCards = [51, 52, 66, 68, 67, 81, 100, -124, -125, -110, -78, -76, -45, -46, -47, 18];
                info.tablePos = i;
                info.isChuOnce = true;
                info.lastChuCards = [51, 52, 66, 68, 67, 81, 100, -124, -125, -110, -78, -76, -45, -46, -47, 18];
                infos.push(info);
            }
            s.playerInfos = infos;
            // s.myTablePos = 2;
            // s.dealerPos = 2;
            // s.mainGamePlayRule = ECardGamePlayWay.JING_DIAN_PAO_DE_KUAI;
            // // s.myCards = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 1, 2, 3];
            // s.quanNum = 10;
            // s.player0Cards = [];
            // s.player1Cards = [];
            // s.player2Cards = [];
            // s.player3Cards = [];
            // s.player0CardsDown = [];
            // s.player1CardsDown = [];
            // s.player2CardsDown = [];
            // s.player3CardsDown = [];
            // s.player0Cards = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 1, 2, 3];
            // s.player1Cards = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 1, 2, 3];

            // for (let i = 17; i < 17 + 16; i++) {
            //     s.player0Cards.push(i);
            // }

            // for (let i = 17 + 16; i < 17 + 16 + 16; i++) {
            //     s.player1Cards.push(i);
            // }

            //设置人数
            RFGameData.gameMaxNum = msg.playersNumber;

            //设置最大卡牌数
            RFGameData.gameMaxCardNum = 16;

            //设置是否显示总余牌
            RFGameData.isShowRestCardsNum = false;

            //设置是否显示手牌余牌
            RFGameData.isShowHandCardsNum = true;
            RFGameData.gameStartMsg = s;

            let m = new PokerRemindPlayCardMsgAck();
            m.chuExpirationTimes = dcodeIO.Long.ZERO;
            m.handPatterns = 0;

            m.isHasBigger = true;
            m.isMgrCard = true;
            m.remindCards = [1, 51, 1, 52, 1, 66, 1, 68, 1, 67, 1, 81, 1, 100];
            //设置玩家信息
            let vSimplePlayerArray: Array<GamePlayer> = msg.gamePlayers, vCurrSimplePlayer: GamePlayer;
            for (let vIndex: number = 0, vLength: number = vSimplePlayerArray.length; vIndex < vLength; ++vIndex) {
                vCurrSimplePlayer = vSimplePlayerArray[vIndex];
                RFGameData.playerInfo[vCurrSimplePlayer.tablePos] = vCurrSimplePlayer;
            }
            // MvcUtil.send(RFGameModule.RFGAME_INTO_ROOM);
            RFGameProxy.getInstance().exeNewIntoGameTableMsgAck(msg);
            RFGameProxy.getInstance().exePokerStartCircleGameMsgAck(s);
            RFGameProxy.getInstance().exePokerRemindPlayCardMsgAck(m);
        }

        /**
         * 进入房间
         */
        public intoRoom() {

            try {
                //在这里运行代码

                // egret.log("11111");
                //播放背景音乐
                SoundManager.playBg("game_bg_mp3");
                //设置当前游戏操作类型
                GameConstant.setCurrentGame(EGameType.RF);
                //添加牌桌背景
                MvcUtil.addView(ViewManager.getTableBoardBg());
                //添加牌桌基础界面
                let vRFGameTableBaseView: RFGameTableBaseView = RFGameTableBaseView.getInstance();
                vRFGameTableBaseView.intoTableBoard();
                MvcUtil.addView(vRFGameTableBaseView);
                //添加操作界面
                let vTableBoardHandleView: RFGameTableHandleView = RFGameTableHandleView.getInstance();
                vTableBoardHandleView.intoTableBoard();
                MvcUtil.addView(vTableBoardHandleView);
                // egret.log("22222");

                // 特效表现层
                let vTableBoardEffectView: RFGameTableEffectView = RFGameTableEffectView.getInstance();
                vTableBoardEffectView.startGame();
                MvcUtil.addView(vTableBoardEffectView);

                // egret.log("3333");

                if (!RFGameHandle.isReplay() && RFGameHandle.isVipRoom()) {
                    //设置分享内容
                    WeChatJsSdkHandler.setShareLocation(ShareLocationEnum.VIP_ROOM);
                } else {
                    //设置分享内容
                    WeChatJsSdkHandler.setShareLocation(ShareLocationEnum.LOBBY);
                }
                //添加滚动公告栏
                MvcUtil.send(RFGameModule.GAME_ADD_SCROLL_MSG);

                // egret.log("44444");

                // 停止回放
                if (!RFGameHandle.isReplay()) {
                    RFGameLogReplay.endPlay();
                }

                // egret.log("5555");

                // 删除首页显示
                FL.IndexProxy.removeInitView();
            }
            catch (err) {
                egret.log(err);
            }

        }

        /**
         * 开始游戏
         */
        public startGame() {
            // 播放背景音乐
            SoundManager.playBg("game_bg_mp3");
            //添加牌桌背景
            MvcUtil.addView(ViewManager.getTableBoardBg());

            // 移除BOTTOM层所有显示对象
            MvcUtil.addView(new DelLayerView(ViewLayerEnum.BOTTOM_ONLY));

            // 牌桌基础界面开始游戏
            let vTableBoardBaseView: RFGameTableBaseView = RFGameTableBaseView.getInstance();
            vTableBoardBaseView.startGame();
            MvcUtil.addView(vTableBoardBaseView);


            //中间牌局数界面
            let vPlayCountView: RFGamePlayCountView = RFGamePlayCountView.getInstance();
            vPlayCountView.startGame();
            MvcUtil.addView(vPlayCountView);
            //中间时间界面
            // let vTableBoardTimerView: TableBoardTimerView = TableBoardTimerView.getInstance();
            // vTableBoardTimerView.startGame();
            // MvcUtil.addView(vTableBoardTimerView);

            // 补花界面
            // let vTableBoardCardsHuaView: TableBoardCardsHuaView = TableBoardCardsHuaView.getInstance();
            // vTableBoardCardsHuaView.startGame();
            // MvcUtil.addView(vTableBoardCardsHuaView);

            //初始化卡牌对象池
            RFCardItemPool.initCardPool(20);

            //玩家手牌界面
            let vTableBoardCardsHandView: RFGameHandCardsView = RFGameHandCardsView.getInstance();
            vTableBoardCardsHandView.startGame();
            MvcUtil.addView(vTableBoardCardsHandView);

            // 中间出牌界面
            let vTableBoardCardsMiddleView: RFGameTableMiddleView = RFGameTableMiddleView.getInstance();
            vTableBoardCardsMiddleView.startGame();
            MvcUtil.addView(vTableBoardCardsMiddleView);

            // 特效表现层
            let vTableBoardEffectView: RFGameTableEffectView = RFGameTableEffectView.getInstance();
            vTableBoardEffectView.startGame();
            MvcUtil.addView(vTableBoardEffectView);

            // 添加操作界面并开始游戏
            let vTableBoardHandleView: RFGameTableHandleView = RFGameTableHandleView.getInstance();
            MvcUtil.addView(vTableBoardHandleView);
            vTableBoardHandleView.startGame();

            //如果是回放则添加回放操作界面
            if (RFGameHandle.isReplay()) {
                let vRFGameReplayHandleView: RFGameReplayHandleView = RFGameReplayHandleView.getInstance();
                MvcUtil.addView(vRFGameReplayHandleView);

                let roundView: RFGameReplayRoundView = RFGameReplayRoundView.getInstance();
                MvcUtil.addView(roundView);
            }

            // 初始化游戏本地数据
            RFGameHandle.initGameLocalData();
        }

        /**
         * 等待或者关闭房间
         * @param {FL.ApplyDismissRoomMsgAck} msg
         */
        private waitingCloseRoom(msg: ApplyDismissRoomMsgAck): void {
            // egret.log(msg);
            // 在任何地方都提示解散
            // if (GameConstant.CURRENT_HANDLE.isReplay() || GameConstant.CURRENT_HANDLE.getGameState() === EGameState.NULL) {
            //     return;
            // }

            //获得界面
            let vRFDissolveRoomView: RFDissolveRoomView = RFDissolveRoomView.getInstance();
            let vIsDisplay: boolean = vRFDissolveRoomView.parent ? true : false;
            if (msg.isReject) {
                if (vIsDisplay) {
                    // 拒绝了，解散失败
                    MvcUtil.delView(vRFDissolveRoomView);
                }
                return;
            }
            //玩家数组
            let vPlayerArray: GamePlayer[] = GameConstant.CURRENT_HANDLE.getGamePlayerArray();

            //定义状态列表
            let vStateArray: number[] = msg.playerStatus;
            //定义显示玩家列表
            let vDisplayPlayerArray: GamePlayer[] = [];
            //发起者名字
            let vSponsor:GamePlayer = GameConstant.CURRENT_HANDLE.getGamePlayerInfo(GameConstant.CURRENT_HANDLE.getPZOrientation(msg.applyPlayerPos));
            //循环处理
            for (let i: number = 0; i < vPlayerArray.length; ++i) {
                let vState: number = msg.playerStatus[vPlayerArray[i].tablePos];
                if (vState !== 0x3 && vPlayerArray[i].tablePos != vSponsor.tablePos) {
                    vDisplayPlayerArray.push(vPlayerArray[i]);
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
            // let vIsDisplay: boolean = vRFDissolveRoomView.parent ? true : false;
            if (!vIsDisplay) {
                MvcUtil.addView(vRFDissolveRoomView);
            }

            //新发起的话重置界面，或者新添加
            if (vIsNew || !vIsDisplay) {
                vRFDissolveRoomView.resetView(vDisplayPlayerArray,vSponsor);
            }
            //界面已经打开，新的发起者
            if (vIsDisplay && vIsNew && vSponsor.playerName) {
                PromptUtil.show("玩家【" + vSponsor.playerName + "】新发起了解散房间请求！", PromptType.ALERT);
            }
            //剩余时间
            if (msg.remainTime > 0) {
                vRFDissolveRoomView.initLeftTimes(msg.remainTime);
            } else {
                //默认177
                vRFDissolveRoomView.initLeftTimes(177);
            }
            //更新状态和描述
            vRFDissolveRoomView.updateStateAndDesc(vStateArray, msg.textHint);
        }

        /**
           * 打开游戏结束界面
           * @param {FL.PaoDeKuaiGameOverSettleAccountsMsgAck} msg
           */
        private openGameOverView(msg: PaoDeKuaiGameOverSettleAccountsMsgAck): void {
            // console.log(msg);
            if (!msg) {
                msg = RFGameHandle.getGameOverMsgAck();
            }
            //移除界面
            MvcUtil.addView(new DelLayerView(ViewLayerEnum.BOTTOM_ONLY));
            //添加界面
            let vRFGameOverView: RFGameOverView = RFGameOverView.getInstance();
            vRFGameOverView.resetView(msg);
            MvcUtil.addView(vRFGameOverView);

            // if (MJGameHandler.isVipRoom()) {
            //     //设置分享内容
            //     WeChatJsSdkHandler.setShareLocation(ShareLocationEnum.VIP_ROOM_GAME_OVER);
            // } else {
            //     //设置分享内容
            //     WeChatJsSdkHandler.setShareLocation(ShareLocationEnum.GOLD_GAME_OVER);
            // }

            // 删除本地数据
            RFGameHandle.removeGameLocalData();

        }

        /**
         * 打开房间结算界面，牌局结算
         * @param {FL.NewVipRoomOverSettleAccountsMsgAck} msg
         */
        private openRFRoomOverView(msg: NewVipRoomOverSettleAccountsMsgAck): void {
            // console.log(msg);
            if (!msg) {
                msg = RFGameHandle.getVipRoomCloseMsg();
            }
            // 移除界面
            MvcUtil.addView(new DelLayerView(ViewLayerEnum.BOTTOM_ONLY));

            // 添加界面
            let vRFRoomOverView: RFRoomOverView = new RFRoomOverView();
            MvcUtil.addView(vRFRoomOverView);
            vRFRoomOverView.resetView(msg);

            // 设置分享内容
            WeChatJsSdkHandler.setShareLocation(ShareLocationEnum.ROOM_OVER);

            // 删除本地数据
            RFGameHandle.removeGameLocalData();
        }
    }
}