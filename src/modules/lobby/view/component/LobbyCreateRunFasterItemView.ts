module FL {
    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase - LobbyCreateRunFasterItemView
     * @Description:  跑得快创建房间
     * @Create: ArielLiang on 2018/4/11 20:15
     * @Version: V1.0
     */
    export class LobbyCreateRunFasterItemView extends eui.Component {

        /** 显示剩余牌数*/
        public shengYuPaiShuGroup: eui.RadioButtonGroup;
        public showCardNum: eui.RadioButton;
        public notShowCardNum: eui.RadioButton;

        /** 首局选择组*/
        public firstGameGroup: eui.RadioButtonGroup;
        /** 首局先出黑桃三*/
        public heitao3: eui.RadioButton;
        /** 首局无要求*/
        public random: eui.RadioButton;

        public speedRadioGro: eui.RadioButtonGroup;
        public speedGro:eui.Group;
        public lowSpeedRad:eui.RadioButton;
        public quickSpeedRad:eui.RadioButton;

        // /** 炸弹是否可拆组*/
        // public zhaDanGroup: eui.RadioButtonGroup;
        // /** 炸弹可拆*/
        // public keChai: eui.RadioButton;
        // /** 炸弹不可拆*/
        // public buKeChai: eui.RadioButton;

        // /** 四个带牌*/
        // public daiPaiGroup: eui.RadioButtonGroup;
        // /** 带三张*/
        // public takeThree: eui.RadioButton;
        // /** 带二张*/
        // public takeTwo: eui.RadioButton;
        // /** 不能带*/
        // public canNotTake: eui.RadioButton;
        /** 红桃十扎鸟*/
        public hongTaoShiZaNiao: eui.CheckBox;

        /** 炸弹不可拆*/
        public zhaDanBukeChai: eui.CheckBox;
        /** 允许4带2 */
        public yunXuSiDaiEr: eui.CheckBox;
        /** 允许4带3 */
        public yunXuSiDaiSan: eui.CheckBox;

        /** 三张可少带出完 */
        public sanZhangShaoDaiChuWan: eui.CheckBox;
        /** 三张可少带接完 */
        public sanZhangShaoDaiJieWan: eui.CheckBox;
        /** 飞机可少带出完 */
        public feiJiShaoDaiChuWan: eui.CheckBox;
        /** 飞机可少带接完 */
        public feiJiShaoDaiJieWan: eui.CheckBox;

        /** 默认经典玩法*/
        public static CURRENT_METHOD: number = 0;

        /** 单例 */
        private static _only: LobbyCreateRunFasterItemView;

        public static getInstance(): LobbyCreateRunFasterItemView {
            if (!this._only) {
                this._only = new LobbyCreateRunFasterItemView();
            }
            return this._only;
        }

        public constructor() {
            super();
            this.skinName = "skins.LobbyCreateRunFasterItemSkin";
        }

        protected childrenCreated(): void {
            super.childrenCreated();
            let self = this;
            self.shengYuPaiShuGroup = new eui.RadioButtonGroup();
            self.showCardNum.group = self.shengYuPaiShuGroup;
            self.notShowCardNum.group = self.shengYuPaiShuGroup;
            self.showCardNum.value = ECardGameType.SHOW_REST_CARD_NUM;
            self.notShowCardNum.value = "0";

            self.firstGameGroup = new eui.RadioButtonGroup();
            self.heitao3.group = self.firstGameGroup;
            self.random.group = self.firstGameGroup;
            self.heitao3.value = ECardGameType.HEI_TAO_SAN_FIRST;
            self.random.value = "0";

            self.speedRadioGro = new eui.RadioButtonGroup();
            self.lowSpeedRad.group = self.speedRadioGro;
            self.quickSpeedRad.group = self.speedRadioGro;
            self.lowSpeedRad.value = ECardGameType.LOW_SPEED_MODE;
            self.quickSpeedRad.value = ECardGameType.QUICK_SPEED_MODE;

            // self.zhaDanGroup = new eui.RadioButtonGroup();
            // self.keChai.group = self.zhaDanGroup;
            // self.buKeChai.group = self.zhaDanGroup;
            // self.keChai.value = "0";
            // self.buKeChai.value = ECardGameType.ZHA_DAN_BU_KE_CHAI;
            //
            // self.daiPaiGroup = new eui.RadioButtonGroup();
            // self.takeThree.group = self.daiPaiGroup;
            // self.takeTwo.group = self.daiPaiGroup;
            // self.canNotTake.group = self.daiPaiGroup;
            // self.canNotTake.value = ECardGameType.SI_GE_BU_DAI_PAI;
            // self.takeThree.value = ECardGameType.SI_GE_DAI_SAN_PAI;
            // self.takeTwo.value = ECardGameType.SI_GE_DAI_ER_PAI;

            self.initValue();

            //绑定跑得快人数，发生改变将回调
            BindManager.addAttrListener(LobbyCreatePokerItemView.getInstance().playerNum.attrId, self.setFst, self);

            // self.zhaDanGroup.addEventListener(egret.Event.CHANGE, self.changeZhaDan, self);
            // self.daiPaiGroup.addEventListener(egret.Event.CHANGE, self.changeZhaDan, self);
            // self.firstGameGroup.addEventListener(egret.Event.CHANGE, self.setFst, self);
        }

        /**
         * 设置当前页面显示
         */
        public setViewShow(params: IRulesSetViewShowParams) {
            let self = this;
            /** 默认 显示牌数，十局，三人，首局先出黑桃三，炸弹可拆，不可带牌*/
            self.shengYuPaiShuGroup.selectedValue = "" + params.rf_showRest;
            self.speedRadioGro.selectedValue = "" + (params.rf_lowSpeed || params.rf_quickSpeed || self.lowSpeedRad.value);
            self.firstGameGroup.selectedValue = "" + params.rf_fstType;
            self.hongTaoShiZaNiao.selected = (params.rf_heart10) ? true : false;

            self.zhaDanBukeChai.selected = (params.rf_zhaDanBukeChai) ? true : false;
            self.yunXuSiDaiEr.selected = (params.rf_yunXuSiDaiEr) ? true : false;
            self.yunXuSiDaiSan.selected = (params.rf_yunXuSiDaiSan) ? true : false;

            self.sanZhangShaoDaiChuWan.selected = (params.rf_sanZhangShaoDaiChuWan) ? true : false;
            self.sanZhangShaoDaiJieWan.selected = (params.rf_sanZhangShaoDaiJieWan) ? true : false;
            self.feiJiShaoDaiChuWan.selected = (params.rf_feiJiShaoDaiChuWan) ? true : false;
            self.feiJiShaoDaiJieWan.selected = (params.rf_feiJiShaoDaiJieWan) ? true : false;

            if (params.playerNum == 2) {
                self.heitao3.visible = false;
                self.random.x = 8;
            } else {
                self.heitao3.visible = true;
                self.random.x = 290;
            }
        }

        public initValue(): void {
            let self = this;

            /** 默认 显示牌数，十局，三人，首局先出黑桃三，炸弹可拆，不可带牌*/
            self.shengYuPaiShuGroup.selectedValue = Storage.getItem("createRestCardNum") ? Storage.getItem("createRestCardNum") : "" + self.showCardNum.value;
            self.speedRadioGro.selectedValue = Storage.getItem("createSpeedMode") ? Storage.getItem("createSpeedMode") : self.lowSpeedRad.value;
            if (LobbyCreatePokerItemView.getInstance().personNumGroup.selectedValue === 2) {
                self.firstGameGroup.selectedValue = "" + self.random.value;
                self.heitao3.visible = false;
                self.random.x = 8;
            } else {
                self.firstGameGroup.selectedValue = Storage.getItem("createFirstGame") ? Storage.getItem("createFirstGame") : "" + self.heitao3.value; //value为0需要转换成string
                self.heitao3.visible = true;
                self.random.x = 290;
            }

            self.hongTaoShiZaNiao.selected = Storage.getItem("createZhaNiao") ? JSON.parse(Storage.getItem("createZhaNiao")) : false;

            self.zhaDanBukeChai.selected = Storage.getItem("zhaDanBukeChai") ? JSON.parse(Storage.getItem("zhaDanBukeChai")) : false;
            self.yunXuSiDaiEr.selected = Storage.getItem("yunXuSiDaiEr") ? JSON.parse(Storage.getItem("yunXuSiDaiEr")) : false;
            self.yunXuSiDaiSan.selected = Storage.getItem("yunXuSiDaiSan") ? JSON.parse(Storage.getItem("yunXuSiDaiSan")) : false;

            self.sanZhangShaoDaiChuWan.selected = Storage.getItem("sanZhangShaoDaiChuWan") ? JSON.parse(Storage.getItem("sanZhangShaoDaiChuWan")) : false;
            self.sanZhangShaoDaiJieWan.selected = Storage.getItem("sanZhangShaoDaiJieWan") ? JSON.parse(Storage.getItem("sanZhangShaoDaiJieWan")) : false;
            self.feiJiShaoDaiChuWan.selected = Storage.getItem("feiJiShaoDaiChuWan") ? JSON.parse(Storage.getItem("feiJiShaoDaiChuWan")) : false;
            self.feiJiShaoDaiJieWan.selected = Storage.getItem("feiJiShaoDaiJieWan") ? JSON.parse(Storage.getItem("feiJiShaoDaiJieWan")) : false;
        }

        /**
         * 首局出牌
         */
        public setFst() {
            let self = this;
            if (LobbyCreatePokerItemView.getInstance().playerNum.value === 2) {
                self.firstGameGroup.selectedValue = "" + self.random.value;
                self.heitao3.visible = false;
                self.random.x = 8;
            } else {
                self.heitao3.visible = true;
                self.random.x = 290;
            }
        }

        /**
         * 炸弹可不可拆
         * @param {egret.Event} e
         */
        // public changeZhaDan(e?: egret.Event): void {
        //     let self = this;
        //     if (self.zhaDanGroup.selectedValue == self.buKeChai.value) {
        //         self.daiPaiGroup.selectedValue = self.canNotTake.value;
        //         self.takeThree.visible = false;
        //         self.takeTwo.visible = false;
        //     } else {
        //         self.takeThree.visible = true;
        //         self.takeTwo.visible = true;
        //     }
        // }

        /**
        * 添加自玩法到子玩法列表
        * @param {Array<number>} ruleList
        */
        public addMinorGamePlayRule(ruleList: Array<number>): void {
            let self = this;
            // 玩法 服务端根据主玩法自己设置十五张子玩法
            if (LobbyCreateRunFasterItemView.CURRENT_METHOD === ECardGameType.SHI_WU_ZHANG) {
                ruleList.push(ECardGameType.SHI_WU_ZHANG);
            }
            if (self.speedRadioGro.selectedValue === ECardGameType.QUICK_SPEED_MODE) {
                ruleList.push(ECardGameType.QUICK_SPEED_MODE);
            }
            else {
                ruleList.push(ECardGameType.LOW_SPEED_MODE);
            }
            // 首局选择
            if (self.firstGameGroup.selectedValue === ECardGameType.HEI_TAO_SAN_FIRST) {
                ruleList.push(ECardGameType.HEI_TAO_SAN_FIRST);
            }
            // 剩余牌数
            if (self.shengYuPaiShuGroup.selectedValue === ECardGameType.SHOW_REST_CARD_NUM) {
                ruleList.push(ECardGameType.SHOW_REST_CARD_NUM);
            }

            // 红桃十扎鸟
            if (self.hongTaoShiZaNiao.selected) {
                ruleList.push(ECardGameType.HONG_TAO_SHI_ZHA_NIAO);
            }
            // 炸弹不可拆
            if (self.zhaDanBukeChai.selected) {
                ruleList.push(ECardGameType.ZHA_DAN_BU_KE_CHAI);
            }
            // 允许4带2
            if (self.yunXuSiDaiEr.selected) {
                ruleList.push(ECardGameType.SI_GE_DAI_ER_PAI);
            }
            // 允许4带3
            if (self.yunXuSiDaiSan.selected) {
                ruleList.push(ECardGameType.SI_GE_DAI_SAN_PAI);
            }

            // 三张可少带出完
            if (self.sanZhangShaoDaiChuWan.selected) {
                ruleList.push(ECardGameType.SAN_GE_SHAO_DAI_CHU_WAN);
            }
            // 三张可少带接完
            if (self.sanZhangShaoDaiJieWan.selected) {
                ruleList.push(ECardGameType.SAN_GE_SHAO_DAI_JIE_WAN);
            }
            // 飞机可少带出完
            if (self.feiJiShaoDaiChuWan.selected) {
                ruleList.push(ECardGameType.FEI_JI_SHAO_DAI_CHU_WAN);
            }
            // 飞机可少带接完
            if (self.feiJiShaoDaiJieWan.selected) {
                ruleList.push(ECardGameType.FEI_JI_SHAO_DAI_JIE_WAN);
            }

            // 存储本地
            Storage.setItem("createPlayMethod", "" + LobbyCreateRunFasterItemView.CURRENT_METHOD);
            Storage.setItem("createRestCardNum", "" + self.shengYuPaiShuGroup.selectedValue);
            Storage.setItem("createSpeedMode", "" + self.speedRadioGro.selectedValue);
            Storage.setItem("createFirstGame", "" + self.firstGameGroup.selectedValue);
            Storage.setItem("createZhaNiao", "" + self.hongTaoShiZaNiao.selected);
            Storage.setItem("zhaDanBukeChai", "" + self.zhaDanBukeChai.selected);
            Storage.setItem("yunXuSiDaiEr", "" + self.yunXuSiDaiEr.selected);
            Storage.setItem("yunXuSiDaiSan", "" + self.yunXuSiDaiSan.selected);
            Storage.setItem("sanZhangShaoDaiChuWan", "" + self.sanZhangShaoDaiChuWan.selected);
            Storage.setItem("sanZhangShaoDaiJieWan", "" + self.sanZhangShaoDaiJieWan.selected);
            Storage.setItem("feiJiShaoDaiChuWan", "" + self.feiJiShaoDaiChuWan.selected);
            Storage.setItem("feiJiShaoDaiJieWan", "" + self.feiJiShaoDaiJieWan.selected);
        }

    }
}