module FL {

	export class FullSameRatioImage extends eui.Component {

		/** 图片名字，宽度，高度 */
        private readonly _imgName:string; 
		private readonly _imgWidth:number;
		private readonly _imgHeight:number;

		/** 背景图片 */
		public readonly bgImg:eui.Image = new eui.Image();

		/** 基准对象，以这个对象的尺寸为基准铺满 */
		// private readonly _baseObj:egret.DisplayObject;

		/**
		 * 构造
		 * @param pImgName 图片资源名字
		 * //
		 */
		constructor(pImgName:string) {
			super(); 
			this._imgName = pImgName;
			let vTexture:egret.Texture = RES.getRes(pImgName);
			this._imgWidth = vTexture.textureWidth;
			this._imgHeight = vTexture.textureHeight;
			this.touchEnabled = false;
			this.touchChildren = false;
			this.left = this.right = this.top = this.bottom = 0;
			this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddedToStage, this);
			this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onRemoveFromStage, this);
			this.bgImg.source = this._imgName; 
			this.addChild(this.bgImg); 
			// if (pBaseObj) {
			// 	this._baseObj = pBaseObj;
			// } else {
			// 	this._baseObj = egret.MainContext.instance.stage;
			// }
		}

		/**
		 * 添加到舞台事件
		 */
		private onAddedToStage(event:egret.Event):void {
			// egret.log("FullSameRatioImage onAddedToStage");
			// this.stage.addEventListener(egret.Event.RESIZE, this.onResize, this);
			this.addEventListener(egret.Event.RESIZE, this.onResize, this);
			this.onResize();
		}

		/**
		 * 从舞台移除事件
		 */
		private onRemoveFromStage(event:egret.Event):void {
			// egret.log("FullSameRatioImage onRemoveFromStage");
			// this.stage.removeEventListener(egret.Event.RESIZE, this.onResize, this);
			this.removeEventListener(egret.Event.RESIZE, this.onResize, this);
		}

		/**
		 * 设置图片大小 
		 */
		public onResize():void {

			//获得full的尺寸
			let vFullWidth:number, vFullHeight:number;
			// if (this._baseObj instanceof egret.Stage) {
			// 	vFullWidth = this._baseObj.stageWidth;
			// 	vFullHeight = this._baseObj.stageHeight;
			// } else {
			// 	vFullWidth = this._baseObj.width;
			// 	vFullHeight = this._baseObj.height;
			// }
			vFullWidth = this.width;
			vFullHeight = this.height; 
			// egret.log("vFullWidth="+vFullWidth+"  vFullHeight="+vFullHeight);
			//获得舞台尺寸大小 
			// let vStage:egret.Stage = egret.MainContext.instance.stage;
			//获得内容的屏幕尺寸大小，index.html中配置的尺寸
			// let vPlayerOption:PlayerOption = (<any>vStage.$screen).playerOption;

			//临时宽高
			let vTempImgWidth:number = vFullWidth;
			let vTempImgHeight:number = vFullHeight;
			//获得宽高比例
			let vWidthRatio:number =  vFullWidth / this._imgWidth;
			let vHeightRatio:number = vFullHeight / this._imgHeight;
			//计算真实宽高
			if (vWidthRatio > vHeightRatio) {
				vTempImgHeight = this._imgHeight * vWidthRatio;
			} else if (vHeightRatio > vWidthRatio) {
				vTempImgWidth = this._imgWidth * vHeightRatio;
			}
			//设置宽高
			this.bgImg.width = vTempImgWidth;
			this.bgImg.height = vTempImgHeight;
			if (vTempImgWidth == vFullWidth) {
				this.bgImg.x = 0;
			} else {
				this.bgImg.x = Math.ceil(-(vTempImgWidth - vFullWidth)/2);
			}
			if (vTempImgHeight == vFullHeight) {
				this.bgImg.y = 0;
			} else {
				this.bgImg.y = Math.ceil(-(vTempImgHeight - vFullHeight)/2);
			}

		}

	}
	
}