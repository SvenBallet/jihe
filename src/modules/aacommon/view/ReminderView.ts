module FL {

    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase - ReminderView
     * @Description:  //提示界面
     * @Create: DerekWu on 2017/11/20 15:35
     * @Version: V1.0
     */
    export class ReminderView extends BaseView {

        public readonly mediatorName: string = "";
        /** 显示层级 */
        public viewLayer: FL.ViewLayerEnum = ViewLayerEnum.POPUP;

        /**
         * 窗口添加到舞台时的音效资源key，不赋值则没有
         * 格式：{string}
         */
        // public addMusic:string = "confirm_mp3"; (// 去掉音效，说太吓人)

        //添加界面的缓动
        public addTween:Array<any> = [{data:[{scaleX:0.8, scaleY:0.8}, {scaleX:1, scaleY:1}, 200, Game.Ease.backOut]}];

        /** title */
        public titleLabel:eui.Label;
        /** 提示信息 */
        public reminderInfo:eui.Label;
        /** 左边按钮组 */
        public leftBtnGroup:eui.Group;
        public leftBtn:GameButton;
        /** 右边按钮组 */
        public rightBtnGroup:eui.Group;
        public rightBtn:GameButton;

        /** 左边按钮点击回调 */
        private _hasLeftBtn:boolean;
        private _leftCallBack:MyCallBack;
        /** 右边按钮点击回调，没有则关闭界面 */
        private _hasRightBtn:boolean;
        private _rightCallBack:MyCallBack;

        constructor(hasLeftBtn:boolean, leftCallBack:MyCallBack, hasRightBtn:boolean, rightCallBack:MyCallBack) {
            super();
            this.touchEnabled = false;
            this.horizontalCenter = this.verticalCenter = 0;
            this._hasLeftBtn = hasLeftBtn;
            this._leftCallBack = leftCallBack;
            this._hasRightBtn = hasRightBtn;
            this._rightCallBack = rightCallBack;
            this.skinName = "skins.ReminderViewSkin";
        }

        protected childrenCreated():void {
            super.childrenCreated();
            let self = this;
            if (self._hasLeftBtn) {
                //注册按钮点击缓动
                TouchTweenUtil.regTween(self.leftBtnGroup, self.leftBtn);
                if (self._leftCallBack) {
                    self.leftBtnGroup.addEventListener(egret.TouchEvent.TOUCH_TAP, self.leftTouchTap, self);
                } else {
                    self.leftBtnGroup.addEventListener(egret.TouchEvent.TOUCH_TAP, self.removeSelf, self);
                }
            } else {
                self.removeChild(self.leftBtnGroup);
                self.rightBtnGroup.horizontalCenter = 0;
            }

            if (self._hasRightBtn) {
                //注册按钮点击缓动
                TouchTweenUtil.regTween(self.rightBtnGroup, self.rightBtn);
                if (self._rightCallBack) {
                    self.rightBtnGroup.addEventListener(egret.TouchEvent.TOUCH_TAP, self.rightTouchTap, self);
                } else {
                    self.rightBtnGroup.addEventListener(egret.TouchEvent.TOUCH_TAP, self.removeSelf, self);
                }
            } else {
                self.removeChild(self.rightBtnGroup);
                self.leftBtnGroup.horizontalCenter = 0;
            }
        }

        private leftTouchTap(e:egret.TouchEvent):void {
            MvcUtil.delView(this);
            this._leftCallBack.apply();
        }

        private rightTouchTap(e:egret.TouchEvent):void {
            MvcUtil.delView(this);
            this._rightCallBack.apply();
        }

        private removeSelf(e:egret.TouchEvent):void {
            MvcUtil.delView(this);
        }

        /**
         * 设置显示特征
         * @param {string} titleImgSrc
         * @param {string} leftBtnSrc
         * @param {string} leftBtnText
         * @param {string} rightBtnSrc
         * @param {string} rightBtnText
         */
        public setViewFeature(titleImgSrc:string, leftBtnSrc:string, leftBtnText:string, rightBtnSrc:string, rightBtnText:string):void {
            let self = this;
            if (titleImgSrc) self.titleLabel.text = titleImgSrc;
            if (leftBtnSrc) self.leftBtn.imgName = leftBtnSrc;
            if (leftBtnText) self.leftBtn.label = leftBtnText;
            if (rightBtnSrc) self.rightBtn.imgName = rightBtnSrc;
            if (rightBtnText) self.rightBtn.label = rightBtnText;
        }

        public setViewLayer(viewLayer: FL.ViewLayerEnum): void {
            this.viewLayer = viewLayer;
        }

        /**
         * 设置文本
         * @param {string} text
         */
        public setReminderText(text:string):void {
            this.reminderInfo.text = text;
        }

        /**
         * 设置富文本
         * @param {string} textFlow
         */
        public setReminderTextFlow(textFlow:string):void {
            this.reminderInfo.textFlow = (new egret.HtmlTextParser).parser(textFlow);
        }

    }

}