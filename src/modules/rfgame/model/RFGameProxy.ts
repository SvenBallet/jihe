module FL {
    export class RFGameProxy extends puremvc.Proxy {
        /** 代理名 */
        public static readonly NAME: string = "RFGameProxy";
        /** 单例 */
        private static instance: RFGameProxy;

        /**跑得快托管状态 */
        public static tuoGuanState: boolean = false;

        private constructor() {
            super(RFGameProxy.NAME);
        }

        public static getInstance(): RFGameProxy {
            if (!this.instance) {
                let vNewRFGameProxy = new RFGameProxy();
                this.instance = vNewRFGameProxy;
            }
            return this.instance;
        }

        /**
         * 进入牌桌
         */
        public exeNewIntoGameTableMsgAck_1(msg: NewIntoGameTableMsgAck, isReplay: boolean = false): void {

        }

        /**
         * 进入牌桌
         */
        public exeNewIntoGameTableMsgAck(msg: NewIntoGameTableMsgAck, isReplay: boolean = false): void {
            if (msg.teaHouseId && msg.teaHouseLayer) {
                CommonData.lastStopPosition = 2;
                Storage.setItemNum("th_previous_tea_house_id", msg.teaHouseId);
                Storage.setItemNum("th_previous_floor_" + msg.teaHouseId, msg.teaHouseLayer);
            }

            ReqLoadingViewUtil.delReqLoadingView();
            // CommonHandler.delNetConnectMask();

            //设置不是重放
            // egret.log(msg);
            /** 麻将*/
            if (msg.mainGamePlayRule >= 20000) {
                MahjongData.isReplay = isReplay;
                MahjongProxy.tuoGuanState = false;
                MahjongHandler.resetMahjongData();
                if (msg.createType === 2 && msg.vipRoomID === 0) {
                    PromptUtil.show("俱乐部房间创建成功！", PromptType.SUCCESS);
                    MvcUtil.addView(ClubBaseView.getInstance());
                    MvcUtil.send(ClubModule.CLUB_GET_ROOM_LIST);
                } else {
                    //不是代开房，进入牌桌等待

                    //设置已经进入游戏
                    CommonHandler.setIsIntoGame(true);

                    //设置数据
                    MahjongData.requestStartGameMsgAck = msg;
                    //标记状态，等待开始
                    // MJGameData.mjGameState = MJGameState.WAITING_START;
                    MahjongHandler.setGameState(EGameState.WAITING_START);

                    //设置人数
                    MahjongData.gameMaxNum = msg.playersNumber;

                    MahjongData.isNeedReady = msg.isNeedReady;

                    //初始化显示组属性
                    RFGameViewPropsHandle.init(msg.playersNumber);


                    //设置玩家信息
                    let vPlayerArray: Array<GamePlayer> = msg.gamePlayers, vCurrPlayer: GamePlayer;
                    for (let vIndex: number = 0, vLength: number = vPlayerArray.length; vIndex < vLength; ++vIndex) {
                        vCurrPlayer = vPlayerArray[vIndex];
                        MahjongData.playerInfo[vCurrPlayer.tablePos] = vCurrPlayer;
                    }

                    if (!isReplay) {
                        // 拉取其他玩家的GPS信息，在我没有打开GPS的时候也可以获取到别的玩家的位置
                        this.pullOtherPlayerGpsInfo();
                        // 不是回放则发送我的gps位置
                        this.sendUpdateGps(msg.playerPos);
                    }

                    //进入房间
                    MvcUtil.send(MahjongModule.MAHJONG_INTO_GAME);
                }
            } else {
                /** 扑克*/
                RFGameData.isReplay = isReplay;
                RFGameHandle.resetGameData();
                {
                    //判断结果
                    // if (msg.result === ErrorCodeConstant.CMD_EXE_OK) {
                    //是否代开房
                    //NumberUtil.isAndNumber(msg.unused_0, GameConstant.AGENT_TABLE_FLAG)
                    if (msg.createType === 1 && msg.vipRoomID === 0) {
                        MvcUtil.send(LobbyModule.LOBBY_INTO_LOBBY);
                        egret.localStorage.setItem("agentTabIndex", AGENT_ITEM[2]);
                        ReminderViewUtil.showReminderView({
                            hasLeftBtn: true,
                            hasRightBtn: true,
                            leftCallBack: new MyCallBack(MvcUtil.send, MvcUtil, AgentModule.AGENT_INTO_AGENT),
                            text: "代开房创建成功！"
                        });
                    } else if (msg.createType === 2 && msg.vipRoomID === 0) {
                        PromptUtil.show("俱乐部房间创建成功！", PromptType.SUCCESS);
                        MvcUtil.addView(ClubBaseView.getInstance());
                        MvcUtil.send(ClubModule.CLUB_GET_ROOM_LIST);
                    } else {
                        //不是代开房，进入牌桌等待

                        //设置已经进入麻将游戏
                        CommonHandler.setIsIntoGame(true);

                        //设置数据
                        RFGameData.requestStartGameMsgAck = msg;
                        //标记状态，等待开始
                        // MJGameData.mjGameState = MJGameState.WAITING_START;
                        RFGameHandle.setGameState(EGameState.WAITING_START);

                        //设置人数
                        RFGameData.gameMaxNum = msg.playersNumber;

                        //初始化显示组属性
                        RFGameViewPropsHandle.init(msg.playersNumber);

                        //设置是否显示准备
                        RFGameData.isNeedReady = msg.isNeedReady;
                        // //设置总局数
                        // RFGameData.gameTotalCount = msg.totalPlayCount;

                        // //设置当前局数
                        // RFGameData.gameCurCount = msg.currPlayCount;

                        //设置玩家信息
                        let vSimplePlayerArray: Array<GamePlayer> = msg.gamePlayers, vCurrSimplePlayer: GamePlayer;
                        for (let vIndex: number = 0, vLength: number = vSimplePlayerArray.length; vIndex < vLength; ++vIndex) {
                            vCurrSimplePlayer = vSimplePlayerArray[vIndex];
                            RFGameData.playerInfo[vCurrSimplePlayer.tablePos] = vCurrSimplePlayer;
                        }

                        if (!isReplay) {
                            // 拉取其他玩家的GPS信息，在我没有打开GPS的时候也可以获取到别的玩家的位置
                            this.pullOtherPlayerGpsInfo();
                            // 不是回放则发送我的gps位置
                            this.sendUpdateGps(msg.playerPos);
                        }

                        //进入房间
                        MvcUtil.send(RFGameModule.RFGAME_INTO_ROOM);
                    }
                }
            }
            // 停止回放
            if(!MahjongHandler.isReplay()) MahjongLogReplay.endPlay();
            if(!RFGameHandle.isReplay()) RFGameLogReplay.endPlay();
        }

        public exePokerStartCircleGameMsgAck1(msg: PokerStartCircleGameMsgAck) {
            if (RFGameHandle.isReplay() || !RFGameHandle.getRequestStartGameMsgAck()) {
                let vNewIntoOld: NewIntoOldGameTableMsg = new NewIntoOldGameTableMsg();
                ServerUtil.sendMsg(vNewIntoOld);
            } else {
                this.exePokerStartCircleGameMsgAck(msg);
            }
        }

        /**
         * 开始新一轮的扑克游戏
         */
        public exePokerStartCircleGameMsgAck(msg: PokerStartCircleGameMsgAck) {

            ReqLoadingViewUtil.delReqLoadingView();

            GameConstant.setCurrentGame(EGameType.RF);
            // 停止回放
            if(!MahjongHandler.isReplay()) MahjongLogReplay.endPlay();
            if(!RFGameHandle.isReplay()) RFGameLogReplay.endPlay();

            if (!GameConstant.CURRENT_HANDLE.isReplay() && GameConstant.CURRENT_HANDLE.getGameState() === EGameState.NULL && !GlobalData.isIntoBack) {
                // 给服务器发送回到游戏消息
                let msg = new NewPlayerLeaveRoomMsg();
                msg.leaveFlag = 3;
                ServerUtil.sendMsg(msg);
            }
            // egret.log(msg);
            RFGameData.gameStartMsg = msg;
            //处理开始游戏数据
            RFGameHandle.handleStartData();
            //设置游戏状态
            RFGameHandle.setGameState(EGameState.PLAYING);
            //设置最大卡牌数
            RFGameData.gameMaxCardNum = 16;
            //设置是否显示手牌余牌
            let isShowHandCardsNum = msg.playerInfos.filter(x => x.handCardNum == -1);
            RFGameData.isShowHandCardsNum = (isShowHandCardsNum.length) ? false : true;
            //设置是否显示总余牌
            RFGameData.isShowRestCardsNum = (msg.leftTotalCardNum != -1);
            //设置总余牌数
            RFGameData.restTotalCardsNum = msg.leftTotalCardNum;
            //开始游戏
            MvcUtil.send(RFGameModule.RFGAME_START_GAME);
        }

        /**
         * 提示其他玩家出牌
         */
        public exePokerRemindOtherPlayerOperationMsgAck(msg: PokerRemindOtherPlayerOperationMsgAck) {
            // console.log(msg);
            //设置操作时间
            RFGameData.playerOpTime = Math.floor((msg.timeLimit.toNumber() - ServerUtil.getServerTime()) / 1000);
            //显示计时器，出牌玩家方位
            MvcUtil.send(RFGameModule.GAME_SHOW_TIMER, RFGameHandle.getPZOrientation(msg.operationPlayerPos));
        }

        /**
         * 提示自己出牌
         */
        public exePokerRemindPlayCardMsgAck(msg: PokerRemindPlayCardMsgAck) {
            // console.log(msg);
            //设置操作时间
            RFGameData.playerOpTime = Math.floor((msg.chuExpirationTimes.toNumber() - ServerUtil.getServerTime()) / 1000);
            //显示操作按钮
            MvcUtil.send(RFGameModule.GAME_SHOW_CONTROL, msg)
            //显示计时器，自己方位
            MvcUtil.send(RFGameModule.GAME_SHOW_TIMER, PZOrientation.DOWN);

        }

        /**
         * 玩家出牌后返回
         */
        public exePokerPlayCardNotifyMsgAck(msg: PokerPlayCardNotifyMsgAck, reTotalCard: boolean = true) {
            // console.log("playACK:", msg);

            // 自己的出牌返回消息已经模拟并执行了，跳过返回处理
            if (RFGameHandle.getTablePos(PZOrientation.DOWN) == msg.playerPos  && !RFGameData.isReplay && reTotalCard && !RFGameProxy.tuoGuanState && msg.handCards.length) {
                return;
            }
            //设置手牌数据
            RFGameData.playerCardsData[msg.playerPos] = RFGameHandle.getCardData(msg.handCards);
            //处理出牌数据
            // let chucards = RFGameHandle.getCardData(msg.playCards);
            let chucards = <ICardsData>{};
            chucards.data = RFGameHandle.getCardData(msg.playCards);
            //处理出牌牌型效果
            chucards.type = ECardEffectType[ECardEffectType[msg.handPatterns]];
            //处理资源值，需要改进
            chucards.value = chucards.data[0].value;
            //如果只剩一张牌了，需要报单
            if (msg.chuPlayerCardLeftNum == 1) {
                chucards.type = ECardEffectType.SingleEnd;
                RFGameHandle.getPokerGameStartPlayerInfo(msg.playerPos).handCardNum = 1;
            } else if (msg.isMgrCard) { //是管牌并且是特殊牌型时，需要特殊处理
                if (msg.handPatterns == ECardPatternType.FEI_JI ||
                    msg.handPatterns == ECardPatternType.LIAN_DUI ||
                    msg.handPatterns == ECardPatternType.SAN_DAI_ER ||
                    msg.handPatterns == ECardPatternType.SHUN_ZI ||
                    msg.handPatterns == ECardPatternType.SI_DAI_ER ||
                    msg.handPatterns == ECardPatternType.SI_DAI_SAN) {
                    chucards.type = ECardEffectType.Dani;
                    chucards.value = RFGameSoundHandle.getRandomNumFromField(0, 2);
                }
            } else if (msg.handPatterns == ECardPatternType.SAN_DAI_ER) {//带牌牌型，对应带牌数特殊处理
                if (msg.playCards.length == 4) {
                    chucards.type = ECardEffectType.Sandaiyi;
                } else if (msg.playCards.length == 3) {
                    chucards.type = ECardEffectType.San;
                }
            } else if (msg.handPatterns == ECardPatternType.SI_DAI_ER) {
                if (msg.playCards.length == 6 || msg.playCards.length == 5) {
                    chucards.type = ECardEffectType.Sidaier;
                }
            } else if (msg.handPatterns == ECardPatternType.SI_DAI_SAN) {
                if (msg.playCards.length == 6 || msg.playCards.length == 5) {
                    chucards.type = ECardEffectType.Sidaier;
                } else if (msg.playCards.length == 7) {
                    chucards.type = ECardEffectType.Sidaisan;
                }
            }
            let data = <IChuCardData>{};
            data.chuPos = msg.playerPos;
            data.chuData = chucards;
            //隐藏操作按钮
            MvcUtil.send(RFGameModule.GAME_HIDE_CONTROL);
            //隐藏计时器
            MvcUtil.send(RFGameModule.GAME_HIDE_TIMER);
            //显示出牌
            MvcUtil.send(RFGameModule.RFGAME_CHU_CARDS, data);
            //改变剩余手牌数
            if (RFGameData.isShowHandCardsNum) MvcUtil.send(RFGameModule.RFGAME_CHANGE_REST_CARD_NUM, {
                tablePos: msg.playerPos,
                value: msg.chuPlayerCardLeftNum
            });
            //改变总余牌数
            if (RFGameData.isShowRestCardsNum && reTotalCard) {
                MvcUtil.send(RFGameModule.RFGAME_CHANGE_REST_TOTAL_NUM, msg.totalCardLeftNum);
            }
            //重新绘制手上余牌
            MvcUtil.send(RFGameModule.REDRAW_HAND_CARDS, msg.playerPos);
            // //关闭触摸
            // RFGameHandle.touchHandCardSwitch.close();
        }

        /** 不出牌返回 */
        public exePokerNotPlayCardNotifyMsgAck(msg: PokerNotPlayCardNotifyMsgAck) {
            // console.log(msg);
            let chucards = <ICardsData>{};
            chucards.data = null;
            //处理出牌牌型效果
            chucards.type = ECardEffectType.Pass;
            //处理资源值
            if (!msg.notPlayType) {
                //不知道，随机播放
                chucards.value = RFGameSoundHandle.getRandomNumFromField(0, 2);
            } else {
                // chucards.value = msg.notPlayType;
                chucards.value = RFGameSoundHandle.getRandomNumFromField(0, 2);
            }
            let data = <IChuCardData>{};
            data.chuPos = msg.playerPos;
            data.chuData = chucards;
            //隐藏操作按钮
            MvcUtil.send(RFGameModule.GAME_HIDE_CONTROL);
            //隐藏计时器
            MvcUtil.send(RFGameModule.GAME_HIDE_TIMER);
            //显示出牌
            MvcUtil.send(RFGameModule.RFGAME_CHU_CARDS, data);
            //移除手牌遮罩
            MvcUtil.send(RFGameModule.REMOVE_CARDS_SHADE);
            // //关闭触摸
            // RFGameHandle.touchHandCardSwitch.close();
        }

        /** 游戏结束后摊牌 */
        public exePokerGameOverViewHandCardsMsgAck(msg: PokerGameOverViewHandCardsMsgAck) {
            // console.log(msg);
            RFGameData.restCardsData = RFGameHandle.getCardData(msg.leftCards);
            MvcUtil.send(RFGameModule.GAME_OVER_SHOW_HAND, msg);
        }

        /**
         * 处理游戏日志消息
         * @param {FL.GetPlayerGameLogMsg} msg
         */
        public exeGetPlayerGameLogMsg(msg: GetPlayerGameLogMsg): void {
            if (msg.gameTableID.indexOf('_') == -1) return;//以"_"区分是麻将还是扑克牌桌
            RFGameLogReplay.startReplay(msg);
        }

        /**
         * 拉取其他玩家的GPS信息，在我没有打开GPS的时候也可以获取到别的玩家的位置
         */
        private pullOtherPlayerGpsInfo(): void {
            let vUpdatePlayerGPSMsg: NewUpdateGPSPositionMsg = new NewUpdateGPSPositionMsg();
            ServerUtil.sendMsg(vUpdatePlayerGPSMsg);
        }

        /**
         * 发送玩家gps信息
         * @param {number} tablePos
         */
        private sendUpdateGps(tablePos?: number): void {
            if (GConf.Conf.useWXAuth == 1) {
                //微信获取位置
                WXJssdk.wx().getLocation({
                    tablePos: tablePos,
                    type: 'gcj02', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
                    success: function (res) {
                        let latitude = res.latitude; // 纬度，浮点数，范围为90 ~ -90
                        let longitude = res.longitude; // 经度，浮点数，范围为180 ~ -180。
                        // let speed = res.speed; // 速度，以米/每秒计
                        // let accuracy = res.accuracy; // 位置精度
                        let vUpdatePlayerGPSMsg: NewUpdateGPSPositionMsg = new NewUpdateGPSPositionMsg();
                        vUpdatePlayerGPSMsg.px = latitude;
                        vUpdatePlayerGPSMsg.py = longitude;
                        // vUpdatePlayerGPSMsg.playerTablePos = this.tablePos;
                        ServerUtil.sendMsg(vUpdatePlayerGPSMsg);
                    }
                });
            }
            else if (GConf.Conf.useWXAuth == 2 || GConf.Conf.useWXAuth == 3) {
                console.log("RFGAME SEND GPS");
                // 获取定位信息
                NativeBridge.getInstance().mRefreshGpsFlag = true;
                let locationData = {
                    "eventType": SendNativeMsgType.SEND_NATIVE_GET_LOCATION,
                    "data": {
                    }
                }
                NativeBridge.getInstance().sendNativeMessage(JSON.stringify(locationData));
            }
            else {
                //非微信授权 发送gps信息
                let vUpdatePlayerGPSMsg: NewUpdateGPSPositionMsg = new NewUpdateGPSPositionMsg();
                //测试代码
                if (tablePos === 0) {
                    //深圳
                    vUpdatePlayerGPSMsg.px = 22.61667;
                    vUpdatePlayerGPSMsg.py = 114.06667;
                } else if (tablePos === 1) {
                    //广州
                    vUpdatePlayerGPSMsg.px = 23.16667;
                    vUpdatePlayerGPSMsg.py = 113.23333;
                } else if (tablePos === 2) {
                    //北京 116.41667,39.91667
                    vUpdatePlayerGPSMsg.px = 39.91667;
                    vUpdatePlayerGPSMsg.py = 116.41667;
                } else {
                    //上海市区经纬度:(121.43333,34.50000)
                    vUpdatePlayerGPSMsg.px = 34.50000;
                    vUpdatePlayerGPSMsg.py = 121.43333;
                }
                // vUpdatePlayerGPSMsg.playerTablePos = tablePos;
                ServerUtil.sendMsg(vUpdatePlayerGPSMsg);
            }
        }

        /**
         * 新玩家加入牌桌
         */
        public exeNewTablePlayerInfoChangeMsgAck(msg: NewTablePlayerInfoChangeMsgAck): void {
            // egret.log(msg);
            // if (GameConstant.CURRENT_HANDLE.isReplay()) return;
            // let pzOrientation = GameConstant.CURRENT_HANDLE.setGamePlayerInfo(msg.newGamePlayer);
            // 两个都改了
            let pzOrientationRF: {orientation:PZOrientation, isAdd:boolean} = RFGameHandle.setGamePlayerInfo(msg.newGamePlayer);
            let pzOrientationMAHJONG: {orientation:PZOrientation, isAdd:boolean} = MahjongHandler.setGamePlayerInfo(msg.newGamePlayer);
            //更新玩家信息
            if (GameConstant.CURRENT_GAMETYPE === EGameType.RF) {
                if (RFGameHandle.isReplay()) return;
                MvcUtil.send(RFGameModule.RFGAME_REFRESH_PLAYER_INFO, pzOrientationRF.orientation);
            } else if (GameConstant.CURRENT_GAMETYPE === EGameType.MAHJONG) {
                if (MahjongHandler.isReplay()) return;
                MvcUtil.send(MahjongModule.MAHJONG_UPDATE_PLAYER_HEAD_AREA, pzOrientationMAHJONG.orientation);
                if (pzOrientationMAHJONG.isAdd) {
                    // 玩家数量改变
                    MvcUtil.send(MahjongModule.MAHJONG_PLAYER_NUM_CHANGE, true);
                }
            }
        }

        /**
        * 更新玩家GPS信息
        * @param {FL.NewUpdateGPSPositionMsgAck} msg
        */
        public exeNewUpdateGPSPositionMsgAck(msg: NewUpdateGPSPositionMsgAck): void {
            // egret.log(msg);
            //设置值
            RFGameData.playerGps[msg.playerTablePos] = msg;
            //设置值
            MahjongData.playerGps[msg.playerTablePos] = msg;

            if (GameConstant.CURRENT_GAMETYPE === EGameType.RF) {
                if (RFGameHandle.isReplay()) return;
                //设置值
                // RFGameData.playerGps[msg.playerTablePos] = msg;
                //获得方向
                let vPZOrientation: PZOrientation = RFGameHandle.getPZOrientation(msg.playerTablePos);
                //发送更新玩家信息指令
                MvcUtil.send(RFGameModule.RFGAME_REFRESH_PLAYER_INFO, vPZOrientation);
            } else if (GameConstant.CURRENT_GAMETYPE === EGameType.MAHJONG) {

                if (MahjongHandler.isReplay()) return;
                //设置值
                // MahjongData.playerGps[msg.playerTablePos] = msg;
                //获得方向
                let vPZOrientation: PZOrientation = MahjongHandler.getPZOrientation(msg.playerTablePos);
                //发送更新玩家信息指令
                MvcUtil.send(MahjongModule.MAHJONG_UPDATE_PLAYER_HEAD_AREA, vPZOrientation);
            }
        }

        /**
         * 解散房间通知
         * @param {FL.ApplyDismissRoomMsgAck} msg
         */
        public exeApplyDismissRoomMsgAck(msg: ApplyDismissRoomMsgAck): void {
            MvcUtil.send(RFGameModule.RFGAME_APPLY_DISMISS_ROOM, msg);
        }

        /** 
         * 玩家离开房间
         */
        public exeNewPlayerLeaveRoomMsgAck(msg: NewPlayerLeaveRoomMsgAck): void {
            // egret.log(msg);
            // 不知道是哪一个全部删除
            delete RFGameData.playerInfo[msg.playerPos];
            //删除玩家GPS
            delete RFGameData.playerGps[msg.playerPos];
            delete MahjongData.playerInfo[msg.playerPos];
            //删除玩家GPS
            delete MahjongData.playerGps[msg.playerPos];
            //删除玩家信息
            if (GameConstant.CURRENT_GAMETYPE === EGameType.RF) {
                // delete RFGameData.playerInfo[msg.playerPos];
                // //删除玩家GPS
                // delete RFGameData.playerGps[msg.playerPos];
                let pzOrientation = RFGameHandle.getPZOrientation(msg.playerPos);
                //更新玩家信息
                MvcUtil.send(RFGameModule.RFGAME_REFRESH_PLAYER_INFO, pzOrientation);

            } else if (GameConstant.CURRENT_GAMETYPE === EGameType.MAHJONG) {
                // delete MahjongData.playerInfo[msg.playerPos];
                // //删除玩家GPS
                // delete MahjongData.playerGps[msg.playerPos];
                let pzOrientation = MahjongHandler.getPZOrientation(msg.playerPos);
                //更新玩家信息
                MvcUtil.send(MahjongModule.MAHJONG_UPDATE_PLAYER_HEAD_AREA, pzOrientation);
                // 玩家数量改变
                MvcUtil.send(MahjongModule.MAHJONG_PLAYER_NUM_CHANGE, false);
            }
        }

        /**
         * 玩家聊天
         * @param {FL.NewTalkingInGameMsgAck} msg
         */
        public exeTalkingInGameMsg(msg: NewTalkingInGameMsgAck): void {
            // 不在游戏中不处理
            // if (GameConstant.CURRENT_GAMETYPE == EGameType.RF && RFGameHandle.isReplay()) return;
            // if (GameConstant.CURRENT_GAMETYPE == EGameType.MAHJONG && MahjongHandler.isReplay()) return;

            if (GameConstant.CURRENT_GAMETYPE == EGameType.RF) {
                if (RFGameHandle.isReplay() || RFGameHandle.getGameState() === null) return;
            } else if (GameConstant.CURRENT_GAMETYPE == EGameType.MAHJONG) {
                if (MahjongHandler.isReplay() || MahjongHandler.getGameState() === null) return;
            } else {
                // 没有在游戏中返回
                return;
            }
            /**快捷文字*/
            // egret.log(msg);
            if (msg.msgType === 0) {
                if (GameConstant.CURRENT_GAMETYPE == EGameType.MAHJONG)
                    MvcUtil.send(MahjongModule.GAME_SEND_QUICK_TEXT, msg);
                else
                    MvcUtil.send(RFGameModule.GAME_SEND_QUICK_TEXT, msg);
            }
            /**表情*/
            else if (msg.msgType === 1) {
                if (GameConstant.CURRENT_GAMETYPE == EGameType.MAHJONG)
                    MvcUtil.send(MahjongModule.GAME_SEND_FACE, msg);
                else
                    MvcUtil.send(RFGameModule.GAME_SEND_FACE, msg);
            }
            /**文字*/
            else if (msg.msgType === 2) {
                if (GameConstant.CURRENT_GAMETYPE == EGameType.MAHJONG)
                    MvcUtil.send(MahjongModule.GAME_SEND_TEXT, msg);
                else
                    MvcUtil.send(RFGameModule.GAME_SEND_TEXT, msg);
            }
            /**互动表情*/
            else if (msg.msgType === 4 && msg.msgNo === 0) {
                if (GameConstant.CURRENT_GAMETYPE == EGameType.MAHJONG)
                    MvcUtil.send(MahjongModule.GAME_SEND_PROS, { msg: msg, tType: DBGroupName.SEND_ROSE });
                else
                    MvcUtil.send(RFGameModule.GAME_SEND_PROS, { msg: msg, tType: DBGroupName.SEND_ROSE });
            } else if (msg.msgType === 4 && msg.msgNo === 1) {
                if (GameConstant.CURRENT_GAMETYPE == EGameType.MAHJONG)
                    MvcUtil.send(MahjongModule.GAME_SEND_PROS, { msg: msg, tType: DBGroupName.THROW_EGG });
                else
                    MvcUtil.send(RFGameModule.GAME_SEND_PROS, { msg: msg, tType: DBGroupName.THROW_EGG });
            } else if (msg.msgType === 4 && msg.msgNo === 2) {
                if (GameConstant.CURRENT_GAMETYPE == EGameType.MAHJONG)
                    MvcUtil.send(MahjongModule.GAME_SEND_PROS, { msg: msg, tType: DBGroupName.SEND_KISS });
                else
                    MvcUtil.send(RFGameModule.GAME_SEND_PROS, { msg: msg, tType: DBGroupName.SEND_KISS });
            } else if (msg.msgType === 4 && msg.msgNo === 3) {
                if (GameConstant.CURRENT_GAMETYPE == EGameType.MAHJONG)
                    MvcUtil.send(MahjongModule.GAME_SEND_PROS, { msg: msg, tType: DBGroupName.THROW_SHOES });
                else
                    MvcUtil.send(RFGameModule.GAME_SEND_PROS, { msg: msg, tType: DBGroupName.THROW_SHOES });
            } else if (msg.msgType === 4 && msg.msgNo === 4) {
                if (GameConstant.CURRENT_GAMETYPE == EGameType.MAHJONG)
                    MvcUtil.send(MahjongModule.GAME_SEND_PROS, { msg: msg, tType: DBGroupName.SEND_CHEER });
                else
                    MvcUtil.send(RFGameModule.GAME_SEND_PROS, { msg: msg, tType: DBGroupName.SEND_CHEER });
            } else if (msg.msgType === 4 && msg.msgNo === 5) {
                if (GameConstant.CURRENT_GAMETYPE == EGameType.MAHJONG)
                    MvcUtil.send(MahjongModule.GAME_SEND_PROS, { msg: msg, tType: DBGroupName.THROW_BOOM });
                else
                    MvcUtil.send(RFGameModule.GAME_SEND_PROS, { msg: msg, tType: DBGroupName.THROW_BOOM });
            }
            /**原生语音 */
            else if (msg.msgType == 5) {
                TalkCache.pushMsg(msg);
            }
        }

        /**
         * VIP房间结束结算通知
         * @param {FL.NewVipRoomOverSettleAccountsMsgAck} msg
         */
        public exeNewVipRoomOverSettleAccountsMsgAck(msg: NewVipRoomOverSettleAccountsMsgAck): void {
            // MvcUtil.send(RFGameModule.RFGAME_OPEN_ROOM_OVER_VIEW, msg);
            // egret.log(msg);
            RFGameData.vipRoomCloseMsg = msg;
            if (msg.isDismiss) {
                this.openGameOverView();
            }
        }

        private openGameOverView() {
            MvcUtil.send(RFGameModule.RFGAME_OPEN_ROOM_OVER_VIEW, RFGameHandle.getVipRoomCloseMsg());
        }

        /**
         * 跑的快游戏结束结算通知
         * @param {FL.PaoDeKuaiGameOverSettleAccountsMsgAck} msg
         */
        public exePaoDeKuaiGameOverSettleAccountsMsgAck(msg: PaoDeKuaiGameOverSettleAccountsMsgAck): void {
            // console.log(msg);
            // MvcUtil.send(RFGameModule.RFGAME_OPEN_GAME_OVER_VIEW, msg);
            RFGameData.gameOverMsgAck = msg;
            let isChunTian = false;
            msg.playerInfos.forEach(x => {
                if (x.isChunTian) {
                    isChunTian = true;
                }
            })
            if (isChunTian) MvcUtil.send(RFGameModule.RFGAME_PLAY_CARD_ANI, DBGroupName.CHUN_TIAN);
            // if (!RFGameHandle.isOpenGameOverView()) {
            //延时进入界面
            MyCallBackUtil.delayedCallBack(200, this.openPDKGameOverView, this);
            // } else {
            //     this.openPDKGameOverView();
            // }

            // 清理回放数据
            RFGameData.pokerRefreshhistoryMsgAck = null;
        }

        private openPDKGameOverView() {
            // console.log('over');
            MvcUtil.send(RFGameModule.RFGAME_OPEN_GAME_OVER_VIEW, RFGameHandle.getGameOverMsgAck());
        }

        /**
         * 托管消息返回
         */
        public exeNewGameTableTuoGuanMsgAck(msg: NewGameTableTuoGuanMsgAck) {
            // egret.log(msg);
            if (GameConstant.CURRENT_GAMETYPE === EGameType.RF) {
                let pzOrientation = RFGameHandle.getPZOrientation(msg.tablePos);
                if (pzOrientation == PZOrientation.DOWN) {
                    RFGameProxy.tuoGuanState = (msg.tuoGuanAction) ? false : true;
                    //只有自己才处理这个消息
                    MvcUtil.send(RFGameModule.GAME_MY_OVERTIME_AUTO_CHU, (msg.tuoGuanAction) ? false : true);
                }
            } else if (GameConstant.CURRENT_GAMETYPE === EGameType.MAHJONG) {
                let pzOrientation = MahjongHandler.getPZOrientation(msg.tablePos);
                if (pzOrientation == PZOrientation.DOWN) {
                    MahjongProxy.tuoGuanState = (msg.tuoGuanAction) ? false : true;
                    //只有自己才处理这个消息
                    MvcUtil.send(MahjongModule.MAHJONG_GAME_MY_OVERTIME_AUTO_CHU, (msg.tuoGuanAction) ? false : true);
                }
            }
        }

        /**
         * 处理不能离开了
         * @param {FL.NewGameTableCanNotLeaveRoomMsgAck} msg
         */
        public exeNewGameTableCanNotLeaveRoomMsgAck(msg: NewGameTableCanNotLeaveRoomMsgAck) {
            // 消息在未进入牌桌的时候也会收到，有时区分不出来到底该使用哪个handle
            if (RFGameData.requestStartGameMsgAck) {
                RFGameData.requestStartGameMsgAck.isCanLeaveRoom = false;
            }
            if (MahjongData.requestStartGameMsgAck) {
                MahjongData.requestStartGameMsgAck.isCanLeaveRoom = false;
            }
            MvcUtil.send(RFGameModule.RFGAME_CAN_NOT_LEAVE_ROOM);
        }

        /**
         * 处理刷新回放信息
         */
        public exePokerRefreshHistoryMsgAck(msg: PokerRefreshHistoryMsgAck) {
            RFGameData.pokerRefreshhistoryMsgAck = msg;
        }
    }
}