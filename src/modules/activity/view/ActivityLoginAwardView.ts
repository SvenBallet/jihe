module FL {
	export class ActivityLoginAwardView extends eui.Component{

        //调停者名字，删除界面的时候会自动移除
        public readonly mediatorName: string = "";

        //界面层级，UI框架自动管理
        public readonly viewLayer: ViewLayerEnum = ViewLayerEnum.POPUP;
        public timeLabel:eui.Label;
        public getBtn:GameButton;

        public rewardLabel1:eui.Label;
        public rewardLabel2:eui.Label;
        public rewardLabel3:eui.Label;
        public rewardLabel4:eui.Label;
        public rewardLabel5:eui.Label;
        public rewardLabel6:eui.Label;
        public rewardLabel7:eui.Label;

        private static _only:ActivityLoginAwardView;

        public static getInstance():ActivityLoginAwardView {
            if (!this._only) {
                this._only = new ActivityLoginAwardView();
            }
            return this._only;
        }


        public colorFilter = new egret.ColorMatrixFilter(
            [0.5,0,0,0,0,
             0,0.5,0,0,0,
             0,0,0.5,0,0,
             0,0,0,1,0]);


		public constructor() {
			super();
			this.verticalCenter = this.horizontalCenter = 0;
			this.skinName = "skins.ActivityLoginAwardViewSkin";
		}

		protected childrenCreated():void {
            super.childrenCreated();
            let self = this;
            self.rewardLabel1.text = "X"+LobbyHandler.getOneClientConfig(GameConfigConstant.CONF_LOGIN_REWARD_DAY_ONE).valueInt;
            self.rewardLabel2.text = "X"+LobbyHandler.getOneClientConfig(GameConfigConstant.CONF_LOGIN_REWARD_DAY_TWO).valueInt;
            self.rewardLabel3.text = "X"+LobbyHandler.getOneClientConfig(GameConfigConstant.CONF_LOGIN_REWARD_DAY_THREE).valueInt;
            self.rewardLabel4.text = "X"+LobbyHandler.getOneClientConfig(GameConfigConstant.CONF_LOGIN_REWARD_DAY_FOUR).valueInt;
            self.rewardLabel5.text = "X"+LobbyHandler.getOneClientConfig(GameConfigConstant.CONF_LOGIN_REWARD_DAY_FINE).valueInt;
            self.rewardLabel6.text = "X"+LobbyHandler.getOneClientConfig(GameConfigConstant.CONF_LOGIN_REWARD_DAY_SIX).valueInt;
            self.rewardLabel7.text = "X"+LobbyHandler.getOneClientConfig(GameConfigConstant.CONF_LOGIN_REWARD_DAY_SEVEN).valueInt;
        }

        public setData(msg)
        {
            this.timeLabel.text = "活动时间："+msg.startTime + " - " + msg.endTime;
            let dateList = msg.vlist;
            for(let i = 0; i<dateList.length; i++){
                if(dateList[i] === 0 && dateList[i-1] === 1){
                    TouchTweenUtil.regTween(this.getBtn, this.getBtn);
                    this.getBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.getAward, this);
                }else if(dateList[i] === 0 && dateList[i-1] === 3){
                    this.getBtn.filters = [this.colorFilter];
                }
                this.setDayState(i+1,dateList[i]);
            }
        }

        //设置周day的领取状态位state
        public setDayState(day:number, state:number)
        {
            let bgImg:eui.Image = this["bgImg"+day];
            let getImg:eui.Image = this["getImg"+day];  //已领取图
            let titleLabel = this["titleLabel"+day];   //已过期图
            let passImg = this["passImg"+day];
            let vGroup:eui.Group = this["group"+day];
            
            titleLabel.text = "第"+day+"天";
            let normalSrc = "daily_award_bg_png";
            let getSrc = "daily_get_award_png";

            if(state == 1){  //可领取
                titleLabel.textColor = "0x125857";
                bgImg.source = getSrc;
                bgImg.filters = [];
                getImg.visible = false;
                passImg.visible = false;
                vGroup.addEventListener(egret.TouchEvent.TOUCH_TAP, this.getAward, this);
            }else if(state == 2){  //已过期
                titleLabel.textColor = "0xFFFFFF";
                bgImg.source = normalSrc;
                passImg.visible = true;
                getImg.visible = false;
            }else if(state == 3) { //已经领取
                bgImg.source = normalSrc;
                titleLabel.textColor = "0xFFFFFF";
                getImg.visible = true;
                passImg.visible = false;
            }else {  //不可领取
                bgImg.source = normalSrc;
                titleLabel.textColor = "0xFFFFFF";
                bgImg.filters = [];
                getImg.visible = false;
                passImg.visible = false;
            }

        }

        private getAward(e:egret.Event):void{
            // let activityId:number = ActivityBaseView.LOGIN_AWARD;
            let vActivityGetRewardMsg:ActivityGetRewardMsg = new ActivityGetRewardMsg();
            vActivityGetRewardMsg.activityId = ActivityBaseView.LOGIN_AWARD;
            // ServerUtil.sendMsg(new ActivityGetRewardMsg({activityId:activityId}),MsgCmdConstant.MSG_ACTIVITY_GET_REWARD_ACK);
            ServerUtil.sendMsg(vActivityGetRewardMsg, MsgCmdConstant.MSG_ACTIVITY_GET_REWARD_ACK);
            this.getBtn.filters = [this.colorFilter];
            this.getBtn.touchEnabled = false;
            let vGroup:eui.Group = this[e.currentTarget.name];
            vGroup.touchEnabled = false;
            vGroup.touchChildren = false;
        }
	}
}