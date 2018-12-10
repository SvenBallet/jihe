module FL {
    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase - ApplyDismissRoomMsg
     * @Description:  申请解散房间
     * @Create: ArielLiang on 2018/4/19 9:56
     * @Version: V1.0
     */
    export class ApplyDismissRoomMsg extends NetMsgBase {


        public constructor() {
            super(MsgCmdConstant.MSG_APPLY_DISMISS_ROOM);
        }

    }
}