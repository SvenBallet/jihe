module FL {
    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase - OptMemberMsgAck
     * @Description:  成员操作返回
     * @Create: ArielLiang on 2018/3/13 16:59
     * @Version: V1.0
     */
    export class OptMemberMsgAck extends NetMsgBase
    {
        public result:number = 0;	//操作结果
        public memberId:dcodeIO.Long = dcodeIO.Long.ZERO;		//操作的成员
        public operationType:number = 0;	//操作类型

        public static readonly SUCCESS:number = 0;	//成功
        public static readonly UNKNOWN_ERROR:number = 1;	//未知错误
        public static readonly PRIV_ERROR:number = 2;	//权限不足
        public static readonly MEMBER_NOT_FOUND:number = 3; //成员不存在
        public static readonly CAN_NOT_OPT_SELF:number = 4; //不能操作自己
        public static readonly ADMIN_MEMBER_LIMIT:number = 5; //管理员数量超出限制
        public static readonly CLUB_NOT_FOUND:number = 6;

        constructor()
        {
            super(MsgCmdConstant.MSG_OPT_MEMBER_ACK);
        }

        public serialize(ar:ObjectSerializer):void
        {
            super.serialize(ar);
            let self = this;
            self.result = ar.sInt(self.result);
            self.memberId = ar.sLong(self.memberId);
            self.operationType = ar.sInt(self.operationType);
        }
    }
}