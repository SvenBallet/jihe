module FL {
    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase - NumberInput
     * @Description: 数字输入框
     * @Create: ArielLiang on 2018/2/24 15:01
     * @Version: V1.0
     */
    export class NumberInput extends eui.Component {

        private _label:string = "";
        private _textColor:number = 0xB95A00;
        private _size:number = 30;
        private _backgroundColor:number = 0xFFFFFF;

        public labelDisplay:eui.Label;

        /** 输入最大值*/
        private _maxVal:number = 999999;
        /** 输入最小值*/
        private _minVal:number = 100000;

        public titleLabelText:string = "输入数字";

        public confirmBtnText:string = "确认输入";

        public constructor() {
            super();
            let self = this;
            self.addEventListener(egret.TouchEvent.TOUCH_TAP, self.addView, self);
        }

        private addView():void{
            let vNumberInputAreaView:NumberInputAreaView = new NumberInputAreaView(this,this._maxVal,this._minVal);
            MvcUtil.addView(vNumberInputAreaView);
            vNumberInputAreaView.setValue(this.text);
        }


        public get text():string {
            return this._label;
        }

        public set text(value:string) {
            this._label = value;
            if (this.labelDisplay) this.labelDisplay.text = value;
        }

        public get maxValue():number {
            return this._maxVal;
        }

        public set maxValue(value:number) {
            this._maxVal = value;
        }

        public get minValue():number {
            return this._minVal;
        }

        public set minValue(value:number) {
            this._minVal = value;
        }

        public get textColor():number {
            if (this.labelDisplay) {
                return this.labelDisplay.textColor;
            }
        }

        public set textColor(value:number) {
            this._textColor = value;
            if (this.labelDisplay) {
                this.labelDisplay.textColor = value;
            }
        }

        public get size():number {
            if (this.labelDisplay) {
                return this.labelDisplay.size;
            }
        }

        public set size(value:number) {
            this._size = value;
            if (this.labelDisplay) {
                this.labelDisplay.size = value;
            }
        }

        public get backgroundColor():number {
            if (this.labelDisplay) {
                return this.labelDisplay.backgroundColor;
            }
        }

        public set backgroundColor(value:number) {
            this._backgroundColor = value;
            if (this.labelDisplay) {
                this.labelDisplay.backgroundColor = value;
            }
        }

        protected partAdded(partName:string, instance:any):void {
            let self = this;
            if (instance === self.labelDisplay) {
                self.labelDisplay.text = self._label;
                self.labelDisplay.textColor = self._textColor;
                self.labelDisplay.size = self._size;
                self.labelDisplay.backgroundColor = self._backgroundColor;
            }
        }
    }
}