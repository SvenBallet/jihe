module FL {
    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase - MJGameProxy
     * @Description:  //麻将游戏代理
     * @Create: DerekWu on 2017/11/14 18:49
     * @Version: V1.0
     */
    export class MJGameProxy extends puremvc.Proxy {

        /** 代理名 */
        public static readonly NAME: string = "MJGameProxy";
        /** 单例 */
        private static instance: MJGameProxy;

        /** 每秒定时器 */
        private _secondTicker: Game.Timer;

        /** 游戏当前进入后台的离线状态 */
        // private _isExeGameIntoBack:boolean = false;

        private constructor() {
            super(MJGameProxy.NAME);
        }

        public static getInstance(): MJGameProxy {
            if (!this.instance) {
                let vNewMJGameProxy = new MJGameProxy();
                // let vTimer:Game.Timer = new Game.Timer(1000);
                // vTimer.addEventListener(egret.TimerEvent.TIMER, vNewMJGameProxy.secondTickerUpdate, vNewMJGameProxy);
                // vTimer.start();
                // vNewMJGameProxy._secondTicker = vTimer;
                this.instance = vNewMJGameProxy;

            }
            return this.instance;
        }

        /**
         * 每秒定制器更新
         * @param {egret.TimerEvent} e
         */
        // private secondTickerUpdate(e:egret.TimerEvent): void {
        //     if (GlobalData.isIntoBack && !GlobalData.isGameIntoBack && MJGameHandler.getMJGameState() !== MJGameState.NULL && Date.now() > GlobalData.intoBackTimes + 10000) {
        //         //给服务器发送消息
        //         let vPlayerGameOpertaionMsg:PlayerGameOpertaionMsg = new PlayerGameOpertaionMsg();
        //         vPlayerGameOpertaionMsg.opertaionID = GameConstant.GAME_OPERTAION_PLAYER_LEFT_TABLE;
        //         ServerUtil.sendMsg(vPlayerGameOpertaionMsg);
        //         GlobalData.isGameIntoBack = true;
        //     }
        // }

        /**
         * 开始游戏消息
         * @param {FL.RequestStartGameMsgAck} msg
         * @param {boolean} isReplay
         */
        public exeRequestStartGameMsgAck(msg: RequestStartGameMsgAck, isReplay: boolean = false): void {

            ReqLoadingViewUtil.delReqLoadingView();

            //设置不是重放
            MJGameData.isReplay = isReplay;
            MJGameHandler.resetMJGameData();

            //判断结果
            if (msg.result === ErrorCodeConstant.CMD_EXE_OK) {
                //是否代开房
                //NumberUtil.isAndNumber(msg.unused_0, GameConstant.AGENT_TABLE_FLAG)
                if (msg.roomType === 1 && msg.vipTableID === 0) {
                    MvcUtil.send(LobbyModule.LOBBY_INTO_LOBBY);
                    egret.localStorage.setItem("agentTabIndex", AGENT_ITEM[2]);
                    ReminderViewUtil.showReminderView({
                        hasLeftBtn: true,
                        hasRightBtn: true,
                        leftCallBack: new MyCallBack(MvcUtil.send, MvcUtil, AgentModule.AGENT_INTO_AGENT),
                        text: "代开房创建成功！"
                    });
                } else if (msg.roomType === 2 && msg.vipTableID === 0) {
                    PromptUtil.show("俱乐部房间创建成功！", PromptType.SUCCESS);
                    MvcUtil.addView(ClubBaseView.getInstance());
                    MvcUtil.send(ClubModule.CLUB_GET_ROOM_LIST);
                } else {
                    //不是代开房，进入牌桌等待

                    //设置已经进入游戏
                    CommonHandler.setIsIntoGame(true);

                    //设置数据
                    MJGameData.requestStartGameMsgAck = msg;
                    //标记状态，等待开始
                    // MJGameData.mjGameState = MJGameState.WAITING_START;
                    MJGameHandler.setGameState(EGameState.WAITING_START);

                    //设置人数
                    MJGameData.gameMaxNum = msg.playersNumber;

                    //初始化显示组属性
                    RFGameViewPropsHandle.init(msg.playersNumber);

                    //设置玩家信息
                    let vSimplePlayerArray: Array<SimplePlayer> = msg.players, vCurrSimplePlayer: SimplePlayer;
                    for (let vIndex: number = 0, vLength: number = vSimplePlayerArray.length; vIndex < vLength; ++vIndex) {
                        vCurrSimplePlayer = vSimplePlayerArray[vIndex];
                        MJGameData.playerInfo[vCurrSimplePlayer.tablePos] = vCurrSimplePlayer;
                    }

                    if (!isReplay) {
                        // 不是回放则发送我的gps位置
                        this.sendUpdateGps(msg.tablePos);
                    }

                    //进入房间
                    MvcUtil.send(MJGameModule.MJGAME_INTO_ROOM);
                }
            } else {
                if (msg.result === ErrorCodeConstant.CAN_ENTER_VIP_ROOM) {
                    //可以进入VIP房间，什么都不干
                } else {
                    // egret.log("#  result = "+msg.result);
                    PromptUtil.show(Local.text(msg.result), PromptType.ERROR);
                }
                //设置数据
                MJGameData.requestStartGameMsgAck = null;
            }
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
                        let vUpdatePlayerGPSMsg: UpdatePlayerGPSMsg = new UpdatePlayerGPSMsg();
                        vUpdatePlayerGPSMsg.px = latitude;
                        vUpdatePlayerGPSMsg.py = longitude;
                        vUpdatePlayerGPSMsg.playerTablePos = this.tablePos;
                        ServerUtil.sendMsg(vUpdatePlayerGPSMsg);
                    }
                });
            }
            else if (GConf.Conf.useWXAuth == 2 || FL.GConf.Conf.useWXAuth == 3) {
                console.log("MJGAME SEND GPS");
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
                let vUpdatePlayerGPSMsg: UpdatePlayerGPSMsg = new UpdatePlayerGPSMsg();
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
                vUpdatePlayerGPSMsg.playerTablePos = tablePos;
                ServerUtil.sendMsg(vUpdatePlayerGPSMsg);
            }
        }

        /**
         * 牌局开始
         * @param {FL.GameStartMsg} msg
         */
        public exeGameStartMsg(msg: GameStartMsg): void {

            ReqLoadingViewUtil.delReqLoadingView();

            //设置值
            MJGameData.gameStartMsg = msg;
            //标记状态，游戏中
            // MJGameData.mjGameState = MJGameState.PLAYING;
            MJGameHandler.setGameState(EGameState.PLAYING);
            //设置剩余的牌为0，这个时候没有这个值
            MJGameData.cardLeftNum.value = 0;
            //开局关闭自己触摸点击开关(废弃)
            // MJGameHandler.touchHandCardSwitch.close();
            //重置补花数量
            MJGameHandler.resetMyBuhuaNum();

            //更新金币数并更新显示头像
            let num = msg.unused_1;
            if (num === 4 && !msg.unused_3) {
                for (let i = 0; i < num; i++) {
                    MJGameHandler.updateGoldNum(i);
                    let vPZOrientation = MJGameHandler.getPZOrientation(i);
                    MvcUtil.send(MJGameModule.MJGAME_UPDATE_PLAYER, vPZOrientation);
                }
            }

            //开始游戏
            MvcUtil.send(MJGameModule.MJGAME_START_GAME);

            //查询是否有人请求解散桌子
            let vPlayerGameOpertaionMsg: PlayerGameOpertaionMsg = new PlayerGameOpertaionMsg();
            vPlayerGameOpertaionMsg.opertaionID = GameConstant.GAME_OPERTAION_QUERY_TABLE_DISMISS;
            ServerUtil.sendMsg(vPlayerGameOpertaionMsg);

        }

        /**
         * 处理玩家操作
         * @param {FL.PlayerGameOpertaionAckMsg} msg
         */
        public exePlayerGameOpertaionAckMsg1(msg: PlayerGameOpertaionAckMsg): void {
            if (!MJGameHandler.isReplay()) {
                this.exePlayerGameOpertaionAckMsg(msg);
            }
        }

        /**
         * 处理玩家操作
         * @param {FL.PlayerGameOpertaionAckMsg} msg
         */
        public exePlayerGameOpertaionAckMsg(msg: PlayerGameOpertaionAckMsg): void {
            //更具操作类型分开处理
            if (msg.opertaionID === GameConstant.GAME_OPERTAION_TABLE_ADD_NEW_PLAYER) {
                //添加玩家
                MJGameHandler.addNewOrLeftTablePlayer(msg, true);
                //获得方向
                let vPZOrientation: PZOrientation = MJGameHandler.getPZOrientation(msg.tablePos);
                //发送更新玩家信息指令
                MvcUtil.send(MJGameModule.MJGAME_UPDATE_PLAYER, vPZOrientation);
                //发送我自己的GPS信息到这个玩家
                //发送我的gps位置
                this.sendUpdateGps(MJGameHandler.getTablePos(PZOrientation.DOWN));
            } else if (msg.opertaionID === GameConstant.GAME_OPERTAION_PLAYER_LEFT_TABLE) {
                //玩家离开
                if (!MJGameHandler.isVipRoom()) {
                    if (MJGameHandler.getGameState() === EGameState.WAITING_START) {
                        //金币场，并且未开始，删除
                        delete MJGameData.playerInfo[msg.tablePos];
                    } else {
                        //已经开始，则不能删除，只能更新
                        MJGameHandler.addNewOrLeftTablePlayer(msg, false);
                    }
                } else {
                    if (MJGameHandler.getGameState() === EGameState.WAITING_START && MJGameHandler.getCurrentHand() === 0) {
                        //VIP房间等待中，并且一局麻将都还没有开始打，删除
                        delete MJGameData.playerInfo[msg.tablePos];
                    } else {
                        //VIP房间已经开打过了，不能删除，只能更新
                        MJGameHandler.addNewOrLeftTablePlayer(msg, false);
                    }
                }
                //移除gps信息
                delete MJGameData.playerGps[msg.tablePos];
                //获得方向
                let vPZOrientation: PZOrientation = MJGameHandler.getPZOrientation(msg.tablePos);
                //发送更新玩家信息指令
                MvcUtil.send(MJGameModule.MJGAME_UPDATE_PLAYER, vPZOrientation);
            } else if (msg.opertaionID === GameConstant.MAHJONG_OPERTAION_WAITING_OR_CLOSE_VIP) {
                MvcUtil.send(MJGameModule.MJGAME_WAITING_OR_CLOSE_VIP, msg);
            } else if (msg.opertaionID === GameConstant.GAME_OPERTAION_BUY_ITEM) {
                if (msg.result === ErrorCodeConstant.CMD_EXE_OK) {
                    if (msg.canFriend === GameConstant.GAME_OPERTAION_BUY_DIAMOND) {
                        //购买钻石，前面已经
                        // LobbyData.playerVO.gold.value = msg.gold;
                        // LobbyData.playerVO.diamond.value = msg.opValue;
                        PromptUtil.show("购买成功！", PromptType.SUCCESS);
                    }
                } else if (msg.result === GameConstant.DIAMOND_NOT_ENOUGH) {
                    //钻石不足
                    PromptUtil.show("钻石不足，购买失败！", PromptType.ERROR);
                } else {
                    // egret.log("#TODO GAME_OPERTAION_BUY_ITEM msg.result="+msg.result);
                }
            } else {
                // egret.log("#TODO PlayerGameOpertaionAckMsg opertaionID="+StringUtil.numToHexStr(msg.opertaionID));
            }
        }

        /**
         * 提醒玩家操作
         * @param {FL.PlayerOperationNotifyMsg} msg
         */
        public exePlayerOperationNotifyMsg1(msg: PlayerOperationNotifyMsg): void {
            if (!MJGameHandler.isReplay()) {
                this.exePlayerOperationNotifyMsg(msg);
            }
        }

        /**
         * 提醒玩家操作
         * @param {FL.PlayerOperationNotifyMsg} msg
         */
        public exePlayerOperationNotifyMsg(msg: PlayerOperationNotifyMsg): void {
            //获得牌桌方向
            let vPZOrientation: PZOrientation = MJGameHandler.getPZOrientation(msg.player_table_pos);
            if (msg.operation === GameConstant.MAHJONG_OPERTAION_TIP) {
                //轮到谁出牌了
                MvcUtil.send(MJGameModule.MJGAME_TIP_PLAYER_HANDLE, msg.player_table_pos);
                //更新牌桌上剩余的牌
                MJGameData.cardLeftNum.value = msg.cardLeftNum;
                // egret.log("cardLeftNum 1 ="+MJGameData.cardLeftNum.value);
            } else if (msg.operation === GameConstant.MAHJONG_OPERTAION_BU_HUA) {
                // egret.log("msg.tingList length="+msg.tingList);
                if (msg.tingList && msg.tingList.length > 0) {
                    // egret.log(msg.tingList);
                    //开局自动补花 通知
                    if (vPZOrientation === PZOrientation.DOWN || MJGameHandler.isReplay()) {
                        //找到自己的手牌，找出花牌，合并补花补回来的牌到手牌中
                        let vHuaHandObj: { huaCards: number[], handCards: number[] } = MJGameHandler.getHuaHandCardsObj(msg.tingList, vPZOrientation);
                        MvcUtil.send(MJGameModule.MJGAME_BU_HUA, {
                            tablePos: msg.player_table_pos,
                            isMyAutoBuhua: true,
                            huaCardArray: vHuaHandObj.huaCards
                        });
                        //我自己 就处理 增加补花数量1
                        // MJGameHandler.addMyBuhuaNum(msg.tingList.length);
                        //刷新手牌
                        MvcUtil.send(MJGameModule.MJGAME_REFRESH_HAND_PAI, {
                            tablePos: msg.player_table_pos,
                            handCards: vHuaHandObj.handCards
                        });
                    } else {
                        MvcUtil.send(MJGameModule.MJGAME_BU_HUA, {
                            tablePos: msg.player_table_pos,
                            isMyAutoBuhua: false,
                            huaCardArray: msg.tingList
                        });
                    }
                    //更新牌桌上剩余的牌
                    MJGameData.cardLeftNum.value -= msg.tingList.length;
                    // egret.log("cardLeftNum 2 ="+MJGameData.cardLeftNum.value);
                }
                if (vPZOrientation === PZOrientation.DOWN) {
                    //自己自动补完花之后开启开关
                    MJGameHandler.touchHandCardSwitch.compelOpen();
                }
            } else if (msg.operation === GameConstant.MAHJONG_OPERTAION_HU_CARD_LIST_UPDATE) {
                //通知玩家可以胡的牌
                MvcUtil.send(MJGameModule.MJGAME_HU_CARD_LIST_UPDATE, msg.tingList);
                //更新牌桌上剩余的牌
                // MJGameData.cardLeftNum.value = msg.cardLeftNum;
                // egret.log("cardLeftNum 5 ="+MJGameData.cardLeftNum.value);
            } else if (msg.operation === GameConstant.MAHJONG_OPERTAION_REMOE_CHU_CARD) {
                //玩家打出的牌，被吃碰杠走了
                MvcUtil.send(MJGameModule.MJGAME_REMOE_CHU_CARD, vPZOrientation);
                //更新牌桌上剩余的牌
                MJGameData.cardLeftNum.value = msg.cardLeftNum;
                // egret.log("cardLeftNum 3 ="+MJGameData.cardLeftNum.value);
            } else if (msg.operation === GameConstant.MAHJONG_OPERTAION_CANCEL) {
                //通知玩家取消操作
                MvcUtil.send(MJGameModule.MJGAME_OPERATION_CANCEL);
            } else if (msg.operation === GameConstant.MAHJONG_OPERTAION_PLAYER_HU_CONFIRMED) {
                //玩家胡牌
                MJGameData.isReceivedHuInfo = true;
                MvcUtil.send(MJGameModule.MJGAME_HU, msg);
            } else if (msg.operation === GameConstant.MAHJONG_OPERTAION_OVERTIME_AUTO_CHU) {
                //玩家超时自动出牌,只用来显示托管
                if (vPZOrientation === PZOrientation.DOWN) {
                    MvcUtil.send(MJGameModule.MJGAME_MY_OVERTIME_AUTO_CHU);
                }
            } else if (msg.operation === GameConstant.MAHJONG_OPERTAION_OFFLINE) {
                //玩家离线
                let vSimplePlayer: SimplePlayer = MJGameData.playerInfo[msg.player_table_pos];
                if (vSimplePlayer) {
                    PromptUtil.show(vSimplePlayer.playerName + " 离开了游戏房间！", PromptType.ERROR);
                    vSimplePlayer.inTable = 2;
                    //发送更新玩家信息指令
                    MvcUtil.send(MJGameModule.MJGAME_UPDATE_PLAYER, vPZOrientation);
                }
            } else if (msg.operation === GameConstant.MAHJONG_OPERTAION_ONLINE) {
                //玩家上线
                let vSimplePlayer: SimplePlayer = MJGameData.playerInfo[msg.player_table_pos];
                if (vSimplePlayer) {
                    PromptUtil.show(vSimplePlayer.playerName + " 回到了游戏房间！", PromptType.SUCCESS);
                    vSimplePlayer.inTable = 1;
                    if (MJGameHandler.getGameState() === EGameState.WAITING_START) {
                        vSimplePlayer.gameState = GameConstant.PALYER_GAME_STATE_IN_TABLE_READY;
                    } else {
                        vSimplePlayer.gameState = GameConstant.PALYER_GAME_STATE_IN_TABLE_PLAYING;
                    }
                    //发送更新玩家信息指令
                    MvcUtil.send(MJGameModule.MJGAME_UPDATE_PLAYER, vPZOrientation);
                    //发送我的gps位置
                    this.sendUpdateGps(MJGameHandler.getTablePos(PZOrientation.DOWN));
                }
            } else if (NumberUtil.isAndNumber(msg.operation, GameConstant.MAHJONG_OPERTAION_CHU)
                || NumberUtil.isAndNumber(msg.operation, GameConstant.MAHJONG_OPERTAION_CHI)
                || NumberUtil.isAndNumber(msg.operation, GameConstant.MAHJONG_OPERTAION_PENG)
                || NumberUtil.isAndNumber(msg.operation, GameConstant.MAHJONG_OPERTAION_MING_GANG)
                || NumberUtil.isAndNumber(msg.operation, GameConstant.MAHJONG_OPERTAION_AN_GANG)
                || NumberUtil.isAndNumber(msg.operation, GameConstant.MAHJONG_OPERTAION_TING)
                || NumberUtil.isAndNumber(msg.operation, GameConstant.MAHJONG_OPERTAION_HU)) {
                if (vPZOrientation === PZOrientation.DOWN) {
                    //发送提醒玩家出牌指令，其中有一个新模进来的牌，只会提醒自己
                    MvcUtil.send(MJGameModule.MJGAME_REMIND_CHU_PAI, msg);
                }
            } else {
                egret.log("#TODO PlayerOperationNotifyMsg operation=" + StringUtil.numToHexStr(msg.operation));
            }
        }

        /**
         * 玩家操作行为，可以是客户端发起，也可以是服务端推送回来的消息
         * @param {FL.PlayerTableOperationMsg} msg
         */
        public exePlayerTableOperationMsg1(msg: PlayerTableOperationMsg): void {
            if (!MJGameHandler.isReplay()) {
                this.exePlayerTableOperationMsg(msg);
            }
        }

        /**
         * 玩家操作行为，可以是客户端发起，也可以是服务端推送回来的消息
         * @param {FL.PlayerTableOperationMsg} msg
         */
        public exePlayerTableOperationMsg(msg: PlayerTableOperationMsg): void {
            //获得牌桌方向
            let vPZOrientation: PZOrientation = MJGameHandler.getPZOrientation(msg.player_table_pos);
            if (msg.operation === GameConstant.MAHJONG_OPERTAION_BU_HUA) {
                // egret.log("msg.card_value="+msg.card_value);
                if (vPZOrientation === PZOrientation.DOWN && !MJGameHandler.isReplay()) {
                    //我自己 就处理 增加补花数量1
                    MJGameHandler.addMyBuhuaNum(1);
                }
                MvcUtil.send(MJGameModule.MJGAME_BU_HUA, {
                    tablePos: msg.player_table_pos,
                    isMyAutoBuhua: false,
                    huaCardArray: [msg.card_value]
                });
                if (MJGameHandler.isReplay()) {
                    MJGameData.cardLeftNum.value = msg.cardLeftNum;
                } else {
                    MJGameData.cardLeftNum.value -= 1;
                }
                // egret.log("cardLeftNum 6 ="+MJGameData.cardLeftNum.value);
            } else if (msg.operation === GameConstant.MAHJONG_OPERTAION_CHU) {
                if (MJGameHandler.isReplay()) {
                    if (msg.card_value !== 0) {
                        // 兼容回放的情况
                        MvcUtil.send(MJGameModule.MJGAME_CHU_PAI, msg);
                    }
                } else {
                    MvcUtil.send(MJGameModule.MJGAME_CHU_PAI, msg);
                }
                MJGameData.cardLeftNum.value = msg.cardLeftNum;
                // egret.log("cardLeftNum 4 ="+MJGameData.cardLeftNum.value);
                //刷新手牌
                MvcUtil.send(MJGameModule.MJGAME_REFRESH_HAND_PAI, {
                    tablePos: msg.player_table_pos,
                    handCards: msg.handCards
                });
            } else if (msg.operation === GameConstant.MAHJONG_OPERTAION_CHI) {
                // 添加吃
                MvcUtil.send(MJGameModule.MJGAME_CHI, msg);
            } else if (msg.operation === GameConstant.MAHJONG_OPERTAION_PENG) {
                //添加碰牌
                MvcUtil.send(MJGameModule.MJGAME_PENG, msg);
            } else if (msg.operation === GameConstant.MAHJONG_OPERTAION_MING_GANG) {
                //添加明杠
                MvcUtil.send(MJGameModule.MJGAME_MING_GANG, msg);
            } else if (msg.operation === GameConstant.MAHJONG_OPERTAION_AN_GANG) {
                //添加暗杠
                MvcUtil.send(MJGameModule.MJGAME_AN_GANG, msg);
            } else if (msg.operation === GameConstant.MAHJONG_OPERTAION_BU_GANG) {
                //添加明杠
                MvcUtil.send(MJGameModule.MJGAME_BU_GANG, msg);
            } else if (msg.operation === GameConstant.MAHJONG_OPERTAION_TING) {
                //设置听牌标识
                MvcUtil.send(MJGameModule.MJGAME_TING, vPZOrientation);
            } else if (msg.operation === GameConstant.MAHJONG_OPERTAION_SCORE_UPDATE) {
                // 更新牌局中的分数
                MvcUtil.send(MJGameModule.MJGAME_SCORE_UPDATE, msg);
            } else {
                // egret.log("#TODO PlayerTableOperationMsg operation="+StringUtil.numToHexStr(msg.operation));
            }

        }

        /**
         * 处理回放的摸牌
         * @param {FL.PlayerOperationDesc} pCurrOp
         */
        public exeReplayMoPai(pCurrOp: PlayerOperationDesc): void {
            MvcUtil.send(MJGameModule.MJGAME_REPLAY_MO_PAI, { tablePos: pCurrOp.tablePos, cardValue: pCurrOp.opValue1 });
            MJGameData.cardLeftNum.value = pCurrOp.cardLeftNum;
        }

        /**
         * 游戏结束，牌局结束服务器通知
         * @param {FL.PlayerGameOverMsgAck} msg
         */
        public exePlayerGameOverMsgAck(msg: PlayerGameOverMsgAck): void {
            //保存数据，分享的时候使用
            MJGameData.playerGameOverMsgAck = msg;
            if (MJGameHandler.isOpenGameOverView()) {
                //延时进入界面
                MyCallBackUtil.delayedCallBack(2000, this.openGameOverView, this);
            }
        }

        /**
         * 打开游戏结束界面
         */
        private openGameOverView(): void {
            MvcUtil.send(MJGameModule.MJGAME_OPEN_GAME_OVER_VIEW);
        }

        /**
         * Vip房间结束，例如：开放4局，4局打完之后的大结算，（已经废弃，改为直接转发消息）
         * @param {FL.VipRoomCloseMsg} msg
         */
        public exeVipRoomCloseMsg(msg: VipRoomCloseMsg): void {
            //保存数据，分享的时候使用
            MJGameData.vipRoomCloseMsg = msg;
            if (!MJGameData.playerGameOverMsgAck) {
                MvcUtil.send(MJGameModule.MJGAME_VIP_ROOM_CLOSE, msg);
            }
        }

        /**
         * 更新玩家GPS信息
         * @param {FL.UpdatePlayerGPSMsg} msg
         */
        public exeUpdatePlayerGPSMsg(msg: UpdatePlayerGPSMsg): void {
            // egret.log("msg.playerTablePos="+msg.playerTablePos);
            if (MJGameHandler.isReplay()) return;
            //设置值
            MJGameData.playerGps[msg.playerTablePos] = msg;
            //获得方向
            let vPZOrientation: PZOrientation = MJGameHandler.getPZOrientation(msg.playerTablePos);
            //发送更新玩家信息指令
            MvcUtil.send(MJGameModule.MJGAME_UPDATE_PLAYER, vPZOrientation);
        }

        /**
         * 玩家聊天
         * @param {FL.TalkingInGameMsg} msg
         */
        public exeTalkingInGameMsg(msg: TalkingInGameMsg): void {
            if (MJGameHandler.isReplay()) return;
            /**快捷文字*/
            egret.log(msg);
            if (msg.msgType === 0) {
                MvcUtil.send(FL.MJGameModule.MJGAME_SEND_QUICK_TEXT, msg);
            }
            /**表情*/
            else if (msg.msgType === 1) {
                MvcUtil.send(FL.MJGameModule.MJGAME_SEND_FACE, msg);
            }
            /**文字*/
            else if (msg.msgType === 2) {
                MvcUtil.send(FL.MJGameModule.MJGAME_SEND_TEXT, msg);
            }
            /**互动表情*/
            else if (msg.msgType === 4 && msg.msgNo === 0) {
                MvcUtil.send(FL.MJGameModule.MJGAME_SEND_PROS, { msg: msg, tType: DBGroupName.SEND_ROSE });
            } else if (msg.msgType === 4 && msg.msgNo === 1) {
                MvcUtil.send(FL.MJGameModule.MJGAME_SEND_PROS, { msg: msg, tType: DBGroupName.THROW_EGG });
            } else if (msg.msgType === 4 && msg.msgNo === 2) {
                MvcUtil.send(FL.MJGameModule.MJGAME_SEND_PROS, { msg: msg, tType: DBGroupName.SEND_KISS });
            } else if (msg.msgType === 4 && msg.msgNo === 3) {
                MvcUtil.send(FL.MJGameModule.MJGAME_SEND_PROS, { msg: msg, tType: DBGroupName.THROW_SHOES });
            } else if (msg.msgType === 4 && msg.msgNo === 4) {
                MvcUtil.send(FL.MJGameModule.MJGAME_SEND_PROS, { msg: msg, tType: DBGroupName.SEND_CHEER });
            } else if (msg.msgType === 4 && msg.msgNo === 5) {
                MvcUtil.send(FL.MJGameModule.MJGAME_SEND_PROS, { msg: msg, tType: DBGroupName.THROW_BOOM });
            }
            /**原生语音 */
            else if (msg.msgType == 5) {
                TalkCache.pushMsg(msg);
            }
        }

        /**
         * 系统消息通知客户端
         * @param {FL.SystemNotifyMsg} msg
         */
        public exeSystemNotifyMsg(msg: SystemNotifyMsg): void {
            PromptUtil.show(msg.content, PromptType.ALERT);
        }

        /**
         * 处理游戏日志消息
         * @param {FL.GetPlayerGameLogMsg} msg
         */
        public exeGetPlayerGameLogMsg(msg: GetPlayerGameLogMsg): void {
            egret.log(msg);
            let strs:Array<string> = msg.gameTableID.split('_');
            if (strs[0] === "POKER") {//以"_"区分是麻将还是扑克牌桌
                RFGameLogReplay.startReplay(msg);
                return;
            }else if(strs[0] === "MAHJONG"){
                MahjongLogReplay.startReplay(msg);
                return;
            }
            MJGameLogReplay.startReplay(msg);
            //test------
            // RFGameLogReplay.startReplay(msg);
        }

        /**
         * 处理 玩家选择的坐拉跑信息通知消息
         * @param {FL.PlayerZuoLaPaoNotifyMsgAck} msg
         */
        public exePlayerZuoLaPaoNotifyMsgAck1(msg: PlayerZuoLaPaoNotifyMsgAck): void {
            if (!MJGameHandler.isReplay()) {
                this.exePlayerZuoLaPaoNotifyMsgAck(msg);
            }
        }

        /**
         * 处理 玩家选择的坐拉跑信息通知消息
         * @param {FL.PlayerZuoLaPaoNotifyMsgAck} msg
         */
        public exePlayerZuoLaPaoNotifyMsgAck(msg: PlayerZuoLaPaoNotifyMsgAck): void {
            let vPlayerZuoLaPaoInfoList: Array<PlayerZuoLaPaoInfo> = msg.playerZuoLaPaoInfoList;
            if (vPlayerZuoLaPaoInfoList && vPlayerZuoLaPaoInfoList.length > 0) {
                let vPlayerPZOrientationArray: PZOrientation[] = [];
                // 循环设置数据
                for (let vIndex: number = 0, vLength: number = vPlayerZuoLaPaoInfoList.length; vIndex < vLength; ++vIndex) {
                    let vOnePlayerZuoLaPaoInfo: PlayerZuoLaPaoInfo = vPlayerZuoLaPaoInfoList[vIndex];
                    if (vOnePlayerZuoLaPaoInfo.isZuoLaPao) {
                        MJGameData.zuoLaPaoInfo[vOnePlayerZuoLaPaoInfo.tablePositon] = vOnePlayerZuoLaPaoInfo;
                        vPlayerPZOrientationArray.push(MJGameHandler.getPZOrientation(vOnePlayerZuoLaPaoInfo.tablePositon));
                    }
                }
                // 通知界面处理
                MvcUtil.send(MJGameModule.MJGAME_SELECTED_ZUO_LA_PAO, vPlayerPZOrientationArray);
            }
        }

        /**
         * 处理 玩家选择的下码信息通知消息
         * @param {FL.PlayerXiaMaValueNotifyMsg} msg
         */
        public exePlayerXiaMaValueNotifyMsg1(msg: PlayerXiaMaValueNotifyMsg): void {
            if (!MJGameHandler.isReplay()) {
                this.exePlayerXiaMaValueNotifyMsg(msg);
            }
        }

        /**
         * 处理 玩家选择的下码信息通知消息
         * @param {FL.PlayerXiaMaValueNotifyMsg} msg
         */
        public exePlayerXiaMaValueNotifyMsg(msg: PlayerXiaMaValueNotifyMsg): void {
            let vPlayerTablePositons: Array<number> = msg.tablePositons;
            let vPlayerXiaMaValues: Array<number> = msg.xiaMaValues;
            if (vPlayerTablePositons && vPlayerTablePositons.length > 0 && vPlayerXiaMaValues && vPlayerTablePositons.length === vPlayerXiaMaValues.length) {
                let vPlayerPZOrientationArray: PZOrientation[] = [];
                // 循环设置数据
                for (let vIndex: number = 0, vLength: number = vPlayerTablePositons.length; vIndex < vLength; ++vIndex) {
                    let vOnePlayerTablePos: number = vPlayerTablePositons[vIndex];
                    let vOnePlayerXiaMaValue: number = vPlayerXiaMaValues[vIndex];
                    if (vOnePlayerXiaMaValue >= 0) {
                        MJGameData.xiaMaInfo[vOnePlayerTablePos] = vOnePlayerXiaMaValue;
                        vPlayerPZOrientationArray.push(MJGameHandler.getPZOrientation(vOnePlayerTablePos));
                    }
                }
                // 通知界面处理
                MvcUtil.send(MJGameModule.MJGAME_SELECTED_XIA_MA, vPlayerPZOrientationArray);
            }
        }

        /**
         * 消息通知
         * @param {FL.ShowTipAckMsg} msg
         */
        public exeShowTipAckMsg(msg: ShowTipAckMsg): void {
            /** 0:错误  1:警告 2:成功  3:弹窗*/
            // egret.log(msg);
            let tipType: number = msg.tipType;
            let tip: string = msg.tip;
            if (tipType === 0) {
                PromptUtil.show(tip, PromptType.ERROR);
            } else if (tipType === 1) {
                PromptUtil.show(tip, PromptType.ALERT);
            } else if (tipType === 2) {
                PromptUtil.show(tip, PromptType.SUCCESS);
            } else {
                if (MJGameHandler.getGameState() === EGameState.WAITING_START && MJGameHandler.getRoomType() === 2) {
                    ReminderViewUtil.showReminderView({
                        hasLeftBtn: true,
                        hasRightBtn: true,
                        leftCallBack: new MyCallBack(MvcUtil.addView, MvcUtil, ClubBaseView.getInstance()),
                        text: tip
                    });
                } else {
                    ReminderViewUtil.showReminderView({ hasLeftBtn: true, hasRightBtn: true, text: tip });
                }
            }
        }

    }
}