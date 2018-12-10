module FL {
    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase - MahjongUpdateScorePlayerInfo
     * @Description:  //
     * @Create: DerekWu on 2018/6/28 10:37
     * @Version: V1.0
     */
    export class MahjongUpdateScorePlayerInfo implements IBaseObject {

        public static readonly NAME:string = "com.linyun.xgamenew.domain.mahjong.MahjongUpdateScorePlayerInfo";
        /** 序列化类的名字，用来序列化对象用，必须和服务端的类型对应 */
        public readonly sClassName: string = MahjongUpdateScorePlayerInfo.NAME;

        public tablePos:number;
        /**修改分数  */
        public score:number;

        public serialize(ar:ObjectSerializer):void {
            this.tablePos=ar.sInt(this.tablePos);
            this.score=ar.sInt(this.score);
        }

    }
}