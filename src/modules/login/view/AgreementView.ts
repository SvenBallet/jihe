module FL {

    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase - AgreementView
     * @Description:  //用户协议模块
     * @Create: DerekWu on 2017/12/15 17:24
     * @Version: V1.0
     */
    export class AgreementView extends BaseView {

        //调停者名字，删除界面的时候会自动移除
        public readonly mediatorName: string = "";
        //界面层级，UI框架自动管理
        public readonly viewLayer: ViewLayerEnum = ViewLayerEnum.BOTTOM;

        public commonBtn:FL.GameButton;

        /** 基础组 */
        public baseGroup:eui.Group;
        /** 内容 */
        public labelText:eui.Label;

        constructor() {
            super();
            this.left = this.right = this.top = this.bottom = 0;
            this.skinName = "skins.AgreementViewSkin";
        }

        protected childrenCreated():void {
            super.childrenCreated();
            let self = this;

            //注册按钮点击缓动
            TouchTweenUtil.regTween(this.commonBtn, this.commonBtn);
            //关闭按钮
            self.commonBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, self.closeClick, self);

            //使用富文本
            self.labelText.textFlow = (new egret.HtmlTextParser).parser(RES.getRes("yonghuxieyi_json").desc);

        }

        /**
         * 关闭
         * @param {egret.TouchEvent} e
         */
        private closeClick(e:egret.TouchEvent):void {
            MvcUtil.delView(this);
        }

    }

}