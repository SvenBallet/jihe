module FL {
    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase - LobbyCreateZhuanItemView
     * @Description:  转转麻将
     * @Create: ArielLiang on 2018/1/15 11:50
     * @Version: V1.0
     */
    export class LobbyCreateHongzhongItemView extends eui.Component {

        /** 点炮*/
        public dianPaoGroup: eui.RadioButtonGroup;
        public dianPao: eui.RadioButton;
        public buDianPao: eui.RadioButton;
        public ziMoQiang:eui.RadioButton;

        /** 庄闲*/
        public zhuangXian: eui.CheckBox;
        /** 胡七对*/
        public huQiDui: eui.CheckBox;
        /** 有胡必胡*/
        public youHuBiHu: eui.CheckBox;
        /** 飘分 */
        public piaoFen:eui.CheckBox;
        /** 无红中翻倍 */
        public wuhongzhongfanbei:eui.CheckBox;

        /** 是否抓鸟*/
        public isZhuaNiaoGroup: eui.RadioButtonGroup;
        public buZhua: eui.RadioButton;
        public zhongNiaoJiaFen: eui.RadioButton;
        public zhongNiaoFanBei: eui.RadioButton;

        public visibleGroup: eui.Group;

        /** 中鸟*/
        public zhongNiaoGroup: eui.RadioButtonGroup;
        public zhongZhuangJia: eui.RadioButton;
        public zhong159: eui.RadioButton;
        public weiYiPiaoNiao:eui.RadioButton;
        public yiMaQuanZhong:eui.RadioButton;

        public zhuaNiaoGroup: eui.Group;
        public zhuaNiaoRadioGroup: eui.RadioButtonGroup;
        public zhua2Niao: eui.RadioButton;
        public zhua4Niao: eui.RadioButton;
        public zhua6Niao: eui.RadioButton;

        public JiaBeiZhuaNiaoGroup: eui.Group;
        public JiaBeiZhuaNiaoRadioGroup: eui.RadioButtonGroup;
        public zhua1Niao: eui.RadioButton;
        public zhua2Niao1: eui.RadioButton;

        /** 单例 */
        private static _only: LobbyCreateHongzhongItemView;

        public static getInstance(): LobbyCreateHongzhongItemView {
            if (!this._only) {
                this._only = new LobbyCreateHongzhongItemView();
            }
            return this._only;
        }

        public constructor() {
            super();
            this.skinName = "skins.LobbyCteateHongzhongItemSkin";


        }

        protected childrenCreated(): void {
            super.childrenCreated();
            let self = this;

            self.initZhuanZhuanValue();

            self.isZhuaNiaoGroup.addEventListener(egret.Event.CHANGE, self.changeValue, self);
            self.zhongNiaoGroup.addEventListener(egret.Event.CHANGE, self.changeValue, self);
        }

        public initZhuanZhuanValue(): void {
            let self = this;
            /** 点炮*/
            self.dianPaoGroup = new eui.RadioButtonGroup();
            self.dianPao.group = self.dianPaoGroup;
            self.buDianPao.group = self.dianPaoGroup;
            self.ziMoQiang.group = self.dianPaoGroup;
            self.dianPao.value = MJGameSubRule.HONG_ZHONG_DIAN_PAO_HU;
            self.buDianPao.value = MJGameSubRule.HONG_ZHONG_ZI_MO_HU;
            self.ziMoQiang.value = MJGameSubRule.HONG_ZHONG_ZI_MO_HU_QIANG_GANG;

            /** 是否抓鸟*/
            self.isZhuaNiaoGroup = new eui.RadioButtonGroup();
            self.buZhua.group = self.isZhuaNiaoGroup;
            self.zhongNiaoJiaFen.group = self.isZhuaNiaoGroup;
            self.zhongNiaoFanBei.group = self.isZhuaNiaoGroup;
            self.buZhua.value = 0;
            self.zhongNiaoJiaFen.value = MJGameSubRule.HONG_ZHONG_ZHONG_NIAO_JIA_FEN;
            self.zhongNiaoFanBei.value = MJGameSubRule.HONG_ZHONG_ZHONG_NIAO_FAN_BEI;

            /** 中鸟*/
            self.zhongNiaoGroup = new eui.RadioButtonGroup();
            self.zhongZhuangJia.group = self.zhongNiaoGroup;
            self.zhong159.group = self.zhongNiaoGroup;
            self.yiMaQuanZhong.group = self.zhongNiaoGroup;
            self.weiYiPiaoNiao.group = self.zhongNiaoGroup;
            self.zhongZhuangJia.value = MJGameSubRule.HONG_ZHONG_AN_ZHUAN_JIA_ZHONG_NIAO;
            self.zhong159.value = MJGameSubRule.HONG_ZHONG_159_ZHONG_NIAO;
            self.yiMaQuanZhong.value = MJGameSubRule.HONG_ZHONG_YI_MA_QUAN_ZHONG;
            self.weiYiPiaoNiao.value = MJGameSubRule.HONG_ZHONG_WEI_YI_PIAO_NIAO;
            /** 抓鸟*/
            self.zhuaNiaoRadioGroup = new eui.RadioButtonGroup();
            self.zhua2Niao.group = self.zhuaNiaoRadioGroup;
            self.zhua4Niao.group = self.zhuaNiaoRadioGroup;
            self.zhua6Niao.group = self.zhuaNiaoRadioGroup;
            self.zhua2Niao.value = MJGameSubRule.HONG_ZHONG_ZHUA_ER_NIAO;
            self.zhua4Niao.value = MJGameSubRule.HONG_ZHONG_ZHUA_SI_NIAO;
            self.zhua6Niao.value = MJGameSubRule.HONG_ZHONG_ZHUA_LIU_NIAO;
            /** 加倍抓鸟*/
            self.JiaBeiZhuaNiaoRadioGroup = new eui.RadioButtonGroup();
            self.zhua1Niao.group = self.JiaBeiZhuaNiaoRadioGroup;
            self.zhua2Niao1.group = self.JiaBeiZhuaNiaoRadioGroup;
            self.zhua1Niao.value = MJGameSubRule.HONG_ZHONG_ZHUA_YI_NIAO;
            self.zhua2Niao1.value = MJGameSubRule.HONG_ZHONG_ZHUA_ER_NIAO;

            // if(egret.localStorage.getItem("agentRoomType") === "3"){
            //     self.showView(parseInt(self.isZhuaNiaoGroup.selectedValue));
            //     return;
            // }

            //默认庄闲，可胡七对，有胡必胡
            if (JSON.parse(Storage.getItem("createZhuangXian")) === true || JSON.parse(Storage.getItem("createZhuangXian")) === false) {
                self.zhuangXian.selected = JSON.parse(Storage.getItem("createZhuangXian"));
            } else {
                self.zhuangXian.selected = true;
            }

            if (JSON.parse(Storage.getItem("createHuQiDui")) === true || JSON.parse(Storage.getItem("createHuQiDui")) === false) {
                self.huQiDui.selected = JSON.parse(Storage.getItem("createHuQiDui"));
            } else {
                self.huQiDui.selected = true;
            }

            if (JSON.parse(Storage.getItem("createYouHuBiHu")) === true || JSON.parse(Storage.getItem("createYouHuBiHu")) === false) {
                self.youHuBiHu.selected = JSON.parse(Storage.getItem("createYouHuBiHu"));
            } else {
                self.youHuBiHu.selected = true;
            }

            if (JSON.parse(Storage.getItem("createHongZhongPiao")) === true || JSON.parse(Storage.getItem("createHongZhongPiao")) === false) {
                self.piaoFen.selected = JSON.parse(Storage.getItem("createHongZhongPiao"));
            } else {
                self.piaoFen.selected = false;
            }

            if (JSON.parse(Storage.getItem("createHongZhongWuFan")) === true || JSON.parse(Storage.getItem("createHongZhongWuFan")) === false) {
                self.wuhongzhongfanbei.selected = JSON.parse(Storage.getItem("createHongZhongWuFan"));
            } else {
                self.wuhongzhongfanbei.selected = false;
            }

            //默认点炮胡
            self.dianPaoGroup.selectedValue = Storage.getItemNum("createDianPao") ? Storage.getItemNum("createDianPao") : self.dianPao.value;
            //默认不抓鸟
            let isZhuaNiao: number = Storage.getItemNum("createIsZhuaNiao") ? Storage.getItemNum("createIsZhuaNiao") : 0;
            self.isZhuaNiaoGroup.selectedValue = "" + isZhuaNiao;
            //默认按庄家中鸟
            self.zhongNiaoGroup.selectedValue = Storage.getItemNum("createZhongNiao") ? Storage.getItemNum("createZhongNiao") : self.zhongZhuangJia.value;
            //中鸟加分默认抓2鸟
            self.zhuaNiaoRadioGroup.selectedValue = Storage.getItemNum("createJiaFenZhuaNiao") ? Storage.getItemNum("createJiaFenZhuaNiao") : self.zhua2Niao.value;
            //中鸟翻倍默认抓1鸟
            self.JiaBeiZhuaNiaoRadioGroup.selectedValue = Storage.getItemNum("createFanBeiZhuaNiao") ? Storage.getItemNum("createFanBeiZhuaNiao") : self.zhua1Niao.value;
            self.showView(isZhuaNiao, self.zhongNiaoGroup.selectedValue);
        }

        /**
         * 是否抓鸟
         */
        private changeValue(e: egret.Event): void {
            let self = this;
            let isZhuaNiao: number = self.isZhuaNiaoGroup.selectedValue;
            let zhuaniaoNum: number = self.zhongNiaoGroup.selectedValue;
            self.showView(isZhuaNiao, zhuaniaoNum);
        }

        public showView(isZhuaNiao: number, zhuaniaoNum: number): void {
            let self = this;
            if (isZhuaNiao === MJGameSubRule.HONG_ZHONG_ZHONG_NIAO_JIA_FEN) {
                self.visibleGroup.visible = true;
                if (zhuaniaoNum === MJGameSubRule.HONG_ZHONG_WEI_YI_PIAO_NIAO || zhuaniaoNum === MJGameSubRule.HONG_ZHONG_YI_MA_QUAN_ZHONG) {
                    self.zhuaNiaoGroup.visible = false;
                }
                else {
                    self.zhuaNiaoGroup.visible = true;
                    
                }
                self.JiaBeiZhuaNiaoGroup.visible = false;
                self.yiMaQuanZhong.visible = true;
                self.weiYiPiaoNiao.visible = true;
            } else if (isZhuaNiao === MJGameSubRule.HONG_ZHONG_ZHONG_NIAO_FAN_BEI) {
                self.visibleGroup.visible = true;
                self.zhuaNiaoGroup.visible = false;
                self.JiaBeiZhuaNiaoGroup.visible = true;
                self.yiMaQuanZhong.visible = false;
                self.weiYiPiaoNiao.visible = false;
                if (self.zhongNiaoGroup.selectedValue === MJGameSubRule.HONG_ZHONG_WEI_YI_PIAO_NIAO || self.zhongNiaoGroup.selectedValue === MJGameSubRule.HONG_ZHONG_YI_MA_QUAN_ZHONG) {
                    self.zhongNiaoGroup.selectedValue = MJGameSubRule.HONG_ZHONG_AN_ZHUAN_JIA_ZHONG_NIAO;
                }
            } else {
                self.visibleGroup.visible = false;
            }
            //默认按庄家中鸟
            (!self.zhongNiaoGroup.selectedValue) && (self.zhongNiaoGroup.selectedValue = Storage.getItemNum("createZhongNiao") ? Storage.getItemNum("createZhongNiao") : "" + self.zhongZhuangJia.value);
            //中鸟加分默认抓2鸟
            self.zhuaNiaoRadioGroup.selectedValue = Storage.getItemNum("createJiaFenZhuaNiao") ? Storage.getItemNum("createJiaFenZhuaNiao") : "" + self.zhua2Niao.value;
            //中鸟翻倍默认抓1鸟
            self.JiaBeiZhuaNiaoRadioGroup.selectedValue = Storage.getItemNum("createFanBeiZhuaNiao") ? Storage.getItemNum("createFanBeiZhuaNiao") : "" + self.zhua1Niao.value;
        }

        /**
         * 设置当前页面显示
         * @param {params}
         */
        public setViewShow(params: IRulesSetViewShowParams) {
            let self = this;
            //默认点炮胡
            self.dianPaoGroup.selectedValue = "" + params.zz_dianPao;
            //默认不抓鸟
            self.isZhuaNiaoGroup.selectedValue = "" + params.zz_isZhuaNiao;
            //默认按庄家中鸟
            self.zhongNiaoGroup.selectedValue = "" + params.zz_zhongNiao;
            //中鸟加分默认抓2鸟
            self.zhuaNiaoRadioGroup.selectedValue = "" + params.zz_zhuaNiaoRadio;
            //中鸟翻倍默认抓1鸟
            self.JiaBeiZhuaNiaoRadioGroup.selectedValue = "" + params.zz_jiaBeiZhuaNiao;
            //庄闲
            self.zhuangXian.selected = (params.zz_zhuangXian) ? true : false;
            //可胡7对
            self.huQiDui.selected = (params.zz_huQiDui) ? true : false;
            //有胡必胡
            self.youHuBiHu.selected = (params.zz_youHuBiHu) ? true : false;

            if (params.zz_isZhuaNiao === MJGameSubRule.HONG_ZHONG_ZHONG_NIAO_JIA_FEN) {
                self.visibleGroup.visible = true;
                self.zhuaNiaoGroup.visible = true;
                self.JiaBeiZhuaNiaoGroup.visible = false;
            } else if (params.zz_isZhuaNiao === MJGameSubRule.HONG_ZHONG_ZHONG_NIAO_FAN_BEI) {
                self.visibleGroup.visible = true;
                self.JiaBeiZhuaNiaoGroup.visible = true;
                self.zhuaNiaoGroup.visible = false;
            } else {
                self.visibleGroup.visible = false;
            }
        }


        /**
     * 添加自玩法到子玩法列表
     * @param {Array<number>} ruleList
     */
        public addMinorGamePlayRule(ruleList: Array<number>): void {
            let self = this;
            // 点炮胡（可抢杠）  自摸胡
            if (self.dianPaoGroup.selectedValue === MJGameSubRule.HONG_ZHONG_DIAN_PAO_HU) {
                ruleList.push(MJGameSubRule.HONG_ZHONG_DIAN_PAO_HU);
            }
            else if (self.dianPaoGroup.selectedValue == MJGameSubRule.HONG_ZHONG_ZI_MO_HU_QIANG_GANG) {
                ruleList.push(MJGameSubRule.HONG_ZHONG_ZI_MO_HU_QIANG_GANG);
            }

            // 玩法
            // 带庄闲
            if (self.zhuangXian.selected) {
                ruleList.push(MJGameSubRule.HONG_ZHONG_ZHUANG_XIAN);
            }
            // 可胡七对
            if (self.huQiDui.selected) {
                ruleList.push(MJGameSubRule.HONG_ZHONG_KE_HU_QI_DUI);
            }
            // 有胡必胡
            if (self.youHuBiHu.selected) {
                ruleList.push(MJGameSubRule.YOU_HU_BI_HU);
            }
            // 飘分
            if (self.piaoFen.selected) {
                ruleList.push(MJGameSubRule.HONG_ZHONG_PIAO_FEN);
            }

            // 无红中翻倍
            if (self.wuhongzhongfanbei.selected) {
                ruleList.push(MJGameSubRule.HONG_ZHONG_WU_HONG_ZHONG_FAN_BEI);
            }

            // 抓鸟
            if (self.isZhuaNiaoGroup.selectedValue > 0) {
                ruleList.push(self.isZhuaNiaoGroup.selectedValue);
                // 中鸟 庄家中鸟 或 159中鸟
                ruleList.push(self.zhongNiaoGroup.selectedValue);
                if (self.isZhuaNiaoGroup.selectedValue === MJGameSubRule.HONG_ZHONG_ZHONG_NIAO_JIA_FEN) {
                    // 中鸟加分的情况 抓2鸟 抓4鸟 或 抓6鸟
                    ruleList.push(self.zhuaNiaoRadioGroup.selectedValue);
                } else if (self.isZhuaNiaoGroup.selectedValue === MJGameSubRule.HONG_ZHONG_ZHONG_NIAO_FAN_BEI) {
                    // 中鸟加倍的情况 抓1鸟 或 抓2鸟
                    ruleList.push(self.JiaBeiZhuaNiaoRadioGroup.selectedValue);
                }
            }
            if (self.isZhuaNiaoGroup.selectedValue === 0) {
                Storage.removeItem("createZhongNiao");
                Storage.removeItem("createJiaFenZhuaNiao");
                Storage.removeItem("createFanBeiZhuaNiao");
            }
            Storage.setItem("createDianPao", "" + self.dianPaoGroup.selectedValue);
            Storage.setItem("createZhuangXian", "" + self.zhuangXian.selected);
            Storage.setItem("createHuQiDui", "" + self.huQiDui.selected);
            Storage.setItem("createYouHuBiHu", "" + self.youHuBiHu.selected);
            Storage.setItem("createHongZhongPiao", "" + self.piaoFen.selected);
            Storage.setItem("createHongZhongWuFan", "" + self.wuhongzhongfanbei.selected);
            Storage.setItem("createIsZhuaNiao", "" + self.isZhuaNiaoGroup.selectedValue);
            Storage.setItem("createZhongNiao", "" + self.zhongNiaoGroup.selectedValue);
            Storage.setItem("createJiaFenZhuaNiao", "" + self.zhuaNiaoRadioGroup.selectedValue);
            Storage.setItem("createFanBeiZhuaNiao", "" + self.JiaBeiZhuaNiaoRadioGroup.selectedValue);
        }
    }
}