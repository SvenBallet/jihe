module FL {
    /** 茶楼战榜元素数据接口 */
    export interface ITHRankingItemData {
        invokedView?: ETHItemInvokedView;//被调用页面
        index?: number;//序号
        head?: string;//头像
        name?: string;//昵称
        id?: any;//ID
        memberID?: any;//玩家id
        score?: number;//积分显示文本，eg:积分：1
        win?: number;//大赢家次数显示文本，eg:大赢家次数：1
        date?: number;//日期
        totalCount: number;
    }

    /** 茶楼战绩---战榜元素视图 */
    export class TeaHouseLogRankingItemView extends eui.ItemRenderer {
        /** 序号 */
        private indexLab: eui.Label;
        /** 头像 */
        private headImg: eui.Image;
        /** 昵称 */
        private playerName: eui.Label;
        /** ID */
        private playerID: eui.Label;
        /** 大赢家次数 */
        private winLab: eui.Label;
        /** 积分总和 */
        private scoreLab: eui.Label;
        /** 更新日期 */
        private date: eui.Label;
        public totalLab:eui.Label;

        /** 数据源 */
        public data: ITHRankingItemData;
        constructor() {
            super();
            this.left = this.top = this.right = this.bottom = 0;
            this.skinName = "skins.TeaHouseLogRankingItemViewSkin";
        }

        protected childrenCreated() {
            let self = this;
            self.initView();
        }

        /** 初始化页面 */
        private initView() {
            if (!this.data) return;
            this.indexLab.text = "" + this.data.index;
            this.playerName.text = StringUtil.subStrSupportChinese(this.data.name, 10, "..");
            this.playerID.text = "" + this.data.id;
            let winType = (this.data.invokedView == ETHItemInvokedView.THLogTodayRankingView) ? "今日" : "昨日";
            this.winLab.text = winType + "大赢家次数：" + this.data.win;
            this.scoreLab.text = winType + "积分：" + this.data.score;
            this.totalLab.text = winType + "场次：" + this.data.totalCount;
            this.date.text = StringUtil.formatDate("yyyy-MM-dd hh:mm:ss", new Date(this.data.date));
            //设置头像
            if (GConf.Conf.useWXAuth) {
                if (this.data.head) GWXAuth.setRectWXHeadImg(this.headImg, this.data.head);
                else { this.headImg.source = "" };
            }
        }

        protected dataChanged() {
            this.initView();
        }
    }
}