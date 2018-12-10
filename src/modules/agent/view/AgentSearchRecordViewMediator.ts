module FL{
    export class AgentSearchRecordViewMediator extends puremvc.Mediator implements puremvc.IMediator{

        public static readonly NAME:string = "AgentSearchRecordViewMediator";

        public vAgentBaseView:AgentBaseView = this.viewComponent;
        public vView:AgentSearchRecordView = this.viewComponent;

        constructor (pView:AgentSearchRecordView) {
            super(AgentSearchRecordViewMediator.NAME, pView);
            let self = this;
            pView.sumGroup.addEventListener(egret.TouchEvent.TOUCH_TAP, self.sumView, self);
            pView.expandGroup.addEventListener(egret.TouchEvent.TOUCH_TAP, self.expandView, self);
            pView.revenueGroup.addEventListener(egret.TouchEvent.TOUCH_TAP, self.revenueView, self);
            pView.mySubGroup.addEventListener(egret.TouchEvent.TOUCH_TAP, self.mySubView, self);
            pView.searchBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, self.searchInfo, self);
            pView.leftGroup.addEventListener(egret.TouchEvent.TOUCH_TAP, self.loadPreviousPage, self);
            pView.rightGroup.addEventListener(egret.TouchEvent.TOUCH_TAP, self.loadNextPage, self);
        }

        //总流水
        private sumView(e:egret.Event):void {
            this.vView.expandBtn.source = this.vView.revenueBtn.source = this.vView.mySubBtn.source = "";
            this.vView.sumBtn.source = this.vView._tabSource;
            //当前Tab的命令
            let currentTabCMD:number = parseInt(this.vView._tabItem[0]);
            //写入缓存中，方便搜索按钮获取当前tab命令值
            egret.localStorage.setItem('AgentSearchTab',this.vView._tabItem[0]);
            let vParams = {itemID:currentTabCMD};
            ServerUtil.sendMsg(new GameBuyItemMsg(vParams), MsgCmdConstant.MSG_GAME_GET_PLAYER_DIAMOND_LOG_ACK);
        }

        //支出
        private expandView(e:egret.Event):void {
            this.vView.sumBtn.source = this.vView.revenueBtn.source = this.vView.mySubBtn.source = "";
            this.vView.expandBtn.source = this.vView._tabSource;
            let currentTabCMD:number = parseInt(this.vView._tabItem[1]);
            egret.localStorage.setItem('AgentSearchTab',this.vView._tabItem[1]);
            let vParams = {itemID:currentTabCMD};
            ServerUtil.sendMsg(new GameBuyItemMsg(vParams), MsgCmdConstant.MSG_GAME_GET_PLAYER_DIAMOND_LOG_ACK);
        }

        //收入
        private revenueView(e:egret.Event):void {
            this.vView.sumBtn.source = this.vView.expandBtn.source = this.vView.mySubBtn.source = "";
            this.vView.revenueBtn.source = this.vView._tabSource;
            let currentTabCMD:number = parseInt(this.vView._tabItem[2]);
            egret.localStorage.setItem('AgentSearchTab',this.vView._tabItem[2]);
            let vParams = {itemID:currentTabCMD};
            ServerUtil.sendMsg(new GameBuyItemMsg(vParams), MsgCmdConstant.MSG_GAME_GET_PLAYER_DIAMOND_LOG_ACK);
        }

        //我的下级
        private mySubView(e:egret.Event):void {
            this.vView.sumBtn.source = this.vView.revenueBtn.source = this.vView.expandBtn.source = "";
            this.vView.mySubBtn.source = this.vView._tabSource;
            let currentTabCMD:number = parseInt(this.vView._tabItem[3]);
            egret.localStorage.setItem('AgentSearchTab',this.vView._tabItem[3]);
            let vParams = {itemID:currentTabCMD};
            ServerUtil.sendMsg(new GameBuyItemMsg(vParams), MsgCmdConstant.MSG_GAME_GET_PLAYER_DIAMOND_LOG_ACK);
        }

        //搜索信息
        private searchInfo(e:egret.Event):void{
            let searchText = this.vView.searchContent.text.trim();
            if(searchText == ""){
                PromptUtil.show("搜索内容不能为空！", PromptType.ERROR);
                return;
            }
            let vParams = {itemID:GameConstant.PLAYER_CMD_QUERY_DIAMOND_LOG,unused_0:parseInt(searchText)};
            let vGameBuyItemMsg:GameBuyItemMsg = new GameBuyItemMsg(vParams);
            egret.log(vGameBuyItemMsg);
            ServerUtil.sendMsg(vGameBuyItemMsg, MsgCmdConstant.MSG_GAME_GET_PLAYER_DIAMOND_LOG_ACK);
        }

        //上一页
        private loadPreviousPage(e:egret.Event):void{
            let currentPage:number = parseInt(this.vView.currentPage.text);
            let previousPage:number = currentPage-1<0 ? 0 : currentPage-1;
            if(currentPage == 1){
                return;
            }
            let currentTabCMD:number = parseInt(egret.localStorage.getItem('AgentSearchTab'));
            //服务器传过来的页数索引(也就是当前页)pageIndex是从0开始的= =！。所以要-1
            let vParams = {itemID:currentTabCMD,count:previousPage-1};
            ServerUtil.sendMsg(new GameBuyItemMsg(vParams), MsgCmdConstant.MSG_GAME_GET_PLAYER_DIAMOND_LOG_ACK);
        }

        //下一页
        private loadNextPage(e:egret.Event):void{
            let currentPage:number = parseInt(this.vView.currentPage.text);
            let totalPage:number = parseInt(this.vView.totalPage.text);
            if(currentPage == totalPage){
                return;
            }
            let nextPage:number = currentPage+1> totalPage? totalPage : currentPage+1;
            let currentTabCMD:number = parseInt(egret.localStorage.getItem('AgentSearchTab'));
            //服务器传过来的页数索引(也就是当前页)pageIndex是从0开始的= =！。所以要-1
            let vParams = {itemID:currentTabCMD,count:nextPage-1};
            ServerUtil.sendMsg(new GameBuyItemMsg(vParams), MsgCmdConstant.MSG_GAME_GET_PLAYER_DIAMOND_LOG_ACK);
        }

    }
}