module FL {
    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase - ImgGCManager
     * @Description: //图片数据缓存回收管理器
     * @Create: HoyeLee on 2018/3/19 14:45
     * @Version: V1.0
     */
    // export class ImgGCManager {
    //     public static Cache_Queue = [];//缓存队列，只要有使用key对应数据，则该key放入缓存队列中
    //     public static GC_Queue = [];//回收队列，从本地缓存中一开始取出的数据，对应key全部放入回收队列中
    //     //如果key在缓存队列中，则最终缓存队列中所有的key对应的图片数据都将缓存到本地
    //     //如果key在回收队列中，则最终回收队列中所有的key对应的图片数据都将从缓存中清除

    //     public static readonly CIRCLE_TIME = 10000;//自动缓存时间
    //     public static readonly LIMIT_NUM = 1000;//限制可缓存的最终个数，如果超出，则按照Cache队列的先进先出顺序缓存

    //     public static pushCache(key: string) {
    //         ImgGCManager.Cache_Queue.push(key);
    //     }

    //     public static clearGC() {
    //         ImgGCManager.GC_Queue.forEach(x => {
    //             CacheImgData.clearCacheImgDataByKey(x);
    //         });
    //         ImgGCManager.GC_Queue = [];
    //     }

    //     public static clearCache() {
    //         ImgGCManager.Cache_Queue = [];
    //     }

    //     public static setCacheImgDataByKey(key: string, data: any) {
    //         ImgGCManager.pushCache(key);
    //         CacheImgData.setCacheImgDataByKey(key, data);
    //     }

    //     /**
    //      * 获取缓存图片数据，只要是从此获取的，则该数据就放入缓存队列
    //      */
    //     public static getCacheImgDataByKey(key: string) {
    //         let data;
    //         let isCache = false;
    //         for (let i = 0; i < ImgGCManager.Cache_Queue.length; i++) {
    //             if (ImgGCManager.Cache_Queue[i] == key) {
    //                 data = CacheImgData.getCacheImgDataByKey(key);
    //                 isCache = true;
    //                 break;
    //             }
    //         }
    //         if (!isCache) {
    //             let isNew = true;
    //             for (let i = 0; i < ImgGCManager.GC_Queue.length; i++) {
    //                 if (ImgGCManager.GC_Queue[i] == key) {
    //                     ImgGCManager.GC_Queue.splice(i, 1);
    //                     data = CacheImgData.getCacheImgDataByKey(key);
    //                     ImgGCManager.pushCache(key);
    //                     isNew = false;
    //                     break;
    //                 }
    //             }
    //         }
    //         return data;
    //     }

    //     public static isCacheOverflow() {
    //         if (ImgGCManager.Cache_Queue.length > ImgGCManager.LIMIT_NUM) {
    //             let overflow_num = ImgGCManager.Cache_Queue.length - ImgGCManager.LIMIT_NUM;
    //             for (let i = ImgGCManager.LIMIT_NUM - 1; i < ImgGCManager.Cache_Queue.length; i++) {
    //                 CacheImgData.clearCacheImgDataByKey(ImgGCManager.Cache_Queue[i]);
    //             }
    //         }
    //     }

    //     public static saveCache() {
    //         CacheImgData.clearCacheImgData();//清除localstorage
    //         ImgGCManager.clearGC();//清除GC缓存
    //         ImgGCManager.isCacheOverflow();//缓存是否溢出
    //         CacheImgData.setCacheImgData(CacheImgData.ImgDataMap);
    //     }

    //     public static initGCQueue() {
    //         CacheImgData.init();
    //         for (let key in CacheImgData.ImgDataMap) {
    //             if (key) ImgGCManager.pushCache(key);
    //         }
    //     }

    //     public static init() {
    //         // ImgGCManager.initGCQueue();
    //         // egret.setInterval(ImgGCManager.saveCache, ImgGCManager, ImgGCManager.CIRCLE_TIME);

    //         localStorage.setItem('ImgData1', "1");
    //         localStorage.setItem('ImgData2', "2");
    //         localStorage.setItem('ImgData3', "3");
    //         localStorage.setItem('ImgData4', "4");
    //         localStorage.setItem('ImgData44', "44");

    //         for(let i in localStorage){
    //             console.log(i);
    //         }
    //     }
    // }
    export class ImgGCManager {
        public static ImgKeyMap: Game.SortMap<string> = null;
        public static ImgDataMap: { [key: string]: egret.BitmapData } = {};
        public static CACHE_NUM = 0;//当前缓存数量
        public static readonly LIMIT_NUM = 500;

        public static _Storage: any = null;

        /**
         * 根据url设置本地图片缓存数据
         * @param {string} url
         * @param data
         */
        public static setCacheImgDataByUrl(url: string, data: any) {
            if (Game.CommonUtil.isNative) {
                //原生环境下存到内存
                this.ImgDataMap[url] = data;
                return;
            }
            if (ImgGCManager.CACHE_NUM >= ImgGCManager.LIMIT_NUM) {
                let keyName = ImgGCManager.ImgKeyMap.getByIndex(0);
                let _str = HtmlTextParserUtil.splStringBySeparetor(keyName, "|&|");
                let url = _str[1];
                ImgGCManager._Storage.removeItem(keyName);
                ImgGCManager.ImgKeyMap.remove(url);
            }
            let keyName = new Date().getTime() + "|&|" + url + "|&|image";
            ImgGCManager.ImgKeyMap.put(url, keyName);
            ImgGCManager.CACHE_NUM = ImgGCManager.ImgKeyMap.getSize();
            ImgGCManager._Storage.setItem(keyName, data);

        }

        /**
         * 根据url获取本地图片缓存数据
         * @param {string} url
         * @returns {any}
         */
        public static getCacheImgDataByUrl(url: string) {
            let data;
            if (Game.CommonUtil.isNative) {
                //原生环境
                return ImgGCManager.ImgDataMap[url];
            }
            if (ImgGCManager.ImgKeyMap.get(url)) {
                let keyName = ImgGCManager.ImgKeyMap.get(url);
                data = ImgGCManager._Storage.getItem(keyName);
            }
            return data;
        }

        /**
         * 初始化本地图片已缓存数据查询关键字map
         * @param {string} key
         * @returns {Game.SortMap<string>}
         */
        public static initImgKeyMap(key: string) {
            let num = 0;
            let sm = new Game.SortMap<string>();
            for (let keyName in ImgGCManager._Storage) {
                if (keyName.indexOf(key) > 0) {
                    num++;
                    let _str = HtmlTextParserUtil.splStringBySeparetor(keyName, "|&|");
                    let url = _str[1];
                    sm.put(url, keyName);
                }
            }
            ImgGCManager.ImgKeyMap = sm;
            ImgGCManager.CACHE_NUM = num;
            return ImgGCManager.ImgKeyMap;
        }

        /**
         * 初始化本地图片数据资源管理器
         */
        public static init() {
            if (Game.CommonUtil.isNative) {
                ImgGCManager._Storage = egret.localStorage;
                this.ImgDataMap = {};
                return;
            } else {
                ImgGCManager._Storage = localStorage;
            }
            ImgGCManager.initImgKeyMap("image");
        }
    }
}