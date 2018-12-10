module FL {
    /** 经营状态元素数据接口 */
    export interface ITHRsItemData {
        date?: any;//日期
        fst?: number;//一楼
        snd?: number;//二楼
        trd?: number;//三楼
        total?: number;//总局
    }

    /** 茶楼管理经营状态元素项视图 */
    export class TeaHouseMgrRsItemView extends eui.ItemRenderer {
        /** 日期 */
        private dateLab: eui.Label;
        /** 一楼 */
        private fstLab: eui.Label;
        /** 二楼 */
        private sndLab: eui.Label;
        /** 三楼 */
        private trdLab: eui.Label;
        /** 总局 */
        private totalLab: eui.Label;
        /**数据源 */
        public data: ITHRsItemData;
        constructor() {
            super();
            this.left = this.top = this.right = this.bottom = 0;
            this.skinName = "skins.TeaHouseMgrRsItemViewSkin";
        }

        protected childrenCreated() {
            let self = this;
            self.initView();
        }

        /** 初始化页面 */
        private initView() {
            if (!this.data) return;
            this.dateLab.text = "" + StringUtil.formatDate("yyyy-MM-dd", new Date(this.data.date));
            this.fstLab.text = "" + this.data.fst;
            this.sndLab.text = "" + this.data.snd;
            this.trdLab.text = "" + this.data.trd;
            this.totalLab.text = "" + this.data.total;
        }

        protected dataChanged() {
            this.initView();
        }
    }
}