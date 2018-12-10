module FL {

    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase - ReqLoadingView
     * @Description:  //请求服务器Loading界面
     * @Create: DerekWu on 2017/11/20 20:03
     * @Version: V1.0
     */
    export class ReqLoadingView extends BaseView {

        private static _only:ReqLoadingView;

        public readonly mediatorName: string = "";
        /** 显示层级 */
        public readonly viewLayer: FL.ViewLayerEnum = ViewLayerEnum.TOOLTIP_BOTTOM;

        /** 延时2000毫秒显示 */
        public laterTimes:number = 5000;

        /** loading图片 animal_1_png animal_2_png animal_3_png animal_4_png */
        private _loadingImg:eui.Image;
        private _currImgIndex:number = 1;

        /** 是否显示，显示Id */
        private _isView:boolean = false;
        private _viewId:number = 1;

        private _loadingText:eui.Label;

        /** 透明遮罩 */
        private _transparentMask: eui.Group;

        private constructor() {
            super();
            this.touchEnabled = true;
            // this.touchChildren = false;
            this.left = this.right = this.top = this.bottom = 0;
            this.initView();
        }

        public static getInstance(): ReqLoadingView {
            if (!this._only) {
                this._only = new ReqLoadingView();
            }
            this._only.laterTimes = 5000;
            this._only._loadingText.text = "努力加载中...";
            return this._only;
        }

        /**
         * 重置延迟显示时间和文字
         * @param {number} laterTimes
         * @param {string} loadingText
         */
        public resetLaterTimesAndText(laterTimes: number , loadingText: string): void {
            this.laterTimes = 0;
            this._loadingText.text = loadingText;
        }

        /**
         * 初始化界面
         */
        private initView():void {
            let self = this;


            // let vRect:eui.Rect = new eui.Rect();
            // vRect.fillColor = 0x000000;
            // vRect.fillAlpha = 0.33;
            // vRect.left = vRect.right = vRect.top = vRect.bottom = 0;
            // vRect.touchEnabled = true;
            let vOneShadeRect:eui.Image = new eui.Image();
            vOneShadeRect.source = GConf.Conf.loadingShadeRes;
            vOneShadeRect.touchEnabled = true;
            vOneShadeRect.top = vOneShadeRect.bottom = vOneShadeRect.left = vOneShadeRect.right = -50;
            vOneShadeRect.alpha = 0.33;
            self.addChild(vOneShadeRect);

            let vLoadingImg:eui.Image = new eui.Image();
            vLoadingImg.source = "animal_1_png";
            vLoadingImg.horizontalCenter = 0, vLoadingImg.verticalCenter = -50;
            vLoadingImg.touchEnabled = false;
            self._loadingImg = vLoadingImg;
            self.addChild(vLoadingImg);

            let vLoadingText:eui.Label = new eui.Label("努力加载中...");
            vLoadingText.horizontalCenter = 15, vLoadingText.verticalCenter = 30;
            vLoadingText.textColor = 0xffffff;
            vLoadingText.fontFamily = "SimHei";
            vLoadingText.touchEnabled = false;
            vLoadingText.size = 30;
            self._loadingText = vLoadingText;
            self.addChild(self._loadingText);

            // 透明遮罩
            let vTransparentMask: eui.Group = new eui.Group();
            vTransparentMask.left = vTransparentMask.right = vTransparentMask.top = vTransparentMask.bottom = 0;
            vTransparentMask.touchEnabled = true;
            vTransparentMask[ViewEnum.viewLayer] = ViewLayerEnum.TOOLTIP_BOTTOM;
            self._transparentMask = vTransparentMask;

            self.addEventListener(egret.Event.ADDED_TO_STAGE , self.onAddToStagexxx, self);
            self.addEventListener(egret.Event.REMOVED_FROM_STAGE , self.onRemovedFromStagexxx, self);
        }

        /** 添加到界面以后框架自动调用 */
        protected onAddToStagexxx():void {
            Game.GameDrive.getInstance().addEventListener(Game.GameEvent.AI_LOGIC, this.playAnima, this);
            this._isView = true;
            // if (this._transparentMask && !this._transparentMask.parent) {
                MvcUtil.addView(this._transparentMask);
            // }
            egret.log("# ReqLoadingView onAddToStagexxx");
        }

        /** 从界面上移除以后框架自动调用 */
        protected onRemovedFromStagexxx():void {
            // if (Game.GameDrive.getInstance().hasEventListener(Game.GameEvent.AI_LOGIC)) {
            Game.GameDrive.getInstance().removeEventListener(Game.GameEvent.AI_LOGIC, this.playAnima, this);
            // }
            this._isView = false;
            MvcUtil.delView(this._transparentMask);
            // if (this._transparentMask && this._transparentMask.parent) {
            //     ViewUtil.removeChild(this._transparentMask.parent, this._transparentMask);
            // }
            // MvcUtil.delView(this._transparentMask);
            egret.log("# ReqLoadingView onRemovedFromStagexxx");
        }

        /**
         * 播放动画
         * @param {egret.Event} e
         */
        private playAnima(e:egret.Event):void {
            let self = this;
            self._currImgIndex++;
            if (self._currImgIndex > 4) {
                self._currImgIndex = 1;
            }
            self._loadingImg.source = "animal_"+self._currImgIndex+"_png";
            // egret.log("playAnima self._currImgIndex="+self._currImgIndex);
        }

        /**
         * 显示加载进度
         * @param {number} current 当前进度值
         * @param {number} total   总值
         */
        public showLoadingProgress(current:number,total:number):void {
            let self = this;
            let percentage:number = Math.round(current/total*100);
            self._loadingText.text = "已加载"+ percentage +"%";
        }

        /**
         * 是否在显示中
         * @returns {boolean}
         */
        // public isView():boolean {
        //     return this._isView;
        // }

        /**
         * 获得显示Id
         * @returns {number}
         */
        public getViewId():number {
            return this._viewId;
        }

        /**
         * 生成新的显示Id
         * @returns {number}
         */
        public genNewViewId():number {
            return ++this._viewId;
        }

    }
}