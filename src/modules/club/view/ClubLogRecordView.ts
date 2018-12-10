module FL {
    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase - ClubLogRecordView
     * @Description: 日志记录
     * @Create: ArielLiang on 2018/3/7 14:59
     * @Version: V1.0
     */
    export class ClubLogRecordView extends eui.Component {
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
            this.skinName = "skins.ClubLogRecordViewSkin";
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
        private initView(pClubMembers?: ClubMember[]) {
            //---test
            let arr = (pClubMembers) ? pClubMembers : [];
            this.arrCollection = new eui.ArrayCollection(arr);
            this.listGroup.itemRenderer = ClubLogRecordItemView;
            // this.listGroup.itemRendererSkinName = "skins.ClubRankingListItemViewSkin";
            this.listGroup.dataProvider = this.arrCollection;
        }

        /** 刷新视图 
         * @returns {number} 
        */
        public refreshView(msg: ClubLogMsgAck): number {
            let data = msg.logs;
            this.arrCollection.replaceAll(data);
            this.listGroup.validateNow();
            this.listScroller.viewport.scrollV = 0;
            return data.length;
        }
    }
}