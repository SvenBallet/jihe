module FL {
    /** 牌桌操作界面 */
    export class RFGameTableHandleView extends BaseView {
        /** 单例 */
        private static _onlyOne: RFGameTableHandleView;

        //调停者名字，删除界面的时候会自动移除
        public readonly mediatorName: string = RFGameTableHandleViewMediator.NAME;
        //界面层级，UI框架自动管理
        public readonly viewLayer: ViewLayerEnum = ViewLayerEnum.BOTTOM;

        /** 牌桌背景，用来界面编辑的时候用，初始化完毕后即会移除 */
        public pzBg: eui.Image;

        /** 托管组 */
        public tuoGuanGroup: eui.Group;
        public cancelTuoGuanGroup: eui.Group;
        public cancelTuoGuanBtn: GameButton;
        public tuoguanBg: eui.Image;

        /** 左上区域 */
        // public leftTopGroup:eui.Group;
        public timeLabelGroup: eui.Group;  //时间
        public timeLabel: eui.Label;  //时间
        public roomAndWanfaInfo: eui.Label; //房间号 和 玩法，没有房间号 则是金币场
        /** 房间号 */
        public vipRoomIdGroup: eui.Group;
        public vipRoomIdLabel: eui.Label; // 房号
        // public wanfaLabel:eui.Label;  //玩法

        /** 玩法描述区域 */
        public wanfaGroup: eui.Group;
        public viewHideWanfa: eui.Image; //横条点击会影藏和显示玩法描述
        public wanfaArrows: eui.Image; //箭头
        public wanfaDescGroup: eui.Group;  //玩法详细组
        public wanfaDescLabel: eui.Label;  //玩法详细描述
        public wanfaLabel: eui.Label; //玩法 文字，只用来添加玩法详细组的时候让组添加在这个前面，减少1个 DrawCall

        /** 操作菜单区域 */
        public handleMenuGroup: eui.Group;
        public handleMenuBtn: eui.Image; //显示隐藏操作菜单

        /** 菜单组 */
        public menuGroup: eui.Group;
        public menuGroupBg: eui.Image; //背景，要简单处理一下
        /** 设置 */
        public settingGroup: eui.Group;
        public settingBtn: eui.Image;
        /** 返回大厅 退出 */
        public exitGroup: eui.Group;
        public exitBtn: eui.Image;
        /** 发起解散操作 */
        public dissolveSmallGroup: eui.Group;
        public dissolveSmallBtn: eui.Image;

        /** 聊天 */
        public chatGroup: eui.Group;
        public chatBtn: eui.Image;

        /** 麦克风 */
        public microMod: TalkTrigger;

        /** gps按钮 */
        public gpsGroup: eui.Group;
        public gpsBtn: eui.Image;

        /** 返回大厅按钮 */
        public backLobbyGroup: eui.Group;
        public backLobbyBtn: eui.Image;

        /** 解散房间按钮 */
        public dissolveGroup: eui.Group;
        public dissolveBtn: eui.Image;

        /** 选择人数模式组 */
        public playerNumPatternGroup: eui.Group;
        public twoPlayerNumPattern: eui.Group;
        public twoPlayerNumPatternCheck: eui.Image;
        public threePlayerNumPattern: eui.Group;
        public threePlayerNumPatternCheck: eui.Image;

        /** 定时器，用于更新左上角的时间 **/
        private _timeTickerTimer: Game.Timer;

        /** 玩法详细是否显示中 */
        public wanfaDescIsView: boolean;
        /** 自动隐藏玩法详细组时间 */
        private _autoHideWanfaDescTime: number = Number.MAX_VALUE;

        /** 玩法详细组是否显示中 */
        public menuGroupIsView: boolean;
        /** 自动隐藏玩法详细组时间 */
        private _autoHideMenuGroupTime: number = Number.MAX_VALUE;

        /** 调停者 */
        private _mediator: RFGameTableHandleViewMediator;

        /**网络、电池请求定时器 */
        private _tickerUpdateGetNetAndBattery: Game.Timer;
        private batteryTimes: number;
        // public topInfoImg: eui.Image;
        // public topGro:eui.Group;


        /** 电池、网络、延时 */
        public topRightGroup:eui.Group;
        public netGro:eui.Group;
        public battaryImg: eui.Image;
        public netImg: eui.Image;
        public netLabel:eui.Label;

        /**录音UI */
        public talkMod: TalkState;
        public backGro:eui.Group;
        public backBtn:eui.Image;

        private constructor() {
            super();
            this.top = this.bottom = this.left = this.right = 0;
            this.skinName = "skins.TableBoardHandleViewSkin";
        }

        public static getInstance(): RFGameTableHandleView {
            if (!this._onlyOne) {
                this._onlyOne = new RFGameTableHandleView();
            }
            return this._onlyOne;
        }

        protected childrenCreated(): void {
            super.childrenCreated();
            let self = this;
            //删除牌桌背景
            self.removeChild(self.pzBg);
            //注册按钮点击缓动
            TouchTweenUtil.regTween(self.handleMenuGroup, self.handleMenuBtn);
            TouchTweenUtil.regTween(self.settingGroup, self.settingBtn);
            TouchTweenUtil.regTween(self.exitGroup, self.exitBtn);
            TouchTweenUtil.regTween(self.dissolveSmallGroup, self.dissolveSmallBtn);
            TouchTweenUtil.regTween(self.chatGroup, self.chatBtn);
            TouchTweenUtil.regTween(self.backGro, self.backBtn);
            if (!Game.CommonUtil.isNative) {
                // self.removeChild(self.microMod);
            }
            else {
                self.microMod.bindTalkUI(self.talkMod);
            }

            TouchTweenUtil.regTween(self.gpsGroup, self.gpsBtn);
            TouchTweenUtil.regTween(self.backLobbyGroup, self.backLobbyBtn);
            TouchTweenUtil.regTween(self.dissolveGroup, self.dissolveBtn);
            TouchTweenUtil.regTween(self.cancelTuoGuanGroup, self.cancelTuoGuanBtn);
            self.initProps();
            //调停者
            self._mediator = new RFGameTableHandleViewMediator(self);

            self.backGro.visible = true;
        }

        /** 添加到界面以后框架自动调用 */
        protected onAddView(): void {
            MvcUtil.regMediator(this._mediator);
            this.startTickerTimer();
            this.startNetAndBatteryTimer();
        }

        private initProps() {
            let self = this;
            // self.chatGroup.verticalCenter = 35;
            self.tuoguanBg.height = 250;
            self.cancelTuoGuanGroup.horizontalCenter = 35;
            self.cancelTuoGuanGroup.bottom = 70;
        }

        /** 从界面移除以后框架自动调用 */
        protected onRemView(): void {
            this.stopTickerTimer();
        }

        /**
      * 启动定时任务
      */
        private startTickerTimer(): void {
            let self = this;
            //添加定时任务,1秒钟任务一次
            if (!self._timeTickerTimer) {
                let timer: Game.Timer = new Game.Timer(1000);
                timer.addEventListener(egret.TimerEvent.TIMER, self.updateTimer, self);
                self._timeTickerTimer = timer;
            }
            if (!self._timeTickerTimer.running) {
                self._timeTickerTimer.start();
            }
        }

        /**
         * 停止定时任务
         */
        private stopTickerTimer(): void {
            let self = this;
            //添加定时任务,1秒钟任务一次
            if (self._timeTickerTimer) {
                if (self._timeTickerTimer.running) {
                    self._timeTickerTimer.stop();
                }
            }
        }

        /**
       * 定时器更新
       */
        private updateTimer(): void {
            let self = this;
            let vServerTime: number = ServerUtil.getServerTime();
            if (!RFGameHandle.isReplay()) {
                // let vCurrDateStr = StringUtil.formatDate("yyyy-MM-dd hh:mm", new Date(vServerTime));
                let vCurrDateStr = StringUtil.formatDate("hh:mm", new Date(vServerTime));
                if (self.timeLabel.text !== vCurrDateStr) {
                    self.timeLabel.text = vCurrDateStr;
                }
            }

            //如果可以自动隐藏
            if (vServerTime >= self._autoHideWanfaDescTime) {
                self.hideWanfaDescGroup();
            }
            //如果可以自动隐藏
            if (vServerTime >= self._autoHideMenuGroupTime) {
                self.hideMenuGroup();
            }
        }


        /**
        * 显示玩法详细组
        * @param {number} pHideTime 指定显示时间，默认是 当前时间 + 3秒
        */
        public viewWanfaDescGroup(pHideTime?: number): void {
            let self = this;
            // if (!self.wanfaGroupIsView) {
            self.wanfaArrows.source = "wanfa_title_up_png";
            //显示玩法详细组
            ViewUtil.addChildBefore(self.wanfaGroup, self.wanfaDescGroup, self.wanfaLabel);
            if (pHideTime) {
                //设置自动隐藏时间为永久不隐藏
                self._autoHideWanfaDescTime = pHideTime;
            } else {
                self._autoHideWanfaDescTime = ServerUtil.getServerTime() + 3000;
            }
            //设置显示中
            self.wanfaDescIsView = true;
            // }
        }

        /**
        * 隐藏玩法详细组
        */
        public hideWanfaDescGroup(): void {
            let self = this;
            //详细玩法区
            self.wanfaArrows.source = "wanfa_title_down_png";
            //显示玩法详细组
            ViewUtil.removeChild(self.wanfaGroup, self.wanfaDescGroup);
            self._autoHideWanfaDescTime = Number.MAX_VALUE;
            //设置不显示
            self.wanfaDescIsView = false;
        }

        /**
       * 显示菜单组
       */
        public viewMenuGroup(): void {
            let self = this;
            //按钮
            // self.handleMenuBtn.source = "pz_tj_png";
            //显示组
            ViewUtil.addChildBefore(self, self.menuGroup, self.wanfaGroup);
            self._autoHideMenuGroupTime = ServerUtil.getServerTime() + 3000;
            //设置显示中
            self.menuGroupIsView = true;
        }

        /**
        * 隐藏菜单组
        */
        public hideMenuGroup(): void {
            let self = this;
            //按钮
            // self.handleMenuBtn.source = "pz_tc_png";
            //显示组
            ViewUtil.removeChild(self, self.menuGroup);
            self._autoHideMenuGroupTime = Number.MAX_VALUE;
            //设置不显示
            self.menuGroupIsView = false;
        }

        /**
        * 进入牌桌
        */
        public intoTableBoard(): void {
            let self = this;

            //显示返回大厅组
            ViewUtil.addChildBefore(self, self.backLobbyGroup, self.wanfaGroup);

            self.resetDissolveBtn();

            //删除不需要的显示
            ViewUtil.removeChild(self, self.handleMenuGroup);

            //详细玩法区
            self.viewWanfaDescGroup(Number.MAX_VALUE);
            //设置详细玩法
            self.wanfaDescLabel.text = RFGameHandle.getWanfaDescStr();
            //宽屏适配
            if (Game.CommonUtil.IsLongScreen) {
                self.wanfaDescLabel.left = 6 + 44;
            }

            //隐藏菜单
            self.hideMenuGroup();

            //设置时间
            self.updateTimer();
            // 回放设置固定时间
            if (RFGameHandle.isReplay()) {
                let vStartTime: string = RFGameData.requestStartGameMsgAck.beginTimes.substr(0, RFGameData.requestStartGameMsgAck.beginTimes.lastIndexOf(":"));
                let vEndTime: string = RFGameData.requestStartGameMsgAck.endTimes.substr(0, RFGameData.requestStartGameMsgAck.endTimes.lastIndexOf(":"));
                let vCurrDateStr =  vStartTime + "-" + vEndTime;
                if (self.timeLabel.text !== vCurrDateStr) {
                    self.timeLabel.text = vCurrDateStr;
                }
            }

            //设置房间号 和 玩法
            self.roomAndWanfaInfo.text = RFGameHandle.getRoomAndWanfaStr();
            let str: string = "";
            let mainGamePlayRule: ECardGamePlayWay = RFGameData.requestStartGameMsgAck.mainGamePlayRule;
            if (mainGamePlayRule === ECardGamePlayWay.JING_DIAN_PAO_DE_KUAI) {
                str = "经典跑得快";
            }
            if (mainGamePlayRule === ECardGamePlayWay.SHI_WU_ZHANG_PAO_DE_KUAI) {
                str = "十五张玩法";
            }
            self.wanfaLabel.text = str;

            // 设置房间号
            let vVipTableID: number = RFGameData.requestStartGameMsgAck.vipRoomID;
            if (vVipTableID === 0) {
                self.vipRoomIdLabel.text = "金币场";
            } else {
                self.vipRoomIdLabel.text = "房号"+ vVipTableID;
            }

            //删除托管区
            ViewUtil.removeChild(self, self.tuoGuanGroup);

            // 回放中屏蔽时间显示 调整 房间信息位置 屏蔽很多操作按钮
            // if (RFGameHandle.isReplay()) {
            //     // self.timeLabel.visible = false;
            //     // self.roomAndWanfaInfo.left = 130;
            //     self.gpsGroup.visible = false;
            //     self.chatGroup.visible = false;
            //     self.microMod.visible = false;
            // } else {
            //     self.timeLabel.visible = true;
            //     // self.roomAndWanfaInfo.left = 235;
            //     self.gpsGroup.visible = true;
            //     self.chatGroup.visible = true;
            //     self.microMod.parent && (self.microMod.visible = true);
            // }

            // if (1) {
            // if (Game.CommonUtil.isNative) {
            //     self.netImg.visible = true;
            //     self.battaryImg.visible = true;
            //     // if (RFGameHandle.isReplay()) {
            //     //     self.roomAndWanfaInfo.left = 340;
            //     // }
            //     // else {
            //     self.roomAndWanfaInfo.left = 325;
            //     // }
            //     self.timeLabel.left = 110;
            //     self.topInfoImg.width = 730;
            // }
            // else {
            //     self.netGro.parent && self.topGro.removeChild(self.netGro);
            //     self.battaryImg.parent && self.topGro.removeChild(self.battaryImg);
            //     self.timeLabel.left = 20;
            //     self.topInfoImg.width = 662;
            // }

            // 左上角改为布局，抛弃原有的坐标修改,长度判断
            // self.topInfoImg.width = self.topGro.width + 120;

            self.netGro.removeChildren();
            self.topRightGroup.visible = true;
            if (RFGameHandle.isReplay()) {
                self.gpsGroup.visible = false;
                self.chatGroup.visible = false;
                self.microMod.visible = false;
                self.backGro.visible = false;
                self.netGro.addChild(self.battaryImg);
                self.netGro.addChild(self.timeLabel);
            } else {
                self.netGro.addChild(self.netLabel);
                self.netGro.addChild(self.netImg);
                self.netGro.addChild(self.battaryImg);
                self.netGro.addChild(self.timeLabel);
                self.gpsGroup.visible = true;
                self.chatGroup.visible = true;
                self.backGro.visible = true;
                self.microMod.parent && (self.microMod.visible = true);
            }

            ViewUtil.removeChild(self, self.playerNumPatternGroup);

        }

        public resetDissolveBtn():void {
            let self = this;
            //是否是VIP房间
            if (RFGameHandle.isVipRoom()) {
                ViewUtil.addChildBefore(self, self.dissolveGroup, self.wanfaGroup);
                if (RFGameHandle.isCanLeaveRoom() && !RFGameHandle.isRoomOwner(PZOrientation.DOWN)) {
                    self.dissolveBtn.source = "pz_exit_room_png";
                } else {
                    self.dissolveBtn.source = "pz_dissolve_room_png";
                }
                // if (RFGameHandle.getGameState() === EGameState.WAITING_START && RFGameHandle.getCurrentHand() === 1) {
                //     if (RFGameHandle.isRoomOwner(PZOrientation.DOWN)) {
                //         self.dissolveBtn.source = "pz_dissolve_room_png";
                //     } else {
                //         self.dissolveBtn.source = "pz_exit_room_png";
                //     }
                // } else {
                //     self.dissolveBtn.source = "pz_dissolve_room_png";
                // }
            } else {
                ViewUtil.removeChild(self, self.dissolveGroup);
            }
        }

        /**
       * 设置托管是否显示
       * @param {boolean} isView
       */
        public setTuoGuanGroup(isView: boolean): void {
            let self = this;
            if (isView) {
                let vIndex: number = self.getChildIndex(self.tuoGuanGroup);
                if (vIndex === -1) {
                    self.addChildAt(self.tuoGuanGroup, 0);
                }
            } else {
                ViewUtil.removeChild(self, self.tuoGuanGroup);
            }
        }

        /**
        * 开始游戏
        */
        public startGame(): void {
            let self = this;
            //显示操作menu组按钮
            ViewUtil.addChildBefore(self, self.handleMenuGroup, self.wanfaGroup);
            //隐藏玩法
            self.hideWanfaDescGroup();
            //隐藏菜单
            self.hideMenuGroup();
            //隐藏返回大厅按钮
            ViewUtil.removeChild(self, self.backLobbyGroup);
            //隐藏解散房间按钮
            ViewUtil.removeChild(self, self.dissolveGroup);

            //如果是Vip则menu中多显示一个申请解散按钮
            if (RFGameHandle.isVipRoom() && !RFGameHandle.isReplay()) {
                self.menuGroupBg.width = 198;
                ViewUtil.addChild(self.menuGroup, self.dissolveSmallGroup);
            } else {
                self.menuGroupBg.width = 132;
                ViewUtil.removeChild(self.menuGroup, self.dissolveSmallGroup);
            }

            //删除托管区
            ViewUtil.removeChild(self, self.tuoGuanGroup);
        }


        /**更新网络状态 */
        public reNetworkShow(state: number) {
            let netImgNameList = ["noconnect_png", "wifi_3_png", "4G_png"];
            this.netImg.source = netImgNameList[state];
        }

        /**更新电量状态 */
        public reBatteryShow(batNum: number) {
            let battaryImgNameList = ["electricity_0_png", "electricity_1_png", "electricity_2_png", "electricity_3_png"];
            let levelList = [25, 50, 75];
            let level = 0;
            if (batNum) {
                if (batNum <= levelList[0]) {
                    level = 0;
                }
                else if (batNum > levelList[0] && batNum <= levelList[1]) {
                    level = 1;
                }
                else if (batNum > levelList[1] && batNum <= levelList[2]) {
                    level = 2;
                }
                else if (batNum > levelList[2]) {
                    level = 3;
                }
            }
            this.battaryImg.source = battaryImgNameList[level];
        }

        /**网络状态、电量请求定时器 */
        private startNetAndBatteryTimer() {
            this.batteryTimes = 0
            // 网络请求间隔，电量X3
            let netInterval = 10000;
            let self = this;
            if (!self._tickerUpdateGetNetAndBattery) {
                self.netTimerTicker();
                let timer: Game.Timer = new Game.Timer(netInterval);
                timer.addEventListener(egret.TimerEvent.TIMER, self.netTimerTicker, self);
                self._tickerUpdateGetNetAndBattery = timer;
            }
            if (!self._tickerUpdateGetNetAndBattery.running) {
                self._tickerUpdateGetNetAndBattery.start();
            }
        }

        private stopNetAndBatteryTimer() {
            let self = this;
            if (self._tickerUpdateGetNetAndBattery) {
                if (self._tickerUpdateGetNetAndBattery.running) {
                    self._tickerUpdateGetNetAndBattery.stop();
                }
            }
        }

        private netTimerTicker() {
            let self = this;
            // 网络
            // let netData = {
            //     "eventType": SendNativeMsgType.SEND_NATIVE_GET_CONNECT_TYPE,
            //     "data": {
            //     }
            // }
            // NativeBridge.getInstance().sendNativeMessage(JSON.stringify(netData));

            // 电池
            if (self.batteryTimes == 4) {
                self.batteryTimes = 0;
            }
            if (self.batteryTimes == 0) {
                let batteryData = {
                    "eventType": SendNativeMsgType.SEND_NATIVE_GET_BATTERY,
                    "data": {
                    }
                }
                NativeBridge.getInstance().sendNativeMessage(JSON.stringify(batteryData));
            }
            self.batteryTimes += 1;
        }

        public changeMS(msNum: number) {
            let self = this;
            let mNum = 20;
            let yNum = 150;
            let rNum = 300;
            // let colorArr:Array<number> = [0x55BE8C, 0xFFFF00, 0xFF0000];
            let colorArr:Array<number> = [0xCDCCC8, 0xFFFF00, 0xFF0000];
            let curMsNum = 0;
            let color = 0;
            if (msNum >= 0 && msNum < mNum) {
                curMsNum = 20;
                color = 0;
            }
            else if (msNum > 20 && msNum < yNum) {
                curMsNum = msNum;
                color = 0;
            }
            else if (msNum > yNum && msNum < rNum) {
                curMsNum = msNum;
                color = 1;
            }
            else if(msNum > rNum) {
                curMsNum = msNum;
                color = 2;
            }
            else {
                curMsNum = 499;
                color = 2;
            }

            self.netLabel.textColor = colorArr[color];
            self.netLabel.text = curMsNum + "ms";
        }
    }
}