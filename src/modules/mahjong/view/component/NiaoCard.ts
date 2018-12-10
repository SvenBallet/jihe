module FL {

    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase - NiaoCard
     * @Description:  // 鸟牌
     * @Create: DerekWu on 2018/3/15 19:01
     * @Version: V1.0
     */
    export class NiaoCard extends eui.Group {

        /** 鸟标记 */
        private _niaoFlag: eui.Image;

        /** 鸟牌 */
        private _niaoCard: MahjongCardItem;

        /** 鸟牌信息 */
        public niaoInfo: { card: number, isZhong: boolean, pos: number };

        constructor(isInGameOverView: boolean = false) {
            super();
            let vNiaoFlag: eui.Image = new eui.Image();
            vNiaoFlag.source = "niao_flag_png", vNiaoFlag.x = 0, vNiaoFlag.y = 0;
            this._niaoFlag = vNiaoFlag;
            
            let vNiaoCard: MahjongCardItem;
            if (isInGameOverView) {
                vNiaoCard = MahjongCardManager.getMahjongCommonCard(1, 40, 60);
                vNiaoFlag.scaleX = 40/75;
                vNiaoFlag.scaleY = 60/113;
            } else {
                vNiaoCard = MahjongCardManager.getMahjongCommonCard(1, 75, 113);
                this.anchorOffsetX = 37, this.anchorOffsetY = 56;
            }
            this.width = vNiaoCard.width, this.height = vNiaoCard.height;

            this._niaoCard = vNiaoCard;
            this.addChild(vNiaoCard);
        }

        /**
         * 重设
         * @param {{card: number; isZhong: boolean; pos: number}} niaoInfo
         */
        public reset(niaoInfo: { card: number, isZhong: boolean, pos: number }): void {
            this._niaoCard.resetCommonCardValue(niaoInfo.card);
            // 设置鸟牌信息
            this.niaoInfo = niaoInfo;
            if (niaoInfo.isZhong) {
                ViewUtil.addChild(this, this._niaoFlag);
            } else {
                ViewUtil.removeChild(this, this._niaoFlag);
            }
        }

    }

}