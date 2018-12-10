module FL {
    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase - ApplyClubMsg
     * @Description:  申请加入俱乐部
     * @Create: ArielLiang on 2018/3/12 10:24
     * @Version: V1.0
     */
    export class ApplyClubMsg extends NetMsgBase
    {
        public clubId:number;	//俱乐部ID

        constructor() {
            super(MsgCmdConstant.MSG_APPLY_CLUB);
        }


        public serialize(ar:ObjectSerializer):void
        {
            super.serialize(ar);
            let self = this;
            self.clubId = ar.sInt(self.clubId);
        }
    }
}