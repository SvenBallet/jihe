module FL {
    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase - AgentAuthPlayerRoomListView
     * @Description:  副群主代开房列表
     * @Create: ArielLiang on 2018/2/6 15:52
     * @Version: V1.0
     */
    export class AgentAuthPlayerRoomListView extends BaseView{
        public readonly mediatorName: string = "";
        public readonly viewLayer: ViewLayerEnum = ViewLayerEnum.POPUP;

        public getRoomGroup:eui.Image;
        //内容
        public contentSroller:eui.Scroller;
        public contentGroup:eui.Group;
        public contentList:eui.List;
        public roomNum:eui.TextInput;
        public diamondNum:eui.Label;

        //翻页按钮组
        public leftGroup:eui.Group;
        public leftBtn:eui.Image;

        public rightGroup:eui.Group;
        public rightBtn:eui.Image;

        public currentPage:eui.Label;
        public totalPage:eui.Label;

        //被授权玩家ID
        public static authPlayerID:number;

        /** 单例 */
        private static _only: AgentAuthPlayerRoomListView;

        public static getInstance(): AgentAuthPlayerRoomListView {
            if (!this._only) {
                this._only = new AgentAuthPlayerRoomListView();
            }
            return this._only;
        }

        public constructor() {
            super();
            this.verticalCenter = this.horizontalCenter = 0;
            this.skinName = "skins.AgentAuthPlayerRoomListViewSkin";
        }

        protected childrenCreated():void {
            super.childrenCreated();
            //垂直布局
            let self = this;
            let layout = new eui.VerticalLayout();
            layout.gap = 10;
            self.contentGroup.layout = layout;

            self.contentSroller.verticalScrollBar.autoVisibility = false;
            //垂直滚动开启
            self.contentSroller.scrollPolicyV = "on";
            //垂直滚动滚动到起始位置
            self.contentSroller.viewport.scrollV = 0;

            //注册按钮点击缓动
            TouchTweenUtil.regTween(this.leftGroup, this.leftBtn);
            TouchTweenUtil.regTween(this.rightGroup, this.rightBtn);

            self.getRoomGroup.addEventListener(egret.TouchEvent.TOUCH_TAP, self.getRoomList, self);
            self.leftGroup.addEventListener(egret.TouchEvent.TOUCH_TAP, self.loadPreviousPage, self);
            self.rightGroup.addEventListener(egret.TouchEvent.TOUCH_TAP, self.loadNextPage, self);
        }

        public initList(msg:AgentDaiKaiMsgAck):void{
            let list:Array<AgentDaiKaiInfo> = msg.vlist;
            if(list == null){
                return;
            }
            this.contentGroup.removeChildren();

            let diamond = msg.unused_1;
            AgentAuthPlayerRoomListView.authPlayerID = msg.unused_0;
            this.diamondNum.text = "预授权钻石数:"+diamond;
            for(let i=0;i<list.length;i++){
                let vAgentRoomListView = new AgentRoomListView(list[i]);
                this.contentGroup.addChild(vAgentRoomListView);
            }
            //服务器传过来的页数索引(也就是当前页)pageIndex是从0开始的= =！。所以要+1
            if(msg.totalPage === 0){
                this.currentPage.text = "0";
            }else{
                this.currentPage.text = msg.pageIndex+1+"";
            }
            this.totalPage.text = msg.totalPage+"";

        }


        private getRoomList():void{
            let playerID:number = AgentAuthPlayerRoomListView.authPlayerID;
            // MvcUtil.addView(new DelLayerView(ViewLayerEnum.BOTTOM_ONLY));
            //进入战绩界面
            let msg: GetVipRoomListMsg = new GetVipRoomListMsg();
            msg.unused_0 = 1;
            msg.unused_1 = playerID;
            msg.unused_2 = 1;
            egret.log(msg);
            ServerUtil.sendMsg(msg,MsgCmdConstant.MSG_GET_VIP_ROOM_RECORD_ACK2);
        }

        //上一页
        private loadPreviousPage(e:egret.Event):void{
            let currentPage:number = parseInt(this.currentPage.text);
            let previousPage:number = currentPage-1<0 ? 0 : currentPage-1;
            if(currentPage <= 1){
                return;
            }
            //服务器传过来的页数索引(也就是当前页)pageIndex是从0开始的= =！。所以要-1
            let vParams = {itemID:GameConstant.AGENT_CMD_GET_FANGLIST,count:previousPage-1};
            ServerUtil.sendMsg(new GameBuyItemMsg(vParams), MsgCmdConstant.MSG_AGENT_DAIKAI_ACK);
        }

        //下一页
        private loadNextPage(e:egret.Event):void{
            let currentPage:number = parseInt(this.currentPage.text);
            let totalPage:number = parseInt(this.totalPage.text);
            if(currentPage == totalPage){
                return;
            }
            let nextPage:number = currentPage+1> totalPage? totalPage : currentPage+1;

            //服务器传过来的页数索引(也就是当前页)pageIndex是从0开始的= =！。所以要-1
            let vParams = {itemID:GameConstant.AGENT_CMD_GET_FANGLIST,count:nextPage-1};
            ServerUtil.sendMsg(new GameBuyItemMsg(vParams), MsgCmdConstant.MSG_AGENT_DAIKAI_ACK);
        }


    }
}