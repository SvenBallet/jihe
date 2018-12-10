module FL {
    export class TeaHouseMember implements IBaseObject {
        public static readonly NAME: string = "com.linyun.xgamenew.domain.teahouse.TeaHouseMember";
        /** 序列化类的名字，用来序列化对象用，必须和服务端的类型对应 */
        public readonly sClassName: string = TeaHouseMember.NAME;
        //成员ID
        public memberId;
        //成员index
        public playerIndex;

        //茶楼ID
        public teahouseId;

        //成员名称
        public memberName;

        //成员状态(0老板/1小二/2普通成员)
        public state;

        //成员加入时间
        public joinTime;

        //成员最后上线时间
        public lastLoginTime;

        //成员是否有效（默认1有效，0无效）
        public valid;

        //成员头像
        public headImageUrl;

        //玩的局数
        public playCount;

        // 第一层大赢家数
        public bigWinnerCountForOne;

        // 第二层大赢家数
        public bigWinnerCountForTwo;

        // 第三层大赢家数
        public bigWinnerCountForThree;

        // 被邀请状态（客户端，不加入序列化）
        public inviteFlag: boolean = false;

        public static readonly TEAHOUSE_BOOS = 1;			//老板
        public static readonly TEAHOUSE_XIAOER = 2;		//小二
        public static readonly TEAHOUSE_MEMBER = 4;		//普通成员

        public static readonly VALID = 1;	//有效
        public static readonly UN_VALID = 0;	//无效

         //玩家是否在线
        public isMemberOnline = false;

        public serialize(ar: ObjectSerializer): void {
            let self = this;
            self.memberId = ar.sLong(self.memberId);
            self.playerIndex = ar.sInt(self.playerIndex);
            self.teahouseId = ar.sInt(self.teahouseId);
            self.memberName = ar.sString(self.memberName);
            self.state = ar.sInt(self.state);
            self.joinTime = ar.sDouble(self.joinTime);
            self.lastLoginTime = ar.sDouble(self.lastLoginTime);
            self.valid = ar.sInt(self.valid);
            self.headImageUrl = ar.sString(self.headImageUrl);
            self.playCount = ar.sInt(self.playCount);
            self.bigWinnerCountForOne = ar.sInt(self.bigWinnerCountForOne);
            self.bigWinnerCountForTwo = ar.sInt(self.bigWinnerCountForTwo);
            self.bigWinnerCountForThree = ar.sInt(self.bigWinnerCountForThree);
            self.isMemberOnline = ar.sBoolean(self.isMemberOnline);
        }
    }
}