module FL {
    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase - TeaHouseLogRankingItemNewView
     * @Description:  //
     * @Create: DerekWu on 2018/9/13 19:23
     * @Version: V1.0
     */
    export class TeaHouseLogRankingItemNewView extends eui.ItemRenderer {
        /** 排名 */
        private rankNo: eui.Label;
        /** 昵称 */
        private playerName: eui.Label;
        /** ID */
        private playerIndex: eui.Label;
        /** 分数 */
        private playerScore: eui.Label;
        /** 场次 */
        private playerCountNum: eui.Label;
        /** 大赢家 */
        private bigWinNum: eui.Label;


        /** 数据源 */
        public data: TeaHouseRankItem;
        constructor() {
            super();
            this.left = this.top = this.right = this.bottom = 0;
            this.skinName = "skins.TeaHouseLogRankingItemNewViewSkin";
        }

        protected childrenCreated() {
            let self = this;
            // self.initView();
            // 老板才显示 分数 和 大赢家
            let vTeaHouse: TeaHouse = TeaHouseData.teaHouse;
            if (!vTeaHouse || vTeaHouse.creatorIndex !== LobbyData.playerVO.playerIndex) {
                this.playerScore.visible = false;
                this.bigWinNum.visible = false;
            }
        }

        /** 初始化页面 */
        private initView() {

            if (!this.data) return;
            this.rankNo.text = "" + this.data.rankNo;
            this.playerName.text = StringUtil.subStrSupportChinese(this.data.playerName, 16, "");
            this.playerIndex.text = "" + this.data.playerIndex;
            this.playerScore.text = "" + this.data.sumScore;
            this.playerCountNum.text = "" + this.data.sumPlayNum;
            this.bigWinNum.text = "" + this.data.sumBigWinNum;

            // this.playerName.text = StringUtil.subStrSupportChinese(this.data.name, 10, "..");
            // this.playerID.text = "" + this.data.id;
            // let winType = (this.data.invokedView == ETHItemInvokedView.THLogTodayRankingView) ? "今日" : "昨日";
            // this.winLab.text = winType + "大赢家次数：" + this.data.win;
            // this.scoreLab.text = winType + "积分：" + this.data.score;
            // this.totalLab.text = winType + "场次：" + this.data.totalCount;
            // this.date.text = StringUtil.formatDate("yyyy-MM-dd hh:mm:ss", new Date(this.data.date));
            // //设置头像
            // if (GConf.Conf.useWXAuth) {
            //     if (this.data.head) GWXAuth.setRectWXHeadImg(this.headImg, this.data.head);
            //     else { this.headImg.source = "" };
            // }
        }

        protected dataChanged() {
            this.initView();
        }

    }
}