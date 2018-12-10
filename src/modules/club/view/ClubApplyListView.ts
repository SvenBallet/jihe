module FL {
    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase - ClubApplyListView
     * @Description:  申请列表
     * @Create: ArielLiang on 2018/3/7 14:56
     * @Version: V1.0
     */
    export class ClubApplyListView extends eui.Component {
        /** 选项列表组 */
        public listScroller: eui.Scroller;
        public listGroup: eui.DataGroup;
        /** 选项数据源 */
        private arrCollection: eui.ArrayCollection = null;

        // /** 全部同意 */
        // public allAgreeBtn: GameButton;
        // /** 全部拒绝 */
        // public allRefuseBtn: GameButton;

        public constructor() {
            super();
            this.left = this.right = 0;
            this.top = this.bottom = 0;
            // this.verticalCenter = this.horizontalCenter = 0;
            this.skinName = "skins.ClubApplyListViewSkin";
        }

        protected childrenCreated(): void {
            super.childrenCreated();
            let self = this;
            let layout = new eui.VerticalLayout();
            // layout.gap = 6;
            self.listScroller.verticalScrollBar.autoVisibility = false;
            self.listScroller.scrollPolicyH = eui.ScrollPolicy.OFF;
            self.listGroup.layout = layout;

            self.initView();
            //注册按钮点击缓动
            // TouchTweenUtil.regTween(self.allAgreeBtn, self.allAgreeBtn);
            // TouchTweenUtil.regTween(self.allRefuseBtn, self.allRefuseBtn);

            // //注册事件监听
            // self.allAgreeBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, self.opperationApply, self);
            // self.allRefuseBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, self.opperationApply, self);
        }

        /**
          * 操作，全部同意或拒绝
          * @param {number} type
          */
        public opperationApply(type: number) {
            let vClub = ClubData.vClub;
            // if (e.currentTarget == this.allAgreeBtn) {
            //     type = OptApplyListMsg.AGREE;
            // } else {
            //     type = OptApplyListMsg.REJECT;
            // }
            let msg = new OptApplyListMsg();
            msg.applyId = dcodeIO.Long.ZERO;
            // msg.applyId = 0;            
            msg.clubId = vClub.id;
            msg.type = type;
            ServerUtil.sendMsg(msg, MsgCmdConstant.MSG_OPT_APPLY_LIST);
        }

        /** 初始化视图 */
        private initView(pClubApply?: ClubApply[]) {
            //---test
            let arr = (pClubApply) ? pClubApply : [];
            this.arrCollection = new eui.ArrayCollection(arr);
            this.listGroup.itemRenderer = ClubApplyListItemView;
            // this.listGroup.itemRendererSkinName = "skins.ClubRankingListItemViewSkin";
            this.listGroup.dataProvider = this.arrCollection;
        }

        /** 刷新视图
         * @returns {number} 
         */
        public refreshView(msg: ShowApplyListMsgAck): number {
            let data = msg.applyList;
            this.arrCollection.replaceAll(data);
            this.listGroup.validateNow();
            this.listScroller.viewport.scrollV = 0;
            return data.length;
        }

        /** 操作结果返回刷新视图
        */
        public optView(msg: OptApplyListMsgAck) {
            let resCode = msg.result;
            switch (resCode) {
                case OptApplyListMsgAck.SUCCESS://成功
                    PromptUtil.show('操作成功', PromptType.SUCCESS);
                    MvcUtil.send(ClubModule.CLUB_REFRESH_VIEW);
                    break;

                case OptApplyListMsgAck.ERROR://未知错误
                    PromptUtil.show('未知错误', PromptType.ERROR);
                    break;

                case OptApplyListMsgAck.CLUB_NOT_FOUND://俱乐部不存在
                    PromptUtil.show('俱乐部不存在', PromptType.ERROR);
                    break;

                case OptApplyListMsgAck.PRIV_ERROR://权限不足
                    PromptUtil.show('权限不足', PromptType.ERROR);
                    break;
            }
        }
    }
}