module FL {

    export class AgentCmd extends puremvc.SimpleCommand implements puremvc.ICommand {

        public constructor() {
            super();
        }

        public static authListIsLoad:number = 1;

        public execute(notification:puremvc.INotification):void {
            let data:any = notification.getBody();
            switch(notification.getName()) {
                case AgentModule.AGENT_INTO_AGENT:{
                    this.intoAgent(data);
                    break;
                }
                case AgentModule.AGENT_UPDATE_PASSWORD:{
                    this.updatePassword(data);
                    break;
                }
                case AgentModule.AGENT_GET_AUTH_PLAYER:{
                    this.getAuthPlayerList(data);
                    break;
                }
                case AgentModule.AGENT_GET_SUB_PLAYER:{
                    this.getSubPlayerList(data);
                    break;
                }
                case AgentModule.AGENT_GIVE_PLAYER_DIAMOND:{
                    this.givePlayerDiamond(data);
                    break;
                }
                case AgentModule.AGENT_MGR_SYSTEM: {
                    this.locateAgentMgrSystem(data);
                    break;
                }
                case AgentModule.AGENT_SHARE_INVITE_CODE: {
                    this.shareInviteCode();
                    break;
                }
                case AgentModule.AGENT_GET_MGR_SYSTEM_TICKET:{
                    this.getAgentTicket();
                    break;
                }
                case AgentModule.AGENT_SEND_BIND_CODE: {
                    this.bindCode(data);
                    break
                }
            }
        }


        /**
         * AgentDaiKaiMsgAck返回，这个返回要处理很多事情
         * @param {FL.AgentDaiKaiMsgAck} msg
         */
        private intoAgent(msg:AgentDaiKaiMsgAck):void {
            egret.log(msg);
            /** 进入俱乐部*/
            // if(egret.localStorage.getItem("intoClubRoomList") === "1"){
                MvcUtil.send(ClubModule.CLUB_SHOW_ROOM_LIST, msg);
                return;
            // }
            /** 进入代理*/
            // if(egret.localStorage.getItem("firstIntoAgent") === "1"){
            //     if(msg.unused_0 !== LobbyData.playerVO.playerIndex){
            //         MvcUtil.send(AgentModule.AGENT_AUTH_PLAYER_GET_ROOM_LIST, msg);
            //     }else{
            //         AgentGetRoomView.getInstance().initList(msg);
            //     }
            // }else{
            //     if(egret.localStorage.getItem("agentTabIndex") === AGENT_ITEM[2]){
            //         //基础界面
            //         let vAgentBaseView:AgentBaseView = new AgentBaseView();
            //         //添加界面
            //         MvcUtil.addView(vAgentBaseView);
            //     }
            //     egret.localStorage.setItem("firstIntoAgent","1");
            // }

        }

        /**
         * 修改密码
         */
        private updatePassword(msg:ValidateMsgAck):void{
            egret.log(msg);
            let resCode:number = msg.result;
            if(resCode === 1){
                PromptUtil.show(Local.text(1),PromptType.SUCCESS);
            }else{
                PromptUtil.show(Local.text(resCode),PromptType.ERROR);
            }
        }

        /**
         * 获取授权玩家列表
         */
        private getAuthPlayerList(msg:AgentRoomMsgAck):void{
            egret.log(msg);
            let resCode:number = msg.result;
            if(resCode === 0 && AgentCmd.authListIsLoad === 0){
                PromptUtil.show(Local.text(0),PromptType.SUCCESS);
                AgentCmd.authListIsLoad = 1;
                AgentAuthGetRoomView.getInstance().initList(msg);
            }else if(resCode === 0 && AgentCmd.authListIsLoad === 1){
                AgentAuthGetRoomView.getInstance().initList(msg);
            } else{
                AgentCmd.authListIsLoad = 1;
                PromptUtil.show(Local.text(resCode),PromptType.ERROR);
            }
        }

        /**
         * 流水查询
         */
        private getSubPlayerList(msg:GetPlayerDiamondLogAck):void{
            AgentSearchRecordView.getInstance().initList(msg);
        }

