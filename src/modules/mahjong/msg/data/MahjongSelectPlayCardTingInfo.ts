module FL {
    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase - MahjongSelectPlayCardTingInfo
     * @Description:  麻将选择打牌的听牌信息
     * @Create: ArielLiang on 2018/6/13 14:24
     * @Version: V1.0
     */
    export class MahjongSelectPlayCardTingInfo implements IBaseObject {

        public static readonly NAME:string = "com.linyun.xgamenew.domain.mahjong.MahjongSelectPlayCardTingInfo";
        /** 序列化类的名字，用来序列化对象用，必须和服务端的类型对应 */
        public readonly sClassName: string = MahjongSelectPlayCardTingInfo.NAME;
        /** 选择打出的牌,-1为癞子 */
        public selectPlayCard:number = 0;
        /** 所有听牌信息列表，没有数据则表示没有听牌 */
        public tingList:Array<MahjongTingInfo>;

        /** 听牌剩余总张数，客户端算出来的*/
        public restCardNum:number = 0;


        public serialize(ar:ObjectSerializer):void {
            this.selectPlayCard = ar.sByte(this.selectPlayCard);
            this.tingList = <Array<MahjongTingInfo>> ar.sObjArray(this.tingList);
        }
    }
}