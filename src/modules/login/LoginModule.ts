module FL {
	/**
	 * 登录模块
	 */
	export class LoginModule extends FL.ModuleBase {

		/** 模块名 */
		public static readonly NAME = "LoginModule";
		/** 单例 */
		private static _only: LoginModule;

		private constructor() {
			super();
		}

		public static getInstance(): LoginModule {
			if (!this._only) {
				this._only = new LoginModule();
			}
			return this._only;
		}

        /** 其他地方登录， 呗踢下线*/
        public static readonly LOGIN_OTHER_LOGIN:string = "LOGIN_OTHER_LOGIN";
        /** 开发版本登录 */
        public static readonly LOGIN_DEV_LOGIN:string = "LOGIN_DEV_LOGIN";
        /** 微信登录 */
        public static readonly LOGIN_WEIXIN_LOGIN:string = "LOGIN_WEIXIN_LOGIN";
        /** 微信登录异常 */
        public static readonly LOGIN_WEIXIN_LOGIN_ERROR:string = "LOGIN_WEIXIN_LOGIN_ERROR";
        /** 账号是否存在 */
        public static readonly LOGIN_IS_ACCOUNT_EXIST:string = "LOGIN_IS_ACCOUNT_EXIST";

		protected init(): void {
			let self = this;
            let vProxy:LoginProxy = LoginProxy.getInstance();
            self._proxys.push(vProxy);

            //注册服务端指令
            let vServerCmds:Array<ServerCmd> = self._serverCmds;
            vServerCmds.push(ServerCmd.buildSendCmd(MsgCmdConstant.MSG_GAME_LOGIN));
            vServerCmds.push(ServerCmd.buildCallBack(MsgCmdConstant.MSG_GAME_LOGIN_ACK, LoginMsgAck, vProxy.exeLoginMsgAck, vProxy));
            vServerCmds.push(ServerCmd.buildTranspond(MsgCmdConstant.MSG_GAME_H5_WX_LOGIN_ERROR_ACK, H5WXLoginMsgErrorAck, LoginModule.LOGIN_WEIXIN_LOGIN_ERROR));
            vServerCmds.push(ServerCmd.buildTranspond(MsgCmdConstant.MSG_GAME_OTHERLOGIN_ACK, OtherLoginMsgAck, LoginModule.LOGIN_OTHER_LOGIN));
            vServerCmds.push(ServerCmd.buildTranspond(MsgCmdConstant.MSG_GAME_IS_ACCOUNT_EXIST, CheckPlayerExist, LoginModule.LOGIN_IS_ACCOUNT_EXIST));

            //注册客户端指令
            let vCommands = self._commands;
            vCommands.push(new CmdVO(LoginModule.LOGIN_OTHER_LOGIN, LoginCmd));
            vCommands.push(new CmdVO(LoginModule.LOGIN_DEV_LOGIN, LoginCmd));
            vCommands.push(new CmdVO(LoginModule.LOGIN_WEIXIN_LOGIN, LoginCmd));
            vCommands.push(new CmdVO(LoginModule.LOGIN_WEIXIN_LOGIN_ERROR, LoginCmd));
            vCommands.push(new CmdVO(LoginModule.LOGIN_IS_ACCOUNT_EXIST, LoginCmd));

            //注册序列化对象
            SerializerCache.registerByName(CardDown.NAME, CardDown);
            SerializerCache.registerByName(Player.NAME, Player);
            SerializerCache.registerByName(ItemBase.NAME, ItemBase);
            SerializerCache.registerByName(FriendPlayer.NAME, FriendPlayer);
            SerializerCache.registerByName(GameRoom.NAME, GameRoom);
            SerializerCache.registerByName(SystemConfigPara.NAME, SystemConfigPara);

		}
		
	}
}