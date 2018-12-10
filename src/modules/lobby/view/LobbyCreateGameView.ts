module FL {
    import RadioButtonGroup = eui.RadioButtonGroup;
    import RadioButton = eui.RadioButton;
    import tr = egret.sys.tr;

    export enum CREATE_MJ_ITEM {
        "转转麻将" = 0,
        "长沙麻将" = 1,
        "红中麻将" = 2
    }

    export enum CREATE_RF_ITEM {
        "经典玩法" = 0,
        "十五张玩法" = 1
    }

    export enum ELobbyCreateType {
        Room,//創建房間
        TeaHouse,//創建茶樓
        Floor,//創建樓層
        TeaHouseChange,//修改楼层
    }

    export class LobbyCreateGameView extends BaseView {

        //调停者名字，删除界面的时候会自动移除
        public readonly mediatorName: string = LobbyCreateGameViewMediator.NAME;
        //界面层级，UI框架自动管理
        public readonly viewLayer: ViewLayerEnum = ViewLayerEnum.POPUP;

        //麻将
        public mjGroup: eui.Group;
        public mjImg: eui.Image;
        public mjTitle: eui.Image;

        //扑克
        public pokerGroup: eui.Group;
        public pokerImg: eui.Image;
        public pokerTitle: eui.Image;

        //删除按钮
        public closeGroup: eui.Group;
        public closeBtn: eui.Image;

        //选项列表组
        public listGroup: eui.Group;
        public btnList: eui.List;

        public mjItemList: Array<string> = [CREATE_MJ_ITEM[0], CREATE_MJ_ITEM[1], CREATE_MJ_ITEM[2]];
        // public mjItemList: Array<string> = [CREATE_MJ_ITEM[0], CREATE_MJ_ITEM[1]];

        public pokerItemList: Array<string> = [CREATE_RF_ITEM[0], CREATE_RF_ITEM[1]];

        public topGroup: eui.Group;

        //内容组
        public contentGroup: eui.Group;

        public bottomGroup: eui.Group;

        //创建房间按钮
        public createRoomBtn: GameButton;


        //代开房按钮
        public agentCreateGroup: eui.Group;
        public agentCreateBtn: GameButton;

        //自动开房
        public autoOpenRoom: eui.CheckBox;

        public vLobbyCreateMjItemView: LobbyCreateMjItemView;

        public vLobbyCreatePokerItemView: LobbyCreatePokerItemView;

        public vLobbyCreateZhuanItemView: LobbyCreateZhuanItemView;

        public vLobbyCreateChangShaItemView: LobbyCreateChangShaItemView;

        public vLobbyCreateRunFasterItemView: LobbyCreateRunFasterItemView;

        public vLobbyCreateHongZhongItemView: LobbyCreateHongzhongItemView;

        //---------
        //创建房间组
        public roomGroup: eui.Group;
        //创建茶楼组
        public teahouseGroup: eui.Group;
        public createTHBtn: GameButton;
        //创建楼层组
        public floorGroup: eui.Group;
        public floorBtn: GameButton;
        public alterGroup:eui.Group;
        public alterBtn:eui.Group;

        /** 当前是创建房间还是创建茶楼還是創建樓層 */
        public flag_createType: ELobbyCreateType = ELobbyCreateType.Room;
        /** 修改页面的楼层数 */
        public flag_floor: number;

        public constructor() {
            super();
            this.verticalCenter = this.horizontalCenter = 0;
            this.skinName = "skins.LobbyCreateGameViewSkin";
        }

        protected childrenCreated(): void {
            super.childrenCreated();
            let self = this;

            //注册按钮点击缓动
            TouchTweenUtil.regTween(self.closeGroup, self.closeBtn);
            TouchTweenUtil.regTween(self.createRoomBtn, self.createRoomBtn);
            TouchTweenUtil.regTween(self.createTHBtn, self.createTHBtn);
            TouchTweenUtil.regTween(self.floorGroup, self.floorBtn);
            TouchTweenUtil.regTween(self.agentCreateBtn, self.agentCreateBtn);
            TouchTweenUtil.regTween(self.alterGroup, self.alterBtn);

            self.initView();

            //注册pureMvc
            MvcUtil.regMediator(new LobbyCreateGameViewMediator(self));
        }

        /** 根据标识显示bottom组的内容，即是创建茶楼还是创建房间 */
        public setBottomView(flag: ELobbyCreateType = this.flag_createType) {
            this.flag_createType = flag;
            switch (flag) {
                case ELobbyCreateType.Room:
                    //是创建房间
                    this.roomGroup.visible = true;
                    this.teahouseGroup.visible = false;
                    this.floorGroup.visible = false;
                    this.alterGroup.visible = false;
                    break;
                case ELobbyCreateType.TeaHouse:
                    this.roomGroup.visible = false;
                    this.teahouseGroup.visible = true;
                    this.floorGroup.visible = false;
                    this.alterGroup.visible = false;
                    break;
                case ELobbyCreateType.Floor:
                    this.roomGroup.visible = false;
                    this.teahouseGroup.visible = false;
                    this.floorGroup.visible = true;
                    this.alterGroup.visible = false;
                    break;
                case ELobbyCreateType.TeaHouseChange:
                    this.roomGroup.visible = false;
                    this.teahouseGroup.visible = false;
                    this.floorGroup.visible = false;
                    this.alterGroup.visible = true;
                    break;
            }
        }

        public initView() {
            let self = this;
            self.btnList.itemRendererSkinName = "skins.AgentItemViewSkin";
            self.topGroup.removeChildren();
            if (GameConstant.CURRENT_GAMETYPE == EGameType.MAHJONG) {
                let iLobbyCreateMjItemView = LobbyCreateMjItemView.getInstance();
                self.vLobbyCreateMjItemView = iLobbyCreateMjItemView;
                self.topGroup.addChild(iLobbyCreateMjItemView);
                self.btnList.dataProvider = new eui.ArrayCollection(this.mjItemList);
                self.btnList.selectedItem = Storage.getItem("createTab") ? Storage.getItem("createTab") : CREATE_MJ_ITEM[0];
                self.loadMJContentPage();
                self.vLobbyCreateMjItemView.getDiamondSchema();
                self.vLobbyCreateMjItemView.changeDiamondNum();
            } else if (GameConstant.CURRENT_GAMETYPE == EGameType.RF) {
                let iLobbyCreatePokerItemView = LobbyCreatePokerItemView.getInstance();
                self.vLobbyCreatePokerItemView = iLobbyCreatePokerItemView;
                self.topGroup.addChild(iLobbyCreatePokerItemView);
                self.btnList.dataProvider = new eui.ArrayCollection(self.pokerItemList);
                self.btnList.selectedItem = Storage.getItem("createRFTab") ? Storage.getItem("createRFTab") : CREATE_RF_ITEM[0];
                self.loadRFContentPage();
                self.vLobbyCreatePokerItemView.getDiamondSchema();
                self.vLobbyCreatePokerItemView.changeDiamondNum();
            }
            /**
             * 俱乐部自动开房设置
             */
            if (egret.localStorage.getItem("agentRoomType") === "3") {
                this.createRoomBtn.labelDisplay.text = "保存";
            } else {
                self.autoOpenRoom.visible = false;
            }
        }

        /**
         * 切换麻将tab内容
         * @param {number} index
         */
        public loadMJContentPage(): void {
            let self = this;
            self.contentGroup.removeChildren();
            self.vLobbyCreateMjItemView.changeDiamondNum();
            let index: string = self.btnList.selectedItem;
            switch (index) {
                case CREATE_MJ_ITEM[0]: {
                    self.vLobbyCreateZhuanItemView = LobbyCreateZhuanItemView.getInstance();
                    self.contentGroup.addChild(self.vLobbyCreateZhuanItemView);
                    break;
                }
                case CREATE_MJ_ITEM[1]: {
                    self.vLobbyCreateChangShaItemView = LobbyCreateChangShaItemView.getInstance();
                    self.contentGroup.addChild(self.vLobbyCreateChangShaItemView);
                    break;
                }
                case CREATE_MJ_ITEM[2]: {
                    self.vLobbyCreateHongZhongItemView = LobbyCreateHongzhongItemView.getInstance();
                    self.contentGroup.addChild(self.vLobbyCreateHongZhongItemView);
                }
            }
        }
        /**
         * 切换跑得快tab内容
         * @param {number} index
         */
        public loadRFContentPage(): void {
            let self = this;
            self.contentGroup.removeChildren();
            self.vLobbyCreatePokerItemView.changeDiamondNum();
            let index: string = self.btnList.selectedItem;
            switch (index) {
                case CREATE_RF_ITEM[0]: {
                    self.vLobbyCreateRunFasterItemView = LobbyCreateRunFasterItemView.getInstance();
                    self.contentGroup.addChild(self.vLobbyCreateRunFasterItemView);
                    LobbyCreateRunFasterItemView.CURRENT_METHOD = 0;
                    break;
                }
                case CREATE_RF_ITEM[1]: {
                    self.vLobbyCreateRunFasterItemView = LobbyCreateRunFasterItemView.getInstance();
                    self.contentGroup.addChild(self.vLobbyCreateRunFasterItemView);
                    LobbyCreateRunFasterItemView.CURRENT_METHOD = ECardGameType.SHI_WU_ZHANG;
                    break;
                }
            }
            self.vLobbyCreateRunFasterItemView.initValue();
            // self.vLobbyCreateRunFasterItemView.changeZhaDan();
            self.vLobbyCreateRunFasterItemView.setFst();
        }

        /**
         * 设置限免开放标志
         */
        private setFreeGameSign(): void {
            let freeGameNum: number = LobbyData.freeGame;
            let configStr: string = StringUtil.numToBinaryStr(freeGameNum);
            let configIndex = configStr.length - 1;
            for (let i = configIndex; i <= configIndex && i >= 0; i--) {
                let value: string = configStr.charAt(i);
                if (value === "1") {
                    let freeGameIcon = new eui.Image();
                    freeGameIcon.source = "gameFree_png";
                    freeGameIcon.x = 165;
                    freeGameIcon.y = 3 + 85 * (configIndex - i);
                    this.btnList.addChild(freeGameIcon);
                }
            }

        }

        //移除代开房按钮
        private rmAgentCreateRoomBtn(): void {
            let vPlayerVO: PlayerVO = LobbyData.playerVO;
            let agentRoomType: string = Storage.getItem("agentRoomType");
            if (vPlayerVO.playerType < 2 || agentRoomType === "2" || agentRoomType === "3") {
                this.bottomGroup.removeChild(this.agentCreateGroup);
            }
        }

        /**
         * 麻将自动开房设置
         * @param {FL.ClubPlanSetting} vClubPlanSetting
         */
        public setMJSetting(vClubPlanSetting: ClubPlanSetting): void {
            let self = this;
            self.vLobbyCreateMjItemView.personNumGroup.selectedValue = vClubPlanSetting.personNum;
            self.vLobbyCreateMjItemView.gameGroup.selectedValue = vClubPlanSetting.quanNum;
            self.vLobbyCreateZhuanItemView.dianPaoGroup.selectedValue = GameConstant.GAME_PLAY_RULE_DIAN_PAO;
            self.vLobbyCreateZhuanItemView.youHuBiHu.selected = true;
            self.vLobbyCreateZhuanItemView.zhuangXian.selected = true;
            self.vLobbyCreateZhuanItemView.huQiDui.selected = true;
            self.vLobbyCreateZhuanItemView.isZhuaNiaoGroup.selectedValue = "0";
            self.vLobbyCreateZhuanItemView.showView(0);
            /** */
            let vRuleList: Array<number> = vClubPlanSetting.minorGamePlayRuleList;
            for (let i = 0, leng = vRuleList.length; i < leng; i++) {
                if (vRuleList[i] === GameConstant.GAME_PLAY_RULE_DIAN_PAO) {
                    self.vLobbyCreateZhuanItemView.dianPaoGroup.selectedValue = "" + vRuleList[i];
                } else if (vRuleList[i] === GameConstant.GAME_PLAY_RULE_MUST_HU) {
                    self.vLobbyCreateZhuanItemView.youHuBiHu.selected = true;
                } else if (vRuleList[i] === GameConstant.GAME_PLAY_RULE_ZHUANG_XIAN) {
                    self.vLobbyCreateZhuanItemView.zhuangXian.selected = true;
                } else if (vRuleList[i] === GameConstant.GAME_PLAY_RULE_ZZ_7_DUI) {
                    self.vLobbyCreateZhuanItemView.huQiDui.selected = true;
                } else if (vRuleList[i] === GameConstant.GAME_PLAY_RULE_ZZ_NIAO_JIA_FAN || vRuleList[i] === GameConstant.GAME_PLAY_RULE_ZZ_NIAO_JIA_FEN) {
                    self.vLobbyCreateZhuanItemView.isZhuaNiaoGroup.selectedValue = "" + vRuleList[i];
                    self.vLobbyCreateZhuanItemView.showView(vRuleList[i]);
                } else if (vRuleList[i] === GameConstant.GAME_PLAY_RULE_ZZ_ZHUANG_NIAO || vRuleList[i] === GameConstant.GAME_PLAY_RULE_ZZ_159_NIAO) {
                    self.vLobbyCreateZhuanItemView.zhongNiaoGroup.selectedValue = "" + vRuleList[i];
                } else if (vRuleList[i] === GameConstant.GAME_PLAY_RULE_ZZ_1_NIAO || vRuleList[i] === GameConstant.GAME_PLAY_RULE_ZZ_2_NIAO ||
                    vRuleList[i] === GameConstant.GAME_PLAY_RULE_ZZ_4_NIAO || vRuleList[i] === GameConstant.GAME_PLAY_RULE_ZZ_6_NIAO) {
                    if (self.vLobbyCreateZhuanItemView.isZhuaNiaoGroup.selectedValue === GameConstant.GAME_PLAY_RULE_ZZ_NIAO_JIA_FEN) {
                        self.vLobbyCreateZhuanItemView.zhuaNiaoRadioGroup.selectedValue = "" + vRuleList[i];
                    } else {
                        self.vLobbyCreateZhuanItemView.JiaBeiZhuaNiaoRadioGroup.selectedValue = "" + vRuleList[i];
                    }
                }
            }
        }

        public setRFSetting(vClubPlanSetting: ClubPlanSetting): void {
            let self = this;
            self.vLobbyCreatePokerItemView.personNumGroup.selectedValue = vClubPlanSetting.personNum;
            self.vLobbyCreatePokerItemView.gameGroup.selectedValue = vClubPlanSetting.quanNum;
            self.vLobbyCreateRunFasterItemView.shengYuPaiShuGroup.selectedValue = "0";
            self.vLobbyCreateRunFasterItemView.firstGameGroup.selectedValue = "0"; //value为0需要转换成string
            // self.vLobbyCreateRunFasterItemView.zhaDanGroup.selectedValue = "0";
            // self.vLobbyCreateRunFasterItemView.daiPaiGroup.selectedValue = ECardGameType.SI_GE_BU_DAI_PAI;
            self.vLobbyCreateRunFasterItemView.hongTaoShiZaNiao.selected = false;
            /** */
            let vRuleList: Array<number> = vClubPlanSetting.minorGamePlayRuleList;
            for (let i = 0, leng = vRuleList.length; i < leng; i++) {
                if (vRuleList[i] === ECardGameType.SHI_WU_ZHANG) {
                    self.btnList.selectedItem = CREATE_RF_ITEM[1];
                    self.loadRFContentPage();
                } else if (vRuleList[i] === ECardGameType.HEI_TAO_SAN_FIRST) {
                    self.vLobbyCreateRunFasterItemView.firstGameGroup.selectedValue = "" + vRuleList[i];
                } else if (vRuleList[i] === ECardGameType.SHOW_REST_CARD_NUM) {
                    self.vLobbyCreateRunFasterItemView.shengYuPaiShuGroup.selectedValue = "" + vRuleList[i];
                } else if (vRuleList[i] === ECardGameType.ZHA_DAN_BU_KE_CHAI) {
                    // self.vLobbyCreateRunFasterItemView.zhaDanGroup.selectedValue = "" + vRuleList[i];
                    // self.vLobbyCreateRunFasterItemView.changeZhaDan();
                } else if (vRuleList[i] === ECardGameType.HONG_TAO_SHI_ZHA_NIAO) {
                    self.vLobbyCreateRunFasterItemView.hongTaoShiZaNiao.selected = true;
                } else if (vRuleList[i] === ECardGameType.SI_GE_BU_DAI_PAI || vRuleList[i] === ECardGameType.SI_GE_DAI_SAN_PAI || vRuleList[i] === ECardGameType.SI_GE_DAI_ER_PAI) {
                    // self.vLobbyCreateRunFasterItemView.daiPaiGroup.selectedValue = "" + vRuleList[i];
                }
            }
        }

        public changeMjGroup(): void {
            GameConstant.setCurrentGame(EGameType.MAHJONG);
            let self = this;
            self.mjImg.visible = true;
            self.pokerImg.visible = false;
            self.mjTitle.source = "majiang_chosen_png";
            self.pokerTitle.source = "poker_unchosen_png";
            self.initView();
        }

        public changeRFGroup(): void {
            GameConstant.setCurrentGame(EGameType.RF);
            let self = this;
            self.mjImg.visible = false;
            self.pokerImg.visible = true;
            self.mjTitle.source = "majiang_unchosen_png";
            self.pokerTitle.source = "poker_chosen_png";
            self.initView();
        }

        public topView: LobbyCreateMjItemView | LobbyCreatePokerItemView;
        public contentView: LobbyCreateZhuanItemView | LobbyCreateHongzhongItemView | LobbyCreateChangShaItemView | LobbyCreateRunFasterItemView;
        /**设置茶楼楼层规则 */
        public setTeaHouseRule(playWay: MJGamePlayWay | ECardGamePlayWay, ruleList: number[], floor: number = TeaHouseData.curFloor) {
            this.flag_floor = floor;
            let params: IRulesSetViewShowParams = <IRulesSetViewShowParams>{};
            params = TeaHouseAlterRulesView.handleParamsByRuleList(ruleList, playWay);
            params.countNum = TeaHouseData.curGameNum;
            params.playerNum = TeaHouseData.curPlayerNum;
            let self = this;

            switch (playWay) {
                case MJGamePlayWay.ZHUANZHUAN:
                case MJGamePlayWay.ZHUAN_ZHUAN_MJ:
                    this.changeMjGroup();
                    self.topView = LobbyCreateMjItemView.getInstance();
                    self.contentView = LobbyCreateZhuanItemView.getInstance();
                    self.btnList.selectedItem = CREATE_MJ_ITEM[0];
                    this.loadMJContentPage();
                    break;
                case MJGamePlayWay.HONG_ZHONG_MJ:
                    this.changeMjGroup();
                    self.topView = LobbyCreateMjItemView.getInstance();
                    self.contentView = LobbyCreateHongzhongItemView.getInstance();
                    self.btnList.selectedItem = CREATE_MJ_ITEM[2];
                    this.loadMJContentPage();
                    break;
                case MJGamePlayWay.CHANG_SHA_MJ:
                    this.changeMjGroup();
                    self.topView = LobbyCreateMjItemView.getInstance();
                    self.contentView = LobbyCreateChangShaItemView.getInstance();
                    self.btnList.selectedItem = CREATE_MJ_ITEM[1];
                    this.loadMJContentPage();
                    break;
                case ECardGamePlayWay.JING_DIAN_PAO_DE_KUAI:
                    this.changeRFGroup();
                    self.topView = LobbyCreatePokerItemView.getInstance();
                    self.contentView = LobbyCreateRunFasterItemView.getInstance();
                    self.btnList.selectedItem = CREATE_RF_ITEM[0];
                    this.loadRFContentPage();
                    break;
                case ECardGamePlayWay.SHI_WU_ZHANG_PAO_DE_KUAI:
                    this.changeRFGroup();
                    self.topView = LobbyCreatePokerItemView.getInstance();
                    self.contentView = LobbyCreateRunFasterItemView.getInstance();
                    self.btnList.selectedItem = CREATE_RF_ITEM[1];
                    this.loadRFContentPage();
                    break;
            }

            self.topView.setViewShow(params);
            self.contentView.setViewShow(params);
        }
    }
}