module FL {
    /** 设置玩法页面显示时传入的参数 */
    export interface IRulesSetViewShowParams {
        /** 人数 default:4|3*/
        playerNum?: number;//人数
        /** 局数 default:8|10*/
        countNum?: number;//局数

        //转转麻将
        /** 点炮胡 default:0*/
        zz_dianPao?: number;
        /** 抓鸟 default:0*/
        zz_isZhuaNiao?: number;
        /** 中鸟方式 default:0*/
        zz_zhongNiao?: number;
        /** 抓鸟加分方式 default:0*/
        zz_zhuaNiaoRadio?: number;
        /** 抓鸟加倍方式 default:0*/
        zz_jiaBeiZhuaNiao?: number;
        /** 庄闲 default:0*/
        zz_zhuangXian?: number;
        /** 胡7对 default:0 */
        zz_huQiDui?: number;
        /** 有胡必胡 default:0*/
        zz_youHuBiHu?: number;

        //红中
        hz_weiyipiaoniao?: number;
        hz_piaofen?: number;
        hz_wuhongzhongfanbei: number;

        //长沙麻将
        /** 庄闲 */
        cs_zhuangXian?: number;
        /** 飘分 */
        cs_piaoFen?: number;
        /** 六六顺 */
        cs_liuLiuShun?: number;
        /** 缺一色 */
        cs_queYiSe?: number;
        /** 板板胡 */
        cs_banBanHu?: number;
        /** 大四喜 */
        cs_daSiXi?: number;
        /** 节节高 */
        cs_jieJieGao?: number;
        /** 三同 */
        cs_sanTong?: number;
        /** 一枝花 */
        cs_yiZhiHua?: number;
        /** 中途四喜 */
        cs_zhongTuSiXi?: number;
        /** 抓鸟 default:0*/
        cs_isZhuaNiao?: number;
        /** 中鸟方式 default:0*/
        cs_zhongNiao?: number;
        /** 抓鸟加分方式 default:0*/
        cs_zhuaNiaoRadio?: number;
        /** 抓鸟加倍方式 default:0*/
        cs_jiaBeiZhuaNiao?: number;

        //跑得快
        /**  显示余牌 default:0*/
        rf_showRest?: number;
        /** 首局先出方式 default:0*/
        rf_fstType?: number;

        // /** 带牌 default:0*/
        // rf_daipai?: number;
        /** 红桃十扎鸟 default:0*/
        rf_heart10?: number;

        /** 炸弹不可拆*/
        rf_zhaDanBukeChai?: number;
        /** 允许4带2 */
        rf_yunXuSiDaiEr?: number;
        /** 允许4带3 */
        rf_yunXuSiDaiSan?: number;

        /** 三张可少带出完 */
        rf_sanZhangShaoDaiChuWan?: number;
        /** 三张可少带接完 */
        rf_sanZhangShaoDaiJieWan?: number;
        /** 飞机可少带出完 */
        rf_feiJiShaoDaiChuWan?: number;
        /** 飞机可少带接完 */
        rf_feiJiShaoDaiJieWan?: number;

        /** 普通模式 */
        rf_lowSpeed?: number;
        /** 快速模式 */
        rf_quickSpeed?: number;

        /** 十五张 */
        rf_fifth?: number;
    }

    /** 茶楼---修改玩法页面 */
    export class TeaHouseAlterRulesView extends BaseView {
        /** 单例 */
        private static _onlyOne: TeaHouseAlterRulesView;
        //调停者名字，删除界面的时候会自动移除
        public readonly mediatorName: string = TeaHouseAlterRulesViewMediator.NAME;
        //界面层级，UI框架自动管理
        public readonly viewLayer: ViewLayerEnum = ViewLayerEnum.POPUP;
        /** 调停者 */
        private _mediator: TeaHouseAlterRulesViewMediator;

        /** 关闭 */
        public closeGroup: eui.Group;
        private closeBtn: eui.Image;

