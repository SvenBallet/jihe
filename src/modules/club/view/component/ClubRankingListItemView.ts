module FL {
    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase - ClubRankingListItemView
     * @Description:  俱乐部列表条目
     * @Create: HoyeLee on 2018/3/10 15:59
     * @Version: V1.0
     */
    export class ClubRankingListItemView extends eui.ItemRenderer {

        /** 排名 */
        public clubRank: eui.Label;
        public clubImg: eui.Image;//前三名才显示为图片

        /** 昵称 */
        public clubName: eui.Label;

        /** ID */
        public clubID: eui.Label;

        /** 积分 */
        public clubScore: eui.Label;

        public constructor() {
            super();
            this.verticalCenter = this.horizontalCenter = 0;
            this.skinName = "skins.ClubRankingListItemViewSkin";
        }

        protected childrenCreated(): void {
            super.childrenCreated();
            let self = this;
            self.initView();
            //注册按钮点击缓动
        }

        private initView() {
            if (!this.data) return;
            this.height = 55;
            this.clubName.text = StringUtil.subStrSupportChinese(this.data.playerName, 18, "...");
            this.clubID.text = "" + this.data.playerIndex;
            this.clubRank.text = "" + this.data.order;
            this.clubScore.text = "" + this.data.score;
            this.clubImg.visible = false;
            if (this.data.order > 3) return;
            this.clubImg.source = RES.getRes('rank' + this.data.order + "_png");
            this.clubImg.visible = true;
        }


        protected dataChanged() {
            this.initView();
        }
    }
}