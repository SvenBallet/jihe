module FL {
    
    export class ActivityBaseView extends BaseView {

        //调停者名字，删除界面的时候会自动移除
        public readonly mediatorName: string = ActivityBaseViewMediator.NAME;
        //界面层级，UI框架自动管理
        public readonly viewLayer: ViewLayerEnum = ViewLayerEnum.POPUP;

        //关闭按钮
        public closeGroup:eui.Group;
        public closeBtn:eui.Image;

        public itemList:Array<string> = ["登录奖励","开房送钻","推荐有礼"];

        public tabIndex:number = 0;

        public btnList:eui.List;
        public contentGroup:eui.Group;

        //登录
        public static readonly LOGIN_AWARD:number = 0x0;
        //开房
        public static readonly KAIFANG_AWARD:number = 0x1;
        //分享
        public static readonly SHARE_AWARD:number = 0x2;
        //推荐
        public static readonly RECOMMEND_AWARD:number = 0x3;

        constructor () {
            super();
            this.verticalCenter = this.horizontalCenter = 0;
            this.skinName = "skins.ActivityViewSkin";
        }

        protected childrenCreated():void {
            super.childrenCreated();
            let self = this;
            TouchTweenUtil.regTween(self.closeGroup, self.closeBtn);

            this.initView();

            MvcUtil.regMediator( new ActivityBaseViewMediator(self) );
        }

        private initView()
        {
            this.btnList.itemRendererSkinName = "skins.AgentItemViewSkin";
            this.btnList.dataProvider = new eui.ArrayCollection(this.itemList);
            //设置默认选中项和内容
            this.btnList.selectedIndex = this.tabIndex;
            this.loadContentPage(this.tabIndex);
        }

        public loadContentPage(index:number):void {
            this.contentGroup.removeChildren();
            let vPlayerVO:PlayerVO = LobbyData.playerVO;
            let playerID:number = vPlayerVO.playerIndex;
            switch(index) {
                // case 0:{
                //     this.contentGroup.addChild (ActivityAttentionAwardView.getInstance());
                //     ServerUtil.sendMsg(new WXGongzhonghaoActivityMsg());
                //     break;
                // }
                case 0:{
                    this.contentGroup.addChild(ActivityLoginAwardView.getInstance());
                    let activityId:number = ActivityBaseView.LOGIN_AWARD;
                    ServerUtil.sendMsg(new ActivityShowMsg(activityId),MsgCmdConstant.MSG_ACTIVITY_SHOW_ACK);
                    break;
                }
                case 1:{
                    this.contentGroup.addChild (ActivityKaifangAwardView.getInstance());
                    let activityId:number = ActivityBaseView.KAIFANG_AWARD;
                    ServerUtil.sendMsg(new ActivityShowMsg(activityId),MsgCmdConstant.MSG_ACTIVITY_SHOW_ACK);
                    break;
                }
                // case 3:{
                //     this.contentGroup.addChild (ActivityShareAwardView.getInstance());
                //     let activityId:number = ActivityBaseView.SHARE_AWARD;
                //     ServerUtil.sendMsg(new ActivityShowMsg(activityId),MsgCmdConstant.MSG_ACTIVITY_SHOW_ACK);
                //     break;
                // }
                case 2:{
                    this.contentGroup.addChild (ActivityRecommendAwardView.getInstance());
                    let activityId:number = ActivityBaseView.RECOMMEND_AWARD;
                    ServerUtil.sendMsg(new ActivityShowMsg(activityId),MsgCmdConstant.MSG_ACTIVITY_SHOW_ACK);
                    break;
                }
            }
        }
    }
}