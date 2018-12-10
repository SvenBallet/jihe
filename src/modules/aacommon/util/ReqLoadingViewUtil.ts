module FL {

    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase - ReqLoadingViewUtil
     * @Description:  //请求服务器界面加载工具类
     * @Create: DerekWu on 2017/11/20 20:24
     * @Version: V1.0
     */
    export class ReqLoadingViewUtil {


        /**
         * 强制添加loading
         * @param {number} viewId
         */
        public static addReqLoadingView():void {
            ReqLoadingViewUtil.delReqLoadingView();
            let vReqLoadingView:ReqLoadingView = ReqLoadingView.getInstance();
            vReqLoadingView.genNewViewId();
            if (!vReqLoadingView.parent) {
                MvcUtil.addView(vReqLoadingView);
            }
        }

        /**
         * 移除，也可以不穿参数强制移除
         * @param {number} viewId
         */
        public static delReqLoadingView(viewId?:number):void {
            // egret.log("# delReqLoadingView viewId = " + viewId);
            let vReqLoadingView:ReqLoadingView = ReqLoadingView.getInstance();
            // if (!vReqLoadingView.isView()) return;
            if (!vReqLoadingView.parent) {
                return;
            }
            if (viewId) {
                if (vReqLoadingView.getViewId() === viewId) {
                    MvcUtil.delView(vReqLoadingView);
                    if (vReqLoadingView.parent) {
                        ViewUtil.removeChild(vReqLoadingView.parent, vReqLoadingView);
                    }
                    // egret.log("# delReqLoadingView OK viewId = " + viewId);
                } else {
                    // egret.log("# delReqLoadingView ERROR viewId = " + viewId);
                }
            } else {
                MvcUtil.delView(vReqLoadingView);
                if (vReqLoadingView.parent) {
                    ViewUtil.removeChild(vReqLoadingView.parent, vReqLoadingView);
                }
                // egret.log("# delReqLoadingView OK 2 viewId = " + viewId);
            }
        }

        /**
         * 添加带有显示进度的loading界面
         * @param {number} current   当前加载
         * @param {number} total    总量
         */
        public static addReqLoadingViewWithProgress(current:number,total:number) {
            let vReqLoadingView:ReqLoadingView = ReqLoadingView.getInstance();
            vReqLoadingView.genNewViewId();
            // if (!vReqLoadingView.isView()) {
            //     MvcUtil.addView(vReqLoadingView);
            // }
            if (!vReqLoadingView.parent) {
                MvcUtil.addView(vReqLoadingView);
            }
            vReqLoadingView.showLoadingProgress(current,total);
            if(current >= total){
                ReqLoadingViewUtil.delReqLoadingView();
            }
        }

    }

}