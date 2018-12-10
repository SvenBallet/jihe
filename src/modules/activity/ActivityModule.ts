module FL {
    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase - ActivityModule
     * @Description:  //活动模块
     * @Create: DerekWu on 2017/11/10 18:48
     * @Version: V1.0
     */
    export class ActivityModule extends FL.ModuleBase {

        /** 模块名 */
        public static readonly NAME = "ActivityModule";
        /** 单例 */
        private static _only: ActivityModule;

        private constructor() {
            super();
        }

        public static getInstance(): ActivityModule {
            if (!this._only) {
                this._only = new ActivityModule();
            }
            return this._only;
        }

        // 进入活动
        public static readonly ACTIVITY_INTO_ACTIVITY:string = "ACTIVITY_INTO_ACTIVITY";

        public static readonly ACTIVITY_REFRESH_VIEW:string = "ACTIVITY_REFRESH_VIEW";
        //登录奖励
        public static readonly LOGIN_REWARD:string = "LOGIN_REWARD";
        //分享
        public static readonly SHARE_REWARD:string = "SHARE_REWARD";
        //开房
        public static readonly KAIFANG_REWARD:string = "KAIFANG_REWARD";
        //推荐
        public static readonly RECOMMEND_REWARD:string = "RECOMMEND_REWARD";
        //领取登录奖励
        public static readonly GET_LOGIN_REWARD_RESULT:string = "GET_LOGIN_REWARD_RESULT";
        //关注有礼
        public static readonly ATTENTION_REWARD:string = "ATTENTION_REWARD";

        public static readonly ACTIVITY_OPEN_WX_PAGE:string = "ACTIVITY_OPEN_WX_PAGE";

        /** */

        protected init(): void {
            let self = this;
            let vProxy:ActivityProxy = ActivityProxy.getInstance();
            self._proxys.push(vProxy);
            let vServerCmds:Array<ServerCmd> = self._serverCmds;
            vServerCmds.push(ServerCmd.buildSendCmd(MsgCmdConstant.MSG_ACTIVITY_SHOW));
            vServerCmds.push(ServerCmd.buildCallBack(MsgCmdConstant.MSG_ACTIVITY_SHOW_ACK, ActivityShowMsgAck, vProxy.exeActivityShowMsgAck, vProxy));
            vServerCmds.push(ServerCmd.buildSendCmd(MsgCmdConstant.MSG_ACTIVITY_GET_REWARD));
            vServerCmds.push(ServerCmd.buildCallBack(MsgCmdConstant.MSG_ACTIVITY_GET_REWARD_ACK, ActivityGetRewardAckMsg, vProxy.exeActivityGetRewardAckMsg, vProxy));
            vServerCmds.push(ServerCmd.buildSendCmd(MsgCmdConstant.MSG_WX_GONGZHONGHAO_ACTIVITY));
            vServerCmds.push(ServerCmd.buildCallBack(MsgCmdConstant.MSG_WX_GONGZHONGHAO_ACTIVITY_ACK, WXGongzhonghaoActivityMsgAck, vProxy.exeWXGongzhonghaoActivityMsgAck, vProxy));
            // vServerCmds.push(ServerCmd.buildCallBack(MsgCmdConstant.MSG_GET_VIP_ROOM_Activity_ACK, GetVipRoomListMsgAck, vProxy.exeActivityMsgAck, vProxy));
            // vServerCmds.push(ServerCmd.buildTranspond(MsgCmdConstant.MSG_ACTIVITY_GET_REWARD, ActivityShowMsgAck, ActivityModule.ACTIVITY_INTO_ACTIVITY));

            //注册客户端指令
            let vCommands = self._commands;
            vCommands.push(new CmdVO(ActivityModule.ACTIVITY_INTO_ACTIVITY, ActivityCmd));
            vCommands.push(new CmdVO(ActivityModule.LOGIN_REWARD, ActivityCmd));
            vCommands.push(new CmdVO(ActivityModule.GET_LOGIN_REWARD_RESULT, ActivityCmd));
            vCommands.push(new CmdVO(ActivityModule.ATTENTION_REWARD, ActivityCmd));
            vCommands.push(new CmdVO(ActivityModule.SHARE_REWARD, ActivityCmd));
            vCommands.push(new CmdVO(ActivityModule.KAIFANG_REWARD, ActivityCmd));
            vCommands.push(new CmdVO(ActivityModule.RECOMMEND_REWARD, ActivityCmd));
            vCommands.push(new CmdVO(ActivityModule.ACTIVITY_OPEN_WX_PAGE, ActivityCmd));
            // SerializerCache.registerByName(VipRoomActivity.NAME, VipRoomActivity);
        }

    }
}