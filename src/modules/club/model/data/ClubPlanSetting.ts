module FL {
    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase - ClubPlanSetting
     * @Description:  俱乐部开房设置
     * @Create: ArielLiang on 2018/3/15 17:07
     * @Version: V1.0
     */
    export class ClubPlanSetting  implements IBaseObject {

        public static readonly NAME: string = "com.linyun.xgame.domain.ClubPlanSetting";

        /** 序列化类的名字，用来序列化对象用，必须和服务端的类型对应 */
        public readonly sClassName: string = ClubPlanSetting.NAME;

        public planUid:dcodeIO.Long = dcodeIO.Long.ZERO;
        public clubId:number;
        public primaryType:number;
        public playWay:string;
        public minorGamePlayRuleList:Array<number> = [];
        public autoKaiFang:boolean = false;
        public personNum:number = 4;
        public quanNum:number = 8;
        public clientData:string;

        constructor() {
        }

        public serialize(ar:ObjectSerializer):void
        {
            let self = this;
            self.planUid = ar.sLong(self.planUid);
            self.clubId = ar.sInt(self.clubId);
            self.primaryType = ar.sInt(self.primaryType);
            self.minorGamePlayRuleList = <Array<number>>ar.sIntArray(self.minorGamePlayRuleList);
            self.autoKaiFang = ar.sBoolean(self.autoKaiFang);
            self.personNum = ar.sInt(self.personNum);
            self.quanNum = ar.sInt(self.quanNum);
            self.clientData = ar.sString(self.clientData);
        }
    }
}