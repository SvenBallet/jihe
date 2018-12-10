module FL {
    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase - ActivityShowMsgAck
     * @Description:  对战记录返回消息
     * @Create: DerekWu on 2017/11/10 11:13
     * @Version: V1.0
     */
    export class ActivityShowMsgAck extends NetMsgBase {

        /***/
        public activityId:number;
        public startTime:string;
        public endTime:string;
        public vlist:Array<number>;

        constructor() {
            super(MsgCmdConstant.MSG_ACTIVITY_SHOW_ACK);
        }

        public serialize(ar:ObjectSerializer):void {
            super.serialize(ar);
            let self = this;
            this.activityId = ar.sInt(this.activityId)
            this.startTime = ar.sString(this.startTime)
            this.endTime = ar.sString(this.endTime)
            this.vlist = ar.sIntArray(this.vlist)

        }

    }
}