module FL {
    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase - PayProxy
     * @Description:  //充值代理
     * @Create: DerekWu on 2017/11/10 16:14
     * @Version: V1.0
     */
    export class PayProxy extends puremvc.Proxy {

        /** 代理名 */
        public static readonly NAME:string = "PayProxy";
        /** 单例 */
        private static _only:PayProxy;

        private constructor() {
            super(PayProxy.NAME);
        }

        public static getInstance():PayProxy {
            if (!this._only) {
                this._only = new PayProxy();
            }
            return this._only;
        }

        /**
         * 处理购买道具回复消息
         * @param {FL.GameBuyItemAckMsg} msg
         */
        public exeGameBuyItemAckMsg(msg:GameBuyItemAckMsg):void {
            egret.log(msg);
            let resCode:number = msg.result;

            if(resCode == GameConstant.ADMIN_OPERATION_RESULT){
                ReminderViewUtil.showReminderView({hasLeftBtn:true, hasRightBtn:true, text:msg.sign});
            } else if(resCode == GameConstant.DISMISS_VIP_TABLE_FAILED){
                if(msg.payType === 0){
                    ReminderViewUtil.showReminderView({hasLeftBtn:true, hasRightBtn:true, text:msg.order});
                }else if(msg.payType === 1){
                    ReminderViewUtil.showReminderView({hasLeftBtn:true, hasRightBtn:true, leftCallBack:new MyCallBack(this.confirmDismissRoom,this,msg.sign),text:msg.order});
                }
            } else if(resCode == GameConstant.SEND_PLAYER_DIAMOND_FAILED){
                PromptUtil.show(Local.text(1),PromptType.ERROR);
            } else if(resCode == GameConstant.SEND_PLAYER_DIAMOND_SUCCESSFULLY){
                PromptUtil.show(Local.text(0),PromptType.SUCCESS);
            } else if(resCode == GameConstant.SEND_PLAYER_DIAMOND_FAILED___DIAMOND_NOT_ENOUGH){
                ReminderViewUtil.showReminderView({hasLeftBtn:true, hasRightBtn:true, text:"您的钻石不足"});
            } else if(resCode == GameConstant.SEND_PLAYER_DIAMOND_FAILED___TARGET_PLAYER_NOT_FOUND){
                ReminderViewUtil.showReminderView({hasLeftBtn:true, hasRightBtn:true, text:"玩家ID不存在"});
            } else if(resCode == GameConstant.SEND_PLAYER_DIAMOND_FAILED___PASSWORD_WRONG){
                ReminderViewUtil.showReminderView({hasLeftBtn:true, hasRightBtn:true, text:"密码错误"});
            } else if(resCode == GameConstant.SEND_PLAYER_DIAMOND_FAILED___TARGET_PLAYER_TYPE_ERROR){
                ReminderViewUtil.showReminderView({hasLeftBtn:true, hasRightBtn:true, text:"对方不是普通玩家"});
            } else if(resCode == GameConstant.SEND_PLAYER_DIAMOND_CHECK_SUCCESSFULLY){
                let diamondNum:string =  AgentGiveDiamondView.getInstance().giveNum.text.trim();
                ReminderViewUtil.showReminderView({hasLeftBtn:true, hasRightBtn:true, leftCallBack:new MyCallBack(MvcUtil.send, MvcUtil,AgentModule.AGENT_GIVE_PLAYER_DIAMOND,GameConstant.SEND_PLAYER_DIAMOND_CMD_CONFIRMED), text:"是否赠送给玩家【"+msg.sign+"】,钻石【"+diamondNum+"】颗？"});
            } else if (resCode === GameConstant.SEND_PLAYER_SHARE_TO_WX_TIP) {
                //微信分享获得钻石次数为1
                LobbyHandler.setWeChatShareGetDiamondCount(1);
            } else if (resCode === GameConstant.SEND_PLAYER_SHARE_TO_WX_SUCCESSFULLY) {
                //微信分享成功获得钻石
                LobbyHandler.setWeChatShareGetDiamondCount(msg.unused_0);
                ReminderViewUtil.showReminderView({hasLeftBtn:true, hasRightBtn:true, text:"分享到朋友圈成功，获得钻石"+msg.unused_1+"颗!"});
                //刷新红点指令
                MvcUtil.send(LobbyModule.LOBBY_SHARE_CIRCLE_ADD_DIAMOND);
            }else if(resCode === GameConstant.SUPER_ADMIN_OPERTAION_INFO_GET_PAY_BACK) {
                // 更改界面显示
                MvcUtil.send(AgentModule.AGENT_UPDATE_PAY_BACK, msg.unused_0);
                // 获取返利返回
                ReminderViewUtil.showReminderView({hasLeftBtn:true, hasRightBtn:true, text:msg.sign});
            }else if(resCode === GameConstant.REJECT_TABLE_PLAYER_ACK){
                if (msg.payType === 0) {
                    PromptUtil.show("移除成功",PromptType.SUCCESS);
                    MvcUtil.send(ClubModule.CLUB_GET_ROOM_LIST);
                }else{
                    PromptUtil.show("移除失败",PromptType.ERROR);
                }
            }
            if(resCode == 0){
                // 微信支付订单消息处理
                if (msg.payType == 6) {
                    let msgOrder = JSON.parse(msg.otherstr);
                    let order:any = {
                        "appid": msgOrder.appid,
                        "partnerid": msgOrder.mch_id,
                        "prepayid": msgOrder.prepayid,
                        "noncestr": msgOrder.noncestr,
                        "timestamp": msgOrder.timestamp,
                        "package": "Sign=WXPay",
                        "sign": msgOrder.sign
                    }
                    if (Game.CommonUtil.IsIos) {
                        order = JSON.stringify(order);
                    }
                    let payData = {
                    "eventType": SendNativeMsgType.SEND_NATIVE_SEND_WX_PAY,
                    "data": {
                        "order": order
                    }
                }
                NativeBridge.getInstance().sendNativeMessage(JSON.stringify(payData));
                }
                else {
                    PromptUtil.show(Local.text(0),PromptType.SUCCESS);
                }
            }
            if(resCode >1300 && resCode<1309){
                PromptUtil.show(Local.text(resCode),PromptType.ERROR);
            }

            if(resCode == 512){
                AgentPlayerManageView.getInstance().setContent(msg);
            }
        }

        /**
         * 确认解散桌子
         * @param {string} cardNo
         */
        private confirmDismissRoom(cardNo:string):void{
            let vParams = {itemID:GameConstant.DISMISS_VIP_TABLE_BY_ADMIN_CONFIRMED,cardNo:cardNo};
            ServerUtil.sendMsg(new GameBuyItemMsg(vParams), MsgCmdConstant.MSG_GAME_BUY_ITEM_ACK);
        }

    }
}