module FL {
    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase - NumberInputAreaView
     * @Description:  //数字输入界面
     * @Create: ArielLiang on 2018/2/24 11:15
     * @Version: V1.0
     */
    export class NumberInputAreaView extends BaseView {
        public readonly mediatorName: string = "";
        /** 显示层级 */
        public readonly viewLayer: FL.ViewLayerEnum = ViewLayerEnum.POPUP;

        /** 关闭按钮 */
        public closeGroup:eui.Group;
        public closeBtn:GameButton;

        /** 数字 */
        public oneBtn:GameButton;
        public twoBtn:GameButton;
        public threeBtn:GameButton;
        public fourBtn:GameButton;
        public fineBtn:GameButton;
        public sixBtn:GameButton;
        public sevenBtn:GameButton;
        public eightBtn:GameButton;
        public nineBtn:GameButton;
        public zeroBtn:GameButton;

        /** title*/
        public titleLabel:eui.Label;
        /** 确认输入*/
        public confirmBtn:GameButton;
        /** 重输*/
        public reenterBtn:GameButton;
        /** 删除*/
        public deleteBtn:GameButton;

        public dataList:eui.List;

        public text:string;
        private collection = new eui.ArrayCollection();

        /** 最大值*/
        private _maxValue:number = 9999999999999; //13位
        /** 最小值*/
        private _minValue:number = 0;
        /** 输入位数索引*/
        private inputIndex:number = 0;

        private _numberInput:NumberInput;

        private _confirmCallBack:MyCallBack;

        /**
         * 数字输入界面
         * @param {FL.NumberInput} pNumberInput 返回的输入框
         * @param {number} pMaxValue  输入最大值，默认13位
         * @param {number} pMinValue  输入最小值，默认0
         */
        constructor(pNumberInput:NumberInput,pMaxValue:number,pMinValue:number,pCallBack?:MyCallBack) {
            super();
            // this.horizontalCenter = this.verticalCenter = 0;
            this.left = this.right = this.top = this.bottom = 0;
            this.skinName = "skins.NumberInputAreaViewSkin";
            this._numberInput = pNumberInput;
            this._maxValue = pMaxValue;
            this._minValue = pMinValue;
            this._confirmCallBack = pCallBack;
        }

        protected childrenCreated():void {
            super.childrenCreated();
            let self = this;
            self.dataList.itemRendererSkinName = "skins.NumberInputItemSkin";

            self.titleLabel.text = self._numberInput.titleLabelText;
            self.confirmBtn.labelDisplay.text = self._numberInput.confirmBtnText;

            let layout = new eui.HorizontalLayout();
            /**居中显示*/
            layout.horizontalAlign  = "center";
            /** 间距0*/
            layout.gap = 0;
            self.dataList.layout = layout;

            /** 按钮缓动效果*/
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
            TouchTweenUtil.regTween(self.confirmBtn, self.confirmBtn);

            /** 事件监听*/
            self.zeroBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, self.addNumber, self);
            self.oneBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, self.addNumber, self);
            self.twoBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, self.addNumber, self);
            self.threeBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, self.addNumber, self);
            self.fourBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, self.addNumber, self);
            self.fineBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, self.addNumber, self);
            self.sixBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, self.addNumber, self);
            self.sevenBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, self.addNumber, self);
            self.eightBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, self.addNumber, self);
            self.nineBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, self.addNumber, self);

            self.reenterBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, self.rmAllNumber, self);
            self.deleteBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, self.delNumber, self);
            self.closeGroup.addEventListener(egret.TouchEvent.TOUCH_TAP, self.closeView, self);
            self.confirmBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, self.confirmValue, self);
        }

        private closeView():void{
            MvcUtil.delView(this);
        }

        /**
         * 增加一个数字
         * @param {egret.Event} e
         */
        private addNumber(e:egret.Event):void{
            let self = this;
            let number:number = parseInt(e.currentTarget.name);
            let nowValue:string = self.getValue();
            if(parseInt(nowValue+number) > self._maxValue){
                PromptUtil.show("不能大于"+ self._maxValue, PromptType.ALERT);
                self.setValue(nowValue);
            }else if(parseInt(nowValue+number) === 0){
                self.inputIndex=0;
                self.setValue("0");
            }else if(parseInt(nowValue) === 0 && number !== 0){
                self.collection.removeItemAt(0);
                self.collection.addItem(number);
                self.dataList.dataProvider = self.collection;
            }else{
                self.collection.addItem(number);
                self.dataList.dataProvider = self.collection;
                self.inputIndex++;
            }
        }

        /**
         * 删除所有数字
         * @param {egret.Event} e
         */
        private rmAllNumber(e:egret.Event):void{
            let self = this;
            self.inputIndex=0;
            self.collection.removeAll();
            self.dataList.dataProvider = self.collection;
        }

        /**
         * 删除一个数字
         * @param {egret.Event} e
         */
        private delNumber(e:egret.Event):void{
            let self = this;
            if(self.inputIndex<1){
                return;
            }else{
                self.inputIndex--;
                self.collection.removeItemAt(self.inputIndex);
                self.dataList.dataProvider = self.collection;
            }
        }

        /**
         * 赋值
         * @param {string} val
         */
         public setValue(val:string):void{
            let self = this;
            let valArray:Array<string> = val.split("");
            self.inputIndex = valArray.length;
            self.collection.replaceAll(valArray);
            self.dataList.dataProvider = self.collection;
         }

        /**
         * 取值
         * @returns {string}
         */
        public getValue():string{
            let self = this;
            let source:Array<number> = self.collection.source;
            self.text = source.join("");
            return self.text;
        }

        /**
         * 确认输入
         */
        private confirmValue():void {
            let self = this;
            let nowValue:string = self.getValue();
            if(parseInt(nowValue) < self._minValue || nowValue === ""){
                PromptUtil.show("不能小于"+ self._minValue, PromptType.ALERT);
                self.setValue(nowValue);
            }else{
                self._numberInput.text = nowValue;
                self.closeView();
                if(this._confirmCallBack){
                    this._confirmCallBack.apply();
                }
            }
        }
    }
}