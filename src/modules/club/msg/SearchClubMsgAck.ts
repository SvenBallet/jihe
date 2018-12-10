module FL {
    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase - SearchClubMsgAck
     * @Description:  搜索俱乐部信息返回
     * @Create: ArielLiang on 2018/3/10 16:07
     * @Version: V1.0
     */
    export class SearchClubMsgAck extends NetMsgBase{

        public page:number;			//页码，第一页为1
        public size:number;			//页大小
        public result:Array<Club>;	//俱乐部对象列表

        constructor() {
            super(MsgCmdConstant.MSG_SEARCH_CLUB_ACK);
        }

        public serialize(ar:ObjectSerializer):void {
            super.serialize(ar);
            let self = this;
            self.page = ar.sInt(self.page);
            self.size = ar.sInt(self.size);
            self.result = <Array<Club>>ar.sObjArray(self.result);

        }
    }
}