module FL {
    export class TeaHousePerformanceAll implements IBaseObject {
        public static readonly NAME: string = "com.linyun.xgamenew.domain.teahouse.TeaHousePerformanceAll";
        /** 序列化类的名字，用来序列化对象用，必须和服务端的类型对应 */
        public readonly sClassName: string = TeaHousePerformanceAll.NAME;
        // 时间
        public time = dcodeIO.Long.ZERO;
        public count1 = 0;
        public count2 = 0;
        public count3 = 0;
        // 总数
        public countAll;

        public serialize(ar: ObjectSerializer): void {
            let self = this;
            self.time = ar.sLong(self.time);
            self.count1 = ar.sInt(self.count1);
            self.count2 = ar.sInt(self.count2);
            self.count3 = ar.sInt(self.count3);
            self.countAll = ar.sInt(self.countAll);
        }
    }
}