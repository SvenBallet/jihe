module FL {
    export class TeaHouseMemApplyView extends eui.Component {
        /** 下一页*/
        private rightGroup: eui.Group;
        private rightBtn: eui.Image;
        /** 上一页 */
        private leftGroup: eui.Group;
        private leftBtn: eui.Image;
        /** 页数 */
        private pageLab: eui.Label;
        /** 一键清除 */
        private removeAllBtn: GameButton;
        private removeAllGroup: eui.Group;


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
        private data: any;

        /** 页码 */
        public flag_page: number = 1;
        /** 总页码数 */
        public flag_totalPage: number = 1;
        constructor() {
            super();
            this.top = this.left = this.right = this.bottom = 0;
            this.skinName = "skins.TeaHouseMemApplyViewSkin";
        }

        protected childrenCreated() {
            let self = this;

            //注册缓动事件
            TouchTweenUtil.regTween(self.rightGroup, self.rightBtn, { scaleX: -0.95, scaleY: 0.95 }, { scaleX: -1, scaleY: 1 });
            TouchTweenUtil.regTween(self.leftGroup, self.leftBtn);
            TouchTweenUtil.regTween(self.removeAllGroup, self.removeAllBtn);
            TouchTweenUtil.regTween(self.searchGroup, self.searchBtn);

            //注册监听事件
            self.rightGroup.addEventListener(egret.TouchEvent.TOUCH_TAP, self.nextPage, self);
            self.leftGroup.addEventListener(egret.TouchEvent.TOUCH_TAP, self.prePage, self);
            self.removeAllBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, self.removeAll, self);
            self.searchGroup.addEventListener(egret.TouchEvent.TOUCH_TAP, self.searchPlayer, self);
            this.dataGroup.useVirtualLayout = false;

            self.initView();
        }

        /** 初始化页面 */
        private initView() {
            //----test
            this.scroller.scrollPolicyH = "off";
            if (!this.arrCollection) this.arrCollection = new eui.ArrayCollection();
            this.dataGroup.dataProvider = this.arrCollection;
            this.dataGroup.itemRenderer = TeaHouseMemApplyItemView;
            this.scroller.viewport = this.dataGroup;
            this.refreshView();
            TeaHouseMsgHandle.sendShowApplyListMsg(this.flag_page);
            // this.sendShowApplyListMsg();
        }

        /** 刷新页面 */
        public refreshView(data = this.data) {
            this.data = data;
            this.scroller.viewport.scrollV = 0;
            this.dataGroup.dataProvider = this.arrCollection;
            this.scroller.viewport = this.dataGroup;
            this.arrCollection.replaceAll(this.data);
            this.dataGroup.validateNow();
            this.changePageLab(this.flag_page);
        }

        /** 下一页 */
        private nextPage() {
            if (this.data.length < 10 || this.getCurPage() == this.flag_totalPage) {
                PromptUtil.show("已经是最后一页了", PromptType.ALERT);
                return;
            }
            this.flag_page = this.getCurPage() + 1;
            TeaHouseMsgHandle.sendShowApplyListMsg(this.getCurPage() + 1);
        }

        /** 上一页 */
        private prePage() {
            if (this.getCurPage() == 1) {
                PromptUtil.show("已经是第一页了", PromptType.ALERT);
                return;
            }
            this.flag_page = this.getCurPage() - 1;
            TeaHouseMsgHandle.sendShowApplyListMsg(this.getCurPage() - 1);
        }

        /** 获取当前页码 */
        private getCurPage() {
            return parseInt(this.pageLab.text);
        }

        /** 改变页数显示 */
        private changePageLab(page: number) {
            this.pageLab.text = "" + page;
        }

        /** 一键清除 */
        private removeAll() {
            if (TeaHouseData.curPower == ETHPlayerPower.ILLEGAL || TeaHouseData.curPower == ETHPlayerPower.MEMBER) {
                PromptUtil.show("无权限", PromptType.ERROR);
                return;
            }
            let msg = new OptTeaHouseApplyMsg();
            msg.teaHouseId = TeaHouseData.curID;
            msg.type = 2;
            ServerUtil.sendMsg(msg, MsgCmdConstant.MSG_OPT_TEAHOUSE_APPLY_ACK);
        }

        /** 搜索玩家 */
        private searchPlayer() {
            console.log(this.searchInput.text);
            let text = this.searchInput.text;
            TeaHouseMsgHandle.sendShowApplyListMsg(this.flag_page, text);
            // if (text == "") {
            //     TeaHouseMsgHandle.sendShowApplyListMsg(this.flag_page);
            // } else {
            //     let list = this.data.filter(x => x && "" + x.id == text || text == x.name);
            //     this.refreshView(list);
            // }
        }

        //-------msg-------
        // /** 发送显示申请成员列表消息 */
        // private sendShowApplyListMsg() {
        //     let msg = new ShowApplyTeaHouseListMsg();
        //     msg.page = this.flag_page;
        //     msg.teaHouseId = TeaHouseData.curID;
        //     ServerUtil.sendMsg(msg, MsgCmdConstant.MSG_TEAHOUSE_SHOW_APPLY_LIST_ACK);
        // }
    }
}