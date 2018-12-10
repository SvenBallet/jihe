module FL {
    export class RFGameOverView extends BaseView {
        /** 单例 */
        private static _onlyOne: RFGameOverView;

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


        /** 返回大厅按钮 */
        public backLobbyBtn: eui.Image;
        /** 查看计分明细按钮 */
        public viewDetailBtn: GameButton;
        /** 继续按钮 */
        public continueBtn: GameButton;
        /** 分享按钮 */
        public shareBtn: GameButton;

        /** 玩家信息，座位0-3 */
        public playerItemPos0: RFGameOverItem;
        public playerItemPos1: RFGameOverItem;
        public playerItemPos2: RFGameOverItem;
        public playerItemPos3: RFGameOverItem;

        /** 玩法描述  和 时间房号 */
        public wanfaLabal: eui.Label;
        public timeAndRoomIdLabal: eui.Label;

        public gameOverMsg: PaoDeKuaiGameOverSettleAccountsMsgAck;

        private constructor() {
            super();
            // this.verticalCenter = this.horizontalCenter = 0;
            this.left = this.right = this.top = this.bottom = 0;
            this.skinName = "skins.RFGameOverViewSkin";
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

        public static getInstance(): RFGameOverView {
            if (!this._onlyOne) {
                this._onlyOne = new RFGameOverView();
            }
            return this._onlyOne;
        }

        protected childrenCreated() {
            super.childrenCreated();
            let self = this;
            //注册按钮点击缓动
            TouchTweenUtil.regTween(self.backLobbyBtn, self.backLobbyBtn);
            // TouchTweenUtil.regTween(self.viewDetailBtn, self.viewDetailBtn);
            TouchTweenUtil.regTween(self.continueBtn, self.continueBtn);
            TouchTweenUtil.regTween(self.shareBtn, self.shareBtn);
            //注册按钮点击事件
            self.backLobbyBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, self.backLobby, self);
            // self.viewDetailBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, self.viewDetail, self);
            self.continueBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, self.continue, self);
            self.shareBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, self.share, self);
            Game.CommonUtil.addTapGap(self.shareBtn, 3500);
        }

        /**
         * 重置页面
         */
        public resetView(pGameOverMsg: PaoDeKuaiGameOverSettleAccountsMsgAck) {
            let self = this;
            //判断是否显示返回大厅按钮，VIP房间则不显示，否则显示
            self.gameOverMsg = pGameOverMsg;
            if (RFGameHandle.isVipRoom()) {
                self.backLobbyBtn.visible = false;
                // ViewUtil.removeChild(self, self.backLobbyBtn);
            } else {
                self.backLobbyBtn.visible = true;
                // ViewUtil.addChild(self, self.backLobbyBtn);
            }

            //处理头部title
            self.handleTitle(pGameOverMsg.result);

            //设置玩法
            let minorRuleStr = GameHandler.handleMinorRuleListData(pGameOverMsg.subGamePlayRuleList, pGameOverMsg.mainGamePlayRule).shortStrArray.join(" ");
            self.wanfaLabal.text = RFGameHandle.getCardGameNameText() + " " + minorRuleStr;

            //时间和房间号
            let vServerTime: number = ServerUtil.getServerTime();
            let vCurrDateStr = StringUtil.formatDate("yyyy-MM-dd hh:mm", new Date(vServerTime));
            if (RFGameHandle.isVipRoom()) {
                vCurrDateStr += "   房间号：" + pGameOverMsg.vipRoomID;
            } else {
                //金币场
                // let value;
                // if (pGameOverMsg.mainGamePlayRule == ECardGamePlayWay.JING_DIAN_PAO_DE_KUAI) {
                //     value = MJRoomID.JING_DIAN_PAO_DE_KUAI;
                // } else if (pGameOverMsg.mainGamePlayRule == ECardGamePlayWay.SHI_WU_ZHANG_PAO_DE_KUAI) {
                //     value = MJRoomID.SHI_WU_ZHANG_PAO_DE_KUAI;
                // }
                // Storage.setGoldPlayWay(value);
            }
            self.timeAndRoomIdLabal.text = vCurrDateStr;

            if (RFGameHandle.isVipRoom()) {
                // 按钮名字
                if (pGameOverMsg.isRoomOver) {
                    self.continueBtn.labelDisplay.text = "查看牌局结算";
                } else {
                    self.continueBtn.labelDisplay.text = "继续游戏";
                }
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
            self.playerItemPos0.resetItem(pGameOverMsg, pGameOverMsg.playerInfos[0]);
            self.playerItemPos1.resetItem(pGameOverMsg, pGameOverMsg.playerInfos[1]);
            if (!pGameOverMsg.playerInfos[2] && pGameOverMsg.residueCards && pGameOverMsg.residueCards.length > 0) {
                self.playerItemPos2.resetItem(pGameOverMsg, pGameOverMsg.playerInfos[2], true);
            }
            else {
                self.playerItemPos2.resetItem(pGameOverMsg, pGameOverMsg.playerInfos[2]);
            }
            self.playerItemPos3.resetItem(pGameOverMsg, pGameOverMsg.playerInfos[3]);
        }

        /**
         * 处理头部title
         */
        private handleTitle(result): void {
            let self = this;
            //获得玩家自己的信息

            if (result === 1) {
                //赢了
                self.setTitle("gos_red_bg_png", "gos_title_yl_png", "gos_red_png");
            } else if (result === 0) {
                //不输不赢
                self.setTitle("gos_lt_bg_png", "gos_title_bsby_png", "gos_lt_png");
            } else {
                //输了
                self.setTitle("gos_ht_bg_png", "gos_title_sl_png", "gos_ht_png");
            }
            //播放音效
            if (result === 1) {
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
            // let vPlayerGameOpertaionMsg: PlayerGameOpertaionMsg = new PlayerGameOpertaionMsg();
            // vPlayerGameOpertaionMsg.opertaionID = GameConstant.GAME_OPERTAION_PLAYER_LEFT_TABLE;
            // ServerUtil.sendMsg(vPlayerGameOpertaionMsg);
            MvcUtil.send(LobbyModule.LOBBY_INTO_LOBBY);
        }

        /**
      * 继续
      * @param {egret.TouchEvent} e
      */
        private continue(e: egret.TouchEvent): void {
            if (RFGameHandle.isVipRoom()) {
                if (this.gameOverMsg.isRoomOver) {
                    // 打开大结算界面
                    MvcUtil.send(RFGameModule.RFGAME_OPEN_ROOM_OVER_VIEW);
                } else {
                    //给服务器发送消息
                    let vNewIntoOldGameTableMsg: NewIntoOldGameTableMsg = new NewIntoOldGameTableMsg();
                    ServerUtil.sendMsg(vNewIntoOldGameTableMsg);
                }
            } else {
                let vNewIntoGoldGameSceneMsg: NewIntoGoldGameSceneMsg = new NewIntoGoldGameSceneMsg();
                vNewIntoGoldGameSceneMsg.goldGameSceneRoomID = Storage.getGoldPlayWay();
                ServerUtil.sendMsg(vNewIntoGoldGameSceneMsg, MsgCmdConstant.MSG_SHOW_TIP_MSG_ACK_NEW);
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