module FL {
    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase_ChangSha - MahjongCmd
     * @Description:  麻将指令
     * @Create: ArielLiang on 2018/5/31 11:59
     * @Version: V1.0
     */
    export class MahjongCmd extends puremvc.SimpleCommand implements puremvc.ICommand {

        public constructor() {
            super();
        }

        public execute(notification: puremvc.INotification): void {
            let data: any = notification.getBody();
            switch (notification.getName()) {
                case MahjongModule.MAHJONG_INTO_GAME: {
                    this.intoMJGame();
                    break;
                }
                case MahjongModule.MAHJONG_START_GAME: {
                    this.startMJGame();
                    break;
                }
                case MahjongModule.MAHJONG_CHOOSE_PIAO: {
                    this.choosePiao();
                    break;
                }
                case MahjongModule.MAHJONG_START_ZHUA_NIAO: {
                    this.zhuaNiao(data);
                    break;
                }
                case MahjongModule.MAHJONG_OPEN_GAME_OVER_VIEW: {
                    this.openGameOverView();
                    break;
                }
                case MahjongModule.MAHJONG_SHOW_SELECT_ACTION_VIEW: {
                    this.showSelectActionView(data);
                    break;
                }
                case MahjongModule.MAHJONG_OPEN_ROOM_OVER_VIEW: {
                    this.openRoomOverView(data);
                    break;
                }
            }
        }

        private intoMJGame(): void {
            //播放背景音乐
            SoundManager.playBg("game_bg_mp3");
            //设置当前游戏操作类型
            GameConstant.setCurrentGame(EGameType.MAHJONG);
            //添加牌桌背景
            MvcUtil.addView(ViewManager.getTableBoardBg());
            //添加牌桌基础界面
            let vTableBoardBaseView: MahjongTableBaseView = MahjongTableBaseView.getInstance();
            vTableBoardBaseView.intoTableBoard();
            MvcUtil.addView(vTableBoardBaseView);
            //添加操作界面
            let vTableBoardHandleView: MahjongTableHandleView = MahjongTableHandleView.getInstance();
            vTableBoardHandleView.intoTableBoard();
            MvcUtil.addView(vTableBoardHandleView);

            // 特效表现层
            let vTableBoardEffectView: MahjongTableEffectView = MahjongTableEffectView.getInstance();
            vTableBoardEffectView.startGame();
            MvcUtil.addView(vTableBoardEffectView);

            if (!MahjongHandler.isReplay() && MahjongHandler.isVipRoom()) {
                //设置分享内容
                WeChatJsSdkHandler.setShareLocation(ShareLocationEnum.VIP_ROOM);
            } else {
                //设置分享内容
                WeChatJsSdkHandler.setShareLocation(ShareLocationEnum.LOBBY);
            }
            //添加滚动公告栏
            MvcUtil.send(MJGameModule.MJGAME_ADD_SCROLL_MSG);

            // 停止回放
            if (!MahjongHandler.isReplay()) {
                MahjongLogReplay.endPlay();
            }

            // 删除首页显示
            FL.IndexProxy.removeInitView();
        }



