module FL {
    /** 茶楼管理---经营状况页面 */
    export class TeaHouseMgrRunstateView extends eui.Component {
        /** 数据显示组 */
        private scroller: eui.Scroller;
        private dataGroup: eui.DataGroup;
        /** 显示数据源 */
        private arrCollection: eui.ArrayCollection;
        /** 数据源 */
        private data: any;

        constructor() {
            super();
            this.left = this.right = this.top = this.bottom = 0;
            this.skinName = "skins.TeaHouseMgrRunstateViewSkin";
        }

        protected childrenCreated() {
            let self = this;

            self.initView();
        }

        /** 初始化页面 */
        private initView() {
            //----test
            this.scroller.scrollPolicyH = "off";
            if (!this.arrCollection) this.arrCollection = new eui.ArrayCollection();
            this.dataGroup.dataProvider = this.arrCollection;
            this.dataGroup.itemRenderer = TeaHouseMgrRsItemView;
            this.scroller.viewport = this.dataGroup;
            this.refreshView(this.data);
            TeaHouseMsgHandle.sendRsListMsg();
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
    }
}