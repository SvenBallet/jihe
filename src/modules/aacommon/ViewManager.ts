module FL {
    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase - ViewManager
     * @Description:  //界面管理
     * @Create: DerekWu on 2017/11/16 11:29
     * @Version: V1.0
     */
    export class ViewManager {

        /** 登录背景,只用一次后删除 */
        // private static _loginBg:FullSameRatioImage;

        /**
         * 获取登录背景
         * @returns {FL.FullSameRatioImage}
         */
        public static getLoginBg():FullSameRatioImage {
            // if (!this._loginBg) {
                let vFullSameRatioImage:FullSameRatioImage = new FullSameRatioImage("bg_jpg");
                vFullSameRatioImage[FL.ViewEnum.viewLayer] = FL.ViewLayerEnum.BOTTOM_BOTTOM_ONLY;
                return vFullSameRatioImage;
                // this._loginBg = vFullSameRatioImage;
            // }
            // return this._loginBg;
        }

        /** 大厅背景 */
        private static _lobbyBg:FullSameRatioImage;

        /**
         * 获取大厅背景
         * @returns {FL.FullSameRatioImage}
         */
        public static getLobbyBg():FullSameRatioImage {
            if (!this._lobbyBg) {
                let vFullSameRatioImage:FullSameRatioImage = new FullSameRatioImage("bg_jpg");
                vFullSameRatioImage[FL.ViewEnum.viewLayer] = FL.ViewLayerEnum.BOTTOM_BOTTOM_ONLY;
                this._lobbyBg = vFullSameRatioImage;
            }
            return this._lobbyBg;
        }

        /** 牌桌背景 */
        private static _tableBoardBg:eui.Image;

        /**
         * 获取牌桌背景
         * @returns {eui.Image}
         * @private
         */
        public static getTableBoardBg():eui.Image {
            if (!this._tableBoardBg) {
                let vImage:eui.Image = new eui.Image();
                vImage.left = vImage.right = vImage.top = vImage.bottom = 0;
                vImage[FL.ViewEnum.viewLayer] = FL.ViewLayerEnum.BOTTOM_BOTTOM_ONLY;
                vImage.source = Storage.getPZResName();
                // vImage.source = "pz_bg_green_png";
                this._tableBoardBg = vImage;
            }
            return this._tableBoardBg;
        }

        /**
         * 重设牌桌背景
         * @param {string} pzResName
         */
        public static resetTableBoardBg(pzResName:string):void {
            Storage.setPZResName(pzResName);
            let vImage:eui.Image = this.getTableBoardBg();
            vImage.source = Storage.getPZResName();
        }

    }

}