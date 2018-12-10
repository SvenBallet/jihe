module FL {
    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase - RecordModule
     * @Description:  //大厅模块
     * @Create: DerekWu on 2017/11/10 18:48
     * @Version: V1.0
     */
    export class RecordModule extends FL.ModuleBase {

        /** 模块名 */
        public static readonly NAME = "RecordModule";
        /** 单例 */
        private static _only: RecordModule;

        private constructor() {
            super();
        }

        public static getInstance(): RecordModule {
            if (!this._only) {
                this._only = new RecordModule();
            }
            return this._only;
        }

        /** 进入对战记录 */
        public static readonly RECORD_INTO_RECORD:string = "RECORD_INTO_RECORD";
        /** 进入授权代理对战记录 */
        public static readonly RECORD_INTO_AGENT_RECORD:string = "RECORD_INTO_AGENT_RECORD";

        /** */

        protected init(): void {
            let self = this;
            // let vProxy:RecordProxy = RecordProxy.getInstance();
            // self._proxys.push(vProxy);

            // //绑定对战记录回复消息
            // BindManager.addAttrListener(RecordProxy.recordMsgAckBindId(), vProxy.exeRecordMsgAck, vProxy);

            let vServerCmds:Array<ServerCmd> = self._serverCmds;
            // vServerCmds.push(ServerCmd.buildCallBack(MsgCmdConstant.MSG_GET_VIP_ROOM_RECORD_ACK, GetVipRoomListMsgAck, vProxy.exeRecordMsgAck, vProxy));
            vServerCmds.push(ServerCmd.buildTranspond(MsgCmdConstant.MSG_GET_VIP_ROOM_RECORD_ACK, GetVipRoomListMsgAck, RecordModule.RECORD_INTO_RECORD));
            vServerCmds.push(ServerCmd.buildTranspond(MsgCmdConstant.MSG_GET_VIP_ROOM_RECORD_ACK2, VipRoomRecordAckMsg2, RecordModule.RECORD_INTO_AGENT_RECORD));

            //注册客户端指令
            let vCommands = self._commands;
            vCommands.push(new CmdVO(RecordModule.RECORD_INTO_RECORD, RecordCmd));
            vCommands.push(new CmdVO(RecordModule.RECORD_INTO_AGENT_RECORD, RecordCmd));

            SerializerCache.registerByName(VipRoomRecord.NAME, VipRoomRecord);
            SerializerCache.registerByName(VipRoomRecord2.NAME, VipRoomRecord2);
        }

    }
}