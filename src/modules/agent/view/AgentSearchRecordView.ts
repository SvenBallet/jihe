module FL {
    export class AgentSearchRecordView extends BaseView{

        public readonly mediatorName: string = AgentSearchRecordViewMediator.NAME;
        public readonly viewLayer: ViewLayerEnum = ViewLayerEnum.POPUP;

        //总流水
        public sumGroup:eui.Group;
        public sumBtn:eui.Image;

        //支出
        public expandGroup:eui.Group;
        public expandBtn:eui.Image;

        //收入
        public revenueGroup:eui.Group;
        public revenueBtn:eui.Image;

        //我的下级
        public mySubGroup:eui.Group;
        public mySubBtn:eui.Image;

        //搜索内容
        public searchBtn:GameButton;

        //翻页按钮组
        public leftGroup:eui.Group;
        public leftBtn:eui.Image;

        public rightGroup:eui.Group;
        public rightBtn:eui.Image;

        public currentPage:eui.Label;
        public totalPage:eui.Label;

        public searchContent:NumberInput;

        //内容列表
        public contentScroller:eui.Scroller;
        public contentGroup:eui.Group;
        public contentList:eui.List;

        //选中按钮源文件初始值
        public _tabSource:string = "tab_chosen_png";

        //默认tab选中框：总流水：0x17676，支出：0x17678, 收入：0x17677, 我的下级：0x1767b
        public _tabItem:Array<string> = ['0x17676','0x17678','0x17677','0x1767b'];

        /** 单例 */
        private static _only: AgentSearchRecordView;

        public constructor() {
            super();
            this.verticalCenter = this.horizontalCenter = 0;
            this.skinName = "skins.AgentSearchRecordViewSkin";
        }

        public static getInstance(): AgentSearchRecordView {
            if (!this._only) {
                this._only = new AgentSearchRecordView();
            }
            return this._only;
        }

        protected childrenCreated():void {
            super.childrenCreated();

            //布局
            let vVerticalLayout:eui.VerticalLayout = new eui.VerticalLayout();
            vVerticalLayout.gap = 18;
            this.contentList.layout = vVerticalLayout;
            this.contentScroller.verticalScrollBar.autoVisibility = false;

            this.searchContent.titleLabelText = "输入玩家ID";

            let vPlayerVO:PlayerVO = LobbyData.playerVO;
            let playerType = vPlayerVO.playerType;
            if(playerType === 3){
                this.removeChild(this.searchContent);
                this.removeChild(this.searchBtn);
            }

            //设置默认tab选中框
            egret.localStorage.setItem('AgentSearchTab',this._tabItem[0]);

            //注册按钮点击缓动
            TouchTweenUtil.regTween(this.searchBtn, this.searchBtn);
            TouchTweenUtil.regTween(this.leftGroup, this.leftBtn);
            TouchTweenUtil.regTween(this.rightGroup, this.rightBtn);

            //注册pureMvc
            MvcUtil.regMediator( new AgentSearchRecordViewMediator(this));
        }


        public initList(msg:GetPlayerDiamondLogAck):void{
            this.contentScroller.viewport.scrollV = 0;
            let list:Array<any> = msg.logs;
            if(list == null){
                return;
            }
            let collection = new eui.ArrayCollection();
            this.contentList.itemRendererSkinName = "skins.AgentSearchListSkin";
            this.contentList.dataProvider = collection;
            if(list.length === 0){
                collection.addItem("没有记录");
            }else{
                for(let i=0;i<list.length;i++){
                    collection.addItem(i+1+":"+list[i].opDetail+" "+list[i].dateStr);
                }
            }
            this.contentList.dataProvider = collection;
            //服务器传过来的页数索引(也就是当前页)pageIndex是从0开始的= =！。所以要+1
            this.currentPage.text = msg.pageIndex+1+"";
            this.totalPage.text = msg.totalPage == 0? msg.totalPage+1+"": msg.totalPage+"";
        }

    }
}