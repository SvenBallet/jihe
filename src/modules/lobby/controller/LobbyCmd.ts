module FL {

    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase - LobbyCmd
     * @Description:  //大厅指令
     * @Create: DerekWu on 2017/11/10 20:18
     * @Version: V1.0
     */
    export class LobbyCmd extends puremvc.SimpleCommand implements puremvc.ICommand {

        /**
         * 是否增加缓动效果，第一次进入默认增加
         */
        public static pIsTween: boolean = true;

        public constructor() {
            super();
        }

        public execute(notification: puremvc.INotification): void {
            let data: any = notification.getBody();
            switch (notification.getName()) {
                case LobbyModule.LOBBY_INTO_LOBBY: {
                    this.intoLobby(data);
                    break;
                }
                case LobbyModule.LOBBY_SHOW_SHARE_VIEW: {
                    this.showShareView();
                    break;
                }
                case LobbyModule.LOBBY_SHOW_FREE_DIAMOND_VIEW: {
                    this.showFreeDiamondView();
                    break;
                }
                case LobbyModule.LOBBY_OPEN_DOWNLOAD_PAGE: {
                    this.openDownloadPage();
                    break;
                }
            }
        }

        /**
         * 进入大厅
         */
        private intoLobby(data): void {
            // 大厅位置
            CommonData.lastStopPosition = 1;
            CommonData.delayedExeAfterLoginIntoLobbyID++;

            // 去除遮罩
            ReqLoadingViewUtil.delReqLoadingView();
            // CommonHandler.delNetConnectMask();

            // 游戏状态
            // GameConstant.CURRENT_HANDLE.setGameState(EGameState.NULL);
            RFGameHandle.setGameState(EGameState.NULL);
            MahjongHandler.setGameState(EGameState.NULL);

            //播放背景音乐
            SoundManager.playBg("lobby_bg_mp3");
            // //大厅基础界面
            // let vLobbyBaseView: LobbyBaseView = LobbyBaseView.getInstance();
            // //大厅左上角界面
            // let vLobbyLeftTopView: LobbyLeftTopView = LobbyLeftTopView.getInstance();
            // //大厅右上角界面
            // let vLobbyRightTopView: LobbyRightTopView = LobbyRightTopView.getInstance();

            // //第一次进入增加缓动
            // if (LobbyCmd.pIsTween) {
            //     vLobbyBaseView.addTween = [
            //         { target: "leftNoticeGroup", data: [{ left: -260 }, { left: 15 }, 1000, Game.Ease.quintOut] },
            //         { target: "bottomGroup", data: [{ bottom: -65 }, { bottom: 0 }, 1000, Game.Ease.quintOut] }
            //     ];
            //     vLobbyLeftTopView.addTween = [{ data: [{ top: -106 }, { top: 0 }, 1000, Game.Ease.quintOut] }];
            //     vLobbyRightTopView.addTween = [{ data: [{ top: -106 }, { top: 0 }, 1000, Game.Ease.quintOut] }];
            // } else {
            //     vLobbyBaseView.addTween = vLobbyLeftTopView.addTween = vLobbyRightTopView.addTween = null;
            // }

            //大厅基础界面（重新设计）
            let vLobbyBaseView: LobbyBaseRedesignView = LobbyBaseRedesignView.getInstance();

            //第一次进入增加缓动
            if (LobbyCmd.pIsTween) {
                vLobbyBaseView.addTween = [
                    // { target: "leftNoticeGroup", data: [{ left: -260 }, { left: 15 }, 1000, Game.Ease.quintOut] },
                    { target: "bottomGroup", data: [{ bottom: -130 }, { bottom: -65 }, 1000, Game.Ease.quintOut] },
                    { target: "topGroup", data: [{ top: -65 }, { top: 0 }, 1000, Game.Ease.quintOut] },
                    { target: "leftGroup", data: [{ left: -65 }, { left: 11 }, 1000, Game.Ease.quintOut] },
                    { target: "rightGroup", data: [{ right: -65 }, { right: 23 }, 1000, Game.Ease.quintOut] }
                ];
            } else {
                vLobbyBaseView.addTween = null;
            }
            //添加界面，注意添加顺序
            MvcUtil.addView(FL.ViewManager.getLobbyBg());
            MvcUtil.addView(vLobbyBaseView);
            // MvcUtil.addView(vLobbyLeftTopView);
            // MvcUtil.addView(vLobbyRightTopView);
            //移除是否第一次进入代理模块缓存
            // egret.localStorage.removeItem("firstIntoAgent");

            //移除玩家信息方位缓存
            egret.localStorage.removeItem("PlayerInfoOrientation");

            if (LobbyCmd.pIsTween) {
                if (LobbyData.noticeIsExit == 1) {
                    FL.MyCallBackUtil.delayedCallBack(500, this.showNotice, this);
                }

                if (LobbyData.playerVO.parentIndex === 0) {
                    MvcUtil.send(LobbyModule.LOBBY_BIND_CODE);
                }

                FL.MyCallBackUtil.delayedCallBack(500, () => {
                    // 获取剪贴板内容
                    let jsonData = {
                        "eventType": SendNativeMsgType.SEND_NATIVE_GET_CLIPBOARD,
                        "data": {
                        }
                    }
                    NativeBridge.getInstance().sendNativeMessage(JSON.stringify(jsonData));

                    FL.MyCallBackUtil.delayedCallBack(300, () => {
                        // 获魔窗内容
                        let jsonDataMW = {
                            "eventType": SendNativeMsgType.SEND_NATIVE_GET_MW_PARAM,
                            "data": {
                            }
                        }
                        NativeBridge.getInstance().sendNativeMessage(JSON.stringify(jsonDataMW));
                    }, this);
                    
                }, this);
            }

            //之后不需要增加缓动
            LobbyCmd.pIsTween = false;
            //设置分享内容
            WeChatJsSdkHandler.setShareLocation(ShareLocationEnum.LOBBY);

            // 停止回放
            // if (GameConstant.CURRENT_HANDLE.isReplay()) {
            //     (GameConstant.CURRENT_GAMETYPE == EGameType.MAHJONG) ? MahjongLogReplay.endPlay() : RFGameLogReplay.endPlay();
            // }
            // 停止回放
            if(!MahjongHandler.isReplay()) MahjongLogReplay.endPlay();
            if(!RFGameHandle.isReplay()) RFGameLogReplay.endPlay();

            // 删除首页显示
            FL.IndexProxy.removeInitView();
        }

        /**
         * 显示公告
         */
        private showNotice() {
            ReminderViewUtil.showReminderView({ hasLeftBtn: true, hasRightBtn: false, text: LobbyData.noticeContent, titleImgSrc: LobbyData.noticeTitle });
            // MvcUtil.addView(new NoticeView(LobbyData.noticeContent));
        }

        /**
         * 显示分享界面
         */
        private showShareView(): void {
            let vShareView: ShareView = new ShareView();
            MvcUtil.addView(vShareView);
        }

        /**
         * 显示免费钻石界面
         */
        private showFreeDiamondView(): void {
            let vFreeDiamondView: FreeDiamondView = new FreeDiamondView();
            MvcUtil.addView(vFreeDiamondView);
        }

        /**
         * 跳转更多游戏下载页
         */
        private openDownloadPage(): void {
            window.location.href = GConf.Conf.moreGameUrl;
        }

    }

}