module FL {

    export class MJGameChatView extends BaseView {

        //调停者名字，删除界面的时候会自动移除
        public readonly mediatorName: string = MJGameChatViewMediator.NAME;
        //界面层级，UI框架自动管理
        public readonly viewLayer: ViewLayerEnum = ViewLayerEnum.TOOLTIP_BOTTOM;

        //全屏的透明层
        public delGroup: eui.Group;
        //玩家信息弹窗组
        public detailGroup: eui.Group;

        public faceBtn: eui.Image;
        public textBtn: eui.Image;

        public faceGroup: eui.Group;
        public faceImgGroup: eui.Group;

        public textGroup: eui.Group;
        public textLabelGroup: eui.Group;

        public inputText: eui.TextInput;

        public submitBtn: GameButton;
        public textImg: eui.Image;
        public faceImg: eui.Image;
        public arrowImg: eui.Image;

        public static readonly FACE_CHOSEN: string = "face_btn_chosen_png";
        public static readonly FACE_UNCHOSEN: string = "face_btn_unchosen_png";
        public static readonly TEXT_CHOSEN: string = "face_btn_chosen_png";
        public static readonly TEXT_UNCHOSEN: string = "face_btn_unchosen_png";
        public static readonly FACE_IMG_CHOSEN: string = "chat_face_yellow_png";
        public static readonly FACE_IMG_UNCHOSEN: string = "chat_face_png";
        public static readonly TEXT_IMG_CHOSEN: string = "chat_text_png";
        public static readonly TEXT_IMG_UNCHOSEN: string = "chat_text_blue_png";


        public textScroller: eui.Scroller;

        /** 调停者 */
        private _mediator: MJGameChatViewMediator;


        private static _only: MJGameChatView;

        public static getInstance(): MJGameChatView {
            if (!this._only) {
                this._only = new MJGameChatView();
            }
            return this._only;
        }

        constructor() {
            super();
            this.right = this.bottom = 0;
            this.skinName = "skins.MJGameChatViewSkin";
        }

        protected childrenCreated(): void {
            super.childrenCreated();
            let self = this;
            self.textScroller.verticalScrollBar.autoVisibility = false;
            /**移除文字组*/
            self.faceGroup.visible = false;

            //注册按钮点击缓动
            TouchTweenUtil.regTween(self.submitBtn, self.submitBtn);

            self._mediator = new MJGameChatViewMediator(self);

        }

        protected onAddView(): void {
            MvcUtil.regMediator(this._mediator);
        }

        public getQuickTextArr(index: number): string {
            let self = this;
            let labeltext: string = self.textLabelGroup.$children[index]["text"];
            return labeltext;
        }

    }
}