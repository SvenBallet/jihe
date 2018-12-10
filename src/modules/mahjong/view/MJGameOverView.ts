module FL {

    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase - MJGameOverView
     * @Description:  //麻将游戏结束界面
     * @Create: DerekWu on 2017/12/6 17:11
     * @Version: V1.0
     */
    export class MJGameOverView extends BaseView {

        /** 单例 */
        private static _onlyOne: MJGameOverView;

        //调停者名字，删除界面的时候会自动移除
        public readonly mediatorName: string = "";
        //界面层级，UI框架自动管理
        public readonly viewLayer: ViewLayerEnum = ViewLayerEnum.BOTTOM_ONLY;

        /** 做屏幕适配居中显示 */
        // public baseGroup:eui.Group;

        /** title 背景 不同的结果显示不同的背景 */
        public titleBgImg: eui.Image;
        /** title 左右装饰 */
        public titleDecorateLeft: eui.Image;
        public titleDecorateRight: eui.Image;
        /** title 文字图片 */
        public titleTextImg: eui.Image;

        /** 癞子标志 */
        public laiziFlag: eui.Group;

        /** 返回大厅按钮 */
        public backLobbyBtn: eui.Image;
        /** 查看计分明细按钮 */
        public viewDetailBtn: GameButton;
        /** 继续按钮 */
        public continueBtn: GameButton;
        /** 分享按钮 */
        public shareBtn: GameButton;

        /** 玩家信息，座位0-3 */
        public playerItemPos0: MJGameOverItem;
        public playerItemPos1: MJGameOverItem;
        public playerItemPos2: MJGameOverItem;
        public playerItemPos3: MJGameOverItem;

        /** 玩法描述  和 时间房号 */
        public wanfaLabal: eui.Label;
        public timeAndRoomIdLabal: eui.Label;

        /** 游戏结束消息 */
        private _gameOverMsg: PlayerGameOverMsgAck;

        /** 新的游戏结束消息 */
        private _newGameOverMsg: MahjongGameOverMsgAck;

        private constructor() {
            super();
            this.left = this.right = this.top = this.bottom = 0;
            this.skinName = "skins.MJGameOverViewSkin";
            //不可触摸
            this.touchEnabled = false;

            this.addEventListener(egret.Event.REMOVED_FROM_STAGE,this.onRemove,this);
        }

        private onRemove() {
            let self = this;
            self.playerItemPos0.clearHeadImg();
            self.playerItemPos1.clearHeadImg();
            self.playerItemPos2.clearHeadImg();
            self.playerItemPos3.clearHeadImg();
        }

        public static getInstance(): MJGameOverView {
            if (!this._onlyOne) {
                this._onlyOne = new MJGameOverView();
            }
            return this._onlyOne;
        }

        protected createChildren(): void {
            super.childrenCreated();
            let self = this;
            //注册按钮点击缓动
            TouchTweenUtil.regTween(self.backLobbyBtn, self.backLobbyBtn);
            TouchTweenUtil.regTween(self.viewDetailBtn, self.viewDetailBtn);
            TouchTweenUtil.regTween(self.continueBtn, self.continueBtn);
            TouchTweenUtil.regTween(self.shareBtn, self.shareBtn);
            //注册按钮点击事件
            self.backLobbyBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, self.backLobby, self);
            self.viewDetailBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, self.viewDetail, self);
            self.continueBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, self.continue, self);
            self.shareBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, self.share, self);
            Game.CommonUtil.addTapGap(self.shareBtn, 3500);
        }

        /** 从舞台移除以后框架自动调用 */
        protected onRemView(): void {
            this._gameOverMsg = null;
            this._newGameOverMsg = null;
        }

        /**
         * 重置界面
         * @param {FL.PlayerGameOverMsgAck} pGameOverMsg
         */
        public resetView(pGameOverMsg: PlayerGameOverMsgAck): void {
            let self = this;
            //设置值，以供后面使用
            self._gameOverMsg = pGameOverMsg;
            //设置title部分
            self.handleTitle();
            //判断是否显示返回大厅按钮，VIP房间则不显示，否则显示
            if (pGameOverMsg.isVipTable) {
                ViewUtil.removeChild(self, self.backLobbyBtn);
            } else {
                ViewUtil.addChild(self, self.backLobbyBtn);
            }
            //癞子标志牌
            let vLaiziFlagCardNum: number = MahjongHandler.getLaiziFlagCardNum();
            if (vLaiziFlagCardNum !== 0) {
                //有癞子则添加
                let laiziItem: MahjongCardItem = MahjongCardManager.getMahjongCommonCard(vLaiziFlagCardNum, self.laiziFlag.width, self.laiziFlag.height);
                self.laiziFlag.addChild(laiziItem);
                ViewUtil.addChild(self, self.laiziFlag);
            } else {
                //无赖子则删除
                ViewUtil.removeChild(self, self.laiziFlag);
            }

            // 计分明细按钮是否显示
            if (pGameOverMsg.scoreDetail) {
                self.viewDetailBtn.visible = true;
            } else {
                self.viewDetailBtn.visible = false;
            }

            //是否是VIP房间结束，是的话将继续按钮文字改为“牌局结算”,否则改为继续
            // egret.log("pGameOverMsg.stage="+pGameOverMsg.stage);
            // if (pGameOverMsg.stage === 1) {
            //     self.continueBtn.label = "牌局结算";
            // } else {
            //     self.continueBtn.label = "继续";
            // }
            //设置玩法
            self.wanfaLabal.text = MJGameHandler.getMJGameNameText() + " " + MJGameHandler.getWanfaSubDescStrNoPersonNum().replace(/\n/g, " ");
            //时间和房间号
            let vServerTime: number = ServerUtil.getServerTime();
            let vCurrDateStr = StringUtil.formatDate("yyyy-MM-dd hh:mm", new Date(vServerTime));
            if (MJGameHandler.isVipRoom()) {
                vCurrDateStr += "   房间号：" + MJGameHandler.getVipRoomId();
            } else {
                //金币场，设置玩法
                Storage.setGoldPlayWay(MJRoomID.ZHUAN_ZHUAN);
            }
            self.timeAndRoomIdLabal.text = vCurrDateStr;

            // 按钮名字
            if (MJGameHandler.getRemainGameCount() === 0) {
                self.continueBtn.labelDisplay.text = "查看牌局结算";
            } else {
                self.continueBtn.labelDisplay.text = "继续游戏";
            }

            // 分享按钮
            // APPSTORE屏蔽
            if (Game.CommonUtil.isNative && !NativeBridge.IOSMask) {
                this.shareBtn.visible = true;
                this.shareBtn.labelDisplay.text = "分享";
            }
            else {
                this.shareBtn.visible = false;
            }

            //重置各个条目
            self.playerItemPos0.resetItem(pGameOverMsg, pGameOverMsg.players[0]);
            self.playerItemPos1.resetItem(pGameOverMsg, pGameOverMsg.players[1]);
            self.playerItemPos2.resetItem(pGameOverMsg, pGameOverMsg.players[2]);
            self.playerItemPos3.resetItem(pGameOverMsg, pGameOverMsg.players[3]);

        }

        /**
         * 新的重置界面
         * @param {FL.PlayerGameOverMsgAck} pGameOverMsg
         */
        public newResetView(pNewGameOverMsg: MahjongGameOverMsgAck): void {
            let self = this;
            console.log(pNewGameOverMsg);
            //设置值，以供后面使用
            self._newGameOverMsg = pNewGameOverMsg;
            //设置title部分
            self.newHandleTitle();
            //判断是否显示返回大厅按钮，VIP房间则不显示，否则显示
            if (self._newGameOverMsg.vipRoomID > 0) {
                self.backLobbyBtn.visible = false;
                // ViewUtil.removeChild(self, self.backLobbyBtn);
            } else {
                self.backLobbyBtn.visible = true;
                // ViewUtil.addChild(self, self.backLobbyBtn);
            }
            //癞子标志牌
            let vLaiziFlagCardNum: number = self._newGameOverMsg.flagCard;
            if (vLaiziFlagCardNum !== 0) {
                //有癞子则添加
                let laiziItem: MahjongCardItem = MahjongCardManager.getMahjongCommonCard(vLaiziFlagCardNum, self.laiziFlag.width, self.laiziFlag.height);
                self.laiziFlag.addChild(laiziItem);
                self.laiziFlag.visible = true;
                // ViewUtil.addChild(self, self.laiziFlag);
            } else {
                //无赖子则删除
                // ViewUtil.removeChild(self, self.laiziFlag);
                self.laiziFlag.visible = false;
            }

            // 计分明细按钮是否显示
            if (self._newGameOverMsg.scoreDetails && self._newGameOverMsg.scoreDetails.length > 0) {
                self.viewDetailBtn.visible = true;
            } else {
                self.viewDetailBtn.visible = false;
            }

            //是否是VIP房间结束，是的话将继续按钮文字改为“牌局结算”,否则改为继续
            // egret.log("pGameOverMsg.stage="+pGameOverMsg.stage);
            if (MahjongHandler.isVipRoom()) {
                if (self._newGameOverMsg.isRoomOver) {
                    self.continueBtn.label = "查看牌局结算";
                } else {
                    self.continueBtn.label = "继续游戏";
                }
            } else {
                self.continueBtn.label = "继续游戏";
            }

            //设置玩法
            self.wanfaLabal.text = MahjongHandler.getMJGameNameText() + " " + MahjongHandler.getWanfaSubDescStrNoPersonNum().replace(/\n/g, " ");
            //时间和房间号
            //let vServerTime: number = ServerUtil.getServerTime();
            let vCurrDateStr = StringUtil.formatDate("yyyy-MM-dd hh:mm", new Date(self._newGameOverMsg.overTimes.toNumber()));
            if (MahjongHandler.isVipRoom()) {
                vCurrDateStr += "   房间号：" + MahjongHandler.getVipRoomId();
            } else {
                //金币场，设置玩法，新版本没有。。。
                // Storage.setGoldPlayWay(MahjongHandler.getMainGamePlayRule());
            }
            self.timeAndRoomIdLabal.text = vCurrDateStr;

            // 分享按钮
            // APPSTORE屏蔽
            if (Game.CommonUtil.isNative && !NativeBridge.IOSMask) {
                this.shareBtn.visible = true;
                this.shareBtn.labelDisplay.text = "分享";
            }
            else {
                this.shareBtn.visible = false;
            }

            //重置各个条目
            self.playerItemPos0.newResetItem(self._newGameOverMsg, self._newGameOverMsg.playerInfos[0]);
            self.playerItemPos1.newResetItem(self._newGameOverMsg, self._newGameOverMsg.playerInfos[1]);
            self.playerItemPos2.newResetItem(self._newGameOverMsg, self._newGameOverMsg.playerInfos[2]);
            self.playerItemPos3.newResetItem(self._newGameOverMsg, self._newGameOverMsg.playerInfos[3]);

        }

        /**
         * 处理头部title
         */
        private handleTitle(): void {
            let self = this;
            //获得玩家自己的信息
            let vMyPos: number = MJGameHandler.getTablePos(PZOrientation.DOWN);
            let vMySimplePlayer: SimplePlayer = self._gameOverMsg.getSimplePlayerByPos(vMyPos);
            if (self._gameOverMsg.huPos < 0) {
                //没人胡 流局
                self.setTitle("gos_lt_bg_png", "gos_title_lj_png", "gos_lt_png");
            } else if (vMySimplePlayer.gold === 0) {
                //不输不赢
                self.setTitle("gos_lt_bg_png", "gos_title_bsby_png", "gos_lt_png");
            } else if (NumberUtil.isAndNumber(vMySimplePlayer.gameResult, GameConstant.MAHJONG_HU_CODE_ZI_MO)) {
                //自摸
                self.setTitle("gos_red_bg_png", "gos_title_zm_png", "gos_red_png");
            } else if (NumberUtil.isAndNumber(vMySimplePlayer.gameResult, GameConstant.MAHJONG_HU_CODE_WIN)) {
                //胡牌，别人放炮给你胡
                self.setTitle("gos_red_bg_png", "gos_title_hp_png", "gos_red_png");
            } else if (NumberUtil.isAndNumber(vMySimplePlayer.gameResult, GameConstant.MAHJONG_HU_CODE_DIAN_PAO)) {
                //点炮
                self.setTitle("gos_ht_bg_png", "gos_title_dp_png", "gos_ht_png");
            } else {
                //输了
                self.setTitle("gos_ht_bg_png", "gos_title_sl_png", "gos_ht_png");
            }
            //播放音效
            if (vMySimplePlayer.gold > 0) {
                //赢了
                SoundManager.playEffect("win_mp3");
            } else {
                //输了
                SoundManager.playEffect("lost_mp3");
            }
        }

        /**
         * 处理头部title
         */
        private newHandleTitle(): void {
            let self = this;
            //获得玩家自己的信息
            // let vMyPos: number = MJGameHandler.getTablePos(PZOrientation.DOWN);
            // let vMySimplePlayer: SimplePlayer = self._gameOverMsg.getSimplePlayerByPos(vMyPos);
            /** 我的游戏结果（1=自摸 2=胡牌（接炮） 3=点炮 4=赢了 5=不输不赢 6=输了 7=流局） */
            let vMyGameResult: number = self._newGameOverMsg.myGameResult;
            if (vMyGameResult === 7) {
                //没人胡 流局
                self.setTitle("gos_lt_bg_png", "gos_title_lj_png", "gos_lt_png");
            } else if (vMyGameResult === 5) {
                //不输不赢
                self.setTitle("gos_lt_bg_png", "gos_title_bsby_png", "gos_lt_png");
            } else if (vMyGameResult === 1) {
                //自摸
                self.setTitle("gos_red_bg_png", "gos_title_zm_png", "gos_red_png");
            } else if (vMyGameResult === 2) {
                //胡牌，别人放炮给你胡
                self.setTitle("gos_red_bg_png", "gos_title_hp_png", "gos_red_png");
            } else if (vMyGameResult === 3) {
                //点炮
                self.setTitle("gos_ht_bg_png", "gos_title_dp_png", "gos_ht_png");
            } else if (vMyGameResult === 4) {
                // 赢了
                self.setTitle("gos_red_bg_png", "gos_title_yl_png", "gos_red_png");
            } else {
                //输了
                self.setTitle("gos_ht_bg_png", "gos_title_sl_png", "gos_ht_png");
            }
            // 获得分数
            let vMahjongGameOverPlayerInfo: MahjongGameOverPlayerInfo = null;
            for (let vIndex: number = 0; vIndex < self._newGameOverMsg.playerInfos.length; ++vIndex) {
                if (self._newGameOverMsg.myTablePos === self._newGameOverMsg.playerInfos[vIndex].tablePos) {
                    vMahjongGameOverPlayerInfo = self._newGameOverMsg.playerInfos[vIndex];
                    break;
                }
            }
            let vScore: number = vMahjongGameOverPlayerInfo.score;
            //播放音效
            if (vScore > 0) {
                //赢了
                SoundManager.playEffect("win_mp3");
            } else {
                //输了
                SoundManager.playEffect("lost_mp3");
            }
        }

        /**
         * 设置title
         * @param {string} bgImgRes
         * @param {string} titleTextImgRes
         * @param {string} decorate
         */
        private setTitle(bgImgRes: string, titleTextImgRes: string, decorateRes: string): void {
            let self = this;
            self.titleBgImg.source = bgImgRes;
            self.titleTextImg.source = titleTextImgRes;
            self.titleDecorateLeft.source = decorateRes;
            self.titleDecorateRight.source = decorateRes;
        }

        /**
         * 返回大厅
         * @param {egret.TouchEvent} e
         */
        private backLobby(e: egret.TouchEvent): void {
            // 给服务器发送消息
            if (!this._newGameOverMsg) {
                //给服务器发送消息
                // let msg = new NewPlayerLeaveRoomMsg();
                // msg.leaveFlag = 0;
                // ServerUtil.sendMsg(msg);
                // // 老版本处理
                // let vPlayerGameOpertaionMsg: PlayerGameOpertaionMsg = new PlayerGameOpertaionMsg();
                // vPlayerGameOpertaionMsg.opertaionID = GameConstant.GAME_OPERTAION_PLAYER_LEFT_TABLE;
                // ServerUtil.sendMsg(vPlayerGameOpertaionMsg);
            }
            MvcUtil.send(LobbyModule.LOBBY_INTO_LOBBY);
        }

        /**
         * 查看计分明细
         */
        private viewDetail(e: egret.TouchEvent): void {
            if (!this._newGameOverMsg) {
                // let vMJGameOverDetailView: MJGameOverDetailView = new MJGameOverDetailView(this._gameOverMsg);
                // MvcUtil.addView(vMJGameOverDetailView);
            } else {
                // 新版本计分明细
                let vMJGameOverDetailView: MJGameOverDetailView = new MJGameOverDetailView(this._newGameOverMsg);
                MvcUtil.addView(vMJGameOverDetailView);
            }
        }

        /**
         * 继续
         * @param {egret.TouchEvent} e
         */
        private continue(e: egret.TouchEvent): void {
            // if (this._gameOverMsg.stage === 1) {
            //     //进入牌局结算
            //     PromptUtil.show("该功能暂未实现！", "pField");
            // } else {
            if (!this._newGameOverMsg) {
                // 老版本
                if (MJGameHandler.isVipRoom()) {
                    if (MJGameHandler.getRemainGameCount() === 0) {
                        // 打开大结算界面
                        MvcUtil.send(MJGameModule.MJGAME_VIP_ROOM_CLOSE);
                    } else {
                        //给服务器发送消息
                        // let vPlayerTableOperationMsg: PlayerTableOperationMsg = new PlayerTableOperationMsg();
                        // vPlayerTableOperationMsg.operation = GameConstant.MAHJONG_OPERTAION_GAME_OVER_CONTINUE;
                        // ServerUtil.sendMsg(vPlayerTableOperationMsg, MsgCmdConstant.MSG_GAME_START_GAME_REQUEST_ACK);

                        // 新协议
                        let vNewIntoOldGameTableMsg: NewIntoOldGameTableMsg = new NewIntoOldGameTableMsg();
                        ServerUtil.sendMsg(vNewIntoOldGameTableMsg, MsgCmdConstant.MSG_INTO_GAME_TABLE);
                    }
                } else {//金币场
                    let vNewIntoGoldGameSceneMsg: NewIntoGoldGameSceneMsg = new NewIntoGoldGameSceneMsg();
                    vNewIntoGoldGameSceneMsg.goldGameSceneRoomID = Storage.getGoldPlayWay();
                    ServerUtil.sendMsg(vNewIntoGoldGameSceneMsg, MsgCmdConstant.MSG_SHOW_TIP_MSG_ACK_NEW);
                }
            } else {
                // 新版本
                if (this._newGameOverMsg.vipRoomID > 0) {
                    if (this._newGameOverMsg.isRoomOver) {
                        // 打开大结算界面
                        // MvcUtil.send(MahjongModule.MAHJONG_OPEN_ROOM_OVER_VIEW);
                        MvcUtil.send(RFGameModule.RFGAME_OPEN_ROOM_OVER_VIEW);
                    } else {
                        // 新协议
                        let vNewIntoOldGameTableMsg: NewIntoOldGameTableMsg = new NewIntoOldGameTableMsg();
                        ServerUtil.sendMsg(vNewIntoOldGameTableMsg, MsgCmdConstant.MSG_INTO_GAME_TABLE);
                    }
                } else {//金币场
                    let vNewIntoGoldGameSceneMsg: NewIntoGoldGameSceneMsg = new NewIntoGoldGameSceneMsg();
                    vNewIntoGoldGameSceneMsg.goldGameSceneRoomID = this._newGameOverMsg.roomID;
                    ServerUtil.sendMsg(vNewIntoGoldGameSceneMsg, MsgCmdConstant.MSG_SHOW_TIP_MSG_ACK_NEW);
                }
            }

        }

        /**
         * 分享
         * @param {egret.TouchEvent} e
         */
        private share(e: egret.TouchEvent): void {
            // 茶楼房间并且开启了不允许分享
            // let vNewIntoGameTableMsgAck: NewIntoGameTableMsgAck = GameConstant.CURRENT_HANDLE.getRequestStartGameMsgAck();
            // if (vNewIntoGameTableMsgAck && vNewIntoGameTableMsgAck.teaHouseId && (vNewIntoGameTableMsgAck.forbidShare != 1)) {
            //     let params = {
            //         hasLeftBtn: true,
            //         text: "该茶楼设置不允许分享"
            //     }
            //     ReminderViewUtil.showReminderView(params);
            //     return;
            // }

            let rt: egret.RenderTexture = new egret.RenderTexture;
            rt.drawToTexture(this, new egret.Rectangle(0, 0, this.width, this.height));
            let base64Data = rt.toDataURL("image/jpeg");

            let shareData = new nativeShareData();
            shareData.type = ShareWXType.SHARE_IMG;
            shareData.baseStr = base64Data;
            NativeBridge.getInstance().mShareData = shareData;

            MvcUtil.send(CommonModule.COMMON_NATIVE_SHARE_CHOOSE_ROAD);
        }
    }

}