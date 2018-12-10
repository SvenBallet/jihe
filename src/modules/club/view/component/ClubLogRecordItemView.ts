module FL {
    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase - ClubLogRecordItemView
     * @Description:  俱乐部列表条目
     * @Create: HoyeLee on 2018/3/10 16:11
     * @Version: V1.0
     */
    export class ClubLogRecordItemView extends eui.ItemRenderer {
        public clubDetail: eui.Label;
        public constructor() {
            super();
            this.verticalCenter = this.horizontalCenter = 0;
            this.skinName = "skins.ClubLogRecordItemViewSkin";
        }

        protected childrenCreated(): void {
            super.childrenCreated();
            let self = this;
            self.initView();            
            //注册按钮点击缓动
        }

        private initView() {
            // console.log("ClubLogRecordItemView init");
            if (!this.data) return;
            let date = new Date(this.data.date);
            this.height = 50;
            // let date = new Date(this.data.date.toString() / 1000);
            let time = StringUtil.formatDate("yyyy-MM-dd hh:mm:ss", date);
            this.clubDetail.text = time + ", " + this.data.detail;
        }

        protected dataChanged() {
            // console.log('change');
            this.initView();
        }
    }
}