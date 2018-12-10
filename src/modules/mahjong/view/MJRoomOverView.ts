module FL {
    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase - MJRoomOverView
     * @Description:  //房间结束 牌局结算界面
     * @Create: DerekWu on 2017/12/9 15:17
     * @Version: V1.0
     */
    export class MJRoomOverView extends BaseView {

        /** 单例 */
        private static _onlyOne: MJRoomOverView;

        //调停者名字，删除界面的时候会自动移除
        public readonly mediatorName: string = "";
        //界面层级，UI框架自动管理
        public readonly viewLayer: ViewLayerEnum = ViewLayerEnum.POPUP_ONLY;

        /** 玩家信息 0-3 位置 */
        public playerInfoPos0: MJRoomOverItem;
        public playerInfoPos1: MJRoomOverItem;
        public playerInfoPos2: MJRoomOverItem;
        public playerInfoPos3: MJRoomOverItem;

        /** 房间号 */
        public roomNum: eui.Label;
        /** 时间 */
        public timeLabel: eui.Label;

        /** 分享按钮 */
        public shareBtn: GameButton;
        /** 返回大厅按钮 */
        public backLobbyBtn: GameButton;

        private constructor() {
            super();
            this.verticalCenter = this.horizontalCenter = 0;
            this.skinName = "skins.MJRoomOverViewSkin";
            //不可触摸
            this.touchEnabled = false;

            this.addEventListener(egret.Event.REMOVED_FROM_STAGE,this.onRemove,this);
        }

        private onRemove() {
            let self = this;
            self.playerInfoPos0.clearHeadImg();
            self.playerInfoPos1.clearHeadImg();
            self.playerInfoPos2.clearHeadImg();
            self.playerInfoPos3.clearHeadImg();
        }

        public static getInstance(): MJRoomOverView {
            if (!this._onlyOne) {
                this._onlyOne = new MJRoomOverView();
            }
            return this._onlyOne;
        }

        protected createChildren(): void {
            super.childrenCreated();
            let self = this;
            //注册按钮点击缓动
            TouchTweenUtil.regTween(self.backLobbyBtn, self.backLobbyBtn);
            TouchTweenUtil.regTween(self.shareBtn, self.shareBtn);
            //注册按钮点击事件
            self.backLobbyBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, self.backLobby, self);
            self.shareBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, self.share, self);

            // APPSTORE屏蔽
            if (NativeBridge.IOSMask) {
                self.shareBtn.visible = false;
            }
        }

        /**
         * 重置界面
         * @param {FL.VipRoomCloseMsg} pVipRoomCloseMsg
         */
        public resetView(pVipRoomCloseMsg: VipRoomCloseMsg): void {
            let self = this;
            //设置房号
            let vRoomNumTest: string = "";
            vRoomNumTest += "房间号：" + pVipRoomCloseMsg.unused_0;
            if (pVipRoomCloseMsg.roomType === 2) {
                vRoomNumTest += " 俱乐部房间"
            }
            // if (MJGameHandler.getRoo) {
            //
            // }
            self.roomNum.text = vRoomNumTest;
            //设置时间
            let vServerTime: number = ServerUtil.getServerTime();
            let vCurrDateStr = StringUtil.formatDate("yyyy-MM-dd hh:mm", new Date(vServerTime));
            self.timeLabel.text = vCurrDateStr;

            //设置玩家信息
            self.playerInfoPos0.resetItem(pVipRoomCloseMsg, pVipRoomCloseMsg.players[0]);
            self.playerInfoPos1.resetItem(pVipRoomCloseMsg, pVipRoomCloseMsg.players[1]);
            self.playerInfoPos2.resetItem(pVipRoomCloseMsg, pVipRoomCloseMsg.players[2]);
            self.playerInfoPos3.resetItem(pVipRoomCloseMsg, pVipRoomCloseMsg.players[3]);

        }

        /**
        * 重置界面（新）
        * @param {FL.VipRoomCloseMsg} pVipRoomCloseMsg
        */
        public newResetView(pVipRoomCloseMsg: NewVipRoomOverSettleAccountsMsgAck): void {
            let self = this;
            //设置房号
            let vRoomNumTest: string = "";
            vRoomNumTest += "房间号：" + pVipRoomCloseMsg.unused_0;
            if (pVipRoomCloseMsg.createType === 2) {
                vRoomNumTest += " 俱乐部房间"
            }
            // if (MJGameHandler.getRoo) {
            //
            // }
            self.roomNum.text = vRoomNumTest;
            //设置时间
            let vServerTime: number = ServerUtil.getServerTime();
            let vCurrDateStr = StringUtil.formatDate("yyyy-MM-dd hh:mm", new Date(vServerTime));
            self.timeLabel.text = vCurrDateStr;

            //设置玩家信息
            self.playerInfoPos0.newResetItem(pVipRoomCloseMsg, pVipRoomCloseMsg.roomOverPlayerInfos[0]);
            self.playerInfoPos1.newResetItem(pVipRoomCloseMsg, pVipRoomCloseMsg.roomOverPlayerInfos[1]);
            self.playerInfoPos2.newResetItem(pVipRoomCloseMsg, pVipRoomCloseMsg.roomOverPlayerInfos[2]);
            self.playerInfoPos3.newResetItem(pVipRoomCloseMsg, pVipRoomCloseMsg.roomOverPlayerInfos[3]);

        }

        /**
         * 返回大厅
         * @param {egret.TouchEvent} e
         */
        private backLobby(e: egret.TouchEvent): void {
            // let vNewIntoGameTableMsgAck: NewIntoGameTableMsgAck;
            // if (GameConstant.CURRENT_GAMETYPE === EGameType.RF) {
            //     if (RFGameData.requestStartGameMsgAck) {
            //         RFGameData.requestStartGameMsgAck.isCanLeaveRoom = false;
            //     }
            // } else if(GameConstant.CURRENT_GAMETYPE === EGameType.MAHJONG) {
            //     if (MahjongData.requestStartGameMsgAck) {
            //         MahjongData.requestStartGameMsgAck.isCanLeaveRoom = false;
            //     }
            // }
            // if (RFGameData.requestStartGameMsgAck.teaHouseId) {
            //     //表示是从茶楼桌子退出
            //     TeaHouseMsgHandle.sendAccessTeaHouseMsg(RFGameData.requestStartGameMsgAck.teaHouseId);
            //     TeaHouseMsgHandle.sendAccessLayerMsg(RFGameData.requestStartGameMsgAck.teaHouseLayer, RFGameData.requestStartGameMsgAck.teaHouseId);
            //     return;
            // }

            //要发送指令，暂时没发现有什么作用
            MvcUtil.send(LobbyModule.LOBBY_INTO_LOBBY);
        }

        /**
         * 分享
         * @param {egret.TouchEvent} e
         */
        private share(e: egret.TouchEvent): void {
            if (Game.CommonUtil.isNative) {
                let rt: egret.RenderTexture = new egret.RenderTexture;
                rt.drawToTexture(this, new egret.Rectangle(0, 0, 1120, 640));
                let base64Data = rt.toDataURL("image/jpeg");

                let shareData = new nativeShareData();
                shareData.type = ShareWXType.SHARE_IMG;
                shareData.baseStr = base64Data;
                NativeBridge.getInstance().mShareData = shareData;

                MvcUtil.send(CommonModule.COMMON_NATIVE_SHARE_CHOOSE_ROAD);
            }
            else {
                MvcUtil.send(CommonModule.COMMON_SHOW_SHARE_REMINDER_VIEW, ShareReminderTypeEnum.FRIENDS);
            }
        }
    }
}