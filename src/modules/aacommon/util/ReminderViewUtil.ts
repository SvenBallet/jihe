module FL {
    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase - ReminderViewUtil
     * @Description:  //提示界面工具类
     * @Create: DerekWu on 2017/11/20 16:27
     * @Version: V1.0
     */
    export class ReminderViewUtil {

        /**
         * 显示提示界面
         * @param params
         * 参数说明 ：
         *    {
         *      hasLeftBtn:boolean,   是否有左边按钮
         *      leftCallBack:MyCallBack,   左边按钮回调
         *      hasRightBtn:boolean,  是否有右边按钮
         *      rightCallBack:MyCallBack,  右边按钮回调
         *      titleImgSrc:string,  title美术资源
         *      leftBtnSrc:string,    左边按钮美术资源
         *      leftBtnText:string,    左边按钮显示文字
         *      rightBtnSrc:string,   右边按钮美术资源
         *      rightBtnText:string,  右边按钮显示文字
         *      text:string,   提示文本
         *      textFlow:string  提示富文本
         *    }
         */
        public static showReminderView(params:any, viewLayer?: FL.ViewLayerEnum):ReminderView {
            let vOneReminderView:ReminderView = new ReminderView(params.hasLeftBtn, params.leftCallBack, params.hasRightBtn, params.rightCallBack);
            vOneReminderView.setViewFeature(params.titleImgSrc, params.leftBtnSrc, params.leftBtnText, params.rightBtnSrc, params.rightBtnText);
            if (viewLayer) {
                vOneReminderView.setViewLayer(viewLayer);
            }
            if (params.text) {
                vOneReminderView.setReminderText(params.text);
            } else if (params.textFlow) {
                vOneReminderView.setReminderTextFlow(params.textFlow);
            }
            //播放确认提示声音，界面中本来支持这个动能
            // SoundManager.playEffect("confirm_mp3");
            MvcUtil.addView(vOneReminderView);
            return vOneReminderView;
        }

    }
}