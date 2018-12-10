module FL {
    /**
     * *授权代开房
     */
    export class AgentAuthGetRoomView extends BaseView{

        public readonly mediatorName: string = AgentAuthGetRoomViewMediator.NAME;
        public readonly viewLayer: ViewLayerEnum = ViewLayerEnum.POPUP;

        //按钮组
        public authGroup:eui.Group;
        public authBtn:GameButton;

        public playerScroller:eui.Scroller;
        public playerGroup:eui.Group;

        public userId:NumberInput;

        /** 单例 */
        private static _only: AgentAuthGetRoomView;

        public constructor() {
            super();
            this.verticalCenter = this.horizontalCenter = 0;
            this.skinName = "skins.AgentAuthGetRoomViewSkin";

        }

        public static getInstance(): AgentAuthGetRoomView {
            if (!this._only) {
                this._only = new AgentAuthGetRoomView();
            }
            return this._only;
        }

        protected childrenCreated():void {
            super.childrenCreated();

            this.userId.titleLabelText = "输入用户ID";
            //垂直布局
            let layout = new eui.VerticalLayout();
            layout.gap = 10;
            this.playerGroup.layout = layout;

            //注册按钮点击缓动
            TouchTweenUtil.regTween(this.authBtn, this.authBtn);

            //注册pureMvc
            MvcUtil.regMediator( new AgentAuthGetRoomViewMediator(this));
        }

        public initList(msg:AgentRoomMsgAck):void{
            let list:Array<any> = msg.recordList;
            if(list == null){
                return;
            }
            this.playerGroup.removeChildren();
            for (let i=0;i<list.length;i++){
                let authPlayerItemView = new AgentAuthPlayerItemView(list[i]);
                this.playerGroup.addChild(authPlayerItemView);
            }
        }

    }
}