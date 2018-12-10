module FL {
    /**
     * 语音播放显示UI
     * @copyright 深圳市天天爱科技有限公司
     * @author Sven
     * @date 2018/4/25
     */
    export class TalkAni extends eui.Component {
        public talkImg:eui.Image;
        private autoHideTime: number = 0;
        private static imgURLList: Array<string> = ["voice_v_anim1_png","voice_v_anim2_png","voice_v_anim3_png"];

        public constructor() {
            super();
            this.skinName = skins.TalkAniSkin;
        }
    
        protected childrenCreated() {
            this.hide();
            this.addEventListener(egret.TouchEvent.TOUCH_TAP, ()=>{
                this.hide();
            },this);
        }

        /**
         * 显示并播放动画
         */
        public showPlay() {
            this.parent && this.parent.setChildIndex(this, 999);
            egret.clearTimeout(this.autoHideTime);
            this.visible = true;
            let inTime = 300;

            egret.Tween.get(this.talkImg, {loop: true})
            .set({source: TalkAni.imgURLList[0]})
            .wait(inTime)
            .set({source: TalkAni.imgURLList[1]})
            .wait(inTime)
            .set({source: TalkAni.imgURLList[2]})
            .wait(inTime)

            this.autoHideTime = egret.setTimeout(()=>{
                this.hide();
            }, this, TalkState.progressTime);
        }

        /**
         * 隐藏
         */
        public hide() {
            this.visible = false;
            egret.Tween.removeTweens(this.talkImg);
            TalkCache.clearTalkList();
        }
    }
}