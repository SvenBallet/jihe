module FL{

    export class AgentDaiKaiMsgAck extends NetMsgBase{

        public result:number = 0;
        public msg:string = "";
        public pageIndex:number=0;
        public totalPage:number=0;
        public vlist:Array<AgentDaiKaiInfo>;

        public static SUCCESS:number = 0;
        public static ERROR:number = 1;
        public static CLUB_NOT_FOUND:number = 2;
        public static CLUB_PRIV_ERROR:number = 3;
        public static CLUB_TABLE_STATE_ERROR:number = 4;

        constructor(){
            super(MsgCmdConstant.MSG_AGENT_DAIKAI_ACK);
        }


        public serialize(ar:ObjectSerializer):void {
            super.serialize(ar);
            let self = this;
            self.result = ar.sInt(self.result);
            self.msg = ar.sString(self.msg);
            self.pageIndex = ar.sInt(self.pageIndex);
            self.totalPage = ar.sInt(self.totalPage);
            self.vlist = <Array<AgentDaiKaiInfo>>ar.sObjArray(self.vlist);
        }

    }
}