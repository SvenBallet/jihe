module FL {

    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase - HeartBeatingMsg
     * @Description:  //心跳消息包
     * @Create: DerekWu on 2017/11/9 14:51
     * @Version: V1.0
     */
    export class HeartBeatingMsg extends NetMsgBase {

        //room123的房间人数
        // public r1Num: number;
        // public r2Num: number;
        // public r3Num: number;
        // public r4Num: number;

        constructor() {
            super(MsgCmdConstant.MSG_HEART_BEATING);
        }

        // public serialize(ar:ObjectSerializer):void {
        //     super.serialize(ar);
        //     let self = this;
        //     self.r1Num=ar.sInt(self.r1Num);
        //     self.r2Num=ar.sInt(self.r2Num);
        //     self.r3Num=ar.sInt(self.r3Num);
        //     self.r4Num=ar.sInt(self.r4Num);
        // }

    }

}