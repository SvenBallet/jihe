module FL {
    /** 茶楼成员---小二管理页面 */
    export class TeaHouseMemWaiterView extends eui.Component {
        /** 添加店小二按钮 */
        private addWaiterBtn: GameButton;

        /** 数据显示组 */
        private scroller: eui.Scroller;
        private dataGroup: eui.DataGroup;
        /** 显示数据源 */
        private arrCollection: eui.ArrayCollection;

        /** 数据源 */
        private data: ITHMemberInfoData[];

        constructor() {
            super();
            this.top = this.left = this.right = this.bottom = 0;
            this.skinName = "skins.TeaHouseMemWaiterViewSkin";
        }

        protected childrenCreated() {
            let self = this;

            //注册缓动事件
            TouchTweenUtil.regTween(self.addWaiterBtn, self.addWaiterBtn);

            //注册监听事件
            self.addWaiterBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, self.addWaiter, self);
            this.dataGroup.useVirtualLayout = false;
            self.initView();
        }

        /** 初始化页面 */
        private initView() {
            //----test
            this.scroller.scrollPolicyH = "off";
            if (!this.arrCollection) this.arrCollection = new eui.ArrayCollection();
            this.arrCollection.replaceAll(this.data);
            this.dataGroup.dataProvider = this.arrCollection;
            this.dataGroup.itemRenderer = TeaHouseMemListItemView;
            this.scroller.viewport = this.dataGroup;
            TeaHouseMsgHandle.sendWaiterMsg();
            // this.sendWaiterMsg();
        }

        /** 刷新页面 */
        public refreshView(data = this.data) {
            this.data = data;
            this.dataGroup.dataProvider = this.arrCollection;
            this.scroller.viewport = this.dataGroup;
            this.scroller.viewport.scrollV = 0;
            this.arrCollection.replaceAll(this.data);
            this.dataGroup.validateNow();
        }

        /** 添加店小二 */
        private addWaiter() {
            if (TeaHouseData.curPower != ETHPlayerPower.CREATOR) {
                PromptUtil.show("权限不足，老板专用", PromptType.ERROR);
                return;
            }
            MvcUtil.addView(new TeaHouseMemAddWaiterView());
        }

        //-------------msg-----------
        // /** 發送顯示小二列表消息 */
        // private sendWaiterMsg() {
        //     let msg = new OptMemberStateMsg();
        //     msg.teaHouseId = TeaHouseData.curID;
        //     msg.operationType = OptMemberStateMsg.TH_WAITER_DEFAULT;
        //     ServerUtil.sendMsg(msg, MsgCmdConstant.MSG_OPT_TEAHOUSE_MEMBER_ACK);
        // }
    }
}