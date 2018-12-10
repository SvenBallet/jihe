module FL {
    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase - SearchClubMsg
     * @Description:  查找俱乐部
     * @Create: ArielLiang on 2018/3/10 16:04
     * @Version: V1.0
     */
    export class SearchClubMsg extends NetMsgBase{

        public content:string;	//搜索名字或者ID
        public page:number;		//页码，第一页为1

        constructor() {
            super(MsgCmdConstant.MSG_SEARCH_CLUB);
        }

        public serialize(ar:ObjectSerializer):void {
            super.serialize(ar);
            let self = this;
            this.content = ar.sString(self.content);
            this.page = ar.sInt(self.page);

        }
    }
}