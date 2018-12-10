module FL {
    /** 茶楼成员---xiao */
    export class TeaHouseMemAddWaiterView extends BaseView {
        //调停者名字，删除界面的时候会自动移除
        public readonly mediatorName: string = "TeaHouseMemAddWaiterViewMediator";
        //界面层级，UI框架自动管理
        public readonly viewLayer: ViewLayerEnum = ViewLayerEnum.POPUP;
        /** 调停者 */
        private _mediator: TeaHouseMemAddWaiterViewMediator;
        /** 关闭 */
        private closeGroup: eui.Group;
        private closeBtn: eui.Image;

        /** 搜索输入框 */
        private searchInput: eui.TextInput;
        /** 搜索组*/
        private searchGroup: eui.Group;
        private searchBtn: eui.Image;

        /** 数据显示组 */
        private scroller: eui.Scroller;
        private dataGroup: eui.DataGroup;
        /** 显示数据源 */
        private arrCollection: eui.ArrayCollection;

        /** 数据源 */
        private data: ITHMemberInfoData[];


        constructor() {
            super();
            this.verticalCenter = this.horizontalCenter = 0;
            this.skinName = "skins.TeaHouseMemAddWaiterViewSkin";
        }

        protected childrenCreated() {
            let self = this;
            //注册缓动事件
            TouchTweenUtil.regTween(self.closeGroup, self.closeBtn);
            TouchTweenUtil.regTween(self.searchGroup, self.searchBtn);

            //注册监听事件
            self.closeGroup.addEventListener(egret.TouchEvent.TOUCH_TAP, self.onClose, self);
            self.searchGroup.addEventListener(egret.TouchEvent.TOUCH_TAP, self.searchPlayer, self);
            self._mediator = new TeaHouseMemAddWaiterViewMediator(self);
            self.initView();
        }

        /** 添加到舞台框架自动调用 */
        protected onAddView() {
            //注册调停者
            MvcUtil.regMediator(this._mediator);
        }

        /** 初始化页面 */
        private initView() {
            //---test
            this.data = TeaHouseHandle.handleMemListData(TeaHouseData.teaHouseWaiterList, ETHItemInvokedView.THMemAddWaiterView);
            this.scroller.scrollPolicyH = "off";
            if (!this.arrCollection) this.arrCollection = new eui.ArrayCollection();
            this.dataGroup.dataProvider = this.arrCollection;
            this.dataGroup.itemRenderer = TeaHouseMemAddWaiterItemView;
            this.scroller.viewport = this.dataGroup;
            this.refreshView(this.data);
            this.sendShowAddWaiterMsg();
        }

        /** 搜索玩家 */
        private searchPlayer() {
            console.log(this.searchInput.text);
            let text = this.searchInput.text
            if (text == "") {
                TeaHouseMsgHandle.sendWaiterMsg();
            } else {
                let list = this.data.filter(x => x && "" + x.id == text || text == x.name);
                this.refreshView(list);
            }
        }

        /** 刷新页面 */
        public refreshView(data = this.data) {
            this.data = data;
            this.dataGroup.dataProvider = this.arrCollection;
            this.scroller.viewport = this.dataGroup;
            this.arrCollection.replaceAll(this.data);
            this.dataGroup.validateNow();
        }

        /** 关闭页面 */
        private onClose() {
            MvcUtil.delView(this);
        }

        //-----------msg-----
        //顯示添加小二列表的消息
        private sendShowAddWaiterMsg() {
            let msg = new OptMemberStateMsg();
            msg.teaHouseId = TeaHouseData.curID;
            msg.operationType = OptMemberStateMsg.TH_WAITER_DEFAULT;
            ServerUtil.sendMsg(msg, MsgCmdConstant.MSG_OPT_TEAHOUSE_MEMBER_ACK);
        }
    }
}