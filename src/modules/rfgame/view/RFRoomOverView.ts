module FL {
    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase - RFRoomOverView
     * @Description:  跑得快房间结束 牌局结算界面
     * @Create: ArielLiang on 2018/4/23 16:23
     * @Version: V1.0
     */
    export class RFRoomOverView  extends BaseView {

        /** 单例 */
        private static _onlyOne:RFRoomOverView;

        //调停者名字，删除界面的时候会自动移除
        public readonly mediatorName: string = "";
        //界面层级，UI框架自动管理
        public readonly viewLayer: ViewLayerEnum = ViewLayerEnum.POPUP_ONLY;

        /** 玩家信息 0-3 位置 */
        public playerInfoPos0:RFRoomOverItem;
        public playerInfoPos1:RFRoomOverItem;
        public playerInfoPos2:RFRoomOverItem;
        public playerInfoPos3:RFRoomOverItem;
        public LayoutGro:eui.Group;

        /** 房间号 */
        public roomNum:eui.Label;
        /** 时间 */
        public timeLabel:eui.Label;
        public playWay:eui.Label;

        /** 分享按钮 */
        public shareBtn:GameButton;
        public shareBtn0:FL.GameButton;
        /** 返回大厅按钮 */
        public backLobbyBtn:GameButton;

        public curentMsg: NewVipRoomOverSettleAccountsMsgAck = null;

        constructor() {
            super();
            // this.verticalCenter = this.horizontalCenter = 0;
            this.left = this.right = this.top = this.bottom = 0;
            this.skinName = "skins.RFRoomOverViewSkin";
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

        // public static getInstance():RFRoomOverView {
        //     if (!this._onlyOne) {
        //         this._onlyOne = new RFRoomOverView();
        //     }
        //     return this._onlyOne;
        // }

        protected createChildren():void {
            super.childrenCreated();
            let self = this;
            //注册按钮点击缓动
            TouchTweenUtil.regTween(self.backLobbyBtn, self.backLobbyBtn);
            TouchTweenUtil.regTween(self.shareBtn, self.shareBtn);
            TouchTweenUtil.regTween(self.shareBtn0, self.shareBtn0);
            //注册按钮点击事件
            self.backLobbyBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, self.backLobby, self);
            self.shareBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, self.share, self);
            Game.CommonUtil.addTapGap(self.shareBtn, 3500);
            self.shareBtn0.addEventListener(egret.TouchEvent.TOUCH_TAP, self.shareText,self)
            Game.CommonUtil.addTapGap(self.shareBtn0, 3500);

            // APPSTORE屏蔽
            if (NativeBridge.IOSMask) {
                self.shareBtn.visible = false;
            }
        }

        /**
         * 重置界面
         * @param {FL.NewVipRoomOverSettleAccountsMsgAck} pVipRoomCloseMsg
         */
        public resetView(pVipRoomCloseMsg:NewVipRoomOverSettleAccountsMsgAck):void {
            this.curentMsg = pVipRoomCloseMsg;
            let self = this;
            //设置房号
            let vRoomNumTest:string = "";
            vRoomNumTest += "房间号："+pVipRoomCloseMsg.vipRoomID;
            if (pVipRoomCloseMsg.createType === 2) {
                vRoomNumTest += " 俱乐部房间"
            }
            else if (pVipRoomCloseMsg.createType === 5) {
                let vNewIntoGameTableMsgAck: NewIntoGameTableMsgAck = GameConstant.CURRENT_HANDLE.getRequestStartGameMsgAck();
                if (vNewIntoGameTableMsgAck && vNewIntoGameTableMsgAck.teaHouseId) {
                    vRoomNumTest = "茶楼号：" + vNewIntoGameTableMsgAck.teaHouseId;
                }
            }

            self.roomNum.text = vRoomNumTest;
            self.playWay.text = (MahjongHandler.getMJGameNameText(pVipRoomCloseMsg.mainWay) || RFGameHandle.getCardGameNameText(pVipRoomCloseMsg.mainWay)) + " " + pVipRoomCloseMsg.playNum + "/" + pVipRoomCloseMsg.totalCount + "局";
            //设置时间
            let vServerTime:number = ServerUtil.getServerTime();
            let vCurrDateStr = StringUtil.formatDate("yyyy-MM-dd hh:mm", new Date(vServerTime));
            self.timeLabel.text = vCurrDateStr;

            // 先删除所有玩家信息
            self.LayoutGro.removeChildren();

            // 再添加
            pVipRoomCloseMsg.roomOverPlayerInfos[0] && self.LayoutGro.addChild(self.playerInfoPos0);
            pVipRoomCloseMsg.roomOverPlayerInfos[1] && self.LayoutGro.addChild(self.playerInfoPos1);
            pVipRoomCloseMsg.roomOverPlayerInfos[2] && self.LayoutGro.addChild(self.playerInfoPos2);
            pVipRoomCloseMsg.roomOverPlayerInfos[3] && self.LayoutGro.addChild(self.playerInfoPos3);

            // 设置玩家信息
            self.playerInfoPos0.resetItem(pVipRoomCloseMsg, pVipRoomCloseMsg.roomOverPlayerInfos[0]);
            self.playerInfoPos1.resetItem(pVipRoomCloseMsg, pVipRoomCloseMsg.roomOverPlayerInfos[1]);
            self.playerInfoPos2.resetItem(pVipRoomCloseMsg, pVipRoomCloseMsg.roomOverPlayerInfos[2]);
            self.playerInfoPos3.resetItem(pVipRoomCloseMsg, pVipRoomCloseMsg.roomOverPlayerInfos[3]);

            // self.playerInfoPos0.parent && this.LayoutGro.removeChild(self.playerInfoPos0);
            // self.playerInfoPos1.parent && this.LayoutGro.removeChild(self.playerInfoPos1);
            // self.playerInfoPos2.parent && this.LayoutGro.removeChild(self.playerInfoPos2);
            // self.playerInfoPos3.parent && this.LayoutGro.removeChild(self.playerInfoPos3);

            // pVipRoomCloseMsg.roomOverPlayerInfos[0] && this.LayoutGro.addChild(self.playerInfoPos0);
            // pVipRoomCloseMsg.roomOverPlayerInfos[1] && this.LayoutGro.addChild(self.playerInfoPos1);
            // pVipRoomCloseMsg.roomOverPlayerInfos[2] && this.LayoutGro.addChild(self.playerInfoPos2);
            // pVipRoomCloseMsg.roomOverPlayerInfos[3] && this.LayoutGro.addChild(self.playerInfoPos3);
        }

        /**
         * 返回大厅
         * @param {egret.TouchEvent} e
         */
        private backLobby(e:egret.TouchEvent):void {

            let vNewIntoGameTableMsgAck: NewIntoGameTableMsgAck = GameConstant.CURRENT_HANDLE.getRequestStartGameMsgAck();
            if (vNewIntoGameTableMsgAck && vNewIntoGameTableMsgAck.teaHouseId) {
                TeaHouseMsgHandle.sendAccessTeaHouseMsg(vNewIntoGameTableMsgAck.teaHouseId);
                return;
            }

            // if (RFGameData.requestStartGameMsgAck && RFGameData.requestStartGameMsgAck.teaHouseId) {
            //     // 表示茶楼房间
            //     TeaHouseMsgHandle.sendAccessTeaHouseMsg(RFGameData.requestStartGameMsgAck.teaHouseId);
            //     return;
            // }
            //
            // if (MahjongData.requestStartGameMsgAck && MahjongData.requestStartGameMsgAck.teaHouseId) {
            //     // 表示茶楼房间
            //     TeaHouseMsgHandle.sendAccessTeaHouseMsg(MahjongData.requestStartGameMsgAck.teaHouseId);
            //     return;
            // }

            //要发送指令，暂时没发现有什么作用
            MvcUtil.send(LobbyModule.LOBBY_INTO_LOBBY);
        }

        /**
         * 分享
         * @param {egret.TouchEvent} e
         */
        private share(e:egret.TouchEvent):void {
            if (Game.CommonUtil.isNative) {
                // 茶楼房间并且开启了不允许分享,直接跳到分享文字
                let vNewIntoGameTableMsgAck: NewIntoGameTableMsgAck = GameConstant.CURRENT_HANDLE.getRequestStartGameMsgAck();
                if (vNewIntoGameTableMsgAck && vNewIntoGameTableMsgAck.teaHouseId && (vNewIntoGameTableMsgAck.forbidShare != 1)) {
                    this.shareText(1);
                    return;
                }

                let rt:egret.RenderTexture = new egret.RenderTexture;
                rt.drawToTexture(this, new egret.Rectangle(0, 0, this.width, this.height));
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

        /**
         * 获取分数字符串
         */
        private getScoreStr(score: number) {
            let scoreStr = "0";
            if (score > 0) {
                scoreStr = "+" + score;
            }
            else if (score < 0){
                scoreStr = "" + score;
            }
            return scoreStr;
        }

        /**
         * 复制文字
         * @param shareFlag是否走微信分享文字
         */
        private shareText(shareFlag: number = 0): void {
            if (Game.CommonUtil.isNative) {
                let msg = this.curentMsg;
                if (!msg) return;

                let str = "";
                str += this.timeLabel.text + "\n";
                str += "房间号：" + msg.vipRoomID;

                if (msg.createType === 5) {
                    let vNewIntoGameTableMsgAck: NewIntoGameTableMsgAck = GameConstant.CURRENT_HANDLE.getRequestStartGameMsgAck();
                    if (vNewIntoGameTableMsgAck && vNewIntoGameTableMsgAck.teaHouseId) {
                        str += "\n茶楼号：" + vNewIntoGameTableMsgAck.teaHouseId;
                    }
                }

                for (let i = 0;i < msg.roomOverPlayerInfos.length;i ++) {
                    let playerInfo:VipRoomOverPlayer = msg.roomOverPlayerInfos[i];
                    str += "\n______________________\n";
                    str += "ID:" + playerInfo.playerIndex + " | " + playerInfo.playerName + "\n";
                    str += "分数：" + this.getScoreStr(playerInfo.score);
                }
                
                // 安卓能直接分享，苹果直接分享会有换行异常
                if (shareFlag == 1 && Game.CommonUtil.IsAndroid) {
                    let shareData = new nativeShareData();
                    shareData.type = ShareWXType.SHARE_TEXT;
                    shareData.text = str;
                    NativeBridge.getInstance().mShareData = shareData;

                    MvcUtil.send(CommonModule.COMMON_NATIVE_SHARE_CHOOSE_ROAD, SHARE_CHOOSE_TYPE.SHARE_CHOOSE_NO_FRIEND);
                }
                else {
                    let jsonData = {
                        "eventType": SendNativeMsgType.SEND_NATIVE_SET_CLIPBOARD,
                        "data": {
                                    "clipboardStr": str
                                }
                        }
                    NativeBridge.getInstance().sendNativeMessage(JSON.stringify(jsonData));

                    MvcUtil.send(CommonModule.COMMON_NATIVE_OPEN_CHOOSE_ROAD);
                }
            }
            else {
                MvcUtil.send(CommonModule.COMMON_SHOW_SHARE_REMINDER_VIEW, ShareReminderTypeEnum.FRIENDS);
            }
        }
    }
}