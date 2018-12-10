module FL {
    export class TeaHouse implements IBaseObject {
        public static readonly NAME: string = "com.linyun.xgamenew.domain.teahouse.TeaHouse";
        /** 序列化类的名字，用来序列化对象用，必须和服务端的类型对应 */
        public readonly sClassName: string = TeaHouse.NAME;
        //茶楼ID
        public teaHouseId;

        //茶楼名称
        public teaHouseName;

        //创建时间
        public createDate;

        //创建者ID
        public creatorIndex;

        //创建者名称
        public creatorPlayerName;

        //创建者头像
        public headImageUrl;

        //茶楼层数
        public teaHouseStoreyNumber;

        //茶楼的钻石数
        public needDiamond;

        //是否同IP禁止同桌
        public alikeIpForbindDeskmate = 1;

        //是否茶楼审核
        public checkTeaHouse = 1;

        //是否禁止分享
        public forbidShare = 1;

        //战绩重置时间
        public recordResetTime;

        //玩的局数
        public playCount;

        //茶楼公告
        public notice;

        //留言
        public leaveMessage;

        //成员数
        public memberNum;

        //茶楼状态(0、on / 1、off)
        public state;

        //茶楼是否有效（默认1有效，0无效）
        public valid;


        //字段仅在搜索列表有效, 0:不在俱乐部,1:在茶楼的权限
        public myState = 0;


        public static readonly TEA_HOUSE_ON = 0;		//开启茶楼
        public static readonly TEA_HOUSE_OFF = 1;		//关闭茶楼

        public static readonly TEA_HOUSE_UNVALID = 0;	//茶楼无效
        public static readonly TEA_HOUSE_VALID = 1;	//茶楼有效	


        public static readonly A_LIKE_IP_FOR_BIND_DESKMATE_ON = 0;		//
        public static readonly A_LIKE_IP_FOR_BIND_DESKMATE_OFF = 1;

        public static readonly CHECK_TEAHOUSE_ON = 0;
        public static readonly CHECK_TEAHOUSE_OFF = 1;

        public static readonly FORBID_SHARE_ON = 0;
        public static readonly FORBID_SHARE_OFF = 1;

        public serialize(ar: ObjectSerializer): void {
            let self = this;
            self.teaHouseId = ar.sInt(self.teaHouseId);
            self.teaHouseName = ar.sString(self.teaHouseName);
            self.createDate = ar.sDouble(self.createDate);
            self.creatorIndex = ar.sInt(self.creatorIndex);
            self.creatorPlayerName = ar.sString(self.creatorPlayerName);
            self.headImageUrl = ar.sString(self.headImageUrl);
            self.teaHouseStoreyNumber = ar.sInt(self.teaHouseStoreyNumber);
            self.needDiamond = ar.sInt(self.needDiamond);
            self.recordResetTime = ar.sInt(self.recordResetTime);
            self.playCount = ar.sInt(self.playCount);
            self.notice = ar.sString(self.notice);
            self.leaveMessage = ar.sString(self.leaveMessage);
            self.memberNum = ar.sInt(self.memberNum);
            self.state = ar.sInt(self.state);
            self.valid = ar.sInt(self.valid);
            self.alikeIpForbindDeskmate = ar.sInt(self.alikeIpForbindDeskmate);
            self.checkTeaHouse = ar.sInt(self.checkTeaHouse);
            self.forbidShare = ar.sInt(self.forbidShare);
        }
    }
}