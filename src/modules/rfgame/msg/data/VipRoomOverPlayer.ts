module FL {
    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase - VipRoomOverPlayer
     * @Description:  扑克游戏结束计分
     * @Create: ArielLiang on 2018/4/20 18:07
     * @Version: V1.0
     */
    export class VipRoomOverPlayer implements IBaseObject {

        public static readonly NAME: string = "com.linyun.xgamenew.domain.base.VipRoomOverPlayer";
        /** 序列化类的名字，用来序列化对象用，必须和服务端的类型对应 */
        public readonly sClassName: string = VipRoomOverPlayer.NAME;

        /** 玩家所在的牌桌位置 */
        public tablePos:number = 0;

        /**
         * 玩家ID
         */
        public playerIndex:number = 0;
        /**
         * 玩家游戏中昵称
         */
        public playerName:string = "";
        /**
         * 头像索引
         */
        public headImg:number = 0;
        /**
         * 头像的url
         */
        public headImgUrl:string = "";

        /** 牌局结算分数，总成绩 */
        public score:number = 0;

        /** 条目名字 比如麻将类：胡牌次数 点炮次数 暗杠次数 等等  比如扑克类：单局最高分 扔出炸弹数 胜利局数 失败局数 等等  */
        public itemStr:Array<string> = new Array<string>();

        /** 对应条目的数值 */
        public temValue:Array<number> = new Array<number>();


        public serialize(ar:ObjectSerializer):void {
            let self = this;
            self.tablePos = ar.sByte(self.tablePos);
            self.playerIndex = ar.sInt(self.playerIndex);
            self.playerName = ar.sString(self.playerName);
            self.headImg = ar.sInt(self.headImg);
            self.headImgUrl=ar.sString(self.headImgUrl);
            self.score = ar.sInt(self.score);
            self.itemStr = <Array<string>>ar.sStringArray(self.itemStr);
            self.temValue = <Array<number>>ar.sIntArray(self.temValue);
        }

    }
}