module FL {

    export class AgentProxy extends puremvc.Proxy {

        /** 代理名 */
        public static readonly NAME:string = "AgentProxy";
        /** 单例 */
        private static _only:AgentProxy;

        private constructor() {
            super(AgentProxy.NAME);
        }

        public static getInstance():AgentProxy {
            if (!this._only) {
                this._only = new AgentProxy();
            }
            return this._only;
        }

        /**
         * 消息返回
         * @param {FL.AgentDaiKaiMsgAck} msg
         */
        public exeAgentDaiKaiMsgAck(msg:AgentDaiKaiMsgAck):void{
            MvcUtil.send(AgentModule.AGENT_INTO_AGENT, msg);
        }


        /**
         * 修改密码消息返回
         * @param {FL.ValidateMsgAck} msg
         */
        public exeValidateMsgAck(msg:ValidateMsgAck):void{
            MvcUtil.send(AgentModule.AGENT_UPDATE_PASSWORD, msg);
        }


        public exeAgentRoomMsgAck(msg:AgentRoomMsgAck):void{
            MvcUtil.send(AgentModule.AGENT_GET_AUTH_PLAYER, msg);
        }


        public exeGetPlayerDiamondLogAck(msg:GetPlayerDiamondLogAck):void{
            MvcUtil.send(AgentModule.AGENT_GET_SUB_PLAYER, msg);
        }

        /**
         * 代理信息返回
         * @param {FL.RequestAgentInfoAck} msg
         */
        public exeRequestAgentInfoAck(msg:RequestAgentInfoAck):void{
            MvcUtil.send(AgentModule.AGENT_UPDATE_AGENT_INFO, msg);
        }

        /**
         * 代理管理登陆校验
         * @param {FL.RequestAgentTicketAck} msg
         */
        public exeRequestAgentTicketAck(msg:RequestAgentTicketAck):void{
            MvcUtil.send(AgentModule.AGENT_MGR_SYSTEM, msg);
        }

        /**
         *绑定上下级返回
         * @param {FL.RequestBindAgentAck} msg
         */
        public exeRequestBindAgentAck(msg:RequestBindAgentAck):void{
            let resCode:number = msg.result;
            let type:number = msg.type;
            if(resCode === 1){
                let inviteCode:string = Storage.getItem("inviteCode");
                if(type === 0){
                    let params = {opType:1, inviteCode:inviteCode};
                    ReminderViewUtil.showReminderView({hasLeftBtn:true, hasRightBtn:true,leftCallBack:new MyCallBack(MvcUtil.send, MvcUtil, AgentModule.AGENT_SEND_BIND_CODE,params), text:msg.content});
                }else if(type === 1){
                    ReminderViewUtil.showReminderView({hasLeftBtn:true, text:msg.content});
                    if(Storage.getItem("MallSetInviteCode") === "1"){
                        let vRefreshItemBaseMsg:RefreshItemBaseMsg  = new RefreshItemBaseMsg();
                        vRefreshItemBaseMsg.account = LobbyData.playerVO.account;
                        ServerUtil.sendMsg(vRefreshItemBaseMsg, MsgCmdConstant.MSG_GAME_REFRESH_ITEM_BASE_ACK);
                        Storage.removeItem("MallSetInviteCode");
                    }else if(Storage.getItem("MallSetInviteCode") === "2"){
                        MvcUtil.send(LobbyModule.LOBBY_INTO_LOBBY);
                        Storage.removeItem("MallSetInviteCode");
                    }
                    else{
                        MvcUtil.send(AgentModule.AGENT_GET_AGENT_INFO);
                    }
                }
                Storage.removeItem("inviteCode");
            }else{
                ReminderViewUtil.showReminderView({hasLeftBtn:true, text:msg.content});
            }
        }

    }
}