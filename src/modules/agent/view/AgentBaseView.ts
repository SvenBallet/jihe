module FL {
    /**
     * 代理界面选项条目
     */
    export enum AGENT_ITEM {
        "我的资料" = 0,
        "房卡赠送" = 1,
        "代开房" = 2,
        "授权代开房" = 3,
        "流水查询" = 4,
        "玩家管理" = 5,  //玩家管理和系统管理换个名字
        "代理协议" = 6,
        "系统管理" = 7
    }

    export class AgentBaseView extends BaseView {

        //调停者名字，删除界面的时候会自动移除
        public readonly mediatorName: string = AgentBaseViewMediator.NAME;
        //界面层级，UI框架自动管理
        public readonly viewLayer: ViewLayerEnum = ViewLayerEnum.BOTTOM_ONLY;

        //添加界面的缓动
        public addTween: Array<any> = [{ data: [{ scaleX: 0.8, scaleY: 0.8 }, { scaleX: 1, scaleY: 1 }, 200, Game.Ease.backOut] }];

        //删除按钮
        public closeGroup: eui.Group;
        public closeBtn: eui.Image;

        //选项列表组
        public listScoller: eui.Scroller;
        public listGroup: eui.Group;
        public btnList: eui.List;
        // /** 条目显示列表 playerType == 10,全部显示*/
        // public static readonly itemList10: Array<string> = [AGENT_ITEM[0], AGENT_ITEM[1], AGENT_ITEM[4], AGENT_ITEM[5], AGENT_ITEM[6], AGENT_ITEM[7]];
        // /** 条目显示列表 playerType == 5,玩家管理不显示*/
        // public static readonly itemList5: Array<string> = [AGENT_ITEM[0], AGENT_ITEM[1], AGENT_ITEM[4], AGENT_ITEM[5], AGENT_ITEM[6]];
        // /** 条目显示列表 playerType == 3,玩家管理，系统管理不显示*/
        // public static readonly itemList3: Array<string> = [AGENT_ITEM[0], AGENT_ITEM[1], AGENT_ITEM[4], AGENT_ITEM[6]];

        /** 条目显示列表 playerType == 10,全部显示*/
        public static readonly itemList10: Array<string> = [AGENT_ITEM[0], AGENT_ITEM[1], AGENT_ITEM[4], AGENT_ITEM[5], AGENT_ITEM[6], AGENT_ITEM[7]];
        /** 条目显示列表 playerType == 5,玩家管理不显示*/
        public static readonly itemList5: Array<string> = [AGENT_ITEM[0], AGENT_ITEM[1], AGENT_ITEM[4], AGENT_ITEM[5], AGENT_ITEM[6]];
        /** 条目显示列表 playerType == 3,玩家管理，系统管理不显示*/
        public static readonly itemList3: Array<string> = [AGENT_ITEM[0], AGENT_ITEM[4], AGENT_ITEM[6]];

        /** 条目显示列表 playerType == 2,显示我的资料和代开房*/
        // public static readonly itemList2: Array<string> = [AGENT_ITEM[0],AGENT_ITEM[2]];  //暂时废弃
        /** 条目显示列表 playerType == 0,显示我的资料*/
        public static readonly itemList0: Array<string> = [AGENT_ITEM[0]];
        //选项内容组
        public contentScroller: eui.Scroller;
        public contentGroup: eui.Group;
        public titleLabel: eui.Label;
        public contentLabel: eui.Label;

        public tabIndex: string = AGENT_ITEM[0];

        public playerType: number;

        public agentLevel: number;

        public vMyProfileView: AgentRebateMyProfileView;

        /** 记录点击前选中的BTN ITEM */
        public currentItemIndex: string;

        //返回数据
        public readonly msg: AgentDaiKaiMsgAck;

        public constructor() {
            super();
            this.verticalCenter = this.horizontalCenter = 0;
            this.skinName = "skins.AgentBaseViewSkin";
        }
        protected childrenCreated(): void {
            super.childrenCreated();
            let self = this;

            self.listScoller.verticalScrollBar.autoVisibility = false;

            //注册按钮点击缓动
            TouchTweenUtil.regTween(self.closeGroup, self.closeBtn);

            let vPlayerVO: PlayerVO = LobbyData.playerVO;
            self.playerType = vPlayerVO.playerType;

            self.setTabIndex();

            self.initView();


            //注册pureMvc
            MvcUtil.regMediator(new AgentBaseViewMediator(self));
        }

        /**
         * 设置默认选中项
         */
        private setTabIndex(): void {
            this.tabIndex = egret.localStorage.getItem("agentTabIndex") ? egret.localStorage.getItem("agentTabIndex") : AGENT_ITEM[0];
            egret.localStorage.removeItem("agentTabIndex");
        }

        /**
         * 代理后台
         */
        private initView() {
            this.btnList.itemRendererSkinName = "skins.AgentItemViewSkin";
            if (this.playerType === 10) {
                this.btnList.dataProvider = new eui.ArrayCollection(AgentBaseView.itemList10);
            } else if (this.playerType === 5) {
                this.btnList.dataProvider = new eui.ArrayCollection(AgentBaseView.itemList5);
            } else if (this.playerType === 3) {
                this.btnList.dataProvider = new eui.ArrayCollection(AgentBaseView.itemList3);
            } else {
                this.btnList.dataProvider = new eui.ArrayCollection(AgentBaseView.itemList0);
            }
            //设置默认选中项和内容
            this.btnList.selectedItem = this.tabIndex;
            this.loadContentPage(this.tabIndex);
        }

        /**
         * 代理后台
         * @param {number} index
         */
        public loadContentPage(index: string): void {
            this.currentItemIndex = index;
            this.contentGroup.removeChildren();
            //垂直滚动滚动到起始位置
            this.contentScroller.viewport.scrollV = 0;
            //垂直滚动关闭
            this.contentScroller.scrollPolicyV = "off";
            let vPlayerVO: PlayerVO = LobbyData.playerVO;
            let playerID: number = vPlayerVO.playerIndex;
            switch (index) {
                case AGENT_ITEM[0]: {
                    this.vMyProfileView = new AgentRebateMyProfileView();
                    this.contentGroup.addChild(this.vMyProfileView);
                    this.vMyProfileView.getAgentInfo();
                    break;
                }
                case AGENT_ITEM[1]: {
                    let vAgentGiveDiamondView = AgentGiveDiamondView.getInstance();
                    this.contentGroup.addChild(vAgentGiveDiamondView);
                    break;
                }
                // case AGENT_ITEM[2]: {
                //     this.contentGroup.addChild(AgentGetRoomView.getInstance());
                //     let vParams;
                //     if (egret.localStorage.getItem("agentQunzhuID")) {
                //         let player = parseInt(egret.localStorage.getItem("agentQunzhuID"));
                //         vParams = { itemID: GameConstant.AGENT_CMD_GET_FANGLIST, unused_0: player };
                //     } else {
                //         vParams = { itemID: GameConstant.AGENT_CMD_GET_FANGLIST, count: playerID };
                //     }
                //     ServerUtil.sendMsg(new GameBuyItemMsg(vParams), MsgCmdConstant.MSG_AGENT_DAIKAI_ACK);
                //     egret.localStorage.removeItem("agentQunzhuID");
                //     break;
                // }
                // case AGENT_ITEM[3]: {
                //     this.contentGroup.addChild(AgentAuthGetRoomView.getInstance());
                //     let vParams = { itemID: GameConstant.AGENT_CMD_GET_LIST, count: playerID };
                //     ServerUtil.sendMsg(new GameBuyItemMsg(vParams), MsgCmdConstant.MSG_AGENT_PLAYER_ACK);
                //     break;
                // }
                case AGENT_ITEM[4]: {
                    let vAgentSearchRecordView = AgentSearchRecordView.getInstance();
                    this.contentGroup.addChild(vAgentSearchRecordView);
                    vAgentSearchRecordView.expandBtn.source = vAgentSearchRecordView.revenueBtn.source = vAgentSearchRecordView.mySubBtn.source = "";
                    vAgentSearchRecordView.sumBtn.source = vAgentSearchRecordView._tabSource;
                    ServerUtil.sendMsg(new GameBuyItemMsg({ itemID: GameConstant.SEND_PLAYER_CMD_GET_MY_SEND_DIAMOND_LOG }), MsgCmdConstant.MSG_GAME_GET_PLAYER_DIAMOND_LOG_ACK);
                    break;
                }
                case AGENT_ITEM[5]: {
                    let vAgentSystemView = new AgentSystemView();
                    this.contentGroup.addChild(vAgentSystemView);
                    break;
                }
                case AGENT_ITEM[6]: {
                    this.AgentProtocolView();
                    break;
                }
                case AGENT_ITEM[7]: {
                    this.contentGroup.addChild(AgentPlayerManageView.getInstance());
                    let vParams = { itemID: GameConstant.SEND_PLAYER_CMD_GET_SYSTEM_INFO };
                    ServerUtil.sendMsg(new GameBuyItemMsg(vParams), MsgCmdConstant.MSG_GAME_BUY_ITEM_ACK);
                    break;
                }
            }
        }

        public AgentProtocolView(): void {
            let jsonData = RES.getRes("dailixieyi_json");
            let titleLabel = new eui.Label();
            this.contentScroller.stopAnimation();
            titleLabel.textFlow = (new egret.HtmlTextParser).parser(jsonData.title);
            // contentLabel.textFlow = (new egret.HtmlTextParser).parser(jsonData.desc);
            let group = HtmlTextParserUtil.getHtmlTextGroup({
                name: "dailixieyi_json",
                width: this.contentScroller.width,
                left: 2,
                right: 2,
                textColor: 0xB95A00
            })
            titleLabel.fontFamily = "Microsoft YaHei";
            titleLabel.textColor = 0xB95A00;
            titleLabel.textAlign = "center";
            group.y = 50;
            this.contentScroller.scrollPolicyV = "on";
            this.contentScroller.verticalScrollBar.autoVisibility = false;
            this.contentGroup.addChild(titleLabel);
            this.contentGroup.addChild(group);
        }

    }
}