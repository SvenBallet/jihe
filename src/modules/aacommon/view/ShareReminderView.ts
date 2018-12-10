module FL {

    export enum ShareReminderTypeEnum {
        FRIENDS,  //好友/群
        CIRCLE_OF_FRIENDS //朋友圈
    }

    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase - ShareReminderView
     * @Description:  //分享提示界面
     * @Create: DerekWu on 2018/1/5 16:27
     * @Version: V1.0
     */
    export class ShareReminderView extends BaseView {

        private static _only: ShareReminderView;

        public readonly mediatorName: string = "";
        /** 显示层级 */
        public readonly viewLayer: FL.ViewLayerEnum = ViewLayerEnum.TOOLTIP_BOTTOM;

        /** 分享提示图标 */
        public shareIcon: eui.Image;
        /** 分享提示图标名字 */
        public shareIconName: eui.Label;

        private constructor() {
            super();
            this.touchEnabled = true;
            this.touchChildren = false;
            this.left = this.right = this.top = this.bottom = 0;
            this.skinName = "skins.ShareReminderViewSkin";
        }

        public static getInstance(): ShareReminderView {
            if (!this._only) {
                this._only = new ShareReminderView();
            }
            return this._only;
        }

        protected childrenCreated(): void {
            super.childrenCreated();
            this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.closeView, this);
        }

        /**
         * 显示该界面
         * @param {FL.ShareReminderTypeEnum} shareReminderType
         */
        public showView(shareReminderType: ShareReminderTypeEnum): void {
            // if (shareReminderType === ShareReminderTypeEnum.FRIENDS) {
            this.shareIcon.source = "share_friends_2_png";
            this.shareIconName.text = "发送给朋友";
            let r = StageUtil.STAGE_ORIENTATION;
            if (r) {
                this.rotation = -90;
            } else {
                this.rotation = 0;
            }
            /** 全部禁用朋友圈 */
            // } else if (shareReminderType === ShareReminderTypeEnum.CIRCLE_OF_FRIENDS) {
            //     this.shareIcon.source = "share_circle_of_friends_2_png";
            //     this.shareIconName.text = "分享到朋友圈";
            // }
            MvcUtil.addView(this);
        }

        /**
         * 关闭界面
         */
        public closeView(): void {
            MvcUtil.delView(this);
            // 修复当前分享位置
            WeChatJsSdkHandler.repairCurrentShareLocation();
        }

    }

}