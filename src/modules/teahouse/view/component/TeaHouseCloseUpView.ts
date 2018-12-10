module FL {
    export class TeaHouseCloseUpView extends BaseView {
        //调停者名字，删除界面的时候会自动移除
        public readonly mediatorName: string = "";
        //界面层级，UI框架自动管理
        public readonly viewLayer: ViewLayerEnum = ViewLayerEnum.POPUP_ONLY;

        /** 留言输入框 */
        private msgLab: eui.Label;

        /** 点击背景遮罩可以关闭界面 */
        public flag_shadeClick: boolean = true;
        constructor() {
            super();
            this.verticalCenter = this.horizontalCenter = 0;
            this.skinName = "skins.TeaHouseCloseUpViewSkin";
        }

        protected childrenCreated() {
            let self = this;
            self.initView();

            //注册点击事件
            this.once(egret.TouchEvent.TOUCH_TAP, self.closeView, self);
        }

        /** 初始化页面 */
        private initView() {
            //根据存储数据转换留言数据
            let info = TeaHouseData.teaHouseInfo;
            let leaveMsg = <ITHLeaveMsg>{};
            leaveMsg.leaveMsg = info.leaveMsg || "";
            //根据留言数据显示页面
            this.msgLab.text = leaveMsg.leaveMsg;
        }

        /** 关闭页面 */
        private closeView() {
            MvcUtil.delView(this);
        }
    }
}