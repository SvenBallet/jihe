module FL {
    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase - RecordTipView
     * @Description:  //录音界面
     * @Create: DerekWu on 2018/1/9 15:55
     * @Version: V1.0
     */
    export class RecordTipView extends BaseView {

        public readonly mediatorName: string = RecordTipViewMediator.NAME;
        /** 显示层级 */
        public readonly viewLayer: FL.ViewLayerEnum = ViewLayerEnum.TOOLTIP_BOTTOM;

        /** 音量图片 */
        public volumeImg:eui.Image;

        /** 开始录音动作Id */
        public readonly startRecordActionId:number;

        public constructor(startRecordActionId:number) {
            super();
            this.startRecordActionId = startRecordActionId;
            this.touchEnabled = false;
            this.left = this.right = this.top = this.bottom = 0;
            this.skinName = "skins.RecordTipViewSkin";
        }

        protected childrenCreated():void {
            super.childrenCreated();
            //注册pureMvc
            MvcUtil.regMediator( new RecordTipViewMediator(this) );
        }

    }
}