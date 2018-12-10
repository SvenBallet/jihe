module FL {
    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase - OptApplyListMsg
     * @Description: 操作申请列表
     * @Create: HoyeLee on 2018/3/13 19:07
     * @Version: V1.0
     */
    export class OptApplyListMsg extends NetMsgBase {
        public clubId: number = 0; //俱乐部ID
        public applyId: dcodeIO.Long = dcodeIO.Long.ZERO;  //不指定时全部同意或者拒绝，指定则针对一个申请
        // public applyId: number;  //不指定时全部同意或者拒绝，指定则针对一个申请
        public type: number = 0;  //同意或拒绝，定义如下

        public static readonly AGREE = 0;
        public static readonly REJECT = 1;

        public constructor() {
            super(MsgCmdConstant.MSG_OPT_APPLY_LIST);
        }
        public serialize(ar: ObjectSerializer): void {
            super.serialize(ar);
            //
            let self = this;
            self.clubId = ar.sInt(self.clubId);
            self.applyId = ar.sLong(self.applyId);
            // self.applyId = ar.sDouble(self.applyId);
            self.type = ar.sInt(self.type);
        }
    }
}