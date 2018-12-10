module FL {

    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase - AgreementView
     * @Description:  //用户协议模块
     * @Create: DerekWu on 2017/12/15 17:24
     * @Version: V1.0
     */
    export class HealthView extends BaseView {

        //调停者名字，删除界面的时候会自动移除
        public readonly mediatorName: string = "";
        //界面层级，UI框架自动管理
        public readonly viewLayer: ViewLayerEnum = ViewLayerEnum.POPUP;

        public commonBtn:FL.GameButton;

        /** 基础组 */
        public baseGroup:eui.Group;
        /** 内容 */
        public labelText:eui.Label;
        public adultLab:eui.Label;
        public reportCenterLab:eui.Label;

        constructor() {
            super();
            this.verticalCenter = this.horizontalCenter = 0;
            this.skinName = skins.HealthViewSkin;
        }

        protected childrenCreated():void {
            super.childrenCreated();
            let self = this;

            //注册按钮点击缓动
            TouchTweenUtil.regTween(this.commonBtn, this.commonBtn);
            //关闭按钮
            self.commonBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, self.closeClick, self);
            self.adultLab.addEventListener(egret.TouchEvent.TOUCH_TAP, self.adult, self);
            self.reportCenterLab.addEventListener(egret.TouchEvent.TOUCH_TAP, self.center, self);
        }

        /**
         * 关闭
         * @param {egret.TouchEvent} e
         */
        private closeClick(e:egret.TouchEvent):void {
            MvcUtil.delView(this);
        }

        private adult() {
            let jsonData = {
                "eventType": SendNativeMsgType.SEND_NATIVE_OPEN_URL,
                "data": {
                    "url": "http://www.hzranqu.com/jiazhang/index.html",
                }
            }
            NativeBridge.getInstance().sendNativeMessage(JSON.stringify(jsonData));
        }

        private center() {
            let jsonData = {
                "eventType": SendNativeMsgType.SEND_NATIVE_OPEN_URL,
                "data": {
                    "url": "http://www.12377.cn/",
                }
            }
            NativeBridge.getInstance().sendNativeMessage(JSON.stringify(jsonData));
        }
    }

}