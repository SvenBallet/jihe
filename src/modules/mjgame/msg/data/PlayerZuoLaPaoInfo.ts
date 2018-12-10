module FL {
    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase - PlayerZuoLaPaoInfo
     * @Description:  // 玩家坐拉跑信息
     * @Create: DerekWu on 2018/1/24 9:04
     * @Version: V1.0
     */
    export class PlayerZuoLaPaoInfo implements IBaseObject {

        public static readonly NAME: string = "com.linyun.base.domain.PlayerZuoLaPaoInfo";
        /** 序列化类的名字，用来序列化对象用，必须和服务端的类型对应 */
        public readonly sClassName: string = PlayerZuoLaPaoInfo.NAME;

        /**
         * 玩家位置
         */
        public tablePositon: number = -1;

        /**
         * 下坐的大小，取值0~2
         */
        public zuoNumber: number = -1;

        /**
         * 下拉的大小，取值0~2
         */
        public laNumber: number = -1;

        /**
         * 下跑的大小，取值0~2
         */
        public paoNumber: number = -1;

        /**
         * 玩家是否已经下坐拉跑，0表示未下，1表示已下
         */
        public isZuoLaPao: number = 0;

        //
        public serialize(ar: ObjectSerializer): void {
            let self = this;
            self.tablePositon = ar.sInt(self.tablePositon);
            self.zuoNumber = ar.sInt(self.zuoNumber);
            self.laNumber = ar.sInt(self.laNumber);
            self.paoNumber = ar.sInt(self.paoNumber);
            self.isZuoLaPao = ar.sInt(self.isZuoLaPao);
        }

    }
}