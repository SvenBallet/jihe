module FL {
    /**
     * 游戏按钮基类
     * @Name:  FL - GameButton
     * @Company 深圳市天天爱科技有限公司 版权所有
     * @Description:  无详细描述
     * @Create: DerekWu on 2017/8/16 14:19
     * @Version: V1.0
     */
    export class GameButton extends eui.Component {

        /** 按钮图片 */
        public buttonImg: eui.Image;

        public labelDisplay: eui.Label;

        private _imgName: string = "btn_green_png";
        private _label: string = "";
        private _textColor: number = 0xffffff;
        private _size: number = 30;

        public constructor() {
            super();
            this.touchChildren = false;
            // this.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onTouchBegin, this);
        }

        // protected childrenCreated():void {
        //     super.childrenCreated();
        //     // TouchTweenUtil.regTween(this, this, {scaleX:0.95, scaleY:0.95}, {scaleX:1, scaleY:1});
        // }

        public get imgName(): string {
            return this._imgName;
        }

        public set imgName(value: string) {
            this._imgName = value;
            if (this.buttonImg) this.buttonImg.source = value;
        }

        public get label(): string {
            return this._label;
        }

        public set label(value: string) {
            this._label = value;
            if (this.labelDisplay) this.labelDisplay.text = value;
        }

        public get labelColor(): number {
            if (this.labelDisplay) {
                return this.labelDisplay.textColor;
            }
        }

        public set labelColor(value: number) {
            this._textColor = value;
            if (this.labelDisplay) {
                this.labelDisplay.textColor = value;
            }
        }

        public get labelSize(): number {
            if (this.labelDisplay) {
                return this.labelDisplay.size;
            }
        }

        public set labelSize(value: number) {
            this._size = value;
            if (this.labelDisplay) {
                this.labelDisplay.size = value;
            }
        }

        // protected onTouchBegin(event:egret.TouchEvent):void {
        //     let self = this;
        //     self.$stage.addEventListener(egret.TouchEvent.TOUCH_CANCEL, self.onTouchCancel, self);
        //     self.$stage.addEventListener(egret.TouchEvent.TOUCH_END, self.onStageTouchEnd, self);
        //     event.updateAfterEvent();
        // }

        // protected onTouchCancel(event:egret.TouchEvent):void {
        //     let self = this, stage = event.$currentTarget;
        //     stage.removeEventListener(egret.TouchEvent.TOUCH_CANCEL, self.onTouchCancel, self);
        //     stage.removeEventListener(egret.TouchEvent.TOUCH_END, self.onStageTouchEnd, self);
        // }

        /**
         * @private
         * 舞台上触摸弹起事件
         */
        // private onStageTouchEnd(event:egret.Event):void {
        //     let self = this, stage = event.$currentTarget;
        //     stage.removeEventListener(egret.TouchEvent.TOUCH_CANCEL, self.onTouchCancel, self);
        //     stage.removeEventListener(egret.TouchEvent.TOUCH_END, self.onStageTouchEnd, self);
        // }

        // /**
        //  * @inheritDoc
        //  *
        //  * @version Egret 2.4
        //  * @version eui 1.0
        //  * @platform Web,Native
        //  */
        // protected getCurrentState():string {
        //     if (!this.enabled)
        //         return "disabled";

        //     if (this.touchCaptured)
        //         return "down";

        //     return "up";
        // }

        protected partAdded(partName: string, instance: any): void {
            // super.partAdded(partName, instance);
            let self = this;
            if (instance === self.labelDisplay) {
                self.labelDisplay.text = self._label;
                self.labelDisplay.textColor = self._textColor;
                self.labelDisplay.size = self._size;
            } else if (instance === self.buttonImg) {
                self.buttonImg.source = self._imgName;
            }
        }

    }
}