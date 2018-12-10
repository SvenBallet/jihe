module FL {

    export class AgentRoomRecord implements IBaseObject {

        public static readonly NAME:string = "com.linyun.base.domain.AgentRoomRecord";

        /** 序列化类的名字，用来序列化对象用，必须和服务端的类型对应 */
        public readonly sClassName: string = AgentRoomRecord.NAME;

        /** 目标角色ID*/
        public targetId:number;

        /** 授权角色昵称*/
        public targetName:string;

        /** 授权钻石数量*/
        public authMoney:number;


        public serialize(ar:ObjectSerializer):void {
            let self = this;
            self.targetId = ar.sInt(self.targetId);
            self.targetName = ar.sString(self.targetName);
            self.authMoney = ar.sInt(self.authMoney);
        }

    }
}