module FL {
    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase_ChangSha - MahjongStartCircleGameMsgAck
     * @Description:  新一轮麻将游戏 开始
     * @Create: ArielLiang on 2018/5/31 11:29
     * @Version: V1.0
     */
    export class MahjongStartCircleGameMsgAck extends AbstractNewNetMsgBaseAck {

        /** 自己的牌桌方位 */
        public myTablePos:number = 0;
        /** 庄家位置 */
        public dealerPos:number = 0;
        /** 麻将城墙信息 */
        public cityWallInfo:MahjongCardCityWallInfo = new MahjongCardCityWallInfo();

        /** 最后出牌玩家位置 */
        public lastChuCardPlayerPos:number = 0;

        /** 麻将玩家列表 */
        public playerInfos:Array<MahjongGameStartPlayerInfo> = new Array<MahjongGameStartPlayerInfo>();

        /** 麻将癞子列表，没有则是null */
        public laiZiCards: Array<number>;

        /** 麻将花牌列表，没有则是null */
        public huaCards: Array<number>;

        /** 不能被打出的牌的ID列表 */
        public noPlayCards: Array<number>;
        /** 不能被打出的牌的名字列表 */
        public noPlayCardNames: Array<string>;

        public constructor() {
            super(MsgCmdConstant.MSG_START_CIRCLE_MAHJONG_GAME_ACK);
        }

        public newSerialize(ar:ObjectSerializer):void {
            this.myTablePos = ar.sByte(this.myTablePos);
            this.dealerPos = ar.sByte(this.dealerPos);
            this.cityWallInfo = <MahjongCardCityWallInfo>ar.sObject(this.cityWallInfo);
            this.lastChuCardPlayerPos = ar.sByte(this.lastChuCardPlayerPos);
            this.playerInfos = <Array<MahjongGameStartPlayerInfo>> ar.sObjArray(this.playerInfos);
            this.laiZiCards = <Array<number>>ar.sByteArray(this.laiZiCards);
            this.huaCards = <Array<number>>ar.sByteArray(this.huaCards);
            this.noPlayCards = <Array<number>>ar.sByteArray(this.noPlayCards);
            this.noPlayCardNames = <Array<string>>ar.sStringArray(this.noPlayCardNames);
        }

    }
}