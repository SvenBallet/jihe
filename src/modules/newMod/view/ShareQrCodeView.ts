module FL {
    /**
     * 客服界面
     */
    export class ShareQrCodeView extends BaseView {

        //调停者名字，删除界面的时候会自动移除
        public readonly mediatorName: string = SetViewMediator.NAME;
        //界面层级，UI框架自动管理
        public readonly viewLayer: ViewLayerEnum = ViewLayerEnum.POPUP;

        //添加界面的缓动
        public addTween:Array<any> = [{data:[{scaleX:0.8, scaleY:0.8}, {scaleX:1, scaleY:1}, 200, Game.Ease.backOut]}];

        public closeGroup:eui.Group;
        public closeBtn:eui.Image;
        public qrCodeGro:eui.Group;
        public qrCodeImg:eui.Image;
        public qrIconImg:eui.Image;
        public shareTipsLab:eui.Group;
        public tipsLab:eui.Label;
        public nameLab:eui.Label;
        public idLab:eui.Label;
        public shareFriendsBtn:eui.Image;
        public shareFriendsBtn0:eui.Image;
        public shareFriendsBtn1:eui.Image;

        constructor () {
            super();
            this.verticalCenter = this.horizontalCenter = 0;
            this.skinName = skins.ShareQrCodeViewSkin;
        }

        protected childrenCreated():void {
            super.childrenCreated();

            TouchTweenUtil.regTween(this.closeBtn, this.closeBtn);
            MvcUtil.regMediator( new ShareQrCodeViewMediator(this) );

            this.initQrCodeImg();
            this.initDesc();

            this.tipsLab.visible = true;
            this.shareTipsLab.visible = false;
        }

        private initQrCodeImg() {
            let url = NativeBridge.mShareCodeUrl + "?" + LobbyData.playerVO.playerIndex;
            let qrSpript: egret.Sprite = qr.QRCode.create(url, 220, 220);
            this.qrCodeGro.addChildAt(qrSpript, 0);
            qrSpript.x = qrSpript.y = 10;
        }

        private initDesc() {
            let inviter: PlayerVO =  LobbyData.playerVO;
            this.nameLab.text = "邀请人昵称:" + inviter.playerName;
            this.idLab.text = "邀请人ID:" + inviter.playerIndex;
        }
    }
}