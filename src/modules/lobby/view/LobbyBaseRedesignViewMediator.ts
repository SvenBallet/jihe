module FL {
    export class LobbyBaseRedesignViewMediator extends puremvc.Mediator implements puremvc.IMediator {

        public static readonly NAME: string = "LobbyBaseRedesignViewMediator";

        // public ee:any;

        //登录按钮开关
        // private readonly _loginTouchSwitch:TouchSwitch;

        constructor(pView: LobbyBaseRedesignView) {
            super(LobbyBaseRedesignViewMediator.NAME, pView);
            let self = this;
            // pView.activityGroup.addEventListener(egret.TouchEvent.TOUCH_TAP, self.showActivity, self);
            pView.recordGroup.addEventListener(egret.TouchEvent.TOUCH_TAP, self.requestRecordData, self);
            pView.shareGroup.addEventListener(egret.TouchEvent.TOUCH_TAP, self.shareAction, self);
            pView.mallGroup.addEventListener(egret.TouchEvent.TOUCH_TAP, self.intoMall, self);
            pView.goldGroup.addEventListener(egret.TouchEvent.TOUCH_TAP, self.startGoldGame, self);
            pView.createGroup.addEventListener(egret.TouchEvent.TOUCH_TAP, self.createGame, self);
            pView.createTHGroup.addEventListener(egret.TouchEvent.TOUCH_TAP, self.createTeaHouse, self);
            pView.addGoldGroup.addEventListener(egret.TouchEvent.TOUCH_TAP, self.addGoldBtnClick, self);
            pView.addDiamondGroup.addEventListener(egret.TouchEvent.TOUCH_TAP, self.addDiamondBtnClick, self);
            pView.avatarGroup.addEventListener(egret.TouchEvent.TOUCH_TAP, self.addAvatarBtnClick, self);
            pView.settingGroup.addEventListener(egret.TouchEvent.TOUCH_TAP, self.showSetting, self);
            pView.helpGroup.addEventListener(egret.TouchEvent.TOUCH_TAP, self.showHelpView, self);
            pView.joinGroup.addEventListener(egret.TouchEvent.TOUCH_TAP, self.joinGame, self);
            pView.identifyGroup.addEventListener(egret.TouchEvent.TOUCH_TAP, self.onIndetify, self);
            pView.serviceGroup.addEventListener(egret.TouchEvent.TOUCH_TAP, self.onService, self);

            // pView.clubGroup.addEventListener(egret.TouchEvent.TOUCH_TAP, self.clubGame, self);
            // this._loginTouchSwitch = TouchSwitchUtil.genTouchSwitchByComp(pLoginView.loginBtn);
            pView.joinTHGroup.addEventListener(egret.TouchEvent.TOUCH_TAP, self.joinTeaHouse, self);
            // pView.shareGroup.addEventListener(egret.TouchEvent.TOUCH_TAP, self.test, self);

            setTimeout(()=>{
                this.chargeRewardImg();
            }, 1000)
        }

        /**
       * 感兴趣的通知指令
       * @returns {Array<any>}
       */
        public listNotificationInterests(): Array<any> {
            return [
                LobbyModule.LOBBY_BIND_CODE,
                LobbyModule.LOBBY_REFRESH_THLIST,
                LobbyModule.LOBBY_SHARE_CIRCLE_ADD_DIAMOND,
            ];
        }

        /**
         * 处理通知
         * @param {puremvc.INotification} pNotification
         */
        public handleNotification(pNotification: puremvc.INotification): void {
            let data: any = pNotification.getBody();
            switch (pNotification.getName()) {
                case LobbyModule.LOBBY_BIND_CODE: {
                    // 屏蔽登陆时弹出输入邀请码
                    // this.bideCode();
                    break;

                }
                case LobbyModule.LOBBY_REFRESH_THLIST: {
                    this.refreshTHList();
                    break;
                }

                case(LobbyModule.LOBBY_SHARE_CIRCLE_ADD_DIAMOND): {
                    this.chargeRewardImg();
                    break;
                } 
            }
        }


        private getView() {
            return <LobbyBaseRedesignView>this.viewComponent;
        }

        /** 实名认证 */
        private onIndetify() {
            // ReminderViewUtil.showReminderView({
            //     hasLeftBtn: true,
            //     text: "功能开发中，尽请期待"
            // })
            if (!LobbyData.verifyRealInfo) {
                MvcUtil.addView(new IdentifyVerifyView());
            }
            else {
                PromptUtil.show("已验证", PromptType.ALERT);
            }
        }

        /** 客服 */
        private onService() {
            // ReminderViewUtil.showReminderView({
            //     hasLeftBtn: true,
            //     text: "功能开发中，尽请期待"
            // })

            MvcUtil.addView(new CustomerView());
        }

        /** 
         * 刷新茶楼列表
         */
        private refreshTHList() {
            let thData = LobbyData.teaHouseListData;
            let listData = [];
            thData.forEach(x => {
                let data = <ILobbyTHListItem>{};
                data.creatorID = x.creatorIndex;
                data.creatorName = x.creatorPlayerName;
                data.id = x.teaHouseId;
                data.headImageUrl = x.headImageUrl;
                data.name = x.teaHouseName; 
                listData.push(data);
            })
            this.getView().refreshTHList(listData);
        }

        /**
       * 绑定邀请码
       */
        public bideCode(): void {
            let self = this;
            self.getView().codeInput = new NumberInput();
            self.getView().codeInput.titleLabelText = "输入邀请码";
            self.getView().codeInput.confirmBtnText = "绑定";
            let vNumberInputAreaView: NumberInputAreaView = new NumberInputAreaView(self.getView().codeInput, 999999, 100000, new MyCallBack(self.confirmInput, self));
            MvcUtil.addView(vNumberInputAreaView);
        }

        /**
         * 确认输入邀请码
         */
        private confirmInput(): void {
            let params = { opType: 0, inviteCode: this.getView().codeInput.text };
            Storage.setItem("MallSetInviteCode", "2");
            MvcUtil.send(AgentModule.AGENT_SEND_BIND_CODE, params);
        }



        private addGoldBtnClick(e: egret.Event): void {
            egret.localStorage.setItem('mallType', 'gold');
            let vRefreshItemBaseMsg: RefreshItemBaseMsg = new RefreshItemBaseMsg();
            vRefreshItemBaseMsg.account = LobbyData.playerVO.account;
            ServerUtil.sendMsg(vRefreshItemBaseMsg, MsgCmdConstant.MSG_GAME_REFRESH_ITEM_BASE_ACK);
        }

        private addDiamondBtnClick(e: egret.Event): void {
            egret.localStorage.setItem('mallType', 'diamond');
            let vRefreshItemBaseMsg: RefreshItemBaseMsg = new RefreshItemBaseMsg();
            vRefreshItemBaseMsg.account = LobbyData.playerVO.account;
            ServerUtil.sendMsg(vRefreshItemBaseMsg, MsgCmdConstant.MSG_GAME_REFRESH_ITEM_BASE_ACK);
        }

        private addAvatarBtnClick(e: egret.Event): void {
            //基础界面
            let vAgentBaseView: AgentBaseView = new AgentBaseView();
            //添加界面
            MvcUtil.addView(vAgentBaseView);
            ServerUtil.sendMsg(new GameBuyItemMsg({ itemID: GameConstant.SEND_PLAYER_CMD_GET_MY_PAY_BACK }));
            ServerUtil.sendMsg(new GameBuyItemMsg({ itemID: GameConstant.AGENT_CMD_GET_FANGLIST }));
        }

        /**
         * 显示设置界面
         * @param {egret.TouchEvent} e
         */
        private showSetting(e: egret.TouchEvent): void {
            MvcUtil.addView(new SetView());
        }

        /**
         * 显示玩法介绍界面
         */
        private showHelpView() {
            // 设置按钮点击间隔
            this.getView().helpGroup.touchEnabled = false;
            setTimeout(() => {
                this.getView().helpGroup.touchEnabled = true;
            }, 3000);
            MvcUtil.addView(new HelpView());
        }

        /** 
         * 测试
         */
        private test() {
            let str = "";
            str += "2018-09-03" + "\n";
            str += "房间号：" + 110911;
            str += "\n茶楼号：" + 911110;

            for (let i = 0;i < 3;i ++) {
                str += "\n______________________\n";
                str += "ID:" + 123456 + " | " + "FUCKFUCKFUCK" + "\n";
                str += "分数：" + 20;
            }
            console.log("TEST STR==");
            console.log(str);

            let shareData = new nativeShareData();
            shareData.type = ShareWXType.SHARE_TEXT;
            shareData.text = str;
            shareData.road = ShareWXRoad.SHARE_SESSION + "";
            NativeBridge.getInstance().mShareData = shareData;

            let jsonData = {
                "eventType": SendNativeMsgType.SEND_NATIVE_SHARE_TO_WX,
                "data": shareData
            }
            NativeBridge.getInstance().sendNativeMessage(JSON.stringify(jsonData));
        }

        /**
         * 点击分享按钮动作
         */
        private shareAction(): void {
            if (1) {
                let shareData = new nativeShareData();
                shareData.type = ShareWXType.SHARE_URL;
                shareData.url = NativeBridge.mShareUrl;
                shareData.title = "乐趣湖南麻将";
                shareData.desc = "纯正玩法，还原家乡的感觉；随时随地，跨城亲友相约开战";
                NativeBridge.getInstance().mShareData = shareData;

                let vSystemConfigPara:SystemConfigPara = LobbyHandler.getOneClientConfig(GameConfigConstant.CONF_LOBBY_SHARE_REWARD);
                if (vSystemConfigPara.pro_3 == 1) {
                    MvcUtil.send(CommonModule.COMMON_NATIVE_SHARE_CHOOSE_ROAD, SHARE_CHOOSE_TYPE.SHARE_LOBBY_IMG);
                }
                else {
                    MvcUtil.send(CommonModule.COMMON_NATIVE_SHARE_CHOOSE_ROAD);
                }
            }
            else {
                MvcUtil.addView(new ShareQrCodeView());
            }
        }

        /**
         * 请求对战记录数据
         */
        private requestRecordData() {
            let msg: GetVipRoomListMsg = new GetVipRoomListMsg();
            msg.playerID = LobbyData.playerVO.playerID;
            msg.unused_2 = 1;
            ServerUtil.sendMsg(msg, MsgCmdConstant.MSG_GET_VIP_ROOM_RECORD_ACK);
        }

        /**
         * 进入购买
         * @param {egret.Event} e
         */
        private intoMall(e: egret.Event): void {
            egret.localStorage.setItem('mallType', 'gold');
            let vRefreshItemBaseMsg: RefreshItemBaseMsg = new RefreshItemBaseMsg();
            vRefreshItemBaseMsg.account = LobbyData.playerVO.account;
            ServerUtil.sendMsg(vRefreshItemBaseMsg, MsgCmdConstant.MSG_GAME_REFRESH_ITEM_BASE_ACK);
        }

        /**
         * 显示活动界面
         * */
        private showActivity() {
            let vActivityBaseView: ActivityBaseView = new ActivityBaseView();
            //消息没有返回也要打开活动界面
            MvcUtil.addView(vActivityBaseView);
            // loading页面测试
            // let i=1;
            // this.ee = egret.setInterval(this.test,this,300,{num:i,all:100});
        }

        // private test(obj:any):void {
        //     ReqLoadingViewUtil.addReqLoadingViewWithProgress(obj.num,obj.all);
        //     obj.num += 1;
        //     if(obj.num > obj.all){
        //         egret.clearInterval(this.ee);
        //     }
        // }


        /**
         * 俱乐部
         * @param {egret.TouchEvent} e
         */
        private clubGame(e: egret.TouchEvent): void {
            MvcUtil.addView(new ClubListView());
            MvcUtil.send(ClubModule.CLUB_INTO_CLUB);
        }

        /**
         * 开始金币游戏
         * @param {egret.TouchEvent} e
         */
        private startGoldGame(e: egret.TouchEvent): void {
            //ReminderViewUtil.showReminderView({hasLeftBtn:true, hasRightBtn:true, text:"fsdf"});
            // let vSddd:dragonBones.WorldClock = dragonBones.WorldClock.clock;

            MvcUtil.addView(new IntoGoldGameView());
        }

        /**
         * 创建房间
         * @param {egret.TouchEvent} e
         */
        private createGame(e: egret.TouchEvent): void {
            MvcUtil.addView(new DelLayerView(ViewLayerEnum.BOTTOM_ONLY));
            let crv = new LobbyCreateGameView();
            crv.setBottomView(ELobbyCreateType.Room);
            MvcUtil.addView(crv);
            //发送请求进入VIP老房间指令
            // let vRequestStartGameMsg:RequestStartGameMsg = new RequestStartGameMsg();
            // vRequestStartGameMsg.roomID = MJRoomID.VIPROOM;
            // ServerUtil.sendMsg(vRequestStartGameMsg);
            let vNewIntoOldGameTableMsg: NewIntoOldGameTableMsg = new NewIntoOldGameTableMsg();
            ServerUtil.sendMsg(vNewIntoOldGameTableMsg);
        }

        /** 
         * 创建茶楼
         */
        private createTeaHouse() {
            MvcUtil.addView(new DelLayerView(ViewLayerEnum.BOTTOM_ONLY));
            let crv = new LobbyCreateGameView();
            crv.setBottomView(ELobbyCreateType.TeaHouse);
            MvcUtil.addView(crv);
        }

        /** 加入茶楼 */
        private joinTeaHouse() {
            MvcUtil.addView(new DelLayerView(ViewLayerEnum.BOTTOM_ONLY));
            let view = new LobbyJoinRoomView();
            view.setJoinFlag(false);
            MvcUtil.addView(view);
        }

        /**
         * 加入房间
         * @param {egret.TouchEvent} e
         */
        private joinGame(e: egret.TouchEvent): void {
            MvcUtil.addView(new DelLayerView(ViewLayerEnum.BOTTOM_ONLY));
            let view = new LobbyJoinRoomView();
            view.setJoinFlag(true);
            MvcUtil.addView(view);
            //发送请求进入VIP老房间指令
            // let vRequestStartGameMsg:RequestStartGameMsg = new RequestStartGameMsg();
            // vRequestStartGameMsg.roomID = MJRoomID.VIPROOM;
            // ServerUtil.sendMsg(vRequestStartGameMsg);
            let vNewIntoOldGameTableMsg: NewIntoOldGameTableMsg = new NewIntoOldGameTableMsg();
            ServerUtil.sendMsg(vNewIntoOldGameTableMsg);
        }

        /**
         * 是否显示分享奖励标记
         */
        private chargeRewardImg():void {
            let lobbyview:LobbyBaseRedesignView = <LobbyBaseRedesignView>this.viewComponent;
            // 分享获得钻石配置
            let vSystemConfigPara:SystemConfigPara = LobbyHandler.getOneClientConfig(GameConfigConstant.CONF_SHARE_GAIN_DIAMOND);
            // 微信分享获得钻石次数
            let vWeChatShareGetDiamondCount:number = LobbyHandler.getWeChatShareGetDiamondCount();
            //判断是否有奖励
            if (vSystemConfigPara.pro_1 > 0 && vWeChatShareGetDiamondCount > 0) {
                lobbyview.rewardImg.visible = true;
            } else {
                lobbyview.rewardImg.visible = false;
            }
        }
    }
}