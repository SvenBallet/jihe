module FL {

    export class ActivityProxy extends puremvc.Proxy {

        /** 代理名 */
        public static readonly NAME:string = "ActivityProxy";
        /** 单例 */
        private static _only:ActivityProxy;

        private constructor() {
            super(ActivityProxy.NAME);
        }

        public static getInstance():ActivityProxy {
            if (!this._only) {
                this._only = new ActivityProxy();
            }
            return this._only;
        }

        /**
         * 活动
         * @param {FL.ActivityShowMsgAck} msg
         */
        public exeActivityShowMsgAck(msg:ActivityShowMsgAck):void {
            egret.log(msg);
            if(msg.activityId == ActivityBaseView.LOGIN_AWARD){
                MvcUtil.send(ActivityModule.LOGIN_REWARD, msg);
            }else if(msg.activityId == ActivityBaseView.KAIFANG_AWARD){
                MvcUtil.send(ActivityModule.KAIFANG_REWARD, msg);
            }else if(msg.activityId == ActivityBaseView.SHARE_AWARD){
                MvcUtil.send(ActivityModule.SHARE_REWARD, msg);
            }else if(msg.activityId == ActivityBaseView.RECOMMEND_AWARD){
                MvcUtil.send(ActivityModule.RECOMMEND_REWARD, msg);
            }

        }

        /**
         * 处理领取登录奖励返回
         * @param {FL.ActivityGetRewardAckMsg} msg
         */
        public exeActivityGetRewardAckMsg(msg:ActivityGetRewardAckMsg):void {
            // egret.log(msg);
            let resCode:number = msg.result;
            if (resCode === 0) {
                let activityId:number = msg.activityId;
                if (activityId === ActivityBaseView.LOGIN_AWARD || activityId === ActivityBaseView.KAIFANG_AWARD) {
                    PromptUtil.show("领取成功！",PromptType.SUCCESS);
                    // if (activityId === ActivityBaseView.KAIFANG_AWARD) {
                    //
                    // } else {
                        ServerUtil.sendMsg(new ActivityShowMsg(activityId), MsgCmdConstant.MSG_ACTIVITY_SHOW_ACK);
                    // }
                } else {
                    PromptUtil.show("操作成功！",PromptType.SUCCESS);
                }
            }else{
                PromptUtil.show("操作失败！",PromptType.ERROR);
            }
        }

        /**
         * 处理返回
         * @param {FL.WXGongzhonghaoActivityMsgAck} msg
         */
        public exeWXGongzhonghaoActivityMsgAck(msg:WXGongzhonghaoActivityMsgAck):void {
            MvcUtil.send(ActivityModule.ATTENTION_REWARD, msg);
        }

    }
}