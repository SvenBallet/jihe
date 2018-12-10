module FL {
    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase - ClubMemberListView
     * @Description:  成员列表
     * @Create: ArielLiang on 2018/3/7 14:54
     * @Version: V1.0
     */
    // export class ClubMemberListView extends eui.Component {


    //     public memberListScroller:eui.Scroller;

    //     public memberListGroup:eui.Group;

    //     public constructor(){
    //         super();
    //         this.verticalCenter = this.horizontalCenter = 0;
    //         this.skinName = "skins.ClubMemberListViewSkin";
    //     }

    //     protected childrenCreated():void {
    //         super.childrenCreated();
    //         let self = this;

    //         //垂直布局
    //         let layout = new eui.VerticalLayout();
    //         self.memberListGroup.layout = layout;


    //     }

    //     /**
    //      * 发送请求列表消息
    //      * @param {number} page
    //      */
    //     public sendMsg(page:number):void{
    //         let vShowMemberListMsg:ShowMemberListMsg = new ShowMemberListMsg();
    //         vShowMemberListMsg.clubId = ClubData.vClub.id;
    //         vShowMemberListMsg.page = page;
    //         ServerUtil.sendMsg(vShowMemberListMsg, MsgCmdConstant.MSG_SHOW_MEMBER_LIST_ACK);
    //     }

    //     /**
    //      * 显示成员列表
    //      * @param {FL.ShowMemberListMsgAck} msg
    //      */
    //     public showMemberList(msg:ShowMemberListMsgAck):void{
    //         this.memberListGroup.removeChildren();
    //         let list:Array<any> = msg.members;
    //         if(list == null){
    //             return;
    //         }
    //         for (let i=0;i<list.length;i++){
    //             let vClubMemberListItemView = new ClubMemberListItemView(list[i]);
    //             this.memberListGroup.addChild(vClubMemberListItemView);
    //         }
    //     }
    // }

    export class ClubMemberListView extends eui.Component {
        /** 选项列表组 */
        public listScroller: eui.Scroller;
        public listGroup: eui.DataGroup;
        /** 选项数据源 */
        private arrCollection: eui.ArrayCollection = null;

        private data: ClubMember[] = null;
        public vClubBubbleBtnListView: ClubBubbleBtnListView = null;
        private flag_show: boolean = false;
        public flag_index: number = -1;

        public constructor() {
            super();
            this.left = this.right = 0;
            this.top = this.bottom = 0;
            // this.verticalCenter = this.horizontalCenter = 0;
            this.skinName = "skins.ClubMemberListViewSkin";
        }

        protected childrenCreated(): void {
            super.childrenCreated();
            let self = this;

            //垂直布局
            let layout = new eui.VerticalLayout();
            self.listScroller.verticalScrollBar.autoVisibility = false;
            self.listScroller.scrollPolicyH = eui.ScrollPolicy.OFF;
            self.listGroup.layout = layout;

            self.initView();
        }

        /**
         * 发送请求列表消息
         * @param {number} page
         */
        public sendMsg(page: number, playerID?:number): void {
            let vShowMemberListMsg: ShowMemberListMsg = new ShowMemberListMsg();
            vShowMemberListMsg.clubId = ClubData.vClub.id;
            vShowMemberListMsg.page = page;
            vShowMemberListMsg.unused_0 = playerID?playerID:0;
            ServerUtil.sendMsg(vShowMemberListMsg, MsgCmdConstant.MSG_SHOW_MEMBER_LIST_ACK);
        }

        // /**
        //  * 显示成员列表
        //  * @param {FL.ShowMemberListMsgAck} msg
        //  */
        // public showMemberList(msg: ShowMemberListMsgAck): void {
        //     this.memberListGroup.removeChildren();
        //     let list: Array<any> = msg.members;
        //     if (list == null) {
        //         return;
        //     }
        //     for (let i = 0; i < list.length; i++) {
        //         let vClubMemberListItemView = new ClubMemberListItemView(list[i]);
        //         this.memberListGroup.addChild(vClubMemberListItemView);
        //     }
        // }

        public showBubbleView(index: number) {
            if (!this.data || !this.data[index]) return;
            if (index == this.flag_index) {
                this.flag_show = !this.flag_show;
            } else {
                this.flag_show = true;
                this.flag_index = index;
            }
            if (!this.vClubBubbleBtnListView) {
                this.vClubBubbleBtnListView = new ClubBubbleBtnListView(index);
            }
            if (this.vClubBubbleBtnListView.parent) {
                this.vClubBubbleBtnListView.parent.removeChild(this.vClubBubbleBtnListView);
            }
            if (this.flag_show) {
                let item = this.listGroup.getChildAt(this.listGroup.numChildren - 1);
                this.vClubBubbleBtnListView.left = 800;//right:230
                let _gap = 5;
                let _y = item.height * (index + 4.5) + _gap * (index + 0.5);
                let v = this.listScroller.viewport.scrollV;
                _y -= v;
                this.vClubBubbleBtnListView.flag_index = this.flag_index;
                this.vClubBubbleBtnListView.y = _y;
                this.vClubBubbleBtnListView.memberID = this.data[index].memberId;
                this.vClubBubbleBtnListView.memberName = this.data[index].playerName;
                this.vClubBubbleBtnListView.memberLevel = this.data[index].level;
                this.vClubBubbleBtnListView.initView();
                this.parent.parent.addChild(this.vClubBubbleBtnListView);
            }
        }

        /** 初始化视图 */
        private initView(pClubMembers?: ClubMember[]) {
            //---test
            let arr = (pClubMembers) ? pClubMembers : [];
            this.arrCollection = new eui.ArrayCollection(arr);
            this.listGroup.itemRenderer = ClubMemberListItemView;
            // this.listGroup.itemRendererSkinName = "skins.ClubRankingListItemViewSkin";
            this.listGroup.dataProvider = this.arrCollection;
        }

        /** 刷新视图
         * @returns {number}
         */
        public refreshView(msg: ShowMemberListMsgAck): number {
            this.data = msg.members;
            this.arrCollection.replaceAll(this.data);
            this.listGroup.validateNow();
            this.listScroller.viewport.scrollV = 0;
            this.vClubBubbleBtnListView = null;
            this.flag_index = -1;
            this.flag_show = false;
            return this.data.length;
        }
    }
}