module FL {
    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase - SetView
     * @Description:  //开发版本登录界面
     * @Create: DerekWu on 2017/11/10 10:07
     * @Version: V1.0
     */
    export class SetView extends BaseView {

        //调停者名字，删除界面的时候会自动移除
        public readonly mediatorName: string = SetViewMediator.NAME;
        //界面层级，UI框架自动管理
        public readonly viewLayer: ViewLayerEnum = ViewLayerEnum.POPUP;

        //添加界面的缓动
        public addTween:Array<any> = [{data:[{scaleX:0.8, scaleY:0.8}, {scaleX:1, scaleY:1}, 200, Game.Ease.backOut]}];


        public soundEffectSld:eui.HSlider;
        public musicSld:eui.HSlider;

        public nameLabel:eui.Label;

        public closeBtn:eui.Image;
        public logOutBtn:GameButton;

        public avatarGroup:eui.Group;
        public headImg:eui.Image;

        public effectBtn:eui.Image;
        public musicBtn:eui.Image;
        public versionLabel:eui.Label;
        public changeBtn:FL.GameButton;
        public healthLab:eui.Label;

        /**开音效*/
        public static readonly SOUND_OPEN:string = "sound_open_png";
        /**关音效*/
        public static readonly SOUND_CLOSE:string = "sound_close_png";
        /**开音乐*/
        public static readonly MUSIC_OPEN:string = "music_open_png";
        /**关音乐*/
        public static readonly MUSIC_CLOSE:string = "music_close_png";

        constructor () {
            super();
            this.verticalCenter = this.horizontalCenter = 0;
            this.skinName = "skins.SetViewSkin";
        }

        protected childrenCreated():void {
            super.childrenCreated();

            TouchTweenUtil.regTween(this.closeBtn, this.closeBtn);
            TouchTweenUtil.regTween(this.effectBtn, this.effectBtn);
            TouchTweenUtil.regTween(this.musicBtn, this.musicBtn);
            TouchTweenUtil.regTween(this.changeBtn, this.changeBtn);
            // TouchTweenUtil.regTween(this.logOutBtn, this.logOutBtn);

            this.soundEffectSld.maximum = 100;
            this.musicSld.maximum = 100;

            let vPlayerVO:PlayerVO = LobbyData.playerVO;
            let playerName:string = vPlayerVO.playerName;
            // this.nameLabel.text = playerName;
            this.nameLabel.text = StringUtil.subStrSupportChinese(playerName, 16, "...");

            //设置头像
            if (GConf.Conf.useWXAuth) {
                // GWXAuth.setCircleWXHeadImg(this.headImg, vPlayerVO.headImageUrl, this.avatarGroup, 54,52,46);
                GWXAuth.setRectWXHeadImg(this.headImg, vPlayerVO.headImageUrl);
            }
            // else {
            //     GWXAuth.setCircleWXHeadImg(this.headImg, "http://wx.qlogo.cn/mmopen/vi_32/UmK17f9nicVrMhSQAbft5KOfKdIiaSFUHiaOTpxVum5JZ8G5zibHzzLkTJBicEuibL44kmuc8X0NpUrfgqrFKBh5jM9Q/0", this.avatarGroup, 54,52,46);
            // }

            //注册pureMvc
            MvcUtil.regMediator( new SetViewMediator(this) );

            if (Game.CommonUtil.isNative) {
                this.versionLabel.text = "v" + NativeBridge.appVersion + NativeBridge.mVersion + NativeBridge.mTest;
                this.changeBtn.visible = true;
            }
            else {
                this.versionLabel.text = "";
                if (GConf.Conf.isDev) {
                    this.changeBtn.visible = true;
                }
                else {
                    this.changeBtn.visible = false;
                }
            }
            
            this.healthLab.textFlow = new Array<egret.ITextElement> (
                {text: "健康须知", style: {textColor: 0xB95A00, "underline": true}}
            )
        }

    }
}