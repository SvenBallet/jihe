module FL {
    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase - CreateClubMsgAck
     * @Description:  创建俱乐部返回
     * @Create: ArielLiang on 2018/3/10 15:35
     * @Version: V1.0
     */
    export class CreateClubMsgAck extends NetMsgBase{

        public result:number = 0;		//创建结果，定义如下
        public content:string = ""; //返回文本信息

        constructor() {
            super(MsgCmdConstant.MSG_CREATE_CLUB_ACK);
        }

        public serialize(ar:ObjectSerializer):void {
            super.serialize(ar);
            let self = this;
            this.result = ar.sInt(self.result);
            this.content = ar.sString(self.content);

        }

    }
}