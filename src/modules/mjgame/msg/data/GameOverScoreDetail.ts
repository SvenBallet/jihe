module FL {
    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase - GameOverScoreDetail
     * @Description:  // 游戏结束计分明细
     * @Create: DerekWu on 2018/3/15 10:00
     * @Version: V1.0
     */
    export class GameOverScoreDetail implements IBaseObject {

        public static readonly NAME:string = "com.linyun.base.domain.GameOverScoreDetail";
        /** 序列化类的名字，用来序列化对象用，必须和服务端的类型对应 */
        public readonly sClassName: string = SimplePlayer.NAME;

        /**
         * 庄闲描述列表，从pos1开始，有多少个玩家就多少条记录
         * 描述举例：庄、闲、庄（自摸）、庄（接炮）、庄（点炮）、庄（抢杠胡）、庄（被抢杠胡） 等等
         */
        public zhuangXianDesc: Array<string> = new Array<string>();

        /** 胡牌描述  举例：平胡  十三幺 七对 大四喜 等等 */
        public huDesc: string = "";

        /** 胡牌基础计分，从pos1开始，有多少个玩家就多少条记录  */
        public huBaseScore: Array<number> = new Array<number>();

        /** 基础条目列表，例如：中鸟数量 中马数量，按照显示顺序添加到这个列表  */
        public baseItems: Array<GameOverScoreDetailItem> = new Array<GameOverScoreDetailItem>();

        /** 计分条目列表，例如：中鸟计分 中马计分 杠分，按照显示顺序添加到这个列表   */
        public countScoreItems: Array<GameOverScoreDetailItem> = new Array<GameOverScoreDetailItem>();

        public serialize(ar:ObjectSerializer):void {
            let self = this;
            self.zhuangXianDesc = <Array<string>>ar.sStringArray(self.zhuangXianDesc);
            self.huDesc = ar.sString(self.huDesc);
            self.huBaseScore = <Array<number>>ar.sIntArray(self.huBaseScore);
            self.baseItems = <Array<GameOverScoreDetailItem>>ar.sObjArray(self.baseItems);
            self.countScoreItems = <Array<GameOverScoreDetailItem>>ar.sObjArray(self.countScoreItems);
        }

    }
}