module FL {
    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase - SystemConfigPara
     * @Description:  //系统配置参数
     * @Create: DerekWu on 2017/11/10 14:58
     * @Version: V1.0
     */
    export class SystemConfigPara implements IBaseObject {

        public static readonly NAME:string = "com.linyun.base.domain.SystemConfigPara";
        /** 序列化类的名字，用来序列化对象用，必须和服务端的类型对应 */
        public readonly sClassName: string = SystemConfigPara.NAME;

        public paraID: number;

        public valueInt: number;
        public pro_1: number;
        public pro_2: number;
        public pro_3: number;
        public pro_4: number;
        public pro_5: number;
        public isclient: number;
        public valueStr: string;
        public paraDesc: string;

        public serialize(ar:ObjectSerializer):void {
            let self = this;
            self.paraID = ar.sInt(self.paraID);
            self.valueInt=ar.sInt(self.valueInt);
            self.pro_1 = ar.sInt(self.pro_1);
            self.pro_2 = ar.sInt(self.pro_2);
            self.pro_3 = ar.sInt(self.pro_3);
            self.pro_4 = ar.sInt(self.pro_4);
            self.pro_5 = ar.sInt(self.pro_5);
            self.isclient = ar.sInt(self.isclient);
            self.valueStr = ar.sString(self.valueStr);
            self.paraDesc = ar.sString(self.paraDesc);
        }

    }
}