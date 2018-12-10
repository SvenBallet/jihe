module FL {

    /**
     * 微信语音动作工厂
     */
    export class WeChatVoiceActionFactory {

        /**
         * 构建开始录音动作
         * @param {FL.WeChatVoiceSceneEnum} weChatVoiceType
         * @param data 携带的数据
         */
        public static buildStartRecordAction(weChatVoiceType: WeChatVoiceSceneEnum, data: any): WeChatVoiceAction {
            return new WeChatVoiceAction(WeChatVoiceActionEnum.RECORD, weChatVoiceType, null, null, null, null, data);
        }

        /**
         * 构建停止录音动作
         * @param {FL.WeChatVoiceSceneEnum} weChatVoiceType
         * @param {number} startActionId
         * @param data 携带的数据
         * @returns {FL.WeChatVoiceAction}
         */
        public static buildStopRecordAction(weChatVoiceType: WeChatVoiceSceneEnum, startActionId: number, targetStartTimes: number, data: any): WeChatVoiceAction {
            return new WeChatVoiceAction(WeChatVoiceActionEnum.STOP_RECORD, weChatVoiceType, null, null, startActionId, targetStartTimes, data);
        }

        /**
         * 构建播放语音动作
         * @param {FL.WeChatVoiceSceneEnum} weChatVoiceType
         * @param {string} localId
         * @param data 携带的数据
         * @returns {FL.WeChatVoiceAction}
         */
        public static buildPlayVoiceAction(weChatVoiceType: WeChatVoiceSceneEnum, localId: string, data: any): WeChatVoiceAction {
            return new WeChatVoiceAction(WeChatVoiceActionEnum.PLAY, weChatVoiceType, localId, null, null, null, data);
        }

        /**
         * 构建上传语音动作
         * @param {FL.WeChatVoiceSceneEnum} weChatVoiceType
         * @param {number} stopActionId
         * @param {string} localId
         * @param data 携带的数据
         * @returns {FL.WeChatVoiceAction}
         */
        public static buildUploadVoiceAction(weChatVoiceType: WeChatVoiceSceneEnum, stopActionId: number, localId: string, data: any): WeChatVoiceAction {
            return new WeChatVoiceAction(WeChatVoiceActionEnum.UPLOAD, weChatVoiceType, localId, null, stopActionId, null, data);
        }

        /**
         * 构建下载语音动作
         * @param {FL.WeChatVoiceSceneEnum} weChatVoiceType
         * @param {string} serverId
         * @param data 携带的数据
         * @returns {FL.WeChatVoiceAction}
         */
        public static buildDownloadVoiceAction(weChatVoiceType: WeChatVoiceSceneEnum, serverId: string, data: any): WeChatVoiceAction {
            return new WeChatVoiceAction(WeChatVoiceActionEnum.DOWNLOAD, weChatVoiceType, null, serverId, null, null, data);
        }

    }

    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase - ShareHandler
     * @Description:  //分享Handler
     * @Create: DerekWu on 2018/1/8 14:21
     * @Version: V1.0
     */
    export class WeChatJsSdkHandler {

        /**
         * 初始化
         */
        public static init(): void {
            // 微信授权才能初始化
            if (GConf.Conf.useWXAuth == 1) {

                // 初始化分享
                if (GConf.Conf.wxJssdkReady === 0) {
                    // 判断jssdk是否准备完成

                    WXJssdk.wx().ready(function () {
                        egret.log("wx.ready");
                        // egret.log(res);
                        // egret.log(res.errMsg);
                        // if (res.errMsg === "config:ok") {
                            (<any>(GConf.Conf)).wxJssdkReady = 1;
                            egret.log("GConf.Conf.wxJssdkReady 1 === 1");
                            this.realInit();
                        // } else {
                        //     (<any>(GConf.Conf)).wxJssdkReady = -1;
                        //     this.jsSdkConfigError();
                        // }
                        // config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。
                    });

                    WXJssdk.wx().error(function (res) {
                        egret.log("wx.error");
                        // egret.log(res);
                        egret.log(res.errMsg);
                        // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
                        (<any>(GConf.Conf)).wxJssdkReady = -1;
                        this.jsSdkConfigError();
                    });

                } else if (GConf.Conf.wxJssdkReady === 1) {
                    egret.log("GConf.Conf.wxJssdkReady 2 === 1");
                    // 已经准备好了
                    this.realInit();
                } else if (GConf.Conf.wxJssdkReady === -1) {
                    egret.log("GConf.Conf.wxJssdkReady 3 === -1");
                    // 准备失败
                    this.jsSdkConfigError();
                }

            }
        }

        /**
         * jsSdkConfig 失败
         */
        private static jsSdkConfigError(): void {
            egret.log("WX:JS-SDK init error...");
            //设置最后微信登录消息
            ReminderViewUtil.showReminderView({
                hasLeftBtn:true,
                leftCallBack:new MyCallBack(this.reLogin, this),
                leftBtnText:"重新登录",
                hasRightBtn:false,
                text:"微信JS-SDK授权失败，请您重新登录！"
            });
        }

        /**
         * 重新登录
         */
        private static reLogin():void {
            location.reload();
        }

        /**
         * 真正的初始化
         */
        private static realInit(): void {

            // 监听录音自动停止接口
            WXJssdk.wx().onVoiceRecordEnd({
                // 录音时间超过一分钟没有停止的时候会执行 complete 回调
                complete: function (res) {
                    // 这种情况结束的不做处理
                    egret.log("onVoiceRecordEnd complete:" + res.errMsg);
                    // let localId:string = res.localId;
                }
            });

            // 监听语音播放完毕接口
            WXJssdk.wx().onVoicePlayEnd({
                complete: function (res) {
                    egret.log("onVoicePlayEnd complete:" + res.errMsg);
                    let localId: string = res.localId; // 返回音频的本地ID
                    // 微信播放结束，各个模块自己处理，主要是移除表现
                    MvcUtil.send(CommonModule.COMMON_WE_CHAT_VOICE_PLAY_END, localId);
                    // 移除当前正在播放的动作
                    WeChatJsSdkHandler.removeCurrPlayAction(localId);
                    // 不管删除成功 或者 失败，都马上执行下一个
                    this.handleVoiceAction();
                }
            });

            // 隐藏所有非基础按钮接口
            WXJssdk.wx().hideAllNonBaseMenuItem({
                complete: function (res) {
                    egret.log("hideAllNonBaseMenuItem complete:" + res.errMsg);
                    // 显示分享给朋友
                    WXJssdk.wx().showMenuItems({
                        menuList: [
                            "menuItem:share:appMessage"
                        ] // 要显示的菜单项，所有menu项见附录3
                    });
                    // // 显示分享给朋友 和 分享到朋友圈 按钮 ,
                    // WXJssdk.wx().showMenuItems({
                    //     menuList: [
                    //         "menuItem:share:appMessage",
                    //         "menuItem:share:timeline"
                    //     ] // 要显示的菜单项，所有menu项见附录3
                    // });
                }
            });

            // 初始化分享内容
            this.setShareLocation(ShareLocationEnum.LOBBY);

        }

        /**
         * 通用的改变分享信息的接口
         */
        private static changeShareInfo(): void {
            // 微信授权才能更改
            if (GConf.Conf.useWXAuth == 1 && GConf.Conf.wxJssdkReady === 1) {
                // 分享给好友/群
                WXJssdk.wx().onMenuShareAppMessage({
                    title: WeChatJsSdkData.shareToFriends.title, // 分享标题
                    desc: WeChatJsSdkData.shareToFriends.desc, // 分享描述
                    link: WeChatJsSdkData.shareToFriends.link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                    imgUrl: WeChatJsSdkData.shareToFriends.imgUrl, // 分享图标
                    type: WeChatJsSdkData.shareToFriends.type, // 分享类型,music、video或link，不填默认为link
                    dataUrl: WeChatJsSdkData.shareToFriends.dataUrl, // 如果type是music或video，则要提供数据链接，默认为空
                    success: function (res) {
                        egret.log("onMenuShareAppMessage success:" + res.errMsg);
                        // 用户确认分享后执行的回调函数
                        MvcUtil.send(CommonModule.COMMON_SHARE_TO_FRIENDS_SUCCESS);
                        MvcUtil.send(CommonModule.COMMON_CLOSE_SHARE_REMINDER_VIEW);
                    },
                    fail: function (res) {
                        // 分享失败后执行的回调函数
                        egret.error("onMenuShareAppMessage fail:" + res.errMsg);
                        MvcUtil.send(CommonModule.COMMON_SHARE_TO_FRIENDS_CANCEL);
                        MvcUtil.send(CommonModule.COMMON_CLOSE_SHARE_REMINDER_VIEW);
                    },
                    cancel: function (res) {
                        egret.log("onMenuShareAppMessage cancel:" + res.errMsg);
                        // 用户取消分享后执行的回调函数
                        MvcUtil.send(CommonModule.COMMON_SHARE_TO_FRIENDS_CANCEL);
                        MvcUtil.send(CommonModule.COMMON_CLOSE_SHARE_REMINDER_VIEW);
                    }
                });

                // 分享到朋友圈 (全部禁用)
                // WXJssdk.wx().onMenuShareTimeline({
                //     title: WeChatJsSdkData.shareToCircleOfFriends.title, // 分享标题
                //     link: WeChatJsSdkData.shareToCircleOfFriends.link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                //     imgUrl: WeChatJsSdkData.shareToCircleOfFriends.imgUrl, // 分享图标
                //     success: function (res) {
                //         egret.log("onMenuShareTimeline success:" + res.errMsg);
                //         // 用户确认分享后执行的回调函数
                //         MvcUtil.send(CommonModule.COMMON_SHARE_TO_CIRCLE_OF_FRIENDS_SUCCESS);
                //         MvcUtil.send(CommonModule.COMMON_CLOSE_SHARE_REMINDER_VIEW);
                //     },
                //     fail: function (res) {
                //         // 分享失败后执行的回调函数
                //         egret.error("onMenuShareTimeline fail:" + res.errMsg);
                //         MvcUtil.send(CommonModule.COMMON_SHARE_TO_CIRCLE_OF_FRIENDS_CANCEL);
                //         MvcUtil.send(CommonModule.COMMON_CLOSE_SHARE_REMINDER_VIEW);
                //     },
                //     cancel: function (res) {
                //         egret.log("onMenuShareTimeline cancel:" + res.errMsg);
                //         // 用户取消分享后执行的回调函数
                //         MvcUtil.send(CommonModule.COMMON_SHARE_TO_CIRCLE_OF_FRIENDS_CANCEL);
                //         MvcUtil.send(CommonModule.COMMON_CLOSE_SHARE_REMINDER_VIEW);
                //     }
                // });
            }
        }

        /**
         * 设置客户端当前分享位置
         * @param {FL.ShareLocationEnum} shareLocation
         */
        public static setShareLocation(shareLocation: ShareLocationEnum): void {
            // 微信授权才能更改
            if (GConf.Conf.useWXAuth == 1 && GConf.Conf.wxJssdkReady === 1) {

                // 设置
                WeChatJsSdkData.shareLocation = shareLocation;

                // 游戏基础URL地址
                let vBaseURL: string;
                let vParamsIndex: number = location.href.indexOf("?");
                if (vParamsIndex > 0) {
                    vBaseURL = location.href.substr(0, vParamsIndex);
                } else {
                    vBaseURL = location.href;
                }

                // 分情况处理
                let shareToFriends: ShareObj = WeChatJsSdkData.shareToFriends;
                let shareToCircleOfFriends: ShareObj = WeChatJsSdkData.shareToCircleOfFriends;
                let vGameConf: GameConf = GConf.Conf;
                if (shareLocation === ShareLocationEnum.LOBBY) {
                    // 设置好友/群 分享内容
                    shareToFriends.title = vGameConf.shareToFriendsTitle;
                    shareToFriends.desc = vGameConf.shareToFriendsDesc;
                    //设置朋友圈 分享内容
                    shareToCircleOfFriends.title = vGameConf.shareToCircleOfFriendsTitle;
                } else if (shareLocation === ShareLocationEnum.VIP_ROOM) {
                    // if (MJGameHandler.isVipRoom()) {
                    // 生成分享地址
                    let vGameParams: string = "{\"roomId\":" + GameConstant.CURRENT_HANDLE.getVipRoomId() + "}";
                    vBaseURL += "?aagameparams=" + encodeURIComponent(vGameParams);
                    // 设置好友/群 分享内容
                    shareToFriends.title = GameConstant.CURRENT_HANDLE.getVipRoomShareTitle();
                    shareToFriends.desc = GameConstant.CURRENT_HANDLE.getVipRoomShareDesc();
                    //设置朋友圈 分享内容
                    shareToCircleOfFriends.title = GameConstant.CURRENT_HANDLE.getVipRoomShareTitle();
                    // }
                } else if (shareLocation === ShareLocationEnum.GOLD_GAME_OVER) { //  废弃
                    // 设置好友/群 分享内容
                    shareToFriends.title = vGameConf.shareToFriendsTitle;
                    shareToFriends.desc = vGameConf.shareToFriendsDesc;
                    //设置朋友圈 分享内容
                    shareToCircleOfFriends.title = vGameConf.shareToCircleOfFriendsTitle;
                } else if (shareLocation === ShareLocationEnum.VIP_ROOM_GAME_OVER) { //  废弃
                    // 设置好友/群 分享内容
                    shareToFriends.title = vGameConf.shareToFriendsTitle;
                    shareToFriends.desc = vGameConf.shareToFriendsDesc;
                    //设置朋友圈 分享内容
                    shareToCircleOfFriends.title = vGameConf.shareToCircleOfFriendsTitle;
                } else if (shareLocation === ShareLocationEnum.ROOM_OVER) {
                    // 设置好友/群 分享内容
                    shareToFriends.title = GameConstant.CURRENT_HANDLE.getVipRoomOverShareTitle();
                    shareToFriends.desc = GameConstant.CURRENT_HANDLE.getVipRoomOverShareDesc();
                    //设置朋友圈 分享内容
                    shareToCircleOfFriends.title = GameConstant.CURRENT_HANDLE.getVipRoomOverShareTitle();
                }
                // 设置好友/群 分享内容
                shareToFriends.link = vBaseURL;
                shareToFriends.imgUrl = vGameConf.shareImgUrl;
                //设置朋友圈 分享内容
                shareToCircleOfFriends.link = vBaseURL;
                shareToCircleOfFriends.imgUrl = vGameConf.shareImgUrl;

                this.changeShareInfo();
            }
        }

        /**
         * 修复当前分享位置，
         * 因为在一些界面需要特殊的临时分享，会破坏原有分享位置的信息，
         * 所以需要修复功能
         */
        public static repairCurrentShareLocation(): void {
            // 微信授权才能更改
            if (GConf.Conf.useWXAuth == 1 && GConf.Conf.wxJssdkReady === 1) {
                if (WeChatJsSdkData.shareLocation) {
                    this.setShareLocation(WeChatJsSdkData.shareLocation);
                }
            }
        }

        /**
         * 设置临时分享信息
         * @param {string} shareToFriendsTitle  分享给朋友 的title
         * @param {string} shareToFriendsDesc  分享给朋友 的描述
         * @param {string} shareToCircleOfFriendsTitle 分享给朋友圈的 title
         * @param {string} shareReminderType 提示类型
         * @param {string} paramsJsonStr 参数json字符串，非必填
         */
        public static setTempShareInfo(shareToFriendsTitle:string, shareToFriendsDesc:string, shareToCircleOfFriendsTitle:string, shareReminderType:ShareReminderTypeEnum, paramsJsonStr?:string): void {
            // 微信授权才能更改
            if (GConf.Conf.useWXAuth == 1 && GConf.Conf.wxJssdkReady === 1) {
                // 游戏基础URL地址
                let vBaseURL: string;
                let vParamsIndex: number = location.href.indexOf("?");
                if (vParamsIndex > 0) {
                    vBaseURL = location.href.substr(0, vParamsIndex);
                } else {
                    vBaseURL = location.href;
                }

                // 分享内容设置
                let shareToFriends: ShareObj = WeChatJsSdkData.shareToFriends;
                let shareToCircleOfFriends: ShareObj = WeChatJsSdkData.shareToCircleOfFriends;
                let vGameConf: GameConf = GConf.Conf;
                // 设置好友/群 分享内容
                shareToFriends.title = shareToFriendsTitle;
                shareToFriends.desc = shareToFriendsDesc;
                // 设置朋友圈 分享内容
                shareToCircleOfFriends.title = shareToCircleOfFriendsTitle;
                // 判断是否有参数
                if (paramsJsonStr) {
                    vBaseURL += "?aagameparams=" + encodeURIComponent(paramsJsonStr);
                }
                // 设置好友/群 分享内容
                shareToFriends.link = vBaseURL;
                shareToFriends.imgUrl = vGameConf.shareImgUrl;
                // 设置朋友圈 分享内容
                shareToCircleOfFriends.link = vBaseURL;
                shareToCircleOfFriends.imgUrl = vGameConf.shareImgUrl;
                // 改变分享信息
                this.changeShareInfo();
                // 分享提示
                MvcUtil.send(CommonModule.COMMON_SHOW_SHARE_REMINDER_VIEW, shareReminderType);
            }
        }

        /**
         * 添加到最后并处理
         * @param {FL.WeChatVoiceAction} weChatVoiceAction
         */
        private static addLastAndHandleVoiceAction(weChatVoiceAction: WeChatVoiceAction): void {
            // 获得微信语音动作队列
            this.addWeChatActionListLast(weChatVoiceAction);
            this.handleVoiceAction();
        }

        /**
         * 添加到最后
         * @param {FL.WeChatVoiceAction} weChatVoiceAction
         */
        private static addWeChatActionListLast(weChatVoiceAction: WeChatVoiceAction): void {
            let vActionList: Game.LinkedList = WeChatJsSdkData.weChatVoiceActionLinkedList;
            vActionList.addLast(weChatVoiceAction);
        }

        /**
         * 添加到最前面并处理
         * @param {FL.WeChatVoiceAction} weChatVoiceAction
         */
        private static addFirstAndHandleVoiceAction(weChatVoiceAction: WeChatVoiceAction): void {
            // 获得微信语音动作队列
            this.addWeChatActionListFirst(weChatVoiceAction);
            this.handleVoiceAction();
        }

        /**
         * 添加到最前面
         * @param {FL.WeChatVoiceAction} weChatVoiceAction
         */
        private static addWeChatActionListFirst(weChatVoiceAction: WeChatVoiceAction): void {
            let vActionList: Game.LinkedList = WeChatJsSdkData.weChatVoiceActionLinkedList;
            vActionList.addFirst(weChatVoiceAction);
        }

        /**
         * 处理语音动作
         */
        private static handleVoiceAction(): void {

            //没有定时器则初始化定时器
            if (!WeChatJsSdkData.weChatVoiceTimer) {
                WeChatJsSdkData.weChatVoiceTimer = new Game.Timer(100);
                WeChatJsSdkData.weChatVoiceTimer.addEventListener(egret.TimerEvent.TIMER, this.handleVoiceAction, this);
                WeChatJsSdkData.weChatVoiceTimer.start();
            }

            // 获得微信语音动作队列
            let vActionList: Game.LinkedList = WeChatJsSdkData.weChatVoiceActionLinkedList;
            // if (WeChatJsSdkData.weChatVoiceTimer.currentCount/100 === 0) {
            //     egret.log("vActionList.getSize()="+vActionList.getSize());
            // }
            if (vActionList.getSize() > 0) {
                // 如果定时器没有启动，则启动定时器
                // if (!WeChatJsSdkData.weChatVoiceTimer.running) {
                //     WeChatJsSdkData.weChatVoiceTimer.start();
                // }
                // 获取第一个动作，开始执行，注意，这里没有取出
                let vCurrAction: WeChatVoiceAction = vActionList.getFirst();
                // vCurrAction.printInfo();
                if (vCurrAction.voiceAction === WeChatVoiceActionEnum.RECORD) {
                    this.handleStartWeChatRecord(vCurrAction);
                } else if (vCurrAction.voiceAction === WeChatVoiceActionEnum.STOP_RECORD) {
                    this.handleStopWeChatRecord(vCurrAction);
                } else if (vCurrAction.voiceAction === WeChatVoiceActionEnum.PLAY) {
                    this.handlePlayWeChatVoice(vCurrAction);
                } else if (vCurrAction.voiceAction === WeChatVoiceActionEnum.UPLOAD) {
                    this.handleUploadWeChatVoice(vCurrAction);
                } else if (vCurrAction.voiceAction === WeChatVoiceActionEnum.DOWNLOAD) {
                    this.handleDownloadWeChatVoice(vCurrAction);
                }
            } else {
                // 如果定时器已经启动，则停止定时器
                // if (WeChatJsSdkData.weChatVoiceTimer.running) {
                //     WeChatJsSdkData.weChatVoiceTimer.stop();
                // }
            }
        }

        /**
         * 移除当前正在播放的动作
         * @param {string} localId
         */
        private static removeCurrPlayAction(localId:string): void {
            // egret.log("removeCurrPlayAction start localId="+localId);
            // 获得微信语音动作队列
            let vActionList: Game.LinkedList = WeChatJsSdkData.weChatVoiceActionLinkedList;
            // 删除第一条动作，如果Id相同的话
            // 获取第一个动作，开始执行，注意，这里没有取出
            let vCurrAction: WeChatVoiceAction = vActionList.getFirst();
            if (vCurrAction.localId === localId) {
                // 删除
                vActionList.pollFirst();
                // egret.log("removeCurrPlayAction ok localId="+localId);
            }
        }

        /**
         * 移除当前动作
         * @param {number} actionId
         */
        private static removeCurrAction(actionId: number): void {
            // egret.log("removeCurrAction start actionId="+actionId);
            // 获得微信语音动作队列
            let vActionList: Game.LinkedList = WeChatJsSdkData.weChatVoiceActionLinkedList;
            // 删除第一条动作，如果Id相同的话
            // 获取第一个动作，开始执行，注意，这里没有取出
            let vCurrAction: WeChatVoiceAction = vActionList.getFirst();
            if (vCurrAction.actionId === actionId) {
                // 删除
                vActionList.pollFirst();
                // egret.log("removeCurrAction ok actionId="+actionId);
            }
        }

        /**
         * 移除当前动作 并 处理下一个动作
         * @param {number} actionId
         */
        private static removeCurrActionAndHandleNext(actionId: number): void {
            //移除当前动作
            this.removeCurrAction(actionId);
            // 不管删除成功 或者 失败，都马上执行下一个
            this.handleVoiceAction();
        }

        /**
         * 开始微信录音，返回录音动作Id，如果Id是0，则开始录音失败
         * @param {FL.WeChatVoiceSceneEnum} weChatVoiceScene
         * @param data 携带数据
         * @returns {number}
         */
        public static startWeChatRecord(weChatVoiceScene: WeChatVoiceSceneEnum, data: any): number {
            if (!(GConf.Conf.useWXAuth == 1)) {
                PromptUtil.show("请在微信中使用该功能！", PromptType.ALERT);
                return 0;
            }
            if (GConf.Conf.wxJssdkReady !== 1) {
                return 0;
            }
            // 获得微信语音动作队列
            let vActionList: Game.LinkedList = WeChatJsSdkData.weChatVoiceActionLinkedList;
            if (vActionList.getSize() > 0) {
                // 当前执行的动作，注意，这里没有取出
                let vCurrAction: WeChatVoiceAction = vActionList.getFirst();
                // 提醒文字信息
                let vAlertStr: string;
                if (vCurrAction.voiceAction === WeChatVoiceActionEnum.RECORD) {
                    vAlertStr = "正在录音中，请稍后！";
                } else if (vCurrAction.voiceAction === WeChatVoiceActionEnum.PLAY) {
                    vAlertStr = "正在播放语音，请稍后！";
                } else if (vCurrAction.voiceAction === WeChatVoiceActionEnum.UPLOAD) {
                    vAlertStr = "正在上传语音数据，请稍后！";
                } else if (vCurrAction.voiceAction === WeChatVoiceActionEnum.DOWNLOAD) {
                    vAlertStr = "正在下载语音数据，请稍后！";
                } else if (vCurrAction.voiceAction === WeChatVoiceActionEnum.STOP_RECORD) {
                    vAlertStr = "正在处理录音数据，请稍后！";
                }
                PromptUtil.show(vAlertStr, PromptType.ALERT);
                return 0;
            }

            // 判断录音间隔
            let vCurrTimes: number = new Date().getTime();
            if (vCurrTimes < WeChatJsSdkData.lastStartRecordTime + WeChatConstant.RECORD_INTERVAL_TIMES) {
                PromptUtil.show("录音太频繁，请您稍后再操作！", PromptType.ALERT);
                return 0;
            }
            // 设置最后录音时间
            WeChatJsSdkData.lastStartRecordTime = vCurrTimes;
            // 构建开始录音动作
            let vStartRecordAction: WeChatVoiceAction = WeChatVoiceActionFactory.buildStartRecordAction(weChatVoiceScene, data);
            // 添加到列表开头 并 处理
            this.addFirstAndHandleVoiceAction(vStartRecordAction);
            return vStartRecordAction.actionId;
        }

        /**
         * 处理开始录音动作
         * @param {FL.WeChatVoiceAction} action
         */
        private static handleStartWeChatRecord(action: WeChatVoiceAction): void {
            if (!action.isInHandle) {
                // 开始录音，传递录音Id，放在这个地方触发可以防止一系列问题
                MvcUtil.send(CommonModule.COMMON_WE_CHAT_START_RECORD, action.actionId);
                WXJssdk.wx().startRecord({
                    actionId: action.actionId,
                    success: function (res) {
                        // egret.log("startRecord success:" + res);
                        egret.log("startRecord success:" + res.errMsg);
                        // egret.log("startRecord success:" + this.actionId);
                        // egret.log("startRecord success:" + action.actionId);
                    },
                    fail: function (res) {
                        // TODO 录音失败
                        // egret.log("startRecord fail:" + res);
                        egret.log("startRecord fail:" + res.errMsg);
                        // egret.log("startRecord fail:" + this.actionId);
                        // egret.log("startRecord fail:" + action.actionId);
                        PromptUtil.show("录音失败！错误信息："+res.errMsg, PromptType.ERROR);
                        // 微信录音结束，各个模块自己处理
                        MvcUtil.send(CommonModule.COMMON_WE_CHAT_STOP_RECORD);
                        // WeChatJsSdkHandler.removeCurrActionAndHandleNext(this.actionId);
                        WeChatJsSdkHandler.stopWeChatRecord(this.actionId);
                    },
                    cancel: function (res) {
                        // egret.log("startRecord cancel:" + res);
                        egret.log("startRecord cancel:" + res.errMsg);
                        // egret.log("startRecord cancel:" + this.actionId);
                        // egret.log("startRecord cancel:" + action.actionId);
                        // TODO 用户拒绝授权录音
                        PromptUtil.show("录音授权失败！", PromptType.ERROR);
                        // 微信录音结束，各个模块自己处理
                        MvcUtil.send(CommonModule.COMMON_WE_CHAT_STOP_RECORD);
                        WeChatJsSdkHandler.removeCurrActionAndHandleNext(this.actionId);

                    }
                });
                // 设置处理中
                (<any>action).isInHandle = true;
            } else {
                // 获得当前时间
                let vCurrTimes: number = new Date().getTime();
                if (vCurrTimes > action.startTimes + WeChatConstant.RECORD_MAX_TIMES) {
                    // 超过录音最大时间，停止录音
                    this.stopWeChatRecord(action.actionId);
                }
            }
        }

        /**
         * 主动停止微信录音，需要开始录音的id才能正常停止
         * @param {number} startActionId
         */
        public static stopWeChatRecord(startActionId: number): void {
            if (GConf.Conf.wxJssdkReady !== 1) {
                return;
            }
            // 获得微信语音动作队列
            let vActionList: Game.LinkedList = WeChatJsSdkData.weChatVoiceActionLinkedList;
            if (vActionList.getSize() > 0) {
                // 当前执行的动作，注意，这里没有取出
                let vCurrAction: WeChatVoiceAction = vActionList.getFirst();
                if (vCurrAction.voiceAction === WeChatVoiceActionEnum.RECORD && vCurrAction.actionId === startActionId) {
                    // 构建录音停止动作
                    let vStopAction: WeChatVoiceAction = WeChatVoiceActionFactory.buildStopRecordAction(vCurrAction.voiceScene, startActionId, vCurrAction.startTimes, vCurrAction.data);
                    // 删除正在录音的动作
                    vActionList.pollFirst();
                    // 添加到开头 并 处理
                    this.addFirstAndHandleVoiceAction(vStopAction);
                }
            }
        }

        /**
         * 处理停止录音
         * @param {FL.WeChatVoiceAction} action
         */
        private static handleStopWeChatRecord(action: WeChatVoiceAction): void {
            // 当前时间
            let vCurrTimes: number = new Date().getTime();
            if (!action.isInHandle) {
                // 判断是否小于最小录音时间
                if (vCurrTimes < action.targetStartTimes + WeChatConstant.RECORD_MIN_TIMES) {
                    // 录音时间太短
                    PromptUtil.show("录音时间太短，长按录音按钮进行！", PromptType.ALERT);
                    // 微信录音结束，各个模块自己处理
                    MvcUtil.send(CommonModule.COMMON_WE_CHAT_STOP_RECORD, action);
                    WXJssdk.wx().stopRecord({
                        actionId: action.actionId,
                        complete: function (res) {
                            egret.log("stopRecord complete:" + res.errMsg);
                            egret.log("stopRecord actionId:" + this.actionId);
                            // 不管成功失败，当错误处理
                            WeChatJsSdkHandler.removeCurrActionAndHandleNext(this.actionId);
                        }
                    });
                } else {
                    WXJssdk.wx().stopRecord({
                        action: action,
                        success: function (res) {
                            egret.log("stopRecord success:" + res.errMsg);
                            // egret.log("stopRecord localId:" + res.localId);
                            // egret.log("stopRecord actionId:" + this.action.actionId);
                            this.action.localId = res.localId;
                            // egret.log("stopRecord localId:" + this.action.localId);
                            // try {
                                // 微信录音结束，各个模块自己处理
                                MvcUtil.send(CommonModule.COMMON_WE_CHAT_STOP_RECORD, this.action);
                                // egret.log("stopRecord 1:");
                                // 构建播放语音动作
                                let vPlayAction: WeChatVoiceAction = WeChatVoiceActionFactory.buildPlayVoiceAction(this.action.voiceScene, res.localId, this.action.data);
                                // egret.log("stopRecord 2:");
                                // 移除当前
                                WeChatJsSdkHandler.removeCurrAction(this.action.actionId);
                                // egret.log("stopRecord 3:");
                                // 加入到队尾部，并不播放
                                WeChatJsSdkHandler.addWeChatActionListLast(vPlayAction);
                                // egret.log("stopRecord 4:");
                                // 上传后在播放
                                WeChatJsSdkHandler.uploadWeChatVoice(this.action);
                                // egret.log("stopRecord 5:");
                            // } catch (e) {
                            //     egret.log("stopRecord name = "+e.name);
                            //     egret.log("stopRecord message = "+e.message);
                            // }
                        },
                        fail: function (res) {
                            egret.log("stopRecord fail:" + res.errMsg);
                            // egret.log("stopRecord localId:" + res.localId);
                            // egret.log("stopRecord actionId:" + this.action.actionId);
                            // 停止录音失败
                            WeChatJsSdkHandler.removeCurrActionAndHandleNext(this.action.actionId);
                        }
                    });
                }
                // 设置为正在处理中
                (<any>action).isInHandle = true;
            } else {
                if (vCurrTimes > action.startTimes + WeChatConstant.STOP_ACTION_WAITING_TIMES) {
                    // egret.log("stopRecord STOP_ACTION_WAITING_TIMES:");
                    // 超过等待时间，当 失败 处理
                    WeChatJsSdkHandler.removeCurrActionAndHandleNext(action.actionId);
                }
            }
        }

        /**
         * 上传语音是在停止动作之后，自动上传
         * @param {FL.WeChatVoiceAction} stopAction
         */
        private static uploadWeChatVoice(stopAction: WeChatVoiceAction): void {
            // stopAction.printInfo("uploadWeChatVoice");
            if (stopAction && stopAction.localId) {
                // stopAction.printInfo("uploadWeChatVoice 2 ");
                // 构建上传语音动作
                let vUploadVoice: WeChatVoiceAction = WeChatVoiceActionFactory.buildUploadVoiceAction(stopAction.voiceScene, stopAction.actionId, stopAction.localId, stopAction.data);
                this.addFirstAndHandleVoiceAction(vUploadVoice);
            }
        }

        /**
         * 处理语音上传
         * @param {FL.WeChatVoiceAction} uploadAction
         */
        private static handleUploadWeChatVoice(action: WeChatVoiceAction): void {
            if (!action.isInHandle) {
                WXJssdk.wx().uploadVoice({
                    action: action,
                    localId: action.localId, // 需要上传的音频的本地ID，由stopRecord接口获得
                    isShowProgressTips: 0, // 默认为1，显示进度提示
                    success: function (res) {
                        egret.log("uploadVoice success:" + res.errMsg);
                        this.action.serverId = res.serverId; // 返回音频的服务器端ID
                        //TODO 。。。 暂时就到这里处理了，以后再拓展到分模块处理
                        if (this.action.voiceScene === WeChatVoiceSceneEnum.GAME) {
                            let vWeChatVoiceMsg: WeChatVoiceMsg = new WeChatVoiceMsg();
                            vWeChatVoiceMsg.voiceType = WeChatVoiceSceneEnum.GAME;
                            vWeChatVoiceMsg.playerID = LobbyData.playerVO.playerID;
                            vWeChatVoiceMsg.voiceServerId = res.serverId;
                            vWeChatVoiceMsg.playerPos = this.action.data; // 玩家位置
                            // 上传成功后直接发送给其他玩家
                            ServerUtil.sendMsg(vWeChatVoiceMsg);
                        }
                        // 播放上传完成进入下一个
                        WeChatJsSdkHandler.removeCurrActionAndHandleNext(this.action.actionId);
                    },
                    fail: function (res) {
                        egret.error("uploadVoice fail:" + res.errMsg);
                        // 失败
                        WeChatJsSdkHandler.removeCurrActionAndHandleNext(this.action.actionId);
                    }
                });
                // 设置开始时间
                (<any>action).startTimes = new Date().getTime();
                // 设置为正在处理中
                (<any>action).isInHandle = true;
            } else {
                // 当前时间
                let vCurrTimes: number = new Date().getTime();
                if (vCurrTimes > action.startTimes + WeChatConstant.UPLOAD_VOICE_MAX_TIMES) {
                    // 避免播放回调失败的情况
                    WeChatJsSdkHandler.removeCurrActionAndHandleNext(action.actionId);
                }
            }
        }

        /**
         * 下载微信语音
         * @param {FL.WeChatVoiceMsg} weChatVoiceMsg
         */
        public static downloadWeChatVoice(weChatVoiceMsg: WeChatVoiceMsg): void {
            if (GConf.Conf.wxJssdkReady !== 1) {
                return;
            }
            if (weChatVoiceMsg && weChatVoiceMsg.voiceType === WeChatVoiceSceneEnum.GAME) {
                let vDownloadAction: WeChatVoiceAction = WeChatVoiceActionFactory.buildDownloadVoiceAction(WeChatVoiceSceneEnum.GAME, weChatVoiceMsg.voiceServerId, weChatVoiceMsg.playerPos);
                //添加到最后
                this.addLastAndHandleVoiceAction(vDownloadAction);
            }
        }

        /**
         * 处理下载微信语音
         * @param {FL.WeChatVoiceAction} action
         */
        private static handleDownloadWeChatVoice(action: WeChatVoiceAction): void {
            if (!action.isInHandle) {
                WXJssdk.wx().downloadVoice({
                    action: action,
                    serverId: action.serverId, // 需要上传的音频的本地ID，由stopRecord接口获得
                    isShowProgressTips: 0, // 默认为1，显示进度提示
                    success: function (res) {
                        egret.log("downloadVoice success:" + res.errMsg);
                        let vLocalId: string = res.localId; // 返回音频的本地ID
                        // 移除下载
                        WeChatJsSdkHandler.removeCurrAction(this.action.actionId);
                        // 播放微信语音
                        WeChatJsSdkHandler.playWeChatVoice(this.action.voiceScene, vLocalId, this.action.data);
                    },
                    fail: function (res) {
                        egret.error("downloadVoice fail:" + res.errMsg);
                        // 失败
                        WeChatJsSdkHandler.removeCurrActionAndHandleNext(this.action.actionId);
                    }
                });
                // 设置开始时间
                (<any>action).startTimes = new Date().getTime();
                // 设置为正在处理中
                (<any>action).isInHandle = true;
            } else {
                // 当前时间
                let vCurrTimes: number = new Date().getTime();
                if (vCurrTimes > action.startTimes + WeChatConstant.DOWNLOAD_VOICE_MAX_TIMES) {
                    // 避免播放回调失败的情况
                    WeChatJsSdkHandler.removeCurrActionAndHandleNext(action.actionId);
                }
            }
        }

        /**
         * 播放微信语音
         * @param {FL.WeChatVoiceSceneEnum} weChatVoiceScene 语音场景
         * @param {string} localId 需要播放的音频的本地ID，由stopRecord接口获得
         * @param data 携带数据
         */
        private static playWeChatVoice(weChatVoiceScene: WeChatVoiceSceneEnum, localId: string, data: any): void {
            // 构建播放语音动作
            let vPlayAction: WeChatVoiceAction = WeChatVoiceActionFactory.buildPlayVoiceAction(weChatVoiceScene, localId, data);
            this.addLastAndHandleVoiceAction(vPlayAction);
        }

        /**
         * 处理播放微信语音
         * @param {FL.WeChatVoiceAction} action
         */
        private static handlePlayWeChatVoice(action: WeChatVoiceAction): void {
            if (!action.isInHandle) {
                WXJssdk.wx().playVoice({
                    action: action,
                    localId: action.localId, // 需要播放的音频的本地ID，由stopRecord接口获得
                    success: function (res) {
                        egret.log("playVoice success:" + res.errMsg);
                        // 播放语音成功，各个模块自己处理表现，等待播放结束
                        MvcUtil.send(CommonModule.COMMON_WE_CHAT_VOICE_PLAY_START, this.action);
                        // 更改动作开始时间，避免播放回调失败的情况
                        this.action.startTimes = new Date().getTime();
                    },
                    fail: function (res) {
                        egret.error("playVoice fail:" + res.errMsg);
                        // 播放语音失败
                        WeChatJsSdkHandler.removeCurrActionAndHandleNext(this.action.actionId);
                    }
                });
                //设置开始时间
                (<any>action).startTimes = new Date().getTime();
                // 设置为正在处理中
                (<any>action).isInHandle = true;
            } else {
                // 当前时间
                let vCurrTimes: number = new Date().getTime();
                if (vCurrTimes > action.startTimes + WeChatConstant.RECORD_MAX_TIMES + 1000) {
                    // 避免播放回调失败的情况
                    WeChatJsSdkHandler.removeCurrActionAndHandleNext(action.actionId);
                }
            }
        }

    }

}