        /**
         * 开始麻将游戏
         */
        private startMJGame(): void {
            // 播放背景音乐
            SoundManager.playBg("game_bg_mp3");
            //添加牌桌背景
            MvcUtil.addView(ViewManager.getTableBoardBg());

            // 移除BOTTOM层所有显示对象
            MvcUtil.addView(new DelLayerView(ViewLayerEnum.BOTTOM_ONLY));

            // 牌桌基础界面开始游戏
            let vTableBoardBaseView: MahjongTableBaseView = MahjongTableBaseView.getInstance();
            vTableBoardBaseView.startGame();
            MvcUtil.addView(vTableBoardBaseView);

            //中间时间界面
            let vTableBoardTimerView: MahjongTableTimerView = MahjongTableTimerView.getInstance();
            vTableBoardTimerView.startGame();
            MvcUtil.addView(vTableBoardTimerView);

            // 补花界面
            // let vTableBoardCardsHuaView: TableBoardCardsHuaView = TableBoardCardsHuaView.getInstance();
            // vTableBoardCardsHuaView.startGame();
            // MvcUtil.addView(vTableBoardCardsHuaView);

            // 中间出牌界面
            let vTableBoardCardsMiddleView: MahjongTableCardsMiddleView = MahjongTableCardsMiddleView.getInstance();
            MvcUtil.addView(vTableBoardCardsMiddleView);

            // 玩家手牌界面
            let vTableBoardCardsHandView: MahjongTableCardsHandView = MahjongTableCardsHandView.getInstance();
            MvcUtil.addView(vTableBoardCardsHandView);

            vTableBoardCardsMiddleView.startGame();
            vTableBoardCardsHandView.startGame();

            // 特效表现层
            let vTableBoardEffectView: MahjongTableEffectView = MahjongTableEffectView.getInstance();
            MvcUtil.addView(vTableBoardEffectView);
            vTableBoardEffectView.startGame();

            // 添加操作界面并开始游戏
            let vTableBoardHandleView: MahjongTableHandleView = MahjongTableHandleView.getInstance();
            MvcUtil.addView(vTableBoardHandleView);
            vTableBoardHandleView.startGame();

            // 如果是回放则添加回放操作界面
            if (MahjongHandler.isReplay()) {
                let vMJGameReplayHandleView: MJGameReplayHandleView = MJGameReplayHandleView.getInstance();
                MvcUtil.addView(vMJGameReplayHandleView);

                let vMJGameReplayRoundView: MJGameReplayRoundView = MJGameReplayRoundView.getInstance();
                MvcUtil.addView(vMJGameReplayRoundView);
            }

            // 初始化游戏本地数据
            MahjongHandler.initGameLocalData();

            MahjongData.isFirstEnter = false;


            //----test
            // let mm:MahjongDiuShaiZiMsgAck = new MahjongDiuShaiZiMsgAck();
            // let mahjongShaiZi:MahjongShaiZi = new MahjongShaiZi();
            // mahjongShaiZi.shaiZiNum1 = 2;
            // mahjongShaiZi.shaiZiNum2 = 4;
            // mahjongShaiZi.shaiZiNum3 = 0;
            // mahjongShaiZi.shaiZiNum4 = 0;
            // mm.mahjongShaiZi = mahjongShaiZi;
            // mm.beforeDiuShowTipDesc = "hello";
            // mm.afterDiuShowTipDesc = "over";
            // MvcUtil.send(MahjongModule.MAHJONG_THROW_SHAI_ZI,mm);
            // let mm:MahjongChangShaOpenSelectActionViewAfterGangMsgAck = new MahjongChangShaOpenSelectActionViewAfterGangMsgAck();
            // mm.card1 =1;
            // mm.card2 =2;
            // mm.gangPlayerPos=1;
            // mm.isOpenView = true;
            // mm.actionList = new Array<MahjongActionResult>();
            //
            // let info = new MahjongActionResult();
            // info.id = 123;
            // info.action = MahjongActionEnum.CHI;
            // info.targetCard = 1;
            // info.value = 197121;
            //
            // mm.actionList.push(info);
            // info = new MahjongActionResult();
            // info.id = 124;
            // info.action = MahjongActionEnum.CHI;
            // info.targetCard = 1;
            // info.value = 197123;
            // mm.actionList.push(info);
            // //
            // info = new MahjongActionResult();
            // info.id = 125;
            // info.action = MahjongActionEnum.PENG;
            // info.targetCard = 2;
            // info.value = 262914;
            // mm.actionList.push(info);
            // console.log(mm);
            // MvcUtil.send(MahjongModule.MAHJONG_SHOW_SELECT_ACTION_VIEW,mm);
            // MJGameData.isStartNiaoEffect = false;
            // this.playerZhongNiao([17, 1, 0, 7, 1, 0, 1, 1, 0, 37, 1, 0, 21, 1, 0, 17, 1, 0]);
            // MvcUtil.send(MJGameModule.MJGAME_PLAY_ZHONG_NIAO, [17, 1, 0, 7, 1, 0, 1, 1, 0, 37, 1, 0, 21, 1, 0, 17, 1, 0])
        }


