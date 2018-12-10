module FL {
    /**
      * 深圳市天天爱科技有限公司 版权所有
      * @Name:  MahjongBase - ClubRankingListView
      * @Description: 排行榜
      * @Create: HoyeLee on 2018/3/10 18:27
      * @Version: V1.0
      */
    export class ShowRankMsg extends NetMsgBase {

        //result 1 为修改完成
        public clubId: number = 0;	//俱乐部ID
        public page: number = 0;	//页码，第一页为1

        constructor() {
            super(MsgCmdConstant.MSG_SHOW_RANK);
            //this.msgCMD = ack;
        }

        public serialize(ar: ObjectSerializer): void {
            super.serialize(ar);
            //
            let self = this;
            self.clubId = ar.sInt(self.clubId);
            self.page = ar.sInt(self.page);
        }
    }
}