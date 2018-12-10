module FL {

    /**
     * 公共模块Cmd
     * @Name:  FL - CommonCmd
     * @Company 深圳市天天爱科技有限公司 版权所有
     * @Description:  无详细描述
     * @Create: DerekWu on 2017/8/13 9:11
     * @Version: V1.0
     */
    export class CommonCmd extends puremvc.SimpleCommand implements puremvc.ICommand {

        /** socket 是否初始化完成 */
        // private static _socketIsComplete:boolean;

        /** 登录信息 */
        private static _loginInfo: LoginInfo;

        public constructor() {
            super();
        }

        public execute(notification: puremvc.INotification): void {
            let data: any = notification.getBody();
            switch (notification.getName()) {
                case CommonModule.COMMON_INIT_LOGIN_INFO: {
                    //设置登录信息
                    CommonCmd._loginInfo = data[0];
                    // this.startLogin(data[1]);
                    break;
                }
                case AppModule.APP_SOCKET_INIT_COMPLETE: {
                    //socket 初始化完成
                    // CommonCmd._socketIsComplete = true;
                    this.sendLinkValidationMsg();
                    break;
                }
                case AppModule.APP_SOCKET_CLOSED: {
                    this.exeSocketClosed(data);
                    break;
                }
                case AppModule.APP_SOCKET_ERROR: {
                    this.exeSocketError();
                    break;
                }
                case AppModule.APP_INTO_BACKSTAGE: {
                    this.intoBackstage();
                    break;
                }
                case AppModule.APP_BACK_FROM_BACKSTAGE: {
                    this.backFromBackstage();
                    break;
                }
                case CommonModule.COMMON_SHOW_PROMPT: {
                    //显示提示信息
                    this.showPrompt(data);
                    break;
                }
                case CommonModule.COMMON_ERROR_ASYNC: {
                    //发生异步异常
                    //TODO 。。。。
                    egret.error("COMMON_ERROR_ASYNC");
                    break;
                }
                case CommonModule.COMMON_SHOW_SHARE_REMINDER_VIEW: {
                    //显示分享提示界面
                    ShareReminderView.getInstance().showView(data);
                    break;
                }
                case CommonModule.COMMON_CLOSE_SHARE_REMINDER_VIEW: {
                    //关闭分享提示界面
                    ShareReminderView.getInstance().closeView();
                    break;
                }
                case CommonModule.COMMON_SHARE_TO_CIRCLE_OF_FRIENDS_SUCCESS: {
                    // 分享朋友圈成功,如果是链接，则获取钻石奖励
                    if (data) {
                        this.shareToCircleOfFriendsSuccess();
                    }
                    break;
                }
                case CommonModule.COMMON_WE_CHAT_START_RECORD: {
                    this.weChatRecordStart(data);
                    break;
                }
                case CommonModule.COMMON_NATIVE_SHARE: {
                    if (!Game.CommonUtil.isNative) return;
                    let shareData = NativeBridge.getInstance().mShareData;
                    let jsonData = {
                        "eventType": SendNativeMsgType.SEND_NATIVE_SHARE_TO_WX,
                        "data": shareData
                    }
                    NativeBridge.getInstance().sendNativeMessage(JSON.stringify(jsonData));
                    break;
                }
                case CommonModule.COMMON_NATIVE_SHARE_CHOOSE_ROAD: {
                    // if (!Game.CommonUtil.isNative) return;
                    let param = 0;
                    if (data) {
                        param = data;
                    }
                    // 打开分享选择界面
                    let vShareView: ShareView = new ShareView(param);
                    MvcUtil.addView(vShareView);
                    break;
                }
                case CommonModule.COMMON_NATIVE_OPEN_CHOOSE_ROAD: {
                    if (!Game.CommonUtil.isNative) return;
                    // 打开跳转选择界面
                    let vShareView: ShareView = new ShareView(SHARE_CHOOSE_TYPE.SHARE_CHOOSE_OPEN);
                    MvcUtil.addView(vShareView);
                    break;
                }
                case CommonModule.COMMON_NATIVE_PARSE_CLIPBOARD: {
                    this.parseClipBoardContent(data);
                    break;
                }
                case CommonModule.COMMON_NATIVE_PARSE_MV_PARAM: {
                    this.parseMWContent(data);
                    break;
                }
                case CommonModule.COMMON_NATIVE_ONTOUCH_BACK: {
                    this.onTouchBack();
                    break;
                }
                case CommonModule.COMMON_NATIVE_INIT_DATA: {
                    this.nativeLoginviewCreated();
                    break;
                }
                case CommonModule.COMMON_CHANGE_GPS: {
                    this.refreshGps();
                    break;
                }
                case CommonModule.COMMON_DISS_BACK_TEAHOUSE_OR_LOBBY: {
                    this.intoTeahouseOrBackLobby();
                    break;
                }
                case CommonModule.COMMON_XL_INVITE: {
                    this.revXLInvite(data);
                    break;
                }
                case CommonModule.COMMON_WX_MINI_PARAM: {
                    this.revWXMiniParam(data);
                    break;
                }
            }
        }

        /**
         * 发送链接验证消息
         */
        private sendLinkValidationMsg(): void {
            // 移除loading
            // ReqLoadingViewUtil.delReqLoadingView();
            // 链接上了直接移除
            if (CommonCmd.netCloseReminderView && CommonCmd.netCloseReminderView.parent) {
                MvcUtil.delView(CommonCmd.netCloseransparentMask);
                MvcUtil.delView(CommonCmd.netCloseReminderView);
            }
            let vLinkValidationMsg: LinkValidationMsg = new LinkValidationMsg();
            ServerUtil.sendMsg(vLinkValidationMsg);
        }

        /** 网络关闭的提示信息 */
        private static netCloseReminderView:ReminderView;
        /** 半透明遮罩，用于网络断开提示框下面 */
        private static netCloseransparentMask: eui.Rect;

        /**
         * 处理socket关闭
         * @param {boolean} isAutoClose 是否自动关闭
         */
        private exeSocketClosed(isAutoClose: boolean): void {
            // egret.log("isAutoClose="+isAutoClose);
            if (!isAutoClose) {
                return; // 不是自动关闭不处理
            }

            if (ServerUtil.hasConnect()) {
                return;
            }

            // 遮罩
            // CommonHandler.delNetConnectMask();
            // 移除loading
            ReqLoadingViewUtil.delReqLoadingView();

            // 弹出一个框
            /**
             *      {
                 *      hasLeftBtn:boolean,   是否有左边按钮
                 *      leftCallBack:MyCallBack,   左边按钮回调
                 *      hasRightBtn:boolean,  是否有右边按钮
                 *      rightCallBack:MyCallBack,  右边按钮回调
                 *      titleImgSrc:string,  title美术资源
                 *      leftBtnSrc:string,    左边按钮美术资源
                 *      leftBtnText:string,    左边按钮显示文字
                 *      rightBtnSrc:string,   右边按钮美术资源
                 *      rightBtnText:string,  右边按钮显示文字
                 *      text:string,   提示文本
                 *      textFlow:string  提示富文本
                 *    }
             */

            if (!CommonCmd.netCloseReminderView) {
                let params: any = {
                    hasLeftBtn: true,
                    leftBtnText:"确定",
                    leftCallBack: new MyCallBack(this.connectAgain, this),
                    hasRightBtn: false,
                    text: "网络异常，请确认网络正常后再重新连接！"
                };
                // ReminderViewUtil.showReminderView(params, ViewLayerEnum.POPUP_ONLY);
                let vOneReminderView:ReminderView = new ReminderView(params.hasLeftBtn, params.leftCallBack, params.hasRightBtn, params.rightCallBack);
                vOneReminderView.setViewFeature(params.titleImgSrc, params.leftBtnSrc, params.leftBtnText, params.rightBtnSrc, params.rightBtnText);
                vOneReminderView.setViewLayer(ViewLayerEnum.TOOLTIP_TOP);
                vOneReminderView.setReminderText(params.text);
                CommonCmd.netCloseReminderView = vOneReminderView;

                // 透明遮罩
                let vTransparentMask: eui.Rect = new eui.Rect();
                vTransparentMask.fillColor = 0x000000;
                vTransparentMask.fillAlpha = 0.5;
                vTransparentMask.left = vTransparentMask.right = vTransparentMask.top = vTransparentMask.bottom = 0;
                vTransparentMask.touchEnabled = true;
                vTransparentMask[ViewEnum.viewLayer] = ViewLayerEnum.TOOLTIP_TOP;
                CommonCmd.netCloseransparentMask = vTransparentMask;
            }

            // egret.log("isIntoBack = " + GlobalData.isIntoBack);

            if (GlobalData.isIntoBack || GlobalData.isStartBackFromBackDelayed) {
                // 进入后台时断网不弹窗
                if (CommonCmd.netCloseReminderView.parent) {
                    MvcUtil.delView(CommonCmd.netCloseransparentMask);
                    MvcUtil.delView(CommonCmd.netCloseReminderView);
                }
            } else {
                // 只能有一个这个窗口
                if (!CommonCmd.netCloseReminderView.parent) {
                    MvcUtil.addView(CommonCmd.netCloseransparentMask);
                    MvcUtil.addView(CommonCmd.netCloseReminderView);
                }
            }
        }

        private connectAgain(): void {

            CommonData.lastHeartBeatingStartTimes = 0;
            CommonData.lastHeartBeatingEndTimes = 0;

            MvcUtil.delView(CommonCmd.netCloseransparentMask);
            // MvcUtil.delView(CommonCmd.netCloseReminderView);  // 这个会点确定后会自动移除

            // 马上连接。。。
            ServerUtil.connectAtOnceWhenNotConnect();
            // 添加loading
            ReqLoadingViewUtil.delReqLoadingView(); // 先删除
            let vReqLoadingView: ReqLoadingView = ReqLoadingView.getInstance();
            vReqLoadingView.genNewViewId();
            vReqLoadingView.resetLaterTimesAndText(0, "");
            MvcUtil.addView(vReqLoadingView);
        }
        // netConnectMask: eui.Group
        /**
         * 处理socket出现异常
         */
        private exeSocketError(): void {

        }

        /**
         * 进入后台
         */
        private intoBackstage(): void {
            SoundManager.stopSound();
            GlobalData.isIntoBack = true;
            GlobalData.intoBackTimes = Date.now();

            // 进入后台
            let intoBackstageMsg: NewPlayerClientIntoBackstageMsg = new NewPlayerClientIntoBackstageMsg();
            ServerUtil.sendMsg(intoBackstageMsg);
            if (this.isInGame()) {
                // 给服务器发送暂时离开消息
                let msg = new NewPlayerLeaveRoomMsg();
                ServerUtil.sendMsg(msg);
            }

            // 切换到后台删除网络等弹窗
            // 移除loading
            ReqLoadingViewUtil.delReqLoadingView();
            // 直接移除
            if (CommonCmd.netCloseReminderView && CommonCmd.netCloseReminderView.parent) {
                MvcUtil.delView(CommonCmd.netCloseransparentMask);
                MvcUtil.delView(CommonCmd.netCloseReminderView);
            }

        }

        /**
         * 是否可以接收服务端的消息
         * @returns {boolean}
         */
        private isInGame(): boolean {
            return !MahjongHandler.isReplay() && GameConstant.CURRENT_HANDLE.getGameState() !== EGameState.NULL;
        }

        /**
         * 从后台回来
         */
        private backFromBackstage(): void {
            SoundManager.enableSound();

            CommonData.lastHeartBeatingStartTimes = 0;
            CommonData.lastHeartBeatingEndTimes = 0;
            CommonData.lastReceivedServerInitiatedHeartbeatTimes = new Date().getTime();

            egret.log("# backFromBackstage");

            // // 从后台回来
            // let intoBackstageMsg: NewPlayerClientIntoBackstageMsg = new NewPlayerClientIntoBackstageMsg();
            // intoBackstageMsg.isBackstage = false;
            // ServerUtil.sendMsg(intoBackstageMsg);
            // if (this.isInGame()) {
            //     // 给服务器发送回到游戏消息
            //     let msg = new NewPlayerLeaveRoomMsg();
            //     msg.leaveFlag = 3;
            //     ServerUtil.sendMsg(msg);
            // }
            // ServerUtil.connectAtOnceWhenNotConnect();
            // if (GlobalData.isGameIntoBack) {
                // 断线重连一下游戏中显示上线
                //发送请求进入VIP老房间指令
                // let vRequestStartGameMsg:RequestStartGameMsg = new RequestStartGameMsg();
                // vRequestStartGameMsg.roomID = MJRoomID.VIPROOM;
                // ServerUtil.sendMsg(vRequestStartGameMsg);
                // let vNewIntoOldGameTableMsg: NewIntoOldGameTableMsg = new NewIntoOldGameTableMsg();
                // ServerUtil.sendMsg(vNewIntoOldGameTableMsg);

            // }
            GlobalData.isIntoBack = false;
            GlobalData.backFromBackTimes = Date.now();
            // GlobalData.isGameIntoBack = false;

            // 延时10毫秒后链接
            GlobalData.isStartBackFromBackDelayed = true;
            egret.log("isStartBackFromBackDelayed = " + GlobalData.isStartBackFromBackDelayed);

            // let timer: Game.Timer = new Game.Timer(200);
            // timer.once(egret.TimerEvent.TIMER, ()=>{
            //     this.delayedConnectAtOnceWhenNotConnect();
            //     timer.stop();
            // }, this);
            // timer.start();
            this.delayedConnectAtOnceWhenNotConnect();

            // 获取剪贴板内容
            let jsonData = {
                "eventType": SendNativeMsgType.SEND_NATIVE_GET_CLIPBOARD,
                "data": {
                }
            }
            NativeBridge.getInstance().sendNativeMessage(JSON.stringify(jsonData));

            // 获魔窗内容
            FL.MyCallBackUtil.delayedCallBack(500, () => {
                // 获魔窗内容
                let jsonDataMW = {
                    "eventType": SendNativeMsgType.SEND_NATIVE_GET_MW_PARAM,
                    "data": {
                    }
                }
                NativeBridge.getInstance().sendNativeMessage(JSON.stringify(jsonDataMW));
            }, this);
        } 

        private delayedConnectAtOnceWhenNotConnect(): void {

            // 从后台回来
            let intoBackstageMsg: NewPlayerClientIntoBackstageMsg = new NewPlayerClientIntoBackstageMsg();
            intoBackstageMsg.isBackstage = false;
            ServerUtil.sendMsg(intoBackstageMsg);
            if (this.isInGame()) {
                // 给服务器发送回到游戏消息
                let msg = new NewPlayerLeaveRoomMsg();
                msg.leaveFlag = 3;
                ServerUtil.sendMsg(msg);
            }

            // 马上连接。。。
            ServerUtil.connectAtOnceWhenNotConnect();
            GlobalData.isStartBackFromBackDelayed = false;
        }

        /**
         * 开始登录
         */
        // private startLogin(pCallBack?:MyCallBack):void{
        //     // Log.debug(CommonCmd._loginInfo);
        //     // Log.debug(CommonCmd._socketIsComplete);
        //     if (CommonCmd._loginInfo && CommonCmd._socketIsComplete) {
        //         //登录
        //         //Log.debug(" -- startLogin -- ");
        //         let vLoginInfo:LoginInfo = CommonCmd._loginInfo;
        //         // ServerUtil.sendMsg(PlayerSCmd.CMD0050, vLoginInfo, pCallBack);
        //     }
        // }


        /** 提示信息列表 */
        private static readonly _promptList: Array<eui.Label> = new Array<eui.Label>();

        /**
         * 显示提示信息 
         */
        private showPrompt(pLabel: eui.Label): void {
            let vPromptList: Array<eui.Label> = CommonCmd._promptList;
            vPromptList.push(pLabel);
            MvcUtil.addView(pLabel);
            //缓动后移除
            let move: Game.Tween = Game.Tween.get(pLabel);
            move.to({ scaleX: 1.1, scaleY: 1.1 }, 150, Game.Ease.quadIn).to({ scaleX: 1, scaleY: 1 }, 150, Game.Ease.quadOut).wait(1000).to({ alpha: 0 }, 500).call(function () {
                MvcUtil.delView(pLabel);
                vPromptList.splice(0, 1);
            }, this);
            //除了刚添加的，其他的网上移动刚添加的高度+10
            let vIndex = 0, vLength = vPromptList.length - 1, vCurrHeight: number = pLabel.height, vOneLabel: eui.Label;
            for (; vIndex < vLength; ++vIndex) {
                vOneLabel = vPromptList[vIndex];
                if (vOneLabel["moveUpTween"]) {
                    Game.Tween.removeOneTween(vOneLabel["moveUpTween"]);
                }
                //Log.debug("vOneLabel.y=%d",vOneLabel.y);
                let moveUp: Game.Tween = Game.Tween.get(vOneLabel, { loop: false });
                moveUp.to({ y: pLabel.y - (vCurrHeight + 10) * (vLength - vIndex)}, 150, Game.Ease.quadIn);
                vOneLabel["moveUpTween"] = moveUp;
            }
        }

        /**
         * 分享到朋友圈成功
         */
        private shareToCircleOfFriendsSuccess(): void {
            // 分享获得钻石配置
            let vSystemConfigPara: SystemConfigPara = LobbyHandler.getOneClientConfig(GameConfigConstant.CONF_SHARE_GAIN_DIAMOND);
            // 微信分享获得钻石次数
            let vWeChatShareGetDiamondCount: number = LobbyHandler.getWeChatShareGetDiamondCount();
            // 有活动并且今天没有领奖
            if (vSystemConfigPara.pro_1 > 0 && vWeChatShareGetDiamondCount > 0) {
                // 发送分享微信成功指令
                let vGameBuyItemMsg: GameBuyItemMsg = new GameBuyItemMsg({ itemID: GameConstant.SEND_PLAYER_CMD_SHARE_TO_WX });
                ServerUtil.sendMsg(vGameBuyItemMsg);
            }
        }

        /**
         * 微信录音开始
         * @param {number} startActionId
         */
        private weChatRecordStart(startActionId: number): void {
            MvcUtil.addView(new RecordTipView(startActionId));
        }

        /**
         * 处理微信小程序参数
         */
        private revWXMiniParam(content: any) {
            if (content.miniStr.length < 6) {
                console.warn("WXPARAM NULL");
                return;
            }

            let paramArr: Array<string> = content.miniStr.split("&");
            if (paramArr.length < 1) {
                console.warn("WXPARAM NULL");
                return;
            }

            let contentStr: string = "";
            let sureCallback: Function;
            let inviteType: InviteXLType = InviteXLType.INVITE_ROOM;
            let inviteId: number = 123456;
            
            for (let i = 0;i < paramArr.length;i ++) {
                let itemArr: Array<string> = paramArr[i].split("=");
                if (itemArr[0] && itemArr[1]) {
                    if (itemArr[0] == "roomId") {
                        inviteType = InviteXLType.INVITE_ROOM;
                        inviteId = Number(itemArr[1]);
                        break;
                    }
                }
            }

            if (!inviteId || inviteId == Number(NativeBridge.wxMiniId)) return;

            let cancleCallback: Function = () => {
                NativeBridge.wxMiniId = inviteId + "";
            };
            if (inviteType == InviteXLType.INVITE_ROOM) {
                let nowRoomId = GameConstant.CURRENT_HANDLE.getVipRoomId();
                if (nowRoomId && nowRoomId == inviteId) {
                    return;
                }

                contentStr = "确认加入房间：" + inviteId + "?";
                sureCallback = () => {
                    //发送进入VIP房间指令
                    let vNewJoinVipRoomMsg:NewJoinVipRoomMsg = new NewJoinVipRoomMsg();
                    vNewJoinVipRoomMsg.vipRoomID = inviteId;
                    ServerUtil.sendMsg(vNewJoinVipRoomMsg, MsgCmdConstant.MSG_INTO_GAME_TABLE);
                };
            }
            else if (inviteType == InviteXLType.INVITE_TEAHOUSE) {
                contentStr = "确认进入茶楼：" + inviteId + "?";
                sureCallback = () => {
                    TeaHouseMsgHandle.sendAccessTeaHouseMsg(inviteId);
                };
            }
            else if (inviteType == InviteXLType.INVITE_CODE) {
                contentStr = "确认填写邀请码：" + inviteId + "?";
                sureCallback = () => {
                    let params = { opType: 0, inviteCode: inviteId };
                    MvcUtil.send(AgentModule.AGENT_SEND_BIND_CODE, params);
                };
            }
            else if (inviteType == InviteXLType.INVITE_REWARD_CODE) {
                contentStr = "确认填写邀请码：" + inviteId + "?";
                sureCallback = () => {
                    let vActivityGetRewardMsg: ActivityGetRewardMsg = new ActivityGetRewardMsg();
                    vActivityGetRewardMsg.activityId = ActivityBaseView.RECOMMEND_AWARD;
                    vActivityGetRewardMsg.rewardId = inviteId;
                    ServerUtil.sendMsg(vActivityGetRewardMsg, MsgCmdConstant.MSG_ACTIVITY_GET_REWARD_ACK);
                };
            }

            let params = {
                hasLeftBtn: true,
                leftCallBack: () => {
                    sureCallback();
                    cancleCallback();
                },
                hasRightBtn: true,
                rightCallBack: cancleCallback,
                text: contentStr
            }
            ReminderViewUtil.showReminderView(params);
        }

        /**
         * 处理闲聊邀请
         */
        private revXLInvite(content: any) {
            if (content.inviteId.length < 6) {
                console.warn("XLINVITE NULL");
                return;
            }

            let contentStr: string = "";
            let sureCallback: Function;
            let inviteType: InviteXLType = Number(content.inviteType);
            let inviteId: number = Number(content.inviteId);

            if (inviteType == InviteXLType.INVITE_ROOM) {
                contentStr = "确认加入房间：" + inviteId + "?";
                sureCallback = () => {
                    //发送进入VIP房间指令
                    let vNewJoinVipRoomMsg:NewJoinVipRoomMsg = new NewJoinVipRoomMsg();
                    vNewJoinVipRoomMsg.vipRoomID = inviteId;
                    ServerUtil.sendMsg(vNewJoinVipRoomMsg, MsgCmdConstant.MSG_INTO_GAME_TABLE);
                };
            }
            else if (inviteType == InviteXLType.INVITE_TEAHOUSE) {
                contentStr = "确认进入茶楼：" + inviteId + "?";
                sureCallback = () => {
                    TeaHouseMsgHandle.sendAccessTeaHouseMsg(inviteId);
                };
            }
            else if (inviteType == InviteXLType.INVITE_CODE) {
                contentStr = "确认填写邀请码：" + inviteId + "?";
                sureCallback = () => {
                    let params = { opType: 0, inviteCode: inviteId };
                    MvcUtil.send(AgentModule.AGENT_SEND_BIND_CODE, params);
                };
            }
            else if (inviteType == InviteXLType.INVITE_REWARD_CODE) {
                contentStr = "确认填写邀请码：" + inviteId + "?";
                sureCallback = () => {
                    let vActivityGetRewardMsg: ActivityGetRewardMsg = new ActivityGetRewardMsg();
                    vActivityGetRewardMsg.activityId = ActivityBaseView.RECOMMEND_AWARD;
                    vActivityGetRewardMsg.rewardId = inviteId;
                    ServerUtil.sendMsg(vActivityGetRewardMsg, MsgCmdConstant.MSG_ACTIVITY_GET_REWARD_ACK);
                };
            }

            let params = {
                hasLeftBtn: true,
                leftCallBack: () => {
                    sureCallback();
                },
                hasRightBtn: true,
                text: contentStr
            }
            ReminderViewUtil.showReminderView(params);
        }

        /**
         * 解析剪贴板内容
         */
        private parseClipBoardContent(content: string) {
            if (!content) return;

            /**类型为中文冒号前字符串 */
            let contentName: string = content.split("：")[0];
            /**号码为第一个英文中括号括住的内容 */
            let contentID: number = Number(content.split("[")[1].split("]")[0]);
            if ((!contentID) || contentID < 1) return;
            let contentStr: string = "";
            let sureCallback: Function;
            let cancleCallback: Function = () => {
                // 取消则清空剪贴板
                let jsonData = {
                    "eventType": SendNativeMsgType.SEND_NATIVE_SET_CLIPBOARD,
                    "data": {
                        "clipboardStr": ""
                    }
                }
                NativeBridge.getInstance().sendNativeMessage(JSON.stringify(jsonData));
            };
            switch (contentName) {
                case ClipboardContentStr.ROOM_ID:
                    // 已经进入当前房间
                    let nowRoomId = GameConstant.CURRENT_HANDLE.getVipRoomId();
                    if (nowRoomId && nowRoomId == (contentID + "")) {
                        cancleCallback();
                        return;
                    }

                    contentStr = "确认加入房间：" + contentID + "?";
                    sureCallback = () => {
                        //发送进入VIP房间指令
                        let vNewJoinVipRoomMsg:NewJoinVipRoomMsg = new NewJoinVipRoomMsg();
                        vNewJoinVipRoomMsg.vipRoomID = contentID;
                        ServerUtil.sendMsg(vNewJoinVipRoomMsg, MsgCmdConstant.MSG_INTO_GAME_TABLE);
                    };
                    break;
                case ClipboardContentStr.CLUB_ID:
                    if(ClubData.vClub.id == contentID) {
                        cancleCallback();
                        return;
                    }

                    contentStr = "确认加入俱乐部：" + contentID + "?";
                    sureCallback = () => {
                        let vApplyClubMsg: ApplyClubMsg = new ApplyClubMsg();
                        vApplyClubMsg.clubId = contentID;
                        ServerUtil.sendMsg(vApplyClubMsg, MsgCmdConstant.MSG_APPLY_CLUB_ACK);
                    };
                    break;
                case ClipboardContentStr.CDKEY_BACK:
                    if (LobbyData.playerVO.inviteCode == contentID) {
                        cancleCallback();
                        return;
                    }

                    contentStr = "确认填写邀请码：" + contentID + "?";
                    sureCallback = () => {
                        let params = { opType: 0, inviteCode: contentID };
                        MvcUtil.send(AgentModule.AGENT_SEND_BIND_CODE, params);
                    };
                    break;
                case ClipboardContentStr.CDKEY_RECOMMEND:
                    if (NativeBridge.mInvitecode && NativeBridge.mInvitecode == contentID + "") {
                        cancleCallback();
                        return;
                    }

                    contentStr = "确认填写邀请码：" + contentID + "?";
                    sureCallback = () => {
                        let vActivityGetRewardMsg: ActivityGetRewardMsg = new ActivityGetRewardMsg();
                        vActivityGetRewardMsg.activityId = ActivityBaseView.RECOMMEND_AWARD;
                        vActivityGetRewardMsg.rewardId = contentID;
                        ServerUtil.sendMsg(vActivityGetRewardMsg, MsgCmdConstant.MSG_ACTIVITY_GET_REWARD_ACK);
                    };
                    break;
                default:
                    return;
            }

            let params = {
                hasLeftBtn: true,
                leftCallBack: () => {
                    sureCallback();
                    cancleCallback();
                },
                hasRightBtn: true,
                rightCallBack: cancleCallback,
                text: contentStr
            }
            ReminderViewUtil.showReminderView(params);
        }

        /**解析魔窗内容 */
        private parseMWContent(content: string) {
            console.log("MW content=", content);
            console.log("MW mwRoomId=", NativeBridge.mwRoomId);
            if (!content || content == NativeBridge.mwRoomId) return;

            let contentStr: string = "";
            let sureCallback: Function;
            let cancleCallback: Function = () => {
                NativeBridge.mwRoomId = content;
            };

            // 已经进入当前房间
            let nowRoomId = GameConstant.CURRENT_HANDLE.getVipRoomId();
            console.log("MW nowRoomId=", nowRoomId);
            if (nowRoomId && nowRoomId == content) {
                return;
            }

            contentStr = "确认加入房间：" + content + "?";
            sureCallback = () => {
                //发送进入VIP房间指令
                let vNewJoinVipRoomMsg:NewJoinVipRoomMsg = new NewJoinVipRoomMsg();
                vNewJoinVipRoomMsg.vipRoomID = Number(content);
                ServerUtil.sendMsg(vNewJoinVipRoomMsg, MsgCmdConstant.MSG_INTO_GAME_TABLE);

                NativeBridge.mwRoomId = content;
            };

            let params = {
                hasLeftBtn: true,
                leftCallBack: () => {
                    sureCallback();
                    cancleCallback();
                },
                hasRightBtn: true,
                rightCallBack: cancleCallback,
                text: contentStr
            }
            ReminderViewUtil.showReminderView(params);
        }

        /**返回键点击提示 */
        private onTouchBack() {
            if (NativeBridge.getInstance().mBackView) return;
            let contentStr = "确认退出？";
            let sureCallback: Function = () => {
                let idData = {
                    "eventType": SendNativeMsgType.SEND_NATIVE_QUIT_GAME,
                    "data": {
                    }
                }
                NativeBridge.getInstance().sendNativeMessage(JSON.stringify(idData));
            };
            let params = {
                hasLeftBtn: true,
                leftCallBack: () => {
                    sureCallback();
                },
                hasRightBtn: true,
                rightCallBack: () =>{
                    NativeBridge.getInstance().mBackView = null;
                },
                text: contentStr
            }
            NativeBridge.getInstance().mBackView = ReminderViewUtil.showReminderView(params);
        }

        /**登陆view创建完成后 */
        private nativeLoginviewCreated() {
            setTimeout(() => {
                // 通知原生关闭闪屏;延时为了等登陆界面渲染完成，避免闪烁
                NativeBridge.getInstance().sendNativeMessage(JSON.stringify({ "eventType": SendNativeMsgType.SEND_NATIVE_OFF_SPLASH, data: {} }));

                //已用微信登陆过
                let localItem = Storage.getItem(Storage.WX_ACCESS_TOKEN_INFO);
                let xlItem = Storage.getItem(Storage.XL_ACCESS_TOKEN_INFO);
                if (xlItem && NativeBridge.mAutoLogin) {
                    XlApiUtil.loginXLQuick();
                }
                else if (localItem && NativeBridge.mAutoLogin) {
                    WxApiUtil.loginWXQuick();
                }

                // 获取定位信息
                // let locationData = {
                //     "eventType": SendNativeMsgType.SEND_NATIVE_GET_LOCATION,
                //     "data": {
                //     }
                // }
                // NativeBridge.getInstance().sendNativeMessage(JSON.stringify(locationData));
            }, 500);

            // 获取设备ID
            let idData = {
                "eventType": SendNativeMsgType.SEND_NATIVE_GET_UDID,
                "data": {
                }
            }
            NativeBridge.getInstance().sendNativeMessage(JSON.stringify(idData));

            // 获取是否是测试服
            let testData = {
                "eventType": SendNativeMsgType.SEND_NATIVE_TEST,
                "data": {
                }
            }
            NativeBridge.getInstance().sendNativeMessage(JSON.stringify(testData));

            if (Game.CommonUtil.IsIos) {
                let IOSTypeData = {
                    "eventType": SendNativeMsgType.SEND_NATIVE_GET_IOS_TYPE,
                    "data": {
                    }
                }
                NativeBridge.getInstance().sendNativeMessage(JSON.stringify(IOSTypeData));
            }
        }

        /**更新玩家GPS信息 */
        private refreshGps() {
            NativeBridge.getInstance().mRefreshGpsFlag = false;
            let vUpdatePlayerGPSMsg: NewUpdateGPSPositionMsg = new NewUpdateGPSPositionMsg();
            let mLocation = NativeBridge.getInstance().mLocation;
            if (!mLocation) return;
            vUpdatePlayerGPSMsg.px = mLocation.latitude;
            vUpdatePlayerGPSMsg.py = mLocation.longitude;
            let addressStr = mLocation.province + mLocation.city + mLocation.district + mLocation.street;
            vUpdatePlayerGPSMsg.paddress = addressStr;
            ServerUtil.sendMsg(vUpdatePlayerGPSMsg);
        }

        /**进入茶楼或者返回大厅 */
        private intoTeahouseOrBackLobby() {
            let vNewIntoGameTableMsgAck: NewIntoGameTableMsgAck = GameConstant.CURRENT_HANDLE.getRequestStartGameMsgAck();
            if (vNewIntoGameTableMsgAck && vNewIntoGameTableMsgAck.teaHouseId) {
                TeaHouseMsgHandle.sendAccessTeaHouseMsg(vNewIntoGameTableMsgAck.teaHouseId);
            }
            else {
                MvcUtil.send(LobbyModule.LOBBY_INTO_LOBBY);
            }
        }
    }

    /**
     * 登录信息
     * optional string acc = 1; //账号
     optional string accKey = 2; //账号Key
     optional string accPF = 3; //账号平台，wanba test egret
     optional fixed32 devicePF = 4; //设备平台 设备平台（1：安卓；2：IOS；3：触屏；4：winphone）
     optional fixed64 inviteId = 5; //邀请Id
     optional string ip = 6; //ip地址
     */
    export class LoginInfo {
        public readonly acc: string; //账号
        public readonly accKey: string; //账号Key 也是 token
        public readonly accPF: string; //账号平台，wanba test egret
        public readonly devicePF: number; //设备平台 设备平台（1：安卓；2：IOS；3：触屏；4：winphone）
        public readonly ip: string; //ip地址
        public readonly inviteId: number; //邀请Id
        constructor(acc: string, accKey: string, accPF: string, devicePF: number, ip: string, inviteId?: number) {
            this.acc = acc;
            this.accKey = accKey;
            this.accPF = accPF;
            this.devicePF = devicePF;
            this.ip = ip;
            if (inviteId) this.inviteId = inviteId;
        }
    }

    /**剪贴板不同内容对应字符串 */
    export class ClipboardContentStr {
        public static readonly ROOM_ID: string = "房间号";
        public static readonly CLUB_ID: string = "俱乐部ID";
        public static readonly CDKEY_BACK: string = "邀请码";
        public static readonly CDKEY_RECOMMEND: string = "推荐邀请码";
    }
}