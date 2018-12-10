module FL {

    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase - CommonDataHandler
     * @Description:  //公共模块 Handler
     * @Create: DerekWu on 2017/12/9 8:03
     * @Version: V1.0
     */
    export class CommonHandler {

        /**
         * 获得是否已经进入游戏
         * @returns {boolean}
         */
        public static getIsIntoGame():boolean {
            return CommonData.isIntoGame;
        }

        /**
         * 设置是否已经进游戏
         * @param {boolean} isIntoGame
         */
        public static setIsIntoGame(isIntoGame:boolean):void {
            CommonData.isIntoGame = isIntoGame;
        }

        /**
         * 获得开发版本最后登录信息
         * @returns {FL.LoginMsg}
         */
        public static getLastDevLoginMsg():LoginMsg {
            return CommonData.devLoginMsg;
        }

        /**
         * 设置开发版本登录消息
         * @param {FL.LoginMsg} devLoginMsg
         */
        public static setDevLoginMsg(devLoginMsg:LoginMsg):void {
            CommonData.devLoginMsg = devLoginMsg;
        }

        /**
         * 获得微信最后登录信息
         * @returns {FL.H5WXLoginMsg}
         */
        public static getLastWXLoginMsg():H5WXLoginMsg {
            return CommonData.wxLoginMsg;
        }

        /**
         * 设置微信登录消息
         * @param {FL.H5WXLoginMsg} wxLoginMsg
         */
        public static setWXLoginMsg(wxLoginMsg:H5WXLoginMsg):void {
            CommonData.wxLoginMsg = wxLoginMsg;
        }

        /**
         * 设置加载界面
         * @param {FL.LoadingView} view
         */
        public static setLoadingView(view:LoadingView):void {
            CommonData.loadingView = view;
        }

        /**
         * 获得loading界面
         * @returns {FL.LoadingView}
         */
        public static getLoadingView():LoadingView {
            return CommonData.loadingView;
        }

        /**
         * 获取透明遮罩
         * @returns {eui.Group}
         */
        // private static getNetConnectMask(): eui.Group {
        //     if (!CommonData.netConnectMask) {
        //         let netConnectMask: eui.Group = new eui.Group();
        //         netConnectMask.left = netConnectMask.right = netConnectMask.top = netConnectMask.bottom = 0;
        //         netConnectMask.touchEnabled = true;
        //         netConnectMask[ViewEnum.viewLayer] = ViewLayerEnum.TOOLTIP_BOTTOM;
        //         CommonData.netConnectMask = netConnectMask;
        //     }
        //     return CommonData.netConnectMask;
        // }

        // public static addNetConnectMask(): void {
        //     let netConnectMask: eui.Group = this.getNetConnectMask();
        //     if (!netConnectMask.parent) {
        //         MvcUtil.addView(netConnectMask);
        //     }
        // }

        // public static delNetConnectMask(): void {
        //     let netConnectMask: eui.Group = this.getNetConnectMask();
        //     if (netConnectMask.parent) {
        //         MvcUtil.delView(netConnectMask);
        //     }
        // }

    }

}