module FL {
    /** 茶楼消息处理类 */
    export class TeaHouseMsgHandle {
        /** 进入茶楼 */
        public static sendAccessTeaHouseMsg(id: any) {
            let msg = new AccessTeaHouseMsg();
            msg.teaHouseId = id;
            ServerUtil.sendMsg(msg, MsgCmdConstant.MSG_ACCESS_TEAHOUSE_ACK);
        }

        /** 进入楼层 */
        public static sendAccessLayerMsg(floor: number, id: any, useLocal: boolean = false) {
            let msg = new AccessTeaHouseLayerMsg();
            msg.teaHouseId = id;
            let layer = 1;
            if (useLocal) {
                layer = parseInt(egret.localStorage.getItem("th_previous_floor_" + id)) || 1;
            } else {
                layer = floor;
            }
            msg.teahouseLayerNum = layer;
            ServerUtil.sendMsg(msg, MsgCmdConstant.MSG_ACCESS_TEAHOUSE_LAYER_ACK);
        }

        /** 发送请求成员列表消息 */
        public static sendShowMemListMsg(page: number, id: number = 0, content: string = "") {
            let msg = new ShowTeaHouseMemberListMsg();
            msg.teaHouseId = TeaHouseData.curID;
            msg.page = page;
            msg.searchPlayerId = id;
            msg.searchPlayerName = content;
            ServerUtil.sendMsg(msg, MsgCmdConstant.MSG_TEAHOUSE_SHOW_MEMBER_LIST_ACK);
            console.log(msg);
        }

        /** 發送顯示小二列表消息 */
        public static sendWaiterMsg() {
            let msg = new OptMemberStateMsg();
            msg.teaHouseId = TeaHouseData.curID;
            msg.operationType = OptMemberStateMsg.TH_WAITER_DEFAULT;
            ServerUtil.sendMsg(msg, MsgCmdConstant.MSG_OPT_TEAHOUSE_MEMBER_ACK);
        }

        /** 发送显示申请成员列表消息 */
        public static sendShowApplyListMsg(page: number, content: string = "") {
            let msg = new ShowApplyTeaHouseListMsg();
            msg.page = page;
            msg.teaHouseId = TeaHouseData.curID;
            msg.content = content;
            ServerUtil.sendMsg(msg, MsgCmdConstant.MSG_TEAHOUSE_SHOW_APPLY_LIST_ACK);
        }

        /** 获取我的战绩列表 */
        public static sendMyRecordListMsg(type: number = 0) {
            let msg = new GetTeaHouseMyRecordMsg();
            msg.teaHouseId = TeaHouseData.curID;
            msg.teaHouseLayer = TeaHouseData.curFloor;
            msg.type = type;
            ServerUtil.sendMsg(msg, MsgCmdConstant.MSG_GET_TEAHOUSE_MY_RECORD_ACK);
        }

        /** 获取总的战绩列表 */
        public static sendAllRecordListMsg() {
            let msg = new GetTeaHouseAllRecordMsg();
            msg.teaHouseId = TeaHouseData.curID;
            msg.teaHouseLayer = TeaHouseData.curFloor;
            ServerUtil.sendMsg(msg, MsgCmdConstant.MSG_GET_TEAHOUSE_ALL_RECORD_ACK);
        }

        /** 获取大赢家列表 */
        public static sendWinnerListMsg() {
            let msg = new BigWinnerShowAndOptMsg();
            msg.houseLayerNum = TeaHouseData.curFloor;
            msg.teaHouseId = TeaHouseData.curID;
            msg.optType = BigWinnerShowAndOptMsg.SHOW_BIG_WINNER_LIST;
            ServerUtil.sendMsg(msg, MsgCmdConstant.MSG_BIG_WINNER_SHOW_AND_OPT_ACK);
        }

        /** 获取经营状况列表 */
        public static sendRsListMsg() {
            let msg = new GetTeaHousePerformanceMsg();
            msg.teaHouseId = TeaHouseData.curID;
            ServerUtil.sendMsg(msg, MsgCmdConstant.MSG_GET_TEAHOUSE_PERFORMANCE_ACK);
        }

        /** 获取战榜列表 */
        public static sendRankingListMsg(type: number) {
            let msg = new ShowTeaHouseWarsListMsg();
            msg.OptType = type;
            msg.teaHouseId = TeaHouseData.curID;
            msg.teaHouseLayerNum = TeaHouseData.curFloor;
            console.log(msg);
            ServerUtil.sendMsg(msg, MsgCmdConstant.MSG_SHOW_TEAHOUSE_WARS_LIST_ACK);
        }
    }
}