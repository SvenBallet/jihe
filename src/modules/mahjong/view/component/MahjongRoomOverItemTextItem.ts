module FL {
    /** 麻将游戏结束条目---文本条目 */
    export class MahjongRoomOverItemTextItem extends eui.ItemRenderer {
        private lab: eui.Label;
        private lab0:eui.Label;
        constructor() {
            super();
            this.skinName = "skins.MahjongRoomOverItemTextItemSkin";
        }

        protected childrenCreated() {
            this.initView();
        }

        /** 初始化页面 */
        private initView() {
            if (!this.data) return;
            this.lab.text = this.data.split(":")[0];
            this.lab0.text = this.data.split(":")[1];
        }

        protected dataChanged() {
            this.initView();
        }
    }
}