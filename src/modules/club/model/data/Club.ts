module FL {
    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase - Club
     * @Description: 俱乐部信息序列化类
     * @Create: ArielLiang on 2018/3/10 16:09
     * @Version: V1.0
     */
    export class Club implements IBaseObject {

        public static readonly NAME:string = "com.linyun.xgame.domain.Club";

        /** 序列化类的名字，用来序列化对象用，必须和服务端的类型对应 */
        public readonly sClassName: string = Club.NAME;

        public id:number;
        public imageId:number;

        public creatorPlayerIndex:number;
        public creatorPlayerName:string;

        public memberNum:number;
        public onlineNum:number;
        public diamond:number;

        public name:string;
        public notice:string;
        public createTime:dcodeIO.Long = dcodeIO.Long.ZERO;

        //字段仅在搜索列表有效, 0:不在俱乐部,1:在俱乐部的权限
        public myState:number = 0;


        public serialize(ar:ObjectSerializer):void {
            let self = this;
            if (self.onlineNum > self.memberNum) {
                self.onlineNum = self.memberNum;
            }
            //
            self.id = ar.sInt(self.id);
            self.imageId = ar.sInt(self.imageId);
            self.creatorPlayerIndex = ar.sInt(self.creatorPlayerIndex);
            self.creatorPlayerName = ar.sString(self.creatorPlayerName);
            self.memberNum = ar.sInt(self.memberNum);
            self.onlineNum = ar.sInt(self.onlineNum);
            if (ar.readMode) {
                self.diamond = ar.sInt(self.diamond);
            }

            self.name = ar.sString(self.name);
            self.notice = ar.sString(self.notice);
            self.createTime = ar.sLong(self.createTime);
            self.myState = ar.sInt(self.myState);
        }

    }
}