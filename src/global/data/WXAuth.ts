module FL {
    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase - WXAuth
     * @Description:  //微信授权信息
     * @Create: DerekWu on 2017/12/27 9:40
     * @Version: V1.0
     */
    export class WXAuth {
        public readonly unionId: string;
        public readonly loginAuthCode: string;
        public readonly timeStamp: number;
        public readonly loginToken: string;
        public readonly openId: string;
        public readonly nickname: string;
        public readonly sex: string;
        public readonly headimgurl: string;
    }

    /**
     * 微信头像尺寸
     */
    export enum WXHeadSize {
        //用户头像，最后一个数值代表正方形头像大小（有0、46、64、96、132数值可选，0代表640*640正方形头像），用户没有头像时该项为空。若用户更换头像，原有头像URL将失效。
        S46 = 46,
        S64 = 64,
        S96 = 96,
        S132 = 132,
        S640 = 0
    }

    /**
     * 微信图片设置
     */
    export class WXHeadImgSetting {
        /** 头像图片 */
        public readonly headImg: eui.Image;
        /** 头像的Url */
        public readonly headUrl: string;
        /** 头像遮罩所在的父容器，有遮罩的时候才使用 */
        public readonly headPrent: egret.DisplayObjectContainer;
        /** 圆形遮罩的xy坐标和半径 */
        public readonly maskPosX: number;
        public readonly maskPosY: number;
        public readonly maskRadius: number;

        constructor(headImg: eui.Image, headUrl: string, headPrent?: egret.DisplayObjectContainer, maskPosX?: number, maskPosY?: number, maskRadius?: number) {
            this.headImg = headImg;
            this.headUrl = headUrl;
            if (headPrent) {
                this.headPrent = headPrent;
                this.maskPosX = maskPosX;
                this.maskPosY = maskPosY;
                this.maskRadius = maskRadius;
            }
        }

        public startLoadingHeadImg(): void {
            GWXAuth.get(this.headUrl, null, this.loadHeadImgOver, this);
        }

        public loadHeadImgOver(e): void {
            let request = e.currentTarget;
            this.setHeadImgDate(request.response);
            //设置到缓存
            GWXAuth.setWXHeadDataToCache(this.headUrl, request.response);
        }

        public setHeadImgDate(base64ImgStr: string): void {
            if (base64ImgStr) {
                let self = this;
                self.headImg.source = base64ImgStr;
                if (self.headPrent) { //需要遮罩的情况
                    //画一个遮罩
                    let circle: egret.Shape = new egret.Shape();
                    circle.graphics.beginFill(0xffffff);
                    circle.graphics.drawCircle(self.maskPosX, self.maskPosY, self.maskRadius);
                    circle.graphics.endFill();
                    self.headPrent.addChild(circle);
                    self.headImg.mask = circle;
                }
            }
        }
    }

    export class GWXAuth {

        /** 微信授权信息 */
        public static readonly WXAuth: WXAuth = new WXAuth();
        /** 微信头像数据 */
        public static readonly WX_HEAD_DATA_MAP: { [key: string]: string } = {};


        /**
         * 设置矩形跨域头像
         * @param {eui.Image} headImg
         * @param {string} headUrl
         * @param {FL.WXHeadSize} headSize
         */
        public static setRectCrossDomainImg(headImg: eui.Image, headUrl: string): void {
            if (Game.CommonUtil.isNative) {
                headImg.source = headUrl;
                return;
            }
            //生成请求的Url
            let vHeadImgUrl: string = this.genCrossDomainHeadUrl(headUrl);
            let vImageData: string = this.getWXHeadDataFromCache(vHeadImgUrl);
            if (vImageData) {
                headImg.source = vImageData;
            } else {
                //没有则加载
                let vWXHeadImgSetting: WXHeadImgSetting = new WXHeadImgSetting(headImg, vHeadImgUrl);
                vWXHeadImgSetting.startLoadingHeadImg();
            }
        }

        /**
         * 设置矩形微信头像
         * @param {eui.Image} headImg
         * @param {string} headUrl
         * @param {MyCallBack} pIsCanSetCall 针对异步加载完成时使用
         * @param {FL.WXHeadSize} headSize
         */
        public static setRectWXHeadImg(headImg: eui.Image, headUrl: string, pIsCanSetCall?: MyCallBack, headSize?: WXHeadSize): void {
            if (Game.CommonUtil.isNative) {
                if (!headUrl || headUrl.indexOf("/") == -1) {
                    return;
                }
                //生成请求的Url
                let vHeadImgUrl: string = this.getRealWXHeadBaseUrl(headUrl, headSize);
                //先从缓存找
                let vImageData: egret.BitmapData = this.getHeadFromCacheNative(vHeadImgUrl);
                if (!vImageData) {

                    RES.getResByUrl(vHeadImgUrl, (data, url)=>{
                        ImgGCManager.setCacheImgDataByUrl(vHeadImgUrl, data)
                        // 是否可以设值
                        if (pIsCanSetCall) {
                            let vIsCanSet: boolean = pIsCanSetCall.apply();
                            if (vIsCanSet) {
                                headImg.bitmapData = data;
                            }
                        } else {
                            headImg.bitmapData = data;
                        }
                    }, this, RES.ResourceItem.TYPE_IMAGE);

                    // //创建 URLLoader 对象
                    // let vTempLoader:egret.URLLoader = new egret.URLLoader();
                    // //设置加载方式为纹理
                    // // vTempLoader.dataFormat = egret.URLLoaderDataFormat.TEXTURE;
                    // vTempLoader.dataFormat = egret.URLLoaderDataFormat.BINARY;
                    // //添加加载完成侦听
                    // vTempLoader.addEventListener(egret.Event.COMPLETE, (event:egret.Event) => {
                    //     egret.log("# vTempLoader onLoadComplete");
                    //     let vTempLoader2:egret.URLLoader = <egret.URLLoader>event.target;
                    //     //获取加载到的纹理对象
                    //     // let vTempTexture:egret.Texture = <egret.Texture>vTempLoader2.data;
                    //     // ImgGCManager.setCacheImgDataByUrl(vHeadImgUrl, vTempTexture.bitmapData);
                    //     let vTempByteArray:egret.ByteArray = <egret.ByteArray>vTempLoader2.data;
                    //     let vTempBitmapData: egret.BitmapData = egret.BitmapData.create("arraybuffer", vTempByteArray.buffer);
                    //     ImgGCManager.setCacheImgDataByUrl(vHeadImgUrl, vTempBitmapData);
                    //     // 是否可以设值
                    //     if (pIsCanSetCall) {
                    //         let vIsCanSet: boolean = pIsCanSetCall.apply();
                    //         if (vIsCanSet) {
                    //             headImg.bitmapData = vTempBitmapData;
                    //         }
                    //     } else {
                    //         headImg.bitmapData = vTempBitmapData;
                    //     }
                    // }, this);
                    // //添加加载失败侦听
                    // // vTempLoader.addEventListener(egret.IOErrorEvent.IO_ERROR, this.onLoadError, this);
                    // let vTempRequest:egret.URLRequest = new egret.URLRequest(vHeadImgUrl);
                    // //开始加载
                    // vTempLoader.load(vTempRequest);

                    // let vHttpRequest = new egret.HttpRequest();
                    // vHttpRequest.responseType = egret.HttpResponseType.ARRAY_BUFFER;
                    // vHttpRequest.open(vHeadImgUrl, egret.HttpMethod.GET);
                    // vHttpRequest.addEventListener(egret.Event.COMPLETE,(event:egret.Event) => {
                    //     let vTempHttpRequest = <egret.HttpRequest>event.currentTarget;
                    //     let vTempByteArray:egret.ByteArray = <egret.ByteArray>vTempHttpRequest.response;
                    //     let vTempBitmapData: egret.BitmapData = egret.BitmapData.create("arraybuffer", vTempByteArray.buffer);
                    //     ImgGCManager.setCacheImgDataByUrl(vHeadImgUrl, vTempBitmapData);
                    //     // 是否可以设值
                    //     if (pIsCanSetCall) {
                    //         let vIsCanSet: boolean = pIsCanSetCall.apply();
                    //         if (vIsCanSet) {
                    //             headImg.bitmapData = vTempBitmapData;
                    //         }
                    //     } else {
                    //         headImg.bitmapData = vTempBitmapData;
                    //     }
                    // },this);
                    // vHttpRequest.send();
                }
                headImg.bitmapData = vImageData;
                return;
            }

            //生成请求的Url
            let vHeadImgUrl: string = this.genWXHeadUrl(headUrl, headSize);
            let vImageData: string = this.getWXHeadDataFromCache(vHeadImgUrl);
            if (vImageData) {
                headImg.source = vImageData;
            } else {
                //没有则加载
                let vWXHeadImgSetting: WXHeadImgSetting = new WXHeadImgSetting(headImg, vHeadImgUrl);
                vWXHeadImgSetting.startLoadingHeadImg();
            }
        }

        /**
         * 设置圆形遮罩微信头像
         * @param {eui.Image} headImg
         * @param {string} headUrl
         * @param {egret.DisplayObjectContainer} headPrent
         * @param {number} maskPosX
         * @param {number} maskPosY
         * @param {number} maskRadius
         * @param {FL.WXHeadSize} headSize
         */
        public static setCircleWXHeadImg(headImg: eui.Image, headUrl: string, headPrent: egret.DisplayObjectContainer, maskPosX: number, maskPosY: number, maskRadius: number, headSize?: WXHeadSize): void {
            if (Game.CommonUtil.isNative) {
                if (!headUrl || headUrl.indexOf("/") == -1) {
                    return;
                }
                //生成请求的Url
                let vHeadImgUrl: string = this.getRealWXHeadBaseUrl(headUrl, headSize);
                //先从缓存找
                let vImageData: egret.BitmapData = this.getHeadFromCacheNative(vHeadImgUrl);
                if (!vImageData) {

                    RES.getResByUrl(vHeadImgUrl, (data, url)=>{
                        headImg.bitmapData = data;
                        ImgGCManager.setCacheImgDataByUrl(vHeadImgUrl, data)
                    }, this, RES.ResourceItem.TYPE_IMAGE);

                    // //创建 URLLoader 对象
                    // let vTempLoader:egret.URLLoader = new egret.URLLoader();
                    // //设置加载方式为纹理
                    // // vTempLoader.dataFormat = egret.URLLoaderDataFormat.TEXTURE;
                    // vTempLoader.dataFormat = egret.URLLoaderDataFormat.BINARY;
                    // //添加加载完成侦听
                    // vTempLoader.addEventListener(egret.Event.COMPLETE, (event:egret.Event) => {
                    //     egret.log("# vTempLoader onLoadComplete");
                    //     let vTempLoader2:egret.URLLoader = <egret.URLLoader>event.target;
                    //     //获取加载到的纹理对象
                    //     // let vTempTexture:egret.Texture = <egret.Texture>vTempLoader2.data;
                    //     //获取加载到的纹理对象
                    //     // let vTempTexture:egret.Texture = <egret.Texture>vTempLoader2.data;
                    //     // ImgGCManager.setCacheImgDataByUrl(vHeadImgUrl, vTempTexture.bitmapData);
                    //     let vTempByteArray:egret.ByteArray = <egret.ByteArray>vTempLoader2.data;
                    //     let vTempBitmapData: egret.BitmapData = egret.BitmapData.create("arraybuffer", vTempByteArray.buffer);
                    //     // ImgGCManager.setCacheImgDataByUrl(vHeadImgUrl, vTempBitmapData);
                    //     headImg.bitmapData = vTempBitmapData;
                    //     ImgGCManager.setCacheImgDataByUrl(vHeadImgUrl, vTempBitmapData);
                    // }, this);
                    // //添加加载失败侦听
                    // // vTempLoader.addEventListener(egret.IOErrorEvent.IO_ERROR, this.onLoadError, this);
                    // let vTempRequest:egret.URLRequest = new egret.URLRequest(vHeadImgUrl);
                    // //开始加载
                    // vTempLoader.load(vTempRequest);

                }
                headImg.bitmapData = vImageData;
                //画一个遮罩
                let circle: egret.Shape = new egret.Shape();
                circle.graphics.beginFill(0xffffff);
                circle.graphics.drawCircle(maskPosX, maskPosY, maskRadius);
                circle.graphics.endFill();
                headPrent.addChild(circle);
                headImg.mask = circle;
                return;
            }

            //生成请求的Url
            let vHeadImgUrl: string = this.genWXHeadUrl(headUrl, headSize);
            //生成
            let vWXHeadImgSetting: WXHeadImgSetting = new WXHeadImgSetting(headImg, vHeadImgUrl, headPrent, maskPosX, maskPosY, maskRadius);
            //先从缓存中找
            let vImageData: string = this.getWXHeadDataFromCache(vHeadImgUrl);
            if (vImageData) {
                vWXHeadImgSetting.setHeadImgDate(vImageData);
            } else {
                //没有则加载
                vWXHeadImgSetting.startLoadingHeadImg();
            }
        }

        /**
         * 从缓存中获取微信头像数据
         * @param {string} wxHeadUrl
         * @returns {string}
         */
        public static getWXHeadDataFromCache(wxHeadUrl: string): string {
            return ImgGCManager.getCacheImgDataByUrl(wxHeadUrl);
            // return this.WX_HEAD_DATA_MAP[wxHeadUrl];
        }

        public static getHeadFromCacheNative(wxHeadUrl: string): egret.BitmapData {
            return ImgGCManager.getCacheImgDataByUrl(wxHeadUrl);
        }

        /**
         * 设置微信头像数据到缓存
         * @param {string} wxHeadUrl
         * @param {string} headImgBase64Data
         */
        public static setWXHeadDataToCache(wxHeadUrl: string, headImgBase64Data: string): void {
            if (wxHeadUrl && headImgBase64Data && !this.WX_HEAD_DATA_MAP[wxHeadUrl]) {
                this.WX_HEAD_DATA_MAP[wxHeadUrl] = headImgBase64Data;
                ImgGCManager.setCacheImgDataByUrl(wxHeadUrl, headImgBase64Data);
            }
        }

        /**
         * 生成微信头像URL
         * @param {string} baseUrl
         * @param {FL.WXHeadSize} headSize
         * @returns {string}
         */
        public static genWXHeadUrl(baseUrl: string, headSize?: WXHeadSize): string {
            // if (!headSize && headSize !== WXHeadSize.S640) {
            //     headSize = WXHeadSize.S96;
            // }
            // let vLastIndex: number = baseUrl.lastIndexOf("/");
            let vNewHeadUrl: string = this.getRealWXHeadBaseUrl(baseUrl, headSize);
            // egret.log(vNewHeadUrl);
            return GConf.Conf.wxHeadImgUrl + "?headUrl=" + encodeURIComponent(vNewHeadUrl);
            // return "http://test.sjfc08.com/aiyoule/h5/wxHeadImg?headUrl="+encodeURIComponent(vNewHeadUrl);
        }

        /**
         * 获得微信头像的尺寸大小
         */
        public static getRealWXHeadBaseUrl(baseUrl: string, headSize?: WXHeadSize): string {
            let vLastIndex: number = baseUrl.lastIndexOf("/");
            let residueStr: string = baseUrl.substr(vLastIndex, baseUrl.length);
            if (residueStr.length > 5) {
                console.log("XL HEADIMG");
                return baseUrl;
            }
            else {
                if (!headSize && headSize !== WXHeadSize.S640) {
                    headSize = WXHeadSize.S96;
                }
                
                let data = baseUrl.substr(0, vLastIndex) + "/" + headSize;
                return data;
            }
        }

        /**
         * 生成跨域图片URL
         * @param {string} baseUrl
         * @returns {string}
         */
        public static genCrossDomainHeadUrl(baseUrl: string): string {
            return GConf.Conf.wxHeadImgUrl + "?headUrl=" + encodeURIComponent(baseUrl);
        }

        //发送post请求
        public static post(url: string, data?: any, success?: Function, thisObject?: any, error?: Function): void {

            let request = new egret.HttpRequest();
            request.responseType = egret.HttpResponseType.TEXT;
            request.open(url, egret.HttpMethod.POST);
            request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            if (data) {
                let param = this.changeUrlCode(data);
                request.send(param);
            }
            else {
                request.send();
            }
            if (success) request.addEventListener(egret.Event.COMPLETE, success, thisObject);
            if (error) request.addEventListener(egret.IOErrorEvent.IO_ERROR, error, thisObject);

        }

        //发送get请求
        public static get(url: string, data?: any, success?: Function, thisObject?: any, error?: Function): void {

            let request = new egret.HttpRequest();
            request.responseType = egret.HttpResponseType.TEXT;
            if (data) {
                let param = this.changeUrlCode(data);
                request.open(url + "?" + param, egret.HttpMethod.GET);
            }
            else {
                request.open(url, egret.HttpMethod.GET);
            }

            request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            request.send();
            if (success) request.addEventListener(egret.Event.COMPLETE, success, thisObject);
            if (error) request.addEventListener(egret.IOErrorEvent.IO_ERROR, error, thisObject);
        }

        private static changeUrlCode(param: Object): string {
            if (!param) return null;
            let str = "";
            for (let key in param) {
                str += key + "=" + param[key] + "&";
            }
            return str.substr(0, str.length - 1);
        }

    }

    /**
     * 首页进度条
     */
    export class IndexProxy {

        /** 是否删除初始显示 */
        private static _isRemoveInitView: boolean = false;

        /**
         * 设置首页进度条
         * @param {number} addValue
         */
        public static setIndexProgress(currNum: number, totalNum: number) {
            if (window["loadingScriptProgress"]) {
                window["loadingScriptProgress"](currNum, totalNum);
            }
        }

        /**
         * 删除初始显示
         */
        public static removeInitView() {
            if (!this._isRemoveInitView) {
                egret.log("66666");
                if (window["delMyLoading"]) {
                    egret.log("77777");
                    window["delMyLoading"]();
                }
                this._isRemoveInitView = true;
            }
        }

    }

}