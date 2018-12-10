module FL {

    export class ActivityRecommendAwardViewMediator extends puremvc.Mediator implements puremvc.IMediator {

        //注册到pureMvc中的名字，不能重复，否则会覆盖
        public static readonly NAME:string = "ActivityRecommendAwardViewMediator";

        public vItem:ActivityRecommendAwardView = this.viewComponent;

        constructor (pView:ActivityRecommendAwardView) {
            super(ActivityRecommendAwardViewMediator.NAME, pView);
            let self = this;
            if(pView.vRecomReward.pro_1 === 0){
                pView.copy.addEventListener(egret.TouchEvent.TOUCH_TAP,self.copyInviteCode,self);
                pView.confirm.addEventListener(egret.TouchEvent.TOUCH_TAP,self.inputInviteCode,self);
                pView.recommend.addEventListener(egret.TouchEvent.TOUCH_TAP,self.recommendFriend,self);
            }
        }

        private copyInviteCode(e:egret.Event):void{
            let str = "推荐邀请码：[" + this.viewComponent.inviteCode.text + "]【"+StringUtil.subStrSupportChinese(LobbyData.playerVO.playerName, 8)+"】邀请你来玩【"+GConf.Conf.gameName+"】";
            let tipStr = "(复制此消息打开游戏可直接填写邀请码)";
            str += tipStr;
            let jsonData = {
                "eventType": SendNativeMsgType.SEND_NATIVE_SET_CLIPBOARD,
                "data": {
                            "clipboardStr": str
                        }
                }
            NativeBridge.getInstance().sendNativeMessage(JSON.stringify(jsonData));

            MvcUtil.send(CommonModule.COMMON_NATIVE_OPEN_CHOOSE_ROAD);
        }

        private inputInviteCode(e:egret.Event):void{
            let activityId = ActivityBaseView.RECOMMEND_AWARD;
            let inviteCodeInput:string = this.vItem.inviteCodeInput.text.trim();
            if(inviteCodeInput === ""){
                PromptUtil.show("邀请码不能为空！", PromptType.ERROR);
                return;
            }
            // let params = {activityId:activityId,rewardId:parseInt(inviteCodeInput)};
            let vActivityGetRewardMsg:ActivityGetRewardMsg = new ActivityGetRewardMsg();
            vActivityGetRewardMsg.activityId = activityId;
            vActivityGetRewardMsg.rewardId = parseInt(inviteCodeInput);
            // ServerUtil.sendMsg(new ActivityGetRewardMsg(params),MsgCmdConstant.MSG_ACTIVITY_GET_REWARD_ACK);
            ServerUtil.sendMsg(vActivityGetRewardMsg, MsgCmdConstant.MSG_ACTIVITY_GET_REWARD_ACK);
        }

        private recommendFriend(e:egret.Event):void{
            if (!GConf.Conf.useWXAuth) {
                PromptUtil.show("请在微信中使用该功能！", PromptType.ALERT);
                return;
            }
            // 分享给好友
            let shareToFriendsTitle:string = "【"+StringUtil.subStrSupportChinese(LobbyData.playerVO.playerName, 8)+"】邀请你来玩【"+GConf.Conf.gameName+"】";
            let shareToFriendsDesc:string = "推荐邀请码："+this.viewComponent.inviteCode.text;
            if (Game.CommonUtil.isNative) {
                let shareData = new nativeShareData();
                shareData.type = ShareWXType.SHARE_URL;
                shareData.url = NativeBridge.mShareUrl;
                shareData.title = shareToFriendsTitle;
                shareData.desc = shareToFriendsDesc;
                shareData.extraType = InviteXLType.INVITE_REWARD_CODE;
                shareData.extraContent = this.viewComponent.inviteCode.text;
                NativeBridge.getInstance().mShareData = shareData;

                MvcUtil.send(CommonModule.COMMON_NATIVE_SHARE_CHOOSE_ROAD);
            }
            else {
                WeChatJsSdkHandler.setTempShareInfo(shareToFriendsTitle, shareToFriendsDesc, shareToFriendsTitle, ShareReminderTypeEnum.CIRCLE_OF_FRIENDS);
            }
        }

    }
}