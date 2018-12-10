module FL {
    /**
     * 列表元素被调用页面枚举
     */
    export enum ETHItemInvokedView {
        THMemListView = 1,//茶楼成员页面
        THMemWaiterView = 2,//茶楼小二管理页面
        THMemAddWaiterView = 3,//添加小二頁面
        THLogTodayRankingView = 4,//茶楼今日战榜页面
        THLogYesterdayRankingView = 5,//茶楼昨日战榜页面
    }

    /** 茶楼成员信息数据接口 */
    export interface ITHMemberInfoData {
        invokedView?: ETHItemInvokedView;//被调用页面
        head?: string;//头像
        name?: string;//昵称
        id?: any;//index
        memberID?: any;//成員id
        joinTime?: number;//加入时间
        lastTime?: number;//最后登录时间
        count?: number;//总局数
        power?: ETHPlayerPower;//成员权限
        isMemberOnline?: boolean;//在线状态
    }

    /** 茶楼成员列表元素视图 */
    export class TeaHouseMemListItemView extends eui.ItemRenderer {
        /** 头像 */
        private headImg: eui.Image;
        /** 昵称 */
        private memberName: eui.Label;
        /** ID */
        private memberID: eui.Label;
        /** 最后上线时间 */
        private lastLoginTime: eui.Label;
        /** 总局数 */
        private countNum: eui.Label;

        /** 删除按钮 */
        private delBtn: GameButton;
        public stateImg:eui.Image;

        /** 数据源 */
        public data: ITHMemberInfoData;
        constructor() {
            super();
            this.left = this.top = this.right = this.bottom = 0;
            this.skinName = "skins.TeaHouseMemListItemViewSkin";
        }

        protected childrenCreated() {
            let self = this;
            //注册缓动事件
            TouchTweenUtil.regTween(self.delBtn, self.delBtn);

            //注册监听事件
            self.delBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, self.onDel, self);
            self.initView();
        }

        /**初始化视图 */
        private initView() {
            if (!this.data) return;
            this.memberID.text = "ID:" + this.data.id;
            this.memberName.text = StringUtil.subStrSupportChinese(this.data.name, 10, "..");
            this.countNum.text = "" + this.data.count;
            this.lastLoginTime.text = "" + StringUtil.formatDate("yyyy-MM-dd hh:mm:ss", new Date(this.data.lastTime));
            //设置头像
            if (GConf.Conf.useWXAuth) {
                if (this.data.head) GWXAuth.setRectWXHeadImg(this.headImg, this.data.head);
                else { this.headImg.source = "" };
            }
            this.stateImg.source = this.data.isMemberOnline ? "th_detail_state_ing_png" : "th_detail_state_break_png";
        }

        /** 删除 */
        protected onDel() {
            if (!this.data) return;
            let str;
            if (this.data.invokedView == ETHItemInvokedView.THMemListView) {
                str = "您确定要删除该名成员吗？";
            } else if (this.data.invokedView == ETHItemInvokedView.THMemWaiterView) {
                str = "您确定要删除该名成员的小二身份吗？"
            }
            ReminderViewUtil.showReminderView({
                hasLeftBtn: true,
                leftCallBack: new MyCallBack(this.confirmDel, this),
                hasRightBtn: true,
                text: str
            })
        }

        /** 确认删除 */
        private confirmDel() {
            if (!this.data) return;
            let msg;
            switch (this.data.invokedView) {
                case ETHItemInvokedView.THMemListView:
                    //成員列表項
                    msg = new OptMemberStateMsg();
                    msg.teaHouseId = TeaHouseData.curID;
                    msg.memberId = this.data.memberID;
                    msg.operationType = OptMemberStateMsg.DELETE_TEAHOUSE_MEMBER;
                    ServerUtil.sendMsg(msg, MsgCmdConstant.MSG_OPT_TEAHOUSE_MEMBER_ACK);
                    return;
                case ETHItemInvokedView.THMemWaiterView:
                    //小二管理列表項
                    msg = new OptMemberStateMsg();
                    msg.teaHouseId = TeaHouseData.curID;
                    msg.memberId = this.data.memberID;
                    msg.operationType = OptMemberStateMsg.DELETE_TEAHOUSE_XIAOER;
                    ServerUtil.sendMsg(msg, MsgCmdConstant.MSG_OPT_TEAHOUSE_MEMBER_ACK);
                    return;
            }
        }

        protected dataChanged() {
            this.initView();
        }
    }
}