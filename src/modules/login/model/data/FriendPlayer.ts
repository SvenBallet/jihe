module FL {
    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase - FriendPlayer
     * @Description:  //好友
     * @Create: DerekWu on 2017/11/10 14:55
     * @Version: V1.0
     */
    export class FriendPlayer implements IBaseObject {

        public static readonly NAME:string = "com.linyun.base.domain.FriendPlayer";

        /** 序列化类的名字，用来序列化对象用，必须和服务端的类型对应 */
        public readonly sClassName: string = FriendPlayer.NAME;

        /**ID*/
        public playerID:string;
        /**玩家游戏中昵称**/
        public playerName:string;
        /**头像索引**/
        public headImg:number;
        /** 玩家货币0 金币*/
        public gold:number;
        /**性别*/
        public sex:number;
        /**索引号,类似qq号*/
        public palyerIndex:number;
        /**是否在线*/
        public isOnline:number;
        //是否可以加为好友(0可以，1不可以)
        public canFriend:number;
        /**备注名称*/
        public remark:string;
        /**加好友标志*/
        public applyResult:number;

        public serialize(ar:ObjectSerializer):void {
            let self = this;
            self.playerID = ar.sString(self.playerID);
            self.playerName=ar.sString(self.playerName);
            self.headImg=ar.sInt(self.headImg);
            self.gold=ar.sInt(self.gold);
            self.sex = ar.sInt(self.sex);
            self.palyerIndex = ar.sInt(self.palyerIndex);
            self.isOnline = ar.sInt(self.isOnline);
            self.canFriend = ar.sInt(self.canFriend);
            self.applyResult = ar.sInt(self.applyResult);
            self.remark = ar.sString(self.remark);
        }


    }
}