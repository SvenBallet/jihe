module FL {

    export class ActivityRecommendAwardView extends BaseView {

        //调停者名字，删除界面的时候会自动移除
        public readonly mediatorName: string = ActivityRecommendAwardViewMediator.NAME;
        //界面层级，UI框架自动管理
        public readonly viewLayer: ViewLayerEnum = ViewLayerEnum.POPUP;

        public recommend:GameButton;
        public confirm:GameButton;
        public copy:GameButton;

        public detailLabel:eui.Label;
        public diamondNum:eui.Label;
        public recommendPerson:eui.Label;

        public inviteCode:eui.Label;
        public inviteCodeInput:NumberInput;

        public vRecomReward:SystemConfigPara;

        public colorFlilter = new egret.ColorMatrixFilter(
            [0.5,0,0,0,0,
            0,0.5,0,0,0,
            0,0,0.5,0,0,
            0,0,0,1,0]);

        private static _only:ActivityRecommendAwardView;

        public static getInstance():ActivityRecommendAwardView {
            if (!this._only) {
                this._only = new ActivityRecommendAwardView();
            }
            return this._only;
        }

        constructor () {
            super();
            this.verticalCenter = this.horizontalCenter = 0;
            this.skinName = "skins.ActivityRecommendAwardViewSkin";
        }

        protected childrenCreated():void {
            super.childrenCreated();
            let self = this;

            self.vRecomReward = LobbyHandler.getOneClientConfig(GameConfigConstant.CONF_LOBBY_RECOMMEND_REWARD);
            self.detailLabel.text = "推荐新用户或3天以上未登录的老用户进入游戏可获得钻石奖励!当他在此界面输入你的邀请码时,你可以获得"+self.vRecomReward.pro_3+"颗钻石奖励(每人每天通过该活动最多可获得"+self.vRecomReward.pro_2+"颗钻石)。";
            if(self.vRecomReward.pro_1 === 0){
                TouchTweenUtil.regTween(self.recommend, self.recommend);
                TouchTweenUtil.regTween(self.confirm, self.confirm);
                TouchTweenUtil.regTween(self.copy, self.copy);
            }else{
                self.recommend.filters = [this.colorFlilter];
                self.confirm.filters = [this.colorFlilter];
            }

            MvcUtil.regMediator( new ActivityRecommendAwardViewMediator(self) );

            if (Game.CommonUtil.isNative) {
                self.copy.visible = true;
            }
            else {
                self.copy.visible = false;
            }
            // APPSTORE屏蔽
            if (NativeBridge.IOSMask) {
                self.recommend.visible = false;
                self.copy.visible = false;
            }
        }

        public setData(msg):void{
            let self = this;
            let dataList:Array<number> = msg.vlist;
            let inviteCode:string = ""+ dataList[0];
            this.inviteCode.text = inviteCode;
            NativeBridge.mInvitecode = inviteCode;
            self.recommendPerson.text = "已推荐用户："+dataList[1]+"人";
            self.diamondNum.text = "已奖励钻石："+dataList[2]+"颗";
        }


    }
}