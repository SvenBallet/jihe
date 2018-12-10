module FL {
    /**
     * 茶楼增加钻石页面
     */
    export class TeaHouseAddDiamondView extends BaseView {
        //调停者名字，删除界面的时候会自动移除
        public readonly mediatorName: string = "";
        //界面层级，UI框架自动管理
        public readonly viewLayer: ViewLayerEnum = ViewLayerEnum.POPUP;

        /** 增加*/
        public confirmGroup: eui.Group;
        public confirmBtn: GameButton;
        /** 取出*/
        public cancelGroup: eui.Group;
        public cancelBtn: GameButton;

        public closeGroup: eui.Group;
        public closeBtn: eui.Image;

        /** 钻石数*/
        public diamondNum: NumberInput;

        /** 提示信息*/
        public reminderInfo: eui.Label;

        constructor() {
            super();
            this.verticalCenter = this.horizontalCenter = 0;
            this.skinName = "skins.ClubAddDiamondViewSkin";
        }

        protected childrenCreated(): void {
            super.childrenCreated();
            let self = this;

            self.diamondNum.minValue = 1;
            self.diamondNum.maxValue = 99999;
            let diaNum: number = TeaHouseData.teaHouseInfo.diamond;
            self.reminderInfo.text = "茶楼剩余钻石：" + diaNum;

            //注册按钮点击缓动
            TouchTweenUtil.regTween(self.closeGroup, self.closeBtn);
            TouchTweenUtil.regTween(self.confirmGroup, self.confirmBtn);
            TouchTweenUtil.regTween(self.cancelGroup, self.cancelBtn);

            self.confirmGroup.addEventListener(egret.TouchEvent.TOUCH_TAP, this.addDiamond, this);
            self.cancelGroup.addEventListener(egret.TouchEvent.TOUCH_TAP, this.getDiamond, this);
            self.closeGroup.addEventListener(egret.TouchEvent.TOUCH_TAP, this.closeView, this);
        }

        /**
         * 增加钻石
         */
        private addDiamond(): void {
            let diamondNum: string = this.diamondNum.text.trim();
            if (diamondNum == "") {
                PromptUtil.show("钻石数不能为空！", PromptType.ERROR);
                return;
            }
            let msg = new OptTeaHouseDiamondMsg();
            msg.diamond = diamondNum;
            msg.teaHouseId = TeaHouseData.curID;
            msg.optType = OptTeaHouseDiamondMsg.ADD;
            ServerUtil.sendMsg(msg, MsgCmdConstant.MSG_OPT_TEAHOUSE_DIAMOND_ACK);
            this.closeView();
        }

        /**
         * 取出钻石
         */
        private getDiamond(): void {
            let diamondNum: string = this.diamondNum.text.trim();
            if (diamondNum == "") {
                PromptUtil.show("钻石数不能为空！", PromptType.ERROR);
                return;
            }
            let msg = new OptTeaHouseDiamondMsg();
            msg.diamond = diamondNum;
            msg.teaHouseId = TeaHouseData.curID;
            msg.optType = OptTeaHouseDiamondMsg.GET;
            ServerUtil.sendMsg(msg, MsgCmdConstant.MSG_OPT_TEAHOUSE_DIAMOND_ACK);
            this.closeView();
        }

        private closeView(): void {
            MvcUtil.delView(this);
        }
    }
}