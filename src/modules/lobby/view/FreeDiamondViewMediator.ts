module FL {
    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase - FreeDiamondViewMediator
     * @Description:  //调停者
     * @Create: DerekWu on 2017/11/21 10:44
     * @Version: V1.0
     */
    export class FreeDiamondViewMediator extends puremvc.Mediator implements puremvc.IMediator {

        public static readonly NAME:string = "FreeDiamondViewMediator";

        constructor (pView:FreeDiamondView) {
            super(FreeDiamondViewMediator.NAME, pView);
            let self = this;
            // 初始化显示内容
            self.initView();
            // 注册事件
            pView.closeGroup.addEventListener(egret.TouchEvent.TOUCH_TAP, self.closeView, self);
            pView.leftBtnGroup.addEventListener(egret.TouchEvent.TOUCH_TAP, self.closeView, self);
            pView.rightBtnGroup.addEventListener(egret.TouchEvent.TOUCH_TAP, self.shareCircleOfFriends, self);
        }

        /**
         * 初始化显示内容
         */
        private initView():void {

            let vFreeDiamondView:FreeDiamondView = <FreeDiamondView>this.viewComponent;

            // 分享获得钻石配置
            let vSystemConfigPara:SystemConfigPara = LobbyHandler.getOneClientConfig(GameConfigConstant.CONF_SHARE_GAIN_DIAMOND);
            // 微信分享获得钻石次数
            let vWeChatShareGetDiamondCount:number = LobbyHandler.getWeChatShareGetDiamondCount();
            // 分情况处理
            if (vSystemConfigPara.pro_1 === 0) {
                vFreeDiamondView.reminderLabel.text = "目前没有分享奖励啦！";
            } else if (vWeChatShareGetDiamondCount > 0) {
                //每日首次分享到朋友圈可以获得20颗钻石
                //改变文字
                let vHtmlText:string = "每日首次分享到<font color='#a61717'>朋友圈</font>可以获得<font color='#a61717'>"+vSystemConfigPara.pro_3+"</font>颗钻石！";
                vFreeDiamondView.reminderLabel.textFlow = (new egret.HtmlTextParser).parser(vHtmlText);
            } else if (vWeChatShareGetDiamondCount <= 0) {
                //今日免费钻石 已领取 ，确定要的继续分享吗？
                //改变文字
                let vHtmlText:string = "今日免费钻石<font color='#a61717'>已领取</font>，确定要的继续分享吗？";
                vFreeDiamondView.reminderLabel.textFlow = (new egret.HtmlTextParser).parser(vHtmlText);
            }
        }

        /**
         * 感兴趣的通知指令
         * @returns {Array<any>}
         */
        public listNotificationInterests():Array<any> {
            return [
                CommonModule.COMMON_SHARE_TO_FRIENDS_SUCCESS,
                CommonModule.COMMON_SHARE_TO_CIRCLE_OF_FRIENDS_SUCCESS
            ];
        }

        /**
         * 处理通知
         * @param {puremvc.INotification} pNotification
         */
        public handleNotification(pNotification:puremvc.INotification):void{
            // let data:any = pNotification.getBody();
            switch(pNotification.getName()) {
                case CommonModule.COMMON_SHARE_TO_FRIENDS_SUCCESS:{
                    this.shareSuccess();
                    break;
                }
                case CommonModule.COMMON_SHARE_TO_CIRCLE_OF_FRIENDS_SUCCESS:{
                    this.shareSuccess();
                    break;
                }
            }
        }

        /**
         * 分享成功
         */
        private shareSuccess():void {
            // 关闭界面
            this.closeView();
        }

        /**
         * 分享到朋友圈
         */
        private shareCircleOfFriends():void {
            MvcUtil.send(CommonModule.COMMON_SHOW_SHARE_REMINDER_VIEW, ShareReminderTypeEnum.CIRCLE_OF_FRIENDS);
        }

        /**
         * 关闭界面
         */
        private closeView():void {
            MvcUtil.delView(this.viewComponent);
        }

    }
}