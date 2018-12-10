module FL {
    export class TeaHouseProxy extends puremvc.Proxy {
        /** 代理名 */
        public static readonly NAME: string = "TeaHouseProxy";
        /** 单例 */
        private static instance: TeaHouseProxy;

        private constructor() {
            super(TeaHouseProxy.NAME);
        }

        public static getInstance(): TeaHouseProxy {
            if (!this.instance) {
                let vNewTeaHouseProxy = new TeaHouseProxy();
                this.instance = vNewTeaHouseProxy;
            }
            return this.instance;
        }

        /** 创建茶楼消息返回 */
        public exeCreateTeaHouseMsgACK(msg: CreateTeaHouseMsgACK) {
            // console.log(msg);
        }

        /** 进入茶楼楼层消息返回 */
        public exeAccessTeaHouseLayerMsgAck(msg: AccessTeaHouseLayerMsgAck) {
            // console.log(msg);
            //茶楼当前楼层游戏类型
            let curType;
            let vPrimaryType = msg.primaryType;
            if (vPrimaryType >= 10000 && vPrimaryType <= 19999) {
                curType = EGameType.RF;
            } else if (vPrimaryType >= 20000 && vPrimaryType <= 29999) {
                curType = EGameType.MAHJONG;
            } else if (vPrimaryType >= 30000 && vPrimaryType <= 39999) {
                curType = EGameType.ZIPAI;
            }

            //设置当前楼层游戏类型
            GameConstant.setCurrentGame(curType);
            //设置当前游戏状态
            // GameConstant.CURRENT_HANDLE.setGameState(EGameState.NULL);
            RFGameHandle.setGameState(EGameState.NULL);
            MahjongHandler.setGameState(EGameState.NULL);

            TeaHouseData.curType = GameConstant.CURRENT_GAMETYPE;
            //当前楼层玩法类型
            TeaHouseData.curPlayWay = msg.primaryType;
            //当前子玩法
            TeaHouseData.curRuleList = msg.minorGamePlayRuleList;
            //当前楼层数
            TeaHouseData.curFloor = msg.teahouseLayerNum;
            //当前楼层每桌最大游戏人数
            TeaHouseData.curPlayerNum = msg.maxPlayersNum;
            //当前楼层总局数
            TeaHouseData.curGameNum = msg.totalPlayCount;
            //当前楼层茶楼信息
            let info = TeaHouseData.teaHouseInfo;
            info.name = msg.teahouseLayerName;
            info.id = msg.teaHouseId;
            info.notice = (msg.teahouseNotice) ? msg.teahouseNotice : "";
            //当前楼层最大显示桌子序号
            TeaHouseData.maxTableIndex = 0;
            //当前正显示最大桌子序号
            TeaHouseData.curMaxTableIndex = 0;
            //茶楼桌子列表
            TeaHouseData.teaHouseTableList = msg.tableList;
            //当前楼层桌子列表
            TeaHouseData.curTable = [];
            TeaHouseData.curTable = TeaHouseHandle.handleCurrTableData(msg.tableList);
            //楼层滚动公告
            let minorRuleStr = GameHandler.handleMinorRuleListData(TeaHouseData.curRuleList, TeaHouseData.curPlayWay).shortStrArray.join(" ");
            TeaHouseData.anounceMsgText = TeaHouseHandle.handlePrimaryRuleData(TeaHouseData.curPlayWay, TeaHouseData.curPlayerNum, TeaHouseData.curGameNum) + " " + minorRuleStr + " " + TeaHouseData.teaHouseInfo.notice;
            //进入楼层
            MvcUtil.send(TeaHouseModule.TH_ACCESS_FLOOR, msg);
            //茶楼是否打烊
            MvcUtil.send(TeaHouseModule.TH_IS_OFF);
        }

        /** 进入茶楼消息返回 */
        public exeAccessTeaHouseMsgAck(msg: AccessTeaHouseMsgAck) {
            // console.log(msg);
            //设置当前游戏状态
            // GameConstant.CURRENT_HANDLE.setGameState(EGameState.NULL);
            RFGameHandle.setGameState(EGameState.NULL);
            MahjongHandler.setGameState(EGameState.NULL);

            //茶樓數據
            TeaHouseData.teaHouse = msg.teaHouse;
            //当前茶楼ID
            TeaHouseData.teaHouseInfo.id = msg.teaHouse.teaHouseId;
            TeaHouseData.curID = msg.teaHouse.teaHouseId;
            //玩家在当前茶楼权限
            TeaHouseData.curPower = msg.memberState;
            //是否禁止同IP同桌
            TeaHouseData.teaHouseInfo.sameIP = (msg.teaHouse.alikeIpForbindDeskmate == TeaHouse.A_LIKE_IP_FOR_BIND_DESKMATE_ON) ? true : false;
            //是否茶楼审核
            TeaHouseData.teaHouseInfo.verify = (msg.teaHouse.checkTeaHouse == TeaHouse.CHECK_TEAHOUSE_ON) ? true : false;
            //是否禁止分享
            TeaHouseData.teaHouseInfo.share = (msg.teaHouse.forbidShare == TeaHouse.FORBID_SHARE_ON) ? true : false;
            //是否打烊
            TeaHouseData.isOff = (msg.teaHouse.state == OptTeaHouseStateMsg.TYPE_OFF_TEA_HOUSE) ? true : false;
            //留言信息
            TeaHouseData.teaHouseInfo.leaveMsg = msg.teaHouse.leaveMessage;
            //茶樓鑽石
            TeaHouseData.teaHouseInfo.diamond = msg.teaHouse.needDiamond;
            //发送进入茶楼楼层消息
            if (!msg.createFlag) TeaHouseMsgHandle.sendAccessLayerMsg(1, TeaHouseData.teaHouseInfo.id, true);
        }

        /**  获取茶楼楼层列表消息返回*/
        public exeGetTeaHouseLayerListMsgAck(msg: GetTeaHouseLayerListMsgAck) {
            console.log(msg);
            TeaHouseHandle.clearAllFloorData();
            //总楼层数
            TeaHouseData.teaHouseTotalFloor = msg.layerList.length;
            msg.layerList.forEach(x => {
                TeaHouseData[EFloorData[x.teahouseLayerNum]] = x;
            });
            //更新当前茶楼相关数据
            let curData: TeaHouseLayer = TeaHouseData[EFloorData[TeaHouseData.curFloor]];
            if (!curData) {
                //当前楼层数据没有了，说明可能楼层变动了,那么将玩家扔去一楼
                TeaHouseMsgHandle.sendAccessLayerMsg(1, TeaHouseData.curID);
                return;
            }
            let info = TeaHouseData.teaHouseInfo;
            info.notice = (curData.layerNotice) ? curData.layerNotice : "";
            info.name = curData.teahouseLayerName;
            info.id = curData.teaHouseId;
            //当前主玩法
            TeaHouseData.curPlayWay = curData.primaryType;
            //茶楼当前楼层游戏类型
            let curType;
            let vPrimaryType = curData.primaryType;
            if (vPrimaryType >= 10000 && vPrimaryType <= 19999) {
                curType = EGameType.RF;
            } else if (vPrimaryType >= 20000 && vPrimaryType <= 29999) {
                curType = EGameType.MAHJONG;
            } else if (vPrimaryType >= 30000 && vPrimaryType <= 39999) {
                curType = EGameType.ZIPAI;
            }
            //设置当前楼层游戏类型
            GameConstant.setCurrentGame(curType);
            TeaHouseData.curType = GameConstant.CURRENT_GAMETYPE;

            //当前子玩法
            TeaHouseData.curRuleList = curData.minorGamePlayRuleList;
            //当前楼层每桌最大游戏人数
            TeaHouseData.curPlayerNum = curData.maxPlayersNum;
            //当前楼层总局数
            TeaHouseData.curGameNum = curData.totalPlayCount;
            //当前桌子
            TeaHouseData.curTable = TeaHouseHandle.handleCurrTableData(TeaHouseData.teaHouseTableList);
            //楼层滚动公告
            let minorRuleStr = GameHandler.handleMinorRuleListData(TeaHouseData.curRuleList, TeaHouseData.curPlayWay).shortStrArray.join(" ");
            TeaHouseData.anounceMsgText = TeaHouseHandle.handlePrimaryRuleData(TeaHouseData.curPlayWay, TeaHouseData.curPlayerNum, TeaHouseData.curGameNum) + " " + minorRuleStr + " " + TeaHouseData.teaHouseInfo.notice;
            MvcUtil.send(TeaHouseModule.TH_REFRESH_CURRENT_FLOOR);
        }

        /** 更新桌子消息返回 */
        public exeUpdateTeaHouseDeskMsgAck(msg: UpdateTeaHouseDeskMsgAck) {
            // console.log(msg);
            if (msg.teaHouseId != TeaHouseData.curID || msg.teaHouseLayer != TeaHouseData.curFloor) return;//不是当前茶楼或当前楼层            
            switch (msg.updateType) {
                case EUpdateTableType.delPlayer:
                    // for (let i = 0; i < TeaHouseData.curTable.length; ++i) {
                    //     if (TeaHouseData.curTable[i].index == msg.deskNum) {
                    //         for (let j = 0; j < TeaHouseData.curTable[i].infos.length; ++j) {
                    //             if (!TeaHouseData.curTable[i].infos[j].info) continue;
                    //             if (TeaHouseData.curTable[i].infos[j].info.tablePos == msg.updatePos) {
                    //                 TeaHouseData.curTable[i].infos[j].info = null;
                    //                 break;
                    //             }
                    //         }
                    //         break;
                    //     }
                    // }
                    for (let i = 0; i < TeaHouseData.teaHouseTableList.length; ++i) {
                        if (TeaHouseData.teaHouseTableList[i].deskNum == msg.deskNum) {
                            let playerList = TeaHouseData.teaHouseTableList[i].playerList;
                            for (let j = 0;j < playerList.length;j ++) {
                                if (playerList[j] && playerList[j].tablePos == msg.updatePos) {
                                    playerList[j] = null;
                                }
                            }
                            break;
                        }
                    }
                    TeaHouseData.curTable = TeaHouseHandle.handleCurrTableData(TeaHouseData.teaHouseTableList);
                    break;
                case EUpdateTableType.disTable:
                    for (let i = 0; i < TeaHouseData.teaHouseTableList.length; ++i) {
                        if (TeaHouseData.teaHouseTableList[i].deskNum == msg.deskNum) {
                            TeaHouseData.teaHouseTableList.splice(i, 1);
                            break;
                        }
                    }
                    TeaHouseData.curTable = TeaHouseHandle.handleCurrTableData(TeaHouseData.teaHouseTableList);
                    break;
                case EUpdateTableType.newPlayer:
                    for (let i = 0; i < TeaHouseData.teaHouseTableList.length; ++i) {
                        if (TeaHouseData.teaHouseTableList[i].deskNum == msg.deskNum) {
                            let playerList = TeaHouseData.teaHouseTableList[i].playerList;
                            let isIn:boolean = false;
                            for (let j = 0;j < playerList.length;j ++) {
                                if (playerList[j] && playerList[j].tablePos == msg.updatePlayer.tablePos) {
                                    isIn = true;
                                    playerList[j] = msg.updatePlayer;
                                    break;
                                }
                            }
                            if (!isIn) {
                                playerList.push(msg.updatePlayer);
                            }
                            break;
                        }
                    }
                    TeaHouseData.curTable = TeaHouseHandle.handleCurrTableData(TeaHouseData.teaHouseTableList);
                    // for (let i = 0; i < TeaHouseData.curTable.length; ++i) {
                    //     if (TeaHouseData.curTable[i].index == msg.deskNum) {
                    //         let table = TeaHouseData.curTable[i];
                    //         table.id = msg.tableId;
                    //         table.infos[msg.updatePlayer.tablePos] = { tableIndex: msg.deskNum, info: msg.updatePlayer };
                    //         break;
                    //     }
                    // }
                    break;
                case EUpdateTableType.newTable:
                    let deskinfo = <TeaHouseDeskInfo>{};
                    deskinfo.deskNum = msg.deskNum;
                    deskinfo.tableId = msg.tableId;
                    deskinfo.playerList = [msg.updatePlayer];
                    deskinfo.totalPlNum = TeaHouseData.curPlayerNum;
                    deskinfo.tableState = msg.tableState;
                    let isHave = false;
                    for (let i = 0; i < TeaHouseData.teaHouseTableList.length; ++i) {
                        if (TeaHouseData.teaHouseTableList[i].tableId == msg.tableId) {
                            isHave = true;
                            TeaHouseData.teaHouseTableList[i] = deskinfo;
                            break;
                        }
                    }
                    if (!isHave) {
                        TeaHouseData.teaHouseTableList.push(deskinfo);
                    }
                    TeaHouseData.curTable = TeaHouseHandle.handleCurrTableData(TeaHouseData.teaHouseTableList);
                    // let isHave = false;
                    // for (let i = 0; i < TeaHouseData.curTable.length; ++i) {
                    //     if (TeaHouseData.curTable[i].index == msg.deskNum) {
                    //         isHave = true;
                    //         let table = TeaHouseData.curTable[i];
                    //         table.id = msg.tableId;
                    //         table.isBegin = (msg.tableState == 1) ? false : true;
                    //         table.infos[msg.updatePlayer.tablePos] = { tableIndex: msg.deskNum, info: msg.updatePlayer };
                    //         break;
                    //     }
                    // }
                    // if (!isHave) {
                    //     let table = <ITHTableItem>{};
                    //     table.id = msg.tableId;
                    //     table.index = msg.deskNum;
                    //     table.isBegin = (msg.tableState == 1) ? false : true;
                    //     table.totalNum = TeaHouseData.curPlayerNum;
                    //     table.infos = TeaHouseHandle.handleTableInfoData([msg.updatePlayer], msg.deskNum, table.totalNum);
                    //     TeaHouseData.curTable.push(table);
                    // }
                    break;
                case EUpdateTableType.updateTable:
                    // for (let i = 0; i < TeaHouseData.curTable.length; ++i) {
                    //     if (TeaHouseData.curTable[i].index == msg.deskNum) {
                    //         TeaHouseData.curTable[i].isBegin = (msg.tableState == 1) ? false : true;
                    //         TeaHouseData.curTable[i].curentCount = msg.curentRound;
                    //         TeaHouseData.curTable[i].totalRound = msg.totalRound;
                    //         break;
                    //     }
                    // }
                    for (let i = 0; i < TeaHouseData.teaHouseTableList.length; ++i) {
                        if (TeaHouseData.teaHouseTableList[i].deskNum == msg.deskNum) {
                            TeaHouseData.teaHouseTableList[i].tableState = msg.tableState;
                            TeaHouseData.teaHouseTableList[i].curentRound = msg.curentRound;
                            TeaHouseData.teaHouseTableList[i].totalRound = msg.totalRound;
                            break;
                        }
                    }
                    TeaHouseData.curTable = TeaHouseHandle.handleCurrTableData(TeaHouseData.teaHouseTableList);
                    break;
                case EUpdateTableType.reTable:
                    for (let i = 0; i < TeaHouseData.teaHouseTableList.length; ++i) {
                        if (TeaHouseData.teaHouseTableList[i].deskNum == msg.deskNum) {
                            TeaHouseData.teaHouseTableList[i] = msg.deskInfo;
                            break;
                        }
                    }
                    TeaHouseData.curTable = TeaHouseHandle.handleCurrTableData(TeaHouseData.teaHouseTableList);
                    break; 
            }
            MvcUtil.send(TeaHouseModule.TH_REFRESH_TABLE);
        }

        /** 申请加入消息返回 */
        public exeApplyTeaHouseMsgAck(msg: ApplyTeaHouseMsgAck) {
            console.log(msg);
        }

        /** 显示成员列表返回 */
        public exeShowTeaHouseMemberListMsgAck(msg: ShowTeaHouseMemberListMsgAck) {
            console.log("LLL:", msg);
            TeaHouseData.teaHouseMemList = msg.members;
            MvcUtil.send(TeaHouseModule.TH_SHOW_MEM_LIST, msg);
        }

        /** 显示申请成员列表返回 */
        public exeShowApplyTeaHouseListMsgAck(msg: ShowApplyTeaHouseListMsgAck) {
            console.log(msg);
            TeaHouseData.teaHouseApplyList = msg.applyList;
            MvcUtil.send(TeaHouseModule.TH_SHOW_MEM_APPLY, msg.totalPage);
        }

        /** 基础设置更改 */
        public exeTeaHouseBasicSettingMsgAck(msg: TeaHouseBasicSettingMsgAck) {
            console.log(msg);
            //是否禁止同IP同桌
            TeaHouseData.teaHouseInfo.sameIP = (msg.alikeIpForbindDeskmate == TeaHouse.A_LIKE_IP_FOR_BIND_DESKMATE_ON) ? true : false;
            //是否茶楼审核
            TeaHouseData.teaHouseInfo.verify = (msg.checkTeaHouse == TeaHouse.CHECK_TEAHOUSE_ON) ? true : false;
            //是否禁止分享
            TeaHouseData.teaHouseInfo.share = (msg.forbidShare == TeaHouse.FORBID_SHARE_ON) ? true : false;
            //战绩重置时间
            TeaHouseData.teaHouseInfo.resetTime = msg.recordResetTime;
            MvcUtil.send(TeaHouseModule.TH_REFRESH_MGR);
        }

        /** 操作茶樓申請返回 */
        public exeOptTeaHouseApplyMsgAck(msg: OptTeaHouseApplyMsgAck) {
            console.log(msg);
        }

        /** 操作小二設置消息返回 */
        public exeOptMemberStateMsgAck(msg: OptMemberStateMsgAck) {
            console.log(msg);
            if (msg.teaHouseId != TeaHouseData.curID) return;//not current teahouse, throw away
            TeaHouseData.teaHouseMemList = msg.xiaoEr;
            TeaHouseData.teaHouseWaiterList = msg.setXiaoEr;
            MvcUtil.send(TeaHouseModule.TH_SHOW_MEM_WAITER);
        }

        /** 茶楼钻石相关消息返回 */
        public exeOptTeaHouseDiamondMsgAck(msg: OptTeaHouseDiamondMsgAck) {
            console.log(msg);
            if (msg.teaHouseId != TeaHouseData.curID) return; //not current teahouse, throw away
            TeaHouseData.teaHouseInfo.diamond = msg.diamond;
            MvcUtil.send(TeaHouseModule.TH_UPDATE_THDIAMOND);
        }

        /** 更改茶楼状态消息返回 */
        public exeOptTeaHouseStateMsgAck(msg: OptTeaHouseStateMsgAck) {
            console.log(msg);
            if (msg.teaHouseId != TeaHouseData.curID) return; //not current teahouse, throw away
            if (msg.operationType == OptTeaHouseStateMsg.TYPE_DESTROY_TEA_HOUSE) {
                //销毁茶楼，回到大厅
                MvcUtil.send(LobbyModule.LOBBY_INTO_LOBBY);
                return;
            }
            //打烊状态
            TeaHouseData.isOff = (msg.operationType == OptTeaHouseStateMsg.TYPE_OFF_TEA_HOUSE) ? true : false;
            //留言
            TeaHouseData.teaHouseInfo.leaveMsg = msg.leaveMessage;
            MvcUtil.send(TeaHouseModule.TH_UPDATE_STATE);
        }

        /** 获取我的战绩消息返回 */
        public exeGetTeaHouseMyRecordMsgAck(msg: GetTeaHouseMyRecordMsgAck) {
            console.log(msg);
            TeaHouseData.teaHouseRecordList = msg.roomRecords;
            MvcUtil.send(TeaHouseModule.TH_REFRESH_MY_RECORD, msg);
        }

        /** 获取茶楼总战绩消息返回 */
        public exeGetTeaHouseAllRecordMsgAck(msg: GetTeaHouseAllRecordMsgAck) {
            console.log(msg);
            TeaHouseData.teaHouseRecordList = msg.roomRecords;
            MvcUtil.send(TeaHouseModule.TH_REFRESH_ALL_RECORD);

        }

        /** 操作大赢家相关消息返回 */
        public exeBigWinnerShowAndOptMsgAck(msg: BigWinnerShowAndOptMsgAck) {
            console.log(msg);
            TeaHouseData.teaHouseWinnerList = msg.bigWinner;
            MvcUtil.send(TeaHouseModule.TH_REFRESH_WINNER);
            // switch (msg.optType) {
            //     case BigWinnerShowAndOptMsg.DELETE_ALL_BIG_WINNER:
            //         break;
            //     case BigWinnerShowAndOptMsg.DELETE_BIG_WINNER:
            //         break;
            //     case BigWinnerShowAndOptMsg.SHOW_BIG_WINNER_LIST:
            //         break;
            // }
        }

        /** 获取茶楼经营状况消息返回 */
        public exeGetTeaHousePerformanceMsgAck(msg: GetTeaHousePerformanceMsgAck) {
            console.log(msg);
            TeaHouseData.teaHousePerformanceList = msg.roomRecords;
            MvcUtil.send(TeaHouseModule.TH_REFRESH_RUNSTATE);
        }

        /** 获取茶楼战榜消息返回 */
        public exeShowTeaHouseWarsListMsgAck(msg: ShowTeaHouseWarsListMsgAck) {
            console.log(msg);
            if (msg.teaHouseId != TeaHouseData.curID || msg.teaHouseLayerNum != TeaHouseData.curFloor) return;//not current floor or teahouse;
            TeaHouseData.teaHouseRankingList = msg.teaHouseWarList;
            let invoked = (msg.OptType == ShowTeaHouseWarsListMsg.WARS_LIST_FOR_TODAY) ? ETHItemInvokedView.THLogTodayRankingView : ETHItemInvokedView.THLogYesterdayRankingView;
            MvcUtil.send(TeaHouseModule.TH_REFRESH_RANKING, invoked);
        }

        /** 退出茶楼返回 */
        public exeExitTeaHouseMsgAck(msg: ExitTeaHouseMsgAck) {
            console.log(msg);
            if (msg.result != ExitTeaHouseMsgAck.EXIT_TEAHOUSE_SUCCESS) return;//not success
            if (msg.teaHouseId != TeaHouseData.curID) return;//not current teahouse
            MvcUtil.send(LobbyModule.LOBBY_INTO_LOBBY);//join into lobby
        }

        /** 申请列表总数返回 */
        public exeTeaHouseApplyCountMsgAck(msg: TeaHouseApplyCountMsgAck) {
            console.log(msg);
            if (msg.teaHouseId != TeaHouseData.curID) return;//not current floor or teahouse;
            if (TeaHouseData.curPower == ETHPlayerPower.MEMBER || TeaHouseData.curPower == ETHPlayerPower.ILLEGAL) return;//no rights
            TeaHouseData.curApplyCount = msg.applyCount;
            MvcUtil.send(TeaHouseModule.TH_HANDLE_APPLY_REDPOINT, msg.applyCount);
        }

        /** 管理员添加成员返回 */
        public exeAddTeahouseMemberMsgAck(msg: AddTeaHouseMemberMsgAck) {
            // 已提示成功
        }

        /** 获取邀请列表返回 */
        public exeInviteToJoinMemberListMsgAck(msg: InviteToJoinMemberListMsgAck) {
            let view: TeaHouseInviteView = new TeaHouseInviteView();
            MvcUtil.addView(view);
            view.initView(msg.members, msg.teaHouseId);
        }

        /** 茶楼邀请玩家返回 */
        public exeInviteToJoinGameMsgAck(msg: InviteToJoinGameMsgAck) {
            
        }

        /** 茶楼被邀请推送 */
        public exeInviteToJoinGameLogicHandlerMsgAck(msg: InviteToJoinGameLogicHandlerMsgAck) {
            let view: TeaHouseReInviteView = TeaHouseReInviteView.getInstance();
            MvcUtil.delView(view);
            view.initView(msg);
            MvcUtil.addView(view);
        }
    }
}