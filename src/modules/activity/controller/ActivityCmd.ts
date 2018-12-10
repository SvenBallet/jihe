module FL {


    export class ActivityCmd extends puremvc.SimpleCommand implements puremvc.ICommand {

        public constructor() {
            super();
        }

        public execute(notification:puremvc.INotification):void {
            let data:any = notification.getBody();
            switch(notification.getName()) {
                case ActivityModule.ACTIVITY_INTO_ACTIVITY:{
                    this.getAttentionAward(data);
                    break;
                }
                case ActivityModule.LOGIN_REWARD:{
                    this.getLoginAward(data);
                    break;
                }
                case ActivityModule.ATTENTION_REWARD:{
                    this.getAttentionAward(data);
                    break;
                }
                case ActivityModule.SHARE_REWARD:{
                    this.getShareAward(data);
                    break;
                }
                case ActivityModule.KAIFANG_REWARD:{
                    this.getKaifangAward(data);
                    break;
                }
                case ActivityModule.RECOMMEND_REWARD:{
                    this.getRecommendAward(data);
                    break;
                }
                case ActivityModule.ACTIVITY_OPEN_WX_PAGE:{
                    this.openWxPage();
                    break;
                }
            }
        }

        /**
         * 关注有礼
         */
        private getAttentionAward(msg:WXGongzhonghaoActivityMsgAck):void{
            ActivityAttentionAwardView.getInstance();
        }

        /**
         * 登录奖励
         */
        private getLoginAward(msg:ActivityShowMsgAck):void {
            ActivityLoginAwardView.getInstance().setData(msg);
        }

        /**
         * 开房奖励
         */
        private getKaifangAward(msg:ActivityShowMsgAck):void {
            ActivityKaifangAwardView.getInstance().setData(msg.vlist);
        }

        /**
         * 分享奖励
         */
        private getShareAward(msg:ActivityShowMsgAck):void {
            egret.log(msg);
            ActivityShareAwardView.getInstance().setData(msg);
        }

        /**
         * 推荐奖励
         */
        private getRecommendAward(msg:ActivityShowMsgAck):void {
            egret.log(msg);
            ActivityRecommendAwardView.getInstance().setData(msg);
        }

        private openWxPage():void{
            window.location.href = GConf.Conf.wxGongZhongHaoUrl;
        }

    }

}