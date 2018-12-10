module FL {
    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase - ClubBaseView
     * @Description:  俱乐部基础界面
     * @Create: ArielLiang on 2018/3/7 10:21
     * @Version: V1.0
     */
    export enum EClubItemList {
        "房间列表" = 0,
        "成员列表" = 1,
        "申请列表" = 2,
        "排行榜" = 3,
        "日志记录" = 4,
        "俱乐部详情" = 5
    }

    export class ClubBaseView extends BaseView {

        //调停者名字，删除界面的时候会自动移除
        public readonly mediatorName: string = ClubBaseViewMediator.NAME;
        //界面层级，UI框架自动管理
        public readonly viewLayer: ViewLayerEnum = ViewLayerEnum.BOTTOM_ONLY;

        /** 具体组*/
        public clubGroup: eui.Group;

        /** 基础组*/
        public baseGroup: eui.Group;

        /** 头部信息组*/
        public headGroup: eui.Group;

        /** 自动开房设置*/
        public autoOpenRoomGroup: eui.Group;
        public autoOpenRoomBtn: GameButton;
        /** 进入俱乐部*/
        public enterBtn: GameButton;
        /** 俱乐部ID*/
        public clubID: eui.Label;
        /** 俱乐部名称*/
        public titleLabel: eui.Label;
        /** 关闭按钮*/
        public closeGroup: eui.Image;
        public closeBtn: eui.Image;

        /** 增加钻石组*/
        public diamondGroup: eui.Group;
        public diamondNum: eui.Label;
        /** 增加钻石*/
        public addDiamondGroup: eui.Group;
        public addDiamondBtn: eui.Image;

        /** 底部信息组*/
        public footerGroup: eui.Group;
        /** 上一页按钮*/
        public leftGroup: eui.Group;
        public leftBtn: eui.Image;
        /** 下一页按钮*/
        public rightGroup: eui.Group;
        public rightBtn: eui.Image;
        /** 公共按钮*/
        public commonBtn: GameButton;
        /** 备用按钮*/
        public backupBtn: GameButton;
        /** 刷新*/
        public refreshBtn: GameButton;

        /** 第几页*/
        public pageLabel: eui.Label;

        /** 全部页*/
        public totalPage: number = 1;
        /** 当前页*/
        public currentPage: number = 1;
        /** 先前的选项 */
        public previousIndex: number = 0;

        /** 详情页面 */
        public vClubDetailView: ClubDetailView = null;

        /** 申请列表红点 */
        public redPonit: eui.Group;
        /** 输入玩家ID*/
        public inputPlayerIndex:NumberInput;

        //选项列表组
        public listScoller: eui.Scroller;
        public listGroup: eui.Group;
        public btnList: eui.List;
        public itemList: Array<string> = [];

        public tabIndex: number = 0;
        public playerType: number;

        public vClubRoomListView: ClubRoomListView;
        public vClubMemberListView: ClubMemberListView;
        public vClubApplyListView: ClubApplyListView;
        public static readonly Creator_ItemList: string[] = [EClubItemList[0], EClubItemList[1], EClubItemList[2], EClubItemList[3], EClubItemList[4], EClubItemList[5]];
        public static readonly Admin_ItemList: string[] = [EClubItemList[0], EClubItemList[1], EClubItemList[2], EClubItemList[3], EClubItemList[4], EClubItemList[5]];
        public static readonly Member_ItemList: string[] = [EClubItemList[0], EClubItemList[1], EClubItemList[3], EClubItemList[5]];

        /** 单例 */
        private static _only: ClubBaseView;

        /** 调停者 */
        private _mediator: ClubBaseViewMediator;

        public static getInstance(): ClubBaseView {
            if (!this._only) {
                this._only = new ClubBaseView();
            }
            return this._only;
        }

        private constructor() {
            super();
            this.left = this.right = 20;
            this.top = this.bottom = 10;
            this.skinName = "skins.ClubBaseViewSkin";
        }

        protected childrenCreated(): void {
            super.childrenCreated();
            let self = this;

            let layout = new eui.VerticalLayout();
            layout.gap = 6;
            layout.paddingBottom = 100;
            self.btnList.layout = layout;
            self.listScoller.verticalScrollBar.autoVisibility = false;

            //注册按钮点击缓动
            TouchTweenUtil.regTween(self.closeGroup, self.closeBtn);
            TouchTweenUtil.regTween(self.refreshBtn, self.refreshBtn);
            TouchTweenUtil.regTween(self.autoOpenRoomBtn, self.autoOpenRoomBtn);
            TouchTweenUtil.regTween(self.addDiamondGroup, self.addDiamondBtn);
            TouchTweenUtil.regTween(self.leftGroup, self.leftBtn);
            TouchTweenUtil.regTween(self.rightGroup, self.rightBtn);
            TouchTweenUtil.regTween(self.commonBtn, self.commonBtn);
            TouchTweenUtil.regTween(self.backupBtn, self.backupBtn);

            //调停者
            self._mediator = new ClubBaseViewMediator(self);
        }

        /** 添加到界面以后框架自动调用 */
        protected onAddView(): void {
            let self = this;
            this.initView();
            MvcUtil.regMediator(self._mediator);
            self.initView();
        }

        /**
         * 初始化界面
         */

        private initView() {
            let vClub: Club = ClubData.vClub;
            this.clubID.text = "ID:" + vClub.id;
            this.diamondNum.text = "" + vClub.diamond;
            this.addDiamondGroup.visible = false;
            this.titleLabel.text = StringUtil.subStrSupportChinese(vClub.name, 12, "...");
            switch (vClub.myState) {
                case ClubData.CLUB_TYPE_CREATOR:
                    this.itemList = ClubBaseView.Creator_ItemList;
                    this.addDiamondGroup.visible = true;
                    this.autoOpenRoomGroup.visible = true;
                    break;
                case ClubData.CLUB_TYPE_ADMIN:
                    this.diamondGroup.visible = false;
                    this.itemList = ClubBaseView.Admin_ItemList;
                    this.autoOpenRoomGroup.visible = true;
                    break;
                case ClubData.CLUB_TYPE_MEMBER:
                    this.diamondGroup.visible = false;
                    this.itemList = ClubBaseView.Member_ItemList;
                    this.autoOpenRoomGroup.visible = false;
                    break;
                default:
                    break;
            }

            let vPlayerVO: PlayerVO = LobbyData.playerVO;
            this.playerType = vPlayerVO.playerType;
            // this.btnList.itemRendererSkinName = "skins.AgentItemViewSkin";
            this.btnList.itemRenderer = ClubBtnListItemView;
            this.btnList.dataProvider = new eui.ArrayCollection(this.itemList);
            //设置默认选中项和内容
            this.tabIndex = 0;
            this.btnList.allowMultipleSelection = false;
            this.previousIndex = this.btnList.selectedIndex;
            this.btnList.selectedIndex = this.tabIndex;
            this.loadContentPage(this.tabIndex);
            this.sendShowApplyMsg();
        }

        /**
         * 更新选中按钮视图
         */
        public refreshBtnListView() {
            let _btn0: any = this.btnList.getChildAt(this.previousIndex);
            let _btn1: any = this.btnList.getChildAt(this.btnList.selectedIndex);
            if (this.btnList.selectedItem != EClubItemList[5]) {
                if (_btn0) _btn0.onUnchosen();
                if (_btn1) _btn1.onChosen();
            }
        }

        /**
         * 绘制申请列表红点
         */
        public drawRedPoint(data: ShowApplyListMsgAck) {
            if (this.redPonit) {//移除已有的红点，重新绘制
                if (this.redPonit.parent) this.redPonit.parent.removeChild(this.redPonit);
                this.redPonit = null;
                return this.drawRedPoint(data);
            }
            if (!data || !data.applyList.length) return;
            let op = <IRedPointOptions>{};
            op.useText = true;
            op.text = "" + data.applyList.length;
            op.textSize = 20;
            op.radius = 15;
            let g = RedPointUtil.drawRedPoint(op);
            g.x = 205;
            g.y = 210;
            this.redPonit = g;
            this.btnList.addChild(this.redPonit);
        }

        /**
         * 按照索引加载内容
         * @param {number} index
         */
        public loadContentPage(index: number): void {
            let item = this.btnList.selectedItem;
            if (item == EClubItemList[5]) {
                this.vClubDetailView = new ClubDetailView();
                MvcUtil.addView(this.vClubDetailView);
                this.btnList.selectedIndex = this.previousIndex;
                return;
            }
            if (item !== EClubItemList[0] || ClubData.vClub.myState === ClubData.CLUB_TYPE_MEMBER) {
                this.diamondGroup.visible = false;
            } else {
                this.diamondGroup.visible = true;
            }
            this.clubGroup.removeChildren();
            switch (item) {
                case EClubItemList[0]: {
                    if (ClubData.vClub.myState === ClubData.CLUB_TYPE_MEMBER) {
                        this.commonBtn.visible = false;
                    } else {
                        this.commonBtn.visible = true;
                        this.commonBtn.labelDisplay.text = "俱乐部开房";
                    }
                    this.backupBtn.visible = false;
                    this.vClubRoomListView = new ClubRoomListView();
                    this.clubGroup.addChild(this.vClubRoomListView);
                    egret.localStorage.setItem("intoClubRoomList", "1");
                    //页数从0开始
                    this.vClubRoomListView.sendMsg(0, 0);
                    MvcUtil.send(ClubModule.CLUB_GET_ROOM_LIST);
                    break;
                }
                case EClubItemList[1]: {
                    this.backupBtn.visible = true;
                    this.commonBtn.visible = true;
                    this.backupBtn.labelDisplay.text = "搜索成员";
                    this.commonBtn.labelDisplay.text = "邀请好友";
                    this.vClubMemberListView = new ClubMemberListView();
                    this.clubGroup.addChild(this.vClubMemberListView);
                    MvcUtil.send(ClubModule.CLUB_GET_MEMBER_LIST);
                    break;
                }
                case EClubItemList[2]: {
                    this.backupBtn.visible = true;
                    this.commonBtn.visible = true;
                    this.commonBtn.labelDisplay.text = "全部同意";
                    this.backupBtn.labelDisplay.text = "全部拒绝";
                    this.vClubApplyListView = new ClubApplyListView();
                    this.clubGroup.addChild(this.vClubApplyListView);
                    this.sendShowApplyMsg();
                    break;
                }
                case EClubItemList[3]: {
                    this.backupBtn.visible = false;
                    this.commonBtn.visible = false;
                    let vClubRankingListView: ClubRankingListView = new ClubRankingListView();
                    this.clubGroup.addChild(vClubRankingListView);
                    this.sendRankMsg();
                    break;
                }
                case EClubItemList[4]: {
                    this.backupBtn.visible = false;
                    this.commonBtn.visible = false;
                    let vClubLogRecordView: ClubLogRecordView = new ClubLogRecordView();
                    this.clubGroup.addChild(vClubLogRecordView);
                    this.sendLogMsg();
                    break;
                }
            }
            this.previousIndex = this.btnList.selectedIndex;
        }

        /**
         * 发送排行榜消息
         * @Written : HoyeLee
         */
        public sendRankMsg() {
            let vShowRankMsg: ShowRankMsg = new ShowRankMsg();
            //-----test  
            vShowRankMsg.clubId = ClubData.vClub.id;
            vShowRankMsg.page = this.currentPage;
            ServerUtil.sendMsg(vShowRankMsg, MsgCmdConstant.MSG_SHOW_RANK_ACK);
        }

        /**
         * 发送日志记录消息
         * @Written : HoyeLee
         */
        public sendLogMsg() {
            let vClubLogMsg: ClubLogMsg = new ClubLogMsg();
            //-----test  
            vClubLogMsg.clubId = ClubData.vClub.id;
            vClubLogMsg.page = this.currentPage;
            ServerUtil.sendMsg(vClubLogMsg, MsgCmdConstant.MSG_CLUB_LOG_ACK);
        }

        /**
         * 发送显示申请列表消息
         * @Written : HoyeLee
         */
        public sendShowApplyMsg() {
            let vShowApplyListMsg: ShowApplyListMsg = new ShowApplyListMsg();
            //-----test  
            vShowApplyListMsg.clubId = ClubData.vClub.id;
            vShowApplyListMsg.page = this.currentPage;
            ServerUtil.sendMsg(vShowApplyListMsg, MsgCmdConstant.MSG_SHOW_APPLY_LIST_ACK);
        }
    }
}