module FL {
    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase_ChangSha - MahjongCardCityWallInfo
     * @Description: 麻将牌城墙信息
     * @Create: ArielLiang on 2018/5/31 11:46
     * @Version: V1.0
     */
    export class MahjongCardCityWallInfo implements IBaseObject {

        public static readonly NAME:string = "com.linyun.xgamenew.domain.mahjong.MahjongCardCityWallInfo";
        /** 序列化类的名字，用来序列化对象用，必须和服务端的类型对应 */
        public readonly sClassName: string = MahjongCardCityWallInfo.NAME;

        /** 麻将牌剩余总数量，初始化的时候重设，打牌过程中会变化 */
        public cardLeftNum:number = 0;

        /**
         * 东南西北风位牌墙， 可以是暗牌MahjongCardEnum.AN_PAI（还没有模走）、
         * 可以是无效牌MahjongCardEnum.INVALID（已经模走）、 可以是明牌MahjongCardEnum.other（明出来的牌）
         * 偶数索引在上层，奇数索引在下层
         */
        public dongCardWall:Array<number>;
        public nanCardWall:Array<number>;
        public xiCardWall:Array<number>;
        public beiCardWall:Array<number>;

        public serialize(ar:ObjectSerializer):void {
            this.cardLeftNum = ar.sInt(this.cardLeftNum);
            this.dongCardWall = <Array<number>> ar.sByteArray(this.dongCardWall);
            this.nanCardWall = <Array<number>> ar.sByteArray(this.nanCardWall);
            this.xiCardWall = <Array<number>> ar.sByteArray(this.xiCardWall);
            this.beiCardWall = <Array<number>> ar.sByteArray(this.beiCardWall);
        }
    }
}