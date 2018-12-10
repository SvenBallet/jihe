module FL {
    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase - MahjongGameOverPlayerInfo
     * @Description: 麻将游戏结束的玩家信息
     * @Create: ArielLiang on 2018/6/15 20:27
     * @Version: V1.0
     */
    export class MahjongGameOverPlayerInfo implements IBaseObject {

        public static readonly NAME:string = "com.linyun.xgamenew.domain.mahjong.MahjongGameOverPlayerInfo";
        /** 序列化类的名字，用来序列化对象用，必须和服务端的类型对应 */
        public readonly sClassName: string = MahjongGameOverPlayerInfo.NAME;
        /** 玩家所在的牌桌位置 */
        public tablePos:number = 0;

        /** 是否是房主 */
        public isCreator:boolean = false;
        /** 是否是庄家 */
        public isDealer:boolean = false;

        /** 玩家游戏中昵称 **/
        public playerName:string = "";
        /** 头像索引 **/
        public headImg:number = 0;
        /** 头像的url */
        public headImageUrl:string = "";
        /** 性别 */
        public sex:number=0;
        /** 索引号, 玩家的6位数ID */
        public playerIndex:number=0;

        /** 玩家吃碰杠的牌 */
        public cardDowns:Array<MahjongCardDown> = null;

        /** 玩家手牌列表 */
        public handCards:Array<number> = null;

        /** 玩家胡牌列表，有可能胡多张。。。。。 */
        public huCards:Array<number> = null;

        /** 玩家马牌或者鸟牌列表 */
        public maCards:Array<MahjongMaPaiInfo> = null;

        /** 标记（1=点炮，2=接炮，3=自摸，0=正常） */
        public flag:number = 0;

        /** 描述 */
        public desc:string; // 序列化这个

        /** 分数 */
        public score:number = 0;

        /** 拓展数字数组，有特殊需求不再增加字段 */
        public extIntValues:Array<number>;

        /** 拓展字符串数组，有特殊需求不再增加字段 */
        public extStringValues:Array<string>;


        public serialize(ar:ObjectSerializer):void {
            this.tablePos = ar.sByte(this.tablePos);
            this.isCreator = ar.sBoolean(this.isCreator);
            this.isDealer = ar.sBoolean(this.isDealer);
            this.playerName = ar.sString(this.playerName);
            this.headImg = ar.sInt(this.headImg);
            this.headImageUrl=ar.sString(this.headImageUrl);
            this.sex = ar.sInt(this.sex);
            this.playerIndex = ar.sInt(this.playerIndex);
            this.cardDowns = <Array<MahjongCardDown>> ar.sObjArray(this.cardDowns);
            this.handCards = <Array<number>> ar.sByteArray(this.handCards);
            this.huCards = <Array<number>> ar.sByteArray(this.huCards);
            this.maCards = <Array<MahjongMaPaiInfo>> ar.sObjArray(this.maCards);
            this.flag = ar.sInt(this.flag);
            this.desc = ar.sString(this.desc);
            this.score = ar.sInt(this.score);
            this.extIntValues = <Array<number>> ar.sIntArray(this.extIntValues);
            this.extStringValues = <Array<string>> ar.sStringArray(this.extStringValues);
        }
    }
}