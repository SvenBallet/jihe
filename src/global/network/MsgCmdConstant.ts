module FL {

    /**
     * 所有和服务器通讯的消息都定义在这里，和服务器对应
     * 注意：才对接完成的后面，写上  //ok
     */
    export class MsgCmdConstant {
        //系统维护类消息
        /**心跳消息发送***/
        public static readonly MSG_GROUP_SYSTEM_MAINTAIN_START: number = 0xa10000;
        public static readonly MSG_HEART_BEATING: number = 0xa10001;  //ok
        public static readonly MSG_HEART_BEATING_ACK: number = 0xa10002; //ok

        /***链接之后发送确认链接消息***/
        public static readonly MSG_LINK_VALIDATION: number = 0xa10003; //ok
        public static readonly MSG_LINK_VALIDATION_ACK: number = 0xa10004; //ok
        /**玩家断开，这个消息可以由大厅发给dbgate，或者gs发给dbgate**/
        public static readonly MSG_PLAYER_OFFLINE: number = 0xa10005;
        /**服务器状态健康状态更新**/
        public static readonly MSG_SERVER_STATUS_UPDATE: number = 0xa10006;
        /**底层通知应用曾，网络断开**/
        public static readonly MSG_LINK_BROKEN: number = 0xa10007;
        /**客户端重链接到大厅**/
        public static readonly MSG_LOBBY_CLIENT_LINK_RECONNECT: number = 0xa10008;

        /**服务端人数*/
        public static readonly MSG_SERVER_ONLINENUM: number = 0xa10009;

        //
        public static readonly MSG_GROUP_SYSTEM_MAINTAIN_END: number = 0xb20000;
        //////////////////////////////////////////////////////////////////


        /**游戏补丁文件服务器***/
        public static readonly MSG_GROUP_PATCH_SERVER_START: number = 0xb20000;

        /**客户端请求补丁文件列表**/
        public static readonly MSG_GET_PATCH_FILE_LIST: number = 0xb20001;
        public static readonly MSG_GET_PATCH_FILE_LIST_ACK: number = 0xb20002;
        /**客户端请求补丁文件**/
        public static readonly MSG_GET_PATCH_FILE: number = 0xb20003;
        public static readonly MSG_GET_PATCH_FILE_ACK: number = 0xb20004;


        //////////////////////////////////////////////////////////////
        public static readonly MSG_GROUP_PATCH_SERVER_END: number = 0xc30000;
        //游戏消息
        /**心跳消息发送***/
        public static readonly MSG_GROUP_GAME_START: number = 0xc30000;

        public static readonly MSG_GAME_LOGIN: number = 0xc30001;


        public static readonly MSG_GAME_UPDATE_PLAYER_PROPERTY: number = 0xc30002;

        public static readonly MSG_GAME_START_GAME_REQUEST: number = 0xc30003;
        public static readonly MSG_GAME_START_GAME_REQUEST_ACK: number = 0xc30004;


        /**客户端通知服务端抽奖消息*/
        public static readonly MSG_GAME_LUCKYDRAW: number = 0xc30005;
        /**服务端返回客户端的抽奖消息*/
        public static readonly MSG_GAME_LUCKYDRAW_ACK: number = 0xc30006;

        //客户端通知游戏服务器，玩家得分进展
        public static readonly MSG_GAME_GAME_UPDATE: number = 0xc30007;

        /**客户端通知游戏服务器，玩家的某些行为***/
        public static readonly MSG_GAME_GAME_OPERTAION: number = 0xc30008;
        /**客户端通知游戏服务器，玩家的某些行为***/
        public static readonly MSG_GAME_GAME_OPERTAION_ACK: number = 0xc30009;

        /***提交gps坐标***/
        public static readonly MSG_UPDATE_GPS_POSITION: number = 0xc3000a;


        /**游戏结束**/
        public static readonly MSG_GAME_GAME_OVER: number = 0xc3000c;
        public static readonly MSG_GAME_GAME_OVER_ACK: number = 0xc3000d;

        /**客户端通知服务端获取礼物列表消息*/
        public static readonly MSG_GAME_GET_PRIZE_LIST: number = 0xc30011;
        /**服务端返回客户端返回礼物列表消息*/
        public static readonly MSG_GAME_GET_PRIZE_LIST_ACK: number = 0xc30012;

        /**客户端通知服务端返回排行榜的消息*/
        public static readonly MSG_GAME_GET_RANKING_LIST: number = 0xc30013;
        /**服务端返回给客户端的排行榜消息*/
        public static readonly MSG_GAME_GET_RANKING_LIST_ACK: number = 0xc30014;

        /**服务端通知客户端滚动条消息*/
        public static readonly MSG_GAME_SEND_SCROLL_MES: number = 0xc30015;

        /**服务端返回给客户端，通知客户端更新一个属性*/
        public static readonly MSG_GAME_UPDATE_PLAYER_ONE_PROPERTY: number = 0xc30016;

        /** 服务器通知客户端更新整个道具列表***/
        public static readonly MSG_GAME_UPDATE_PLAYER_ITEM_LIST: number = 0xc30017;

        /** 购买大礼包返回***/
        public static readonly MSG_GAME_BUY_BIG_GIFT_PACK_ACK: number = 0xc30018;

        /**客户端通知服务端返回动物彩票个人数据的消息*/
        public static readonly MSG_GAME_GET_ANIMALINFOR: number = 0xc30019;
        /**服务端返回给客户端的动物彩票个人数据消息*/
        public static readonly MSG_GAME_GET_ANIMALINFOR_ACK: number = 0xc3001a;
        /**客户端通知服务端客户购买了彩票并要求返回动物彩票个人数据的消息*/
        public static readonly MSG_GAME_BUY_TICKET: number = 0xc3001b;
        /**客户端通知服务端客户领取了奖金并要求返回动物彩票个人数据的消息*/
        public static readonly MSG_GAME_GET_ANIMALAWARD: number = 0xc3001c;


        /**客户端请求获得玩家任务列表*/
        public static readonly MSG_CLIENT_GET_PLAYER_TASK_MSG: number = 0xc3001d;
        /**客户端请求获得玩家任务列表 返回*/
        public static readonly MSG_CLIENT_GET_PLAYER_TASK_MSG_ACK: number = 0xc3001f;

        /***玩家发送一个操作给服务器，带一个字符串***/
        public static readonly MSG_GAME_SEND_PLAYER_OPERATIOIN_STRING: number = 0xc30020;

        //玩家断线重链接
        public static readonly MSG_GAME_RECONNECT_IN: number = 0xc30021;

        //换名字返回
        public static readonly MSG_GAME_CHANGENAME_ACK: number = 0xc30022;

        public static readonly MSG_GAME_LOGIN_ACK: number = 0xc30023; //ok

        /**查询玩家好友*/
        public static readonly MSG_GAME_GET_PLAYER_FINDFRIEND_ACK: number = 0xc30024;

        //换性别返回
        public static readonly MSG_GAME_CHANGESEX_ACK: number = 0xc30025;

        /** H5微信登录 */
        public static readonly MSG_GAME_H5_WX_LOGIN: number = 0xc30026;
        /** H5微信登录错误返回 */
        public static readonly MSG_GAME_H5_WX_LOGIN_ERROR_ACK: number = 0xc30027;

        // 注册时获取手机注册验证码
        public static readonly MSG_MOBILE_CODE: number = 0xc30053;
        public static readonly MSG_MOBILE_CODE_ACK: number = 0xc30054;

        //注册新用户
        public static readonly MSG_GAME_REGISTER_PLAYER: number = 0xc30055;

        //牌局开始
        public static readonly MSG_GAME_START_GAME: number = 0xc30060;

        //提醒玩家进行操作
        public static readonly MSG_GAME_PLAYER_OPERATION_NOTIFY: number = 0xc30061;

        //客户端发给服务器的玩家在牌桌上的操作行为
        public static readonly MSG_GAME_PLAYER_TABLE_OPERATION: number = 0xc30062;

        //客户端请求获取玩家所有VIP房间记录
        public static readonly MSG_GET_VIP_ROOM_RECORD: number = 0xc30063;
        public static readonly MSG_GET_VIP_ROOM_RECORD_ACK: number = 0xc30064;
        public static readonly MSG_GET_VIP_ROOM_RECORD_ACK2: number = 0xc30086;

        //客户端请求获取玩家指定VIP房间记录中的所有游戏记录
        public static readonly MSG_GET_VIP_GAME_RECORD: number = 0xc30065;
        public static readonly MSG_GET_VIP_GAME_RECORD_ACK: number = 0xc30066;

        //信息模块
        public static readonly MSG_POST_USER_INFO: number = 0xc30067;
        public static readonly MSG_POST_USER_INFO_ACK: number = 0xc30068;

        //验证消息
        public static readonly MSG_GAME_VALIDATENAME_ACK: number = 0xc30070;

        //购买道具生成支付宝订单号
        public static readonly MSG_GAME_BUY_ITEM: number = 0xc30071;
        public static readonly MSG_GAME_BUY_ITEM_ACK: number = 0xc30072;
        //购买道具微信公众号支付回复
        public static readonly MSG_GAME_BUY_ITEM_WXGZH_ACK: number = 0xc30073;

        //好友相关操作
        public static readonly MSG_FRIEND_PROPERTY: number = 0xc30080;
        public static readonly MSG_FRIEND_PROPERTY_ACK: number = 0xc30081;

        //添加好友返回被添加人信息
        public static readonly MSG_GAME_GET_FRIEND__ACK: number = 0xc30082;
        //添加好友返回添加人信息
        public static readonly MSG_GAME_ADD_FRIEND__ACK: number = 0xc30083;

        //通知好友在线
        public static readonly MSG_FRIEND_ONLINE_ACK: number = 0xc30084;

        //通知好友更改信息
        public static readonly MSG_FRIEND_REFLESHNFO_ACK: number = 0xc30085;

        //创建vip房间
        public static readonly MSG_GAME_VIP_CREATE_ROOM: number = 0xc30100;
        public static readonly MSG_GAME_SEARCH_VIP_ROOM_ACK: number = 0xc30101;
        public static readonly MSG_GAME_ENTER_VIP_ROOM: number = 0xc30102;

        //修改用户信息返回（result 1,成功；2，昵称已存在；）
        public static readonly MSG_GAME_PLAYER_UPDATE_NICKNAME_ACK: number = 0xc30103;
        //修改用户信息返回（result 1,成功；2，旧密码不正确；）
        public static readonly MSG_GAME_PLAYER_UPDATE_PASSWORD_ACK: number = 0xc30104;
        //修改头像返回
        public static readonly MSG_GAME_PLAYER_UPDATE_LOGO_ACK: number = 0xc30105;

        //修改是否可以加为好友设置返回
        public static readonly MSG_GAME_PLAYER_UPDATE_CANFRIEND_ACK: number = 0xc30106;

        //修改帐号返回（0为失败，1为成功，2为存在,3帐号不在3-12字符）
        public static readonly MSG_GAME_PLAYER_UPDATE_ACCOUNT_ACK: number = 0xc30107;

        //客户端请求刷新商城道具
        public static readonly MSG_GAME_REFRESH_ITEM_BASE: number = 0xc30108;
        public static readonly MSG_GAME_REFRESH_ITEM_BASE_ACK: number = 0xc30109;
        //支付完成刷新道具列表
        public static readonly MSG_GAME_PAY_ITEM_BASE_COMPLETE: number = 0xc30110;

        //内支付完成
        public static readonly MSG_GAME_PAY_ITEM_BASE_IPA_COMPLETE: number = 0xc30111;

        //vip房间结束
        public static readonly MSG_GAME_VIP_ROOM_CLOSE: number = 0xc30200;

        //邀请好友进入VIP房间
        public static readonly MSG_GAME_INVITE_FRIEND_ENTER_VIP_ROOM: number = 0xc30203;
        //被邀请进入VIP房间
        public static readonly MSG_GAME_BE_INVITED_ENTER_VIP_ROOM: number = 0xc30204;

        //帐号在其他地方登录
        public static readonly MSG_GAME_OTHERLOGIN_ACK: number = 0xc30205;

        //测试牌型
        public static readonly MSG_TEST_CARD: number = 0xc30210;
        public static readonly MSG_TEST_CARD_ACK: number = 0xc30211;

        //修改好友备注名称
        public static readonly MSG_UPDATE_FRIEND_REMARK: number = 0xc30220;
        public static readonly MSG_UPDATE_FRIEND_REMARK_ACK: number = 0xc30221;


        /**获取短信验证码*/
        public static readonly MSG_REQUEST_PHONE_NUMBER_CODE: number = 0xc30222;

        /**请求绑定手机号码*/
        public static readonly MSG_REQUEST_COMPLETE_PHONE_NUMBER: number = 0xc30223;
        public static readonly MSG_REQUEST_COMPLETE_PHONE_NUMBER_ACK: number = 0xc30224;

        /**帐号是否已经存在，注册的时候检测用**/
        public static readonly MSG_GAME_IS_ACCOUNT_EXIST: number = 0xc30225;


        public static readonly MSG_GAME_GET_PLAYER_DIAMOND_LOG_ACK: number = 0xc3025a;

        /** 微信语音聊天 */
        public static readonly MSG_WE_CHAT_VOICE: number = 0xc302ff;
        //游戏中聊天
        public static readonly MSG_TALKING_IN_GAME: number = 0xc30300;

        /**获取游戏回放记录***/
        public static readonly MSG_GET_PLAYER_GAME_LOG: number = 0xc30301;

        /** 活动显示 */
        public static readonly MSG_ACTIVITY_SHOW: number = 0xc30304;
        public static readonly MSG_ACTIVITY_SHOW_ACK: number = 0xc30305;
        public static readonly MSG_ACTIVITY_GET_REWARD: number = 0xc30306;
        public static readonly MSG_ACTIVITY_GET_REWARD_ACK: number = 0xc30307;

        /** 代开房信息响应*/
        public static readonly MSG_AGENT_DAIKAI_ACK: number = 0xc30308;
        /** 授权代开房信息响应*/
        public static readonly MSG_AGENT_PLAYER_ACK: number = 0xc30309;
        /**系统消息通知客户端*/
        public static readonly MSG_SYSTEM_NOTIFY_MSG: number = 0xc30500;

        /**获取版本更新信息*/
        public static readonly MSG_GET_PATCH_VESION: number = 0xc30501;
        public static readonly MSG_GET_PATCH_VESION_ACK: number = 0xc30502;

        /**
         * 淮北玩法坐拉跑通知消息
         */
        public static readonly MSG_ZUO_LA_PAO_MSG: number = 0xc30601;

        /**
         * 淮北玩法坐拉跑回复消息
         */
        public static readonly MSG_ZUO_LA_PAO_MSG_ACK: number = 0xc30602;

        /**
         * 砀山玩法，服务器通知客户端下马消息
         */
        public static readonly MSG_XIA_MA_MSG: number = 0xc30603;

        /**
         * 砀山玩法，客户端回复服务器下马消息
         */
        public static readonly MSG_XIA_MA_MSG_ACK: number = 0xc30604;

        /**
         * 砀山玩法，服务器通知客户端玩家下马值的消息
         */
        public static readonly MSG_XIA_MA_VALUE_MSG: number = 0xc30605;

        /**
         * 领取关注微信公众号获取钻石
         */
        public static readonly MSG_WX_GONGZHONGHAO_ACTIVITY: number = 0xc30703;
        public static readonly MSG_WX_GONGZHONGHAO_ACTIVITY_ACK: number = 0xc30704;

        public static readonly MSG_GROUP_GAME_END: number = 0xd40000;

        //修改全局参数到客户端
        public static readonly MSG_GLOBAL_CONFIG_CLIENT: number = 0xd40001;


        ////////////////////////////////////////////////////////////////////////////////////
        ////////////////////////////////////////////////////////////////////////////////////
        ////////////////////////////////////////////////////////////////////////////////////
        ////////////////////////////////////////////////////////////////////////////////////
        //中心服务器相关消息
        public static readonly MSG_GROUP_CENTER_SERVER_START: number = 0xd40000;

        public static readonly MSG_GROUP_CENTER_SERVER_REG_GS: number = 0xd40001;
        public static readonly MSG_GROUP_CENTER_SERVER_REG_GS_ACK: number = 0xd40002;
        public static readonly MSG_GROUP_CENTER_SERVER_GS_UPDATE: number = 0xd40003;

        //客户端向中心服务器请求逻辑服地址
        public static readonly MSG_GROUP_CENTER_SERVER_GET_GAME_SERVER_INFO: number = 0xd40100;
        public static readonly MSG_GROUP_CENTER_SERVER_GET_GAME_SERVER_INFO_ACK: number = 0xd40101;

        //游戏服向中心服请求创建新用户
        public static readonly MSG_GROUP_CENTER_SERVER_CREATE_NEW_PLAYER: number = 0xd40200;
        public static readonly MSG_GROUP_CENTER_SERVER_CREATE_NEW_PLAYER_ACK: number = 0xd40201;
        //
        //游戏服向中心服请求查找用户
        public static readonly MSG_GROUP_CENTER_SERVER_FIND_PLAYER: number = 0xd40202;
        public static readonly MSG_GROUP_CENTER_SERVER_FIND_PLAYER_ACK: number = 0xd40203;

        //游戏中心服请求查找昵称
        public static readonly MSG_GROUP_CENTER_SERVER_FIND_NICKNAME: number = 0xd40204;
        public static readonly MSG_GROUP_CENTER_SERVER_FIND_NICKNAME_ACK: number = 0xd40205;


        public static readonly MSG_GROUP_CENTER_SERVER_END: number = 0xd50000;

        ////////////////////////////////////////////////////////////////////////////////////
        ////////////////////////////////////////////////////////////////////////////////////
        ////////////////////////////////////////////////////////////////////////////////////
        ////////////////////////////////////////////////////////////////////////////////////

        /**
         * 实名认证消息
         */
        public static readonly MSG_REAL_NAME_AUTHENTICATION = 0xc30700;
        public static readonly MSG_REAL_NAME_AUTHENTICATION_ACK = 0xc30701;


        /**创建俱乐部*/
        public static readonly MSG_CREATE_CLUB: number = 0xc30400;
        public static readonly MSG_CREATE_CLUB_ACK: number = 0xc30401;
        public static readonly MSG_SEARCH_CLUB: number = 0xc30402;
        public static readonly MSG_SEARCH_CLUB_ACK: number = 0xc30403;
        public static readonly MSG_APPLY_CLUB: number = 0xc30404;
        public static readonly MSG_APPLY_CLUB_ACK: number = 0xc30405;
        public static readonly MSG_SHOW_APPLY_LIST: number = 0xc30406;
        public static readonly MSG_SHOW_APPLY_LIST_ACK: number = 0xc30407;
        public static readonly MSG_OPT_APPLY_LIST: number = 0xc30408;
        public static readonly MSG_OPT_APPLY_LIST_ACK: number = 0xc30409;
        public static readonly MSG_SHOW_MEMBER_LIST: number = 0xc30410;
        public static readonly MSG_SHOW_MEMBER_LIST_ACK: number = 0xc30411;
        public static readonly MSG_OPT_MEMBER: number = 0xc30412;
        public static readonly MSG_OPT_MEMBER_ACK = 0xc30413;
        public static readonly MSG_SHOW_RANK: number = 0xc30414;
        public static readonly MSG_SHOW_RANK_ACK: number = 0xc30415;
        public static readonly MSG_OPT_DIAMOND: number = 0xc30416;
        public static readonly MSG_OPT_DIAMOND_ACK: number = 0xc30417;
        public static readonly MSG_SET_TABLE_SETTINGS: number = 0xc30418;
        public static readonly MSG_SET_TABLE_SETTINGS_ACK: number = 0xc30419;
        public static readonly MSG_GET_TABLE_SETTINGS: number = 0xc30420;
        public static readonly MSG_GET_TABLE_SETTINGS_ACK: number = 0xc30421;
        public static readonly MSG_CLUB_MODIFY: number = 0xc30422;
        public static readonly MSG_CLUB_MODIFY_ACK: number = 0xc30423;
        public static readonly MSG_CLUB_EXIT: number = 0xc30424;
        public static readonly MSG_CLUB_EXIT_ACK: number = 0xc30425;
        public static readonly MSG_CLUB_DISMISS: number = 0xc30426;
        public static readonly MSG_CLUB_DISMISS_ACK: number = 0xc30427;
        public static readonly MSG_CLUB_LOG: number = 0xc30428;
        public static readonly MSG_CLUB_LOG_ACK: number = 0xc30429;
        public static readonly MSG_CLUB_GET_INFO: number = 0xc30430;
        public static readonly MSG_CLUB_GET_INFO_ACK: number = 0xc30431;

        /**绑定上下级请求*/
        public static readonly MSG_GAME_BIND_AGENT: number = 0xc30618;
        public static readonly MSG_GAME_BIND_AGENT_ACK: number = 0xc30608;

        //代理信息
        public static readonly MSG_AGENT_INFO: number = 0xc30800;
        public static readonly MSG_AGENT_INFO_ACK: number = 0xc30801;
        //代理管理登陆校验
        public static readonly MSG_AGENT_TICKET: number = 0xc30802;
        public static readonly MSG_AGENT_TICKET_ACK: number = 0xc30803;

        //服务器向客户端弹框
        public static readonly MSG_SHOW_TIP_MSG_ACK: number = 0xc30705;

        /** 茶楼排行榜 */
        public static readonly MSG_SHOW_TEAHOUSE_RANKLIST = 0xc30900;
        public static readonly MSG_SHOW_TEAHOUSE_RANKLIST_ACK = 0xc30901;

        /********************************************************************************************************************/
        /*************************** 重构游戏逻辑指令开始 后面5位使用10进制 增加可读性  指令范围（ 0xd50000 - 0xd60000）*****************************/
        /********************************************************************************************************************/

        public static readonly MSG_NEW_GAME_START = 0xd50000;

        /**
         * 创建房间
         */
        public static readonly MSG_CREATE_ROOM = 0xd50001;

        /**
         * 加入VIP房间
         */
        public static readonly MSG_JOIN_VIP_ROOM = 0xd50002;

        /**
         * 进入老的游戏桌子，在断线重连，和在大厅点击开房和加入开房的时候时候，如果玩家有在游戏中则会直接进入游戏
         */
        public static readonly MSG_INTO_OLD_GAME_TABLE = 0xd50003;

        /**
         * 进入游戏桌子
         */
        public static readonly MSG_INTO_GAME_TABLE = 0xd50004;

        /**
         * 新一圈扑克游戏开始
         */
        public static readonly MSG_START_CIRCLE_POKER_GAME = 0xd50005;

        /**
         * 扑克游戏房间结束
         */
        public static readonly MSG_VIP_ROOM_OVER_SETTLE_ACCOUNTS = 0xd50006;

        /**
         * 更新玩家GPS信息
         */
        public static readonly MSG_NEW_UPDATE_PLAYER_GPS_POSITION = 0xd50007;

        /**
         * 更新玩家GPS信息返回
         */
        public static readonly MSG_NEW_UPDATE_PLAYER_GPS_POSITION_ACK = 0xd50009;

        /**
         * 游戏中的聊天
         */
        public static readonly MSG_NEW_TALKING_IN_GAME = 0xd50010;

        /**
         * 游戏中的聊天返回
         */
        public static readonly MSG_NEW_TALKING_IN_GAME_ACK = 0xd50011;

        /**
         * 扑克提示玩家出牌，发给当前操作玩家
         */
        public static readonly MSG_POKER_REMIND_PLAY_CARD_ACK = 0xd50012;

        /**
         * 扑克提示玩家操作返回，发给非操作玩家
         */
        public static readonly MSG_POKER_REMIND_OTHER_PLAYER_OPERATION_ACK = 0xd50013;

        /**
         * 出牌
         */
        public static readonly MSG_PLAY_POKER_CARD_NOTIFY = 0xd50014;

        /**
         * 出牌返回
         */
        public static readonly MSG_PLAY_POKER_CARD_NOTIFY_ACK = 0xd50015;

        /**
         * 不出牌
         */
        public static readonly MSG_NOT_PLAY_POKER_CARD_NOTIFY = 0xd50016;

        /**
         * 不出牌返回
         */
        public static readonly MSG_NOT_PLAY_POKER_CARD_NOTIFY_ACK = 0xd50017;

        /**
         * 扑克游戏结束 展示剩余手牌
         */
        public static readonly MSG_POKER_GAME_OVER_VIEW_HAND_CRADS_ACK = 0xd50018;

        /**
         * 申请解散房间
         */
        public static readonly MSG_APPLY_DISMISS_ROOM = 0xd50019;

        /**
         * 操作其他玩家解散房间申请
         */
        public static readonly MSG_OPER_APPLY_DISMISS_ROOM = 0xd50020;

        /**
         * 玩家解散房间申请返回通知
         */
        public static readonly MSG_APPLY_DISMISS_ROOM_ACK = 0xd50021;

        /** 离开房间 */
        public static readonly MSG_PLAYER_LEAVE_ROOM = 0xd50022;

        /** 离开房间返回 */
        public static readonly MSG_PLAYER_LEAVE_ROOM_ACK = 0xd50023;

        /**
         * 桌子上的玩家状态改变消息通知
         */
        public static readonly MSG_TABLE_PLAYER_INFO_CHANGE_ACK = 0xd50024;

        /** 玩家准备 */
        public static readonly MSG_NEW_GAME_TABLE_PLAYER_READY = 0xd50025;

        /** 新游戏桌子不能离开了的消息，通知客户端 */
        public static readonly NEW_GAME_TABLE_CAN_NOT_LEAVE_ROOM = 0xd50027;

        /** 选择玩家人数模式 */
        public static readonly MSG_NEW_GAME_TABLE_SELECT_PLAYER_NUM_PATTERN = 0xd50029;

        /**
         * 新的进入金币场消息
         */
        public static readonly MSG_NEW_INTO_GOLD_GAME_SCENE = 0xd50030;
        /** 客户端发过来托管消息 */
        public static readonly MSG_NEW_GAME_TABLE_TUO_GUAN = 0xd50031;
        /** 服务器回复托管消息 */
        public static readonly MSG_NEW_GAME_TABLE_TUO_GUAN_ACK = 0xd50032;

        /** 进入后台，从后台回来的消息 */
        public static readonly MSG_PLAYER_CLIENT_INTO_BACKSTAGE = 0xd50035;

        /** poker玩家准备好了的指令 */
        public static readonly MSG_POKER_PLAY_READY_OVER_LOGIC = 0xd50040;

        /** 麻将玩家准备好了的指令 */
        public static readonly MSG_MAHJONG_PLAY_READY_OVER_LOGIC = 0xd50041;
        /** 扑克新一轮的游戏开始 */
        public static readonly MSG_START_CIRCLE_POKER_GAME_LOGIC = 0xd50042;
        /** 扑克新一轮的游戏开始处理结束 */
        public static readonly MSG_START_CIRCLE_POKER_GAME_OVER_LOGIC = 0xd50043;

        /** 出牌结束的服务器逻辑 */
        public static readonly MSG_PLAY_POKER_CARD_OVER_LOGIC = 0xd50050;
        /** 提示玩家出牌的服务端逻辑指令 */
        public static readonly MSG_POKER_REMIND_PLAYCARD_LOGIC = 0xd50051;
        /** 提示玩家出牌的返回消息 */
        public static readonly MSG_POKER_REMIND_PLAYCARD_ACK = 0xd50052;

        /** 扑克刷新上一圈出牌记录*/
	    public static readonly MSG_POKER_REFRESH_HISTORY = 0xd50062;


        /** 新一圈扑克游戏开始 */
        public static readonly MSG_START_CIRCLE_MAHJONG_GAME_ACK = 0xd50101;
        /** 麻将提示玩家操作返回  */
        public static readonly MSG_MAHJONG_REMIND_PLAYER_OPERATION_ACK = 0xd50104;
        /** 麻将摸一张牌  */
        public static readonly MSG_MAHJONG_MO_ONE_CARD_ACK = 0xd50105;
        /** 麻将出牌消息  */
        public static readonly MSG_MAHJONG_PLAY_CARD = 0xd50106;
        /** 麻将出牌消息返回  */
        public static readonly MSG_MAHJONG_PLAY_CARD_ACK = 0xd50107;

        /** 麻将通知玩家选择的消息 */
        public static readonly MSG_MAHJONG_SEND_ITEM_TO_CHOOSE = 0xd50110;
        /** 麻将玩家选择信息 */
        public static readonly MSG_MAHJONG_PLAYER_CHOOSE_ITEM = 0xd50111;
        /** 麻将玩家选择信息返回 */
        public static readonly MSG_MAHJONG_PLAYER_CHOOSE_ITEM_ACK = 0xd50112;
        /** 麻将丢色子消息 */
        public static readonly MSG_MAHJONG_DIU_SHAI_ZI_ACK = 0xd50113;
        /** 刷新当前玩家自己的手牌（不包含吃碰杠的牌）（打牌出错之后使用） */
        public static readonly MSG_MAHJONG_REFRESH_HAND_CARD_ACK = 0xd50115;

        /** 麻将通知玩家操作动作的消息 */
        public static readonly MSG_MAHJONG_ACTION_RESULT_SET_ACK = 0xd50109;
        /** 麻将通知玩家已经听牌的消息 */
        public static readonly MSG_MAHJONG_ALREADY_TING_MSG_ACK = 0xd50150;
        /** 麻将动作选择消息 */
        public static readonly MSG_MAHJONG_ACTION_SELECT = 0xd50151;
        /** 麻将动作选择消息 回复 */
        public static readonly MSG_MAHJONG_ACTION_SELECT_ACK = 0xd50152;
        /** 麻将打开游戏结束界面 */
        public static readonly MSG_MAHJONG_OPEN_GAME_OVER_VIEW_ACK = 0xd50153;
        /** 选择打哪张牌听牌的消息，通知客户端*/
        public static readonly MSG_MAHJONG_SELECT_PLAY_CARD_TING_MSG_ACK = 0xd50156;
        /** 选择打哪张牌听牌的消息，通知客户端*/
        public static readonly MSG_MAHJONG_CHANGE_CARD_DOWN_ACK = 0xd50157;
        /** 麻将游戏结束的消息，通知客户端*/
        public static readonly MSG_MAHJONG_GAME_OVER_ACK = 0xd50158;
        /** 麻将明牌效果返回 */
        public static readonly MSG_MAHJONG_PUBLISH_CARD_ACK = 0xd50159;
        /** 麻将抓鸟消息，通知客户端 */
        public static readonly MSG_MAHJONG_GAME_OVER_ZHUA_NIAO_ACK = 0xd50160;
        /** 取消动作选择 */
        public static readonly MSG_MAHJONG_ACTION_SELECT_CANCEL_ACK = 0xd50161;
        /**从玩家的出牌列表移除某张牌*/
        public static readonly MSG_MAHJONG_REMOVE_CHU_CARD_ACK = 0xd50162;
        /**牌局中更新玩家分数*/
        public static readonly MSG_UPDATE_SCORE_ACK = 0xd50163;
        /** 添加一张牌到出牌列表 */
        public static readonly MSG_MAHJONG_ADD_CHU_CARD_ACK = 0xd50164;

        /** 跑得快游戏结束结算消息 */
        public static readonly MSG_PAODEKUAI_GAME_OVER_SETTLE_ACCOUNTS = 0xd50201;

        /** 长沙显示杠的牌 */
        public static readonly MSG_MAHJONG_CHANG_SHA_VIEW_GANG_CARD_ACK = 0xd50212;

        /** 打开选择动作界面 在杠之后 （其他玩家） */
        public static readonly MSG_MAHJONG_CHANG_SHA_OPEN_SELECT_ACTION_VIEW_AFTER_GANG_ACK = 0xd50214;

        /** 长沙麻将提示是否海底摸一把 */
        public static readonly MSG_MAHJONG_CHANG_SHA_REMINDER_HAI_DI_MO_ACK = 0xd50216;
        /** 长沙麻将确认是否海底摸一把 */
        public static readonly MSG_MAHJONG_CHANG_SHA_CONFIRM_HAI_DI_MO = 0xd50217;

        /** 俱乐部中移除在桌子上的玩家 */
        public static readonly MSG_CLUB_REMOVE_TABLE_PLAYER = 0xd55000;
        /** 俱乐部房间列表中解散俱乐部房间 */
        public static readonly MSG_CLUB_DISSMISS_ROOM = 0xd55001;


        /** 新显示tip消息，可以单独发送，也有可能会附带在其他的返回消息中 */
        public static readonly MSG_SHOW_TIP_MSG_ACK_NEW = 0xd59999;

        public static readonly MSG_NEW_GAME_END = 0xd60000;

        /**------------------------------------------茶楼---------------------------------------- */
        /**大厅显示加入的茶楼列表*/
        public static readonly MSG_SHOW_JOIN_TEAHOUSE_LIST = 0xd58817;
        public static readonly MSG_SHOW_JOIN_TEAHOUSE_LIST_ACK = 0xd58818;

        /** 茶楼创建消息 */
        public static readonly MSG_CREATE_TEAHOUSE = 0xd58801;
        /** 茶楼创建返回消息 */
        public static readonly MSG_CREATE_TEAHOUSE_ACK = 0xd58802;

        /** 加入茶楼消息 */
        public static readonly MSG_APPLY_TEAHOUSE = 0xd58803;
        /** 加入茶楼返回消息 */
        public static readonly MSG_APPLY_TEAHOUSE_ACK = 0xd58804;

        /** 进入茶楼*/
        public static readonly MSG_ACCESS_TEAHOUSE = 0xd58835;
        public static readonly MSG_ACCESS_TEAHOUSE_ACK = 0xd58836;

        /**操作玩家等级/状态（设置小二）消息*/
        public static readonly MSG_OPT_TEAHOUSE_MEMBER = 0xd58811;
        /**操作玩家状态返回消息*/
        public static readonly MSG_OPT_TEAHOUSE_MEMBER_ACK = 0xd58812;

        /** 显示茶楼成员列表消息 */
        public static readonly MSG_TEAHOUSE_SHOW_MEMBER_LIST = 0xd58809;
        /**显示茶楼成员列表返回的消息*/
        public static readonly MSG_TEAHOUSE_SHOW_MEMBER_LIST_ACK = 0xd58810;

        /** 显示申请加入列表消息 */
        public static readonly MSG_TEAHOUSE_SHOW_APPLY_LIST = 0xd58805;
        /** 显示申请加入茶楼列表返回消息 */
        public static readonly MSG_TEAHOUSE_SHOW_APPLY_LIST_ACK = 0xd58806;

        /** 申请加入茶楼操作(同意/拒绝)消息 */
        public static readonly MSG_OPT_TEAHOUSE_APPLY = 0xd58807;
        /** 申请加入茶楼操作(同意/拒绝)返回消息 */
        public static readonly MSG_OPT_TEAHOUSE_APPLY_ACK = 0xd58808;

        /**茶楼基础设置消息*/
        public static readonly MSG_TEAHOUSE_BASIC_SETTING = 0xd58815;
        /**茶楼基础设置返回消息*/
        public static readonly MSG_TEAHOUSE_BASIC_SETTING_ACK = 0xd58816;

        /**茶楼钻石*/
        public static readonly MSG_OPT_TEAHOUSE_DIAMOND = 0xd58840;
        /**茶楼钻石相关返回*/
        public static readonly MSG_OPT_TEAHOUSE_DIAMOND_ACK = 0xd58841;

        /** 操作茶楼布局消息(开启/关闭茶楼，销毁茶楼) */
        public static readonly MSG_OPT_TEAHOUSE_STATE = 0xd58813;
        /** 操作茶楼布局消息(开启/关闭茶楼，销毁茶楼)返回 */
        public static readonly MSG_OPT_TEAHOUSE_STATE_ACK = 0xd58814;

        /**茶楼桌子踢出玩家消息*/
	    public static readonly MSG_TEAHOUSE_REMOVE_PLAYER = 0xd58867;

        /**--------------茶楼战绩相关---------------------- */
        /** 获取我的战绩*/
        public static readonly MSG_GET_TEAHOUSE_MY_RECORD = 0xd58842;
        /** 获取我的战绩返回*/
        public static readonly MSG_GET_TEAHOUSE_MY_RECORD_ACK = 0xd58843;

        /** 获取茶楼战绩*/
        public static readonly MSG_GET_TEAHOUSE_ALL_RECORD = 0xd58844;
        /** 获取茶楼战绩返回*/
        public static readonly MSG_GET_TEAHOUSE_ALL_RECORD_ACK = 0xd58845;


        /**大赢家显示及操作消息*/
        public static readonly MSG_BIG_WINNER_SHOW_AND_OPT = 0xd58860;
        /**大赢家显示及操作返回消息*/
        public static readonly MSG_BIG_WINNER_SHOW_AND_OPT_ACK = 0xd58861;

        /** 获取茶楼经营状况*/
        public static readonly MSG_GET_TEAHOUSE_PERFORMANCE = 0xd58846;
        /** 获取茶楼经营状况返回*/
        public static readonly MSG_GET_TEAHOUSE_PERFORMANCE_ACK = 0xd58847;

        /**战榜消息*/
        public static readonly MSG_SHOW_TEAHOUSE_WARS_LIST = 0xd58862;
        /**战榜返回消息*/
        public static readonly MSG_SHOW_TEAHOUSE_WARS_LIST_ACK = 0xd58863;

        /**退出茶楼*/
        public static readonly MSG_EXIT_TEAHOUSE = 0xd58864;
        /**退出茶楼消息返回*/
        public static readonly MSG_EXIT_TEAHOUSE_ACK = 0xd58865;

        /**茶楼未审核的成员个数返回消息*/
        public static readonly MSG_TEAHOUSE_APPLY_COUNT_ACK = 0xd58866;

        /**--------楼层------- */
        /** 创建楼层消息 */
        public static readonly MSG_CREATE_TEAHOUSE_LAYER = 0xd58820;
        /** 进入楼层消息*/
        public static readonly MSG_ACCESS_TEAHOUSE_LAYER = 0xd58822;
        /** 进入楼层返回消息*/
        public static readonly MSG_ACCESS_TEAHOUSE_LAYER_ACK = 0xd58823;
        /** 解散楼层*/
        public static readonly MSG_DESTROY_TEAHOUSE_LAYER = 0xd58824;
        /** 解散楼层返回*/
        public static readonly MSG_DESTROY_TEAHOUSE_LAYER_ACK = 0xd58829;
        /** 修改楼层，规则*/
        public static readonly MSG_CHANGE_RULE_TEAHOUSE_LAYER = 0xd58825;
        /** 修改楼层，名字公告*/
        public static readonly MSG_CHANGE_NN_TEAHOUSE_LAYER = 0xd58826;
        /** 解散桌子*/
        public static readonly MSG_DESTROY_TEAHOUSE_DESK = 0xd58827;
        /** 解散桌子返回*/
        public static readonly MSG_DESTROY_TEAHOUSE_DESK_ACK = 0xd58831;
        /** 进入桌子*/
        public static readonly MSG_INTO_TEAHOUSE_DESK = 0xd58828;
        /** 获取楼层列表*/
        public static readonly MSG_GET_TEAHOUSE_LAYER_LIST = 0xd58832;
        /** 获取楼层列表返回*/
        public static readonly MSG_GET_TEAHOUSE_LAYER_LIST_ACK = 0xd58833;
        /** 离开楼层*/
        public static readonly MSG_LEAVE_TEAHOUSE_LAYER = 0xd58834;
        /** 更新茶楼桌子*/
        public static readonly MSG_UPDATE_TEAHOUSE_DESK = 0xd58837;
        /** 茶楼管理主动添加茶楼成员*/
        public static readonly MSG_ADD_TEAHOUSE_MEMEBER = 0xd58848;
        /** 茶楼管理主动添加茶楼成员返回*/
        public static readonly MSG_ADD_TEAHOUSE_MEMEBER_ACK = 0xd58849;

        /**可邀请加入游戏成员消息*/
        public static readonly MSG_INVITE_TO_JOIN_GAME_MEMBER_LIST = 0xd58868;
        /**可邀请加入游戏成员列表返回*/
        public static readonly MSG_INVITE_TO_JOIN_GAME_MEMBER_LIST_ACK = 0xd58869;
        /**邀请成员加入游戏消息*/
        public static readonly MSG_INVITE_TO_JOIN_GAME = 0xd58870;
        /**邀请成员加入游戏消息返回*/
        public static readonly MSG_INVITE_TO_JOIN_GAME_ACK = 0xd58871;
        /**邀请成员加入逻辑处理返回*/
        public static readonly MSG_INVITE_TO_JOIN_GAME_LOGIC_ACK = 0xd58872;

        /********************************************************************************************************************/
        /*************************** 重构游戏逻辑指令结束 后面5位使用10进制 增加可读性  指令范围（ 0xd50000 - 0xd60000）*****************************/
        /********************************************************************************************************************/

    }

}