        /** 玩法显示组 */
        private topGroup: eui.Group;
        private contentGroup: eui.Group;

        /** 人数、局数 */
        public topView: any;
        /** 具体玩法 */
        public contentView: any;

        /** 确认修改 */
        public alterBtn: GameButton;

        /** 修改页面的楼层数 */
        public flag_floor: number;

        constructor() {
            super();
            this.top = this.bottom = this.left = this.right = 0;
            this.verticalCenter = this.horizontalCenter = 0;
            this.skinName = "skins.TeaHouseAlterRulesViewSkin";
        }

        public static getInstance() {
            if (!this._onlyOne) {
                this._onlyOne = new TeaHouseAlterRulesView();
            }
            return this._onlyOne;
        }

        protected childrenCreated() {
            let self = this;
            //注册缓动事件
            TouchTweenUtil.regTween(self.closeGroup, self.closeBtn);
            TouchTweenUtil.regTween(self.alterBtn, self.alterBtn);
            self._mediator = new TeaHouseAlterRulesViewMediator(self);
            self.initView();
        }

        /** 添加到舞台自动调用 */
        private onAddView() {
            let self = this;
            //注册调停者
            MvcUtil.regMediator(self._mediator);
        }

        /** 初始化页面 */
        public initView(playWay: number = TeaHouseData.curPlayWay, ruleList: number[] = TeaHouseData.curRuleList, floor: number = TeaHouseData.curFloor) {
            this.flag_floor = floor;
            this.showByPlayWay(playWay, ruleList);
        }

        /** 根据当前楼层玩法类型显示页面 */
        private showByPlayWay(playWay: number = TeaHouseData.curPlayWay, ruleList: number[] = TeaHouseData.curRuleList) {

            let params: IRulesSetViewShowParams = <IRulesSetViewShowParams>{};
            switch (playWay) {
                case MJGamePlayWay.ZHUANZHUAN:
                case MJGamePlayWay.ZHUAN_ZHUAN_MJ:
                    this.topView = LobbyCreateMjItemView.getInstance();
                    this.contentView = LobbyCreateZhuanItemView.getInstance();
                    //---test
                    // topParams.countNum = TeaHouseData.curGameNum;
                    // topParams.playerNum = TeaHouseData.curPlayerNum;

                    // contentParams.dianPao = 0;
                    // contentParams.isZhuaNiao = 0;
                    // contentParams.zhongNiao = 0;
                    // contentParams.zhuaNiaoRadio = 0;
                    // contentParams.jiaBeiZhuaNiao = 0;
                    // contentParams.zhuangXian = 0;
                    // contentParams.huQiDui = 0;
                    // contentParams.youHuBiHu = 0;
                    break;
                case MJGamePlayWay.HONG_ZHONG_MJ:
                    this.topView = LobbyCreateMjItemView.getInstance();
                    this.contentView = LobbyCreateHongzhongItemView.getInstance();
                    break;
                case MJGamePlayWay.CHANG_SHA_MJ:
                    this.topView = LobbyCreateMjItemView.getInstance();
                    this.contentView = LobbyCreateChangShaItemView.getInstance();
                    break;
                case ECardGamePlayWay.JING_DIAN_PAO_DE_KUAI:
                case ECardGamePlayWay.SHI_WU_ZHANG_PAO_DE_KUAI:
                    this.topView = LobbyCreatePokerItemView.getInstance();
                    this.contentView = LobbyCreateRunFasterItemView.getInstance();
                    //---test
                    // topParams.countNum = 10;
                    // topParams.playerNum = 3;

                    // contentParams.showRest = 0;
                    // contentParams.fstType = 0;
                    // contentParams.zhadanBreak = 0;
                    // contentParams.daipai = 0;
                    // contentParams.heart10 = 0;
                    break;
            }
            params = TeaHouseAlterRulesView.handleParamsByRuleList(ruleList, playWay);
            params.countNum = TeaHouseData.curGameNum;
            params.playerNum = TeaHouseData.curPlayerNum;
            this.topGroup.removeChildren();
            this.contentGroup.removeChildren();
            this.topGroup.addChild(this.topView);
            this.contentGroup.addChild(this.contentView);
            //修改玩法具体显示内容
            this.topView.setViewShow(params);
            this.contentView.setViewShow(params);
        }


