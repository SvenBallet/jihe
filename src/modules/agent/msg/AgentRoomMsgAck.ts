module FL{

    export class AgentRoomMsgAck extends NetMsgBase{

        /** 错误码*/
        public result:number = 0;

        /** 页码*/
        public pageIndex:number = 0;

        /** 总记录数*/
        public totalPage:number = 0;

        /** 代开房信息列表*/
        public recordList:Array<AgentRoomRecord>;

        constructor(){
            super(MsgCmdConstant.MSG_AGENT_PLAYER_ACK);
        }


        public serialize(ar:ObjectSerializer):void {
            super.serialize(ar);
            let self = this;
            self.result = ar.sInt(self.result);
            self.pageIndex = ar.sInt(self.pageIndex);
            self.totalPage = ar.sInt(self.totalPage);
            self.recordList = <Array<AgentRoomRecord>> ar.sObjArray(self.recordList);
        }

    }
}