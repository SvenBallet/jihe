module FL {

    export class MJGameSetViewMediator extends puremvc.Mediator implements puremvc.IMediator {

        public static readonly NAME:string = "MJGameSetViewMediator";

        public vView:MJGameSetView = this.viewComponent;

        constructor (pView:MJGameSetView) {
            super(MJGameSetViewMediator.NAME, pView);
            let self = this;
            pView.closeBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, self.closeView, self);
            pView.effectBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, self.switchEffect, self);
            pView.musicBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, self.switchMusic, self);
            pView.musicSld.addEventListener(egret.Event.CHANGE,self.onMusicVolumeChange,self);
            pView.soundEffectSld.addEventListener(egret.Event.CHANGE,self.onSoundVolumeChange,self);
            pView.backgroundRadioGroup.addEventListener(egret.Event.CHANGE,self.onChangeBackground,self);
            pView.paibeiRadioGroup.addEventListener(egret.Event.CHANGE, self.bgChange, self);
            pView.pokerSytleRadioGro.addEventListener(egret.Event.CHANGE, self.pokerStyleChange, self);
            pView.pokerSytleRadioGro0.addEventListener(egret.Event.CHANGE, self.languageStyleChange, self);

            /** 切换TAB */
            pView.todayTapGroup.addEventListener(egret.TouchEvent.TOUCH_TAP, pView.selectTodayTab, pView);
            pView.yesterdayTapGroup.addEventListener(egret.TouchEvent.TOUCH_TAP, pView.selectYesterdayTab, pView);
            pView.thisWeekTapGroup.addEventListener(egret.TouchEvent.TOUCH_TAP, pView.selectThisWeekTab, pView);

            /** 返回，解散 */
            pView.replayBtnGroup0.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onExit, this);
            pView.replayBtnGroup.addEventListener(egret.TouchEvent.TOUCH_TAP, this.exeDissolveRoom, this);

            let effectVolume = SoundManager.getEffectVolume();
            let musicVolume = SoundManager.getBGMusicVolume();
            pView.musicSld.value = pView.musicSld.maximum * musicVolume;
            pView.soundEffectSld.value = pView.soundEffectSld.maximum * effectVolume;
            self.changeIcon();
        }

        private pokerStyleChange() {
            let value: string = this.viewComponent.pokerSytleRadioGro.selectedValue;
            if (value != RFHandCardItemView.cardStyle + "") {
                RFHandCardItemView.cardStyle = Number(value);
                Storage.setPokerStyle(value);
                MvcUtil.send(RFGameModule.RFGAME_CHANGE_POKER_STYLE);
            }
        }

        /** 切换语言 */
        private languageStyleChange() {
            let value: string = this.viewComponent.pokerSytleRadioGro0.selectedValue;
            if (value != MahjongSoundHandler.languageStyle + "") {
                MahjongSoundHandler.languageStyle = Number(value);
                Storage.setMahjongLanguageStyle(value);
            }
        }

        private bgChange() {
            let paiBeiValue: string = this.viewComponent.paibeiRadioGroup.selectedValue;
            if (paiBeiValue !== MahjongCardItem.cardBgColor+"") {
                MahjongCardItem.cardBgColor = Number(paiBeiValue);
                Storage.setMJPBResPrefix(paiBeiValue);
                // 更换牌被逻辑
                MahjongCardManager.reBgImg();
            }
        }

        private closeView(e:egret.Event){
            MvcUtil.delView(this.viewComponent);
        }

        /**
         * 滑动更改音乐
         * @param {egret.Event} e
         */
        private onMusicVolumeChange(e:egret.Event):void{
            let slider = <eui.HSlider> e.target;
            let scale = slider.pendingValue / slider.maximum;
            SoundManager.resetBgMusicVolume(scale);
            this.changeIcon();
        }

        /**
         * 滑动更改音效
         * @param {egret.Event} e
         */
        private onSoundVolumeChange(e:egret.Event):void{
            let slider = <eui.HSlider> e.target;
            let scale = slider.pendingValue / slider.maximum;
            SoundManager.resetEffectVolume(scale);
            this.changeIcon();
        }

        /**
         * 音效开关
         * @param {egret.Event} e
         */
        private switchEffect(e:egret.Event):void {
            if(this.vView.soundEffectSld.value === 0){
                this.vView.soundEffectSld.value = 100;
                SoundManager.resetEffectVolume(100);
                this.vView.effectBtn.source = SetView.SOUND_OPEN;
            }else{
                this.vView.soundEffectSld.value = 0;
                SoundManager.resetEffectVolume(0);
                this.vView.effectBtn.source = SetView.SOUND_CLOSE;
            }
        }

        /**
         * 音乐开关
         * @param {egret.Event} e
         */
        private switchMusic(e:egret.Event):void {
            if(this.vView.musicSld.value === 0){
                this.vView.musicSld.value = 100;
                SoundManager.resetBgMusicVolume(100);
                this.vView.musicBtn.source = SetView.MUSIC_OPEN;
            }else{
                this.vView.musicSld.value = 0;
                SoundManager.resetBgMusicVolume(0);
                this.vView.musicBtn.source = SetView.MUSIC_CLOSE;
            }
        }

        /**
         * 更改按钮开关按钮样式
         */
        private changeIcon():void{
            if(this.vView.soundEffectSld.value === 0){
                this.vView.effectBtn.source = SetView.SOUND_CLOSE;
            }else{
                this.vView.effectBtn.source = SetView.SOUND_OPEN;
            }

            if(this.vView.musicSld.value === 0){
                this.vView.musicBtn.source = SetView.MUSIC_CLOSE;
            }else{
                this.vView.musicBtn.source = SetView.MUSIC_OPEN;
            }
        }

        /**
         * 更改背景色
         * @param {egret.Event} e
         */
        private onChangeBackground(e:egret.Event):void{
            let vView:MJGameSetView = this.viewComponent;
            if(vView.backgroundRadioGroup.selectedValue === MJGameSetView.GREEN_BACKGROUND){
                ViewManager.resetTableBoardBg(MJGameSetView.GREEN_BACKGROUND);
            }else if(vView.backgroundRadioGroup.selectedValue === MJGameSetView.BULE_BACKGROUND){
                ViewManager.resetTableBoardBg(MJGameSetView.BULE_BACKGROUND);
            }else if(vView.backgroundRadioGroup.selectedValue === MJGameSetView.DARK_BACKGROUND) {
                 ViewManager.resetTableBoardBg(MJGameSetView.DARK_BACKGROUND);
            }
        }

        private onExit() {
            if (!GameConstant.CURRENT_HANDLE.isReplay()) {
                let vReminderText: string;
                if (GameConstant.CURRENT_HANDLE.isVipRoom() && !GameConstant.CURRENT_HANDLE.isReplay()) {
                    vReminderText = "离开房间会造成游戏暂停，是否继续离开？";
                } else {
                    vReminderText = "您确定要返回大厅吗？";
                }
                ReminderViewUtil.showReminderView({
                    hasLeftBtn: true,
                    leftCallBack: new MyCallBack(this.backLobby, this),
                    hasRightBtn: true,
                    text: vReminderText
                });
            } else {
                //客户端自己返回大厅
                this.backLobby();
            }
        }

        /**
         * 返回大厅
         */
        private backLobby(): void {
            // 是否强制返回大厅
            let flag = false;
            if (!GameConstant.CURRENT_HANDLE.isReplay()) {
                //给服务器发送消息
                let msg = new NewPlayerLeaveRoomMsg();
                msg.leaveFlag = 4;
                ServerUtil.sendMsg(msg);
            }
            else {//回放需要确保已经关闭动画
                if (GameConstant.CURRENT_HANDLE == RFGameHandle) {
                    RFGameLogReplay.endPlay();
                }
                else {
                    MahjongLogReplay.endPlay();
                }
                RecordView.lobbyRecord && (flag = true);
            }

            if (GameConstant.CURRENT_HANDLE == RFGameHandle) {
                RFCardItemPool.destoryPool();
            }

            if (GameConstant.CURRENT_HANDLE.getNewIntoGameTableMsgAck().teaHouseId && !flag) {
                //表示是从茶楼桌子退出
                TeaHouseMsgHandle.sendAccessTeaHouseMsg(GameConstant.CURRENT_HANDLE.getNewIntoGameTableMsgAck().teaHouseId);
                return;
            }
            //客户端自己返回大厅
            MvcUtil.send(LobbyModule.LOBBY_INTO_LOBBY);
        }

        /**
         * 处理解散房间
         * @param {egret.TouchEvent} e
         */
        private exeDissolveRoom(e: egret.TouchEvent): void {
            if (GameConstant.CURRENT_HANDLE.isReplay()) return;
            //分类型提示 和 处理
            let vReminderText: string;
            let vCallBackFun: Function;
            if (GameConstant.CURRENT_HANDLE.isCanLeaveRoom()) {
                vCallBackFun = this.dissolveRoomNoStart;
                if (GameConstant.CURRENT_HANDLE.isRoomOwner(PZOrientation.DOWN)) {
                    vReminderText = "您确定要解散房间吗？（第一局未结算，解散房间不扣钻石）";
                } else {
                    vReminderText = "您确定要离开房间吗？";
                }
            } else {
                vReminderText = "您确定要请求解散房间吗？";
                vCallBackFun = this.applyDissolve;
            }

            //弹出确认框
            ReminderViewUtil.showReminderView({
                hasLeftBtn: true,
                leftCallBack: new MyCallBack(vCallBackFun, this),
                hasRightBtn: true,
                text: vReminderText
            });
        }

        /**
         * 解散房间，未开始前的解散
         */
        private dissolveRoomNoStart(): void {
            if (GameConstant.CURRENT_HANDLE.isReplay()) return;
            let msg = new NewPlayerLeaveRoomMsg();
            if (GameConstant.CURRENT_HANDLE.isRoomOwner(PZOrientation.DOWN)) {
                //我是不是房主的判断
                msg.leaveFlag = 2;
            } else {
                msg.leaveFlag = 1;
            }
            ServerUtil.sendMsg(msg);
            if (!GameConstant.CURRENT_HANDLE.isRoomOwner(PZOrientation.DOWN)) {
                //不是房主客户端自己返回大厅，是房主的话收到VIP房间结束消息弹出提示，后点击提示面板的返回大厅按钮再返回大厅
                if (MahjongData.requestStartGameMsgAck.teaHouseId) {
                    //表示是从茶楼桌子退出
                    TeaHouseMsgHandle.sendAccessTeaHouseMsg(MahjongData.requestStartGameMsgAck.teaHouseId);
                    return;
                }
                MvcUtil.send(LobbyModule.LOBBY_INTO_LOBBY);
            }
        }

        /**
         * 申请解散房间
         */
        private applyDissolve(): void {
            if (GameConstant.CURRENT_HANDLE.isReplay()) return;
            let vApplyDismissRoomMsg: ApplyDismissRoomMsg = new ApplyDismissRoomMsg();
            ServerUtil.sendMsg(vApplyDismissRoomMsg);
        }
    }
}