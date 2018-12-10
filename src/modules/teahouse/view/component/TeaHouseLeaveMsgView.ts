module FL {
    /** 茶楼打烊--留言页面 */
    export class TeaHouseLeaveMsgView extends BaseView {
        //调停者名字，删除界面的时候会自动移除
        public readonly mediatorName: string = "";
        //界面层级，UI框架自动管理
        public readonly viewLayer: ViewLayerEnum = ViewLayerEnum.POPUP;

        /** 留言输入框 */
        public msgLab: eui.EditableText;
        /** 确定按钮 */
        private confirmBtn: eui.Image;

        /** 点击背景遮罩可以关闭界面 */
        public flag_shadeClick: boolean = true;
        
        constructor() {
            super();
            this.verticalCenter = this.horizontalCenter = 0;
            this.skinName = "skins.TeaHouseLeaveMsgViewSkin";
        }

        protected childrenCreated() {
            let self = this;
            //注册缓动事件
            TouchTweenUtil.regTween(self.confirmBtn, self.confirmBtn);

            //注册监听事件        
            self.confirmBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, self.onConfirm, self);
            self.initView();
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

        /** 确定 */
        private onConfirm() {
            let msg = new OptTeaHouseStateMsg();
            msg.leaveMessage = this.msgLab.text;
            msg.teaHouseId = TeaHouseData.curID;
            msg.operationType = OptTeaHouseStateMsg.TYPE_OFF_TEA_HOUSE;
            ServerUtil.sendMsg(msg, MsgCmdConstant.MSG_OPT_TEAHOUSE_STATE_ACK);
            this.onClose();
        }

        /** 关闭页面 */
        private onClose() {
            MvcUtil.delView(this);
        }
    }
}