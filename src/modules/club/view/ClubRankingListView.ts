module FL {
    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase - ClubRankingListView
     * @Description: 排行榜
     * @Create: ArielLiang on 2018/3/7 14:58
     * @Version: V1.0
     */

    /*
    @Change: HoyeLee on 2018/3/10 15:29
    */

    export class ClubRankingListView extends eui.Component {

        /** 选项列表组 */
        public listScroller: eui.Scroller;
        public listGroup: eui.DataGroup;
        /** 选项数据源 */
        private arrCollection: eui.ArrayCollection = null;

        public constructor() {
            super();
            this.left = this.right = 0;
            this.top = this.bottom = 0;
            // this.verticalCenter = this.horizontalCenter = 0;
            this.skinName = "skins.ClubRankingListViewSkin";
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
            // TouchTweenUtil.regTween(this.closeGroup, this.closeBtn);

        }

        /** 初始化视图 */
        private initView(pClubOperationLogs?: ClubOperationLog[]) {
            //---test
            let arr = (pClubOperationLogs) ? pClubOperationLogs : [];
            this.arrCollection = new eui.ArrayCollection(arr);
            this.listGroup.itemRenderer = ClubRankingListItemView;
            // this.listGroup.itemRendererSkinName = "skins.ClubRankingListItemViewSkin";
            this.listGroup.dataProvider = this.arrCollection;
        }

        /** 刷新视图
         * @returns {number} 
         */
        public refreshView(msg: ShowRankMsgAck): number {
            if (!msg) return -1;
            let data = msg.members;
            this.arrCollection.replaceAll(data);
            this.listGroup.validateNow();
            this.listScroller.viewport.scrollV = 0;
            return data.length;
        }
    }
}