        private choosePiao(): void {
            MvcUtil.addView(new MahjongChoosePiaoView());
        }

        private zhuaNiao(msg: MahjongGameOverZhuaNiaoMsgAck): void {
            egret.setTimeout(()=>{
                // 播放抓鸟前移除特效，如胡牌动画
                let vTableBoardEffectView: MahjongTableEffectView = MahjongTableEffectView.getInstance();
                vTableBoardEffectView.startGame();

                // 如果是回放
                if (MahjongHandler.isReplay()) {
                    if (msg.niaoPaiList.length > 0) {
                        // 鸟效果界面
                        let vTableBoardZhuaNiaoEffectView: TableBoardZhuaNiaoEffectView = new TableBoardZhuaNiaoEffectView(true, null, msg);
                        MvcUtil.addView(vTableBoardZhuaNiaoEffectView);
                    }
                    
                    return;
                }

                // 删除操作界面
                let vMahjongTableHandleView: MahjongTableHandleView = MahjongTableHandleView.getInstance();
                MvcUtil.delView(vMahjongTableHandleView);

                // 鸟效果界面
                let vTableBoardZhuaNiaoEffectView: TableBoardZhuaNiaoEffectView = new TableBoardZhuaNiaoEffectView(true, null, msg);
                MvcUtil.addView(vTableBoardZhuaNiaoEffectView);

                // 添加操作界面
                MvcUtil.addView(vMahjongTableHandleView);
            },this,500);
        }

        /**
         * 打开游戏结束界面
         */
        private openGameOverView(): void {
            let vMahjongGameOverMsgAck: MahjongGameOverMsgAck = MahjongHandler.getMahjongGameOverMsgAck();
            if (!vMahjongGameOverMsgAck) {
                // 打开的时候没有收到结束消息，那么当结束消息来的时候可以直接打开结束界面
                MahjongData.isCanShowGameOverViewByOverMsg = true;
                return;
            }

            //添加界面
            let vMJGameOverView: MJGameOverView = MJGameOverView.getInstance();
            vMJGameOverView.newResetView(vMahjongGameOverMsgAck);
            MvcUtil.addView(vMJGameOverView);

            if (MahjongHandler.isVipRoom()) {
                //设置分享内容
                WeChatJsSdkHandler.setShareLocation(ShareLocationEnum.VIP_ROOM_GAME_OVER);
            } else {
                //设置分享内容
                WeChatJsSdkHandler.setShareLocation(ShareLocationEnum.GOLD_GAME_OVER);
            }

            // 删除本地数据
            MJGameHandler.removeGameLocalData();
        }

        /** 打开游戏结算界面 */
        private openRoomOverView(msg) {
            if (!msg) {
                msg = RFGameHandle.getVipRoomCloseMsg();
            }
            console.log(msg);
            // 移除界面
            MvcUtil.addView(new DelLayerView(ViewLayerEnum.BOTTOM_ONLY));

            // 添加界面
            let vMJRoomOverView: MJRoomOverView = MJRoomOverView.getInstance();
            vMJRoomOverView.newResetView(msg);
            MvcUtil.addView(vMJRoomOverView);

            // 设置分享内容
            WeChatJsSdkHandler.setShareLocation(ShareLocationEnum.ROOM_OVER);

            // 删除本地数据
            MJGameHandler.removeGameLocalData();
        }

        /**
         * 杠后打开选择动作界面
         * @param {FL.MahjongChangShaOpenSelectActionViewAfterGangMsgAck} msg
         */
        private showSelectActionView(msg: MahjongChangShaOpenSelectActionViewAfterGangMsgAck): void {
            // egret.log(msg);
            let vMahjongSelectActionView: MahjongSelectActionView = MahjongSelectActionView.getInstance();
            if (msg.isOpenView && msg.actionList && msg.actionList.length > 0) {
                vMahjongSelectActionView.resetView(msg);
                MvcUtil.addView(vMahjongSelectActionView);
            } else {
                MvcUtil.delView(vMahjongSelectActionView);
            }
        }

    }
}