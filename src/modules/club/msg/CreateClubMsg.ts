module FL {
    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase - CreateClubMsg
     * @Description: 创建俱乐部发送
     * @Create: ArielLiang on 2018/3/10 15:31
     * @Version: V1.0
     */
    export class CreateClubMsg extends NetMsgBase{

        public name:string;		//俱乐部名称
        public notice:string;	//俱乐部公告

        constructor() {
            super(MsgCmdConstant.MSG_CREATE_CLUB);
        }

        public serialize(ar:ObjectSerializer):void {
            super.serialize(ar);
            let self = this;
            this.name = ar.sString(self.name);
            this.notice = ar.sString(self.notice);
        }
    }
}