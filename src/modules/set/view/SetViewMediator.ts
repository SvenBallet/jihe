module FL {
    /**
     * 登录界面调停者
     * @Name:  FL - SetViewMediator
     * @Company 深圳市天天爱科技有限公司 版权所有
     * @Description:  无详细描述
     * @Create: DerekWu on 2017/8/16 14:30
     * @Version: V1.0
     */
    export class SetViewMediator extends puremvc.Mediator implements puremvc.IMediator {

        //注册到pureMvc中的名字，不能重复，否则会覆盖
        public static readonly NAME:string = "SetViewMediator";

        public vView:SetView = this.viewComponent;

        constructor (pView:SetView) {
            super(SetViewMediator.NAME, pView);
            let self = this;
            pView.closeBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, self.closeView, self);
            pView.effectBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, self.switchEffect, self);
            pView.musicBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, self.switchMusic, self);
            pView.changeBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, self.changeID,self)
            // pView.logOutBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, self.logOut, self);
            pView.musicSld.addEventListener(egret.Event.CHANGE,this.onMusicVolumeChange,this);
            pView.soundEffectSld.addEventListener(egret.Event.CHANGE,this.onSoundVolumeChange,this);
            pView.healthLab.addEventListener(egret.TouchEvent.TOUCH_TAP, self.openHealth, self);

            let effectVolume = SoundManager.getEffectVolume();
            let musicVolume = SoundManager.getBGMusicVolume();
            pView.musicSld.value = pView.musicSld.maximum * musicVolume;
            pView.soundEffectSld.value = pView.soundEffectSld.maximum * effectVolume;
            self.changeIcon();
        }
            
        private closeView(e:egret.Event):void {
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
        private changeIcon(){
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
         * 切换账号
         */
        private changeID() {
            let sureCallback: Function = () => {
                NativeBridge.intoWXLogin = false;
                MvcUtil.delView(this.viewComponent);
                ServerUtil.closeSocket();
                let vLobbyBaseView: LobbyBaseView = LobbyBaseView.getInstance();
                let vLobbyLeftTopView: LobbyLeftTopView = LobbyLeftTopView.getInstance();
                let vLobbyRightTopView: LobbyRightTopView = LobbyRightTopView.getInstance();
                MvcUtil.delView(vLobbyBaseView);
                MvcUtil.delView(vLobbyLeftTopView);
                MvcUtil.delView(vLobbyRightTopView);
                if (Game.CommonUtil.isNative) {
                    Storage.removeItem(Storage.WX_ACCESS_TOKEN_INFO);
                    Storage.removeItem(Storage.XL_ACCESS_TOKEN_INFO);
                    let vLoginMsg:LoginMsg = CommonHandler.getLastDevLoginMsg();
                    vLoginMsg.xlOpenID = "";
                }
                //登录背景
                FL.MvcUtil.addView(FL.ViewManager.getLoginBg());
                FL.MvcUtil.addView(new FL.LoginView());
            };

            let contentStr = "确认退出账号？";
            let params = {
                hasLeftBtn: true,
                leftCallBack: () => {
                    sureCallback();
                },
                hasRightBtn: true,
                text: contentStr
            }
            ReminderViewUtil.showReminderView(params);
        }
        
        // //登出
        // private logOut()
        // {
        //
        // }

        private openHealth() {
            // MvcUtil.delView(this.viewComponent);
            // 健康须知
            MvcUtil.addView(new HealthView());
        }
    }
}