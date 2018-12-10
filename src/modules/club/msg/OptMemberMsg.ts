module FL {
    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase - OptMemberMsg
     * @Description:  成员操作
     * @Create: ArielLiang on 2018/3/13 16:55
     * @Version: V1.0
     */
    export class OptMemberMsg  extends NetMsgBase
    {
        public clubId:number = 0;				//俱乐部ID
        public memberId:dcodeIO.Long = dcodeIO.Long.ZERO;			//成员ID
        public operationType:number = 0;		//操作类型
        public operationValue:dcodeIO.Long = dcodeIO.Long.ZERO;		//操作值

        public static readonly OPT_TYPE_SET_ADMIN:number = 1;		//设置管理员
        public static readonly OPT_TYPE_CANCEL_ADMIN:number = 2;	//取消管理员
        public static readonly OPT_TYPE_REMOVE:number = 3;		//剔出成员

        constructor()
        {
            super(MsgCmdConstant.MSG_OPT_MEMBER);
        }

        public serialize(ar:ObjectSerializer):void
        {
            super.serialize(ar);
            let self = this;
            self.clubId = ar.sInt(self.clubId);
            self.memberId = ar.sLong(self.memberId);
            self.operationType = ar.sInt(self.operationType);
            self.operationValue = ar.sLong(self.operationValue);
        }
    }
}