module FL {
    /**
     * *代开房
     */
    export class AgentGetRoomView extends BaseView{

        public readonly mediatorName: string = AgentGetRoomViewMediator.NAME;
        public readonly viewLayer: ViewLayerEnum = ViewLayerEnum.POPUP;

        //按钮组
        public agentGroup:eui.Group;
        public agentBtn:GameButton;

        public getRoomGroup:eui.Group;
        public getRoomBtn:eui.Image;

        //内容
        public contentSroller:eui.Scroller;
        public contentGroup:eui.Group;
        public contentList:eui.List;
        public roomNum:NumberInput;
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
        private static _only: AgentGetRoomView;

        public static getInstance(): AgentGetRoomView {
            if (!this._only) {
                this._only = new AgentGetRoomView();
            }
            return this._only;
        }

        public constructor() {
            super();
            this.verticalCenter = this.horizontalCenter = 0;
            this.skinName = "skins.AgentGetRoomViewSkin";
        }

        protected childrenCreated():void {
            super.childrenCreated();

            //默认待开发数量1
            this.roomNum.text = "1";
            this.roomNum.maxValue = 100;
            this.roomNum.minValue = 1;
            this.roomNum.titleLabelText = "代开房数量";

            //垂直布局
            let layout = new eui.VerticalLayout();
            layout.gap = 10;
            this.contentGroup.layout = layout;

            this.contentSroller.verticalScrollBar.autoVisibility = false;
            //垂直滚动开启
            this.contentSroller.scrollPolicyV = "on";
            //垂直滚动滚动到起始位置
            this.contentSroller.viewport.scrollV = 0;

            //注册按钮点击缓动
            TouchTweenUtil.regTween(this.agentBtn, this.agentBtn);
            TouchTweenUtil.regTween(this.leftGroup, this.leftBtn);
            TouchTweenUtil.regTween(this.rightGroup, this.rightBtn);

            //注册pureMvc
            MvcUtil.regMediator( new AgentGetRoomViewMediator(this));
        }

        public initList(msg:AgentDaiKaiMsgAck):void{
            let list:Array<AgentDaiKaiInfo> = msg.vlist;
            if(list == null){
                return;
            }
            this.contentGroup.removeChildren();

            let diamond = msg.unused_1;
            AgentGetRoomView.authPlayerID = msg.unused_2;
            AgentAuthPlayerRoomListView.authPlayerID = 0;
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

    }
}