        /**
         *赠送玩家钻石
         */
        private givePlayerDiamond(itemID:number):void{
            let vView:AgentGiveDiamondView = AgentGiveDiamondView.getInstance();
            let num = vView.giveNum.text.trim();
            let playerID = vView.playerId.text.trim();
            let password = vView.password.text;
            if(playerID == ""){
                PromptUtil.show("玩家游戏ID不能为空！", PromptType.ERROR);
                return;
            }
            if(password == ""){
                PromptUtil.show("密码不能为空！", PromptType.ERROR);
                return;
            }
            let tMD5:MD5 = new MD5();
            let params = {itemID:itemID,count:parseInt(num),cardNo:playerID,cardPwd:tMD5.hex_md5(password).toUpperCase()};
            let vGameBuyItemMsg  = new GameBuyItemMsg(params);
            ServerUtil.sendMsg(vGameBuyItemMsg, MsgCmdConstant.MSG_GAME_BUY_ITEM_ACK);
        }

        /**
         * 跳转到代理管理界面
         * @param {FL.RequestAgentTicketAck} msg
         */
        private locateAgentMgrSystem(msg:RequestAgentTicketAck):void{
            let ticket:string = msg.ticket;
            let vPlayerVO:PlayerVO = LobbyData.playerVO;
            let playerID:number = vPlayerVO.playerIndex;
            let headImgUrl:string = vPlayerVO.headImageUrl?vPlayerVO.headImageUrl:"";
            if (Game.CommonUtil.isNative) {
                let jsonData = {
                    "eventType": SendNativeMsgType.SEND_NATIVE_OPEN_URL,
                    "data": {
                        "url": GConf.agentUrl+"?playerIndex="+playerID+"&headImageUrl="+headImgUrl+"&ticket="+ticket,
                    }
                }
                NativeBridge.getInstance().sendNativeMessage(JSON.stringify(jsonData));
            }
            else {
                window.location.href = GConf.agentUrl+"?playerIndex="+playerID+"&headImageUrl="+headImgUrl+"&ticket="+ticket;
            }
        }

        /**
         * 分享邀请码
         */
        private shareInviteCode():void{
            if (!GConf.Conf.useWXAuth) {
                PromptUtil.show("请在微信中使用该功能！", PromptType.ALERT);
                return;
            }
            // 分享给好友
            let vPlayerVO:PlayerVO = LobbyData.playerVO;
            let shareToFriendsTitle:string = "【"+StringUtil.subStrSupportChinese(vPlayerVO.playerName, 8)+"】邀请你来玩【"+GConf.Conf.gameName+"】";
            let shareToFriendsDesc:string = "邀请码："+vPlayerVO.inviteCode;
            if (Game.CommonUtil.isNative) {
                let shareData = new nativeShareData();
                shareData.type = ShareWXType.SHARE_URL;
                shareData.url = NativeBridge.mShareUrl;
                shareData.title = shareToFriendsTitle;
                shareData.desc = shareToFriendsDesc;
                shareData.extraType = InviteXLType.INVITE_CODE;
                shareData.extraContent = vPlayerVO.inviteCode + "";
                NativeBridge.getInstance().mShareData = shareData;

                MvcUtil.send(CommonModule.COMMON_NATIVE_SHARE_CHOOSE_ROAD);
            } else {
                WeChatJsSdkHandler.setTempShareInfo(shareToFriendsTitle, shareToFriendsDesc, shareToFriendsTitle, ShareReminderTypeEnum.CIRCLE_OF_FRIENDS);
            }
        }

        /**
         * 获取代理管理登陆校验
         */
        public getAgentTicket():void{
            let vPlayerVO:PlayerVO = LobbyData.playerVO;
            let vRequestAgentTicket:RequestAgentTicket = new RequestAgentTicket();
            vRequestAgentTicket.playerIndex = vPlayerVO.playerIndex;
            ServerUtil.sendMsg(vRequestAgentTicket,MsgCmdConstant.MSG_AGENT_TICKET_ACK);
        }

        /**
         * 绑定邀请码
         * @param data
         */
        public bindCode(data:any){
            Storage.setItem("inviteCode",data.inviteCode);
            let vRequestBindAgent:RequestBindAgent = new RequestBindAgent();
            vRequestBindAgent.type = data.opType;
            vRequestBindAgent.inviteCode = data.inviteCode;
            ServerUtil.sendMsg(vRequestBindAgent,MsgCmdConstant.MSG_GAME_BIND_AGENT_ACK);
        }
    }

}