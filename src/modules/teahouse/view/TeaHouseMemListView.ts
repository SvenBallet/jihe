module FL {
    /** 茶楼成员---成员列表页面 */
    export class TeaHouseMemListView extends eui.Component {

        /** 下一页*/
        private rightGroup: eui.Group;
        private rightBtn: eui.Image;
        /** 上一页 */
        private leftGroup: eui.Group;
        private leftBtn: eui.Image;
        /** 页数 */
        private pageLab: eui.Label;

        /** 搜索输入框 */
        private searchInput: eui.TextInput;
        /** 搜索组*/
        private searchGroup: eui.Group;
        private searchBtn: eui.Image;

        public onlineLab:eui.Label;

        /** 数据显示组 */
        private scroller: eui.Scroller;
        private dataGroup: eui.DataGroup;
        /** 显示数据源 */
        private arrCollection: eui.ArrayCollection;

        /** 数据源 */
        private data: ITHMemberInfoData[];

        /** 当前页码数 */
        public flag_page: number = 1;
        /** 总页码数 */
        public flag_totalPage: number = 1;
        public addBtn:FL.GameButton;
        public codeInput: NumberInput;
        constructor() {
            super();
            this.top = this.left = this.right = this.bottom = 0;
            this.skinName = "skins.TeaHouseMemListViewSkin";
        }

        protected childrenCreated() {
            let self = this;

            //注册缓动事件
            TouchTweenUtil.regTween(self.rightGroup, self.rightBtn, { scaleX: -0.95, scaleY: 0.95 }, { scaleX: -1, scaleY: 1 });
            TouchTweenUtil.regTween(self.leftGroup, self.leftBtn);
            TouchTweenUtil.regTween(self.searchGroup, self.searchBtn);

            //注册监听事件
            self.rightGroup.addEventListener(egret.TouchEvent.TOUCH_TAP, self.nextPage, self);
            self.leftGroup.addEventListener(egret.TouchEvent.TOUCH_TAP, self.prePage, self);
            self.searchGroup.addEventListener(egret.TouchEvent.TOUCH_TAP, self.searchPlayer, self);
            self.addBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, self.addMember, self);
            this.dataGroup.useVirtualLayout = false;

            self.initView();
        }

        /** 初始化页面 */
        private initView() {
            //----test
            // this.data = new Array(8);
            this.scroller.scrollPolicyH = "off";
            if (!this.arrCollection) this.arrCollection = new eui.ArrayCollection();
            this.dataGroup.dataProvider = this.arrCollection;
            this.dataGroup.itemRenderer = TeaHouseMemListItemView;
            this.scroller.viewport = this.dataGroup;
            this.refreshView(this.data);
            TeaHouseMsgHandle.sendShowMemListMsg(this.flag_page);
            // this.sendShowMemListMsg();
        }

        /** 刷新页面 */
        public refreshView(data = this.data) {
            this.data = data;
            this.dataGroup.dataProvider = this.arrCollection;
            this.scroller.viewport = this.dataGroup;
            this.scroller.viewport.scrollV = 0;
            this.arrCollection.replaceAll(this.data);
            this.dataGroup.validateNow();
            this.changePageLab(this.flag_page);
            this.showOnline();
        }

        /** 显示在线人数 */
        public showOnline(total: number = 0, online: number = 0) {
            this.onlineLab.text = "茶楼人数：" + online + "/" + total;
        }

        /** 下一页 */
        private nextPage() {
            if (this.data.length < 10 || this.getCurPage() == this.flag_totalPage) {
                PromptUtil.show("已经是最后一页了", PromptType.ALERT);
                return;
            }
            this.flag_page = this.getCurPage() + 1;
            TeaHouseMsgHandle.sendShowMemListMsg(this.getCurPage() + 1);
        }

        /** 上一页 */
        private prePage() {
            if (this.getCurPage() == 1) {
                PromptUtil.show("已经是第一页了", PromptType.ALERT);
                return;
            }
            this.flag_page = this.getCurPage() - 1;
            TeaHouseMsgHandle.sendShowMemListMsg(this.getCurPage() - 1);
            // if (this.flag_page < 1) {
            //     PromptUtil.show("已经是第一页了", PromptType.ALERT);
            //     return;
            // }
        }

        /** 获取当前页码 */
        public getCurPage() {
            return parseInt(this.pageLab.text);
        }

        /** 改变页数显示 */
        private changePageLab(page: number) {
            this.pageLab.text = "" + page;
        }

        /** 搜索玩家 */
        private searchPlayer() {
            // console.log(this.searchInput.text);
            let text = this.searchInput.text
            TeaHouseMsgHandle.sendShowMemListMsg(this.flag_page, 1, text);
            // if (text == "") {
            //     TeaHouseMsgHandle.sendShowMemListMsg(this.flag_page);
            // } else {
            //     let list = this.data.filter(x => x && "" + x.id == text || text == x.name);
            //     this.refreshView(list);
            // }
        }

        //---------------msg--------------
        // /** 发送显示成员列表消息 */
        // private sendShowMemListMsg() {
        //     let msg = new ShowTeaHouseMemberListMsg();
        //     msg.teaHouseId = TeaHouseData.curID;
        //     msg.page = this.flag_page;
        //     msg.searchPlayerId = 0;
        //     msg.searchPlayerName = "";
        //     ServerUtil.sendMsg(msg, MsgCmdConstant.MSG_TEAHOUSE_SHOW_MEMBER_LIST_ACK);
        //     console.log(msg);
        // }

        /**添加成员 */
        private addMember() {
            let self = this;
            self.codeInput = new NumberInput();
            self.codeInput.titleLabelText = "添加成员";
            self.codeInput.confirmBtnText = "确认添加";
            let vNumberInputAreaView: NumberInputAreaView = new NumberInputAreaView(self.codeInput, 999999, 100000, new MyCallBack(self.confirmInput, self));
            MvcUtil.addView(vNumberInputAreaView);
        }

        /**
         * 确认输入
         */
        private confirmInput(): void {
            let msg = new AddTeaHouseMemberMsg();
            msg.teaHouseId = TeaHouseData.curID;
            msg.playerIndex = Number(this.codeInput.text);
            ServerUtil.sendMsg(msg, MsgCmdConstant.MSG_ADD_TEAHOUSE_MEMEBER_ACK);
        }
    }
}