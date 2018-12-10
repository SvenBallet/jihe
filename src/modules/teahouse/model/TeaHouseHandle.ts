module FL {
    export class TeaHouseHandle {
        /** 处理当前桌子数据 */
        public static handleCurrTableData(tableList: Array<TeaHouseDeskInfo>) {
            // let tableData = [];
            let tableData;
            if (!tableList || !tableList.length) {
                TeaHouseData.maxTableIndex = 0;
                tableData = [];
                for (let i = 1; i <= 6; ++i) {
                    let thTableData = <ITHTableItem>{};
                    thTableData.index = i;
                    thTableData.totalNum = TeaHouseData.curPlayerNum;
                    thTableData.infos = this.handleTableInfoData(null, i, thTableData.totalNum);
                    tableData.push(thTableData);
                }
                return tableData;
            }
            let maxIndex = 0;//最大桌子序号
            tableList.forEach(x => {
                if (!x) return;
                if (x.deskNum > maxIndex) maxIndex = x.deskNum;//找到已有桌子中最大的桌子序號
            });
            tableData = [];
            for (let i = 0; i < maxIndex; ++i) {//transform data by maxIndex
                let thTableData = <ITHTableItem>{};
                thTableData.index = i + 1;
                thTableData.totalNum = TeaHouseData.curPlayerNum;
                thTableData.infos = this.handleTableInfoData(null, i + 1, thTableData.totalNum);
                tableData.push(thTableData);
            }

            tableList.forEach(x => {
                if (!x) return;
                let thTableData = <ITHTableItem>{};
                thTableData.index = x.deskNum;
                thTableData.isBegin = (x.tableState == 1) ? false : true;
                thTableData.curentCount = x.curentRound;
                thTableData.totalRound = x.totalRound;
                thTableData.totalNum = x.totalPlNum;
                thTableData.infos = this.handleTableInfoData(x.playerList, x.deskNum, thTableData.totalNum);
                thTableData.id = x.tableId;
                // tableData.push(thTableData);
                tableData[x.deskNum - 1] = thTableData;
            });
            TeaHouseData.maxTableIndex = maxIndex;
            //按6的倍数填充数据
            if (maxIndex % 6 != 0) {
                let addnum = 6 - maxIndex % 6;
                for (let i = 1; i <= addnum; i++) {
                    let thTableData = <ITHTableItem>{};
                    thTableData.index = maxIndex + i;
                    thTableData.totalNum = TeaHouseData.curPlayerNum;
                    thTableData.infos = this.handleTableInfoData(null, maxIndex + i, thTableData.totalNum);
                    tableData.push(thTableData);
                }
                TeaHouseData.maxTableIndex += addnum;
            }
            return tableData;
        }

        /** 处理下一批桌子数据 */
        public static handleNextTableData(flag: boolean) {
            let nextData = [];
            if (!flag) {//左滑，桌子序号增大
                for (let i = TeaHouseData.curMaxTableIndex; i < TeaHouseData.curMaxTableIndex + 6; ++i) {
                    if (TeaHouseData.curTable[i]) {
                        nextData.push(TeaHouseData.curTable[i]);
                    } else {
                        let table = <ITHTableItem>{};
                        table.index = i + 1;
                        table.totalNum = TeaHouseData.curPlayerNum;
                        table.infos = TeaHouseHandle.handleTableInfoData(null, i + 1, table.totalNum);
                        table.isBegin = false;
                        nextData.push(table);
                    }
                }
                TeaHouseData.curMaxTableIndex += 6;
            } else {
                //右滑，桌子序号减小
                for (let i = TeaHouseData.curMaxTableIndex - 12; i < TeaHouseData.curMaxTableIndex - 6; ++i) {
                    if (TeaHouseData.curTable[i]) {
                        nextData.push(TeaHouseData.curTable[i]);
                    } else {
                        let table = <ITHTableItem>{};
                        table.index = i + 1;
                        table.totalNum = TeaHouseData.curPlayerNum;
                        table.infos = TeaHouseHandle.handleTableInfoData(null, i + 1, table.totalNum);
                        table.isBegin = false;
                        nextData.push(table);
                    }
                }
                TeaHouseData.curMaxTableIndex -= 6;
            }
            return nextData;
        }

        public static getOneTableData(page: number):Array<ITHTableItem> {
            let nextData:Array<ITHTableItem> = [];
            for (let i = page*6; i < (page+1)*6; i++) {
                if (TeaHouseData.curTable[i]) {
                    nextData.push(TeaHouseData.curTable[i]);
                } else {
                    let table = <ITHTableItem>{};
                    table.index = i + 1;
                    table.totalNum = TeaHouseData.curPlayerNum;
                    table.infos = TeaHouseHandle.handleTableInfoData(null, i + 1, table.totalNum);
                    table.isBegin = false;
                    nextData.push(table);
                }
            }
            return nextData;
        }

        /** 处理桌子玩家数据 */
        public static handleTableInfoData(infos: GamePlayer[], tableIndex: number, playerNum: number) {
            let infosArr = [];
            for (let i = 0; i < playerNum; ++i) {
                let info = <ITHPlayerInfo>{};
                info.tableIndex = tableIndex;
                infosArr.push(info);
            }
            if (!infos || !infos.length) {
                return infosArr;
            }
            infos.forEach(x => {
                if (!x) return;
                // infosArr[x.tablePos] = x;
                infosArr[x.tablePos].info = x;
            });
            return infosArr;
        }

        /** 处理茶楼成员数据 */
        public static handleMemListData(memList: TeaHouseMember[], invokeView: ETHItemInvokedView) {
            let memArr = [];
            memList.forEach(x => {
                if (!x) return;

                let mem = <ITHMemberInfoData>{};
                mem.count = x.playCount;
                mem.head = x.headImageUrl;
                mem.invokedView = invokeView;
                mem.memberID = x.memberId;
                mem.id = x.playerIndex;
                mem.joinTime = x.joinTime;
                mem.lastTime = x.lastLoginTime;
                mem.name = x.memberName;
                mem.power = x.state;
                mem.isMemberOnline = x.isMemberOnline;
                memArr.push(mem);
            });
            return memArr;
        }

        /** 处理茶楼战绩数据 */
        public static handleRecordListData(logList: VipRoomRecord[]) {
            let recordArr = [];
            logList.forEach((x, index) => {
                if (!x) return;

                let log = <ITHRecordItemData>{};
                log.end = x.end;
                log.recordID = x.recordID;
                log.index = index + 1;
                log.roomID = x.roomID;
                log.roomIndex = x.roomIndex;
                log.shareID = x.shareID;
                log.start = x.start;
                log.rules = x.minorGamePlayRuleList;
                log.totalNum = x.totalHandsNum;
                log.playerInfo = this.handleRecordPlayerInfoData(x);
                log.mainType = x.gameId;
                recordArr.push(log);
            });
            return recordArr;
        }

        /** 根据战绩数据处理玩家信息 */
        public static handleRecordPlayerInfoData(log: VipRoomRecord) {
            let infosArr = [];
            if (log.player1ID) {
                infosArr.push({ name: this.getPlayerNameFromRecord(log.player1RealName), score: log.score1 });
            }
            if (log.player2Name) {
                infosArr.push({ name: this.getPlayerNameFromRecord(log.player2Name), score: log.score2 });
            }
            if (log.player3Name) {
                infosArr.push({ name: this.getPlayerNameFromRecord(log.player3Name), score: log.score3 });
            }
            if (log.player4Name) {
                infosArr.push({ name: this.getPlayerNameFromRecord(log.player4Name), score: log.score4 });
            }
            return infosArr;
        }

        /** 从战绩数据中获取玩家名字 */
        public static getPlayerNameFromRecord(str: string) {
            let index = str ? str.indexOf('-') : -1;
            if (index < 0) {
                return "";
            }
            let name: string = str.substr(index + 1);
            return StringUtil.subStrSupportChinese(name, 12, "..");
        }

        /** 处理大赢家数据 */
        public static handleWinnerListData(memList: TeaHouseMember[]) {
            let winnerArr = [];
            memList.forEach((x, index) => {
                if (!x) return;

                let winner = <ITHRankingItemData>{};
                // winner.index = index + 1;
                winner.index = this.handleWinnerDataCount(x);
                winner.head = x.headImageUrl;
                winner.id = x.playerIndex;
                winner.memberID = x.memberId;
                winner.name = x.memberName;
                winnerArr.push(winner);
            })
            return winnerArr;
        }

        /** 处理当前的大赢家局数 */
        public static handleWinnerDataCount(winner: TeaHouseMember) {
            switch (TeaHouseData.curFloor) {
                case 1:
                    return winner.bigWinnerCountForOne;
                case 2:
                    return winner.bigWinnerCountForTwo;
                case 3:
                    return winner.bigWinnerCountForThree;
            }
        }

        /** 处理经营状况数据 */
        public static handleRunstateListData(perList: TeaHousePerformanceAll[]) {
            let rsArr = [];
            perList.forEach(x => {
                if (!x) return;

                let rs = <ITHRsItemData>{};
                rs.date = x.time.toNumber();
                rs.fst = x.count1;
                rs.snd = x.count2;
                rs.trd = x.count3;
                rs.total = x.countAll;
                rsArr.push(rs);
            })
            return rsArr;
        }

        /** 处理战榜数据 */
        public static handleRankingListData(rankList: TeaHouseWarList[], invokedView: ETHItemInvokedView) {
            let rankArr = [];
            rankList.forEach((x, index) => {
                if (!x) return;

                let rank = <ITHRankingItemData>{};
                rank.invokedView = invokedView;
                rank.date = x.time.toNumber();
                rank.head = x.headUrl;
                rank.id = x.playerIndex;
                rank.index = index + 1;
                rank.name = x.name;
                rank.score = x.score;
                rank.win = x.bigWinCount;
                rank.totalCount = x.totalCount;
                rankArr.push(rank);
            })
            return rankArr;
        }

        /** 处理主玩法 */
        public static handlePrimaryRuleData(primaryType: number, playerNum: number = 0, gameNum: number = 0) {
            let str = "" + gameNum + "局" + playerNum + "人 ";
            if (!playerNum || !gameNum) {
                str = "";
            }
            let rule;
            if (primaryType == MJGamePlayWay.CHANG_SHA_MJ) {
                //长沙麻将
                rule = "长沙麻将";
            }
            else if (primaryType == MJGamePlayWay.ZHUAN_ZHUAN_MJ) {
                rule = "转转麻将";
            }
            else if (primaryType == MJGamePlayWay.ZHUANZHUAN) {
                rule = "转转麻将";
            }
            else if (primaryType == ECardGamePlayWay.JING_DIAN_PAO_DE_KUAI) {
                rule = "经典跑得快"
            }
            else if (primaryType == ECardGamePlayWay.SHI_WU_ZHANG_PAO_DE_KUAI) {
                rule = "十五张跑得快"
            }
            else if (primaryType == MJGamePlayWay.HONG_ZHONG_MJ) {
                rule = "红中麻将";
            }
            return str + rule;
        }

        // /** 处理子玩法数据 */
        // public static handleMinorRuleListData(ruleList: number[], playWay: number) {
        //     let ruleArr = [];
        //     switch (playWay) {
        //         case MJGamePlayWay.ZHUAN_ZHUAN_MJ:
        //             /** 转转麻将 */
        //             if (ruleList.indexOf(MJGameSubRule.ZHUAN_ZHUAN_DIAN_PAO_HU) != -1) {
        //                 ruleArr.push("点炮胡");
        //             } else {
        //                 ruleArr.push("自摸胡");
        //             };
        //             if (ruleList.indexOf(MJGameSubRule.ZHUAN_ZHUAN_ZHONG_NIAO_JIA_FEN) != -1) {
        //                 //中鸟加分
        //                 if (ruleList.indexOf(MJGameSubRule.ZHUAN_ZHUAN_AN_ZHUAN_JIA_ZHONG_NIAO) != -1) {
        //                     ruleArr.push('庄家中鸟加分');
        //                 } else {
        //                     ruleArr.push('159中鸟加分');
        //                 };
        //                 if (ruleList.indexOf(MJGameSubRule.ZHUAN_ZHUAN_ZHUA_ER_NIAO) != -1) {
        //                     ruleArr.push('抓2鸟');
        //                 }
        //                 else if (ruleList.indexOf(MJGameSubRule.ZHUAN_ZHUAN_ZHUA_SI_NIAO) != -1) {
        //                     ruleArr.push('抓4鸟');
        //                 } else {
        //                     ruleArr.push('抓6鸟');
        //                 }
        //             } else if (ruleList.indexOf(MJGameSubRule.ZHUAN_ZHUAN_ZHONG_NIAO_FAN_BEI) != -1) {
        //                 //中鸟翻倍
        //                 if (ruleList.indexOf(MJGameSubRule.ZHUAN_ZHUAN_AN_ZHUAN_JIA_ZHONG_NIAO) != -1) {
        //                     ruleArr.push('庄家中鸟翻倍');
        //                 } else {
        //                     ruleArr.push('159中鸟翻倍');
        //                 };
        //                 if (ruleList.indexOf(MJGameSubRule.ZHUAN_ZHUAN_ZHUA_YI_NIAO) != -1) {
        //                     ruleArr.push('抓1鸟');
        //                 } else {
        //                     ruleArr.push('抓2鸟');
        //                 };
        //             } else {
        //                 ruleArr.push('不抓鸟');
        //             }
        //             if (ruleList.indexOf(MJGameSubRule.ZHUAN_ZHUAN_ZHUANG_XIAN) != -1) {
        //                 ruleArr.push('庄闲');
        //             };
        //             if (ruleList.indexOf(MJGameSubRule.ZHUAN_ZHUAN_KE_HU_QI_DUI) != -1) {
        //                 ruleArr.push('可胡七对');
        //             };
        //             if (ruleList.indexOf(MJGameSubRule.YOU_HU_BI_HU) != -1) {
        //                 ruleArr.push('有胡必胡');
        //             };
        //             break;
        //         case MJGamePlayWay.CHANG_SHA_MJ:
        //             /** 长沙麻将 */
        //             if (ruleList.indexOf(MJGameSubRule.CHANG_SHA_ZHONG_NIAO_JIA_FEN) != -1) {
        //                 ruleArr.push('中鸟加分');
        //                 //中鸟加分
        //                 // params.cs_zhongNiao = (ruleList.indexOf(MJGameSubRule.GAME_PLAY_RULE_ZZ_ZHUANG_NIAO) != -1) ? MJGameSubRule.GAME_PLAY_RULE_ZZ_ZHUANG_NIAO : MJGameSubRule.GAME_PLAY_RULE_ZZ_159_NIAO;
        //                 if (ruleList.indexOf(MJGameSubRule.CHANG_SHA_ZHONG_ER_NIAO) != -1) {
        //                     ruleArr.push('抓2鸟');
        //                 }
        //                 else if (ruleList.indexOf(MJGameSubRule.CHANG_SHA_ZHONG_SI_NIAO) != -1) {
        //                     ruleArr.push('抓4鸟');
        //                 } else {
        //                     ruleArr.push('抓6鸟');
        //                 }
        //             } else if (ruleList.indexOf(MJGameSubRule.CHANG_SHA_ZHONG_NIAO_FAN_BEI) != -1) {
        //                 //中鸟翻倍
        //                 ruleArr.push('中鸟翻倍');
        //                 if (ruleList.indexOf(MJGameSubRule.CHANG_SHA_ZHONG_YI_NIAO) != -1) {
        //                     ruleArr.push('抓1鸟');
        //
        //                 } else {
        //                     ruleArr.push('抓2鸟');
        //                 }
        //                 ;
        //             } else {
        //                 ruleArr.push('不抓鸟');
        //             }
        //             if (ruleList.indexOf(MJGameSubRule.CHANG_SHA_ZHUANG_XIAN) != -1) {
        //                 ruleArr.push('庄闲');
        //             };
        //             if (ruleList.indexOf(MJGameSubRule.CHANG_SHA_DA_SI_XI) != -1) {
        //                 ruleArr.push('大四喜');
        //             };
        //             if (ruleList.indexOf(MJGameSubRule.CHANG_SHA_JIE_JIE_GAO) != -1) {
        //                 ruleArr.push('节节高');
        //             };
        //             if (ruleList.indexOf(MJGameSubRule.CHANG_SHA_LIU_LIU_SHUN) != -1) {
        //                 ruleArr.push('六六顺');
        //             };
        //             if (ruleList.indexOf(MJGameSubRule.CHANG_SHA_PIAO_FEN) != -1) {
        //                 ruleArr.push('飘分');
        //             };
        //             if (ruleList.indexOf(MJGameSubRule.CHANG_SHA_QIE_YI_SE) != -1) {
        //                 ruleArr.push('缺一色');
        //             };
        //             if (ruleList.indexOf(MJGameSubRule.CHANG_SHA_SAN_TONG) != -1) {
        //                 ruleArr.push('三同');
        //             };
        //             if (ruleList.indexOf(MJGameSubRule.CHANG_SHA_YI_ZHI_HUA) != -1) {
        //                 ruleArr.push('一枝花');
        //             };
        //
        //             if (ruleList.indexOf(MJGameSubRule.CHANG_SHA_ZHONG_TU_SI_XI) != -1) {
        //                 ruleArr.push('中途四喜');
        //             };
        //             if (ruleList.indexOf(MJGameSubRule.CHANG_SHA_BAN_BAN_HU) != -1) {
        //                 ruleArr.push('板板胡');
        //             };
        //             break;
        //         case ECardGamePlayWay.JING_DIAN_PAO_DE_KUAI:
        //         case ECardGamePlayWay.SHI_WU_ZHANG_PAO_DE_KUAI:
        //             /** 跑得快 */
        //             if (ruleList.indexOf(ECardGameType.SHI_WU_ZHANG) != -1) {
        //                 ruleArr.push('十五张');
        //             } else {
        //                 ruleArr.push('经典玩法');
        //             }
        //             if (ruleList.indexOf(ECardGameType.HEI_TAO_SAN_FIRST) != -1) {
        //                 ruleArr.push('黑桃三');
        //             }
        //             // else {
        //             //     ruleArr.push('随机');
        //             // };
        //             if (ruleList.indexOf(ECardGameType.HONG_TAO_SHI_ZHA_NIAO) != -1) {
        //                 ruleArr.push('红桃十扎鸟');
        //             }
        //             if (ruleList.indexOf(ECardGameType.SHOW_REST_CARD_NUM) != -1) {
        //                 ruleArr.push('显示余牌');
        //             }
        //             if (ruleList.indexOf(ECardGameType.ZHA_DAN_BU_KE_CHAI) != -1) {
        //                 ruleArr.push('炸弹不可拆');
        //             }
        //             if (ruleList.indexOf(ECardGameType.SI_GE_DAI_ER_PAI) != -1) {
        //                 ruleArr.push('允许4带2');
        //             }
        //             if (ruleList.indexOf(ECardGameType.SI_GE_DAI_SAN_PAI) != -1) {
        //                 ruleArr.push('允许4带3');
        //             }
        //             if (ruleList.indexOf(ECardGameType.SAN_GE_SHAO_DAI_CHU_WAN) >= 0) {
        //                 ruleArr.push("三张可少带出完");
        //             }
        //             if (ruleList.indexOf(ECardGameType.SAN_GE_SHAO_DAI_JIE_WAN) >= 0) {
        //                 ruleArr.push("三张可少带接完");
        //             }
        //             if (ruleList.indexOf(ECardGameType.FEI_JI_SHAO_DAI_CHU_WAN) >= 0) {
        //                 ruleArr.push("飞机可少带出完");
        //             }
        //             if (ruleList.indexOf(ECardGameType.FEI_JI_SHAO_DAI_JIE_WAN) >= 0) {
        //                 ruleArr.push("飞机可少带接完");
        //             }
        //             break;
        //         case MJGamePlayWay.HONG_ZHONG_MJ:
        //             /** 红中麻将 */
        //             if (ruleList.indexOf(MJGameSubRule.HONG_ZHONG_DIAN_PAO_HU) != -1) {
        //                 ruleArr.push("点炮胡");
        //             } else {
        //                 ruleArr.push("自摸胡");
        //             };
        //             if (ruleList.indexOf(MJGameSubRule.HONG_ZHONG_ZHONG_NIAO_JIA_FEN) != -1) {
        //                 //中鸟加分
        //                 if (ruleList.indexOf(MJGameSubRule.HONG_ZHONG_AN_ZHUAN_JIA_ZHONG_NIAO) != -1) {
        //                     ruleArr.push('庄家中鸟加分');
        //                 } else {
        //                     ruleArr.push('159中鸟加分');
        //                 }
        //                 if (ruleList.indexOf(MJGameSubRule.HONG_ZHONG_ZHUA_ER_NIAO) != -1) {
        //                     ruleArr.push('抓2鸟');
        //                 }
        //                 else if (ruleList.indexOf(MJGameSubRule.HONG_ZHONG_ZHUA_SI_NIAO) != -1) {
        //                     ruleArr.push('抓4鸟');
        //                 } else {
        //                     ruleArr.push('抓6鸟');
        //                 }
        //             } else if (ruleList.indexOf(MJGameSubRule.HONG_ZHONG_ZHONG_NIAO_FAN_BEI) != -1) {
        //                 //中鸟翻倍
        //                 if (ruleList.indexOf(MJGameSubRule.HONG_ZHONG_AN_ZHUAN_JIA_ZHONG_NIAO) != -1) {
        //                     ruleArr.push('庄家中鸟翻倍');
        //                 } else {
        //                     ruleArr.push('159中鸟翻倍');
        //                 }
        //                 if (ruleList.indexOf(MJGameSubRule.HONG_ZHONG_ZHUA_YI_NIAO) != -1) {
        //                     ruleArr.push('抓1鸟');
        //                 } else {
        //                     ruleArr.push('抓2鸟');
        //                 }
        //             } else {
        //                 ruleArr.push('不抓鸟');
        //             }
        //             if (ruleList.indexOf(MJGameSubRule.HONG_ZHONG_ZHUANG_XIAN) != -1) {
        //                 ruleArr.push('庄闲');
        //             }
        //             if (ruleList.indexOf(MJGameSubRule.HONG_ZHONG_KE_HU_QI_DUI) != -1) {
        //                 ruleArr.push('可胡七对');
        //             }
        //             if (ruleList.indexOf(MJGameSubRule.YOU_HU_BI_HU) != -1) {
        //                 ruleArr.push('有胡必胡');
        //             }
        //             break;
        //     }
        //
        //     return ruleArr;
        // }

        /** 根据楼层获取对应数据 */
        public static getCurFloorData(floor: number) {
            switch (floor) {
                case EFloorData.fstFloorData:
                    return TeaHouseData.fstFloorData;
                case EFloorData.sndFloorData:
                    return TeaHouseData.sndFloorData;
                case EFloorData.trdFloorData:
                    return TeaHouseData.trdFloorData;
            }
        }

        /** 清理所有楼层数据 */
        public static clearAllFloorData() {
            TeaHouseData.fstFloorData = null;
            TeaHouseData.sndFloorData = null;
            TeaHouseData.trdFloorData = null;
        }

        /** 清理茶楼数据 */
        public static clearTHData() {
            this.clearAllFloorData();

            //清理桌子数据
            TeaHouseData.curTable = [];
            //当前楼层数
            TeaHouseData.curFloor = 1;
            //当前主玩法
            TeaHouseData.curPlayWay = null;
            //当前申请数
            TeaHouseData.curApplyCount = 0;
            //清理茶楼信息数据
            TeaHouseData.teaHouseInfo = {};
            TeaHouseData.maxTableIndex = 0;
            TeaHouseData.curMaxTableIndex = 0;
            TeaHouseData.curRuleList = [];
            TeaHouseData.teaHouseWaiterList = [];
            TeaHouseData.teaHouse = null;
            TeaHouseData.teaHouseApplyList = [];
            TeaHouseData.teaHouseMemList = [];
            TeaHouseData.teaHouseTotalFloor = 0;
            TeaHouseData.teaHouseWaiterList = [];
            TeaHouseData.teaHouseWinnerList = [];
            TeaHouseData.teaHouseRecordList = [];
            TeaHouseData.teaHouseTableList = [];
        }
    }
}