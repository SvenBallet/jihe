module FL {

    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase - UrlParam
     * @Description:  //URL地址的参数
     * @Create: DerekWu on 2017/12/26 20:49
     * @Version: V1.0
     */
    export class UrlParam {
        /** 房间Id */
        public readonly roomId:number;
        /** 牌局回放分享码 */
        public readonly replayShareId:number;
    }

    export class GUrlParam {
        public static readonly UrlParam: UrlParam = new UrlParam();
    }

}