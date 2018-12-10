module FL {
    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase - CacheImgData
     * @Description:  //图片数据本地缓存
     * @Create: HoyeLee on 2018/3/19 11:20
     * @Version: V1.0
     */
    // export interface IImgData {
    //     key: string;//资源查询关键字
    //     data: any;//资源数据
    // }

    // /**
    //  * 图片数据本地缓存
    //  */
    // export class CacheImgData {
    //     public static ImgDataMap = null;//图像资源

    //     /**
    //      * 初始化
    //      */
    //     public static init() {
    //         CacheImgData.getCacheImgData();
    //     }

    //     /**
    //      * 设置图片数据缓存
    //      * @param {any} data
    //      */
    //     public static setCacheImgData(data: any) {
    //         CacheImgData.ImgDataMap = data;
    //         let _data = JSON.stringify(data);
    //         // let unionId = GWXAuth.WXAuth.unionId;
    //         let unionId = (<any>FL.GWXAuth).WXAuth.unionId;
    //         if (!unionId) {
    //             console.log('noexist unionId');
    //             return;
    //         }
    //         localStorage.setItem('ImgData_' + unionId, _data);
    //     }

    //     /**
    //      * 根据关键字设置图片数据缓存
    //      * @param {string} key
    //      * @param {any} data
    //      */
    //     public static setCacheImgDataByKey(key: string, data: any) {
    //         CacheImgData.ImgDataMap[key] = data;
    //     }

    //     /**
    //      * 获取图片数据缓存
    //      * @returns {any}
    //      */
    //     public static getCacheImgData() {
    //         if (CacheImgData.ImgDataMap) {
    //             return CacheImgData.ImgDataMap;
    //         }
    //         let unionId = (<any>FL.GWXAuth).WXAuth.unionId;
    //         if (!unionId) {
    //             console.log('noexist unionId');
    //             CacheImgData.ImgDataMap = {};
    //             return CacheImgData.ImgDataMap;
    //         }
    //         let _data = localStorage.getItem('ImgData_' + unionId);
    //         if (!_data) {
    //             console.log('noexist imgdata');
    //             CacheImgData.ImgDataMap = {};
    //             return CacheImgData.ImgDataMap;
    //         }
    //         CacheImgData.ImgDataMap = JSON.parse(_data);
    //         return CacheImgData.ImgDataMap;
    //     }

    //     /**
    //      * 根据关键字获取对应图片数据缓存
    //      * @param {string} key
    //      * @returns {any}
    //      */
    //     public static getCacheImgDataByKey(key: string) {
    //         let _data;
    //         if (!CacheImgData.ImgDataMap) {
    //             // let unionId = GWXAuth.WXAuth.unionId;
    //             let unionId = (<any>FL.GWXAuth).WXAuth.unionId;
    //             if (!unionId) {
    //                 console.log('noexist unionId');
    //                 return;
    //             }
    //             let _imgData = localStorage.getItem('ImgData_' + unionId);
    //             let _data = JSON.parse(_imgData);
    //             CacheImgData.ImgDataMap = _data;
    //         } else {
    //             _data = CacheImgData.ImgDataMap;
    //         }
    //         if (!_data) {
    //             console.log("noexist cache imgdata");
    //             return;
    //         }
    //         if (!_data[key]) {
    //             console.log("noexist cache imgdata for the key" + key);
    //             return;
    //         }
    //         return _data[key];
    //     }

    //     /**
    //      * 清除图片数据缓存
    //      */
    //     public static clearCacheImgData() {
    //         // let unionId = GWXAuth.WXAuth.unionId;
    //         let unionId = (<any>FL.GWXAuth).WXAuth.unionId;
    //         if (!unionId) {
    //             console.log('noexist unionId');
    //             return;
    //         }
    //         localStorage.removeItem('ImgData_' + unionId);
    //     }

    //     public static clearCacheImgDataByKey(key: string) {
    //         if (CacheImgData.ImgDataMap[key]) delete CacheImgData.ImgDataMap[key];
    //     }
    // }
}