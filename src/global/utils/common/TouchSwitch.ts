module FL {

    /**
     * 触摸开关
     * @Name:  FL - TouchSwitchCallBack
     * @Company 
     * @Description:  无详细描述
     * @Create: DerekWu on 2017/10/21 10:35
     * @Version: V1.0
     */
    export class TouchSwitch {

        /** 是否打开 */
        private _isOpen:boolean = true;
        /** 验证Id */
        private _checkId:number = 1;

        /** 打开和关闭开关回调 */
        public openCallBack:MyCallBack;
        public closeCallBack:MyCallBack;

        public isOpen():boolean {
            return this._isOpen;
        }

        /**
         * 根据验证id打开，验证id不同则不能打开
         * @param {number} pCheckId
         */
        public open(pCheckId:number):void {
            if (this._checkId == pCheckId) {
                this.compelOpen();
            }
        }

        /**
         * 强行打开
         */
        public compelOpen():void {
            let self = this;
            if (!self._isOpen) {
                self._isOpen = true;
                self._checkId++;
                if (self.openCallBack) {
                    self.openCallBack.apply();
                }
            }
        }

        public close():void {
            let self = this;
            if (self._isOpen) {
                self._isOpen = false;
                if (self.closeCallBack) {
                    self.closeCallBack.apply();
                }
            }
        }

        /**
         * 生成当前开启的回调
         * @return {FL.MyCallBack}
         */
        public genCurrOpenCallBack():MyCallBack {
            return new MyCallBack(this.open, this, this._checkId);
        }

    }

    /**
     * 开关工具
     */
    export class TouchSwitchUtil {

        public static genTouchSwitch():TouchSwitch {
            return  new TouchSwitch();
        }

        public static genTouchSwitchByComp(pComponent:eui.Component):TouchSwitch {
            let vOneTouchSwitch:TouchSwitch = new TouchSwitch();
            vOneTouchSwitch.openCallBack = new MyCallBack(TouchSwitchUtil.openCompTouchSwitch, TouchSwitchUtil, pComponent);
            vOneTouchSwitch.closeCallBack = new MyCallBack(TouchSwitchUtil.closeCompTouchSwitch, TouchSwitchUtil, pComponent);
            return vOneTouchSwitch;
        }

        private static openCompTouchSwitch(pComponent:eui.Component):void {
            pComponent.enabled = true;
        }

        private static closeCompTouchSwitch(pComponent:eui.Component):void {
            pComponent.enabled = false;
        }
    }

}