        /** 根据子玩法列表处理设置参数 */
        public static handleParamsByRuleList(ruleList: number[], playWay: number) {

            let params = <IRulesSetViewShowParams>{};
            switch (playWay) {
                case MJGamePlayWay.ZHUANZHUAN:
                case MJGamePlayWay.ZHUAN_ZHUAN_MJ:
                    /** 转转麻将 */
                    params.zz_dianPao = (ruleList.indexOf(MJGameSubRule.ZHUAN_ZHUAN_DIAN_PAO_HU) != -1) ? MJGameSubRule.ZHUAN_ZHUAN_DIAN_PAO_HU : MJGameSubRule.ZHUAN_ZHUAN_ZI_MO_HU;
                    if (ruleList.indexOf(MJGameSubRule.ZHUAN_ZHUAN_ZHONG_NIAO_JIA_FEN) != -1) {
                        //中鸟加分
                        params.zz_isZhuaNiao = MJGameSubRule.ZHUAN_ZHUAN_ZHONG_NIAO_JIA_FEN;
                        params.zz_zhongNiao = (ruleList.indexOf(MJGameSubRule.ZHUAN_ZHUAN_AN_ZHUAN_JIA_ZHONG_NIAO) != -1) ? MJGameSubRule.ZHUAN_ZHUAN_AN_ZHUAN_JIA_ZHONG_NIAO : MJGameSubRule.ZHUAN_ZHUAN_159_ZHONG_NIAO;
                        if (ruleList.indexOf(MJGameSubRule.ZHUAN_ZHUAN_ZHUA_ER_NIAO) != -1) {
                            params.zz_zhuaNiaoRadio = MJGameSubRule.ZHUAN_ZHUAN_ZHUA_ER_NIAO;
                        }
                        else if (ruleList.indexOf(MJGameSubRule.ZHUAN_ZHUAN_ZHUA_SI_NIAO) != -1) {
                            params.zz_zhuaNiaoRadio = MJGameSubRule.ZHUAN_ZHUAN_ZHUA_SI_NIAO;
                        } else {
                            params.zz_zhuaNiaoRadio = MJGameSubRule.ZHUAN_ZHUAN_ZHUA_LIU_NIAO;
                        }
                    } else if (ruleList.indexOf(MJGameSubRule.ZHUAN_ZHUAN_ZHONG_NIAO_FAN_BEI) != -1) {
                        //中鸟翻倍
                        params.zz_isZhuaNiao = MJGameSubRule.ZHUAN_ZHUAN_ZHONG_NIAO_FAN_BEI;
                        params.zz_zhongNiao = (ruleList.indexOf(MJGameSubRule.ZHUAN_ZHUAN_AN_ZHUAN_JIA_ZHONG_NIAO) != -1) ? MJGameSubRule.ZHUAN_ZHUAN_AN_ZHUAN_JIA_ZHONG_NIAO : MJGameSubRule.ZHUAN_ZHUAN_159_ZHONG_NIAO;
                        params.zz_jiaBeiZhuaNiao = (ruleList.indexOf(MJGameSubRule.ZHUAN_ZHUAN_ZHUA_YI_NIAO) != -1) ? MJGameSubRule.ZHUAN_ZHUAN_ZHUA_YI_NIAO : MJGameSubRule.ZHUAN_ZHUAN_ZHUA_YI_NIAO;
                    } else {
                        params.zz_isZhuaNiao = 0;
                    }
                    params.zz_zhuangXian = (ruleList.indexOf(MJGameSubRule.ZHUAN_ZHUAN_ZHUANG_XIAN) != -1) ? MJGameSubRule.ZHUAN_ZHUAN_ZHUANG_XIAN : 0;
                    params.zz_huQiDui = (ruleList.indexOf(MJGameSubRule.ZHUAN_ZHUAN_KE_HU_QI_DUI) != -1) ? MJGameSubRule.ZHUAN_ZHUAN_KE_HU_QI_DUI : 0;
                    params.zz_youHuBiHu = (ruleList.indexOf(MJGameSubRule.YOU_HU_BI_HU) != -1) ? MJGameSubRule.YOU_HU_BI_HU : 0;
                    break;
                case MJGamePlayWay.CHANG_SHA_MJ:
                    /** 长沙麻将 */
                    params.cs_daSiXi = (ruleList.indexOf(MJGameSubRule.CHANG_SHA_DA_SI_XI) != -1) ? MJGameSubRule.CHANG_SHA_DA_SI_XI : 0;
                    if (ruleList.indexOf(MJGameSubRule.CHANG_SHA_ZHONG_NIAO_JIA_FEN) != -1) {
                        params.cs_isZhuaNiao = MJGameSubRule.CHANG_SHA_ZHONG_NIAO_JIA_FEN;
                        //中鸟加分
                        // params.cs_zhongNiao = (ruleList.indexOf(MJGameSubRule.GAME_PLAY_RULE_ZZ_ZHUANG_NIAO) != -1) ? MJGameSubRule.GAME_PLAY_RULE_ZZ_ZHUANG_NIAO : MJGameSubRule.GAME_PLAY_RULE_ZZ_159_NIAO;
                        if (ruleList.indexOf(MJGameSubRule.CHANG_SHA_ZHONG_ER_NIAO) != -1) {
                            params.cs_zhuaNiaoRadio = MJGameSubRule.CHANG_SHA_ZHONG_ER_NIAO;
                        }
                        else if (ruleList.indexOf(MJGameSubRule.CHANG_SHA_ZHONG_SI_NIAO) != -1) {
                            params.cs_zhuaNiaoRadio = MJGameSubRule.CHANG_SHA_ZHONG_SI_NIAO;
                        } else {
                            params.cs_zhuaNiaoRadio = MJGameSubRule.CHANG_SHA_ZHONG_LIU_NIAO;
                        }
                    } else if (ruleList.indexOf(MJGameSubRule.CHANG_SHA_ZHONG_NIAO_FAN_BEI) != -1) {
                        //中鸟翻倍
                        params.cs_isZhuaNiao = MJGameSubRule.CHANG_SHA_ZHONG_NIAO_FAN_BEI;
                        params.cs_jiaBeiZhuaNiao = (ruleList.indexOf(MJGameSubRule.CHANG_SHA_ZHONG_YI_NIAO) != -1) ? MJGameSubRule.CHANG_SHA_ZHONG_YI_NIAO : MJGameSubRule.CHANG_SHA_ZHONG_ER_NIAO;
                    } else {
                        params.cs_isZhuaNiao = 0;
                    }
                    params.cs_jieJieGao = (ruleList.indexOf(MJGameSubRule.CHANG_SHA_JIE_JIE_GAO) != -1) ? MJGameSubRule.CHANG_SHA_JIE_JIE_GAO : 0;
                    params.cs_liuLiuShun = (ruleList.indexOf(MJGameSubRule.CHANG_SHA_LIU_LIU_SHUN) != -1) ? MJGameSubRule.CHANG_SHA_LIU_LIU_SHUN : 0;
                    params.cs_piaoFen = (ruleList.indexOf(MJGameSubRule.CHANG_SHA_PIAO_FEN) != -1) ? MJGameSubRule.CHANG_SHA_PIAO_FEN : 0;
                    params.cs_queYiSe = (ruleList.indexOf(MJGameSubRule.CHANG_SHA_QIE_YI_SE) != -1) ? MJGameSubRule.CHANG_SHA_QIE_YI_SE : 0;
                    params.cs_sanTong = (ruleList.indexOf(MJGameSubRule.CHANG_SHA_SAN_TONG) != -1) ? MJGameSubRule.CHANG_SHA_SAN_TONG : 0;
                    params.cs_yiZhiHua = (ruleList.indexOf(MJGameSubRule.CHANG_SHA_YI_ZHI_HUA) != -1) ? MJGameSubRule.CHANG_SHA_YI_ZHI_HUA : 0;
                    params.cs_zhuangXian = (ruleList.indexOf(MJGameSubRule.CHANG_SHA_ZHUANG_XIAN) != -1) ? MJGameSubRule.CHANG_SHA_ZHUANG_XIAN : 0;
                    params.cs_zhongTuSiXi = (ruleList.indexOf(MJGameSubRule.CHANG_SHA_ZHONG_TU_SI_XI) != -1) ? MJGameSubRule.CHANG_SHA_ZHONG_TU_SI_XI : 0;
                    params.cs_banBanHu = (ruleList.indexOf(MJGameSubRule.CHANG_SHA_BAN_BAN_HU) != -1) ? MJGameSubRule.CHANG_SHA_BAN_BAN_HU : 0;

                    break;
                case ECardGamePlayWay.JING_DIAN_PAO_DE_KUAI:
                case ECardGamePlayWay.SHI_WU_ZHANG_PAO_DE_KUAI:
                    /** 跑得快 */
                    params.rf_fstType = (ruleList.indexOf(ECardGameType.HEI_TAO_SAN_FIRST) != -1) ? ECardGameType.HEI_TAO_SAN_FIRST : 0;
                    params.rf_heart10 = (ruleList.indexOf(ECardGameType.HONG_TAO_SHI_ZHA_NIAO) != -1) ? ECardGameType.HONG_TAO_SHI_ZHA_NIAO : 0;
                    params.rf_fifth = (ruleList.indexOf(ECardGameType.SHI_WU_ZHANG) != -1) ? ECardGameType.SHI_WU_ZHANG : 0;
                    params.rf_showRest = (ruleList.indexOf(ECardGameType.SHOW_REST_CARD_NUM) != -1) ? ECardGameType.SHOW_REST_CARD_NUM : 0;
                    // if (ruleList.indexOf(ECardGameType.SI_GE_DAI_ER_PAI) != -1) {
                    //     params.rf_daipai = ECardGameType.SI_GE_DAI_ER_PAI;
                    // } else if (ruleList.indexOf(ECardGameType.SI_GE_DAI_SAN_PAI) != -1) {
                    //     params.rf_daipai = ECardGameType.SI_GE_DAI_SAN_PAI;
                    // } else {
                    //     params.rf_daipai = ECardGameType.SI_GE_BU_DAI_PAI;
                    // }
                    params.rf_zhaDanBukeChai = (ruleList.indexOf(ECardGameType.ZHA_DAN_BU_KE_CHAI) != -1) ? ECardGameType.ZHA_DAN_BU_KE_CHAI : 0;
                    params.rf_yunXuSiDaiEr = (ruleList.indexOf(ECardGameType.SI_GE_DAI_ER_PAI) != -1) ? ECardGameType.SI_GE_DAI_ER_PAI : 0;
                    params.rf_yunXuSiDaiSan = (ruleList.indexOf(ECardGameType.SI_GE_DAI_SAN_PAI) != -1) ? ECardGameType.SI_GE_DAI_SAN_PAI : 0;

                    params.rf_sanZhangShaoDaiChuWan = (ruleList.indexOf(ECardGameType.SAN_GE_SHAO_DAI_CHU_WAN) != -1) ? ECardGameType.SAN_GE_SHAO_DAI_CHU_WAN : 0;
                    params.rf_sanZhangShaoDaiJieWan = (ruleList.indexOf(ECardGameType.SAN_GE_SHAO_DAI_JIE_WAN) != -1) ? ECardGameType.SAN_GE_SHAO_DAI_JIE_WAN : 0;
                    params.rf_feiJiShaoDaiChuWan = (ruleList.indexOf(ECardGameType.FEI_JI_SHAO_DAI_CHU_WAN) != -1) ? ECardGameType.FEI_JI_SHAO_DAI_CHU_WAN : 0;
                    params.rf_feiJiShaoDaiJieWan = (ruleList.indexOf(ECardGameType.FEI_JI_SHAO_DAI_JIE_WAN) != -1) ? ECardGameType.FEI_JI_SHAO_DAI_JIE_WAN : 0;
                    params.rf_lowSpeed = (ruleList.indexOf(ECardGameType.LOW_SPEED_MODE) != -1) ? ECardGameType.LOW_SPEED_MODE : 0;
                    params.rf_quickSpeed = (ruleList.indexOf(ECardGameType.QUICK_SPEED_MODE) != -1) ? ECardGameType.QUICK_SPEED_MODE : 0;
                    break;
                // 红中麻将
                case MJGamePlayWay.HONG_ZHONG_MJ:{
                    params.zz_dianPao = (ruleList.indexOf(MJGameSubRule.HONG_ZHONG_DIAN_PAO_HU) != -1) ? MJGameSubRule.HONG_ZHONG_DIAN_PAO_HU : MJGameSubRule.HONG_ZHONG_ZI_MO_HU;
                    if (ruleList.indexOf(MJGameSubRule.HONG_ZHONG_DIAN_PAO_HU) != -1) {
                        params.zz_dianPao = MJGameSubRule.HONG_ZHONG_DIAN_PAO_HU;
                    }else if (ruleList.indexOf(MJGameSubRule.HONG_ZHONG_ZI_MO_HU) != -1) {
                        params.zz_dianPao = MJGameSubRule.HONG_ZHONG_ZI_MO_HU;
                    }else if (ruleList.indexOf(MJGameSubRule.HONG_ZHONG_ZI_MO_HU_QIANG_GANG) != -1) {
                        params.zz_dianPao = MJGameSubRule.HONG_ZHONG_ZI_MO_HU_QIANG_GANG;
                    }
                    else {
                        params.zz_dianPao = MJGameSubRule.HONG_ZHONG_ZI_MO_HU;
                    }
                    if (ruleList.indexOf(MJGameSubRule.HONG_ZHONG_ZHONG_NIAO_JIA_FEN) != -1) {
                        //中鸟加分
                        params.zz_isZhuaNiao = MJGameSubRule.HONG_ZHONG_ZHONG_NIAO_JIA_FEN;
                        if (ruleList.indexOf(MJGameSubRule.HONG_ZHONG_AN_ZHUAN_JIA_ZHONG_NIAO) != -1) {
                            params.zz_zhongNiao = MJGameSubRule.HONG_ZHONG_AN_ZHUAN_JIA_ZHONG_NIAO;
                        }
                        else if (ruleList.indexOf(MJGameSubRule.HONG_ZHONG_159_ZHONG_NIAO) != -1) {
                            params.zz_zhongNiao = MJGameSubRule.HONG_ZHONG_159_ZHONG_NIAO;
                        }
                        else if (ruleList.indexOf(MJGameSubRule.HONG_ZHONG_YI_MA_QUAN_ZHONG) != -1) {
                            params.zz_zhongNiao = MJGameSubRule.HONG_ZHONG_YI_MA_QUAN_ZHONG;
                        }
                        else if (ruleList.indexOf(MJGameSubRule.HONG_ZHONG_WEI_YI_PIAO_NIAO) != -1) {
                            params.zz_zhongNiao = MJGameSubRule.HONG_ZHONG_WEI_YI_PIAO_NIAO;
                        }
                        else {
                            params.zz_zhongNiao = MJGameSubRule.HONG_ZHONG_159_ZHONG_NIAO;
                        }

                        if (ruleList.indexOf(MJGameSubRule.HONG_ZHONG_ZHUA_ER_NIAO) != -1) {
                            params.zz_zhuaNiaoRadio = MJGameSubRule.HONG_ZHONG_ZHUA_ER_NIAO;
                        }
                        else if (ruleList.indexOf(MJGameSubRule.HONG_ZHONG_ZHUA_SI_NIAO) != -1) {
                            params.zz_zhuaNiaoRadio = MJGameSubRule.HONG_ZHONG_ZHUA_SI_NIAO;
                        } else {
                            params.zz_zhuaNiaoRadio = MJGameSubRule.HONG_ZHONG_ZHUA_LIU_NIAO;
                        }
                    } else if (ruleList.indexOf(MJGameSubRule.HONG_ZHONG_ZHONG_NIAO_FAN_BEI) != -1) {
                        //中鸟翻倍
                        params.zz_isZhuaNiao = MJGameSubRule.HONG_ZHONG_ZHONG_NIAO_FAN_BEI;
                        if (ruleList.indexOf(MJGameSubRule.HONG_ZHONG_AN_ZHUAN_JIA_ZHONG_NIAO) != -1) {
                            params.zz_zhongNiao = MJGameSubRule.HONG_ZHONG_AN_ZHUAN_JIA_ZHONG_NIAO;
                        }
                        else if (ruleList.indexOf(MJGameSubRule.HONG_ZHONG_159_ZHONG_NIAO) != -1) {
                            params.zz_zhongNiao = MJGameSubRule.HONG_ZHONG_159_ZHONG_NIAO;
                        }
                        else if (ruleList.indexOf(MJGameSubRule.HONG_ZHONG_YI_MA_QUAN_ZHONG) != -1) {
                            params.zz_zhongNiao = MJGameSubRule.HONG_ZHONG_YI_MA_QUAN_ZHONG;
                        }
                        else if (ruleList.indexOf(MJGameSubRule.HONG_ZHONG_WEI_YI_PIAO_NIAO) != -1) {
                            params.zz_zhongNiao = MJGameSubRule.HONG_ZHONG_WEI_YI_PIAO_NIAO;
                        }
                        else {
                            params.zz_zhongNiao = MJGameSubRule.HONG_ZHONG_159_ZHONG_NIAO;
                        }
                        params.zz_jiaBeiZhuaNiao = (ruleList.indexOf(MJGameSubRule.HONG_ZHONG_ZHUA_YI_NIAO) != -1) ? MJGameSubRule.HONG_ZHONG_ZHUA_YI_NIAO : MJGameSubRule.HONG_ZHONG_ZHUA_YI_NIAO;
                    } else {
                        params.zz_isZhuaNiao = 0;
                    }
                    params.zz_zhuangXian = (ruleList.indexOf(MJGameSubRule.HONG_ZHONG_ZHUANG_XIAN) != -1) ? MJGameSubRule.HONG_ZHONG_ZHUANG_XIAN : 0;
                    params.zz_huQiDui = (ruleList.indexOf(MJGameSubRule.HONG_ZHONG_KE_HU_QI_DUI) != -1) ? MJGameSubRule.HONG_ZHONG_KE_HU_QI_DUI : 0;
                    params.zz_youHuBiHu = (ruleList.indexOf(MJGameSubRule.YOU_HU_BI_HU) != -1) ? MJGameSubRule.YOU_HU_BI_HU : 0;
                    params.hz_piaofen = (ruleList.indexOf(MJGameSubRule.HONG_ZHONG_PIAO_FEN) != -1) ? MJGameSubRule.HONG_ZHONG_PIAO_FEN : 0;
                    params.hz_wuhongzhongfanbei = (ruleList.indexOf(MJGameSubRule.HONG_ZHONG_WU_HONG_ZHONG_FAN_BEI) != -1) ? MJGameSubRule.HONG_ZHONG_WU_HONG_ZHONG_FAN_BEI : 0;
                    break;
                }
            }
            return params;
        }
    }
}