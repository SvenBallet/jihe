module FL {

    export class LobbyCreateGameViewMediator extends puremvc.Mediator implements puremvc.IMediator {

        public static readonly NAME: string = "LobbyCreateGameViewMediator";

        public vView: LobbyCreateGameView = this.viewComponent;
        constructor(pView: LobbyCreateGameView) {
            super(LobbyCreateGameViewMediator.NAME, pView);
            let self = this;
            pView.closeGroup.addEventListener(egret.TouchEvent.TOUCH_TAP, self.closeView, self);
            pView.btnList.addEventListener(eui.ItemTapEvent.ITEM_TAP, self.onChooseItem, self);
            pView.createRoomBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, self.createRoom, self);
            pView.createTHBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, self.createTeaHouse, self);
            pView.floorGroup.addEventListener(egret.TouchEvent.TOUCH_TAP, self.createFloor, self);
            pView.alterGroup.addEventListener(egret.TouchEvent.TOUCH_TAP, self.changeTeaRule, self);

            // pView.agentCreateGroup.addEventListener(egret.TouchEvent.TOUCH_TAP, self.agentCreateRoom, self);
            pView.mjGroup.addEventListener(egret.TouchEvent.TOUCH_TAP, self.vView.changeMjGroup, self.vView);
            pView.pokerGroup.addEventListener(egret.TouchEvent.TOUCH_TAP, self.vView.changeRFGroup, self.vView);

            self.setCurrentGameTab();
        }

        /**
    * 感兴趣的通知指令
    * @returns {Array<any>}
    */
        public listNotificationInterests(): Array<any> {
            return [
                TeaHouseModule.TH_REFRESH_CURRENT_FLOOR,
            ];
        }

        /**
         * 处理通知
         * @param {puremvc.INotification} pNotification
         */
        public handleNotification(pNotification: puremvc.INotification): void {
            let data: any = pNotification.getBody();
            switch (pNotification.getName()) {
                case TeaHouseModule.TH_REFRESH_CURRENT_FLOOR:
                    MvcUtil.delView(this.getView());
                    break;
            }
        }

        /**
         * 设置打开创建房间时的默认选项
         */
        private setCurrentGameTab(): void {
            //默认选择是麻将游戏
            let self = this;
            if (Storage.getItem("createTypeTab") === "" + EGameType.MAHJONG) {
                GameConstant.setCurrentGame(EGameType.MAHJONG);
                self.vView.changeMjGroup();
            } else if (Storage.getItem("createTypeTab") === "" + EGameType.RF) {
                GameConstant.setCurrentGame(EGameType.RF);
                self.vView.changeRFGroup();
            } else {
                GameConstant.setCurrentGame(EGameType.MAHJONG);
                self.vView.changeMjGroup();
            }
        }

        private getView(): LobbyCreateGameView {
            return <LobbyCreateGameView>this.viewComponent;
        }

        /**
         * 移除之后调用
         */
        public onRemove(): void {
            egret.localStorage.removeItem("agentRoomNum");
            egret.localStorage.removeItem("agentRoomType");
        }

        private closeView(e: egret.Event): void {
            // egret.localStorage.removeItem("agentRoomNum"); // 请看 onRemove()
            // egret.localStorage.removeItem("agentRoomType");
            if (this.getView().flag_createType == ELobbyCreateType.Floor || this.getView().flag_createType == ELobbyCreateType.TeaHouseChange) {
                MvcUtil.delView(this.getView());
                return;
            }
            let agentRoomType = egret.localStorage.getItem('agentRoomType');
            if (agentRoomType === "3" || agentRoomType === "2") {
                MvcUtil.addView(ClubBaseView.getInstance());
            } else {
                MvcUtil.send(LobbyModule.LOBBY_INTO_LOBBY);
            }
        }

        public onChooseItem(e?: eui.PropertyEvent): void {
            if (GameConstant.CURRENT_GAMETYPE == EGameType.MAHJONG)
                this.vView.loadMJContentPage();
            else if (GameConstant.CURRENT_GAMETYPE == EGameType.RF)
                this.vView.loadRFContentPage();
        }

        /**
         * 点击创建房间按钮
         * @param {number} roomType 开房的标识，0代表普通，1代表代开房，2代表俱乐部开房
         */
        private createRoom(roomType: number = 0): void {
            //组装创建房间消息发动给服务器
            //根据当前游戏类型组装消息
            // let vCreateVipRoomMsg: CreateVipRoomMsg = new CreateVipRoomMsg();
            switch (GameConstant.CURRENT_GAMETYPE) {
                case EGameType.MAHJONG:
                    this.sendCreateRoomMsg(roomType);
                    break;
                case EGameType.RF:
                    this.sendNCreateRoomMsg(roomType);
                    break;
            }
        }

        /** 点击创建茶楼按钮 */
        private createTeaHouse() {
            console.log('create th');
            this.sendCreateTHMsg();
        }

        /** 点击创建楼层按钮 */
        private createFloor() {
            this.sendCreateTHFloorMsg();
        }

        /** 发送创建房间消息，跑得快 */
        private sendNCreateRoomMsg(roomType: number) {
            let self = this;
            let vView: LobbyCreateGameView = self.getView();
            let personNum = vView.vLobbyCreatePokerItemView.personNumGroup.selectedValue;
            let gameNum = vView.vLobbyCreatePokerItemView.gameGroup.selectedValue;
            // let averageBill = vView.vLobbyCreatePokerItemView.averageBill.selected ? 1 : 0;
            let averageBill = 0;
            let vNewCreateRoomMsg = new NewCreateRoomMsg();
            //总局数
            vNewCreateRoomMsg.totalPlayCount = gameNum;
            //密码
            vNewCreateRoomMsg.psw = "";

            let createTabValue: string = vView.btnList.selectedItem;
            if (createTabValue === CREATE_RF_ITEM[0]) {
                // 设置玩法
                vNewCreateRoomMsg.mainGamePlayRule = ECardGamePlayWay.JING_DIAN_PAO_DE_KUAI; // 主玩法
            } else if (createTabValue === CREATE_RF_ITEM[1]) {
                // 设置玩法
                vNewCreateRoomMsg.mainGamePlayRule = ECardGamePlayWay.SHI_WU_ZHANG_PAO_DE_KUAI; // 主玩法
            }
            this.getView().vLobbyCreateRunFasterItemView.addMinorGamePlayRule(vNewCreateRoomMsg.subGamePlayRuleList); // 子玩法


            //几人局
            vNewCreateRoomMsg.playersNum = personNum;
            //房费是否均摊
            vNewCreateRoomMsg.payType = averageBill;

            //设置缓存
            Storage.setItem("createRFTab", createTabValue);
            Storage.setItem("createTypeTab", "" + EGameType.RF);
            Storage.setItem("createPokerPersonNum", personNum);
            Storage.setItem("createPokerGameNum", gameNum);
            Storage.setItem("createPokerAverageBill", "" + averageBill);
            // Storage.setItem("createShengYuPaiShu",""+shengYuPaiShu);

            // 俱乐部开房，代开房才有这个标识
            if (egret.localStorage.getItem("agentRoomType")) {
                roomType = parseInt(egret.localStorage.getItem("agentRoomType"));
            }

            if (egret.localStorage.getItem("agentRoomNum")) {
                roomType = 1;
            }

            /**
             * 是否代开房
             */
            if (roomType > 0 || egret.localStorage.getItem("agentRoomNum")) {
                if (averageBill === 1) {
                    ReminderViewUtil.showReminderView({ hasLeftBtn: true, hasRightBtn: true, leftCallBack: new MyCallBack(self.unSelectAverageBill, self), text: "俱乐部开房不能勾选房费均摊" });
                    return;
                }
                if (roomType === 2) {
                    vNewCreateRoomMsg.clubId = ClubData.vClub.id;
                }
                // 开房的标识，0代表普通，1代表代开房，2代表俱乐部开房
                vNewCreateRoomMsg.createType = roomType;
            }

            /**
             * 俱乐部自动开房设置
             */
            if (egret.localStorage.getItem("agentRoomType") === "3") {
                this.autoOpenPokerRoomSetting();
                return;
            }

            //发送
            egret.log(vNewCreateRoomMsg);
            ServerUtil.sendMsg(vNewCreateRoomMsg, MsgCmdConstant.MSG_INTO_GAME_TABLE);
        }

        /** 发送创建房间消息,麻将 */
        private sendCreateRoomMsg(roomType: number = 0) {
            let self = this;
            let vView: LobbyCreateGameView = self.getView();
            let personNum = vView.vLobbyCreateMjItemView.personNumGroup.selectedValue;
            let gameNum = vView.vLobbyCreateMjItemView.gameGroup.selectedValue;
            // let averageBill = vView.vLobbyCreateMjItemView.averageBill.selected ? 1 : 0;
            let averageBill = 0;
            let vNewCreateRoomMsg = new NewCreateRoomMsg();
            //房间 默认是 VIP 房间
            //vCreateVipRoomMsg.roomID = MJRoomID.VIPROOM;
            //几人局
            // vCreateVipRoomMsg.unused_0 = personNum;
            vNewCreateRoomMsg.playersNum = personNum;
            //圈数
            vNewCreateRoomMsg.totalPlayCount = gameNum;
            //房费是否均摊
            // vCreateVipRoomMsg.unused_1 = averageBill;
            vNewCreateRoomMsg.payType = averageBill;

            let createTabValue: string = vView.btnList.selectedItem;
            Storage.setItem("createTab", createTabValue);
            Storage.setItem("createTypeTab", "" + EGameType.MAHJONG);
            Storage.setItem("createPersonNum", personNum);
            Storage.setItem("createGameNum", gameNum);
            Storage.setItem("createAverageBill", "" + averageBill);

            // 俱乐部开房，代开房才有这个标识
            if (egret.localStorage.getItem("agentRoomType")) {
                roomType = parseInt(egret.localStorage.getItem("agentRoomType"));
                // egret.localStorage.removeItem("agentRoomType"); // 请看 onRemove()
            }

            if (egret.localStorage.getItem("agentRoomNum")) {
                roomType = 1;
            }

            /**
             * 是否代开房
             */
            if (roomType > 0 || egret.localStorage.getItem("agentRoomNum")) {
                if (averageBill === 1) {
                    ReminderViewUtil.showReminderView({ hasLeftBtn: true, hasRightBtn: true, leftCallBack: new MyCallBack(self.unSelectAverageBill, self), text: "俱乐部开房不能勾选房费均摊" });
                    return;
                }
                let roomNum: string = egret.localStorage.getItem("agentRoomNum") ? egret.localStorage.getItem("agentRoomNum") : "1";
                let vAgentCreateRoomNum: number = parseInt(roomNum);
                // egret.localStorage.removeItem("agentRoomNum");  // 请看 onRemove()
                // vCreateVipRoomMsg.unused_2 = (vAgentCreateRoomNum << 16) | GameConstant.AGENT_TABLE_FLAG;
                if (roomType === 2) {
                    vNewCreateRoomMsg.clubId = ClubData.vClub.id;
                }
                // 代开数量
                vNewCreateRoomMsg.daiKaiNumber = vAgentCreateRoomNum;
                // 开房的标识，0代表普通，1代表代开房，2代表俱乐部开房
                vNewCreateRoomMsg.createType = roomType;
            }

            /**
             * 俱乐部自动开房设置
             */
            if (egret.localStorage.getItem("agentRoomType") === "3") {
                this.autoOpenRoomSetting();
                return;
            }

            // 转转麻将玩法
            if (createTabValue === CREATE_MJ_ITEM[0]) {
                vNewCreateRoomMsg.mainGamePlayRule = MJGamePlayWay.ZHUAN_ZHUAN_MJ; // 主玩法
                this.getView().vLobbyCreateZhuanItemView.addMinorGamePlayRule(vNewCreateRoomMsg.subGamePlayRuleList); // 子玩法
            }

            // 长沙麻将玩法
            if (createTabValue === CREATE_MJ_ITEM[1]) {
                vNewCreateRoomMsg.mainGamePlayRule = MJGamePlayWay.CHANG_SHA_MJ; // 主玩法
                this.getView().vLobbyCreateChangShaItemView.addMinorGamePlayRule(vNewCreateRoomMsg.subGamePlayRuleList); // 子玩法
            }

            // 红中麻将
            if (createTabValue === CREATE_MJ_ITEM[2]) {
                vNewCreateRoomMsg.mainGamePlayRule = MJGamePlayWay.HONG_ZHONG_MJ; // 主玩法
                this.getView().vLobbyCreateHongZhongItemView.addMinorGamePlayRule(vNewCreateRoomMsg.subGamePlayRuleList); // 子玩法
            }

            //发送
            egret.log(vNewCreateRoomMsg);
            ServerUtil.sendMsg(vNewCreateRoomMsg, MsgCmdConstant.MSG_INTO_GAME_TABLE);
        }

        /** 
         * 发送创建茶楼消息
         */
        private sendCreateTHMsg() {
            let self = this;
            let vView: LobbyCreateGameView = self.getView();
            let personNum;
            let gameNum;
            let createTabValue: string = vView.btnList.selectedItem;
            //创建茶楼消息
            let msg = new CreateTeaHouseMsg();
            //默认楼层1
            msg.teahouseLayerNum = 1;
            //默认茶楼名字为主玩法
            msg.teahouseLayerName = createTabValue;
            //主玩法
            // 转转麻将玩法
            if (createTabValue === CREATE_MJ_ITEM[0]) {
                msg.primaryType = MJGamePlayWay.ZHUAN_ZHUAN_MJ; // 主玩法
                this.getView().vLobbyCreateZhuanItemView.addMinorGamePlayRule(msg.playWayList); // 子玩法
                personNum = vView.vLobbyCreateMjItemView.personNumGroup.selectedValue;
                gameNum = vView.vLobbyCreateMjItemView.gameGroup.selectedValue;
            }

            // 长沙麻将玩法
            if (createTabValue === CREATE_MJ_ITEM[1]) {
                msg.primaryType = MJGamePlayWay.CHANG_SHA_MJ; // 主玩法
                this.getView().vLobbyCreateChangShaItemView.addMinorGamePlayRule(msg.playWayList); // 子玩法
                personNum = vView.vLobbyCreateMjItemView.personNumGroup.selectedValue;
                gameNum = vView.vLobbyCreateMjItemView.gameGroup.selectedValue;
            }
            //跑得快
            if (createTabValue === CREATE_RF_ITEM[0] || createTabValue === CREATE_RF_ITEM[1]) {
                msg.primaryType = ECardGamePlayWay.JING_DIAN_PAO_DE_KUAI; // 主玩法
                // msg.teahouseLayerName = "经典跑得快";
                if (createTabValue === CREATE_RF_ITEM[1]) {
                    msg.primaryType = ECardGamePlayWay.SHI_WU_ZHANG_PAO_DE_KUAI; // 主玩法
                    // msg.teahouseLayerName = "十五张跑得快";
                }
                this.getView().vLobbyCreateRunFasterItemView.addMinorGamePlayRule(msg.playWayList); // 子玩法
                personNum = vView.vLobbyCreatePokerItemView.personNumGroup.selectedValue;
                gameNum = vView.vLobbyCreatePokerItemView.gameGroup.selectedValue;
            }
            // 红中麻将
            if (createTabValue === CREATE_MJ_ITEM[2]) {
                msg.primaryType = MJGamePlayWay.HONG_ZHONG_MJ; // 主玩法
                this.getView().vLobbyCreateHongZhongItemView.addMinorGamePlayRule(msg.playWayList); // 子玩法
                personNum = vView.vLobbyCreateMjItemView.personNumGroup.selectedValue;
                gameNum = vView.vLobbyCreateMjItemView.gameGroup.selectedValue;
            }
            //总人数
            msg.maxPlayersNum = personNum;
            //总局数
            msg.totalPlayCount = gameNum;
            console.log(msg);
            ServerUtil.sendMsg(msg, MsgCmdConstant.MSG_CREATE_TEAHOUSE_ACK);
        }

        /** 发送创建茶楼楼层消息 */
        private sendCreateTHFloorMsg() {
            let self = this;
            let vView: LobbyCreateGameView = self.getView();
            let personNum;
            let gameNum;
            let createTabValue: string = vView.btnList.selectedItem;
            //创建茶楼消息
            let msg = new CreateTeaHouseLayerMsg();
            //茶楼ID
            msg.teaHouseId = TeaHouseData.curID;
            //创建楼层
            msg.teahouseLayerNum = TeaHouseData.teaHouseTotalFloor + 1;
            //默认楼层名字为主玩法
            msg.teahouseLayerName = createTabValue;
            //主玩法
            // 转转麻将玩法
            if (createTabValue === CREATE_MJ_ITEM[0]) {
                msg.primaryType = MJGamePlayWay.ZHUAN_ZHUAN_MJ; // 主玩法
                this.getView().vLobbyCreateZhuanItemView.addMinorGamePlayRule(msg.playWayList); // 子玩法
                personNum = vView.vLobbyCreateMjItemView.personNumGroup.selectedValue;
                gameNum = vView.vLobbyCreateMjItemView.gameGroup.selectedValue;
            }

            // 长沙麻将玩法
            if (createTabValue === CREATE_MJ_ITEM[1]) {
                msg.primaryType = MJGamePlayWay.CHANG_SHA_MJ; // 主玩法
                this.getView().vLobbyCreateChangShaItemView.addMinorGamePlayRule(msg.playWayList); // 子玩法
                personNum = vView.vLobbyCreateMjItemView.personNumGroup.selectedValue;
                gameNum = vView.vLobbyCreateMjItemView.gameGroup.selectedValue;
            }
            //跑得快
            if (createTabValue === CREATE_RF_ITEM[0] || createTabValue === CREATE_RF_ITEM[1]) {
                msg.primaryType = ECardGamePlayWay.JING_DIAN_PAO_DE_KUAI; // 主玩法
                // msg.teahouseLayerName = "经典跑得快";
                if (createTabValue === CREATE_RF_ITEM[1]) {
                    msg.primaryType = ECardGamePlayWay.SHI_WU_ZHANG_PAO_DE_KUAI; // 主玩法
                    // msg.teahouseLayerName = "十五张跑得快";
                }
                this.getView().vLobbyCreateRunFasterItemView.addMinorGamePlayRule(msg.playWayList); // 子玩法
                personNum = vView.vLobbyCreatePokerItemView.personNumGroup.selectedValue;
                gameNum = vView.vLobbyCreatePokerItemView.gameGroup.selectedValue;
            }
            // 红中麻将
            if (createTabValue === CREATE_MJ_ITEM[2]) {
                msg.primaryType = MJGamePlayWay.HONG_ZHONG_MJ; // 主玩法
                this.getView().vLobbyCreateHongZhongItemView.addMinorGamePlayRule(msg.playWayList); // 子玩法
                personNum = vView.vLobbyCreateMjItemView.personNumGroup.selectedValue;
                gameNum = vView.vLobbyCreateMjItemView.gameGroup.selectedValue;
            }
            //总人数
            msg.maxPlayersNum = personNum;
            //总局数
            msg.totalPlayCount = gameNum;
            console.log(msg);
            ServerUtil.sendMsg(msg, MsgCmdConstant.MSG_GET_TEAHOUSE_LAYER_LIST_ACK);
        }

        // /** 发送创建房间消息,麻将 */
        // private sendCreateRoomMsg(roomType: number = 0) {
        //     let self = this;
        //     let vView: LobbyCreateGameView = self.getView();
        //     let personNum = vView.vLobbyCreateMjItemView.personNumGroup.selectedValue;
        //     let gameNum = vView.vLobbyCreateMjItemView.gameGroup.selectedValue;
        //     // let averageBill = vView.vLobbyCreateMjItemView.averageBill.selected ? 1 : 0;
        //     let averageBill = 0;
        //     let vCreateVipRoomMsg = new CreateVipRoomMsg();
        //     //房间 默认是 VIP 房间
        //     vCreateVipRoomMsg.roomID = MJRoomID.VIPROOM;
        //     //几人局
        //     // vCreateVipRoomMsg.unused_0 = personNum;
        //     vCreateVipRoomMsg.playersNumber = personNum;
        //     //圈数
        //     vCreateVipRoomMsg.quanNum = gameNum;
        //     //房费是否均摊
        //     // vCreateVipRoomMsg.unused_1 = averageBill;
        //     vCreateVipRoomMsg.payType = averageBill;
        //
        //     let createTabValue: string = vView.btnList.selectedItem;
        //     Storage.setItem("createTab", createTabValue);
        //     Storage.setItem("createTypeTab", ""+EGameType.MJ);
        //     Storage.setItem("createPersonNum", personNum);
        //     Storage.setItem("createGameNum", gameNum);
        //     Storage.setItem("createAverageBill", "" + averageBill);
        //
        //     // 俱乐部开房，代开房才有这个标识
        //     if (egret.localStorage.getItem("agentRoomType")) {
        //         roomType = parseInt(egret.localStorage.getItem("agentRoomType"));
        //         // egret.localStorage.removeItem("agentRoomType"); // 请看 onRemove()
        //     }
        //
        //     if (egret.localStorage.getItem("agentRoomNum")) {
        //         roomType = 1;
        //     }
        //
        //     /**
        //      * 是否代开房
        //      */
        //     if (roomType > 0 || egret.localStorage.getItem("agentRoomNum")) {
        //         if(averageBill === 1){
        //             ReminderViewUtil.showReminderView({hasLeftBtn:true, hasRightBtn:true,leftCallBack:new MyCallBack(self.unSelectAverageBill,self), text:"俱乐部开房不能勾选房费均摊"});
        //             return;
        //         }
        //         let roomNum: string = egret.localStorage.getItem("agentRoomNum") ? egret.localStorage.getItem("agentRoomNum") : "1";
        //         let vAgentCreateRoomNum: number = parseInt(roomNum);
        //         // egret.localStorage.removeItem("agentRoomNum");  // 请看 onRemove()
        //         // vCreateVipRoomMsg.unused_2 = (vAgentCreateRoomNum << 16) | GameConstant.AGENT_TABLE_FLAG;
        //         if (roomType === 2) {
        //             vCreateVipRoomMsg.unused_3 = ClubData.vClub.id;
        //         }
        //         // 代开数量
        //         vCreateVipRoomMsg.daiKaiNumber = vAgentCreateRoomNum;
        //         // 开房的标识，0代表普通，1代表代开房，2代表俱乐部开房
        //         vCreateVipRoomMsg.roomType = roomType;
        //     }
        //
        //     /**
        //      * 俱乐部自动开房设置
        //      */
        //     if (egret.localStorage.getItem("agentRoomType") === "3") {
        //         this.autoOpenRoomSetting();
        //         return;
        //     }
        //
        //     // 设置玩法
        //     if (createTabValue === CREATE_MJ_ITEM[0]) {
        //         vCreateVipRoomMsg.mainGamePlayRule = MJGamePlayWay.ZHUANZHUAN; // 主玩法
        //         this.getView().vLobbyCreateZhuanItemView.addMinorGamePlayRule(vCreateVipRoomMsg.minorGamePlayRuleList); // 子玩法
        //     }
        //
        //     //发送
        //     egret.log(vCreateVipRoomMsg);
        //     ServerUtil.sendMsg(vCreateVipRoomMsg, MsgCmdConstant.MSG_GAME_START_GAME_REQUEST_ACK);
        // }

        /**
         * 取消房费均摊
         */
        private unSelectAverageBill(): void {
            if (GameConstant.CURRENT_GAMETYPE == EGameType.MAHJONG)
                this.getView().vLobbyCreateMjItemView.averageBill.selected = false;
            else if (GameConstant.CURRENT_GAMETYPE == EGameType.RF)
                this.getView().vLobbyCreatePokerItemView.averageBill.selected = false;
        }

        /**
         * 点击代开房按钮
         */
        private agentCreateRoom(): void {
            this.createRoom(1);
        }

        private autoOpenPokerRoomSetting(): void {
            let vView: LobbyCreateGameView = this.getView();
            let personNum = vView.vLobbyCreatePokerItemView.personNumGroup.selectedValue;
            let gameNum = vView.vLobbyCreatePokerItemView.gameGroup.selectedValue;
            let autoOpenRoom: boolean = vView.autoOpenRoom.selected;
            let vSetTableSettingsMsg: SetTableSettingsMsg = new SetTableSettingsMsg();
            vSetTableSettingsMsg.clubId = ClubData.vClub.id;
            vSetTableSettingsMsg.autoKaiFang = autoOpenRoom;
            vSetTableSettingsMsg.clientData = "";
            vSetTableSettingsMsg.quanNum = gameNum;
            vSetTableSettingsMsg.personNum = personNum;
            vSetTableSettingsMsg.mainGamePlayRule = ECardGamePlayWay.JING_DIAN_PAO_DE_KUAI;
            this.getView().vLobbyCreateRunFasterItemView.addMinorGamePlayRule(vSetTableSettingsMsg.minorGamePlayRuleList);
            egret.log(vSetTableSettingsMsg);
            ServerUtil.sendMsg(vSetTableSettingsMsg, MsgCmdConstant.MSG_SET_TABLE_SETTINGS_ACK);
        }

        private autoOpenRoomSetting(): void {
            let vView: LobbyCreateGameView = this.getView();
            let personNum = vView.vLobbyCreateMjItemView.personNumGroup.selectedValue;
            let gameNum = vView.vLobbyCreateMjItemView.gameGroup.selectedValue;
            let autoOpenRoom: boolean = vView.autoOpenRoom.selected;
            let vSetTableSettingsMsg: SetTableSettingsMsg = new SetTableSettingsMsg();
            vSetTableSettingsMsg.clubId = ClubData.vClub.id;
            vSetTableSettingsMsg.autoKaiFang = autoOpenRoom;
            vSetTableSettingsMsg.clientData = "";
            vSetTableSettingsMsg.quanNum = gameNum;
            vSetTableSettingsMsg.personNum = personNum;
            vSetTableSettingsMsg.mainGamePlayRule = MJGamePlayWay.ZHUANZHUAN;
            this.getView().vLobbyCreateZhuanItemView.addMinorGamePlayRule(vSetTableSettingsMsg.minorGamePlayRuleList);
            ServerUtil.sendMsg(vSetTableSettingsMsg, MsgCmdConstant.MSG_SET_TABLE_SETTINGS_ACK);
        }

        private changeTeaRule() {
            if (TeaHouseData.curPower === ETHPlayerPower.ILLEGAL) {//非法值没有权限
                PromptUtil.show("无权限", PromptType.ERROR);
                return;
            }
            if (TeaHouseData.curPower === ETHPlayerPower.MEMBER) {
                PromptUtil.show("无权限", PromptType.ERROR);
                return;
            }

            let msg = new ChangeTeaHouseLayerRuleMsg();
            let topView: LobbyCreateMjItemView | LobbyCreatePokerItemView;
            let contentView: LobbyCreateZhuanItemView | LobbyCreateHongzhongItemView | LobbyCreateChangShaItemView | LobbyCreateRunFasterItemView;
            let createTabValue: string = this.vView.btnList.selectedItem;
            msg.teahouseLayerName = createTabValue;
            // 转转麻将玩法
            if (createTabValue === CREATE_MJ_ITEM[0]) {
                msg.mainWay = MJGamePlayWay.ZHUAN_ZHUAN_MJ;
                topView = LobbyCreateMjItemView.getInstance();
                contentView = LobbyCreateZhuanItemView.getInstance();
            }

            // 长沙麻将玩法
            if (createTabValue === CREATE_MJ_ITEM[1]) {
                msg.mainWay = MJGamePlayWay.CHANG_SHA_MJ;
                topView = LobbyCreateMjItemView.getInstance();
                contentView = LobbyCreateChangShaItemView.getInstance();
            }
            //跑得快
            if (createTabValue === CREATE_RF_ITEM[0] || createTabValue === CREATE_RF_ITEM[1]) {
                msg.mainWay = ECardGamePlayWay.JING_DIAN_PAO_DE_KUAI; // 主玩法
                // msg.teahouseLayerName = "经典跑得快";
                if (createTabValue === CREATE_RF_ITEM[1]) {
                    msg.mainWay = ECardGamePlayWay.SHI_WU_ZHANG_PAO_DE_KUAI; // 主玩法
                    // msg.teahouseLayerName = "十五张跑得快";
                }
                topView = LobbyCreatePokerItemView.getInstance();
                contentView = LobbyCreateRunFasterItemView.getInstance();
            }
            // 红中麻将
            if (createTabValue === CREATE_MJ_ITEM[2]) {
                msg.mainWay = MJGamePlayWay.HONG_ZHONG_MJ;
                topView = LobbyCreateMjItemView.getInstance();
                contentView = LobbyCreateHongzhongItemView.getInstance();
            }
            contentView.addMinorGamePlayRule(msg.playWay); 
            msg.maxPlayersNum = topView.personNumGroup.selectedValue;
            msg.totalPlayCount = topView.gameGroup.selectedValue;
            msg.teaHouseId = TeaHouseData.curID;
            msg.teaHouseLayer = this.getView().flag_floor;
            ServerUtil.sendMsg(msg, MsgCmdConstant.MSG_GET_TEAHOUSE_LAYER_LIST_ACK);
        }
    }
}