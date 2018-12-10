module FL {
    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase - ScrollMsg
     * @Description:  服务端通知客户端滚动条消息
     * @Create: ArielLiang on 2018/1/15 17:41
     * @Version: V1.0
     */
    export class ScrollMsg extends NetMsgBase {
        //消息内容
        public msg:string = "";
        //客户端循环次数
        public loopNum:number = 2;
        //客户端是否清除之前的消息,0不移除，1把之前的消息清理掉
        public removeAllPreviousMsg:number=0;

        constructor() {
            super(MsgCmdConstant.MSG_GAME_SEND_SCROLL_MES);
        }

        public serialize(ar:ObjectSerializer):void {
            super.serialize(ar);
            let self = this;
            self.msg=ar.sString(self.msg);
            self.loopNum=ar.sInt(self.loopNum);
            self.removeAllPreviousMsg=ar.sInt(self.removeAllPreviousMsg);
        }
    }
}