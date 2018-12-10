module FL {
    
    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  GxnjyWeb - CommonModule
     * @Description:  //公共模块
     * @Create: DerekWu on 2017/7/28 21:41
     * @Version: V1.0
     */
    export class CommonModule extends FL.ModuleBase {

        /** 模块名 */
        public static readonly NAME = "CommonModule";
        /** 单例 */
        private static _onlyOne:CommonModule;

        private constructor() {
            super();
        }

        public static getInstance():CommonModule {
            if (!this._onlyOne) {
                this._onlyOne = new CommonModule();
            }
            return this._onlyOne;
        }

        /** =============客户端 指令开始================= */
        /** 预加载结束 */
        public static readonly COMMON_PRELOAD_OVER:string = "COMMON_PRELOAD_OVER";
        /** 初始化登录信息 */
        public static readonly COMMON_INIT_LOGIN_INFO:string = "COMMON_INIT_LOGIN_INFO";
        /** 开始加载，需要回调对象 MyCallBack，会吧新建的加载界面回调回来，先创建并显示加载界面，然后回调里面增加 */
        public static readonly COMMON_START_LOADING:string = "COMMON_START_LOADING";
        /** 基础资源解析结束指令 */
        public static readonly COMMON_BASE_RES_PARSE_OVER:string = "COMMON_BASE_RES_PARSE_OVER";
        /** 发生异步异常异常 */
        public static readonly COMMON_ERROR_ASYNC:string = "COMMON_ERROR_ASYNC";
        /** 显示提示信息 */
        public static readonly COMMON_SHOW_PROMPT:string = "COMMON_SHOW_PROMPT";
        /** 移除多有loading */
        public static readonly COMMON_MOVE_ALL_LOADING:string = "COMMON_MOVE_ALL_LOADING";
        /** 显示分享提示界面 ShareReminderView */
        public static readonly COMMON_SHOW_SHARE_REMINDER_VIEW:string = "COMMON_SHOW_SHARE_REMINDER_VIEW";
        /** 关闭分享提示界面 ShareReminderView */
        public static readonly COMMON_CLOSE_SHARE_REMINDER_VIEW:string = "COMMON_CLOSE_SHARE_REMINDER_VIEW";


        /** 分享给好友/群 成功 */
        public static readonly COMMON_SHARE_TO_FRIENDS_SUCCESS:string = "COMMON_SHARE_TO_FRIENDS_SUCCESS";
        /** 分享给好友/群 取消分享 */
        public static readonly COMMON_SHARE_TO_FRIENDS_CANCEL:string = "COMMON_SHARE_TO_FRIENDS_CANCEL";
        /** 分享到朋友选 成功 */
        public static readonly COMMON_SHARE_TO_CIRCLE_OF_FRIENDS_SUCCESS:string = "COMMON_SHARE_TO_CIRCLE_OF_FRIENDS_SUCCESS";
        /** 分享到朋友圈 取消分享 */
        public static readonly COMMON_SHARE_TO_CIRCLE_OF_FRIENDS_CANCEL:string = "COMMON_SHARE_TO_CIRCLE_OF_FRIENDS_CANCEL";
        /** 开始微信录音，显示录音界面等 */
        public static readonly COMMON_WE_CHAT_START_RECORD:string = "COMMON_WE_CHAT_START_RECORD";
        /** 停止微信录音，各个模块自己处理，同事会关闭录音界面 */
        public static readonly COMMON_WE_CHAT_STOP_RECORD:string = "COMMON_WE_CHAT_STOP_RECORD";
        /** 开始播放录音，通知界面去做表现 */
        public static readonly COMMON_WE_CHAT_VOICE_PLAY_START:string = "COMMON_WE_CHAT_VOICE_PLAY_START";
        /** 微信播放录音结束，通知界面移除表现 */
        public static readonly COMMON_WE_CHAT_VOICE_PLAY_END:string = "COMMON_WE_CHAT_VOICE_PLAY_END";
        // /** 接收到服务器发来的录音 */
        // public static readonly COMMON_RECEIVE_WE_CHAT_RECORD:string = "COMMON_RECEIVE_WE_CHAT_RECORD";

        /**原生分享 */
        public static readonly COMMON_NATIVE_SHARE: string = "COMMON_NATIVE_SHARE";
        /**原生分享方式选择 */
        public static readonly COMMON_NATIVE_SHARE_CHOOSE_ROAD: string = "COMMON_NATIVE_SHARE_CHOOSE_ROAD";
        /**原生跳转其他应用选择 */
        public static readonly COMMON_NATIVE_OPEN_CHOOSE_ROAD: string = "COMMON_NATIVE_OPEN_CHOOSE_ROAD";
        /**原生解析剪贴板内容 */
        public static readonly COMMON_NATIVE_PARSE_CLIPBOARD: string = "COMMON_NATIVE_PARSE_CLIPBOARD";
        /**原生获取魔窗参数 */
        public static readonly COMMON_NATIVE_PARSE_MV_PARAM: string = "COMMON_NATIVE_PARSE_MV_PARAM";
        /**原生返回键点击 */
        public static readonly COMMON_NATIVE_ONTOUCH_BACK: string = "COMMON_NATIVE_ONTOUCH_BACK";
        /**原生登陆view创建完成后 */
        public static readonly COMMON_NATIVE_INIT_DATA: string = "COMMON_NATIVE_INIT_DATA";
        /**更新电量 */
        public static readonly COMMON_RE_BATTERY: string = "COMMON_RE_BATTERY";
        /**更新网络 */
        public static readonly COMMON_RE_CONNECT_STATE: string = "COMMON_RE_CONNECT_STATE";
        /**更新录音振幅 */
        public static readonly COMMON_RE_TALK_VOICE: string = "COMMON_RE_TALK_VOICE";
        /**语音传至后端 */
        public static readonly COMMON_SEND_TALK_VOICE: string = "COMMON_SEND_TALK_VOICE";
        /**显示语音播放动画virtual */
        public static readonly COMMON_SHOW_TALK_ANI: string = "COMMON_SHOW_TALK_ANI";
        /**隐藏语音播放动画virtual */
        public static readonly COMMON_HIDE_TALK_ANI: string = "COMMON_HIDE_TALK_ANI";
        /**显示语音播放动画 */
        public static readonly COMMON_SHOW_TALK_ANI_REALY: string = "COMMON_SHOW_TALK_ANI_REALY";
        /**隐藏语音播放动画 */
        public static readonly COMMON_HIDE_TALK_ANI_REALY: string = "COMMON_HIDE_TALK_ANI_REALY";
        /**更新玩家GPS信息 */
        public static readonly COMMON_CHANGE_GPS: string = "COMMON_CHANGE_GPS";
        /**更新网络延时 */
        public static readonly COMMON_CHANGE_NET_MS: string = "COMMON_CHANGE_NET_MS";
        /**房间未开始时解散，进入茶楼或大厅 */
        public static readonly COMMON_DISS_BACK_TEAHOUSE_OR_LOBBY: string = "COMMON_DISS_BACK_TEAHOUSE_OR_LOBBY";
        /** 闲聊邀请 */
        public static readonly COMMON_XL_INVITE: string = "COMMON_XL_INVITE";
        /** 微信小程序邀请 */
        public static readonly COMMON_WX_MINI_PARAM: string = "COMMON_WX_MINI_PARAM";

        /** =============客户端 指令结束================= */

        protected init(): void {
            let self = this;
            let vProxy:CommonProxy = CommonProxy.getInstance();
            self._proxys.push(vProxy);

            //注册服务端指令
            let vServerCmds:Array<ServerCmd> = self._serverCmds;
            vServerCmds.push(ServerCmd.buildSendCmd(MsgCmdConstant.MSG_LINK_VALIDATION));
            vServerCmds.push(ServerCmd.buildCallBack(MsgCmdConstant.MSG_LINK_VALIDATION_ACK, LinkValidationMsgAck, vProxy.exeLinkValidationAck, vProxy));
            vServerCmds.push(ServerCmd.buildCallBack(MsgCmdConstant.MSG_HEART_BEATING, HeartBeatingMsg, vProxy.exeHeartBeatingMsg, vProxy));
            vServerCmds.push(ServerCmd.buildCallBack(MsgCmdConstant.MSG_WE_CHAT_VOICE, WeChatVoiceMsg, vProxy.exeWeChatVoiceMsg, vProxy));

            // 新显示提示消息处理
            vServerCmds.push(ServerCmd.buildCallBack(MsgCmdConstant.MSG_SHOW_TIP_MSG_ACK_NEW, NewShowTipAckMsg, vProxy.exeNewShowTipAckMsg, vProxy));

            //注册客户端指令
            let vCommands = self._commands;
            vCommands.push(new CmdVO(CommonModule.COMMON_PRELOAD_OVER, LoadingCmd));

            vCommands.push(new CmdVO(CommonModule.COMMON_INIT_LOGIN_INFO, CommonCmd));
            vCommands.push(new CmdVO(CommonModule.COMMON_ERROR_ASYNC, CommonCmd));
            vCommands.push(new CmdVO(CommonModule.COMMON_SHOW_PROMPT, CommonCmd));
            vCommands.push(new CmdVO(AppModule.APP_SOCKET_INIT_COMPLETE, CommonCmd));
            vCommands.push(new CmdVO(AppModule.APP_SOCKET_CLOSED, CommonCmd));
            vCommands.push(new CmdVO(AppModule.APP_SOCKET_ERROR, CommonCmd));
            vCommands.push(new CmdVO(AppModule.APP_INTO_BACKSTAGE, CommonCmd));
            vCommands.push(new CmdVO(AppModule.APP_BACK_FROM_BACKSTAGE, CommonCmd));
            vCommands.push(new CmdVO(CommonModule.COMMON_START_LOADING, LoadingCmd));
            vCommands.push(new CmdVO(CommonModule.COMMON_SHOW_SHARE_REMINDER_VIEW, CommonCmd));
            vCommands.push(new CmdVO(CommonModule.COMMON_CLOSE_SHARE_REMINDER_VIEW, CommonCmd));
            vCommands.push(new CmdVO(CommonModule.COMMON_SHARE_TO_CIRCLE_OF_FRIENDS_SUCCESS, CommonCmd));
            vCommands.push(new CmdVO(CommonModule.COMMON_WE_CHAT_START_RECORD, CommonCmd));
            // vCommands.push(new CmdVO(CommonModule.COMMON_WE_CHAT_STOP_RECORD, CommonCmd));
            vCommands.push(new CmdVO(CommonModule.COMMON_NATIVE_SHARE, CommonCmd));
            vCommands.push(new CmdVO(CommonModule.COMMON_NATIVE_SHARE_CHOOSE_ROAD, CommonCmd));
            vCommands.push(new CmdVO(CommonModule.COMMON_NATIVE_OPEN_CHOOSE_ROAD, CommonCmd))
            vCommands.push(new CmdVO(CommonModule.COMMON_NATIVE_PARSE_CLIPBOARD, CommonCmd));
            vCommands.push(new CmdVO(CommonModule.COMMON_NATIVE_PARSE_MV_PARAM, CommonCmd));
            vCommands.push(new CmdVO(CommonModule.COMMON_NATIVE_ONTOUCH_BACK, CommonCmd));
            vCommands.push(new CmdVO(CommonModule.COMMON_NATIVE_INIT_DATA, CommonCmd));

            vCommands.push(new CmdVO(CommonModule.COMMON_RE_BATTERY, CommonCmd));
            vCommands.push(new CmdVO(CommonModule.COMMON_RE_CONNECT_STATE, CommonCmd));
            vCommands.push(new CmdVO(CommonModule.COMMON_RE_TALK_VOICE, CommonCmd));
            vCommands.push(new CmdVO(CommonModule.COMMON_SEND_TALK_VOICE, CommonCmd));
            vCommands.push(new CmdVO(CommonModule.COMMON_SHOW_TALK_ANI, CommonCmd));
            vCommands.push(new CmdVO(CommonModule.COMMON_HIDE_TALK_ANI, CommonCmd));
            vCommands.push(new CmdVO(CommonModule.COMMON_SHOW_TALK_ANI_REALY, CommonCmd));
            vCommands.push(new CmdVO(CommonModule.COMMON_HIDE_TALK_ANI_REALY, CommonCmd));
            vCommands.push(new CmdVO(CommonModule.COMMON_CHANGE_GPS, CommonCmd));
            vCommands.push(new CmdVO(CommonModule.COMMON_CHANGE_NET_MS, CommonCmd));
            vCommands.push(new CmdVO(CommonModule.COMMON_DISS_BACK_TEAHOUSE_OR_LOBBY, CommonCmd));
            vCommands.push(new CmdVO(CommonModule.COMMON_XL_INVITE, CommonCmd));
            vCommands.push(new CmdVO(CommonModule.COMMON_WX_MINI_PARAM, CommonCmd));
        }

    }

}