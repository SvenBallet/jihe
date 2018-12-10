module FL {
    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase - ShareViewMediator
     * @Description:  //调停者
     * @Create: DerekWu on 2017/11/21 10:44
     * @Version: V1.0
     */
    export class ShareViewMediator extends puremvc.Mediator implements puremvc.IMediator {

        public static readonly NAME:string = "ShareViewMediator";

        constructor (pView:ShareView) {
            super(ShareViewMediator.NAME, pView);
            let self = this;
            // 初始化显示内容
            self.initView();
            // 关闭事件
            pView.closeGroup.addEventListener(egret.TouchEvent.TOUCH_TAP, self.closeView, self);
            // 注册分享点击事件
            pView.shareFriendsBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, self.shareFriends, self);
            pView.shareCircleOfFriendsBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, self.shareCircleOfFriends, self);
            pView.shareXlBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, self.shareXLFriends, self);
            
            Game.CommonUtil.addTapGap(pView.shareFriendsBtn, 3500);
            Game.CommonUtil.addTapGap(pView.shareCircleOfFriendsBtn, 3500);
            Game.CommonUtil.addTapGap(pView.shareXlBtn, 3500);
        }

        /**
         * 初始化显示内容
         */
        private initView():void {
            let self = this;
            let vShareView:ShareView = <ShareView>this.viewComponent;

            // 选择跳转
            if (vShareView.openFlag == SHARE_CHOOSE_TYPE.SHARE_CHOOSE_OPEN) {
                vShareView.shareGro.visible = false;
                vShareView.openGro.visible = true;
                vShareView.shareGroTH.visible = false;
                vShareView.reminderLabel.text = "跳转到【微信】或【闲聊】";
                vShareView.openFriend.addEventListener(egret.TouchEvent.TOUCH_TAP, self.openWX, self);
                vShareView.openXLBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, self.openXL, self)
                return;
            }
            else if (vShareView.openFlag == SHARE_CHOOSE_TYPE.SHARE_CHOOSE_NO_FRIEND) {
                vShareView.shareGro.visible = false;
                vShareView.openGro.visible = true;
                vShareView.shareGroTH.visible = false;
                vShareView.reminderLabel.text = "分享到【微信】或【闲聊】";
                vShareView.openFriend.addEventListener(egret.TouchEvent.TOUCH_TAP, self.shareFriends, self);
                vShareView.openXLBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, self.shareXLFriends, self)
                return;
            }
            else if (vShareView.openFlag == SHARE_CHOOSE_TYPE.SHARE_TEAHOUSE_INVITE) {
                vShareView.shareGro.visible = false;
                vShareView.openGro.visible = false;
                vShareView.shareGroTH.visible = true;
                vShareView.reminderLabel.text = "分享到【微信】【闲聊】。茶楼邀请";
                vShareView.shareFriendsBtnTH.addEventListener(egret.TouchEvent.TOUCH_TAP, self.shareFriends, self);
                vShareView.shareXlBtnTH.addEventListener(egret.TouchEvent.TOUCH_TAP, self.shareXLFriends, self);
                vShareView.teahouseBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, self.inviteTeahouse, self);
                return;
            }
            else {
                vShareView.shareGro.visible = true;
                vShareView.openGro.visible = false;
                vShareView.shareGroTH.visible = false;
            }

            // 分享获得钻石配置
            let vSystemConfigPara:SystemConfigPara = LobbyHandler.getOneClientConfig(GameConfigConstant.CONF_SHARE_GAIN_DIAMOND);
            // 微信分享获得钻石次数
            let vWeChatShareGetDiamondCount:number = LobbyHandler.getWeChatShareGetDiamondCount();
            //判断是否有奖励,且分享的是链接
            if (vSystemConfigPara.pro_1 > 0 && vWeChatShareGetDiamondCount > 0 && NativeBridge.getInstance().mShareData.url) {
                //改变文字
                let vHtmlText:string = "分享到<font color='#a61717'>朋友圈</font>送钻石<font color='#a61717'>"+vSystemConfigPara.pro_3+"</font>颗，每天"+vSystemConfigPara.pro_2+"次";
                vShareView.reminderLabel.textFlow = (new egret.HtmlTextParser).parser(vHtmlText);
                vShareView.awardIcon.visible = true;
            } else {
                //没有奖励，删除奖励ICON 和 文字
                vShareView.awardIcon.visible = false;
                //改变文字 ， 下面是默认文字
                vShareView.reminderLabel.text = "分享到【微信】【朋友圈】或【闲聊】";
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
         * 分享给好友
         */
        private shareFriends():void {
            NativeBridge.getInstance().mShareData.platform = SharePlatform.SHARE_WX;
            NativeBridge.getInstance().mShareData.road = ShareWXRoad.SHARE_SESSION + "";
            NativeBridge.getInstance().mShareData.origionAppID = ShareAppIDManager.shareAppID;
            this.shareNative();
        }

        /**
         * 分享到朋友圈
         */
        private shareCircleOfFriends():void {
            let vShareView:ShareView = <ShareView>this.viewComponent;
            if (vShareView.openFlag == SHARE_CHOOSE_TYPE.SHARE_LOBBY_IMG) {
                // 大厅分享朋友圈时是分享图片
                NativeBridge.getInstance().mShareData.type = ShareWXType.SHARE_IMG;
                let rt: egret.RenderTexture = new egret.RenderTexture;
                rt.drawToTexture(ShareView.shareCon);
                let base64Data = rt.toDataURL("image/jpeg");
                NativeBridge.getInstance().mShareData.baseStr = base64Data;
            }
            NativeBridge.getInstance().mShareData.platform = SharePlatform.SHARE_WX;
            NativeBridge.getInstance().mShareData.road = ShareWXRoad.SHARE_TIMELINE + "";
            NativeBridge.getInstance().mShareData.origionAppID = ShareAppIDManager.shareAppID;
            this.shareNative();
        }

        /**
         * 分享到闲聊
         */
        private shareXLFriends() {
            if (!NativeBridge.getInstance().mXLFlag) {
                PromptUtil.show("未检测到闲聊，请使用其他分享方式", PromptType.ALERT);
                return;
            }

            // 链接只能是下载链接
            if (NativeBridge.getInstance().mShareData.url) {
                NativeBridge.getInstance().mShareData.url = NativeBridge.mShareUrl;
            }
            NativeBridge.getInstance().mShareData.platform = SharePlatform.SHARE_XL;
            NativeBridge.getInstance().mShareData.road = ShareWXRoad.SHARE_SESSION + "";
            this.shareNative();
        }

        /**分享 */
        private shareNative() {
            MvcUtil.send(CommonModule.COMMON_NATIVE_SHARE);
        }

        /**
         * 跳转到微信
         */
        private openWX() {
            let openData = {
                "eventType": SendNativeMsgType.SEND_NATIVE_OPEN_ELSE_APP,
                "data": {
                    "packName": NativeBridge.packageName
                }
            }
            NativeBridge.getInstance().sendNativeMessage(JSON.stringify(openData));
        }

        /**
         * 跳转到闲聊
         */
        private openXL() {
            if (!NativeBridge.getInstance().mXLFlag) {
                PromptUtil.show("未检测到闲聊，请跳转到其他应用", PromptType.ALERT);
                return;
            }

            let openData = {
                "eventType": SendNativeMsgType.SEND_NATIVE_OPEN_ELSE_APP,
                "data": {
                    "packName": NativeBridge.xlPackageName
                }
            }
            NativeBridge.getInstance().sendNativeMessage(JSON.stringify(openData));
        }

        /**
         * 关闭界面
         */
        private closeView():void {
            MvcUtil.delView(this.viewComponent);
        }

        /** 茶楼邀请 */
        private inviteTeahouse() {
            let sendMsg: InviteToJoinMemberListMsg = new InviteToJoinMemberListMsg();
            let teahouseId = (<NewIntoGameTableMsgAck>GameConstant.CURRENT_HANDLE.getRequestStartGameMsgAck()).teaHouseId;
            if (!teahouseId) return;
            sendMsg.teaHouseId = teahouseId;
            ServerUtil.sendMsg(sendMsg, MsgCmdConstant.MSG_INVITE_TO_JOIN_GAME_MEMBER_LIST_ACK);
        }
    }
}