module FL {
    import a = Game.a;

    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase - LobbyHandler
     * @Description:  //大厅Handler
     * @Create: DerekWu on 2018/1/5 19:41
     * @Version: V1.0
     */
    export class LobbyHandler {

        // public getShareGainDiamondConfig():SystemConfigPara {
        //     let shareGainDiamondConfig:SystemConfigPara = this.getOneClientConfig(GameConfigConstant.CONF_SHARE_GAIN_DIAMOND);
        //     return null;
        // }

        /**
         * 获得一个客户端配置
         * @param {number} paraId
         * @returns {FL.SystemConfigPara}
         */
        public static getOneClientConfig(paraId:number):SystemConfigPara {
            let clientConfig:Array<SystemConfigPara> = LobbyData.clientConfig;
            for (let vIndex:number = 0, vLength:number = clientConfig.length; vIndex < vLength; ++vIndex) {
                if (paraId === clientConfig[vIndex].paraID) {
                    return clientConfig[vIndex];
                }
            }
        }

        /**
         * 设置微信分享次数
         * @param {number} shareCount
         */
        public static setWeChatShareGetDiamondCount(shareCount:number):void {
            LobbyData.playerVO.weChatShareGetDiamondCount = shareCount;
        }

        /**
         * 获得微信分享次数
         * @returns {number}
         */
        public static getWeChatShareGetDiamondCount():number {
            return LobbyData.playerVO.weChatShareGetDiamondCount;
        }

        /**
         * 获取我的公网Ip，调用淘宝Api (废弃，有跨域问题)
         * 1. 请求接口（GET）：
         http://ip.taobao.com/service/getIpInfo.php?ip=[ip地址字串]
         2. 响应信息：
         （json格式的）国家 、省（自治区或直辖市）、市（县）、运营商
         3. 返回数据格式：
         {"code":0,"data":{"ip":"210.75.225.254","country":"\u4e2d\u56fd","area":"\u534e\u5317",
         "region":"\u5317\u4eac\u5e02","city":"\u5317\u4eac\u5e02","county":"","isp":"\u7535\u4fe1",
         "country_id":"86","area_id":"100000","region_id":"110000","city_id":"110000",
         "county_id":"-1","isp_id":"100017"}}
         其中code的值的含义为，0：成功，1：失败。
         为了保障服务正常运行，每个用户的访问频率需小于10qps
         * @param {Function}  callBack
         * @param thisObject
         */
        public static getMyIp(callBack: Function, thisObject: any): void {
            if (LobbyData.playerPublicIp || LobbyData.playerPublicIp === "") {
                callBack.call(thisObject, LobbyData.playerPublicIp);
            } else {
                HttpUtil.requestGetText("http://ip.ttayouxi.com/", null, function (obj) {
                    if (obj.code === 0) {
                        LobbyData.playerPublicIp = obj.data.ip;
                        callBack.call(thisObject, obj.data.ip);
                    } else {
                        LobbyData.playerPublicIp = "";
                        callBack.call(thisObject, "");
                    }
                }, this, function () {
                    LobbyData.playerPublicIp = "";
                    callBack.call(thisObject, "");
                });
            }
        }

    }
}