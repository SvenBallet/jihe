module FL {
    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase - LobbyCreateChangShaItemView
     * @Description:  长沙麻将
     * @Create: ArielLiang on 2018/5/23 17:02
     * @Version: V1.0
     */
    export class LobbyCreateChangShaItemView extends eui.Component {
        /**庄闲*/
        public zhuangXian: eui.CheckBox;
        /**飘分*/
        public piaoFen: eui.CheckBox;
        /**六六顺*/
        public liuLiuShun: eui.CheckBox;
        /**缺一色*/
        public queYiSe: eui.CheckBox;
        /**板板胡*/
        public banBanHu: eui.CheckBox;
        /**大四喜*/
        public daSiXi: eui.CheckBox;
        /**节节高*/
        public jieJieGao: eui.CheckBox;
        /**三同*/
        public sanTong: eui.CheckBox;
        /**一枝花*/
        public yiZhiHua: eui.CheckBox;
        /**中途四喜*/
        public zhongTuSiXi: eui.CheckBox;

        /** 是否抓鸟*/
        public isZhuaNiaoGroup: eui.RadioButtonGroup;
        public buZhua: eui.RadioButton;
        public zhongNiaoJiaFen: eui.RadioButton;
        public zhongNiaoFanBei: eui.RadioButton;

        public visibleGroup: eui.Group;

        /**中鸟加分*/
        public zhuaNiaoGroup: eui.Group;
        public zhuaNiaoRadioGroup: eui.RadioButtonGroup;
        public zhua2Niao: eui.RadioButton;
        public zhua4Niao: eui.RadioButton;
        public zhua6Niao: eui.RadioButton;

        /**中鸟翻倍*/
        public JiaBeiZhuaNiaoGroup: eui.Group;
        public JiaBeiZhuaNiaoRadioGroup: eui.RadioButtonGroup;
        public zhua1Niao: eui.RadioButton;
        public zhua2Niao1: eui.RadioButton;

        /** 单例 */
        private static _only: LobbyCreateChangShaItemView;

        public static getInstance(): LobbyCreateChangShaItemView {
            if (!this._only) {
                this._only = new LobbyCreateChangShaItemView();
            }
            return this._only;
        }

        public constructor() {
            super();
            this.skinName = "skins.LobbyCreateChangShaItemSkin";
        }

        protected childrenCreated(): void {
            super.childrenCreated();
            let self = this;

            self.initZhuanZhuanValue();

            self.buZhua.addEventListener(egret.Event.CHANGE, self.changeValue, self);
            self.zhongNiaoJiaFen.addEventListener(egret.Event.CHANGE, self.changeValue, self);
            self.zhongNiaoFanBei.addEventListener(egret.Event.CHANGE, self.changeValue, self);
        }

        public initZhuanZhuanValue(): void {
            let self = this;

            /** 是否抓鸟*/
            self.isZhuaNiaoGroup = new eui.RadioButtonGroup();
            self.buZhua.group = self.isZhuaNiaoGroup;
            self.zhongNiaoJiaFen.group = self.isZhuaNiaoGroup;
            self.zhongNiaoFanBei.group = self.isZhuaNiaoGroup;
            self.buZhua.value = 0;
            self.zhongNiaoJiaFen.value = MJGameSubRule.CHANG_SHA_ZHONG_NIAO_JIA_FEN;
            self.zhongNiaoFanBei.value = MJGameSubRule.CHANG_SHA_ZHONG_NIAO_FAN_BEI;

            /** 抓鸟*/
            self.zhuaNiaoRadioGroup = new eui.RadioButtonGroup();
            self.zhua2Niao.group = self.zhuaNiaoRadioGroup;
            self.zhua4Niao.group = self.zhuaNiaoRadioGroup;
            self.zhua6Niao.group = self.zhuaNiaoRadioGroup;
            self.zhua2Niao.value = MJGameSubRule.CHANG_SHA_ZHONG_ER_NIAO;
            self.zhua4Niao.value = MJGameSubRule.CHANG_SHA_ZHONG_SI_NIAO;
            self.zhua6Niao.value = MJGameSubRule.CHANG_SHA_ZHONG_LIU_NIAO;
            /** 加倍抓鸟*/
            self.JiaBeiZhuaNiaoRadioGroup = new eui.RadioButtonGroup();
            self.zhua1Niao.group = self.JiaBeiZhuaNiaoRadioGroup;
            self.zhua2Niao1.group = self.JiaBeiZhuaNiaoRadioGroup;
            self.zhua1Niao.value = MJGameSubRule.CHANG_SHA_ZHONG_YI_NIAO;
            self.zhua2Niao1.value = MJGameSubRule.CHANG_SHA_ZHONG_ER_NIAO;


            //默认庄闲，六六顺，缺一色，板板胡，大四喜
            if (JSON.parse(Storage.getItem("createCSZhuangXian")) === true || JSON.parse(Storage.getItem("createCSZhuangXian")) === false) {
                self.zhuangXian.selected = JSON.parse(Storage.getItem("createCSZhuangXian"));
            } else {
                self.zhuangXian.selected = true;
            }

            if (JSON.parse(Storage.getItem("createLiuLiuShun")) === true || JSON.parse(Storage.getItem("createLiuLiuShun")) === false) {
                self.liuLiuShun.selected = JSON.parse(Storage.getItem("createLiuLiuShun"));
            } else {
                self.liuLiuShun.selected = true;
            }

            if (JSON.parse(Storage.getItem("createQueYiSe")) === true || JSON.parse(Storage.getItem("createQueYiSe")) === false) {
                self.queYiSe.selected = JSON.parse(Storage.getItem("createQueYiSe"));
            } else {
                self.queYiSe.selected = true;
            }

            if (JSON.parse(Storage.getItem("createBanBanHu")) === true || JSON.parse(Storage.getItem("createBanBanHu")) === false) {
                self.banBanHu.selected = JSON.parse(Storage.getItem("createBanBanHu"));
            } else {
                self.banBanHu.selected = true;
            }

            if (JSON.parse(Storage.getItem("createDaSiXi")) === true || JSON.parse(Storage.getItem("createDaSiXi")) === false) {
                self.daSiXi.selected = JSON.parse(Storage.getItem("createDaSiXi"));
            } else {
                self.daSiXi.selected = true;
            }

            self.piaoFen.selected = Storage.getItem("createPiaoFen") ? JSON.parse(Storage.getItem("createPiaoFen")) : false;
            self.jieJieGao.selected = Storage.getItem("createJieJieGao") ? JSON.parse(Storage.getItem("createJieJieGao")) : false;
            self.sanTong.selected = Storage.getItem("createSanTong") ? JSON.parse(Storage.getItem("createSanTong")) : false;
            self.yiZhiHua.selected = Storage.getItem("createYiZhiHua") ? JSON.parse(Storage.getItem("createYiZhiHua")) : false;
            self.zhongTuSiXi.selected = Storage.getItem("createZhongTuSiXi") ? JSON.parse(Storage.getItem("createZhongTuSiXi")) : false;

            //默认中鸟翻倍
            let isZhuaNiao: number = parseInt(Storage.getItem("createCSIsZhuaNiao")) ? parseInt(Storage.getItem("createCSIsZhuaNiao")) : self.zhongNiaoFanBei.value;
            self.isZhuaNiaoGroup.selectedValue = "" + isZhuaNiao;
            //中鸟加分默认抓2鸟
            self.zhuaNiaoRadioGroup.selectedValue = Storage.getItem("createCSJiaFenZhuaNiao") ? Storage.getItem("createCSJiaFenZhuaNiao") : "" + self.zhua2Niao.value;
            //中鸟翻倍默认抓2鸟
            self.JiaBeiZhuaNiaoRadioGroup.selectedValue = Storage.getItem("createCSFanBeiZhuaNiao") ? Storage.getItem("createCSFanBeiZhuaNiao") : "" + self.zhua2Niao1.value;
            self.showView(isZhuaNiao);
        }

        /**
         * 是否抓鸟
         */
        private changeValue(e: egret.Event): void {
            let self = this;
            let isZhuaNiao: number = e.target.value;
            self.showView(isZhuaNiao);
        }

        public showView(isZhuaNiao: number): void {
            let self = this;
            if (isZhuaNiao === MJGameSubRule.CHANG_SHA_ZHONG_NIAO_JIA_FEN) {
                self.visibleGroup.visible = true;
                self.zhuaNiaoGroup.visible = true;
                self.JiaBeiZhuaNiaoGroup.visible = false;
            } else if (isZhuaNiao === MJGameSubRule.CHANG_SHA_ZHONG_NIAO_FAN_BEI) {
                self.visibleGroup.visible = true;
                self.JiaBeiZhuaNiaoGroup.visible = true;
                self.zhuaNiaoGroup.visible = false;
            } else {
                self.visibleGroup.visible = false;
            }
            //中鸟加分默认抓2鸟
            self.zhuaNiaoRadioGroup.selectedValue = Storage.getItem("createCSJiaFenZhuaNiao") ? Storage.getItem("createCSJiaFenZhuaNiao") : "" + self.zhua2Niao.value;
            //中鸟翻倍默认抓2鸟
            self.JiaBeiZhuaNiaoRadioGroup.selectedValue = Storage.getItem("createCSFanBeiZhuaNiao") ? Storage.getItem("createCSFanBeiZhuaNiao") : "" + self.zhua2Niao1.value;
        }

        /**
        * 设置当前页面显示
        * @param {params}
        */
        public setViewShow(params: IRulesSetViewShowParams) {
            let self = this;
            //默认不抓鸟
            self.isZhuaNiaoGroup.selectedValue = "" + params.cs_isZhuaNiao;
            //中鸟加分默认抓2鸟
            self.zhuaNiaoRadioGroup.selectedValue = "" + params.cs_zhuaNiaoRadio;
            //中鸟翻倍默认抓1鸟
            self.JiaBeiZhuaNiaoRadioGroup.selectedValue = "" + params.cs_jiaBeiZhuaNiao;
            //庄闲
            self.zhuangXian.selected = (params.cs_zhuangXian) ? true : false;
            // 六六顺
            self.liuLiuShun.selected = (params.cs_liuLiuShun) ? true : false;
            // 缺一色
            self.queYiSe.selected = (params.cs_queYiSe) ? true : false;
            // 板板胡
            self.banBanHu.selected = (params.cs_banBanHu) ? true : false;
            // 大四喜
            self.daSiXi.selected = (params.cs_daSiXi) ? true : false;
            // 飘分
            self.piaoFen.selected = (params.cs_piaoFen) ? true : false;
            // 节节高
            self.jieJieGao.selected = (params.cs_jieJieGao) ? true : false;
            // 三同
            self.sanTong.selected = (params.cs_sanTong) ? true : false;
            // 一枝花
            self.yiZhiHua.selected = (params.cs_yiZhiHua) ? true : false;
            // 中途四喜
            self.zhongTuSiXi.selected = (params.cs_zhongTuSiXi) ? true : false;
            self.showView(params.cs_isZhuaNiao);
        }

        /**
         * 添加自玩法到子玩法列表
         * @param {Array<number>} ruleList
         */
        public addMinorGamePlayRule(ruleList: Array<number>): void {
            let self = this;
            // 玩法
            // 带庄闲
            if (self.zhuangXian.selected) {
                ruleList.push(MJGameSubRule.CHANG_SHA_ZHUANG_XIAN);
            }
            // 六六顺
            if (self.liuLiuShun.selected) {
                ruleList.push(MJGameSubRule.CHANG_SHA_LIU_LIU_SHUN);
            }
            // 缺一色
            if (self.queYiSe.selected) {
                ruleList.push(MJGameSubRule.CHANG_SHA_QIE_YI_SE);
            }
            // 板板胡
            if (self.banBanHu.selected) {
                ruleList.push(MJGameSubRule.CHANG_SHA_BAN_BAN_HU);
            }
            // 大四喜
            if (self.daSiXi.selected) {
                ruleList.push(MJGameSubRule.CHANG_SHA_DA_SI_XI);
            }
            // 飘分
            if (self.piaoFen.selected) {
                ruleList.push(MJGameSubRule.CHANG_SHA_PIAO_FEN);
            }
            // 节节高
            if (self.jieJieGao.selected) {
                ruleList.push(MJGameSubRule.CHANG_SHA_JIE_JIE_GAO);
            }
            // 三同
            if (self.sanTong.selected) {
                ruleList.push(MJGameSubRule.CHANG_SHA_SAN_TONG);
            }
            // 一枝花
            if (self.yiZhiHua.selected) {
                ruleList.push(MJGameSubRule.CHANG_SHA_YI_ZHI_HUA);
            }
            // 中途四喜
            if (self.zhongTuSiXi.selected) {
                ruleList.push(MJGameSubRule.CHANG_SHA_ZHONG_TU_SI_XI);
            }

            // 抓鸟
            if (self.isZhuaNiaoGroup.selectedValue > 0) {
                ruleList.push(self.isZhuaNiaoGroup.selectedValue);
                if (self.isZhuaNiaoGroup.selectedValue === MJGameSubRule.CHANG_SHA_ZHONG_NIAO_JIA_FEN) {
                    // 中鸟加分的情况 抓2鸟 抓4鸟 或 抓6鸟
                    ruleList.push(self.zhuaNiaoRadioGroup.selectedValue);
                } else if (self.isZhuaNiaoGroup.selectedValue === MJGameSubRule.CHANG_SHA_ZHONG_NIAO_FAN_BEI) {
                    // 中鸟加倍的情况 抓1鸟 或 抓2鸟
                    ruleList.push(self.JiaBeiZhuaNiaoRadioGroup.selectedValue);
                }
            }
            if (self.isZhuaNiaoGroup.selectedValue === 0) {
                Storage.removeItem("createCSZhongNiao");
                Storage.removeItem("createCSJiaFenZhuaNiao");
                Storage.removeItem("createCSFanBeiZhuaNiao");
            }
            Storage.setItem("createCSZhuangXian", "" + self.zhuangXian.selected);
            Storage.setItem("createLiuLiuShun", "" + self.liuLiuShun.selected);
            Storage.setItem("createQueYiSe", "" + self.queYiSe.selected);
            Storage.setItem("createBanBanHu", "" + self.banBanHu.selected);
            Storage.setItem("createDaSiXi", "" + self.daSiXi.selected);
            Storage.setItem("createPiaoFen", "" + self.piaoFen.selected);
            Storage.setItem("createJieJieGao", "" + self.jieJieGao.selected);
            Storage.setItem("createSanTong", "" + self.sanTong.selected);
            Storage.setItem("createYiZhiHua", "" + self.yiZhiHua.selected);
            Storage.setItem("createZhongTuSiXi", "" + self.zhongTuSiXi.selected);
            Storage.setItem("createCSIsZhuaNiao", "" + self.isZhuaNiaoGroup.selectedValue);
            Storage.setItem("createCSJiaFenZhuaNiao", "" + self.zhuaNiaoRadioGroup.selectedValue);
            Storage.setItem("createCSFanBeiZhuaNiao", "" + self.JiaBeiZhuaNiaoRadioGroup.selectedValue);
        }
    }
}