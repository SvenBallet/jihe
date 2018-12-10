module FL {
    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase - MahjongShaiZi
     * @Description: 麻将色子（骰子）
     * @Create: ArielLiang on 2018/6/28 10:01
     * @Version: V1.0
     */
    export class MahjongShaiZi implements IBaseObject {
        public static readonly NAME:string = "com.linyun.xgamenew.core.game.mahjong.base.MahjongShaiZi";
        /** 序列化类的名字，用来序列化对象用，必须和服务端的类型对应 */
        public readonly sClassName: string = MahjongShaiZi.NAME;

        /** 丢色子玩家的位置 */
        public playerPos:number = 0;
        /** 色子丢的值（1-6），目前支持一次丢4个，暂时只用到两个 */
        public shaiZiNum1:number = 0;
        public shaiZiNum2:number = 0;
        public shaiZiNum3:number = 0;
        public shaiZiNum4:number = 0;

        public serialize(ar:ObjectSerializer):void {
            this.playerPos = ar.sInt(this.playerPos);
            this.shaiZiNum1 = ar.sInt(this.shaiZiNum1);
            this.shaiZiNum2 = ar.sInt(this.shaiZiNum2);
            this.shaiZiNum3 = ar.sInt(this.shaiZiNum3);
            this.shaiZiNum4 = ar.sInt(this.shaiZiNum4);
        }
    }
}