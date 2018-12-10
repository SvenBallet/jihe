module FL {

    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase - FreeDiamondView
     * @Description:  //分享界面
     * @Create: DerekWu on 2018/1/5 18:49
     * @Version: V1.0
     */
    export class FreeDiamondView extends BaseView {

        public readonly mediatorName: string = "";
        public readonly viewLayer: ViewLayerEnum = ViewLayerEnum.POPUP_ONLY;

        //添加界面的缓动
        public addTween:Array<any> = [{tweenDict:"openPopup"}];

        /** 关闭组 */
        public closeGroup:eui.Group;
        /** 关闭按钮 */
        public closeBtn:eui.Image;

        /** 左边按钮组 取消 */
        public leftBtnGroup:eui.Group;
        /** 左边按钮 */
        public leftBtn:GameButton;

        /** 右边按钮组 取消 */
        public rightBtnGroup:eui.Group;
        /** 右边按钮 */
        public rightBtn:GameButton;

        /** 提示信息 */
        public reminderLabel:eui.Label;

        constructor() {
            super();
            this.verticalCenter = this.horizontalCenter = 0;
            this.skinName = "skins.FreeDiamondViewSkin";
        }

        protected childrenCreated():void {
            super.childrenCreated();
            let self = this;
            //注册按钮点击缓动 和 关闭事件
            TouchTweenUtil.regTween(self.closeGroup, self.closeBtn);
            TouchTweenUtil.regTween(self.leftBtnGroup, self.leftBtn);
            TouchTweenUtil.regTween(self.rightBtnGroup, self.rightBtn);
            //注册pureMvc
            MvcUtil.regMediator( new FreeDiamondViewMediator(self) );
        }

    }
}