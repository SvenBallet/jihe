module FL{

    export class GetPlayerDiamondLogAck extends NetMsgBase{

        public logs:Array<PlayerOperationLog>;
        public pageIndex:number=0;
        public totalPage:number=0;
        public logType:number=0;

        constructor(){
            super(MsgCmdConstant.MSG_GAME_GET_PLAYER_DIAMOND_LOG_ACK);
        }


        public serialize(ar:ObjectSerializer):void {
            super.serialize(ar);
            let self = this;
            self.pageIndex = ar.sInt(self.pageIndex);
            self.totalPage = ar.sInt(self.totalPage);
            self.logType = ar.sInt(self.logType);
            self.logs = <Array<PlayerOperationLog>> ar.sObjArray(self.logs);

        }

    }
}