module FL {
    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase - LobbyBaseViewMediator
     * @Description:  //调停者
     * @Create: DerekWu on 2017/11/11 13:52
     * @Version: V1.0
     */
    export class LobbyBaseViewMediator extends puremvc.Mediator implements puremvc.IMediator {

        public static readonly NAME: string = "LobbyBaseViewMediator";

        // public ee:any;

        //登录按钮开关
        // private readonly _loginTouchSwitch:TouchSwitch;

        constructor(pView: LobbyBaseView) {
            super(LobbyBaseViewMediator.NAME, pView);
            let self = this;
            pView.activityGroup.addEventListener(egret.TouchEvent.TOUCH_TAP, self.showActivity, self);
            pView.recordGroup.addEventListener(egret.TouchEvent.TOUCH_TAP, self.requestRecordData, self);
            pView.shareGroup.addEventListener(egret.TouchEvent.TOUCH_TAP, self.shareAction, self);
            pView.mallGroup.addEventListener(egret.TouchEvent.TOUCH_TAP, self.intoMall, self);
            pView.goldGroup.addEventListener(egret.TouchEvent.TOUCH_TAP, self.startGoldGame, self);
            pView.createGroup.addEventListener(egret.TouchEvent.TOUCH_TAP, self.createGame, self);
            pView.joinGroup.addEventListener(egret.TouchEvent.TOUCH_TAP, self.joinGame, self);
            pView.clubGroup.addEventListener(egret.TouchEvent.TOUCH_TAP, self.clubGame, self);
            // this._loginTouchSwitch = TouchSwitchUtil.genTouchSwitchByComp(pLoginView.loginBtn);

            // pView.testGroup.addEventListener(egret.TouchEvent.TOUCH_TAP, self.test, self);
        }

        /** 
         * 测试
         */
        private test() {
            console.log("test");
            MvcUtil.addView(TeaHouseBaseView.getInstance());
            if (TeaHouseData.isOff) {
                MvcUtil.addView(new TeaHouseCloseUpView());
            }
        }

        /**
         * 点击分享按钮动作
         */
        private shareAction(): void {
            if (Game.CommonUtil.isNative) {
                let shareData = new nativeShareData();
                shareData.type = ShareWXType.SHARE_URL;
                shareData.url = NativeBridge.mShareUrl;
                shareData.title = "乐趣湖南麻将";
                shareData.desc = "纯正玩法，还原家乡的感觉；随时随地，跨城亲友相约开战";
                NativeBridge.getInstance().mShareData = shareData;

                MvcUtil.send(CommonModule.COMMON_NATIVE_SHARE_CHOOSE_ROAD);
            }
            else {
                MvcUtil.send(CommonModule.COMMON_SHOW_SHARE_REMINDER_VIEW, ShareReminderTypeEnum.FRIENDS);
            }
            //----test 
            // RFGameCmd.initAck();
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
            MvcUtil.addView(new LobbyCreateGameView());
            //发送请求进入VIP老房间指令
            // let vRequestStartGameMsg:RequestStartGameMsg = new RequestStartGameMsg();
            // vRequestStartGameMsg.roomID = MJRoomID.VIPROOM;
            // ServerUtil.sendMsg(vRequestStartGameMsg);
            let vNewIntoOldGameTableMsg: NewIntoOldGameTableMsg = new NewIntoOldGameTableMsg();
            ServerUtil.sendMsg(vNewIntoOldGameTableMsg);
        }

        /**
         * 加入房间
         * @param {egret.TouchEvent} e
         */
        private joinGame(e: egret.TouchEvent): void {
            MvcUtil.addView(new DelLayerView(ViewLayerEnum.BOTTOM_ONLY));
            MvcUtil.addView(new LobbyJoinRoomView());
            //发送请求进入VIP老房间指令
            // let vRequestStartGameMsg:RequestStartGameMsg = new RequestStartGameMsg();
            // vRequestStartGameMsg.roomID = MJRoomID.VIPROOM;
            // ServerUtil.sendMsg(vRequestStartGameMsg);
            let vNewIntoOldGameTableMsg: NewIntoOldGameTableMsg = new NewIntoOldGameTableMsg();
            ServerUtil.sendMsg(vNewIntoOldGameTableMsg);
        }

    }
}