module FL {
    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase - SystemNotifyMsg
     * @Description:
     * @Create: ArielLiang on 2018/1/12 20:07
     * @Version: V1.0
     */
    export class SystemNotifyMsg extends NetMsgBase {

        /**类型：0，Tips消息；1，弹出框消息*/
        public type:number = 0;
        /**消息内容*/
        public content:string = "";

        constructor() {
            super(MsgCmdConstant.MSG_SYSTEM_NOTIFY_MSG);
        }

        public serialize(ar:ObjectSerializer):void{
            super.serialize(ar);
            let self = this;
            self.type = ar.sInt(self.type);
            self.content=ar.sString(self.content);
        }
    }
}