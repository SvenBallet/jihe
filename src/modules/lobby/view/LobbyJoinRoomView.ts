module FL {

    export class LobbyJoinRoomView extends BaseView {

        public readonly mediatorName: string = LobbyJoinRoomViewMediator.NAME;
        public readonly viewLayer: ViewLayerEnum = ViewLayerEnum.POPUP_ONLY;

        /** 关闭按钮 */
        public closeViewGroup: eui.Group;
        public closeGroup: eui.Group;
        public closeBtn: GameButton;

        //数字
        public oneBtn: GameButton;
        public twoBtn: GameButton;
        public threeBtn: GameButton;
        public fourBtn: GameButton;
        public fineBtn: GameButton;
        public sixBtn: GameButton;
        public sevenBtn: GameButton;
        public eightBtn: GameButton;
        public nineBtn: GameButton;
        public zeroBtn: GameButton;

        /** 标题 */
        public titleLab: eui.Label;

        public reenterBtn: GameButton;
        public deleteBtn: GameButton;

        public dataList: eui.List;

        public _valueLength: number = 5;

        /** 是加入房间，还是加入茶楼 */
        public flag_isJoinRoom: boolean = true;
        constructor() {
            super();
            this.left = this.right = this.top = this.bottom = 0;
            this.verticalCenter = this.horizontalCenter = 0;
            this.skinName = "skins.LobbyJoinRoomViewSkin";
        }

        protected childrenCreated(): void {
            super.childrenCreated();
            let self = this;
            this.dataList.itemRendererSkinName = "skins.LobbyDataItemSkin";
            let layout = new eui.HorizontalLayout();
            layout.gap = 5;
            this.dataList.layout = layout;

            TouchTweenUtil.regTween(self.closeGroup, self.closeBtn);
            TouchTweenUtil.regTween(self.oneBtn, self.oneBtn);
            TouchTweenUtil.regTween(self.twoBtn, self.twoBtn);
            TouchTweenUtil.regTween(self.threeBtn, self.threeBtn);
            TouchTweenUtil.regTween(self.fourBtn, self.fourBtn);
            TouchTweenUtil.regTween(self.fineBtn, self.fineBtn);
            TouchTweenUtil.regTween(self.sixBtn, self.sixBtn);
            TouchTweenUtil.regTween(self.sevenBtn, self.sevenBtn);
            TouchTweenUtil.regTween(self.eightBtn, self.eightBtn);
            TouchTweenUtil.regTween(self.nineBtn, self.nineBtn);
            TouchTweenUtil.regTween(self.zeroBtn, self.zeroBtn);
            TouchTweenUtil.regTween(self.reenterBtn, self.reenterBtn);
            TouchTweenUtil.regTween(self.deleteBtn, self.deleteBtn);
            //注册pureMvc
            MvcUtil.regMediator(new LobbyJoinRoomViewMediator(self));
        }

        /** 设置加入标识 */
        public setJoinFlag(flag: boolean) {
            this.flag_isJoinRoom = flag;
            this.titleLab.text = (flag) ? "加入房间" : "加入茶楼";
        }
    }
}