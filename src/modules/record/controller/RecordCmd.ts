module FL {

    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase - RecordCmd
     * @Description:  //大厅指令
     * @Create: DerekWu on 2017/11/10 20:18
     * @Version: V1.0
     */
    export class RecordCmd extends puremvc.SimpleCommand implements puremvc.ICommand {

        public constructor() {
            super();
        }

        public execute(notification:puremvc.INotification):void {
            let data:any = notification.getBody();
            switch(notification.getName()) {
                case RecordModule.RECORD_INTO_RECORD:{
                    this.intoRecord(data);
                    break;
                }
                case RecordModule.RECORD_INTO_AGENT_RECORD:{
                    this.intoAgentRecord(data);
                    break;
                }
            }
        }

        /**
         * 进入战绩
         */
        private intoRecord(msg:GetVipRoomListMsgAck):void {

            let vRecordView:RecordView = new RecordView(msg);
            //添加界面
            MvcUtil.addView(vRecordView);

        }

        /**
         * 进入代开房战绩
         */
        private intoAgentRecord(msg2:VipRoomRecordAckMsg2):void{
            egret.log(msg2);
            let vRecordView:RecordView = new RecordView(null,msg2);
            //添加界面
            MvcUtil.addView(vRecordView);
        }


    }

}