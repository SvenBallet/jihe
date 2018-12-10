module FL {
    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase - GameHandler
     * @Description:  // 游戏Handler
     * @Create: DerekWu on 2018/7/30 19:34
     * @Version: V1.0
     */
    export class GameHandler {

        /**
         * 处理子玩法数据 
         * @param {number[]} ruleList 子玩法List
         * @param {number} mainRule 主玩法
         * @returns {Array}
         */
        public static handleMinorRuleListData(ruleList: number[], mainRule: number):{longStrArray:string[], shortStrArray:string[]} {
            switch (mainRule) {
                case MJGamePlayWay.ZHUAN_ZHUAN_MJ:
                    return this.handleZhuanZhuanMJRuleListData(ruleList, mainRule);
                case MJGamePlayWay.CHANG_SHA_MJ:
                    return this.handleChangShaMJRuleListData(ruleList, mainRule);
                case ECardGamePlayWay.JING_DIAN_PAO_DE_KUAI:
                case ECardGamePlayWay.SHI_WU_ZHANG_PAO_DE_KUAI:
                    return this.handlePaoDeKuaiRuleListData(ruleList, mainRule);
                case MJGamePlayWay.HONG_ZHONG_MJ:
                    return this.handleHongZhongMJRuleListData(ruleList, mainRule);
            }
            return;
        }

        /**
         * 处理转转麻将子玩法数据
         * @param {number[]} ruleList 子玩法List
         * @param {number} mainRule 主玩法
         * @returns {Array}
         */
        private static handleZhuanZhuanMJRuleListData(ruleList: number[], mainRule: number):{longStrArray:string[], shortStrArray:string[]} {
            let longArr = [], shortArr = [];
            /** 转转麻将 */
            if (ruleList.indexOf(MJGameSubRule.ZHUAN_ZHUAN_DIAN_PAO_HU) != -1) {
                longArr.push("点炮胡");
            } else {
                longArr.push("自摸胡");
            };
            if (ruleList.indexOf(MJGameSubRule.ZHUAN_ZHUAN_ZHONG_NIAO_JIA_FEN) != -1) {
                //中鸟加分
                if (ruleList.indexOf(MJGameSubRule.ZHUAN_ZHUAN_AN_ZHUAN_JIA_ZHONG_NIAO) != -1) {
                    longArr.push('庄家中鸟加分');
                } else {
                    longArr.push('159中鸟加分');
                }
                if (ruleList.indexOf(MJGameSubRule.ZHUAN_ZHUAN_ZHUA_ER_NIAO) != -1) {
                    longArr.push('抓2鸟');
                }
                else if (ruleList.indexOf(MJGameSubRule.ZHUAN_ZHUAN_ZHUA_SI_NIAO) != -1) {
                    longArr.push('抓4鸟');
                } else {
                    longArr.push('抓6鸟');
                }
            } else if (ruleList.indexOf(MJGameSubRule.ZHUAN_ZHUAN_ZHONG_NIAO_FAN_BEI) != -1) {
                //中鸟翻倍
                if (ruleList.indexOf(MJGameSubRule.ZHUAN_ZHUAN_AN_ZHUAN_JIA_ZHONG_NIAO) != -1) {
                    longArr.push('庄家中鸟翻倍');
                } else {
                    longArr.push('159中鸟翻倍');
                }
                if (ruleList.indexOf(MJGameSubRule.ZHUAN_ZHUAN_ZHUA_YI_NIAO) != -1) {
                    longArr.push('抓1鸟');
                } else {
                    longArr.push('抓2鸟');
                }
            } else {
                longArr.push('不抓鸟');
            }
            if (ruleList.indexOf(MJGameSubRule.ZHUAN_ZHUAN_ZHUANG_XIAN) != -1) {
                longArr.push('庄闲');
            }
            if (ruleList.indexOf(MJGameSubRule.ZHUAN_ZHUAN_KE_HU_QI_DUI) != -1) {
                longArr.push('可胡七对');
            }
            if (ruleList.indexOf(MJGameSubRule.YOU_HU_BI_HU) != -1) {
                longArr.push('有胡必胡');
            }
            return {longStrArray:longArr, shortStrArray:longArr};
        }

        private static handleChangShaMJRuleListData(ruleList: number[], mainRule: number):{longStrArray:string[], shortStrArray:string[]} {
            let longArr = [], shortArr = [];
            /** 长沙麻将 */
            if (ruleList.indexOf(MJGameSubRule.CHANG_SHA_ZHONG_NIAO_JIA_FEN) != -1) {
                longArr.push('中鸟加分');
                //中鸟加分
                // params.cs_zhongNiao = (ruleList.indexOf(MJGameSubRule.GAME_PLAY_RULE_ZZ_ZHUANG_NIAO) != -1) ? MJGameSubRule.GAME_PLAY_RULE_ZZ_ZHUANG_NIAO : MJGameSubRule.GAME_PLAY_RULE_ZZ_159_NIAO;
                if (ruleList.indexOf(MJGameSubRule.CHANG_SHA_ZHONG_ER_NIAO) != -1) {
                    longArr.push('抓2鸟');
                }
                else if (ruleList.indexOf(MJGameSubRule.CHANG_SHA_ZHONG_SI_NIAO) != -1) {
                    longArr.push('抓4鸟');
                } else {
                    longArr.push('抓6鸟');
                }
            } else if (ruleList.indexOf(MJGameSubRule.CHANG_SHA_ZHONG_NIAO_FAN_BEI) != -1) {
                //中鸟翻倍
                longArr.push('中鸟翻倍');
                if (ruleList.indexOf(MJGameSubRule.CHANG_SHA_ZHONG_YI_NIAO) != -1) {
                    longArr.push('抓1鸟');
                } else {
                    longArr.push('抓2鸟');
                }
            } else {
                longArr.push('不抓鸟');
            }
            if (ruleList.indexOf(MJGameSubRule.CHANG_SHA_ZHUANG_XIAN) != -1) {
                longArr.push('庄闲');
            }
            if (ruleList.indexOf(MJGameSubRule.CHANG_SHA_DA_SI_XI) != -1) {
                longArr.push('大四喜');
            }
            if (ruleList.indexOf(MJGameSubRule.CHANG_SHA_JIE_JIE_GAO) != -1) {
                longArr.push('节节高');
            }
            if (ruleList.indexOf(MJGameSubRule.CHANG_SHA_LIU_LIU_SHUN) != -1) {
                longArr.push('六六顺');
            }
            if (ruleList.indexOf(MJGameSubRule.CHANG_SHA_PIAO_FEN) != -1) {
                longArr.push('飘分');
            }
            if (ruleList.indexOf(MJGameSubRule.CHANG_SHA_QIE_YI_SE) != -1) {
                longArr.push('缺一色');
            }
            if (ruleList.indexOf(MJGameSubRule.CHANG_SHA_SAN_TONG) != -1) {
                longArr.push('三同');
            }
            if (ruleList.indexOf(MJGameSubRule.CHANG_SHA_YI_ZHI_HUA) != -1) {
                longArr.push('一枝花');
            }
            if (ruleList.indexOf(MJGameSubRule.CHANG_SHA_ZHONG_TU_SI_XI) != -1) {
                longArr.push('中途四喜');
            }
            if (ruleList.indexOf(MJGameSubRule.CHANG_SHA_BAN_BAN_HU) != -1) {
                longArr.push('板板胡');
            }
            return {longStrArray:longArr, shortStrArray:longArr};
        }

        private static handlePaoDeKuaiRuleListData(ruleList: number[], mainRule: number):{longStrArray:string[], shortStrArray:string[]} {
            let longArr = [], shortArr = [];
            /** 跑得快 */
            if (ruleList.indexOf(ECardGameType.SHI_WU_ZHANG) != -1 && mainRule === ECardGamePlayWay.JING_DIAN_PAO_DE_KUAI) {
                longArr.push('十五张');
                shortArr.push('十五张');
            }
            // else {
            //     longArr.push('经典玩法');
            //     shortArr.push('经典玩法');
            // }
            if (ruleList.indexOf(ECardGameType.LOW_SPEED_MODE) != -1) {
                longArr.push('普通模式');
                shortArr.push('普通');
            }
            if (ruleList.indexOf(ECardGameType.QUICK_SPEED_MODE) != -1) {
                longArr.push('快速模式');
                shortArr.push('快速');
            }
            if (ruleList.indexOf(ECardGameType.HEI_TAO_SAN_FIRST) != -1) {
                longArr.push('黑桃三');
                shortArr.push('黑桃三');
            }
            if (ruleList.indexOf(ECardGameType.HONG_TAO_SHI_ZHA_NIAO) != -1) {
                longArr.push('红桃十扎鸟');
                shortArr.push('红桃十扎鸟');
            }
            if (ruleList.indexOf(ECardGameType.SHOW_REST_CARD_NUM) != -1) {
                longArr.push('显示余牌');
                shortArr.push('显示余牌');
            }
            if (ruleList.indexOf(ECardGameType.ZHA_DAN_BU_KE_CHAI) != -1) {
                longArr.push('炸弹不可拆');
                shortArr.push('炸弹不可拆');
            }
            if (ruleList.indexOf(ECardGameType.SI_GE_DAI_ER_PAI) != -1) {
                longArr.push('允许4带2');
                shortArr.push('4带2');
            }
            if (ruleList.indexOf(ECardGameType.SI_GE_DAI_SAN_PAI) != -1) {
                longArr.push('允许4带3');
                shortArr.push('4带3');
            }
            if (ruleList.indexOf(ECardGameType.SAN_GE_SHAO_DAI_CHU_WAN) >= 0) {
                longArr.push("三张可少带出完");
                shortArr.push("三张少带出");
            }
            if (ruleList.indexOf(ECardGameType.SAN_GE_SHAO_DAI_JIE_WAN) >= 0) {
                longArr.push("三张可少带接完");
                shortArr.push("三张少带接");
            }
            if (ruleList.indexOf(ECardGameType.FEI_JI_SHAO_DAI_CHU_WAN) >= 0) {
                longArr.push("飞机可少带出完");
                shortArr.push("飞机少带出");
            }
            if (ruleList.indexOf(ECardGameType.FEI_JI_SHAO_DAI_JIE_WAN) >= 0) {
                longArr.push("飞机可少带接完");
                shortArr.push("飞机少带接");
            }
            return {longStrArray:longArr, shortStrArray:shortArr};
        }

        private static handleHongZhongMJRuleListData(ruleList: number[], mainRule: number):{longStrArray:string[], shortStrArray:string[]} {
            let longArr = [], shortArr = [];
            /** 红中麻将 */
            if (ruleList.indexOf(MJGameSubRule.HONG_ZHONG_DIAN_PAO_HU) != -1) {
                longArr.push("点炮胡");
            }
            else if (ruleList.indexOf(MJGameSubRule.HONG_ZHONG_ZI_MO_HU_QIANG_GANG) != -1) {
                longArr.push("自模糊（可抢杠）");
            }
            else {
                longArr.push("自摸胡");
            };
            if (ruleList.indexOf(MJGameSubRule.HONG_ZHONG_ZHONG_NIAO_JIA_FEN) != -1) {
                if (ruleList.indexOf(MJGameSubRule.HONG_ZHONG_YI_MA_QUAN_ZHONG) != -1) {
                    longArr.push('一码全中');
                }
                else if (ruleList.indexOf(MJGameSubRule.HONG_ZHONG_WEI_YI_PIAO_NIAO) != -1) {
                    longArr.push('围一飘鸟');
                }
                else {
                    //中鸟加分
                    if (ruleList.indexOf(MJGameSubRule.HONG_ZHONG_AN_ZHUAN_JIA_ZHONG_NIAO) != -1) {
                        longArr.push('庄家中鸟加分');
                    } else {
                        longArr.push('159中鸟加分');
                    }
                    if (ruleList.indexOf(MJGameSubRule.HONG_ZHONG_ZHUA_ER_NIAO) != -1) {
                        longArr.push('抓2鸟');
                    }
                    else if (ruleList.indexOf(MJGameSubRule.HONG_ZHONG_ZHUA_SI_NIAO) != -1) {
                        longArr.push('抓4鸟');
                    } else {
                        longArr.push('抓6鸟');
                    }
                }
            } else if (ruleList.indexOf(MJGameSubRule.HONG_ZHONG_ZHONG_NIAO_FAN_BEI) != -1) {
                if (ruleList.indexOf(MJGameSubRule.HONG_ZHONG_YI_MA_QUAN_ZHONG) != -1) {
                    longArr.push('一码全中');
                }
                else if (ruleList.indexOf(MJGameSubRule.HONG_ZHONG_WEI_YI_PIAO_NIAO) != -1) {
                    longArr.push('围一飘鸟');
                } 
                else {
                    //中鸟翻倍
                    if (ruleList.indexOf(MJGameSubRule.HONG_ZHONG_AN_ZHUAN_JIA_ZHONG_NIAO) != -1) {
                        longArr.push('庄家中鸟翻倍');
                    } else {
                        longArr.push('159中鸟翻倍');
                    }
                    if (ruleList.indexOf(MJGameSubRule.HONG_ZHONG_ZHUA_YI_NIAO) != -1) {
                        longArr.push('抓1鸟');
                    } else {
                        longArr.push('抓2鸟');
                    }
                }
            }
            else {
                longArr.push('不抓鸟');
            }
            if (ruleList.indexOf(MJGameSubRule.HONG_ZHONG_ZHUANG_XIAN) != -1) {
                longArr.push('庄闲');
            }
            if (ruleList.indexOf(MJGameSubRule.HONG_ZHONG_KE_HU_QI_DUI) != -1) {
                longArr.push('可胡七对');
            }
            if (ruleList.indexOf(MJGameSubRule.YOU_HU_BI_HU) != -1) {
                longArr.push('有胡必胡');
            }
            if (ruleList.indexOf(MJGameSubRule.HONG_ZHONG_PIAO_FEN) != -1) {
                longArr.push('飘分');
            }
            if (ruleList.indexOf(MJGameSubRule.HONG_ZHONG_WU_HONG_ZHONG_FAN_BEI) != -1) {
                longArr.push('无红中翻倍');
            }
            return {longStrArray:longArr, shortStrArray:longArr};
        }

    }
}