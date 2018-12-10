module FL {
    import numberToBlendMode = egret.sys.numberToBlendMode;

    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase - Player
     * @Description:  //玩家数据
     * @Create: DerekWu on 2017/11/10 12:04
     * @Version: V1.0
     */
    export class Player implements IBaseObject {

        public static readonly NAME:string = "com.linyun.base.domain.Player";

        /** 序列化类的名字，用来序列化对象用，必须和服务端的类型对应 */
        public readonly sClassName: string = Player.NAME;

        /** 玩家Id */
        public playerID:string;
        /** 玩家账户 */
        public account:string;
        /** 玩家密码 */
        public password:string;
        /**玩家游戏中昵称**/
        public playerName:string;
        /**匿名登录的机器码**/
        public machineCode:string;
        /**头像索引**/
        public headImg:number;
        /** 玩家货币0 金币*/
        public gold:number;
        public goldVerify:string;
        public sex:number;
        public phoneNumber:string;

        /** 钻石*/
        public diamond:number;
        /** 积分*/
        public score:number;
        /** 胜利记录*/
        public wons:number;
        /** 失败记录*/
        public loses:number;
        /** 逃跑记录*/
        public escape:number;
        //上级玩家索引
        public parentIndex:number;
        //
        public tablePos:number;
        public headImageUrl:string;
        /** 连续登陆天数*/
        public continueLanding:number;
        /**每日赠送抽奖的次数 */
        public luckyDrawsTimes:number;
        /**vip等级*/
        public vipLevel:number;
        /**vip经验*/
        public vipExp:number;
        public playerType:number;

        /**晶石数量**/
        public gemNum:number;
        /**玩家索引号，类似于QQ号，系统唯一 1000 是默认值，如果玩家的值为1000的话，则表示他是老玩家需重新分配号码*/
        public playerIndex:number;
        //玩家的道具列表
        // std::list<PlayerItem*> player_items;
        //
        //吃碰杠的牌
        public cardsDown:Array<CardDown>;
        //手里的牌
        public cardsInHand:Array<number>;
        //刚抓起来的牌
        public cardGrab:number;
        public canFriend:number;

        public payBack:number;


        /** 邀请码*/
        public inviteCode:number = 0;

        //新增代理等级
        public agentLevel:number;

        public serialize(ar:ObjectSerializer):void {
            let self = this;
            self.playerID=ar.sString(self.playerID);

            self.account=ar.sString(self.account);
            self.password=ar.sString(self.password);
            self.playerName=ar.sString(self.playerName);
            self.machineCode=ar.sString(self.machineCode);


            self.headImg=ar.sInt(self.headImg);
            //
            self.gold=ar.sInt(self.gold);
            self.goldVerify=ar.sString(self.goldVerify);
            self.sex=ar.sInt(self.sex);

            self.diamond=ar.sInt(self.diamond);

            self.score=ar.sInt(self.score);
            self.wons=ar.sInt(self.wons);
            self.loses=ar.sInt(self.loses);
            self.escape=ar.sInt(self.escape);
            self.parentIndex=ar.sInt(self.parentIndex);

            self.tablePos=ar.sInt(self.tablePos);
            //
            self.headImageUrl=ar.sString(self.headImageUrl);

            self.continueLanding=ar.sInt(self.continueLanding);
            self.luckyDrawsTimes=ar.sInt(self.luckyDrawsTimes);

            self.vipLevel=ar.sInt(self.vipLevel);
            self.vipExp=ar.sInt(self.vipExp);
            //
            self.gemNum=ar.sInt(self.gemNum);
            self.playerIndex = ar.sInt(self.playerIndex);
            self.payBack=ar.sFloat(self.payBack);
            //
            //写入
            //兼容老数据，这个需要加个一整型
            // int item_num=0;
            ar.sInt(0);
            //
            //
            self.cardsDown = <Array<CardDown>>ar.sObjArray(self.cardsDown);
            self.cardsInHand = <Array<number>>ar.sByteArray(self.cardsInHand);
            self.cardGrab=ar.sByte(self.cardGrab);

            self.canFriend = ar.sInt(self.canFriend);
            self.phoneNumber = ar.sString(self.phoneNumber);

            self.playerType=ar.sInt(self.playerType);

            self.inviteCode = ar.sInt(self.inviteCode);
            self.agentLevel = ar.sInt(self.agentLevel);
        }

    }
}