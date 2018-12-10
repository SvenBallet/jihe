module FL {
    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase - ActivityShowMsg
     * @Description:  //
     * @Create: DerekWu on 2017/11/10 9:31
     * @Version: V1.0
     */
    export class ActivityShowMsg extends NetMsgBase {

        public activityId:number;

        constructor(activityId) {
            super(MsgCmdConstant.MSG_ACTIVITY_SHOW);
            this.activityId = activityId;
        }

        public serialize(ar:ObjectSerializer):void {
            super.serialize(ar);
            let self = this;
            self.activityId = ar.sInt(self.activityId);
        }
    }
}