module FL {
    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase - NoticeView
     * @Description:  //开发版本登录界面
     * @Create: DerekWu on 2017/11/10 10:07
     * @Version: V1.0
     */
    export class NoticeView extends BaseView {

        //调停者名字，删除界面的时候会自动移除
        public readonly mediatorName: string = NoticeViewMediator.NAME;
        //界面层级，UI框架自动管理
        public readonly viewLayer: ViewLayerEnum = ViewLayerEnum.POPUP;

        //添加界面的缓动
        public addTween:Array<any> = [{data:[{scaleX:0.8, scaleY:0.8}, {scaleX:1, scaleY:1}, 200, Game.Ease.backOut]}];

        //公告内容
        public contentLabel:eui.Label;
        //关闭按钮
        public closeBtn:eui.Image;

        public base:eui.Group;
        private armature:dragonBones.Armature;
        public aniPanel:eui.Group;

        constructor (content:string="") {
            super();
            this.verticalCenter = this.horizontalCenter = 0;
            this.skinName = "skins.NoticeViewSkin";
            this.contentLabel.text = content;
        }

        protected childrenCreated():void {
            super.childrenCreated();

            //注册pureMvc
            MvcUtil.regMediator( new NoticeViewMediator(this) );

            this.showAnimation()
        }

        public showAnimation(){
            this.armature = FL.AnimationLoader.loadAnimation("gonggao_ske_dbbin","gonggao_tex_json","gonggao_tex_png");                        
            this.contentLabel.alpha = 0;
            var armatureDisplay = this.armature.getDisplay()
            this.aniPanel.addChild(armatureDisplay);
            this.armature.animation.play(null, 1);
            Game.Tween.get(this.contentLabel).wait(1500).to({alpha:1},500)
        }
    }
}