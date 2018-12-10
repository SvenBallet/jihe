module FL {
    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase - LobbyRightTopView
     * @Description:  //大厅右上界面
     * @Create: DerekWu on 2017/11/11 12:32
     * @Version: V1.0
     */
    export class LobbyRightTopView extends BaseView {

        public readonly mediatorName: string = LobbyRightTopViewMediator.NAME;
        public readonly viewLayer: ViewLayerEnum = ViewLayerEnum.BOTTOM;

        //添加界面的缓动
        // public addTween:Array<any> = [{data:[{top:-106}, {top:0}, 1000, Game.Ease.quintOut]}];

        //设置组
        public settingGroup:eui.Group;
        public settingBtn:eui.Image;
        public msgLabel:eui.Label;

        //滚动字幕组
        public scrollGroup:eui.Group;
        private msgTween:Game.Tween;
        public noticeScroller:eui.Scroller;


        //帮助按钮
        public helpGroup:eui.Group;
        public helpBtn:eui.Image;

        /** 单例 */
        private static _only: LobbyRightTopView;

        /** 调停者 */
        private _mediator:LobbyRightTopViewMediator;

        public static getInstance(): LobbyRightTopView {
            if (!this._only) {
                this._only = new LobbyRightTopView();
            }
            return this._only;
        }

        constructor () {
            super();
            this.right = this.top = 0;
            this.skinName = "skins.LobbyRightTopViewSkin";
        }

        protected childrenCreated():void {
            super.childrenCreated();
            let self = this;

            //注册按钮点击缓动
            TouchTweenUtil.regTween(self.settingGroup, this.settingBtn);
            TouchTweenUtil.regTween(self.helpGroup, this.helpBtn);

            //调停者
            self._mediator = new LobbyRightTopViewMediator(self);

            // (H5版本禁用分享到朋友圈)
            // let vFreeDiamondMovie:dragonBones.Movie = DragonBonesUtil.buildMovie(DBGroupName.FREE_DIAMOND);
            // vFreeDiamondMovie.x =  40;
            // vFreeDiamondMovie.y =  68;
            // vFreeDiamondMovie.play("animation", 0);
            // self.freeDiamondGroup.addChild(vFreeDiamondMovie);
            // self.freeDiamondMovie = vFreeDiamondMovie;
            // TouchTweenUtil.regTween(self.freeDiamondGroup, vFreeDiamondMovie);

            // APPSTORE屏蔽
            if (NativeBridge.IOSMask) {
                self.noticeScroller.visible = false;
                self.scrollGroup.visible = false;
            }
        }

        /** 添加到界面以后框架自动调用 */
        protected onAddView():void {
            //滚动公告显示
            let msgContent:string = LobbyData.anounceMsgText;
            this.showAnnounceMsg(msgContent,1);
            MvcUtil.regMediator(this._mediator);
        }

        public showAnnounceMsg(text:string,isRmPreviousMsg:number):void{
            if(isRmPreviousMsg === 1){
                this.msgLabel.text = text;
            }else{
                this.msgLabel.text = this.msgLabel.text+" "+text;
            }
            let srcPosx = 410;
            // this.scrollGroup.validateNow();
            if(!this.msgTween){
                //每秒钟100像素
                let speedTime = (srcPosx + this.msgLabel.width)/100 * 1000;
                this.msgTween = Game.Tween.get( this.msgLabel,{loop:true} ).to({x:srcPosx}).to( {x:0-this.msgLabel.width},speedTime).wait(1000);
            }
        }

        protected onRemView():void{
            if(this.msgTween){
                Game.Tween.removeTweens(this.msgLabel);
                this.msgTween = null;
            }
                
        }

    }
}