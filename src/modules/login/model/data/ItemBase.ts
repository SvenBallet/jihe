module FL {
    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase - ItemBase
     * @Description:  //道具基础
     * @Create: DerekWu on 2017/11/10 11:30
     * @Version: V1.0
     */
    export class ItemBase implements IBaseObject {

        public static readonly NAME:string = "com.linyun.xgame.domain.ItemBase";

        /** 序列化类的名字，用来序列化对象用，必须和服务端的类型对应 */
        public readonly sClassName: string = ItemBase.NAME;

        public base_id: number;
        public name: string;
        public price: number;
        public property_1: number;
        public property_2: number;
        public property_3: number;
        public property_4: number;
        public description: string;

        public serialize(ar:ObjectSerializer):void {
            let self = this;
            self.base_id=ar.sInt(self.base_id);
            self.name=ar.sString(self.name);
            self.price=ar.sInt(self.price);
            self.property_1=ar.sInt(self.property_1);
            self.property_2=ar.sInt(self.property_2);
            self.property_3=ar.sInt(self.property_3);
            self.property_4=ar.sInt(self.property_4);
            self.description=ar.sString(self.description);
        }

    }
}