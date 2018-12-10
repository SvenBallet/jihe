module FL {

    export class ActivityGetRewardAckMsg extends NetMsgBase {


        public activityId:number;
        public result:number;

        constructor() {
            super(MsgCmdConstant.MSG_ACTIVITY_GET_REWARD_ACK);
        }

        public serialize(ar:ObjectSerializer):void {
            super.serialize(ar);
            let self = this;
            this.activityId = ar.sInt(this.activityId);
            this.result = ar.sInt(this.result);

        }

    }
}