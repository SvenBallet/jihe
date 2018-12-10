module FL {
    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase - ApplyClubMsgAck
     * @Description:  申请加入俱乐部返回
     * @Create: ArielLiang on 2018/3/12 10:26
     * @Version: V1.0
     */
    export class ApplyClubMsgAck extends NetMsgBase {
        public result:number = 0;	//申请俱乐部结果，定义如下


        constructor()
        {
            super(MsgCmdConstant.MSG_APPLY_CLUB_ACK);
        }

        public serialize(ar:ObjectSerializer):void {
            super.serialize(ar);
            let self = this;
            self.result = ar.sInt(self.result);
        }
    }
}