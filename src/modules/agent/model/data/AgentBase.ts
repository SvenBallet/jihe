module FL {

    export class AgentBase implements IBaseObject {

        public static readonly NAME:string = "com.linyun.xgame.domain.AgentBase";

        /** 序列化类的名字，用来序列化对象用，必须和服务端的类型对应 */
        public readonly sClassName: string = AgentBase.NAME;

        public result:number = 0;
        public msg:string = "";
        public pageIndex:number=0;
        public totalPage:number=0;
        public vlist:Array<number>;

        public serialize(ar:ObjectSerializer):void {
            let self = this;
            self.result = ar.sInt(self.result);
            self.msg = ar.sString(self.msg);
            self.pageIndex = ar.sInt(self.pageIndex);
            self.totalPage = ar.sInt(self.totalPage);
            self.vlist = ar.sIntArray(self.vlist);
        }

    }
}