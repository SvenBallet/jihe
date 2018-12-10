module FL {

    export class ActivityGetRewardMsg extends NetMsgBase {

        public activityId:number;
        public rewardId:number;

        constructor() {
            super(MsgCmdConstant.MSG_ACTIVITY_GET_REWARD);
        }

        public serialize(ar:ObjectSerializer):void {
            super.serialize(ar);
            let self = this;
            self.activityId = ar.sInt(self.activityId);
            self.rewardId = ar.sInt(self.rewardId);
        }
    }
}